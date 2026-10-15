'use client'

import { useEffect, useState } from 'react'
import type { BlogSection } from '@/lib/blog-sections'

export function BlogTableOfContents({
  sections,
}: {
  sections: Pick<BlogSection, 'id' | 'title' | 'level' | 'number'>[]
}) {
  const [activeID, setActiveID] = useState(sections[0]?.id)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = sections[0]?.id
      for (const section of sections) {
        const heading = document.getElementById(section.id)
        if (heading && heading.getBoundingClientRect().top <= 140) current = section.id
      }
      setActiveID(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [sections])

  return (
    <nav className="web-article-toc" aria-label="Article sections">
      <p className="web-eyebrow">In this note</p>
      <ol>
        {sections.map((section) => (
          <li key={section.id} data-level={section.level}>
            <a
              href={`#${section.id}`}
              aria-current={activeID === section.id ? 'location' : undefined}
            >
              <span className="web-article-toc-number" aria-hidden="true">
                {section.number}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
