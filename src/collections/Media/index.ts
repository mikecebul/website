import { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '@/access/authenticated'
import { fileURLToPath } from 'url'
import path from 'path'
import { editorOrHigher } from '@/access/editorOrHigher'
import { generateBlurhash } from './generateBlurhash'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    create: editorOrHigher,
    delete: editorOrHigher,
    read: anyone,
    readVersions: authenticated,
    update: editorOrHigher,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Content',
  },
  upload: {
    adminThumbnail: 'thumbnail',
    staticDir: path.resolve(dirname, '../../../public/media'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for SEO and accessibility',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional text displayed beneath this image in blog media blocks.',
      },
    },
    {
      name: 'prefix',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'blurhash',
      type: 'text',
      admin: {
        hidden: true,
        disabled: { column: true, filter: true },
      },
    },
  ],
  hooks: {
    beforeValidate: [generateBlurhash],
  },
}
