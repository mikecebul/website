import Link from 'next/link'

import { cn } from '@/lib/utils'

const ErrorPage01 = ({ fullscreen = false }: { fullscreen?: boolean }) => {
  return (
    <section
      className={cn(
        'grid px-4 py-8 lg:grid-cols-2',
        fullscreen ? 'min-h-svh' : 'min-h-[calc(100svh-12rem)]',
      )}
    >
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.32em] text-(--marketing-sky)">404</p>
        <h1 className="mb-6 font-heading text-5xl font-semibold tracking-[-0.06em] text-(--marketing-heading)">
          Whoops!
        </h1>
        <h2 className="mb-1.5 font-heading text-3xl font-semibold tracking-[-0.04em] text-(--marketing-heading)">
          This page could not be found
        </h2>
        <p className="mb-6 max-w-sm text-(--marketing-copy)">
          The page you&apos;re looking for isn&apos;t here. Try heading back home.
        </p>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/8 bg-(--marketing-gold) px-5 text-sm font-semibold text-(--marketing-gold-foreground) shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90"
          href="/"
        >
            Back to home page
        </Link>
      </div>

      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-[28px] border border-white/8 bg-(--marketing-panel)"></div>
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
          alt="404 illustration"
          className="absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </section>
  )
}

export default ErrorPage01
