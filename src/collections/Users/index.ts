import React from 'react'
import type { CollectionConfig } from 'payload'
import { render } from '@react-email/components'

import { authenticated } from '../../access/authenticated'
import { roleSelectMutate } from './access/roleSelectMutate'
import { ensureFirstUserIsSuperAdmin } from './hooks/ensureFirstUserIsSuperAdmin'
import { revalidatePath } from 'next/cache'
import { superAdmin } from '@/access/superAdmin'
import { self } from '@/access/self'
import { adminUserAccess } from './access/adminUserAccess'
import { editorOrHigher } from '@/access/editorOrHigher'
import { formatAdminURL } from 'payload/shared'
import ForgotPasswordEmail from '@/emails/ForgotPasswordEmail'

const getRequestOrigin = (req: { headers?: Headers; url?: string }) => {
  try {
    if (!req.url) {
      return ''
    }

    const protocol = new URL(req.url).protocol
    const host = req.headers?.get('host')

    return host ? `${protocol}//${host}` : ''
  } catch {
    return ''
  }
}

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: editorOrHigher,
    create: ({ req }) => adminUserAccess({ req }) || superAdmin({ req }),
    delete: ({ req }) => adminUserAccess({ req }) || superAdmin({ req }),
    read: authenticated,
    update: ({ req, id }) => self({ req, id }) || adminUserAccess({ req }) || superAdmin({ req }),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
    hideAPIURL: !superAdmin,
    useAsTitle: 'name',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: async (args = {}) => {
        const { req, token, user } = args

        if (!req || typeof token !== 'string' || !token) {
          return ''
        }

        const resetPath = `${req.payload.config.admin.routes.reset}/${token}` as `/${string}`
        const resetURL = formatAdminURL({
          adminRoute: req.payload.config.routes.admin,
          path: resetPath,
          serverURL: getRequestOrigin(req),
        })

        return render(
          React.createElement(ForgotPasswordEmail, {
            resetURL,
            userEmail: typeof user?.email === 'string' ? user.email : undefined,
          }),
        )
      },
      generateEmailSubject: () => 'Reset your MIKECEBUL Admin password',
    },
    useAPIKey: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      access: {
        create: roleSelectMutate,
        read: async ({ req: { payload } }) => {
          const users = await payload.find({
            collection: 'users',
            limit: 0,
          })
          return users.totalDocs > 0
        },
        update: roleSelectMutate,
      },
      options: [
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Super Admin',
          value: 'superAdmin',
        },
      ],
      admin: {
        components: {
          Field: '@/collections/Users/RoleSelect',
          Cell: '@/collections/Users/RoleCell',
        },
        condition: (data, siblingData, { user }) => {
          if (!user) return false
          return true
        },
      },
      hooks: {
        beforeChange: [ensureFirstUserIsSuperAdmin],
        afterChange: [
          ({ req }) =>
            req.headers.get('X-Payload-Migration') !== 'true' &&
            revalidatePath('/(payload)', 'layout'),
        ],
      },
      validate: async (val, options) => {
        const {
          previousValue,
          req: { user, payload },
        } = options

        if (!user) {
          const users = await payload.find({
            collection: 'users',
            limit: 0,
          })
          if (users.totalDocs === 0) return true
        }

        const superAdmins = await payload.find({
          collection: 'users',
          depth: 0,
          limit: 0,
          where: {
            role: {
              equals: 'superAdmin',
            },
          },
        })

        if (previousValue === 'superAdmin' && val !== 'superAdmin' && superAdmins.totalDocs <= 1) {
          return 'There must always be at least one super admin'
        }

        if (user?.role !== 'superAdmin' && val === 'superAdmin' && superAdmins.totalDocs > 0)
          return 'Admins cannot create super admins'
        if (user?.role === 'editor') return 'Editors cannot update roles'
        return true
      },
    },
    {
      name: 'enableAPIKey',
      type: 'checkbox',
      access: {
        update: ({ req }) => !!superAdmin({ req }),
      },
      admin: {
        condition: ({ user }) => user?.role === 'superAdmin',
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      access: {
        update: ({ req }) => !!superAdmin({ req }),
      },
    },
  ],
  timestamps: true,
}

export default Users
