import type { CollectionConfig } from 'payload'
import { denyPublic, isEditor } from '@/lib/server/access'

export const StarterKitAssets: CollectionConfig = {
  slug: 'starter-kit-assets',
  upload: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'],
    filesRequiredOnCreate: true,
  },
  admin: {
    useAsTitle: 'filename',
    description: 'Private delivery assets. Access is authorized by signed download tokens, not by an unlisted URL.',
    defaultColumns: ['filename', 'kitVersion', 'updatedAt'],
  },
  access: {
    read: denyPublic,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'kitVersion', type: 'text', required: true, maxLength: 40 },
    { name: 'description', type: 'textarea', maxLength: 500 },
  ],
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        const requestFile = req.file
        if (
          (operation === 'create' || operation === 'update') &&
          requestFile?.size &&
          requestFile.size > 50_000_000
        ) {
          throw new Error('Starter Kit files must be 50 MB or smaller.')
        }
      },
    ],
  },
}
