'use client'

import { cn } from '@/utilities/cn'
import { isActiveRoute } from '@/utilities/isActiveRoute'
import { usePathname } from 'next/navigation'
import type { NavItem } from './MobileNav'
import { CMSLink } from '@/components/Link'

export function MainNav({ navItems }: { navItems: NavItem[] }) {
  const currentPathName = usePathname()

  return (
    <div className="flex-1">
      <div className="justify-center hidden gap-8 px-8 md:flex">
        {navItems.map(({ link }, i) => {
          const slug =
            typeof link.reference?.value === 'object'
              ? link.reference?.relationTo === 'pages' &&
                typeof link.reference.value.slug === 'string'
                ? link.reference.value.slug
                : link.reference?.relationTo === 'media' &&
                  typeof link.reference.value.url === 'string'
                  ? link.reference.value.url
                  : ''
              : ''
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="nav"
              className={cn(
                "relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out",
                {
                  'text-brand after:scale-x-100': isActiveRoute(currentPathName as string, slug),
                },
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
