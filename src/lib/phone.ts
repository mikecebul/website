export const usPhonePattern =
  /^(?:\+?1[\s.-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/

const normalizeUSPhoneDigits = (value: string) => {
  const digits = value.replace(/\D/g, '')

  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
}

export const formatPhoneNumber = (value: string) => {
  const trimmedValue = value.trim()
  const digits = normalizeUSPhoneDigits(trimmedValue)

  if (digits.length !== 10) {
    return trimmedValue
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export const formatPhoneInput = (value: string) => {
  const digits = normalizeUSPhoneDigits(value)

  if (digits.length > 10) return value
  if (!digits) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
