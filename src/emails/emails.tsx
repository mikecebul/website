import { Button, Section, Text } from '@react-email/components'

import EmailShell from './components/EmailShell'
import { emailTheme } from './components/theme'

export default function Email() {
  return (
    <EmailShell preview="MIKECEBUL Admin email theme preview">
      <Text
        style={{
          color: emailTheme.heading,
          fontSize: '28px',
          fontWeight: 700,
          lineHeight: 1.15,
          margin: '0 0 12px',
        }}
      >
        MIKECEBUL Admin
      </Text>
      <Text
        style={{
          color: emailTheme.copy,
          fontSize: '16px',
          lineHeight: 1.65,
          margin: '0 0 24px',
        }}
      >
        A clean, light-mode email theme that matches the admin screens.
      </Text>
      <Section>
        <Button
          href="https://example.com"
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
          Sample action
        </Button>
      </Section>
    </EmailShell>
  )
}
