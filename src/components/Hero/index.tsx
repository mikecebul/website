import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/Icons'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { CompanyInfo, Hero as HeroType } from '@/payload-types'
import { CMSLink } from '../Link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Dots, Profile } from './Profile'
import { Media } from '../Media'

type Props = NonNullable<HeroType['highImpact']>

export async function Hero({ title, description, image, links, svg }: Props) {
  const { contact, social, hours } = (await getCachedGlobal('company-info', 2)()) as CompanyInfo
  const cleanedPhone = contact?.phone ? contact?.phone.replace(/\D/g, '') : null

  return (
    <section className="grid lg:gap-8 lg:grid-cols-12 2xl:px-0 2xl:container gap-12">
      <Dots />
      <div className="flex flex-col mr-auto lg:col-span-6 ">
        <h1 className="max-w-2xl pb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:pb-8 xl:text-6xl 2xl:text-7xl">
          {title}
        </h1>
        <p className="max-w-xl pb-8 text-lg text-muted-foreground">{description}</p>
        <div className="flex flex-col space-y-4 md:mr-4 xl:flex-row xl:space-x-0 xl:items-start">
          {/* Mobile Links */}
          <Link
            href={cleanedPhone ? `tel:${cleanedPhone}` : '#'}
            className={cn(
              buttonVariants({ variant: 'default', size: 'xl' }),
              'md:hidden min-w-full lg:min-w-64',
            )}
          >
            <Icons.phone className="mr-2" />
            Call Now
          </Link>
          {/* Desktop Links */}
          {links != null &&
            links.map(({ link, id }, index) => (
              <CMSLink
                key={id}
                {...link}
                size="xl"
                appearance={index === 0 ? 'default' : link.appearance}
                className="hidden rounded-lg md:flex lg:min-w-64"
              />
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center lg:col-span-6">
        {image != null && typeof image === 'object' && (
          <Media
            className="relative"
            imgClassName="rounded-full z-10 w-64 lg:w-80 xl:w-96"
            resource={image ?? '/profile_pic.jpg'}
            priority={true}
          />
        )}
      </div>
    </section>
  )
}

export const HeroSVG = ({ direction = 'ltr' }: { direction?: 'ltr' | 'rtl' | null }) => {
  return (
    <span
      className={cn('hidden xl:block absolute -z-10 text-brand', {
        '-bottom-9 -left-9': direction === 'ltr' || direction === 'rtl',
        // '-bottom-9 -left-9': direction === 'ltr',
      })}
    >
      <svg
        width="93"
        height="93"
        viewBox="0 0 93 93"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="2.5" cy="2.5" r="2.5" />
        <circle cx="2.5" cy="24.5" r="2.5" />
        <circle cx="2.5" cy="46.5" r="2.5" />
        <circle cx="2.5" cy="68.5" r="2.5" />
        <circle cx="2.5" cy="90.5" r="2.5" />
        <circle cx="24.5" cy="2.5" r="2.5" />
        <circle cx="24.5" cy="24.5" r="2.5" />
        <circle cx="24.5" cy="46.5" r="2.5" />
        <circle cx="24.5" cy="68.5" r="2.5" />
        <circle cx="24.5" cy="90.5" r="2.5" />
        <circle cx="46.5" cy="2.5" r="2.5" />
        <circle cx="46.5" cy="24.5" r="2.5" />
        <circle cx="46.5" cy="46.5" r="2.5" />
        <circle cx="46.5" cy="68.5" r="2.5" />
        <circle cx="46.5" cy="90.5" r="2.5" />
        <circle cx="68.5" cy="2.5" r="2.5" />
        <circle cx="68.5" cy="24.5" r="2.5" />
        <circle cx="68.5" cy="46.5" r="2.5" />
        <circle cx="68.5" cy="68.5" r="2.5" />
        <circle cx="68.5" cy="90.5" r="2.5" />
        <circle cx="90.5" cy="2.5" r="2.5" />
        <circle cx="90.5" cy="24.5" r="2.5" />
        <circle cx="90.5" cy="46.5" r="2.5" />
        <circle cx="90.5" cy="68.5" r="2.5" />
        <circle cx="90.5" cy="90.5" r="2.5" />
      </svg>
    </span>
  )
}
