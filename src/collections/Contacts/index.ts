import type { CollectionConfig } from 'payload'

import { editorOrHigher } from '@/access/editorOrHigher'
import { superAdmin } from '@/access/superAdmin'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  access: {
    create: () => false,
    delete: editorOrHigher,
    read: editorOrHigher,
    update: editorOrHigher,
  },
  admin: {
    defaultColumns: ['name', 'email', 'phone', 'inquiryType', 'createdAt'],
    group: 'Admin',
    hideAPIURL: !superAdmin,
    useAsTitle: 'name',
  },
  fields: [
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
