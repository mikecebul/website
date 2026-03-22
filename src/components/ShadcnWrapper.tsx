import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ShadcnWrapperProps = {
  children: ReactNode
  className?: string
}

export default function ShadcnWrapper({ children, className = '' }: ShadcnWrapperProps) {
  return (
    <div
      data-twp
      className={cn('border-border text-foreground outline-ring/50 bg-transparent pb-8', className)}
    >
      {children}
    </div>
  )
}
