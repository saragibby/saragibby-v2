import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/server/access'

export const Suppressions: CollectionConfig = {
  slug: 'suppressions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'reason', 'occurredAt'],
  },
  access: {
    admin: isAdmin,
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Unsubscribe', value: 'unsubscribe' },
        { label: 'Hard bounce', value: 'hard-bounce' },
        { label: 'Complaint', value: 'complaint' },
        { label: 'Administrative', value: 'administrative' },
      ],
    },
    { name: 'occurredAt', type: 'date', required: true },
    { name: 'source', type: 'text', required: true, maxLength: 80 },
    { name: 'externalEventId', type: 'text', maxLength: 200 },
  ],
}
