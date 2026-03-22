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

const genericCreateFirstUserError =
  'We could not create the first admin user. Please review the form and try again.'

const createFirstUserSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    name: z.string().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type CreateFirstUserFormProps = Omit<React.ComponentProps<'form'>, 'action'> & {
  authCollectionSlug: string
  description?: string
  heading?: string
  initialError?: string
  loginHref?: string
  redirectTo?: string
  submitLabel?: string
}

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

export function CreateFirstUserForm({
  authCollectionSlug,
  className,
  description = 'Set up the first admin account for this Payload workspace.',
  heading = 'Create your account',
  initialError,
  loginHref,
  onSubmit,
  redirectTo,
  submitLabel = 'Create account',
  ...props
}: CreateFirstUserFormProps) {
  const [authError, setAuthError] = useState(initialError)

  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
    },
    validators: {
      onSubmit: createFirstUserSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(undefined)

      const response = await getPayloadSdk().request({
        json: {
          ...(value.name.trim() ? { name: value.name.trim() } : {}),
          email: value.email.trim().toLowerCase(),
          password: value.password,
        },
        method: 'POST',
        path: `/${authCollectionSlug}/first-register`,
      })

      const body = (await response.json().catch(() => undefined)) as unknown

      if (!response.ok) {
        throw new Error(getErrorMessage(body) ?? genericCreateFirstUserError)
      }

      window.location.assign(redirectTo || '/admin')
    },
    onSubmitInvalid: () => {
      setAuthError(undefined)
    },
    onSubmitMeta: {
      onError: ({ errorMap }) => {
        const formError = getErrorMessage(errorMap.onSubmit)
        setAuthError(formError ?? genericCreateFirstUserError)
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
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          <p className="text-base text-balance text-muted-foreground">{description}</p>
        </div>

        <form.Field name="name">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor="name" className="text-lg font-medium">
                  Full name
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    setAuthError(undefined)
                    field.handleChange(event.target.value)
                  }}
                  placeholder="John Doe"
                  className="h-14 rounded-xl px-4 text-lg md:text-lg"
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError className="text-base" errors={normalizedErrors} /> : null}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="email">
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

        <form.Field name="password">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-4" data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor="password" className="text-lg font-medium">
                  Password
                </FieldLabel>
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
                <FieldLabel htmlFor="confirm-password" className="text-lg font-medium">
                  Confirm password
                </FieldLabel>
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
                {isSubmitting ? 'Creating account...' : submitLabel}
              </Button>
            )}
          </form.Subscribe>
          <FieldDescription className="text-center text-base">
            {loginHref ? (
              <>
                Already created the first account?{' '}
                <Link href={loginHref} className="font-medium text-foreground transition-colors hover:opacity-80">
                  Sign in
                </Link>
                .
              </>
            ) : (
              'Your first account will be signed in automatically after setup.'
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
