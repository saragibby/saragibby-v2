import type { CollectionConfig } from 'payload'
import { isEditor, publicContentRead } from '@/lib/server/access'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'resourceType', 'topic', '_status', 'publishedAt'],
    preview: (doc) => {
      const base = process.env.SITE_URL ?? 'http://localhost:3000'
      return `${base}/resources/${String(doc.slug ?? '')}?preview=true`
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
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 180,
    },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Guide', value: 'guide' },
        { label: 'Tutorial', value: 'tutorial' },
      ],
    },
    { name: 'topic', type: 'text', required: true, maxLength: 80 },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 320 },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { accessLevel: { equals: 'public' } },
    },
    { name: 'videoURL', type: 'text', maxLength: 500 },
    { name: 'publishedAt', type: 'date' },
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
