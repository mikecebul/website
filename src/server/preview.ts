import { getCookie, getRequestHeaders } from '@tanstack/react-start/server'
import type { Payload } from 'payload'
import { checkRole } from '@/access/checkRole'

export async function getPreviewUser(payload: Payload) {
  if (getCookie('payload-preview') !== 'true') return null
  const { user } = await payload.auth({ headers: getRequestHeaders() })
  return user && checkRole(['editor', 'admin', 'superAdmin'], user) ? user : null
}
