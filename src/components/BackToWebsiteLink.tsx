import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

type BackToWebsiteLinkProps = {
  className?: string
  href?: string
  label?: string
}

export default function BackToWebsiteLink({
  className,
  label = 'Back to website',
  href = '/',
}: BackToWebsiteLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium text-foreground/70 no-underline transition-colors hover:text-foreground',
        className,
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  )
}
