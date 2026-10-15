export type BlogSection = {
  id: string
  title: string
  level: 2 | 3
  number: string
  node: object
}

function headingText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  if ('text' in node && typeof node.text === 'string') return node.text
  if ('type' in node && node.type === 'linebreak') return ' '
  return 'children' in node && Array.isArray(node.children)
    ? node.children.map(headingText).join('')
    : ''
}

// Only traverse document children; headings in media captions or block fields are not sections.
export function getBlogSections(root: unknown): BlogSection[] {
  const sections: BlogSection[] = []
  const usedIDs = new Set<string>()
  let sectionNumber = 0
  let subsectionNumber = 0
  function visit(node: unknown) {
    if (!node || typeof node !== 'object') return
    if ('type' in node && node.type === 'heading' && 'tag' in node) {
      if (node.tag === 'h2' || node.tag === 'h3') {
        const title = headingText(node).replace(/\s+/g, ' ').trim()
        if (title) {
          const slug = title
            .normalize('NFKD')
            .replace(/\p{M}/gu, '')
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-|-$/g, '')
          const base = `section-${slug || 'heading'}`
          let id = base
          let suffix = 2
          while (usedIDs.has(id)) id = `${base}-${suffix++}`
          usedIDs.add(id)
          if (node.tag === 'h2') {
            sectionNumber += 1
            subsectionNumber = 0
          } else {
            subsectionNumber += 1
          }
          const number =
            node.tag === 'h2'
              ? String(sectionNumber).padStart(2, '0')
              : `${sectionNumber}.${subsectionNumber}`
          sections.push({ id, title, level: node.tag === 'h2' ? 2 : 3, number, node })
        }
      }
    }
    if ('children' in node && Array.isArray(node.children)) node.children.forEach(visit)
  }
  visit(root)
  return sections
}
