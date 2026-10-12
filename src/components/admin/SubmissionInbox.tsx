'use client'

import { useCallback, useEffect, useState } from 'react'
import { Link } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { Bell, Check, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import type { Contact } from '@/payload-types'

const unreadQuery = 'where[isRead][not_equals]=true'

export function SubmissionInbox({
  apiRoute,
  adminRoute,
}: {
  apiRoute: string
  adminRoute: string
}) {
  const [docs, setDocs] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<string | null>(null)
  const endpoint = `${apiRoute}/contacts`
  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch(
          `${endpoint}?${unreadQuery}&sort=-createdAt&limit=20&depth=0`,
          {
            credentials: 'same-origin',
            signal,
          },
        )
        if (!response.ok)
          throw new Error(
            response.status === 403 || response.status === 401
              ? 'Your account cannot view submissions.'
              : 'Could not load submissions.',
          )
        const result = await response.json()
        if (signal?.aborted) return
        setDocs(result.docs)
        setTotal(result.totalDocs)
        setError('')
      } catch (cause) {
        if (signal?.aborted) return
        setError(cause instanceof Error ? cause.message : 'Could not load submissions.')
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [endpoint],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    const timer = window.setInterval(() => {
      void load(controller.signal)
    }, 30_000)
    const refresh = () => {
      void load(controller.signal)
    }
    window.addEventListener('focus', refresh)
    return () => {
      controller.abort()
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
    }
  }, [load])

  async function markRead(id: Contact['id'] | 'all') {
    setPending(String(id))
    setError('')
    try {
      // Bulk actions only touch the loaded IDs, so new arrivals remain unread.
      const ids = id === 'all' ? docs.map((doc) => doc.id) : [id]
      const response = await fetch(
        `${endpoint}?where[id][in]=${encodeURIComponent(ids.join(','))}`,
        {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        },
      )
      if (!response.ok) throw new Error('Could not mark submissions read.')
      const result = await response.json()
      if (result.errors?.length) throw new Error('Some submissions could not be marked read.')
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update submissions.')
    } finally {
      setPending(null)
    }
  }

  return (
    <section className="studio-inbox" aria-label="Unread form submissions" aria-busy={loading}>
      <header className="studio-inbox__header">
        <div>
          <h2>Notifications</h2>
          <p aria-live="polite">{loading ? 'Loading…' : `${total} unread`}</p>
        </div>
        {docs.length > 0 ? (
          <Button
            variant="ghost"
            size="xs"
            disabled={pending !== null}
            onClick={() => void markRead('all')}
          >
            {total > docs.length ? 'Mark shown read' : 'Mark all read'}
          </Button>
        ) : null}
      </header>
      {error ? (
        <div className="studio-inbox__error" role="alert">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}
      {!loading && !error && docs.length === 0 ? (
        <Empty className="studio-inbox__empty">
          <EmptyHeader>
            <EmptyMedia>
              <Bell aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>All caught up</EmptyTitle>
            <EmptyDescription>New form submissions will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      <ul className="studio-inbox__list">
        {docs.map((doc) => (
          <li key={doc.id} className="studio-inbox__item">
            <Inbox aria-hidden="true" />
            <div className="studio-inbox__detail">
              <Link href={formatAdminURL({ adminRoute, path: `/collections/contacts/${doc.id}` })}>
                <strong>{doc.name}</strong>
                <span className="studio-inbox__dot" aria-label="Unread" />
                <span className="studio-inbox__context">{doc.inquiryType}</span>
              </Link>
              <time dateTime={doc.createdAt}>
                {new Date(doc.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </time>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={pending !== null}
              aria-label={`Mark submission from ${doc.name} read`}
              onClick={() => void markRead(doc.id)}
            >
              <Check />
            </Button>
          </li>
        ))}
      </ul>
      <Link
        className="studio-inbox__all"
        href={formatAdminURL({ adminRoute, path: '/collections/contacts' })}
      >
        View all submissions ↗
      </Link>
    </section>
  )
}
