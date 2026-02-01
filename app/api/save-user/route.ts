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

    const { userId, paymentIntentId } = await request.json()
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Tickets table: id, user_id, payment_intent_id, created_at, status, updated_at (no email/name/phone)
    const ticketData: Record<string, unknown> = {
      payment_intent_id: paymentIntentId,
    }
    if (userId) {
      ticketData.user_id = userId
    }

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

    // Update has_ticket in waitlist only when user is from waitlist (optional – don't fail for events/users table)
    if (data && data[0] && userId) {
      const { error: updateError } = await supabase
        .from("waitlist")
        .update({ has_ticket: true })
        .eq("id", userId);

      if (updateError) {
        if (updateError.message?.includes("has_ticket") || updateError.message?.includes("column")) {
          console.warn("has_ticket column not found in waitlist table.");
        } else if (updateError.code !== "PGRST116") {
          console.warn("Waitlist update skipped (user may be from users table):", updateError.message);
        }
      }
    }

    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Save user error:', error)
    return NextResponse.json(
      { error: errorMessage || 'Failed to save user' },
      { status: 500 }
    )
  }
}

