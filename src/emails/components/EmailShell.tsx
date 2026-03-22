import type { ReactNode } from 'react'
import { Body, Container, Head, Html, Preview, Section } from '@react-email/components'

import { emailFontFamily, emailTheme } from './theme'

type EmailShellProps = {
  children: ReactNode
  preview: string
}

export default function EmailShell({ children, preview }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: emailTheme.background,
          color: emailTheme.text,
          fontFamily: emailFontFamily,
          margin: 0,
          padding: '32px 16px',
        }}
      >
        <Container
          style={{
            backgroundColor: emailTheme.panel,
            border: `1px solid ${emailTheme.border}`,
            borderRadius: '24px',
            boxShadow: emailTheme.panelShadow,
            margin: '0 auto',
            maxWidth: '640px',
            overflow: 'hidden',
          }}
        >
          <Section
            style={{
              background:
                'linear-gradient(90deg, #f5b400 0%, #f5b400 50%, #f0e6d2 50%, #f0e6d2 100%)',
              height: '8px',
            }}
          />
          <Section style={{ padding: '32px' }}>
            <div
              style={{
                color: emailTheme.siteName,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}
            >
              MIKECEBUL Admin
            </div>
            {children}
          </Section>
        </Container>
      </Body>
      <Preview>{preview}</Preview>
    </Html>
  )
}
