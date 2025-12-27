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
    
    const { name, email, phone, paymentIntentId } = await request.json()

    if (!name || !email || !phone || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a NEW ticket entry in the tickets table
    // This allows multiple tickets per user
    const ticketData = {
      name,
      email,
      phone,
      payment_intent_id: paymentIntentId,
      ticket_purchased_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      
      // If error is unique constraint on payment_intent_id (shouldn't happen, but handle it)
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return NextResponse.json(
          { 
            error: 'This payment has already been processed.',
            code: error.code,
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to save ticket', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Save user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save user' },
      { status: 500 }
    )
  }
}

