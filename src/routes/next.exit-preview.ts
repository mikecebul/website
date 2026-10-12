import { createFileRoute } from '@tanstack/react-router'
import { deleteCookie } from '@tanstack/react-start/server'

export const Route = createFileRoute('/next/exit-preview')({
  server: {
    handlers: {
      GET: () => {
        deleteCookie('payload-preview', { path: '/' })
        return new Response(null, { status: 307, headers: { Location: '/' } })
      },
    },
  },
})
