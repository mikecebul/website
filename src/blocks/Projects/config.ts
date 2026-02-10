import type { Block } from 'payload'
import { linkGroup } from '@/fields/link/linkGroup'

export const Projects: Block = {
  slug: 'projects',
  interfaceName: 'ProjectsBlock',
  labels: {
    singular: 'Projects',
    plural: 'Projects',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Recent Projects',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Check out some of my most recent projects',
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/components/RowLabel/RowLabelWithTitle',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'pills',
          label: 'Pills',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
        linkGroup({
          overrides: {
            maxRows: 2,
            admin: {
              description: 'Add up to two links (for example: View Code and Live Site).',
              components: {
                RowLabel: '@/fields/link/LinkRowLabel',
              },
            },
          },
        }),
      ],
    },
  ],
}
