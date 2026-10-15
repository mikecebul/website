import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import {
  createPayloadRequest,
  createPayloadRequestFromWebRequest,
  getPayload,
  JWT_AUTH_VERSION,
} from 'payload'
import jwt from 'jsonwebtoken'
import sharp from 'sharp'

import config from '../src/payload.config'
import * as headshotMigration from '../src/migrations/20261013_050320_add_user_headshot'
import * as featuredImageMigration from '../src/migrations/20261015_001210_add_blog_featured_image'
import { getBlogFeaturedImage } from '../src/lib/blog-seo'

// Only an isolated temporary SQLite file may be used for this fixture suite.
assert.match(
  process.env.DATABASE_URI || '',
  /^file:\/(?:private\/)?tmp\/website-sqlite-fixture-[a-zA-Z0-9-]+\.db$/,
)
assert.notEqual(process.env.S3_ENABLED, 'true')
const payload = await getPayload({ config })
const marker = `sqlite-fixture-${randomUUID()}`
let userID: string | number | undefined
let editorID: string | number | undefined
let blogID: string | number | undefined
let contactID: string | number | undefined
let mcpBlogID: string | number | undefined
let headshotID: string | number | undefined

// Exercise the plugin's real HTTP handler using isolated fixture credentials.
const mcpEndpoint = payload.config.endpoints.find(
  (endpoint) => endpoint.path === '/mcp' && endpoint.method === 'post',
)
assert.ok(mcpEndpoint)
async function mcpRequest(method: string, params: object, key?: string, query = '') {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'MCP-Protocol-Version': '2025-03-26',
  })
  if (key) headers.set('Authorization', `users API-Key ${key}`)
  const request = await createPayloadRequestFromWebRequest({
    config,
    request: new Request(`http://localhost:3000/api/mcp${query}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    }),
  })
  const response = await mcpEndpoint!.handler(request)
  assert.equal(response.status, 200)
  return response.json()
}

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
      topic: 'websites',
      summary: 'A concise published introduction.',
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
  assert.equal(blog.topic, 'websites')
  assert.equal(blog.summary, 'A concise published introduction.')

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
    user: { ...user, collection: 'users' },
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
  assertAuthor(returned.updatedBy, user.id)

  // Rolling the additive migration down and back up must retain accounts and their relationships.
  const migrationReq = await createPayloadRequest({ payload })
  const authorsBefore = await payload.db.drizzle.$client.execute('SELECT * FROM users_rels')
  const blogAuthorsBefore = await payload.db.drizzle.$client.execute('SELECT * FROM blogs_rels')
  const blogVersionsBefore = await payload.db.drizzle.$client.execute(
    'SELECT id, parent_id, version_content FROM _blogs_v',
  )
  await featuredImageMigration.down({ db: payload.db.drizzle, payload, req: migrationReq })
  await featuredImageMigration.up({ db: payload.db.drizzle, payload, req: migrationReq })
  assert.deepEqual(
    (await payload.db.drizzle.$client.execute('SELECT * FROM blogs_rels')).rows,
    blogAuthorsBefore.rows,
  )
  assert.deepEqual(
    (
      await payload.db.drizzle.$client.execute(
        'SELECT id, parent_id, version_content FROM _blogs_v',
      )
    ).rows,
    blogVersionsBefore.rows,
  )
  await headshotMigration.down({ db: payload.db.drizzle, payload, req: migrationReq })
  await headshotMigration.up({ db: payload.db.drizzle, payload, req: migrationReq })
  assert.deepEqual(
    (await payload.db.drizzle.$client.execute('SELECT * FROM users_rels')).rows,
    authorsBefore.rows,
  )
  assert.equal(
    (await payload.auth({ headers: new Headers({ Authorization: `JWT ${login.token}` }) })).user
      ?.id,
    user.id,
  )
  assert.equal(
    (await payload.auth({ headers: new Headers({ Authorization: `users API-Key ${apiKey}` }) }))
      .user?.id,
    user.id,
  )
  const image = await sharp({
    create: { width: 40, height: 40, channels: 3, background: '#172f40' },
  })
    .png()
    .toBuffer()
  const headshot = await payload.create({
    collection: 'media',
    overrideAccess: true,
    user,
    data: { alt: 'Isolated headshot fixture' },
    file: { data: image, name: `${marker}.png`, mimetype: 'image/png', size: image.length },
  })
  headshotID = headshot.id
  await payload.update({
    collection: 'blogs',
    id: blog.id,
    overrideAccess: false,
    user,
    data: { featuredImage: headshot.id, _status: 'published' },
  })
  const publicBlog = await payload.findByID({
    collection: 'blogs',
    id: blog.id,
    depth: 1,
    overrideAccess: false,
  })
  assert.equal(getBlogFeaturedImage(publicBlog)?.id, headshot.id)
  assert.ok(getBlogFeaturedImage(publicBlog)?.url)
  await payload.update({
    collection: 'blogs',
    id: blog.id,
    overrideAccess: false,
    user,
    draft: true,
    data: { featuredImage: null, _status: 'draft' },
  })
  assert.equal(
    getBlogFeaturedImage(
      await payload.findByID({ collection: 'blogs', id: blog.id, depth: 1, overrideAccess: false }),
    )?.id,
    headshot.id,
  )
  assert.equal(
    (
      await payload.findByID({
        collection: 'blogs',
        id: blog.id,
        draft: true,
        overrideAccess: false,
        user,
      })
    ).featuredImage,
    null,
  )
  console.log(
    'PASS featured image population, draft isolation, additive migration rollback and preserved blog versions',
  )
  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    user,
    data: { headshot: headshot.id },
  })
  const profile = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 1,
    overrideAccess: false,
    user,
  })
  assert.equal(
    typeof profile.headshot === 'object' ? profile.headshot?.id : profile.headshot,
    headshot.id,
  )
  assert.ok(
    typeof profile.headshot === 'object' &&
      (profile.headshot?.variants?.thumbnail?.url ||
        profile.headshot?.thumbnailURL ||
        profile.headshot?.url),
  )
  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    user,
    data: { headshot: null },
  })
  assert.equal(
    (await payload.db.drizzle.$client.execute('PRAGMA foreign_key_check')).rows.length,
    0,
  )
  console.log(
    'PASS headshot upload and profile population, migration rollback/reapply, preserved sessions, API keys and authorship',
  )

  const anonymousTools = await mcpRequest('tools/list', {})
  assert.ok(
    anonymousTools.error?.code === -32601 || anonymousTools.result?.tools.length === 0,
    JSON.stringify(anonymousTools),
  )
  await assert.rejects(
    mcpRequest('tools/list', {}, randomUUID()),
    (error) => (error as { status?: number }).status === 401,
  )
  await assert.rejects(
    mcpRequest('tools/list', {}, apiKey, '?overrideAccess=true'),
    (error) => (error as { status?: number }).status === 400,
  )
  const toolList = await mcpRequest('tools/list', {}, apiKey)
  assert.ok(toolList.result?.tools, JSON.stringify(toolList))
  const toolNames = toolList.result.tools.map((tool: { name: string }) => tool.name)
  for (const name of [
    'getConfigInfo',
    'getCollectionSchema',
    'findDocuments',
    'createDocuments',
    'updateDocument',
    'deleteDocuments',
    'findVersions',
    'restoreVersion',
    'getUploadInstructions',
  ])
    assert.ok(toolNames.includes(name), `Missing MCP tool: ${name}`)
  const schema = await mcpRequest(
    'tools/call',
    {
      name: 'getCollectionSchema',
      arguments: { slug: 'blogs' },
    },
    apiKey,
  )
  assert.ok(!schema.error && !schema.result.isError)
  const created = await mcpRequest(
    'tools/call',
    {
      name: 'createDocuments',
      arguments: {
        slug: 'blogs',
        draft: true,
        documents: [{ data: { title: `${marker}-mcp`, slug: `${marker}-mcp` } }],
      },
    },
    apiKey,
  )
  assert.ok(!created.error && !created.result.isError, JSON.stringify(created))
  const mcpBlog = await payload.find({
    collection: 'blogs',
    overrideAccess: true,
    draft: true,
    where: { slug: { equals: `${marker}-mcp` } },
  })
  assert.equal(mcpBlog.totalDocs, 1)
  mcpBlogID = mcpBlog.docs[0].id
  assertAuthor(mcpBlog.docs[0].createdBy, user.id)
  const updated = await mcpRequest(
    'tools/call',
    {
      name: 'updateDocument',
      arguments: {
        slug: 'blogs',
        id: mcpBlogID,
        draft: true,
        data: { title: `${marker}-mcp-edited` },
      },
    },
    apiKey,
  )
  assert.ok(!updated.error && !updated.result.isError)
  const editedMcpBlog = await payload.findByID({
    collection: 'blogs',
    id: mcpBlogID,
    overrideAccess: true,
    draft: true,
  })
  assert.equal(editedMcpBlog.title, `${marker}-mcp-edited`)
  assertAuthor(editedMcpBlog.updatedBy, user.id)
  const editorKey = randomUUID()
  await payload.update({
    collection: 'users',
    id: editorID!,
    overrideAccess: true,
    user,
    data: { apiKey: editorKey },
  })
  const denied = await mcpRequest(
    'tools/call',
    {
      name: 'updateDocument',
      arguments: {
        slug: 'blogs',
        id: mcpBlogID,
        draft: true,
        data: { title: 'Unauthorized edit' },
      },
    },
    editorKey,
  )
  assert.ok(denied.error || denied.result.isError)
  assert.equal(
    (
      await payload.findByID({
        collection: 'blogs',
        id: mcpBlogID,
        overrideAccess: true,
        draft: true,
      })
    ).title,
    `${marker}-mcp-edited`,
  )
  const deleted = await mcpRequest(
    'tools/call',
    {
      name: 'deleteDocuments',
      arguments: { slug: 'blogs', id: mcpBlogID },
    },
    apiKey,
  )
  assert.ok(!deleted.error && !deleted.result.isError)
  mcpBlogID = undefined
  console.log(
    'PASS MCP schema discovery, draft creation/edit/deletion, authorship, anonymous denial, role enforcement and production override rejection',
  )
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
  await assert.rejects(
    mcpRequest('tools/list', {}, apiKey),
    (error) => (error as { status?: number }).status === 401,
  )
  assert.equal(
    (await payload.db.drizzle.$client.execute('PRAGMA integrity_check')).rows[0].integrity_check,
    'ok',
  )
  console.log(
    'PASS private history, first-user role, disabled user versions, JWT compatibility, and API-key creation/redaction/revocation',
  )
} finally {
  if (blogID) {
    await payload.delete({ collection: 'blogs', id: blogID, overrideAccess: true })
    blogID = undefined
  }
  if (headshotID && userID) {
    await payload.update({
      collection: 'users',
      id: userID,
      overrideAccess: true,
      data: { headshot: null },
    })
    await payload.delete({ collection: 'media', id: headshotID, overrideAccess: true })
  }
  if (mcpBlogID) await payload.delete({ collection: 'blogs', id: mcpBlogID, overrideAccess: true })
  if (contactID)
    await payload.delete({ collection: 'contacts', id: contactID, overrideAccess: true })
  if (blogID) await payload.delete({ collection: 'blogs', id: blogID, overrideAccess: true })
  if (editorID) await payload.delete({ collection: 'users', id: editorID, overrideAccess: true })
  if (userID) await payload.delete({ collection: 'users', id: userID, overrideAccess: true })
  await payload.destroy()
}
