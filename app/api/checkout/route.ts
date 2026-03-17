import { NextRequest, NextResponse } from 'next/server'
import { stripe, LISTING_PRICES, type ListingTier } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tier, jobData } = body as {
      tier: ListingTier
      jobData: {
        title: string
        companyName: string
        contactEmail: string
      }
    }

    const price = LISTING_PRICES[tier]
    if (!price) {
      return NextResponse.json({ error: 'Invalid listing tier' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: jobData.contactEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: price.name,
              description: price.description,
              images: [`${origin}/logos/og.png`],
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tier,
        jobTitle: jobData.title,
        companyName: jobData.companyName,
      },
      success_url: `${origin}/post-job/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/post-job`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
