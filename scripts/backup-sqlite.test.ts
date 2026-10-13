import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'
import { gunzipSync } from 'node:zlib'

const fixtures: { dir: string; db: DatabaseSync }[] = []
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'sqlite-backup-test-'))
  const bin = join(dir, 'bin')
  mkdirSync(bin)
  const dbPath = join(dir, 'live.db')
  const db = new DatabaseSync(dbPath)
  db.exec(
    "PRAGMA journal_mode=WAL; CREATE TABLE submissions (message TEXT); INSERT INTO submissions VALUES ('committed while connection stays open');",
  )
  fixtures.push({ dir, db })
  // macOS lacks flock; exercise overlap handling here, actual locking is checked in Docker.
  writeFileSync(join(bin, 'flock'), '#!/bin/sh\n[ "${TEST_LOCKED:-}" != "true" ]\n', {
    mode: 0o700,
  })
  // The uploader is replaced locally so tests never contact real storage or need real keys.
  writeFileSync(
    join(bin, 'rclone'),
    `#!${process.execPath}
const fs=require('node:fs'); const args=process.argv.slice(2);
if(process.env.RCLONE_CONFIG_SQLITEBACKUP_SECRET_ACCESS_KEY!=='fixture-secret') process.exit(8);
if(process.env.RCLONE_CONFIG_SQLITEBACKUP_ACL!=='private') process.exit(9);
if(process.env.TEST_UPLOAD_FAIL==='true') process.exit(10);
if(args[0]==='copyto') {
 fs.copyFileSync(args[1],process.env.TEST_UPLOAD);
 fs.writeFileSync(process.env.TEST_UPLOAD+'.metadata',JSON.stringify({remote:args[2],temporaryFile:args[1]}));
} else if(args[0]==='cat') {
 process.stdout.write(process.env.TEST_CORRUPT_UPLOAD==='true'?'corrupt':fs.readFileSync(process.env.TEST_UPLOAD));
} else process.exit(11);
`,
    { mode: 0o700 },
  )
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    DATABASE_URI: `file:${dbPath}`,
    BACKUP_DESTINATION: 's3://private-bucket/website/sqlite',
    S3_ACCESS_KEY_ID: 'fixture-key',
    S3_SECRET_ACCESS_KEY: 'fixture-secret',
    S3_REGION: 'auto',
    S3_ENDPOINT: 'https://fixture.invalid',
    BACKUP_S3_ACCESS_KEY_ID: '',
    BACKUP_S3_SECRET_ACCESS_KEY: '',
    S3_BUCKET: 'public-media',
    TEST_UPLOAD: join(dir, 'uploaded.gz'),
  }
  const run = (overrides: Record<string, string> = {}) =>
    spawnSync('sh', [resolve('scripts/backup-sqlite.sh')], {
      env: { ...env, ...overrides },
      encoding: 'utf8',
      timeout: 15000,
    })
  return { dir, dbPath, run, env }
}
afterEach(() => {
  for (const { dir, db } of fixtures.splice(0)) {
    db.close()
    rmSync(dir, { recursive: true, force: true })
  }
})

describe('live SQLite backups', () => {
  it('captures committed WAL data in a restorable uploaded snapshot and cleans up', () => {
    const { dir, dbPath, run, env } = fixture()
    expect(existsSync(`${dbPath}-wal`)).toBe(true)
    const result = run()
    expect(result.status, result.stderr).toBe(0)
    const restored = join(dir, 'restored.db')
    writeFileSync(restored, gunzipSync(readFileSync(env.TEST_UPLOAD)))
    const restoredDB = new DatabaseSync(restored)
    expect(restoredDB.prepare('PRAGMA integrity_check').get()).toEqual({ integrity_check: 'ok' })
    expect(restoredDB.prepare('SELECT message FROM submissions').get()?.message).toBe(
      'committed while connection stays open',
    )
    restoredDB.close()
    const metadata = JSON.parse(readFileSync(`${env.TEST_UPLOAD}.metadata`, 'utf8'))
    expect(metadata.remote).toMatch(
      /^sqlitebackup:private-bucket\/website\/sqlite\/website-.+\.db\.gz$/,
    )
    expect(existsSync(metadata.temporaryFile)).toBe(false)
    expect(result.stdout + result.stderr).not.toContain('fixture-secret')
  })
  it('uses a complete backup credential pair and rejects a partial override', () => {
    const { run } = fixture()
    expect(
      run({
        S3_SECRET_ACCESS_KEY: 'other-media-secret',
        BACKUP_S3_ACCESS_KEY_ID: 'backup-key',
        BACKUP_S3_SECRET_ACCESS_KEY: 'fixture-secret',
      }).status,
    ).toBe(0)
    expect(run({ BACKUP_S3_ACCESS_KEY_ID: 'backup-key' }).status).not.toBe(0)
  })
  it('reports upload failure without clearing the source data', () => {
    const { run, env } = fixture()
    expect(run({ TEST_UPLOAD_FAIL: 'true' }).status).not.toBe(0)
    expect(existsSync(env.TEST_UPLOAD)).toBe(false)
  })
  it('reports a failed uploaded-byte verification', () => {
    const { run } = fixture()
    const result = run({ TEST_CORRUPT_UPLOAD: 'true' })
    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('Uploaded object did not match')
  })
  it('skips overlapping jobs without uploading another snapshot', () => {
    const { run, env } = fixture()
    const result = run({ TEST_LOCKED: 'true' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('another backup is running')
    expect(existsSync(env.TEST_UPLOAD)).toBe(false)
  })
  it('rejects the media bucket and a missing source file before uploading', () => {
    const { run, env } = fixture()
    expect(run({ BACKUP_DESTINATION: 's3://public-media/backups' }).stderr).toContain(
      'separate from the media bucket',
    )
    expect(run({ DATABASE_URI: 'file:/nonexistent/source.db' }).stderr).toContain(
      'missing or empty',
    )
    expect(existsSync(env.TEST_UPLOAD)).toBe(false)
  })
})
