import Link from '@/components/router-link'
import { ArrowLeft, Eye } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
  draft = false,
}: {
  post: Pick<Blog, 'title' | 'content' | 'firstPublishedAt' | 'createdAt'>
  draft?: boolean
}) {
  const publishedAt = post.firstPublishedAt || post.createdAt
  return (
    <PageFrame className="web-article-page">
      {draft ? (
        <Alert className="web-container" aria-label="Draft preview">
          <Eye />
          <AlertTitle>Draft preview</AlertTitle>
          <AlertDescription>
            Latest saved changes. <a href="/next/exit-preview">Exit preview</a>
          </AlertDescription>
        </Alert>
      ) : null}
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
