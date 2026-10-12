import { useEffect } from 'react'
import { ErrorComponent, type ErrorComponentProps } from '@tanstack/react-router'
import * as Sentry from '@sentry/react'

export default function AppError(props: ErrorComponentProps) {
  useEffect(() => {
    Sentry.captureException(props.error)
  }, [props.error])
  return <ErrorComponent {...props} />
}
