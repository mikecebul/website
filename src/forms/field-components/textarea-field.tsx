'use client'

import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/form-context'
import { cn } from '@/utilities/cn'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { TextareaFormField } from '@/payload-types'
import { normalizeFieldErrors } from './normalize-field-errors'

export default function TextareaField({ id, label, name, colSpan = '2' }: TextareaFormField) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const normalizedErrors = normalizeFieldErrors(errors as unknown[])

  return (
    <div className={cn('col-span-2 w-full @container/field-group', { '@md:col-span-1': colSpan === '1' })}>
      <Field data-invalid={normalizedErrors.length > 0 || undefined}>
        <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
        <Textarea
          id={id ?? name}
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
