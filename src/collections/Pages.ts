import type { CollectionConfig } from 'payload'
import { adminFieldAccess, isEditor, publicContentRead } from '@/lib/server/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => {
      const base = process.env.SITE_URL ?? 'http://localhost:3000'
      return `${base}/${String(doc.slug ?? '')}?preview=true`
    },
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
    { name: 'title', type: 'text', required: true, maxLength: 180 },
    { name: 'slug', type: 'text', required: true, unique: true, maxLength: 180 },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'ownerApproved',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      access: { create: adminFieldAccess, update: adminFieldAccess },
      admin: { description: 'Owner approval is required before legal pages are exposed by the public site.' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', maxLength: 70 },
        { name: 'description', type: 'textarea', maxLength: 180 },
      ],
    },
  ],
}
