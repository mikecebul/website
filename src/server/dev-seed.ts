import type { Blog, User } from '@/payload-types'
import type { Payload } from 'payload'

export const devAdmin = {
  email: 'mikecebul@gmail.com',
  password: 'password',
}

// Require development explicitly so production and tests never use the dev account.
export const isDevSeedEnabled = () =>
  process.env.NODE_ENV === 'development' && process.env.DEV_SEED !== 'false'

const sampleBlogs = [
  {
    slug: 'dev-a-website-that-brings-in-local-business',
    title: 'A website that brings in local business',
    paragraphs: [
      'Your website should make it easy for a potential client to understand what you do, where you work, and how to get in touch. A clear service page and a short contact form are a useful place to start.',
      'Write about the questions customers ask before hiring you. Show examples of your work, explain your process, and make the next step clear on every page.',
      'Check the site on a phone before you launch. Readable text, quick pages, and a contact form that works make a difference when someone is looking for help nearby.',
    ],
  },
  {
    slug: 'dev-start-small-with-ai-workflow-automation',
    title: 'Start small with AI workflow automation',
    paragraphs: [
      'A useful automation starts with a task your business repeats every week. Collecting inquiry details, preparing a first draft, and organizing meeting notes are good opportunities to explore.',
      'Map the steps before choosing tools. Identify which information comes in, who reviews it, and what a successful result looks like. Keep a person involved in decisions that need judgment.',
      'Try one workflow with a small group, review the results, and adjust it. The goal is to give your team more time for customers and the work that needs their attention.',
    ],
  },
  {
    slug: 'dev-plan-a-better-hybrid-meeting-room',
    title: 'Plan a better hybrid meeting room',
    paragraphs: [
      'People joining remotely should be able to hear the conversation and see everyone in the room. Start your meeting room plan with those needs before choosing a camera or display.',
      'Consider the room size, seating, acoustics, and how your team starts a call. A well-placed microphone and simple controls help people focus on the meeting.',
      'Test the setup with someone joining from outside the office. Walk through joining, sharing a screen, and speaking from different seats so you can find problems before an important call.',
    ],
  },
]

function contentFromParagraphs(paragraphs: string[]): Blog['content'] {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          { type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' },
        ],
      })),
    },
  }
}

export async function seedDevelopment(payload: Payload): Promise<void> {
  if (!isDevSeedEnabled()) return

  const { docs } = await payload.find({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: { email: { equals: devAdmin.email } },
  })
  const existing = docs[0]
  const data = { ...devAdmin, role: 'superAdmin' as const }
  const user = existing
    ? await payload.update({
        collection: 'users',
        id: existing.id,
        overrideAccess: true,
        // Trusted startup operation: allow the role validator to restore this dev account.
        user: { ...existing, collection: 'users', role: 'superAdmin' } as User,
        data,
      })
    : await payload.create({
        collection: 'users',
        overrideAccess: true,
        // A fresh dev database may already contain another super admin.
        user: { collection: 'users', role: 'superAdmin' } as User,
        data: { ...data, name: 'Mike Cebul' },
      })

  for (const { paragraphs, ...blog } of sampleBlogs) {
    const existingBlog = await payload.find({
      collection: 'blogs',
      overrideAccess: true,
      draft: true,
      depth: 0,
      limit: 1,
      where: { slug: { equals: blog.slug } },
    })
    if (existingBlog.totalDocs > 0) continue

    await payload.create({
      collection: 'blogs',
      overrideAccess: true,
      user,
      data: { ...blog, _status: 'published', content: contentFromParagraphs(paragraphs) },
    })
  }
  payload.logger.info('Development admin ready; missing sample blogs seeded.')
}
