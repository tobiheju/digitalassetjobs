import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Newsletter service unavailable' }, { status: 503 })
    }

    // Add contact to Resend audience
    const audienceRes = await fetch('https://api.resend.com/audiences', {
      method: 'GET',
      headers: { Authorization: `Bearer ${resendKey}` },
    })
    const audiences = await audienceRes.json()
    const audienceId = audiences?.data?.[0]?.id

    if (audienceId) {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      })
    }

    // Send welcome email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Digital Asset Jobs <newsletter@digitalassetjobs.com>',
        to: email,
        subject: 'Welcome to the Digital Asset Jobs newsletter',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
            <p style="color: #1a365d; font-size: 18px; font-weight: 500; margin: 0 0 16px;">Welcome to Digital Asset Jobs</p>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              You'll receive weekly insights on the digital asset job market — new roles, salary trends, and career advice for professionals moving between TradFi and crypto.
            </p>
            <a href="https://digitalassetjobs.com/jobs" style="display: inline-block; background: #d4a038; color: white; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
              Browse open roles
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin: 32px 0 0;">
              You can unsubscribe at any time by replying to any email.
            </p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter signup error:', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
