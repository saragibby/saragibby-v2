import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/server/access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'projectType', 'status', 'createdAt'],
  },
  access: {
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'company', type: 'text', maxLength: 160 },
    { name: 'projectType', type: 'text', maxLength: 100 },
    { name: 'message', type: 'textarea', required: true, maxLength: 5000 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'notificationState',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Queued', value: 'queued' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    { name: 'notificationError', type: 'textarea', maxLength: 1000 },
  ],
}
