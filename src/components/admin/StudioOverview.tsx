import type { WidgetServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { Link } from '@payloadcms/ui'
import { ArrowRight, ArrowUpRight, Files, ImageIcon, Inbox, Plus } from 'lucide-react'

import { StudioActionLink } from './StudioActionLink'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
        <div className="studio-overview__main">
          <div className="studio-overview__copy">
            <CardHeader className="studio-overview__header">
              <p className="studio-overview__eyebrow">
                {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
              </p>
              <CardTitle className="studio-overview__title">
                <h1>Make room for your next opportunity.</h1>
              </CardTitle>
            </CardHeader>
            <CardContent className="studio-overview__actions">
              {canView('contacts') ? (
                <StudioActionLink className="studio-overview__primary" href={href('contacts')}>
                  <Inbox data-icon="inline-start" />
                  Review inquiries
                  <ArrowRight data-icon="inline-end" />
                </StudioActionLink>
              ) : null}
              {canPublish ? (
                <StudioActionLink
                  variant="outline"
                  className="studio-overview__secondary"
                  href={href('blogs', true)}
                >
                  <Plus data-icon="inline-start" />
                  Write a post
                </StudioActionLink>
              ) : null}
            </CardContent>
            <div className="studio-overview__footnote">
              {canView('blogs') && draftCount > 0 ? (
                <Link href={`${href('blogs')}?where[_status][equals]=draft`}>
                  {`${draftCount} draft${draftCount === 1 ? '' : 's'}`}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>
          <div className="studio-overview__art">
            <img
              src="/admin/harbor-workspace.webp"
              alt="A sculptural lighthouse and a calm, sunlit harbor"
              width={1536}
              height={1024}
              fetchPriority="high"
            />
          </div>
        </div>
        <CardFooter className="studio-overview__metrics">
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
        </CardFooter>
      </Card>
      <div className="studio-overview__below">
        <Link href="/" target="_blank" rel="noopener noreferrer">
          View website
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
