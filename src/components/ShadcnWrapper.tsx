import type { ReactNode } from 'react'

import { cn } from '@/components/lib/utils'

type ShadcnWrapperProps = {
  children: ReactNode
  className?: string
}

export default function ShadcnWrapper({ children, className = '' }: ShadcnWrapperProps) {
  return (
    <div data-twp className={cn('text-foreground border-border outline-ring/50 pb-8', className)}>
      {children}
    </div>
  )
}
