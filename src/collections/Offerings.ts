import type { CollectionConfig } from 'payload'
import { isEditor, publicContentRead } from '@/lib/server/access'

export const Offerings: CollectionConfig = {
  slug: 'offerings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'availability', '_status'],
  },
  access: {
    read: publicContentRead,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
    readVersions: isEditor,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    { name: 'slug', type: 'text', required: true, unique: true, maxLength: 120 },
    { name: 'description', type: 'textarea', required: true, maxLength: 1000 },
    {
      name: 'availability',
      type: 'select',
      required: true,
      options: [
        { label: 'Preview', value: 'preview' },
        { label: 'Waitlist', value: 'waitlist' },
        { label: 'Available', value: 'available' },
      ],
    },
    { name: 'ctaLabel', type: 'text', maxLength: 80 },
    { name: 'ctaDestination', type: 'text', maxLength: 300 },
    {
      name: 'waitlistInterest',
      type: 'select',
      options: [
        { label: 'Course', value: 'course' },
        { label: 'Community', value: 'community' },
        { label: 'Shop', value: 'shop' },
      ],
    },
  ],
}
