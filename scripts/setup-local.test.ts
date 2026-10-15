import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, copyFileSync, rmSync, statSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, it } from 'vitest'

const script = path.resolve('scripts/setup-local.mjs')
const directories: string[] = []
function checkout() {
  const directory = mkdtempSync(path.join(tmpdir(), 'website-local-'))
  directories.push(directory)
  copyFileSync('.env.example', path.join(directory, '.env.example'))
  return directory
}
function setup(directory: string, ...args: string[]) {
  return execFileSync(process.execPath, [script, ...args], { cwd: directory, stdio: 'pipe' })
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

describe('local checkout setup', () => {
  it('creates isolated environments with matching app and email ports and private secrets', () => {
    const first = checkout()
    const second = checkout()
    setup(first, '--port', '3010', '--mailpit-smtp-port', '1035', '--mailpit-ui-port', '8035')
    setup(second)
    const env = readFileSync(path.join(first, '.env'), 'utf8')
    const other = readFileSync(path.join(second, '.env'), 'utf8')
    expect(env).toContain('SERVER_URL=http://localhost:3010\nDEV_PORT=3010')
    expect(env).toContain('EMAIL_PORT=1035')
    expect(env).toContain('MAILPIT_SMTP_PORT=1035')
    expect(env).toContain('MAILPIT_UI_PORT=8035')
    expect(env).toMatch(/PAYLOAD_SECRET=[a-f0-9]{64}\n/)
    expect(env).toMatch(/PREVIEW_SECRET=[a-f0-9]{64}\n/)
    expect(env.match(/COMPOSE_PROJECT_NAME=.*/)?.[0]).not.toBe(
      other.match(/COMPOSE_PROJECT_NAME=.*/)?.[0],
    )
    expect(env.match(/PAYLOAD_SECRET=.*/)?.[0]).not.toBe(other.match(/PAYLOAD_SECRET=.*/)?.[0])
    expect(statSync(path.join(first, '.env')).mode & 0o777).toBe(0o600)
    expect(existsSync(path.join(first, 'data'))).toBe(true)
    expect(existsSync(path.join(first, 'data/payload.db'))).toBe(false)
  })

  it('preserves an existing environment and database when rerun', () => {
    const directory = checkout()
    setup(directory)
    const env = readFileSync(path.join(directory, '.env'), 'utf8')
    const database = new DatabaseSync(path.join(directory, 'data/payload.db'))
    database.exec('CREATE TABLE existing (id INTEGER)')
    database.close()
    expect(() => setup(directory, '--port', '3011')).toThrow()
    expect(readFileSync(path.join(directory, '.env'), 'utf8')).toBe(env)
    const saved = new DatabaseSync(path.join(directory, 'data/payload.db'))
    expect(
      saved.prepare("SELECT name FROM sqlite_master WHERE name = 'existing'").get(),
    ).toBeDefined()
    saved.close()
  })

  it('copies committed WAL content without modifying the source or overwriting a destination', () => {
    const original = checkout()
    const directory = checkout()
    const sourcePath = path.join(original, 'source.db')
    const source = new DatabaseSync(sourcePath)
    try {
      source.exec(
        "PRAGMA journal_mode=WAL; CREATE TABLE content (title TEXT); INSERT INTO content VALUES ('Local post')",
      )
      setup(directory, '--copy-db', sourcePath)
      const copy = new DatabaseSync(path.join(directory, 'data/payload.db'))
      try {
        expect(copy.prepare('SELECT title FROM content').get()?.title).toBe('Local post')
        copy.exec("INSERT INTO content VALUES ('Copy only')")
        expect(source.prepare('SELECT COUNT(*) AS total FROM content').get()?.total).toBe(1)
      } finally {
        copy.close()
      }
      rmSync(path.join(directory, '.env'))
      expect(() => setup(directory, '--copy-db', sourcePath)).toThrow()
      expect(existsSync(path.join(directory, '.env'))).toBe(false)
    } finally {
      source.close()
    }
  })

  it.each([
    ['--port', '0'],
    ['--port', '65536'],
    ['--port', '3000oops'],
    ['--port', '1025'],
    ['--port', '01025'],
    ['--copy-db', '/missing/website-local.db'],
  ])('refuses invalid setup arguments %s %s without writing .env', (...args) => {
    const directory = checkout()
    expect(() => setup(directory, ...args)).toThrow()
    expect(existsSync(path.join(directory, '.env'))).toBe(false)
  })
})
