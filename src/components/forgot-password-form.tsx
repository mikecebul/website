'use client'

import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { normalizeFieldErrors } from '@/forms/field-components/normalize-field-errors'
import { cn } from '@/lib/utils'
import { getPayloadSdk } from '@/lib/payload-sdk'

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
})

type ForgotPasswordFormProps = Omit<React.ComponentProps<'form'>, 'action'> & {
  description?: string
  heading?: string
  initialError?: string
  loginHref?: string
  submitLabel?: string
}

const getErrorMessage = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (value && typeof value === 'object') {
    if ('message' in value) {
      return getErrorMessage((value as { message?: unknown }).message)
    }

    if ('errors' in value && Array.isArray((value as { errors?: unknown[] }).errors)) {
      for (const error of (value as { errors: unknown[] }).errors) {
        const message = getErrorMessage(error)
        if (message) return message
      }
    }
  }

  return undefined
}

export function ForgotPasswordForm({
  className,
  description = 'Please enter your email below. You will receive an email message with instructions on how to reset your password.',
  heading = 'Forgot Password',
  initialError,
  loginHref,
  onSubmit,
  submitLabel = 'Submit',
  ...props
}: ForgotPasswordFormProps) {
  const [authError, setAuthError] = useState(initialError)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(undefined)

      const response = await getPayloadSdk().forgotPassword({
        collection: 'users',
        data: {
          email: value.email.trim().toLowerCase(),
        },
      })

      if (!response?.message) {
        throw new Error('We could not send the password reset email. Please try again.')
      }

      setHasSubmitted(true)
    },
    onSubmitInvalid: () => {
      setAuthError(undefined)
    },
  })

  if (hasSubmitted) {
    return (
      <div className={cn('flex flex-col gap-8', className)}>
        <FieldGroup>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
            <p className="text-base text-balance text-muted-foreground">
              Check your email for the reset instructions.
            </p>
          </div>
          <FieldDescription className="text-base">
            {loginHref ? (
              <a href={loginHref} className="font-medium text-foreground transition-colors hover:opacity-80">
                Back to login
              </a>
            ) : null}
          </FieldDescription>
        </FieldGroup>
      </div>
    )
  }

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
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          <p className="text-base text-balance text-muted-foreground">{description}</p>
        </div>

        <form.Field name="email">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="email" className="text-lg font-medium">
                    Email
                  </FieldLabel>
                  <span className="ml-1 text-lg font-medium">*</span>
                </div>
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
                {isSubmitting ? 'Submitting...' : submitLabel}
              </Button>
            )}
          </form.Subscribe>
          {loginHref ? (
            <FieldDescription className="text-center text-base">
              <a href={loginHref} className="font-medium text-foreground transition-colors hover:opacity-80">
                Back to login
              </a>
            </FieldDescription>
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  )
}
