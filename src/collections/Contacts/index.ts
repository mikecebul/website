import type { CollectionConfig } from 'payload'

import { editorOrHigher } from '@/access/editorOrHigher'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  labels: { singular: 'Form submission', plural: 'Form submissions' },
  access: {
    create: () => false,
    delete: editorOrHigher,
    read: editorOrHigher,
    update: editorOrHigher,
  },
  admin: {
    defaultColumns: ['name', 'inquiryType', 'isRead', 'createdAt'],
    group: 'Business',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'isRead',
      label: 'Read',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar', description: 'Shared inbox status for your team.' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'inquiryType',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
  timestamps: true,
}
