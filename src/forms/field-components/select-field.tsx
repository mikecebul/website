'use client'

import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/form-context'
import { cn } from '@/utilities/cn'
import type { SelectFormField } from '@/payload-types'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { normalizeFieldErrors } from './normalize-field-errors'

export default function SelectField({ id, label, name, colSpan = '2', options }: SelectFormField) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const normalizedErrors = normalizeFieldErrors(errors as unknown[])

  return (
    <div className={cn('col-span-2 w-full @container/field-group', { '@lg:col-span-1': colSpan === '1' })}>
      <Field data-invalid={normalizedErrors.length > 0 || undefined}>
        <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
        <Select
          value={field.state.value ?? ''}
          onValueChange={(value) => field.handleChange(String(value ?? ''))}
        >
          <SelectTrigger id={id ?? name} aria-invalid={normalizedErrors.length > 0}>
            <SelectValue placeholder={`Select a ${name}`} />
          </SelectTrigger>
          <SelectContent>
            {options?.map(({ label, value }) => {
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        <FieldError errors={normalizedErrors} />
      </Field>
    </div>
  )
}
