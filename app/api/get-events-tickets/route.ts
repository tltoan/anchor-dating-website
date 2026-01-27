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

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get user from events_website_users table
    const { data: user, error: userError } = await supabase
      .from('events_website_users')
      .select('id, email, name')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get tickets by email (tickets table has email column)
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .order('created_at', { ascending: false })

    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError)
      // If tickets table doesn't exist, return empty array
      if (ticketsError.code === '42P01' || ticketsError.message?.includes('does not exist')) {
        return NextResponse.json({ success: true, tickets: [], user })
      }
      return NextResponse.json(
        { error: 'Failed to fetch tickets', details: ticketsError.message },
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
