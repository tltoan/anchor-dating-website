import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase(useServiceRole = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !key) return null
  return createClient(supabaseUrl, key)
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    // Same as scan flow: prefer auth_user_id (Supabase Auth id), then profile id
    const authUserId = request.headers.get('x-auth-user-id')?.trim() || null
    const profileId = request.headers.get('x-user-id')?.trim() || null
    const userId = authUserId || profileId || null
    let isAdmin = false
    let user: { id: string; name: string | null; email: string | null; phone: string | null; is_admin: boolean } | null = null
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
      let userRow: { id: string; first_name: string | null; last_name: string | null; email: string | null; phone_number: string | null; is_admin: boolean } | null = null
      if (authUserId) {
        const { data: byAuthId } = await admin
          .from('users')
          .select('id, first_name, last_name, email, phone_number, is_admin')
          .eq('auth_user_id', authUserId)
          .maybeSingle()
        userRow = byAuthId ?? null
      }
      if (!userRow && profileId) {
        const { data: byId } = await admin
          .from('users')
          .select('id, first_name, last_name, email, phone_number, is_admin')
          .eq('id', profileId)
          .maybeSingle()
        userRow = byId ?? null
      }
      if (userRow) {
        isAdmin = Boolean(userRow.is_admin)
        const name = [userRow.first_name, userRow.last_name].filter(Boolean).join(' ').trim() || null
        user = {
          id: userRow.id,
          name,
          email: userRow.email ?? null,
          phone: userRow.phone_number ?? null,
          is_admin: isAdmin,
        }
      }
    }

    const mine = request.nextUrl.searchParams.get('mine') === '1'
    let query = supabase.from('events').select('*').order('date', { ascending: true })
    if (mine && isAdmin && user) {
      query = query.eq('created_by', user.id)
    }
    const { data: events, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          events: [],
          ...(user ? { user, is_admin: user.is_admin } : {}),
        })
      }
      return NextResponse.json(
        { error: 'Failed to fetch events', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      ...(user ? { user, is_admin: user.is_admin } : {}),
    })
  } catch (error: unknown) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUserId = request.headers.get('x-auth-user-id')?.trim() || null
    const profileId = request.headers.get('x-user-id')?.trim() || null
    if (!authUserId && !profileId) {
      return NextResponse.json({ error: 'Unauthorized. Log in to add events.' }, { status: 401 })
    }

    const supabase = getSupabase(true)
    if (!supabase) {
      return NextResponse.json(
        {
          error: 'Supabase credentials not configured',
          details: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase Dashboard → Project Settings → API → service_role secret)',
        },
        { status: 500 }
      )
    }

    const postAuthUserId = request.headers.get('x-auth-user-id')?.trim() || null
    const postProfileId = request.headers.get('x-user-id')?.trim() || null
    let profileRow: { id: string; is_admin: boolean } | null = null
    if (postAuthUserId) {
      const { data } = await supabase
        .from('users')
        .select('id, is_admin')
        .eq('auth_user_id', postAuthUserId)
        .maybeSingle()
      profileRow = data ?? null
    }
    if (!profileRow && postProfileId) {
      const { data } = await supabase
        .from('users')
        .select('id, is_admin')
        .eq('id', postProfileId)
        .maybeSingle()
      profileRow = data ?? null
    }
    if (!profileRow?.is_admin) {
      return NextResponse.json({ error: 'Admin access required to add events.' }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const b = body as Record<string, unknown>
    const title = b?.title != null ? String(b.title).trim() : ''
    const date = b?.date != null ? new Date(b.date as string | number).toISOString() : null
    const location = b?.location != null ? String(b.location).trim() : ''
    const priceNum = Number(b?.price)
    if (!title || !date || !location || Number.isNaN(priceNum)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields: title, date, location, price are required.' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description: b?.description != null ? String(b.description).trim() || null : null,
        date,
        location,
        image_url: b?.image_url != null ? String(b.image_url).trim() || null : null,
        price: priceNum,
        created_by: profileRow.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Create event error:', error)
      return NextResponse.json(
        { error: 'Failed to create event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, event })
  } catch (error: unknown) {
    console.error('POST events error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create event' },
      { status: 500 }
    )
  }
}
