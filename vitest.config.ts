import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Unit tests do not need the Payload RSC or TanStack development servers.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@payload-config': fileURLToPath(new URL('./src/payload.config.ts', import.meta.url)),
    },
  },
  test: { environment: 'node' },
})
