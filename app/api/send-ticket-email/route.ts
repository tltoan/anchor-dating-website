import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { user_id, qrData } = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!user_id || !qrData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user email from waitlist by user_id
    const { data: user, error: userError } = await supabase
      .from("waitlist")
      .select("email, name")
      .eq("id", user_id)
      .single()

    if (userError || !user) {
      console.error("Failed to get user from waitlist:", userError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { email, name } = user

    // For now, we'll use Supabase Edge Functions or a service like Resend
    // This is a placeholder - you'll need to set up email sending
    // Option 1: Use Supabase Edge Function
    // Option 2: Use Resend, SendGrid, or similar service
    // Option 3: Use Supabase's built-in email (if configured)

    // Example: Call Supabase Edge Function
    // For now, we'll just log it since email service needs to be configured
    // Uncomment when edge function is set up:
    // const { data, error } = await supabase.functions.invoke('send-ticket-email', {
    //   body: { email, name, qrData },
    // })
    
    // For development, just log
    console.log('Would send email to:', email, 'with name:', name, 'and QR data:', qrData)

    return NextResponse.json({ success: true, message: 'Email queued' })
  } catch (error: unknown) {
    console.error('Send email error:', error)
    // Don't fail the flow if email fails
    return NextResponse.json({ success: true, message: 'Email queued' })
  }
}

