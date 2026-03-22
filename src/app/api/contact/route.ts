import { NextResponse } from 'next/server'
import React from 'react'
import { getPayload } from 'payload'
import { render } from '@react-email/components'

import configPromise from '@payload-config'
import { contactFormSchema } from '@/lib/contact'
import { websiteContent } from '@/lib/website-content'
import ContactEmail from '@/emails/ContactEmail'

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
    const html = await render(
      React.createElement(ContactEmail, {
        inquiryType: data.inquiryType,
        message: data.message,
        name: data.name,
        phone: data.phone,
        replyTo: data.email,
      }),
    )

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
