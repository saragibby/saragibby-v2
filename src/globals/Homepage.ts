import type { GlobalConfig } from 'payload'
import { isEditor } from '@/lib/server/access'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: () => true,
    update: isEditor,
  },
  fields: [
    { name: 'alwaysBuilding', type: 'textarea', maxLength: 500 },
    { name: 'audienceHeading', type: 'text', maxLength: 180 },
    {
      name: 'audienceItems', type: 'array', maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 180 },
        { name: 'description', type: 'textarea', required: true, maxLength: 500 },
      ],
    },
    { name: 'offeringsHeading', type: 'text', maxLength: 180 },
    { name: 'kitHeading', type: 'text', maxLength: 180 },
    {
      name: 'kitContents', type: 'array', maxRows: 10,
      fields: [{ name: 'label', type: 'text', required: true, maxLength: 250 }],
    },
    {
      name: 'audiences', type: 'array', maxRows: 12,
      fields: [{ name: 'label', type: 'text', required: true, maxLength: 120 }],
    },
    { name: 'consultingDescription', type: 'textarea', maxLength: 700 },
    { name: 'experienceHeading', type: 'text', maxLength: 180 },
    { name: 'experienceDescription', type: 'textarea', maxLength: 500 },
    {
      name: 'industries', type: 'array', maxRows: 16,
      fields: [{ name: 'label', type: 'text', required: true, maxLength: 120 }],
    },
    {
      name: 'ventures', type: 'array', maxRows: 8,
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 180 },
        { name: 'role', type: 'text', maxLength: 180 },
        { name: 'description', type: 'textarea', maxLength: 500 },
      ],
    },
    { name: 'closingHeading', type: 'text', maxLength: 180 },
    { name: 'closingDescription', type: 'textarea', maxLength: 500 },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', maxLength: 80 },
        { name: 'heading', type: 'text', required: true, maxLength: 180 },
        { name: 'description', type: 'textarea', maxLength: 500 },
        { name: 'portrait', type: 'upload', relationTo: 'media' },
        { name: 'primaryLabel', type: 'text', maxLength: 80 },
        { name: 'primaryHref', type: 'text', maxLength: 300 },
      ],
    },
    {
      name: 'credibilityItems',
      type: 'array',
      maxRows: 8,
      fields: [{ name: 'label', type: 'text', required: true, maxLength: 120 }],
    },
    {
      name: 'story',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', maxLength: 180 },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'featuredResources',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
      maxRows: 4,
    },
    {
      name: 'offerings',
      type: 'relationship',
      relationTo: 'offerings',
      hasMany: true,
      maxRows: 8,
    },
  ],
}
