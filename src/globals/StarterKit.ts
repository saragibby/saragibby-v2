import type { GlobalConfig } from 'payload'
import { isEditor } from '@/lib/server/access'

export const StarterKit: GlobalConfig = {
  slug: 'starterKit',
  label: 'Starter Kit',
  access: {
    read: () => true,
    update: isEditor,
  },
  fields: [
    { name: 'version', type: 'text', required: true, maxLength: 40 },
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    { name: 'description', type: 'textarea', maxLength: 500 },
    {
      name: 'deliveryCopy',
      type: 'textarea',
      required: true,
      maxLength: 2000,
      admin: { description: 'Included in the private delivery email.' },
    },
    {
      name: 'assets',
      type: 'relationship',
      relationTo: 'starter-kit-assets',
      hasMany: true,
      required: true,
    },
  ],
}
