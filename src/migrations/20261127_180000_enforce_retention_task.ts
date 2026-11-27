import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Registers the daily enforce-retention job's slug. Safe to apply before the
// code ships: nothing uses the new value until then.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'enforce-retention';
    ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'enforce-retention';`)
}

// Postgres can't drop a value from an enum. Remove any rows that use it so
// the old code never reads one; the unused value itself stays.
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "payload_jobs_log" WHERE "task_slug" = 'enforce-retention';
    DELETE FROM "payload_jobs" WHERE "task_slug" = 'enforce-retention';`)
}
