import React from 'react'
import { render } from 'react-email'
import { describe, expect, it } from 'vitest'
import ContactEmail from './ContactEmail'
import ForgotPasswordEmail from './ForgotPasswordEmail'

describe('React Email runtime rendering', () => {
  it('renders contact details while escaping visitor-provided markup', async () => {
    const html = await render(
      <ContactEmail
        name="Local Client"
        replyTo="client@example.test"
        phone="(231) 555-0123"
        inquiryType="Website"
        message={'Please help with <script>alert(1)</script>'}
      />,
    )
    expect(html).toContain('Local Client')
    expect(html).toContain('mailto:client@example.test')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('renders the reset link with the unified package exports', async () => {
    const html = await render(
      <ForgotPasswordEmail
        resetURL="https://example.test/reset-password?token=fixture-token"
        userEmail="admin@example.test"
      />,
    )
    expect(html).toContain('Reset your password')
    expect(html).toContain('href="https://example.test/reset-password?token=fixture-token"')
    expect(html).toContain('admin@example.test')
  })
})
