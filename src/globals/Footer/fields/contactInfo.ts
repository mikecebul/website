import deepMerge from '@/utilities/deepMerge'
import type { Field, GroupField } from 'payload'

type ContactGroupType = ({ overrides }?: { overrides?: Partial<GroupField> }) => Field

const contactInfo: ContactGroupType = ({ overrides = {} } = {}) => {
  const contactsField: Field = {
    name: 'contact',
    type: 'group',
    admin: {
      hideGutter: true,
      description: 'Company contact information.',
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'text',
            defaultValue: '(231) 547-1144',
            admin: { width: '45%' },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'email',
            label: 'Email',
            type: 'text',
            defaultValue: 'mike@mikecebul.com',
            admin: { width: '45%' },
          },
        ],
      },
    ],
  }
  return deepMerge(contactsField, overrides)
}

export default contactInfo
