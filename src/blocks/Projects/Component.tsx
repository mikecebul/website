import Container from '@/components/Container'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import type { Media as MediaType, ProjectsBlock as ProjectsBlockType } from '@/payload-types'

const isMedia = (value: unknown): value is MediaType =>
  typeof value === 'object' && value !== null && 'url' in value

export const ProjectsBlock = ({ title, description, cards }: ProjectsBlockType) => {
  const validCards = cards?.filter((card) => Boolean(card?.title)) ?? []

  if (validCards.length === 0) {
    return null
  }

  return (
    <Container>
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          {title && <h2 className="text-4xl font-bold tracking-tight text-primary">{title}</h2>}
          {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {validCards.map((card, index) => {
            const image = isMedia(card.image) ? card.image : null
            const pills = card.pills?.filter((pill) => pill?.label?.trim()) ?? []
            const links = card.links?.filter((item) => item?.link) ?? []

            return (
              <article
                key={card.id ?? `${card.title}-${index}`}
                className="flex h-full flex-col rounded-xl border border-border/70 bg-card/40 p-6 shadow-sm"
              >
                <h3 className="text-3xl font-semibold leading-tight text-primary">{card.title}</h3>
                {card.description && (
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                )}

                {image && (
                  <Media
                    className="relative mt-5 overflow-hidden rounded-lg border border-border/60"
                    resource={image}
                    imgClassName="h-56 w-full object-cover"
                  />
                )}

                {pills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pills.map((pill, pillIndex) => (
                      <Badge
                        key={pill.id ?? `${pill.label}-${pillIndex}`}
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                      >
                        {pill.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {links.map(({ id, link }, linkIndex) => (
                      <CMSLink
                        key={id ?? `${card.title}-link-${linkIndex}`}
                        {...link}
                        size="sm"
                        appearance={link.appearance}
                      />
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
