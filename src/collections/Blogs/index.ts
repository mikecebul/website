import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { superAdmin } from '@/access/superAdmin'
import { authenticated } from '@/access/authenticated'
import { type CollectionConfig, type PayloadRequest } from 'payload'

import { setFirstPublishedAt } from './hooks/setFirstPublishedAt'
import { getPreviewOrigin } from '@/lib/preview-url'

const previewURL = (data: Record<string, unknown>, req: PayloadRequest) => {
  if (typeof data.slug !== 'string' || !data.slug || !process.env.PREVIEW_SECRET) return null
  const params = new URLSearchParams({
    collection: 'blogs',
    slug: data.slug,
    path: `/blog/${data.slug}`,
    previewSecret: process.env.PREVIEW_SECRET,
  })
  const origin = getPreviewOrigin(req, req.payload.config.serverURL)
  return `${origin}/next/preview?${params}`
}

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  access: {
    admin: superAdmin,
    create: superAdmin,
    delete: superAdmin,
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: superAdmin,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'firstPublishedAt', 'updatedAt'],
    useAsTitle: 'title',
    preview: (data, { req }) => previewURL(data, req),
    livePreview: {
      url: ({ data, req }) => previewURL(data, req),
      breakpoints: [
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
      ],
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      maxLength: 240,
      admin: {
        description:
          'Short introduction shown below the article title and in journal previews. Leave blank to use the first paragraph.',
      },
    },
    {
      name: 'topic',
      type: 'select',
      options: [
        { label: 'Websites', value: 'websites' },
        { label: 'AI workflows', value: 'ai-workflows' },
        { label: 'Hybrid meetings', value: 'hybrid-meetings' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Displayed above the article title and in the journal.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Use Heading 2 for sections and Heading 3 for subsections. They appear automatically in the article table of contents.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        position: 'sidebar',
        description: 'Choose the image shown with this article in the journal and link previews.',
      },
    },
    {
      name: 'firstPublishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    { name: 'slug', type: 'slug', useAsSlug: 'title', required: true, unique: true, index: true },
  ],
  hooks: {
    beforeChange: [setFirstPublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
  },
}
