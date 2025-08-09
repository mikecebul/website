import type { AccessArgs } from 'payload'
import { checkRole } from './checkRole'
import { User } from '@/payload-types'

export const superAdmin = ({ req: { user } }: AccessArgs<User>) => {
  if (!user) return false
  return checkRole('superAdmin', user)
}