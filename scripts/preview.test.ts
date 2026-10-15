import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, it } from 'vitest'
import { previewEnvironment } from './preview.mjs'

const directories: string[] = []
function checkout() {
  const directory = mkdtempSync(path.join(tmpdir(), 'website-preview-'))
  directories.push(directory)
  return directory
}
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

describe('production preview environment', () => {
  it('isolates the preview database while preserving the development file and env', () => {
    const directory = checkout()
    mkdirSync(path.join(directory, 'data'))
    const envText = 'DATABASE_URI=file:./data/payload.db\nPAYLOAD_SECRET=fixture-secret\n'
    writeFileSync(path.join(directory, '.env'), envText)
    const db = new DatabaseSync(path.join(directory, 'data/payload.db'))
    db.exec(
      'CREATE TABLE payload_migrations (batch INTEGER); INSERT INTO payload_migrations VALUES (-1)',
    )
    db.close()
    const before = readFileSync(path.join(directory, 'data/payload.db'))
    const env = previewEnvironment(directory, { NODE_ENV: 'development', IS_LIVE: 'true' })
    expect(env.DATABASE_URI).toBe(`file:${directory}/data/preview.db`)
    expect(env.PAYLOAD_SECRET).toBe('fixture-secret')
    expect(env.NODE_ENV).toBe('production')
    expect(env.IS_LIVE).toBe('false')
    expect(readFileSync(path.join(directory, 'data/payload.db'))).toEqual(before)
    expect(readFileSync(path.join(directory, '.env'), 'utf8')).toBe(envText)
  })

  it('refuses a preview database that was schema-pushed in development', () => {
    const directory = checkout()
    mkdirSync(path.join(directory, 'data'))
    const db = new DatabaseSync(path.join(directory, 'data/preview.db'))
    db.exec(
      'CREATE TABLE payload_migrations (batch INTEGER); INSERT INTO payload_migrations VALUES (-1)',
    )
    db.close()
    const before = readFileSync(path.join(directory, 'data/preview.db'))
    expect(() => previewEnvironment(directory, {})).toThrow('development mode')
    expect(readFileSync(path.join(directory, 'data/preview.db'))).toEqual(before)
  })

  it('refuses to reuse the configured development database as preview', () => {
    const directory = checkout()
    expect(() => previewEnvironment(directory, { DATABASE_URI: 'file:./data/preview.db' })).toThrow(
      'separate',
    )
  })

  it('reuses a production-migrated preview database and honors shell settings', () => {
    const directory = checkout()
    mkdirSync(path.join(directory, 'data'))
    writeFileSync(path.join(directory, '.env'), 'PAYLOAD_SECRET=file-secret\n')
    const db = new DatabaseSync(path.join(directory, 'data/preview.db'))
    db.exec(
      'CREATE TABLE payload_migrations (batch INTEGER); INSERT INTO payload_migrations VALUES (1)',
    )
    db.close()
    expect(previewEnvironment(directory, { PAYLOAD_SECRET: 'shell-secret' }).PAYLOAD_SECRET).toBe(
      'shell-secret',
    )
  })
})
