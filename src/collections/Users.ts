import { APIError, type CollectionConfig } from 'payload'
import { adminFieldAccess, isAdmin, isEditor } from '@/lib/server/access'
import { offlineBootstrapCapability } from '@/lib/server/admin-bootstrap'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  access: {
    admin: isEditor,
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ operation, req }) => {
        if (
          operation === 'create' &&
          req.user?.role !== 'admin' &&
          req.context.offlineAdminBootstrap !== offlineBootstrapCapability
        ) {
          throw new APIError('User creation requires an administrator or the offline bootstrap command.', 403)
        }
      },
    ],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: adminFieldAccess },
    },
  ],
}
