'use client'

import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
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
import { contactFormSchema } from '@/lib/contact'
import { formatPhoneInput, formatPhoneNumber } from '@/lib/phone'
import { websiteContent } from '@/lib/website-content'
import { normalizeFieldErrors } from '@/forms/field-components/normalize-field-errors'

const inputFields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'Your name' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@yourbusiness.com',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: '(231) 555-0123',
  },
] as const

export function MarketingContactForm({ initialInquiryType = '' }: { initialInquiryType?: string }) {
  const [submissionError, setSubmissionError] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()
  const form = useForm({
    defaultValues: {
      email: '',
      inquiryType: websiteContent.contact.inquiryTypes.includes(initialInquiryType)
        ? initialInquiryType
        : '',
      message: '',
      name: '',
      phone: '',
    },
    validators: { onSubmit: contactFormSchema },
    onSubmit: async ({ value, formApi }) => {
      setSubmissionError(undefined)
      try {
        const response = await fetch('/api/contact', {
          body: JSON.stringify(value),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const payload = (await response.json()) as { error?: string; message?: string }
        if (!response.ok) {
          setSubmissionError(payload.error || 'Your inquiry could not be sent. Please try again.')
          return
        }
        formApi.reset()
        setSuccessMessage('Thanks for reaching out. I’ll get back to you shortly.')
      } catch {
        setSubmissionError('Could not connect. Please try again, or email me directly.')
      }
    },
  })
  if (successMessage) {
    return (
      <div className="web-form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h3 className="web-heading">You’re all set.</h3>
        <p className="web-copy">{successMessage}</p>
      </div>
    )
  }
  return (
    <form
      className="web-contact-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <FieldGroup className="web-field-grid">
          {inputFields.map((input) => (
            <form.Field key={input.name} name={input.name}>
              {(field) => {
                const isInvalid =
                  (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
                  !field.state.meta.isValid
                const errorId = `contact-${input.name}-error`
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor={`contact-${input.name}`}>{input.label}</FieldLabel>
                    <Input
                      id={`contact-${input.name}`}
                      name={field.name}
                      type={input.type}
                      value={field.state.value}
                      autoComplete={input.autoComplete}
                      placeholder={input.placeholder}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      required
                      onBlur={() => {
                        if (input.name === 'phone')
                          field.handleChange(formatPhoneNumber(field.state.value))
                        field.handleBlur()
                      }}
                      onChange={(event) => {
                        setSubmissionError(undefined)
                        field.handleChange(
                          input.name === 'phone'
                            ? formatPhoneInput(event.target.value)
                            : event.target.value,
                        )
                      }}
                    />
                    {isInvalid ? (
                      <FieldError
                        id={errorId}
                        errors={normalizeFieldErrors(field.state.meta.errors as unknown[])}
                      />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          ))}
          <form.Field name="inquiryType">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
                !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="contact-inquiry-type">What do you need?</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onOpenChange={(open) => {
                      if (!open) field.handleBlur()
                    }}
                    onValueChange={(value) => {
                      setSubmissionError(undefined)
                      field.handleChange(value ?? '')
                    }}
                  >
                    <SelectTrigger
                      id="contact-inquiry-type"
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? 'contact-inquiry-error' : undefined}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent align="start" className="web-select-popup">
                      <SelectGroup>
                        {websiteContent.contact.inquiryTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid ? (
                    <FieldError
                      id="contact-inquiry-error"
                      errors={normalizeFieldErrors(field.state.meta.errors as unknown[])}
                    />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
        <form.Field name="message">
          {(field) => {
            const isInvalid =
              (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor="contact-message">Tell me about your business</FieldLabel>
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
                  aria-describedby={isInvalid ? 'contact-message-error' : undefined}
                  placeholder="Share a bit about what you do and what you’re looking for…"
                  maxLength={800}
                  required
                />
                {isInvalid ? (
                  <FieldError
                    id="contact-message-error"
                    errors={normalizeFieldErrors(field.state.meta.errors as unknown[])}
                  />
                ) : null}
              </Field>
            )
          }}
        </form.Field>
        <div className="web-form-footer">
          {submissionError ? (
            <Alert variant="destructive">
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          ) : null}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="web-cta" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle
                    data-icon="inline-start"
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {isSubmitting ? 'Sending…' : 'Send inquiry'}
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            )}
          </form.Subscribe>
        </div>
      </FieldGroup>
    </form>
  )
}
