import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/server/access'
import { businessTypes } from '@/lib/site/business-types'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'state',
      'consentState',
      'businessType',
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
    {
      name: 'marketingConsent',
      label: 'Newsletter consent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Opted in to Margin Notes. Separate from a Starter Kit request; ongoing email also needs a confirmed address.',
      },
    },
    { name: 'consentWordingVersion', type: 'text', maxLength: 40 },
    {
      name: 'consentTimestamp',
      type: 'date',
      admin: { description: 'When newsletter consent was given.' },
    },
    { name: 'source', type: 'text', required: true, maxLength: 50 },
    {
      name: 'sourcePage',
      type: 'text',
      maxLength: 200,
      admin: { description: 'The page the signup form was on, e.g. /newsletter.' },
    },
    { name: 'firstName', type: 'text', maxLength: 80 },
    {
      name: 'businessType',
      type: 'select',
      options: businessTypes.map(({ label, value }) => ({ label, value })),
    },
    {
      name: 'businessTypeOther',
      label: 'Business type (other)',
      type: 'text',
      maxLength: 100,
      admin: { condition: (data) => data?.businessType === 'other' },
    },
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
      name: 'starterKitRequestedAt',
      type: 'date',
      admin: { description: 'When the Starter Kit was first requested.' },
    },
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
