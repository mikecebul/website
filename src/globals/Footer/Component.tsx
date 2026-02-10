import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

import type { Footer } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { buttonVariants } from '@/components/ui/button-variants'
import { Clock, Facebook, Mail, Navigation, Phone } from 'lucide-react'
import Container from '@/components/Container'
import { CMSLink } from '@/components/Link'
import { ThemeSelector } from '@/globals/Footer/ThemeSelector'
import payloadConfig from '@payload-config'
import { getPayload } from 'payload'

export async function Footer() {
  const payload = await getPayload({ config: payloadConfig })

  const { pageLinks, showContact, showGoogleMap } = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })

  const { contact, social, hours } = await payload.findGlobal({
    slug: 'company-info',
    depth: 1,
  })

  return (
    <footer>
      <Container className="py-0">
        <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* PageLinks */}
          {pageLinks && pageLinks.length > 0 && (
            <div className="flex flex-col col-span-1">
              <p className="text-lg font-bold">Website</p>
              <Separator className="my-4" />
              <ul className="flex flex-col mb-8 space-y-4 font-medium text-gray-500">
                {pageLinks.map(({ link }, id) => {
                  return (
                    <li key={id}>
                      <CMSLink {...link} appearance="nav" className={cn('text-sm')} />
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {/* Contact Info */}
          {showContact && contact && (
            <div className="flex flex-col col-span-1">
              <p className="text-lg font-bold">Contact</p>
              <Separator className="my-4" />
              <ul className="flex flex-col mb-8 space-y-4 text-muted-foreground ">
                {typeof contact?.phone === 'string' && (
                  <li key={contact.phone} className="group">
                    <a
                      href={`tel:${contact.phone.replace(/\D/g, '')}`}
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'flex justify-start group-hover:text-primary',
                      )}
                    >
                      <Phone className="shrink-0 mr-2" size={20} />
                      {contact.phone}
                    </a>
                  </li>
                )}
                {typeof contact?.physicalAddress === 'object' && (
                  <li key={contact.physicalAddress.cityState}>
                    <div
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'flex justify-start cursor-default',
                      )}
                    >
                      <Navigation className="shrink-0 mr-2" size={20} />
                      <p>{contact.physicalAddress.cityState}</p>
                    </div>
                  </li>
                )}
                {typeof contact?.email === 'string' && (
                  <li key={contact.email} className="group">
                    <a
                      href={`mailto:${contact.email}`}
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'flex justify-start group-hover:text-primary',
                      )}
                    >
                      <Mail className="shrink-0 mr-2" size={20} />
                      {contact.email}
                    </a>
                  </li>
                )}
                {/* Social Links */}
                {!!social &&
                  social?.map(({ link }) => (
                    <li key={link.label} className="group">
                      <a
                        href={link.url ?? ''}
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          'flex justify-start group-hover:text-primary',
                        )}
                      >
                        <Facebook className="mr-2" size={20} />
                        {link.label}
                      </a>
                    </li>
                  ))}

                {/* Business Hours */}
                {!!hours && hours?.length > 0 && (
                  <li
                    className={cn(
                      buttonVariants({ variant: 'text' }),
                      'text-gray-500 flex items-start justify-start h-full',
                    )}
                  >
                    <Clock className="mr-2" size={20} />
                    <ul>
                      {hours?.map(({ day, hours, id, note, type }) => (
                        <li key={id}>
                          {type === 'default' ? (
                            <span>
                              <strong>{`${day}: `}</strong>
                              {hours}
                            </span>
                          ) : (
                            <span>{note}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <Separator />
        <div className="flex flex-col items-center justify-between gap-2 py-3 sm:flex-row">
          <span className="block text-sm text-center text-gray-500 sm:text-left">
            © {new Date().getFullYear()}{' '}
            <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), 'p-0')}>
              {contact.name ?? 'MIKECEBUL, LLC'}
            </Link>
            . All Rights Reserved.
          </span>
          <ThemeSelector />
        </div>
      </Container>
    </footer>
  )
}
