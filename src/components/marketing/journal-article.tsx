import Link from '@/components/router-link'
import { ArrowLeft, ArrowUpRight, Eye } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RichText } from '@/components/RichText'
import { PageFrame } from '@/components/marketing/design-system'
import type { Blog } from '@/payload-types'
import { getBlogSections } from '@/lib/blog-sections'
import { BlogTableOfContents } from './table-of-contents'
import { cn } from '@/lib/utils'
import {
  formatBlogDate,
  getBlogReadingTime,
  getBlogSummary,
  getBlogTopicLabel,
  type JournalPost,
} from '@/lib/blog-presentation'
import { websiteContent } from '@/lib/website-content'
import { JournalContact } from './journal-contact'

export function MarketingJournalArticle({
  post,
  draft = false,
  relatedPosts = [],
}: {
  post: Pick<Blog, 'title' | 'content' | 'topic' | 'summary' | 'firstPublishedAt' | 'createdAt'>
  draft?: boolean
  relatedPosts?: JournalPost[]
}) {
  const publishedAt = post.firstPublishedAt || post.createdAt
  const sections = getBlogSections(post.content?.root)
  const words = post.title.trim().split(/\s+/)
  const accentWords = Math.min(3, Math.ceil(words.length / 3))
  const summary = getBlogSummary(post)
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
      <header className="web-container web-article-header">
        <p className="web-eyebrow">{getBlogTopicLabel(post.topic)}</p>
        <h1 className="web-article-title">
          {words.length > 3 ? (
            <>
              {words.slice(0, -accentWords).join(' ')} <br />
              <span className="web-gold">{words.slice(-accentWords).join(' ')}</span>
            </>
          ) : (
            post.title
          )}
        </h1>
        {summary ? <p className="web-copy web-article-summary">{summary}</p> : null}
        <p className="web-article-meta">
          <span>{websiteContent.site.name}</span>
          {publishedAt ? (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={publishedAt}>{formatBlogDate(publishedAt)}</time>
            </>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>{getBlogReadingTime(post.content)} min read</span>
        </p>
      </header>
      <div
        className={cn('web-container web-article-layout', {
          'web-article-layout-with-toc': sections.length > 0,
        })}
      >
        {sections.length > 0 ? (
          <BlogTableOfContents
            sections={sections.map(({ id, title, level, number }) => ({
              id,
              title,
              level,
              number,
            }))}
          />
        ) : null}
        <article className="web-article">
          {post.content ? (
            <RichText
              className="marketing-richtext"
              data={post.content}
              enableGutter={false}
              enableHeadingAnchors
            />
          ) : null}
          <p className="web-article-contact-link">
            Have a project in mind?{' '}
            <Link className="web-text-link" href="/contact">
              Let’s talk <ArrowUpRight aria-hidden="true" />
            </Link>
          </p>
        </article>
      </div>
      {relatedPosts.length > 0 ? (
        <section className="web-container web-journal-related" aria-label="Related articles">
          <p className="web-eyebrow">Keep exploring</p>
          <ul>
            {relatedPosts
              .filter((related) => related.slug)
              .map((related) => (
                <li key={related.id}>
                  <Link href={`/blog/${related.slug}`}>
                    <span className="web-journal-related-title">
                      {related.title}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                    <span className="web-journal-related-description">{related.description}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
      <JournalContact article />
    </PageFrame>
  )
}
