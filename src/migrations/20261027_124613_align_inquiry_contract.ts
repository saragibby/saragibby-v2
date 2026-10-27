import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'prune-rate-limits';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'prune-rate-limits';
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "inquiries" ALTER COLUMN "project_type" DROP NOT NULL;
  ALTER TABLE "payload_jobs" ADD COLUMN "meta" jsonb;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_jobs_stats" CASCADE;
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'send-confirmation', 'send-starter-kit', 'notify-inquiry', 'queue-newsletter', 'send-newsletter-recipient');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'send-confirmation', 'send-starter-kit', 'notify-inquiry', 'queue-newsletter', 'send-newsletter-recipient');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  UPDATE "inquiries" SET "project_type" = 'Not provided' WHERE "project_type" IS NULL;
  ALTER TABLE "inquiries" ALTER COLUMN "project_type" SET NOT NULL;
  ALTER TABLE "payload_jobs" DROP COLUMN "meta";`)
}
