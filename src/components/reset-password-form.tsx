'use client'

import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { normalizeFieldErrors } from '@/forms/field-components/normalize-field-errors'
import { cn } from '@/lib/utils'
import { getPayloadSdk } from '@/lib/payload-sdk'

const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type ResetPasswordFormProps = Omit<React.ComponentProps<'form'>, 'action'> & {
  loginHref?: string
  successHref?: string
  token: string
}

const genericResetPasswordError =
  'We could not reset your password. Please review the form and try again.'

const getErrorMessage = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (value && typeof value === 'object') {
    if ('message' in value) {
      const message = getErrorMessage((value as { message?: unknown }).message)
      if (message) {
        return message
      }
    }

    if ('errors' in value && Array.isArray((value as { errors?: unknown[] }).errors)) {
      for (const error of (value as { errors: unknown[] }).errors) {
        const message = getErrorMessage(error)
        if (message) {
          return message
        }
      }
    }

    if ('data' in value) {
      return getErrorMessage((value as { data?: unknown }).data)
    }
  }

  return undefined
}

export function ResetPasswordForm({
  className,
  loginHref,
  onSubmit,
  successHref = '/admin',
  token,
  ...props
}: ResetPasswordFormProps) {
  const [authError, setAuthError] = useState<string | undefined>()

  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(undefined)

      await getPayloadSdk().resetPassword({
        collection: 'users',
        data: {
          password: value.password,
          token,
        },
      })

      window.location.assign(successHref)
    },
    onSubmitInvalid: () => {
      setAuthError(undefined)
    },
    onSubmitMeta: {
      onError: ({ errorMap }) => {
        const formError = getErrorMessage(errorMap.onSubmit)
        setAuthError(formError ?? genericResetPasswordError)
      },
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
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-base text-balance text-muted-foreground">
            Choose a new password for your admin account.
          </p>
        </div>

        <form.Field name="password">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-lg font-medium">
                    New Password
                  </FieldLabel>
                  <span className="ml-1 text-lg font-medium">*</span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
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

        <form.Field name="confirmPassword">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirm-password" className="text-lg font-medium">
                    Confirm Password
                  </FieldLabel>
                  <span className="ml-1 text-lg font-medium">*</span>
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
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
                {isSubmitting ? 'Resetting password...' : 'Reset Password'}
              </Button>
            )}
          </form.Subscribe>
          {loginHref ? (
            <FieldDescription className="text-center text-base">
              <Link href={loginHref} className="font-medium text-foreground transition-colors hover:opacity-80">
                Back to login
              </Link>
            </FieldDescription>
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  )
}
