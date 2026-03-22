/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { ServerFunctionClient } from 'payload'
import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { DM_Sans, Geist } from 'next/font/google'
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react'

import './custom.scss'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
})

const serverFunctions: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={configPromise}
    htmlProps={{ className: `${geist.variable} ${dmSans.variable}` }}
    importMap={importMap}
    serverFunction={serverFunctions}
  >
    {children}
  </RootLayout>
)

export default Layout
