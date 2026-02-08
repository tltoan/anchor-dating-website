import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { email, user_id: userId, access_token: accessToken, event_id: eventId } = body

    if (!email && !userId && !accessToken) {
      return NextResponse.json(
        { error: 'Email, user_id, or access_token is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    let user: { id: string; email: string | null; name: string | null } | null = null

    // Prefer session: use access_token so RLS allows reading own profile
    if (accessToken) {
      const authClient = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      })
      const { data: { user: authUser } } = await authClient.auth.getUser()
      if (authUser?.id) {
        const { data: p, error: profileError } = await authClient
          .from('users')
          .select('id, email, first_name, last_name')
          .eq('auth_user_id', authUser.id)
          .single()
        if (!profileError && p) {
          const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || null
          user = { id: p.id, email: p.email ?? null, name }
        }
      }
    }
    if (!user && userId) {
      const { data: p, error: profileError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .eq('id', userId)
        .single()
      if (!profileError && p) {
        const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || null
        user = { id: p.id, email: p.email ?? null, name }
      }
      if (!user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const admin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
        const { data: pAdmin } = await admin
          .from('users')
          .select('id, email, first_name, last_name')
          .eq('id', userId)
          .maybeSingle()
        if (pAdmin) {
          const name = [pAdmin.first_name, pAdmin.last_name].filter(Boolean).join(' ').trim() || null
          user = { id: pAdmin.id, email: pAdmin.email ?? null, name }
        }
      }
    }
    if (!user && email) {
      const { data: p } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle()
      if (p) {
        const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || null
        user = { id: p.id, email: p.email ?? null, name }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get tickets by user_id (and optionally event_id so only tickets for this event are shown)
    let tickets: unknown[] = []
    let query = supabase
      .from('tickets')
      .select('id, user_id, payment_intent_id, event_id, created_at, status, updated_at')
      .eq('user_id', user.id)
    if (eventId) {
      query = query.eq('event_id', eventId)
    }
    const { data: byUserId, error: byUserIdError } = await query
      .order('created_at', { ascending: false })

    if (!byUserIdError && byUserId?.length) {
      tickets = byUserId
    }

    if (byUserIdError && byUserIdError.code !== '42P01' && !byUserIdError.message?.includes('does not exist')) {
      console.error('Error fetching tickets:', byUserIdError)
      return NextResponse.json(
        { error: 'Failed to fetch tickets', details: byUserIdError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
      user
    })
  } catch (error) {
    console.error('Get events tickets error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tickets'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
