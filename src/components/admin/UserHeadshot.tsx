import type { PayloadRequest, ServerProps } from 'payload'
import type { Media } from '@/payload-types'
import { ProfileAvatar } from './ProfileAvatar'

export default async function UserHeadshot({
  payload,
  user,
  req,
}: ServerProps & { req?: PayloadRequest }) {
  let media: Media | undefined
  const headshot = user?.headshot
  if (headshot && typeof headshot === 'object') {
    media = headshot
  } else if (typeof headshot === 'number' || typeof headshot === 'string') {
    try {
      media = await payload.findByID({
        collection: 'media',
        id: headshot,
        depth: 0,
        overrideAccess: false,
        req,
        user,
      })
    } catch {
      // A missing media document should not prevent access to the account menu.
    }
  }

  return (
    <ProfileAvatar
      name={user?.name || user?.email || 'User'}
      src={media?.variants?.thumbnail?.url || media?.thumbnailURL || media?.url || undefined}
    />
  )
}
