import { describe, expect, it } from 'vitest'
import { createMarketingHead } from './marketing-metadata'
import { getBlogImages, getBlogPostDescription } from './blog-seo'
import { createBlogPostingJsonLd } from '@/components/seo/json-ld'
import type { Blog } from '@/payload-types'

const post = {
  id: 1,
  title: 'A useful website',
  slug: 'a-useful-website',
  createdAt: '2026-10-12T12:00:00.000Z',
  firstPublishedAt: '2026-10-13T12:00:00.000Z',
  updatedAt: '2026-10-13T13:00:00.000Z',
  content: {
    root: {
      children: [
        {
          type: 'block',
          fields: {
            blockType: 'mediaBlock',
            media: {
              id: 2,
              url: 'https://media.mikecebul.com/article.webp',
              alt: 'A storefront and a website',
              width: 1536,
              height: 1024,
            },
          },
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'A clear website helps your visitors contact you.' }],
        },
      ],
    },
  },
} as unknown as Blog

describe('search and social metadata', () => {
  it('keeps a paginated blog canonical and social URL consistent', () => {
    const head = createMarketingHead({
      title: 'Blog page 2',
      description: 'More articles',
      pathname: '/blog?page=2',
    })
    expect(head.links[0].href).toMatch(/\/blog\?page=2$/)
    expect(head.meta.find((meta) => meta.property === 'og:url')?.content).toBe(head.links[0].href)
  })
  it('prevents draft and account indexing without publishing structured data', () => {
    const head = createMarketingHead({
      title: 'Preview',
      description: 'Draft',
      pathname: '/blog/draft',
      noindex: true,
    })
    for (const name of ['robots', 'googlebot'])
      expect(head.meta.find((meta) => meta.name === name)?.content).toBe('noindex, nofollow')
    expect(head.scripts).toEqual([])
  })
  it('uses the article image, alt text, author and publication dates', () => {
    const image = getBlogImages(post.content.root)[0]
    const head = createMarketingHead({
      title: post.title,
      description: getBlogPostDescription(post),
      pathname: `/blog/${post.slug}`,
      ogType: 'article',
      image: { url: image.url!, alt: image.alt },
      publishedAt: post.firstPublishedAt,
      modifiedAt: post.updatedAt,
    })
    expect(head.meta.find((meta) => meta.property === 'og:image')?.content).toBe(image.url)
    expect(head.meta.find((meta) => meta.name === 'twitter:image:alt')?.content).toBe(image.alt)
    const [article] = createBlogPostingJsonLd(post)
    expect(article).toMatchObject({
      '@type': 'BlogPosting',
      datePublished: post.firstPublishedAt,
      dateModified: post.updatedAt,
      image: [image.url],
    })
    expect(getBlogPostDescription(post)).toBe('A clear website helps your visitors contact you.')
  })
  it('escapes script-closing content in head structured data', () => {
    const head = createMarketingHead({
      title: '</script><script>bad</script>',
      description: 'Example',
      pathname: '/about',
    })
    expect(head.scripts[0].children).not.toContain('</script>')
    expect(JSON.parse(head.scripts[0].children)[1]['@type']).toBe('AboutPage')
  })
})
