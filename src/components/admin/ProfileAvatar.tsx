'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ProfileAvatar({ name, src }: { name: string; src?: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <Avatar className="studio-profile-avatar" size="lg" aria-label={`${name}'s profile image`}>
      {src ? <AvatarImage src={src} alt={`${name}'s headshot`} /> : null}
      <AvatarFallback>{initials || 'U'}</AvatarFallback>
    </Avatar>
  )
}
