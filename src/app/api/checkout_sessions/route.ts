import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'
import { getSession } from '@/lib/session'

export async function POST() {
  try {
    // Guard: only authenticated vendors can create a checkout session
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'vendor') {
      return NextResponse.json({ error: 'Only vendors can subscribe to Premium.' }, { status: 403 })
    }

    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session for Vendor Premium Plan (one-time payment ৳499)
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'bdt',
            product_data: {
              name: 'PizzaHub Vendor Premium Plan',
              description:
                'Unlimited active menu items, priority admin review, and verified premium restaurant badge.',
            },
            unit_amount: 49900, // ৳499.00 in poisha
          },
          quantity: 1,
        },
      ],
      metadata: {
        vendorId: session.user.id,
        vendorName: session.user.name || '',
        vendorEmail: session.user.email || '',
        plan: 'Premium',
      },
      success_url: `${origin}/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/vendor/subscription/cancel`,
    })

    if (!checkoutSession.url) {
      throw new Error('Stripe did not return a checkout session URL')
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    const statusCode =
      typeof err === 'object' &&
        err !== null &&
        'statusCode' in err &&
        typeof err.statusCode === 'number'
        ? err.statusCode
        : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}