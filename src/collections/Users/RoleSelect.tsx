'use client'

import { SelectField, useAuth, useField } from '@payloadcms/ui'
import type { User } from 'payload'
import { SelectFieldClientComponent } from 'payload'
import { useEffect, useState } from 'react'

const RoleSelectClient: SelectFieldClientComponent = ({ path, validate }) => {
  const { value, setValue } = useField<string>({ path })
  const { user } = useAuth<User>()
  const [superAdminCount, setSuperAdminCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadSuperAdminCount = async () => {
      try {
        const response = await fetch('/api/users?limit=0&depth=0&where[role][equals]=superAdmin', {
          credentials: 'include',
        })

        if (!response.ok) return

        const data = (await response.json()) as { totalDocs?: number }

        if (!cancelled) {
          setSuperAdminCount(typeof data.totalDocs === 'number' ? data.totalDocs : 0)
        }
      } catch {
        if (!cancelled) {
          setSuperAdminCount(null)
        }
      }
    }

    void loadSuperAdminCount()

    return () => {
      cancelled = true
    }
  }, [])

  const canAssignSuperAdmin = user?.role === 'superAdmin' || superAdminCount === 0
  const isOnlySuperAdmin = value === 'superAdmin' && superAdminCount === 1

  const options = () => {
    const baseOptions = [
      {
        label: 'Admin',
        value: 'admin',
      },
      {
        label: 'Editor',
        value: 'editor',
      },
      {
        label: 'User',
        value: 'user',
      },
    ]

    if (canAssignSuperAdmin || value === 'superAdmin') {
      return [
        {
          label: 'Super Admin',
          value: 'superAdmin',
        },
        ...baseOptions,
      ]
    }

    return baseOptions
  }

  const onChange = (nextValue: string | string[]) => {
    if (Array.isArray(nextValue)) return

    if (!canAssignSuperAdmin && nextValue === 'superAdmin') return
    if (isOnlySuperAdmin && nextValue !== 'superAdmin') return
    if (user?.role === 'editor') return

    setValue(nextValue)
  }

  return (
    <>
      <label className="field-label">Role Select</label>
      <SelectField
        path={path}
        field={{
          name: path,
          hasMany: false,
          options: options(),
        }}
        readOnly={user?.role === 'editor' || isOnlySuperAdmin}
        value={value}
        onChange={onChange}
        validate={validate}
      />
    </>
  )
}

export default RoleSelectClient
