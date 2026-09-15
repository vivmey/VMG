/**
 * Newsletter API — pass-through Resend
 * Si RESEND_API_KEY n'est pas défini : retourne 503 Service Unavailable.
 */

import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { success: false, message: 'Newsletter not configured' },
      { status: 503 },
    )
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 })
  }

  // Resend Audience contacts API
  // https://resend.com/docs/api-reference/contacts/create-contact
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  })

  if (res.status === 422) {
    // duplicate (Resend returns 422 unprocessable when contact exists)
    return NextResponse.json({ success: false, message: 'already_subscribed' }, { status: 409 })
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return NextResponse.json(
      { success: false, message: 'Provider error', detail: text.slice(0, 200) },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true })
}
