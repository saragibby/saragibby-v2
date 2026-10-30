import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { NewsletterCampaigns } from './collections/NewsletterCampaigns'
import { NewsletterDeliveries } from './collections/NewsletterDeliveries'
import { Offerings } from './collections/Offerings'
import { Pages } from './collections/Pages'
import { Resources } from './collections/Resources'
import { StarterKitAssets } from './collections/StarterKitAssets'
import { Subscribers } from './collections/Subscribers'
import { Suppressions } from './collections/Suppressions'
import { Users } from './collections/Users'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { StarterKit } from './globals/StarterKit'
import { getPayloadConfigEnvironment } from './lib/server/env'
import { assertBackendAvailable } from './lib/server/preview'
import { createPayloadEmailAdapter } from './lib/server/payload-email'
import { publicMediaURL } from './lib/server/storage'
import { createPayloadTasks } from './lib/server/tasks'
import { isAdmin } from './lib/server/access'
import { databaseConnectionOptions } from './lib/server/database-tls'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const preview = process.env.SITE_PREVIEW === 'true'
const env = getPayloadConfigEnvironment()
const storageConfigured = Boolean(
  env.SUPABASE_S3_ENDPOINT &&
    env.SUPABASE_S3_ACCESS_KEY_ID &&
    env.SUPABASE_S3_SECRET_ACCESS_KEY &&
    env.SUPABASE_STORAGE_URL &&
    env.SUPABASE_STORAGE_SERVICE_KEY &&
    env.SUPABASE_PUBLIC_MEDIA_BUCKET &&
    env.SUPABASE_PRIVATE_KIT_BUCKET,
)
const anyStorageConfiguration = Boolean(
  env.SUPABASE_S3_ENDPOINT ||
    env.SUPABASE_S3_ACCESS_KEY_ID ||
    env.SUPABASE_S3_SECRET_ACCESS_KEY ||
    env.SUPABASE_STORAGE_URL ||
    env.SUPABASE_STORAGE_SERVICE_KEY ||
    env.SUPABASE_PUBLIC_MEDIA_BUCKET ||
    env.SUPABASE_PRIVATE_KIT_BUCKET,
)
if (anyStorageConfiguration && !storageConfigured) {
  throw new Error(
    'Supabase storage configuration is incomplete. Configure both buckets, S3 credentials, and the private Storage service key.',
  )
}
if (
  process.env.NODE_ENV === 'production' &&
  !preview &&
  !storageConfigured
) {
  throw new Error('Supabase public and private storage must be configured for production.')
}
const storageConfig = {
  endpoint: env.SUPABASE_S3_ENDPOINT,
  region: env.SUPABASE_S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID ?? 'storage-not-configured',
    secretAccessKey:
      env.SUPABASE_S3_SECRET_ACCESS_KEY ?? 'storage-not-configured',
  },
}
const database = postgresAdapter({
  push: false,
  pool: {
    ...databaseConnectionOptions(
      env.DATABASE_URL,
      env.DATABASE_CA_CERT,
      process.env.VERCEL === '1',
    ),
    max: env.DATABASE_POOL_MAX,
  },
  migrationDir: path.resolve(dirname, 'migrations'),
})
const initializeDatabase = database.init
database.init = (args) => {
  assertBackendAvailable()
  return initializeDatabase(args)
}

export default buildConfig({
  secret: env.PAYLOAD_SECRET,
  serverURL: env.SITE_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Sara Gibby',
    },
    importMap: {
      baseDir: path.resolve(dirname, 'app/(payload)'),
    },
  },
  collections: [
    Users,
    Media,
    StarterKitAssets,
    Pages,
    Resources,
    Offerings,
    Subscribers,
    Suppressions,
    Inquiries,
    NewsletterCampaigns,
    NewsletterDeliveries,
  ],
  globals: [SiteSettings, Homepage, StarterKit],
  email: createPayloadEmailAdapter(preview ? { NODE_ENV: process.env.NODE_ENV } : process.env),
  editor: lexicalEditor(),
  db: database,
  upload: {
    abortOnLimit: true,
    requestSizeLimit: 50_000_000,
  },
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    s3Storage({
      enabled: storageConfigured && Boolean(env.SUPABASE_PUBLIC_MEDIA_BUCKET),
      bucket: env.SUPABASE_PUBLIC_MEDIA_BUCKET ?? 'storage-not-configured',
      acl: 'private',
      config: storageConfig,
      collections: {
        media: {
          generateFileURL: ({ filename: fileName, prefix }) => {
            if (!env.SUPABASE_STORAGE_URL || !env.SUPABASE_PUBLIC_MEDIA_BUCKET) {
              throw new Error('Public Supabase media storage is not configured.')
            }
            return publicMediaURL(
              env.SUPABASE_STORAGE_URL,
              env.SUPABASE_PUBLIC_MEDIA_BUCKET,
              fileName,
              prefix,
            )
          },
        },
      },
    }),
    s3Storage({
      enabled: storageConfigured && Boolean(env.SUPABASE_PRIVATE_KIT_BUCKET),
      bucket: env.SUPABASE_PRIVATE_KIT_BUCKET ?? 'storage-not-configured',
      acl: 'private',
      signedDownloads: true,
      config: storageConfig,
      collections: {
        'starter-kit-assets': { prefix: 'starter-kit-assets' },
      },
    }),
  ],
  jobs: {
    enableConcurrencyControl: true,
    access: {
      cancel: ({ req }) => req.user?.role === 'admin',
      queue: ({ req }) => req.user?.role === 'admin',
      run: () => false,
    },
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
      ...defaultJobsCollection,
      access: {
        ...defaultJobsCollection.access,
        create: () => false,
        read: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
      },
    }),
    deleteJobOnComplete: false,
    tasks: createPayloadTasks(),
  },
}).then((config) => {
  const jobStats = config.globals.find((global) => global.slug === 'payload-jobs-stats')
  if (jobStats) {
    jobStats.access = { read: isAdmin, readVersions: isAdmin, update: isAdmin }
  }
  return config
})
