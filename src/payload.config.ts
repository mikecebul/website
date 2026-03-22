import type { TextFieldSingleValidation } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

import { sentryPlugin } from '@payloadcms/plugin-sentry'
import * as Sentry from '@sentry/nextjs'
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
import sharp from 'sharp' // editor-import
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: baseUrl,
  admin: {
    avatar: 'default',
    components: {
      beforeDashboard: ['@/components/dashboard/AdminWelcome'],
      afterNavLinks: ['@/components/afterNavLinks/LinkToAnalyticsDefaultRootView'],
      graphics: {
        Icon: '@/graphics/Icon',
        Logo: '@/graphics/Logo',
      },
      views: {
        createFirstUser: {
          Component: '@/components/views/CreateFirstUser',
        },
        forgot: {
          Component: '@/components/views/ForgotPassword',
        },
        reset: {
          Component: '@/components/views/ResetPassword',
        },
        login: {
          Component: '@/components/views/Login',
        },
        CustomRootView: {
          Component: '@/components/views/Analytics',
          path: '/analytics',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dashboard: {
      defaultLayout: [
        {
          widgetSlug: 'umami-traffic',
          width: 'full',
        },
      ],
      widgets: [
        {
          Component: '@/components/dashboard/UmamiTrafficWidget',
          label: 'Traffic overview',
          maxWidth: 'full',
          minWidth: 'medium',
          slug: 'umami-traffic',
        },
      ],
    },
    meta: {
      icons: [{ url: '/favicon.ico' }],
      titleSuffix: ' - MIKECEBUL',
    },
    user: Users.slug,
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
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  collections: [Blogs, Media, Users, Contacts],
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
  plugins: [
    sentryPlugin({
      options: {
        captureErrors: [400, 401, 403],
        context: ({ defaultContext, req }) => {
          return {
            ...defaultContext,
            tags: {
              locale: req.locale,
            },
          }
        },
        debug: false,
      },
      Sentry,
    }),
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
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
