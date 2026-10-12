import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { superAdmin } from '@/access/superAdmin'
import { authenticated } from '@/access/authenticated'
import { type CollectionConfig } from 'payload'

import { setFirstPublishedAt } from './hooks/setFirstPublishedAt'

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
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
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
