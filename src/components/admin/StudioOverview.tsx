import type { WidgetServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { Link } from '@payloadcms/ui'
import { ArrowUpRight, Files, ImageIcon, Inbox, Plus } from 'lucide-react'

import { StudioActionLink } from './StudioActionLink'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function StudioOverview({ req, user, permissions }: WidgetServerProps) {
  const adminRoute = req.payload.config.routes.admin
  const href = (slug: string, create = false) =>
    formatAdminURL({ adminRoute, path: `/collections/${slug}${create ? '/create' : ''}` })
  const canView = (slug: 'blogs' | 'contacts' | 'media') =>
    Boolean(permissions.collections?.[slug]?.read)
  const canPublish = Boolean(canView('blogs') && permissions.collections?.blogs?.create)
  const firstName = typeof user?.name === 'string' ? user.name.trim().split(/\s+/)[0] : ''
  const metrics = await Promise.all(
    [
      ...(canView('contacts')
        ? [
            {
              slug: 'contacts' as const,
              label: 'Inquiries',
              Icon: Inbox,
            },
          ]
        : []),
      ...(canView('blogs')
        ? [
            {
              slug: 'blogs' as const,
              label: 'Published posts',
              Icon: Files,
            },
          ]
        : []),
      ...(canView('media')
        ? [
            {
              slug: 'media' as const,
              label: 'Media',
              Icon: ImageIcon,
            },
          ]
        : []),
    ].map(async (metric) => {
      const { totalDocs } = await req.payload.count({
        collection: metric.slug,
        overrideAccess: false,
        req,
        user,
        ...(metric.slug === 'blogs' ? { where: { _status: { equals: 'published' } } } : {}),
      })
      return { ...metric, count: totalDocs }
    }),
  )
  const draftCount = canView('blogs')
    ? (
        await req.payload.find({
          collection: 'blogs',
          draft: true,
          depth: 0,
          limit: 1,
          select: { title: true },
          overrideAccess: false,
          req,
          user,
          where: { _status: { equals: 'draft' } },
        })
      ).totalDocs
    : 0

  return (
    <section className="studio-overview" aria-label="Site workspace">
      <Card className="studio-overview__card">
        <CardHeader className="studio-overview__header">
          <CardTitle className="studio-overview__title">
            <h2>{firstName ? `Welcome back, ${firstName}` : 'Welcome back'}</h2>
          </CardTitle>
          <CardAction className="studio-overview__actions">
            {canView('contacts') ? (
              <StudioActionLink variant="outline" href={href('contacts')}>
                <Inbox data-icon="inline-start" />
                Review inquiries
              </StudioActionLink>
            ) : null}
            {canPublish ? (
              <StudioActionLink href={href('blogs', true)}>
                <Plus data-icon="inline-start" />
                Write a post
              </StudioActionLink>
            ) : null}
          </CardAction>
        </CardHeader>
        <CardContent className="studio-overview__metrics">
          {metrics.map(({ slug, label, Icon, count }) => (
            <Link key={slug} className="studio-overview__metric" href={href(slug)}>
              <span className="studio-overview__metric-top">
                <Icon aria-hidden="true" />
                <span>{label}</span>
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span className="studio-overview__number">{count.toLocaleString('en-US')}</span>
            </Link>
          ))}
        </CardContent>
        <CardFooter className="studio-overview__footer">
          {canView('blogs') && draftCount > 0 ? (
            <Link href={`${href('blogs')}?where[_status][equals]=draft`}>
              {`${draftCount} draft${draftCount === 1 ? '' : 's'}`}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ) : null}
          <Link
            className="studio-overview__website"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View website
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </CardFooter>
      </Card>
    </section>
  )
}
