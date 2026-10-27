import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS backend_rate_limits (
      key_hash text PRIMARY KEY,
      window_started_at timestamptz NOT NULL,
      attempts integer NOT NULL CHECK (attempts >= 0)
    )
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS backend_rate_limits_window_started_at_idx
    ON backend_rate_limits (window_started_at)
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS backend_rate_limits`)
}
