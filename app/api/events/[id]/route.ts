import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !key) return null
  return createClient(supabaseUrl, key)
}

type ProfileRow = { id: string; is_admin: boolean }

async function resolveProfileId(
  request: NextRequest,
  supabase: ReturnType<typeof getSupabase>
): Promise<ProfileRow | null> {
  if (!supabase) return null
  const authUserId = request.headers.get('x-auth-user-id')?.trim() || null
  const profileId = request.headers.get('x-user-id')?.trim() || null
  if (authUserId) {
    const { data } = await supabase
      .from('users')
      .select('id, is_admin')
      .eq('auth_user_id', authUserId)
      .maybeSingle()
    if (data) return data as ProfileRow
  }
  if (profileId) {
    const { data } = await supabase
      .from('users')
      .select('id, is_admin')
      .eq('id', profileId)
      .maybeSingle()
    if (data) return data as ProfileRow
  }
  return null
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const profile = await resolveProfileId(request, supabase)
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
    if (!profile.is_admin) {
      return NextResponse.json({ error: 'Admin access required to edit events.' }, { status: 403 })
    }

    const { id } = await params
    const { data: existing } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', id)
      .maybeSingle()
    if (!existing) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }
    if (existing.created_by !== profile.id) {
      return NextResponse.json({ error: 'You can only edit your own events.' }, { status: 403 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}
    if (body.title !== undefined) updates.title = String(body.title).trim()
    if (body.description !== undefined) updates.description = body.description == null ? null : String(body.description).trim()
    if (body.date !== undefined) updates.date = new Date(body.date).toISOString()
    if (body.location !== undefined) updates.location = String(body.location).trim()
    if (body.image_url !== undefined) updates.image_url = body.image_url == null ? null : String(body.image_url).trim()
    if (typeof body.price === 'number') updates.price = body.price
    updates.updated_at = new Date().toISOString()

    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update event error:', error)
      return NextResponse.json(
        { error: 'Failed to update event', details: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true, event })
  } catch (error: unknown) {
    console.error('PATCH event error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const profile = await resolveProfileId(request, supabase)
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
    if (!profile.is_admin) {
      return NextResponse.json({ error: 'Admin access required to delete events.' }, { status: 403 })
    }

    const { id } = await params
    const { data: existing } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', id)
      .maybeSingle()
    if (!existing) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }
    if (existing.created_by !== profile.id) {
      return NextResponse.json({ error: 'You can only delete your own events.' }, { status: 403 })
    }

    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      console.error('Delete event error:', error)
      return NextResponse.json(
        { error: 'Failed to delete event', details: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('DELETE event error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete event' },
      { status: 500 }
    )
  }
}
