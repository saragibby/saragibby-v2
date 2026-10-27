import type { Access, AccessArgs, FieldAccess } from 'payload'

type BooleanAccess = (args: AccessArgs) => boolean | Promise<boolean>

export const isAdmin: BooleanAccess = ({ req }) => req.user?.role === 'admin'

export const isEditor: BooleanAccess = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor'

export const denyPublic: Access = () => false

export const publicContentRead: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

export const adminFieldAccess: FieldAccess = ({ req }) =>
  req.user?.role === 'admin'

export const editorFieldAccess: FieldAccess = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor'
