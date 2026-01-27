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
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('events_website_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user:', checkError)
      return NextResponse.json(
        { error: 'Failed to check user', details: checkError.message },
        { status: 500 }
      )
    }

    // If user exists, return user data
    if (existingUser) {
      return NextResponse.json({
        success: true,
        user: existingUser,
        isNewUser: false
      })
    }

    // If user doesn't exist, create new user
    const { data: newUser, error: insertError } = await supabase
      .from('events_website_users')
      .insert({
        email: email.toLowerCase().trim(),
        name: name || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      return NextResponse.json(
        { error: 'Failed to create user', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      isNewUser: true
    })
  } catch (error) {
    console.error('Events auth error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
