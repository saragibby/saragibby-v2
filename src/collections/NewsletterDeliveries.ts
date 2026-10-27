import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/server/access'

export const NewsletterDeliveries: CollectionConfig = {
  slug: 'newsletter-deliveries',
  admin: {
    useAsTitle: 'deliveryKey',
    defaultColumns: ['deliveryKey', 'status', 'sentAt'],
  },
  access: {
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'deliveryKey', type: 'text', required: true, unique: true, index: true },
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'newsletter-campaigns',
      required: true,
    },
    { name: 'subscriber', type: 'relationship', relationTo: 'subscribers', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Queued', value: 'queued' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: 'Skipped', value: 'skipped' },
      ],
    },
    { name: 'sentAt', type: 'date' },
    { name: 'lastError', type: 'textarea', maxLength: 1000 },
  ],
}
