'use client'

import type { ReactNode } from 'react'
import { Link } from '@payloadcms/ui'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function StudioActionLink({
  href,
  variant = 'default',
  className,
  children,
}: {
  href: string
  variant?: 'default' | 'outline'
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant }), className)}
    >
      {children}
    </Link>
  )
}
