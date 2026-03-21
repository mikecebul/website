'use client'

import { ArrowRight } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/components/lib/utils'
import { contactFormSchema } from '@/lib/contact'
import { websiteContent } from '@/lib/website-content'
import { normalizeFieldErrors } from '@/forms/field-components/normalize-field-errors'

export function MarketingContactForm() {
  const [submissionError, setSubmissionError] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()

  const form = useForm({
    defaultValues: {
      email: '',
      inquiryType: '',
      message: '',
      name: '',
    },
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setSubmissionError(undefined)
      setSuccessMessage(undefined)

      const response = await fetch('/api/contact', {
        body: JSON.stringify(value),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const payload = (await response.json()) as { error?: string; message?: string }

      if (!response.ok) {
        setSubmissionError(payload.error || 'Something went wrong while sending the inquiry.')
        return
      }

      formApi.reset()
      setSuccessMessage(payload.message || 'Thanks for reaching out. Your inquiry was sent successfully.')
    },
  })

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup className="gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
              const isInvalid =
                (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
                !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="contact-name">Full Name</FieldLabel>
                  <Input
                    id="contact-name"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setSubmissionError(undefined)
                      field.handleChange(event.target.value)
                    }}
                    autoComplete="name"
                    aria-invalid={isInvalid}
                    className="h-12 rounded-2xl border-white/10 bg-white/3 px-4 text-base text-(--marketing-heading) placeholder:text-(--marketing-copy-soft)"
                    placeholder="John Doe"
                  />
                  {isInvalid ? <FieldError errors={normalizedErrors} /> : null}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="email">
            {(field) => {
              const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
              const isInvalid =
                (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
                !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="contact-email">Email Address</FieldLabel>
                  <Input
                    id="contact-email"
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setSubmissionError(undefined)
                      field.handleChange(event.target.value)
                    }}
                    autoComplete="email"
                    aria-invalid={isInvalid}
                    className="h-12 rounded-2xl border-white/10 bg-white/3 px-4 text-base text-(--marketing-heading) placeholder:text-(--marketing-copy-soft)"
                    placeholder="john@company.com"
                  />
                  {isInvalid ? <FieldError errors={normalizedErrors} /> : null}
                </Field>
              )
            }}
          </form.Field>
        </div>

        <form.Field name="inquiryType">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid =
              (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor="contact-inquiry-type">Inquiry Type</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) => {
                    setSubmissionError(undefined)
                    field.handleChange(value ?? '')
                  }}
                >
                  <SelectTrigger
                    id="contact-inquiry-type"
                    aria-invalid={isInvalid}
                    className="h-14 w-full rounded-2xl border-white/10 bg-white/3 px-4 text-base text-(--marketing-heading) data-placeholder:text-(--marketing-copy-soft)"
                  >
                    <SelectValue placeholder="Select the project type" />
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    className="rounded-2xl border border-white/10 bg-(--marketing-panel) text-(--marketing-heading)"
                  >
                    <SelectGroup>
                      {websiteContent.contact.inquiryTypes.map((inquiryType) => (
                        <SelectItem key={inquiryType} value={inquiryType}>
                          {inquiryType}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Pick the closest fit so the follow-up can stay focused.
                </FieldDescription>
                {isInvalid ? <FieldError errors={normalizedErrors} /> : null}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="message">
          {(field) => {
            const normalizedErrors = normalizeFieldErrors(field.state.meta.errors as unknown[])
            const isInvalid =
              (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                <Textarea
                  id="contact-message"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    setSubmissionError(undefined)
                    field.handleChange(event.target.value)
                  }}
                  aria-invalid={isInvalid}
                  className="min-h-40 rounded-3xl border-white/10 bg-white/3 px-4 py-4 text-base text-(--marketing-heading) placeholder:text-(--marketing-copy-soft)"
                  placeholder="Tell me about your project, timeline, or the friction you want to solve."
                />
                <FieldDescription>
                  Include enough context to understand the project goals, constraints, or room setup.
                </FieldDescription>
                {isInvalid ? <FieldError errors={normalizedErrors} /> : null}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      {successMessage ? <FieldDescription className="text-(--marketing-gold)">{successMessage}</FieldDescription> : null}
      {submissionError ? <FieldError>{submissionError}</FieldError> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setSubmissionError(undefined)
            setSuccessMessage(undefined)
            form.reset()
          }}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-12 rounded-full border-white/10 bg-transparent px-5 text-(--marketing-heading) hover:bg-white/5',
          )}
        >
          Reset
        </button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              className="h-12 rounded-full px-5 text-sm font-semibold shadow-[0_18px_40px_rgba(0,0,0,0.25)] [--primary:var(--marketing-gold)] [--primary-foreground:var(--marketing-gold-foreground)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              <ArrowRight data-icon="inline-end" />
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
