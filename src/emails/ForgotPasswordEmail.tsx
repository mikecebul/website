import { Button, Hr, Link, Section, Text } from '@react-email/components'

import EmailShell from './components/EmailShell'
import { emailTheme } from './components/theme'

type ForgotPasswordEmailProps = {
  resetURL: string
  siteName?: string
  userEmail?: string
}

export default function ForgotPasswordEmail({
  resetURL,
  siteName = 'MIKECEBUL Admin',
  userEmail,
}: ForgotPasswordEmailProps) {
  return (
    <EmailShell
      preview={`Reset your password${userEmail ? ` for ${userEmail}` : ''}`}
    >
      <Text
        style={{
          color: emailTheme.heading,
          fontSize: '30px',
          fontWeight: 700,
          lineHeight: 1.1,
          margin: '0 0 16px',
        }}
      >
        Reset your password
      </Text>
      <Text
        style={{
          color: emailTheme.copy,
          fontSize: '16px',
          lineHeight: 1.65,
          margin: '0 0 20px',
        }}
      >
        {userEmail
          ? `We received a request to reset the password for ${userEmail}.`
          : 'We received a request to reset the password for your account.'}
      </Text>
      <Text
        style={{
          color: emailTheme.copy,
          fontSize: '16px',
          lineHeight: 1.65,
          margin: '0 0 24px',
        }}
      >
        Click the button below to choose a new password. If the button does not work, paste the
        link into your browser.
      </Text>
      <Section style={{ marginBottom: '28px' }}>
        <Button
          href={resetURL}
          style={{
            backgroundColor: emailTheme.accent,
            borderRadius: '14px',
            color: '#2f2300',
            display: 'inline-block',
            fontSize: '16px',
            fontWeight: 700,
            padding: '14px 22px',
            textDecoration: 'none',
          }}
        >
          Reset password
        </Button>
      </Section>
      <Hr style={{ borderColor: emailTheme.border, margin: '0 0 20px' }} />
      <Text
        style={{
          color: '#667085',
          fontSize: '13px',
          lineHeight: 1.6,
          margin: '0 0 8px',
        }}
      >
        Reset link:
      </Text>
      <Text
        style={{
          color: '#667085',
          fontSize: '13px',
          lineHeight: 1.6,
          margin: 0,
          wordBreak: 'break-word',
        }}
      >
        <Link href={resetURL} style={{ color: emailTheme.siteName }}>
          {resetURL}
        </Link>
      </Text>
      <Text
        style={{
          color: '#667085',
          fontSize: '13px',
          lineHeight: 1.6,
          margin: '16px 0 0',
        }}
      >
        If you did not request this email, you can safely ignore it and your password will remain
        unchanged.
      </Text>
    </EmailShell>
  )
}
