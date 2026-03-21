'use client'

import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { getPayloadSdk } from '@/lib/payload-sdk'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { normalizeFieldErrors } from '@/forms/field-components/normalize-field-errors'

const invalidCredentialsMessage = 'We could not sign you in with that email and password.'
const loginFormSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type LoginFormProps = Omit<React.ComponentProps<'form'>, 'action'> & {
  defaultEmail?: string
  description?: string
  footerText?: React.ReactNode
  forgotPasswordHref?: string
  heading?: string
  initialError?: string
  redirectTo?: string
  submitLabel?: string
}

export function LoginForm({
  className,
  defaultEmail,
  description = 'Enter your email below to login to your account',
  footerText = 'GitHub OAuth is currently disabled. Sign in with your Payload credentials.',
  forgotPasswordHref,
  heading = 'Login to your account',
  initialError,
  onSubmit,
  redirectTo,
  submitLabel = 'Login',
  ...props
}: LoginFormProps) {
  const [authError, setAuthError] = useState(initialError)

  const form = useForm({
    defaultValues: {
      email: defaultEmail ?? '',
      password: '',
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const email = value.email.trim().toLowerCase()
      const password = value.password

      setAuthError(undefined)

      try {
        await getPayloadSdk().login({
          collection: 'users',
          data: {
            email,
            password,
          },
        })

        window.location.assign(redirectTo || '/admin')
      } catch (error) {
        setAuthError(error instanceof Error && error.message ? error.message : invalidCredentialsMessage)
      }
    },
  })

  return (
    <form
      className={cn('flex flex-col gap-8', className)}
      noValidate
      onSubmit={(event) => {
        onSubmit?.(event)

        if (event.defaultPrevented) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          <p className="text-base text-balance text-muted-foreground">{description}</p>
        </div>

        <form.Field
          name="email"
        >
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor="email" className="text-lg font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    setAuthError(undefined)
                    field.handleChange(event.target.value)
                  }}
                  placeholder="m@example.com"
                  className="h-14 rounded-xl px-4 text-lg md:text-lg"
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError className="text-base" errors={normalizedErrors} /> : null}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="password"
        >
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-lg font-medium">
                    Password
                  </FieldLabel>
                  {forgotPasswordHref ? (
                    <Link
                      href={forgotPasswordHref}
                      className="ml-auto text-base text-foreground/80 transition-colors hover:text-foreground"
                    >
                      Forgot your password?
                    </Link>
                  ) : null}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    setAuthError(undefined)
                    field.handleChange(event.target.value)
                  }}
                  className="h-14 rounded-xl px-4 text-lg md:text-lg"
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError className="text-base" errors={normalizedErrors} /> : null}
              </Field>
            )
          }}
        </form.Field>

        <FieldError className="text-base">{authError}</FieldError>

        <Field className="gap-4">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                size="lg"
                className="h-14 w-full text-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : submitLabel}
              </Button>
            )}
          </form.Subscribe>
          {footerText ? (
            <FieldDescription className="text-center text-base">{footerText}</FieldDescription>
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  )
}
