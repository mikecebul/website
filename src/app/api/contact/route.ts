import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import { contactFormSchema } from '@/lib/contact'
import { websiteContent } from '@/lib/website-content'

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export async function POST(request: Request) {
  let payload: Awaited<ReturnType<typeof getPayload>> | undefined

  try {
    const json = await request.json()
    const data = contactFormSchema.parse(json)
    payload = await getPayload({ config: configPromise })
    const to = process.env.CONTACT_TO_EMAIL

    if (!to) {
      payload.logger.error('Missing CONTACT_TO_EMAIL for contact submission delivery.')
      return NextResponse.json(
        { error: 'Contact email delivery is not configured yet.' },
        { status: 500 },
      )
    }

    if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) {
      payload.logger.error('Missing RESEND_API_KEY for production contact submission delivery.')
      return NextResponse.json(
        { error: 'Contact email delivery is not configured yet.' },
        { status: 500 },
      )
    }

    await payload.create({
      collection: 'contacts',
      data,
      overrideAccess: true,
    })

    const subject = `New contact inquiry: ${data.inquiryType} from ${data.name}`
    const companyName = websiteContent.site.name
    const html = `
      <div style="background:#0c1221;padding:24px 12px;font-family:Arial,sans-serif;color:#f5f7fb;">
        <div style="max-width:640px;margin:0 auto;background:#131b2e;border:1px solid #22304f;border-radius:18px;padding:28px;">
          <h1 style="font-size:24px;line-height:1.3;margin:0 0 20px;">New Contact Form Submission</h1>
          <p style="margin:0 0 12px;"><strong style="color:#c7a157;">Name:</strong> ${escapeHtml(data.name)}</p>
          <p style="margin:0 0 12px;"><strong style="color:#c7a157;">Email:</strong> ${escapeHtml(data.email)}</p>
          <p style="margin:0 0 12px;"><strong style="color:#c7a157;">Phone:</strong> ${escapeHtml(data.phone)}</p>
          <p style="margin:0 0 12px;"><strong style="color:#c7a157;">Inquiry Type:</strong> ${escapeHtml(data.inquiryType)}</p>
          <p style="margin:20px 0 8px;"><strong style="color:#c7a157;">Message:</strong></p>
          <p style="white-space:pre-line;margin:0;">${escapeHtml(data.message)}</p>
        </div>
      </div>
    `

    await payload.sendEmail({
      from: payload.email.defaultFromAddress || `website@${request.headers.get('host') || 'localhost'}`,
      html,
      replyTo: data.email,
      subject,
      text: [
        `${companyName} contact form submission`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Inquiry Type: ${data.inquiryType}`,
        '',
        data.message,
      ].join('\n'),
      to,
    })

    return NextResponse.json({
      message: 'Thanks for reaching out. Your inquiry was sent successfully.',
    })
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Please check the form fields and try again.' }, { status: 400 })
    }

    payload?.logger.error({
      err: error,
      msg: 'Contact form submission failed.',
    })

    return NextResponse.json(
      { error: 'We could not send your inquiry right now. Please try again shortly.' },
      { status: 500 },
    )
  }
}
