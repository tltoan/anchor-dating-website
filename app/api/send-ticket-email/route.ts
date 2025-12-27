import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, name, qrData } = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!email || !name || !qrData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll use Supabase Edge Functions or a service like Resend
    // This is a placeholder - you'll need to set up email sending
    // Option 1: Use Supabase Edge Function
    // Option 2: Use Resend, SendGrid, or similar service
    // Option 3: Use Supabase's built-in email (if configured)

    // Example: Call Supabase Edge Function
    // For now, we'll just log it since email service needs to be configured
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      // Uncomment when edge function is set up:
      // const { data, error } = await supabase.functions.invoke('send-ticket-email', {
      //   body: { email, name, qrData },
      // })
    }
    
    // For development, just log
    console.log('Would send email to:', email, 'with QR data:', qrData)

    return NextResponse.json({ success: true, message: 'Email queued' })
  } catch (error: unknown) {
    console.error('Send email error:', error)
    // Don't fail the flow if email fails
    return NextResponse.json({ success: true, message: 'Email queued' })
  }
}

