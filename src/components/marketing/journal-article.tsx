import Link from '@/components/router-link'
import { ArrowLeft } from 'lucide-react'
import { RichText } from '@/components/RichText'
import {
  AngularFrame,
  PageCallToAction,
  PageFrame,
  PageHeader,
} from '@/components/marketing/design-system'
import { formatDateTime } from '@/lib/formatDateTime'
import type { Blog } from '@/payload-types'

export function MarketingJournalArticle({
  post,
}: {
  post: Pick<Blog, 'title' | 'content' | 'firstPublishedAt' | 'createdAt'>
}) {
  const publishedAt = post.firstPublishedAt || post.createdAt
  return (
    <PageFrame className="web-article-page">
      <div className="web-container web-article-back">
        <Link className="web-text-link" href="/blog">
          <ArrowLeft aria-hidden="true" />
          Back to the journal
        </Link>
      </div>
      <PageHeader
        eyebrow={
          publishedAt ? (
            <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
          ) : (
            'From the journal'
          )
        }
        title={post.title}
      />
      <article className="web-container web-panel web-article">
        <AngularFrame />
        {post.content ? (
          <RichText className="marketing-richtext" data={post.content} enableGutter={false} />
        ) : null}
      </article>
      <PageCallToAction
        title={
          <>
            Have an idea?
            <br />
            <span className="web-gold">Let’s put it to work.</span>
          </>
        }
        label="Tell me what you’re thinking"
      />
    </PageFrame>
  )
}
