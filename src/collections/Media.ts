import type { CollectionConfig } from 'payload'
import { editorFieldAccess, isEditor } from '@/lib/server/access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    filesRequiredOnCreate: true,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description: 'Public assets only: uploaded files are publicly downloadable even when referenced by a draft. Never upload confidential draft content here.',
  },
  access: {
    read: ({ req }) =>
      req.user
        ? true
        : { accessLevel: { equals: 'public' } },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'alt', type: 'text', required: true, maxLength: 250 },
    {
      name: 'accessLevel',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [{ label: 'Public', value: 'public' }],
      access: { update: editorFieldAccess },
    },
    { name: 'attribution', type: 'text', maxLength: 300 },
  ],
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        const requestFile = req.file
        if (
          (operation === 'create' || operation === 'update') &&
          requestFile?.size &&
          requestFile.size > 10_000_000
        ) {
          throw new Error('Public media files must be 10 MB or smaller.')
        }
      },
    ],
  },
}
