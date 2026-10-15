import { createHash, randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    port: { type: 'string', default: '3000' },
    'mailpit-smtp-port': { type: 'string', default: '1025' },
    'mailpit-ui-port': { type: 'string', default: '8025' },
    'copy-db': { type: 'string' },
  },
})

for (const key of ['port', 'mailpit-smtp-port', 'mailpit-ui-port']) {
  if (!/^\d+$/.test(values[key]) || Number(values[key]) < 1 || Number(values[key]) > 65535) {
    throw new Error(`--${key} must be a port between 1 and 65535.`)
  }
}
if (
  new Set([values.port, values['mailpit-smtp-port'], values['mailpit-ui-port']].map(Number))
    .size !== 3
) {
  throw new Error('The app, SMTP and Mailpit UI must use different ports.')
}

const envPath = path.resolve('.env')
const databasePath = path.resolve('data/payload.db')
const sourcePath = values['copy-db'] && path.resolve(values['copy-db'])

// Refuse partial reconfiguration: an existing environment may point at another DB.
if (existsSync(envPath)) {
  throw new Error('.env already exists; leaving it and the database unchanged. Edit it manually.')
}
if (sourcePath && (!existsSync(sourcePath) || existsSync(databasePath))) {
  throw new Error(
    '--copy-db needs an existing source file and a destination without data/payload.db.',
  )
}

mkdirSync(path.dirname(databasePath), { recursive: true })
if (sourcePath) {
  // SQLite's backup API includes committed WAL data, even while the source app runs.
  const { DatabaseSync, backup } = await import('node:sqlite')
  const source = new DatabaseSync(sourcePath, { readOnly: true })
  try {
    await backup(source, databasePath)
  } finally {
    source.close()
  }
}

const project = `website-${createHash('sha256').update(process.cwd()).digest('hex').slice(0, 10)}`
const overrides = {
  PAYLOAD_SECRET: randomBytes(32).toString('hex'),
  PREVIEW_SECRET: randomBytes(32).toString('hex'),
  SERVER_URL: `http://localhost:${values.port}`,
  DEV_PORT: values.port,
  EMAIL_PORT: values['mailpit-smtp-port'],
  MAILPIT_SMTP_PORT: values['mailpit-smtp-port'],
  MAILPIT_UI_PORT: values['mailpit-ui-port'],
}
let env = readFileSync('.env.example', 'utf8')
for (const [key, value] of Object.entries(overrides)) {
  env = env.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`)
}
env += `\n# Isolate this worktree's Mailpit container and volume.\nCOMPOSE_PROJECT_NAME=${project}\n`
writeFileSync(envPath, env, { flag: 'wx', mode: 0o600 })

console.log(`Local environment ready at ${overrides.SERVER_URL}`)
console.log(
  sourcePath
    ? 'Copied local SQLite snapshot.'
    : 'Payload creates and seeds SQLite on first pnpm dev.',
)
console.log(
  `Run docker compose up -d, then pnpm dev. Mailpit: http://localhost:${values['mailpit-ui-port']}`,
)
