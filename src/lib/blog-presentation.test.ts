import { describe, expect, it } from 'vitest'
import type { Blog } from '@/payload-types'
import { formatBlogDate, getBlogReadingTime, getBlogSummary } from './blog-presentation'

function content(text: string): Blog['content'] {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
          children: [
            { type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' },
          ],
        },
      ],
    },
  }
}

describe('journal presentation', () => {
  it('prefers a written summary and falls back to the first paragraph when media comes first', () => {
    const data = content('An introduction to the room.')
    data.root.children.unshift({
      type: 'block',
      version: 2,
      format: '',
      fields: { blockType: 'mediaBlock', media: 1 },
    } as Blog['content']['root']['children'][number])
    expect(getBlogSummary({ summary: '  A useful overview. ', content: data })).toBe(
      'A useful overview.',
    )
    expect(getBlogSummary({ summary: null, content: data })).toBe('An introduction to the room.')
  })
  it('calculates reading time from content and keeps previews bounded', () => {
    expect(getBlogReadingTime(content(''))).toBe(1)
    expect(getBlogReadingTime(content(Array(401).fill('word').join(' ')))).toBe(3)
    const summary = getBlogSummary({ content: content(Array(60).fill('word').join(' ')) })
    expect(summary.length).toBeLessThanOrEqual(200)
    expect(summary.endsWith('word…')).toBe(true)
  })
  it('formats publication dates in the site timezone consistently', () => {
    expect(formatBlogDate('2026-10-15T01:00:00Z')).toBe('Oct 14, 2026')
  })
})
