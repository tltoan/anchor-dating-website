import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    
    const { amount, formData } = await request.json()

    if (!amount || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create payment intent - card payments only
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: unknown) {
    console.error('Stripe error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create payment intent'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

