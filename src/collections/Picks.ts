import type { Access, CollectionConfig } from 'payload'
import { isEditor } from '@/lib/server/access'
import {
  pickPillars,
  pickStatuses,
  pickUrlProblem,
  saraTest,
} from '@/lib/site/picks'

// Visitors only ever see published picks; signed-in editors see all of them.
const publishedPicksRead: Access = ({ req }) =>
  req.user ? true : { published: { equals: true } }

const requiredOncePublished = (
  value: string | null | undefined,
  { data }: { data: Partial<{ published: boolean }> },
) =>
  !data?.published || Boolean(value?.trim()) || 'Answer this before publishing.'

export const Picks: CollectionConfig = {
  slug: 'picks',
  typescript: { interface: 'ToolPick' },
  labels: { singular: 'Pick', plural: 'Picks' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'pillar', 'lastChecked', 'published'],
    description:
      'Tools that have been through The Sara Test. Only published picks appear on the site.',
  },
  access: {
    read: publishedPicksRead,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: '-lastChecked',
  fields: [
    {
      name: 'published',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Unpublished picks are hidden from the site, nav, and sitemap.',
      },
    },
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 120,
      admin: { description: 'The page address: /picks/<slug>. Lowercase words and dashes.' },
      validate: (value: string | null | undefined) => {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? ''))
          return 'Use lowercase letters, numbers, and dashes, like "meeting-notes-helper".'
        // /picks/breakup-pile is its own page.
        return value !== 'breakup-pile' || 'That address is taken by the Breakup Pile page.'
      },
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      required: true,
      maxLength: 300,
      admin: { description: 'The plain product link. No affiliate or tracking parameters.' },
      validate: (value: string | null | undefined) =>
        pickUrlProblem(value ?? '') ?? true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'pillar',
          type: 'select',
          required: true,
          options: pickPillars.map(({ label, value }) => ({ label, value })),
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'approved',
          options: pickStatuses.map(({ label, value }) => ({ label, value })),
        },
        {
          name: 'lastChecked',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'verdict',
      type: 'textarea',
      required: true,
      maxLength: 400,
      admin: { description: 'One or two sentences. Lead with the recommendation.' },
    },
    {
      name: 'marginNote',
      type: 'text',
      maxLength: 60,
      admin: {
        description: 'Short and lowercase, shown in handwriting. For example: "i’d start here".',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'whoItsFor', label: 'Who it’s for', type: 'text', maxLength: 160 },
        { name: 'realCost', label: 'Real cost', type: 'text', maxLength: 160 },
      ],
    },
    {
      name: 'saraTest',
      label: 'The Sara Test',
      type: 'group',
      admin: { description: 'Short, plain answers. All six are needed before publishing.' },
      fields: saraTest.map(({ field, question }) => ({
        name: field,
        label: question,
        type: 'textarea' as const,
        maxLength: 500,
        validate: requiredOncePublished,
      })),
    },
    {
      name: 'breakupNote',
      type: 'textarea',
      maxLength: 600,
      admin: {
        condition: (data) => data?.status === 'breakup',
        description: 'Why this pick moved to the Breakup Pile.',
      },
      validate: (value: string | null | undefined, { data }: { data: Partial<{ status: string }> }) =>
        data?.status !== 'breakup' ||
        Boolean(value?.trim()) ||
        'Say why it moved to the Breakup Pile.',
    },
  ],
}
