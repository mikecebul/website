import { Hr, Link, Section, Text } from '@react-email/components'

import EmailShell from './components/EmailShell'
import { emailTheme } from './components/theme'

type ContactEmailProps = {
  inquiryType: string
  message: string
  name: string
  phone: string
  replyTo: string
}

const lineStyle = {
  color: emailTheme.copy,
  fontSize: '15px',
  lineHeight: 1.6,
  margin: '0 0 12px',
} as const

export default function ContactEmail({
  inquiryType,
  message,
  name,
  phone,
  replyTo,
}: ContactEmailProps) {
  return (
    <EmailShell preview={`New contact inquiry from ${name}`}>
      <Text
        style={{
          color: emailTheme.heading,
          fontSize: '28px',
          fontWeight: 700,
          lineHeight: 1.15,
          margin: '0 0 16px',
        }}
      >
        New contact inquiry
      </Text>
      <Text style={lineStyle}>
        Someone reached out through the website and left the details below.
      </Text>
      <Hr style={{ borderColor: emailTheme.border, margin: '20px 0' }} />
      <Section>
        <Text style={lineStyle}>
          <strong style={{ color: emailTheme.siteName }}>Name:</strong> {name}
        </Text>
        <Text style={lineStyle}>
          <strong style={{ color: emailTheme.siteName }}>Email:</strong>{' '}
          <Link href={`mailto:${replyTo}`} style={{ color: emailTheme.siteName }}>
            {replyTo}
          </Link>
        </Text>
        <Text style={lineStyle}>
          <strong style={{ color: emailTheme.siteName }}>Phone:</strong> {phone}
        </Text>
        <Text style={lineStyle}>
          <strong style={{ color: emailTheme.siteName }}>Inquiry type:</strong> {inquiryType}
        </Text>
      </Section>
      <Section
        style={{
          backgroundColor: '#fbf8f1',
          border: `1px solid ${emailTheme.border}`,
          borderRadius: '16px',
          marginTop: '8px',
          padding: '18px',
        }}
      >
        <Text
          style={{
            color: emailTheme.siteName,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            margin: '0 0 8px',
            textTransform: 'uppercase',
          }}
        >
          Message
        </Text>
        <Text
          style={{
            color: emailTheme.copy,
            fontSize: '15px',
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </Text>
      </Section>
      <Text
        style={{
          color: '#667085',
          fontSize: '13px',
          lineHeight: 1.6,
          margin: '20px 0 0',
        }}
      >
        Reply directly to {name} at{' '}
        <Link href={`mailto:${replyTo}`} style={{ color: emailTheme.siteName }}>
          {replyTo}
        </Link>
        .
      </Text>
    </EmailShell>
  )
}
