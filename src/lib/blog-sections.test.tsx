import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { getBlogSections } from './blog-sections'
import { RichText, type RichTextContent } from '@/components/RichText'

// Code highlighting imports admin-only CSS; heading rendering does not need that block.
vi.mock('@/blocks/Code/Component', () => ({ CodeBlock: () => null }))

function heading(tag: string, text: string) {
  return {
    type: 'heading',
    tag,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: [{ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal', style: '' }],
  }
}

describe('blog sections', () => {
  it('includes only nonempty H2/H3 headings, preserving document order and inline text', () => {
    const root = {
      children: [
        heading('h1', 'Title'),
        heading('h2', 'Start with the room'),
        {
          ...heading('h3', ''),
          children: [{ text: 'Mic' }, { children: [{ text: 'rophone placement' }] }],
        },
        heading('h2', ' '),
        { type: 'block', fields: { caption: { children: [heading('h2', 'Caption')] } } },
      ],
    }
    expect(getBlogSections(root).map(({ title, level }) => ({ title, level }))).toEqual([
      { title: 'Start with the room', level: 2 },
      { title: 'Microphone placement', level: 3 },
    ])
  })

  it('creates deterministic, unique anchors for repeated titles and suffix collisions', () => {
    const root = {
      children: [
        heading('h2', 'Café & audio!'),
        heading('h2', 'Café & audio!'),
        heading('h3', 'Cafe audio 2'),
        heading('h2', '☀'),
      ],
    }
    const ids = getBlogSections(root).map(({ id }) => id)
    expect(ids).toEqual([
      'section-cafe-audio',
      'section-cafe-audio-2',
      'section-cafe-audio-2-2',
      'section-heading',
    ])
    expect(getBlogSections(root).map(({ id }) => id)).toEqual(ids)
    expect(getBlogSections(null)).toEqual([])
  })

  it('renders every TOC target on the actual heading without changing the saved content', () => {
    const data = {
      root: {
        type: 'root',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        children: [
          heading('h2', 'Room setup'),
          heading('h3', 'Audio'),
          heading('h2', 'Room setup'),
        ],
      },
    } as RichTextContent
    const before = JSON.stringify(data)
    const markup = renderToStaticMarkup(<RichText data={data} enableHeadingAnchors />)
    for (const section of getBlogSections(data.root)) expect(markup).toContain(`id="${section.id}"`)
    expect(getBlogSections(data.root).map(({ number }) => number)).toEqual(['01', '1.1', '02'])
    expect(markup).toContain('data-section-number="02"')
    expect(markup).toContain('<h3 id="section-audio"')
    expect(JSON.stringify(data)).toBe(before)
    expect(renderToStaticMarkup(<RichText data={data} />)).not.toContain('id="section-')
  })
})
