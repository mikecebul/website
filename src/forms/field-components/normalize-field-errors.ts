type FieldErrorItem = { message?: string } | undefined

const getMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') {
      return message
    }
  }

  return undefined
}

export const normalizeFieldErrors = (errors: unknown[] | undefined): FieldErrorItem[] => {
  if (!Array.isArray(errors)) {
    return []
  }

  return errors.map((error) => {
    const message = getMessage(error)
    return message ? { message } : undefined
  })
}
