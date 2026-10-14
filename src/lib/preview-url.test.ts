import { describe, expect, it } from 'vitest'
import { getPreviewOrigin } from './preview-url'

describe('preview origin behind a TLS proxy', () => {
  const serverURL = 'https://www.mikecebul.com'

  it('uses the forwarded HTTPS protocol for internal HTTP requests', () => {
    expect(
      getPreviewOrigin(
        {
          url: 'http://www.mikecebul.com/admin/collections/blogs/2',
          headers: new Headers({ 'x-forwarded-proto': 'https, http' }),
        },
        serverURL,
      ),
    ).toBe(serverURL)
  })

  it('falls back to the configured public protocol on the production host', () => {
    expect(
      getPreviewOrigin(
        {
          url: 'http://www.mikecebul.com/admin/collections/blogs/2',
          headers: new Headers(),
        },
        serverURL,
      ),
    ).toBe(serverURL)
  })

  it('preserves the local development origin and port', () => {
    expect(
      getPreviewOrigin(
        {
          url: 'http://localhost:3000/admin/collections/blogs/1',
          headers: new Headers(),
        },
        serverURL,
      ),
    ).toBe('http://localhost:3000')
  })

  it('ignores invalid forwarded protocols', () => {
    expect(
      getPreviewOrigin(
        {
          url: 'http://www.mikecebul.com/admin',
          headers: new Headers({ 'x-forwarded-proto': 'javascript' }),
        },
        serverURL,
      ),
    ).toBe(serverURL)
  })
})
