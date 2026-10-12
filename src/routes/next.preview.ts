import { createFileRoute } from '@tanstack/react-router'
import { setCookie } from '@tanstack/react-start/server'

export const Route = createFileRoute('/next/preview')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams
        const path = params.get('path')
        const slug = params.get('slug')
        if (
          !process.env.PREVIEW_SECRET ||
          params.get('previewSecret') !== process.env.PREVIEW_SECRET
        )
          return new Response('You are not allowed to preview this page', { status: 403 })
        if (!slug || params.get('collection') !== 'blogs' || path !== `/blog/${slug}`)
          return new Response('Invalid preview path', { status: 400 })
        const { getCMS } = await import('@/server/cms')
        const { checkRole } = await import('@/access/checkRole')
        const payload = await getCMS()
        const { user } = await payload.auth({ headers: request.headers })
        if (!user || !checkRole(['editor', 'admin', 'superAdmin'], user))
          return new Response('You are not allowed to preview this page', { status: 403 })
        setCookie('payload-preview', 'true', {
          httpOnly: true,
          secure: new URL(request.url).protocol === 'https:',
          sameSite: 'lax',
          path: '/',
          maxAge: 3600,
        })
        return new Response(null, { status: 307, headers: { Location: path } })
      },
    },
  },
})
