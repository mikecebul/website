import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

/**
 * @param {string} directory
 * @param {Record<string, string | undefined>} [inherited]
 * @returns {Record<string, string | undefined>}
 */
export function previewEnvironment(directory, inherited = process.env) {
  const envFile = path.join(directory, '.env')
  const env = {
    ...(existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {}),
    ...inherited,
  }
  const database = path.join(directory, 'data/preview.db')
  const configured = env.DATABASE_URI || 'file:./data/payload.db'
  const resolved = (file) => (existsSync(file) ? realpathSync(file) : path.resolve(file))
  if (
    configured.startsWith('file:') &&
    resolved(path.resolve(directory, configured.slice(5))) === resolved(database)
  ) {
    throw new Error(
      'The development DATABASE_URI already uses data/preview.db. Keep preview and development databases separate.',
    )
  }
  if (existsSync(database)) {
    const db = new DatabaseSync(database, { readOnly: true })
    try {
      const migrations = db
        .prepare("SELECT name FROM sqlite_master WHERE name = 'payload_migrations'")
        .get()
      if (
        migrations &&
        db.prepare('SELECT 1 FROM payload_migrations WHERE batch = -1 LIMIT 1').get()
      ) {
        throw new Error(
          'data/preview.db was used in development mode. Move it aside before previewing; no data has been changed.',
        )
      }
    } finally {
      db.close()
    }
  }
  mkdirSync(path.dirname(database), { recursive: true })
  return { ...env, NODE_ENV: 'production', IS_LIVE: 'false', DATABASE_URI: `file:${database}` }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const env = previewEnvironment(process.cwd())
  console.log('Preview uses data/preview.db. Your development database is unchanged.')
  console.log(
    'On a fresh preview database, create an admin account at /admin. Development auto-login is disabled.',
  )
  const child = spawn(
    process.execPath,
    [
      fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
      'preview',
      ...process.argv.slice(2),
    ],
    { env, stdio: 'inherit' },
  )
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
  child.on('error', (error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  child.on('exit', (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0)
  })
}
