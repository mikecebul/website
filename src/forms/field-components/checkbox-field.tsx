'use client'

import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/form-context'
import { cn } from '@/utilities/cn'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { CheckboxFormField } from '@/payload-types'
import { normalizeFieldErrors } from './normalize-field-errors'

export default function CheckboxField({ id, label, name, colSpan = '2' }: CheckboxFormField) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const normalizedErrors = normalizeFieldErrors(errors as unknown[])

  return (
    <div
      className={cn('col-span-2 flex flex-col justify-start w-full @container/field-group', {
        '@lg:col-span-1': colSpan === '1',
      })}
    >
      <Field
        orientation="horizontal"
        data-invalid={normalizedErrors.length > 0 || undefined}
        className="items-center"
      >
        <Checkbox
          id={id ?? name}
          checked={field.state.value ?? false}
          onBlur={() => field.handleBlur()}
          onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
          aria-invalid={normalizedErrors.length > 0}
        />
        <FieldLabel htmlFor={id ?? name} className="font-normal">
          {label}
        </FieldLabel>
      </Field>
      <FieldError errors={normalizedErrors} />
    </div>
  )
}
