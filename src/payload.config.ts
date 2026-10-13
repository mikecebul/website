import type { TextFieldSingleValidation } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

import * as Sentry from '@sentry/node'
import { s3Storage as s3StoragePlugin } from '@payloadcms/storage-s3'
import { S3_PLUGIN_CONFIG } from './plugins/s3'
import {
  BlocksFeature,
  ParagraphFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
  UnderlineFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import Users from './collections/Users'
import { MediaBlock } from './blocks/MediaBlock/config'
import { Code } from './blocks/Code/config'
import { Media } from './collections/Media'
import { baseUrl } from './lib/baseUrl'
import { Blogs } from './collections/Blogs'
import { Contacts } from './collections/Contacts'
import { migrations } from './migrations'
import { mkdirSync } from 'node:fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL = process.env.DATABASE_URI || 'file:./data/payload.db'
if (!databaseURL.startsWith('file:')) {
  throw new Error('DATABASE_URI must be a local SQLite file URL, e.g. file:/app/data/payload.db.')
}
const databasePath = path.resolve(databaseURL.slice('file:'.length))
mkdirSync(path.dirname(databasePath), { recursive: true })

export default buildConfig({
  serverURL: baseUrl,
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'routes/_payload/importMap.js'),
    },
    user: Users.slug,
    components: {
      sidebar: {
        tabs: [
          {
            slug: 'notifications',
            label: 'Notifications',
            components: {
              Content: '/components/admin/WorkspaceNavigation#NotificationsTab',
              Icon: '/components/admin/WorkspaceNavigation#NotificationsIcon',
            },
          },
        ],
      },
    },
    dashboard: {
      widgets: [
        {
          slug: 'site-workspace',
          label: 'Site workspace',
          Component: '/components/admin/StudioOverview',
          minWidth: 'full',
          maxWidth: 'full',
        },
      ],
      defaultLayout: [
        { widgetSlug: 'site-workspace', width: 'full' },
        { widgetSlug: 'activity', width: 'large' },
        { widgetSlug: 'upload-dropzone', width: 'small' },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        ParagraphFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2'] }),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        BlocksFeature({
          blocks: [MediaBlock, Code],
        }),
        LinkFeature({
          enabledCollections: ['blogs'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
                validate: ((value, options) => {
                  if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                    return true // no validation needed, as no url should exist for internal links
                  }
                  return value ? true : 'URL is required'
                }) as TextFieldSingleValidation,
              },
            ]
          },
        }),
      ]
    },
  }),
  graphQL: {
    disable: true,
  },
  db: sqliteAdapter({
    client: { url: `file:${databasePath}` },
    busyTimeout: 5000,
    wal: true,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  collections: [Blogs, Media, Contacts, Users],
  cors: [baseUrl || ''].filter(Boolean),
  csrf: [baseUrl || ''].filter(Boolean),
  email:
    process.env.NODE_ENV === 'production'
      ? resendAdapter({
          apiKey: process.env.RESEND_API_KEY || '',
          defaultFromAddress: 'website@mikecebul.com',
          defaultFromName: 'MIKECEBUL, LLC',
        })
      : nodemailerAdapter({
          defaultFromAddress: 'website@mikecebul.com',
          defaultFromName: 'MIKECEBUL, LLC',
          transportOptions: {
            host: process.env.EMAIL_HOST || 'localhost',
            port: process.env.EMAIL_PORT || 1025,
            auth: {
              user: process.env.EMAIL_USER || 'user',
              pass: process.env.EMAIL_PASSWORD || 'password',
            },
          },
          skipVerify: true,
        }),
  hooks: {
    afterError: [
      ({ error, collection, req }) => {
        const status = 'status' in error ? Number(error.status) : 500
        if (status >= 500 || [400, 401, 403].includes(status)) {
          Sentry.captureException(error, {
            tags: { locale: req.locale },
            extra: { errorCollectionSlug: collection?.slug },
          })
        }
      },
    ],
  },
  storage: [
    s3StoragePlugin({
      ...S3_PLUGIN_CONFIG,
      collections: {
        media: {
          disableLocalStorage: true,
          generateFileURL: (args: any) => {
            if (typeof args.filename !== 'string') return null as unknown as string
            return `https://${process.env.NEXT_PUBLIC_S3_HOSTNAME}/${args.prefix}/${args.filename}`
          },
          prefix: process.env.NEXT_PUBLIC_UPLOAD_PREFIX || 'media',
        },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET!,
  upload: {
    transformers: [
      sharpTransformer({
        sharp,
        collections: {
          media: {
            formatOptions: {
              format: 'webp',
            },
            resizeOptions: {
              width: 1600,
              height: undefined,
            },
            variants: [
              {
                name: 'thumbnail',
                width: 300,
                height: 300,
                formatOptions: {
                  format: 'webp',
                },
                generateImageName: ({ originalName }) => {
                  return `${originalName}-thumbnail`
                },
              },
              {
                name: 'meta',
                width: 1200,
                height: 630,
                position: 'top',
                fit: 'inside',
                formatOptions: {
                  format: 'webp',
                },
                generateImageName: ({ originalName }) => {
                  return `${originalName}-meta`
                },
              },
            ],
          },
        },
      }),
    ],
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
