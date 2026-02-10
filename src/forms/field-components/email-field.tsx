'use client'

import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/form-context'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/cn'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { EmailFormField } from '@/payload-types'
import { normalizeFieldErrors } from './normalize-field-errors'

export default function EmailField({ label, name, colSpan = '2' }: EmailFormField) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const normalizedErrors = normalizeFieldErrors(errors as unknown[])

  return (
    <div className={cn('col-span-2 w-full @container/field-group', { '@lg:col-span-1': colSpan === '1' })}>
      <Field data-invalid={normalizedErrors.length > 0 || undefined}>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <Input
          id={name}
          type="email"
          value={field.state.value ?? ''}
          onBlur={() => field.handleBlur()}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={normalizedErrors.length > 0}
        />
        <FieldError errors={normalizedErrors} />
      </Field>
    </div>
  )
}
