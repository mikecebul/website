import { describe, expect, it } from 'vitest'

import { formatPhoneInput, formatPhoneNumber, usPhonePattern } from './phone'

describe('U.S. phone numbers', () => {
  it.each([
    ['5555555555', '(555) 555-5555'],
    ['15555555555', '(555) 555-5555'],
    ['+1 (555) 555-5555', '(555) 555-5555'],
    ['1-555-555-5555', '(555) 555-5555'],
  ])('formats %s for display', (value, expected) => {
    expect(formatPhoneNumber(value)).toBe(expected)
  })

  it.each([
    ['5', '(5'],
    ['5555', '(555) 5'],
    ['5555555', '(555) 555-5'],
    ['5555555555', '(555) 555-5555'],
    ['15555555555', '(555) 555-5555'],
  ])('formats %s progressively while typing', (value, expected) => {
    expect(formatPhoneInput(value)).toBe(expected)
  })

  it('does not silently truncate an invalid overlong number', () => {
    expect(formatPhoneInput('25555555555')).toBe('25555555555')
  })

  it.each(['5555555555', '15555555555', '+1 (555) 555-5555', '1-555-555-5555', '(555) 555-5555'])(
    'accepts %s',
    (value) => {
      expect(usPhonePattern.test(value)).toBe(true)
    },
  )

  it.each(['25555555555', '1555555555', '5551555555', '(555555-5555'])('rejects %s', (value) => {
    expect(usPhonePattern.test(value)).toBe(false)
  })
})
