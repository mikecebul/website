import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { devAdmin, isDevSeedEnabled, seedDevelopment } from '../src/server/dev-seed'

assert.match(
  process.env.DATABASE_URI || '',
  /^file:\/(?:private\/)?tmp\/website-dev-seed-[a-zA-Z0-9-]+\.db$/,
)
assert.equal(process.env.S3_ENABLED, 'false')
assert.equal(isDevSeedEnabled(), true)

const payload = await getPayload({ config })
try {
  const login = await payload.login({ collection: 'users', data: devAdmin })
  assert.ok(login.user)
  assert.equal(login.user.role, 'superAdmin')
  assert.equal((await payload.auth({ headers: new Headers() })).user?.id, login.user.id)
  assert.equal((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs, 1)
  const blogs = await payload.find({ collection: 'blogs', sort: 'slug' })
  assert.equal(blogs.totalDocs, 3)
  for (const blog of blogs.docs) {
    assert.equal(blog._status, 'published')
    assert.ok(blog.firstPublishedAt)
    assert.equal(blog.content.root.children.length, 3)
  }

  // Seed against existing users, including another super admin, and preserve draft edits.
  const otherAdmin = await payload.create({
    collection: 'users',
    user: login.user,
    data: { email: 'other@example.test', password: 'fixture-password', role: 'superAdmin' },
  })
  await payload.update({
    collection: 'users',
    id: login.user.id,
    user: otherAdmin,
    data: { role: 'editor', password: 'changed-password' },
  })
  await payload.update({
    collection: 'blogs',
    id: blogs.docs[0].id,
    user: otherAdmin,
    draft: true,
    data: { title: 'My edited sample', _status: 'draft' },
  })
  await seedDevelopment(payload)
  assert.equal(
    (await payload.login({ collection: 'users', data: devAdmin })).user?.role,
    'superAdmin',
  )
  assert.equal((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs, 2)
  assert.equal((await payload.count({ collection: 'blogs', overrideAccess: true })).totalDocs, 3)
  assert.equal(
    (
      await payload.findByID({
        collection: 'blogs',
        id: blogs.docs[0].id,
        draft: true,
        overrideAccess: true,
      })
    ).title,
    'My edited sample',
  )

  await payload.delete({ collection: 'users', id: login.user.id, user: otherAdmin })
  await payload.delete({ collection: 'blogs', id: blogs.docs[1].id, overrideAccess: true })
  await seedDevelopment(payload)
  assert.equal(
    (await payload.login({ collection: 'users', data: devAdmin })).user?.role,
    'superAdmin',
  )
  assert.equal((await payload.count({ collection: 'blogs', overrideAccess: true })).totalDocs, 3)

  process.env.DEV_SEED = 'false'
  assert.equal(isDevSeedEnabled(), false)
  process.env.DEV_SEED = 'true'
  Reflect.deleteProperty(process.env, 'NODE_ENV')
  assert.equal(isDevSeedEnabled(), false)
  await seedDevelopment({} as typeof payload)
  Object.assign(process.env, { NODE_ENV: 'production' })
  assert.equal(isDevSeedEnabled(), false)
  // A guard failure would immediately throw while accessing this empty instance.
  await seedDevelopment({} as typeof payload)
  Object.assign(process.env, { NODE_ENV: 'test' })
  assert.equal(isDevSeedEnabled(), false)
  await seedDevelopment({} as typeof payload)
  console.log(
    'PASS dev login, auto-login, published blogs, repeat seeding, draft preservation, account restoration, and environment guards',
  )
} finally {
  await payload.destroy()
}
