import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Adds the picks collection. Nothing reads it until the Picks code ships,
// so this is safe to apply first.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_picks_pillar" AS ENUM('time-back', 'grow', 'dont-get-burned');
    CREATE TYPE "public"."enum_picks_status" AS ENUM('approved', 'changed', 'breakup');
    CREATE TABLE "picks" (
      "id" serial PRIMARY KEY NOT NULL,
      "published" boolean DEFAULT false NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "url" varchar NOT NULL,
      "pillar" "enum_picks_pillar" NOT NULL,
      "status" "enum_picks_status" DEFAULT 'approved' NOT NULL,
      "last_checked" timestamp(3) with time zone NOT NULL,
      "verdict" varchar NOT NULL,
      "margin_note" varchar,
      "who_its_for" varchar,
      "real_cost" varchar,
      "sara_test_where_does_my_stuff_go" varchar,
      "sara_test_who_else_can_get_in" varchar,
      "sara_test_plays_nice" varchar,
      "sara_test_cost_next_year" varchar,
      "sara_test_can_i_break_up" varchar,
      "sara_test_when_its_wrong" varchar,
      "breakup_note" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "picks_id" integer;
    CREATE INDEX "picks_published_idx" ON "picks" USING btree ("published");
    CREATE UNIQUE INDEX "picks_slug_idx" ON "picks" USING btree ("slug");
    CREATE INDEX "picks_updated_at_idx" ON "picks" USING btree ("updated_at");
    CREATE INDEX "picks_created_at_idx" ON "picks" USING btree ("created_at");
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_picks_fk" FOREIGN KEY ("picks_id") REFERENCES "public"."picks"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_picks_id_idx" ON "payload_locked_documents_rels" USING btree ("picks_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_picks_fk";
    DROP INDEX "payload_locked_documents_rels_picks_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "picks_id";
    DROP TABLE "picks" CASCADE;
    DROP TYPE "public"."enum_picks_pillar";
    DROP TYPE "public"."enum_picks_status";`)
}
