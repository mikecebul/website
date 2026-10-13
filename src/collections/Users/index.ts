import React from 'react'
import type { CollectionConfig } from 'payload'
import { render } from '@react-email/components'

import { checkRole } from '@/access/checkRole'
import { authenticated } from '../../access/authenticated'
import { roleSelectMutate } from './access/roleSelectMutate'
import { ensureFirstUserIsSuperAdmin } from './hooks/ensureFirstUserIsSuperAdmin'
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
  versions: false,
  access: {
    admin: editorOrHigher,
    create: (args) => adminUserAccess(args) || superAdmin(args),
    delete: (args) => adminUserAccess(args) || superAdmin(args),
    read: authenticated,
    update: (args) => self(args) || adminUserAccess(args) || superAdmin(args),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    useAsTitle: 'name',
  },
  auth: {
    // Authorship can point back to this user; auth does not need populated relationships.
    depth: 0,
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
      name: 'headshot',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        description: 'Choose an image for your profile and account menu.',
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      access: {
        create: roleSelectMutate,
        read: async ({ req }) => {
          const { payload } = req
          const users = await payload.count({
            collection: 'users',
            overrideAccess: true,
            req,
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
        condition: (data, siblingData, { user }) => {
          if (!user) return false
          return true
        },
      },
      hooks: {
        beforeChange: [ensureFirstUserIsSuperAdmin],
      },
      validate: async (val, options) => {
        const { previousValue, req } = options

        const { user, payload } = req

        if (!user) {
          const users = await payload.find({
            collection: 'users',
            overrideAccess: true,
            req,
            limit: 0,
          })
          if (users.totalDocs === 0) return true
        }

        const superAdmins = await payload.find({
          collection: 'users',
          overrideAccess: true,
          req,
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
      name: 'apiKey',
      type: 'text',
      access: {
        update: ({ req }) => checkRole('superAdmin', req.user),
      },
    },
  ],
  timestamps: true,
}

export default Users
