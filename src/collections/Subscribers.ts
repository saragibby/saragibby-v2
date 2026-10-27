import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/server/access'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'state',
      'consentState',
      'starterKitDeliveryState',
      'updatedAt',
    ],
  },
  access: {
    admin: isAdmin,
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'state',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'consentState',
      type: 'select',
      required: true,
      defaultValue: 'not-consented',
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Consented', value: 'consented' },
        { label: 'Not consented', value: 'not-consented' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
    },
    { name: 'marketingConsent', type: 'checkbox', required: true, defaultValue: false },
    { name: 'consentWordingVersion', type: 'text', maxLength: 40 },
    { name: 'consentTimestamp', type: 'date' },
    { name: 'source', type: 'text', required: true, maxLength: 50 },
    {
      name: 'interests',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Course', value: 'course' },
        { label: 'Community', value: 'community' },
        { label: 'Shop', value: 'shop' },
        { label: 'Starter Kit', value: 'kit' },
      ],
    },
    { name: 'starterKitRequested', type: 'checkbox', required: true, defaultValue: false },
    {
      name: 'starterKitDeliveryState',
      type: 'select',
      required: true,
      defaultValue: 'not-requested',
      options: [
        { label: 'Not requested', value: 'not-requested' },
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Queued', value: 'queued' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    { name: 'confirmationSentAt', type: 'date' },
    { name: 'confirmedAt', type: 'date' },
    { name: 'unsubscribedAt', type: 'date' },
    { name: 'lastEmailError', type: 'textarea', maxLength: 1000 },
  ],
}
