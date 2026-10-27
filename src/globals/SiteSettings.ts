import type { GlobalConfig } from 'payload'
import { isEditor } from '@/lib/server/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site',
  label: 'Site settings',
  access: {
    read: () => true,
    update: isEditor,
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Sara Gibby' },
    { name: 'siteDescription', type: 'textarea', maxLength: 300 },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'navigation',
      type: 'array',
      maxRows: 10,
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 60 },
        { name: 'href', type: 'text', required: true, maxLength: 300 },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 60 },
        { name: 'url', type: 'text', required: true, maxLength: 500 },
      ],
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', maxLength: 70 },
        { name: 'description', type: 'textarea', maxLength: 180 },
        { name: 'socialImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
