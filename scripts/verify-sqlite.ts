import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createPayloadRequest, getPayload, JWT_AUTH_VERSION } from 'payload'
import jwt from 'jsonwebtoken'

import config from '../src/payload.config'

// Only an isolated temporary SQLite file may be used for this fixture suite.
assert.match(
  process.env.DATABASE_URI || '',
  /^file:\/(?:private\/)?tmp\/website-sqlite-fixture-[a-zA-Z0-9-]+\.db$/,
)
assert.notEqual(process.env.S3_ENABLED, 'true')
const payload = await getPayload({ config })
const req = await createPayloadRequest({ payload })
const marker = `sqlite-fixture-${randomUUID()}`
let userID: string | number | undefined
let editorID: string | number | undefined
let blogID: string | number | undefined
let contactID: string | number | undefined

function assertAuthor(
  reference:
    { relationTo: string; value: string | number | { id: string | number } } | null | undefined,
  expectedID: string | number,
) {
  assert.ok(reference)
  assert.equal(reference.relationTo, 'users')
  assert.equal(
    typeof reference.value === 'object' ? reference.value.id : reference.value,
    expectedID,
  )
}

try {
  for (const collection of ['blogs', 'media', 'contacts'] as const) {
    assert.ok(payload.collections[collection].config.versions)
  }
  for (const collection of ['blogs', 'media', 'contacts', 'users'] as const) {
    assert.deepEqual(payload.collections[collection].config.authorship, {
      createdBy: true,
      updatedBy: true,
    })
  }
  const user = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: { email: `${marker}@example.test`, name: marker, password: 'Local-fixture-password-42' },
  })
  userID = user.id
  assert.equal(user.role, 'superAdmin')
  assert.equal(Boolean(payload.collections.users.config.versions), false)
  const login = await payload.login({
    collection: 'users',
    data: { email: user.email, password: 'Local-fixture-password-42' },
  })
  assert.ok(login.token)
  const decoded = jwt.decode(login.token, { complete: true })
  assert.ok(decoded && typeof decoded.payload === 'object')
  assert.ok('authVersion' in decoded.header)
  assert.equal(decoded.header.authVersion, JWT_AUTH_VERSION)
  const legacyToken = jwt.sign(decoded.payload, payload.secret, { algorithm: 'HS256' })
  assert.equal(
    (await payload.auth({ headers: new Headers({ Authorization: `JWT ${legacyToken}` }) })).user,
    null,
  )
  assert.equal(
    (await payload.auth({ headers: new Headers({ Authorization: `JWT ${login.token}` }) })).user
      ?.id,
    user.id,
  )
  const blog = await payload.create({
    collection: 'blogs',
    overrideAccess: true,
    user,
    data: {
      title: marker,
      slug: marker,
      _status: 'published',
      content: {
        root: {
          type: 'root',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              version: 1,
              textFormat: 0,
              textStyle: '',
              format: '',
              indent: 0,
              direction: 'ltr',
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: marker,
                  format: 0,
                  style: '',
                  mode: 'normal',
                  detail: 0,
                },
              ],
            },
          ],
        },
      },
    },
  })
  blogID = blog.id
  assertAuthor(blog.createdBy, user.id)
  assertAuthor(blog.updatedBy, user.id)

  const editor = await payload.create({
    collection: 'users',
    overrideAccess: true,
    user,
    data: {
      email: `${marker}-editor@example.test`,
      name: `${marker} editor`,
      password: 'Local-fixture-password-42',
      role: 'editor',
    },
  })
  editorID = editor.id
  const contact = await payload.create({
    collection: 'contacts',
    overrideAccess: true,
    user,
    data: {
      name: marker,
      email: 'fixture@example.test',
      phone: '(231) 555-0123',
      inquiryType: 'Marketing website',
      message: 'Fixture contact for v4 author tracking.',
    },
  })
  contactID = contact.id
  assert.equal(contact.isRead, false)
  const unread = await payload.find({
    collection: 'contacts',
    overrideAccess: false,
    user: editor,
    where: { and: [{ id: { equals: contact.id } }, { isRead: { not_equals: true } }] },
  })
  assert.equal(unread.totalDocs, 1)
  await assert.rejects(
    payload.find({ collection: 'contacts', overrideAccess: false }),
    (error) => (error as { status?: number }).status === 403,
  )
  await assert.rejects(
    payload.create({
      collection: 'contacts',
      overrideAccess: false,
      data: {
        name: marker,
        email: 'fixture@example.test',
        phone: '(231) 555-0123',
        inquiryType: 'Marketing website',
        message: 'Unauthorized public creation',
      },
    }),
    (error) => (error as { status?: number }).status === 403,
  )
  await payload.update({
    collection: 'contacts',
    where: { id: { in: [contact.id] } },
    overrideAccess: false,
    user: editor,
    data: { isRead: true },
  })
  assert.equal(
    (
      await payload.find({
        collection: 'contacts',
        overrideAccess: false,
        user: editor,
        where: { and: [{ id: { equals: contact.id } }, { isRead: { not_equals: true } }] },
      })
    ).totalDocs,
    0,
  )
  console.log(
    'PASS unread submission defaults, staff read actions, and anonymous access protection',
  )
  assertAuthor(contact.createdBy, user.id)
  const edited = await payload.update({
    collection: 'contacts',
    id: contact.id,
    overrideAccess: false,
    user: editor,
    data: {
      message: 'Fixture contact edited by a different user.',
      createdBy: { relationTo: 'users', value: editor.id },
      updatedBy: { relationTo: 'users', value: user.id },
    },
  })
  assertAuthor(edited.createdBy, user.id)
  assertAuthor(edited.updatedBy, editor.id)
  const contactVersions = await payload.findVersions({
    collection: 'contacts',
    overrideAccess: false,
    user: editor,
  })
  assert.ok(contactVersions.totalDocs >= 2)
  await assert.rejects(
    payload.findVersions({ collection: 'contacts', overrideAccess: false }),
    (error) => (error as { status?: number }).status === 403,
  )
  console.log(
    'PASS v4 history and authorship defaults, creator preservation, editor tracking, and spoof protection',
  )
  await assert.rejects(
    payload.findVersions({ collection: 'blogs', overrideAccess: false }),
    (error) => (error as { status?: number }).status === 403,
  )
  const versions = await payload.findVersions({ collection: 'blogs', overrideAccess: false, user })
  assert.ok(versions.totalDocs > 0)
  await assert.rejects(
    payload.findVersions({ collection: 'media', overrideAccess: false }),
    (error) => (error as { status?: number }).status === 403,
  )

  const apiKey = randomUUID()
  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    user,
    data: { apiKey },
  })
  const authenticated = await payload.auth({
    headers: new Headers({ Authorization: `users API-Key ${apiKey}` }),
  })
  assert.equal(authenticated.user?.id, user.id)
  const returned = await payload.findByID({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
  })
  assert.equal(returned.apiKey, undefined)
  assert.equal(returned.apiKeyLast4, apiKey.slice(-4))
  assert.ok(!('enableAPIKey' in returned))
  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    user,
    data: { apiKey: null },
  })
  assert.equal(
    (await payload.auth({ headers: new Headers({ Authorization: `users API-Key ${apiKey}` }) }))
      .user,
    null,
  )
  assert.equal(
    (await payload.db.drizzle.$client.execute('PRAGMA integrity_check')).rows[0].integrity_check,
    'ok',
  )
  console.log(
    'PASS private history, first-user role, disabled user versions, JWT compatibility, and API-key creation/redaction/revocation',
  )
} finally {
  if (contactID)
    await payload.delete({ collection: 'contacts', id: contactID, overrideAccess: true })
  if (blogID) await payload.delete({ collection: 'blogs', id: blogID, overrideAccess: true })
  if (editorID) await payload.delete({ collection: 'users', id: editorID, overrideAccess: true })
  if (userID) await payload.delete({ collection: 'users', id: userID, overrideAccess: true })
  await payload.destroy()
}
