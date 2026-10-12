import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { withPayload } from '@payloadcms/tanstack-start'
import rsc from '@vitejs/plugin-rsc'
import { nitro } from 'nitro/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = defineConfig(
  withPayload(
    ({ env, pluginOptions }) => {
      const vars = loadEnv(env.mode, process.cwd(), '')
      return {
        server: {
          watch: {
            ignored: ['**/.output/**', '**/.nitro/**', '**/output/**', '**/.playwright-cli/**'],
          },
        },
        build: { sourcemap: 'hidden' },
        resolve: { tsconfigPaths: true },
        define: {
          'import.meta.env.VITE_SERVER_URL': JSON.stringify(
            vars.VITE_SERVER_URL || vars.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
          ),
          'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(
            vars.VITE_SENTRY_DSN || vars.NEXT_PUBLIC_SENTRY_DSN || '',
          ),
        },
        plugins: [
          tailwindcss(),
          rsc(pluginOptions.rsc),
          tanstackStart(pluginOptions.tanstackStart),
          viteReact(pluginOptions.react),
          nitro({
            ...pluginOptions.nitro,
            // file-type loads this package through a runtime import when serving uploaded files.
            traceDeps: [...(pluginOptions.nitro.traceDeps ?? []), 'strtok3*'],
          }),
          ...(process.env.CI && process.env.SENTRY_AUTH_TOKEN
            ? [
                sentryVitePlugin({
                  org: 'mikecebul',
                  project: 'website',
                  url: 'https://monitor.mikecebul.com',
                  authToken: process.env.SENTRY_AUTH_TOKEN,
                  sourcemaps: { filesToDeleteAfterUpload: ['.output/**/*.map'] },
                }),
              ]
            : []),
        ],
      }
    },
    {
      payloadConfigPath: path.resolve(__dirname, 'src', 'payload.config.ts'),
      routesDirectory: 'routes',
      devServerExternalPackages: ['@sentry/node', '@react-email/components', 'plaiceholder'],
    },
  ),
)

export default config
