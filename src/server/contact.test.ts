import { beforeEach, describe, expect, it, vi } from 'vitest'
import { websiteContent } from '@/lib/website-content'

const cms = vi.hoisted(() => ({
  create: vi.fn(),
  sendEmail: vi.fn(),
  logger: { error: vi.fn() },
  email: { defaultFromAddress: 'website@example.test' },
}))
vi.mock('payload', () => ({ getPayload: vi.fn(async () => cms) }))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('react-email', () => ({ render: vi.fn(async () => '<p>Inquiry</p>') }))
vi.mock('@/emails/ContactEmail', () => ({ default: () => null }))
import { POST } from './contact'

const data = {
  name: 'Test Client',
  email: 'client@example.test',
  phone: '(231) 555-0123',
  inquiryType: websiteContent.contact.inquiryTypes[0],
  message: 'A test website project inquiry.',
}
function request(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  cms.create.mockResolvedValue({ id: 'test' })
  cms.sendEmail.mockResolvedValue({})
  vi.stubEnv('CONTACT_TO_EMAIL', 'staff@example.test')
})

describe('form submission persistence', () => {
  it('stores a validated submission as unread before notifying staff', async () => {
    expect((await POST(request({ ...data, isRead: true }))).status).toBe(200)
    expect(cms.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'contacts',
        data: expect.objectContaining({ isRead: false, email: data.email }),
      }),
    )
    expect(cms.create.mock.invocationCallOrder[0]).toBeLessThan(
      cms.sendEmail.mock.invocationCallOrder[0],
    )
    expect(cms.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'staff@example.test' }),
    )
  })
  it('retains a submission and reports success if notification delivery fails', async () => {
    cms.sendEmail.mockRejectedValueOnce(new Error('Mail unavailable'))
    expect((await POST(request(data))).status).toBe(200)
    expect(cms.create).toHaveBeenCalledTimes(1)
    expect(cms.logger.error).toHaveBeenCalled()
  })
  it.each(['', undefined, '   '])(
    'preserves the inquiry when the recipient is missing (%s)',
    async (to) => {
      vi.stubEnv('CONTACT_TO_EMAIL', to)
      expect((await POST(request(data))).status).toBe(200)
      expect(cms.create).toHaveBeenCalledTimes(1)
      expect(cms.sendEmail).not.toHaveBeenCalled()
      expect(cms.logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          err: expect.objectContaining({
            message: 'Missing CONTACT_TO_EMAIL for contact submission delivery.',
          }),
        }),
      )
    },
  )
  it('rejects invalid form data before storage', async () => {
    expect((await POST(request({ ...data, email: 'invalid' }))).status).toBe(400)
    expect(cms.create).not.toHaveBeenCalled()
  })
  it('reports failure when the submission cannot be stored', async () => {
    cms.create.mockRejectedValueOnce(new Error('Database unavailable'))
    expect((await POST(request(data))).status).toBe(500)
    expect(cms.sendEmail).not.toHaveBeenCalled()
  })
})
