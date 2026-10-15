import Link from '@/components/router-link'
import { ArrowUpRight } from 'lucide-react'
import { WebsiteAction } from './design-system'

export function JournalContact({ article = false }: { article?: boolean }) {
  return (
    <section className="web-container web-journal-contact" aria-label="Start a project">
      <div>
        <p className="web-eyebrow">{article ? 'Have an idea?' : 'Let’s make it happen'}</p>
        <h2>
          {!article ? 'Have an idea? ' : null}
          <span className="web-gold">Let’s put it to work.</span>
        </h2>
      </div>
      {article ? (
        <WebsiteAction href="/contact">Start a project</WebsiteAction>
      ) : (
        <Link className="web-text-link" href="/contact">
          Tell me what you’re thinking <ArrowUpRight aria-hidden="true" />
        </Link>
      )}
    </section>
  )
}
