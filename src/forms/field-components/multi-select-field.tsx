'use client'

import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/form-context'
import { cn } from '@/utilities/cn'
import { CheckCircleIcon } from 'lucide-react'
import { Field, FieldError, FieldTitle } from '@/components/ui/field'
import { normalizeFieldErrors } from './normalize-field-errors'

const OPTIONS = [
  'Assessment',
  'Counseling',
  'Drivers license',
  'OWI safety class',
  'Narcan kits',
]

type MultiSelectFieldProps = {
  label: string
  name: string
  colSpan?: '1' | '2'
  options?: string[]
}

export default function MultiSelectField({
  label,
  name,
  colSpan = '2',
  options = OPTIONS,
}: MultiSelectFieldProps) {
  const field = useFieldContext<string[]>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const normalizedErrors = normalizeFieldErrors(errors as unknown[])
  const value: string[] = Array.isArray(field.state.value) ? field.state.value : []

  function toggleOption(option: string) {
    if (value.includes(option)) {
      field.handleChange(value.filter((v) => v !== option))
    } else {
      field.handleChange([...value, option])
    }
  }

  return (
    <div className={cn('col-span-2 w-full @container/field-group', { '@lg:col-span-1': colSpan === '1' })}>
      <Field data-invalid={normalizedErrors.length > 0 || undefined}>
        <FieldTitle>{label}</FieldTitle>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const selected = value.includes(option)
            return (
              <button
                key={option}
                type="button"
                className={cn(
                  'px-3 py-1 rounded-full border text-sm flex items-center gap-1 transition-colors',
                  selected
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-background border-gray-300 hover:bg-gray-100',
                )}
                onClick={() => toggleOption(option)}
                aria-pressed={selected}
              >
                {selected ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : null}
                {option}
              </button>
            )
          })}
        </div>
        <FieldError errors={normalizedErrors} />
      </Field>
    </div>
  )
}
