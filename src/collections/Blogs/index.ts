import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { superAdmin } from '@/access/superAdmin'
import { slugField, type CollectionConfig } from 'payload'

import { revalidateDelete } from './hooks/revalidateDelete'
import { revalidateBlog } from './hooks/revalidateBlog'
import { setFirstPublishedAt } from './hooks/setFirstPublishedAt'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  access: {
    admin: superAdmin,
    create: superAdmin,
    delete: superAdmin,
    read: authenticatedOrPublished,
    update: superAdmin,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'firstPublishedAt', 'updatedAt'],
    hideAPIURL: !superAdmin,
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
    slugField({
      useAsSlug: 'title',
    }),
  ],
  hooks: {
    afterChange: [revalidateBlog],
    afterDelete: [revalidateDelete],
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
