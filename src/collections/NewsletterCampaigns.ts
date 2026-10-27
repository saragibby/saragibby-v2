import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/server/access'

export const NewsletterCampaigns: CollectionConfig = {
  slug: 'newsletter-campaigns',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'status', 'sendAt', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'subject', type: 'text', required: true, maxLength: 180 },
    { name: 'previewText', type: 'text', maxLength: 200 },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    { name: 'sendAt', type: 'date' },
    { name: 'queuedAt', type: 'date', admin: { readOnly: true } },
    {
      name: 'queueingComplete',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: { readOnly: true },
    },
    {
      name: 'queuedRecipientCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: { readOnly: true },
    },
    { name: 'sentAt', type: 'date', admin: { readOnly: true } },
    { name: 'lastError', type: 'textarea', maxLength: 1000, admin: { readOnly: true } },
  ],
}
