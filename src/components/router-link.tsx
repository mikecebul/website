import { Link as TanStackLink } from '@tanstack/react-router'
import { forwardRef, type ComponentProps } from 'react'

// Preserve the site's anchor props and support external, mailto, and hash links.
const Link = forwardRef<HTMLAnchorElement, ComponentProps<'a'> & { href: string }>(function Link(
  { href, ...props },
  ref,
) {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return <a ref={ref} href={href} {...props} />
  }
  return <TanStackLink ref={ref} to={href} {...props} />
})

export default Link
