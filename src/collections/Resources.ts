import type { CollectionConfig } from 'payload'
import { isEditor, publicContentRead } from '@/lib/server/access'
import { pickPillars } from '@/lib/site/picks'
import {
  resourceAccessOptions,
  resourceHub,
  resourcePath,
  resourceTypes,
} from '@/lib/site/resources'

// Guides, articles and videos appear on /learn. Templates, checklists,
// prompts, calculators, how-to guides and agents appear on /toolkit.
// Publishing (the Publish button) is what puts an item on the site; drafts
// skip validation, so the required fields are only enforced on publish.
export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'resourceType', 'pillar', 'access', 'lastChecked', '_status'],
    description:
      'Learn (guides, articles, videos) and Toolkit (templates, checklists, prompts, how-tos) items. Only published items appear on the site.',
    preview: (doc) => {
      const base = process.env.SITE_URL ?? 'http://localhost:3000'
      const path =
        resourcePath({
          slug: String(doc.slug ?? ''),
          resourceType: String(doc.resourceType ?? ''),
        }) ?? '/toolkit'
      return `${base}${path}?preview=true`
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
      admin: {
        description:
          'The page address: /learn/<slug> or /toolkit/<slug>, depending on the type. Lowercase words and dashes.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'resourceType',
          label: 'Type',
          type: 'select',
          required: true,
          options: resourceTypes.map(({ label, value, hub }) => ({
            label: `${label} (${hub === 'learn' ? 'Learn' : 'Toolkit'})`,
            value,
          })),
        },
        {
          name: 'pillar',
          type: 'select',
          required: true,
          options: pickPillars.map(({ label, value }) => ({ label, value })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'access',
          type: 'select',
          required: true,
          defaultValue: 'free',
          options: resourceAccessOptions.map(({ label, value }) => ({ label, value })),
          admin: {
            description:
              'A label only for now. Email delivery for Toolkit items is not built, so every published item is readable on its page.',
          },
        },
        {
          name: 'lastChecked',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description: 'Shown as “Last checked Nov 2026”. Required for Toolkit items.',
          },
          validate: (
            value: Date | string | null | undefined,
            { data }: { data: Partial<{ resourceType: string }> },
          ) =>
            resourceHub(data?.resourceType ?? '') !== 'toolkit' ||
            Boolean(value) ||
            'Add the date you last checked this.',
        },
      ],
    },
    {
      name: 'topic',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Optional, for your own sorting. The site filters by pillar.' },
    },
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
