import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// The shop is no longer planned, so "shop" comes out of the interest enums.
// No subscriber or offering used it when this was written; any stray value is
// cleared first so the column casts cannot fail.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "offerings" SET "waitlist_interest" = NULL WHERE "waitlist_interest" = 'shop';
    UPDATE "_offerings_v" SET "version_waitlist_interest" = NULL WHERE "version_waitlist_interest" = 'shop';
    DELETE FROM "subscribers_interests" WHERE "value" = 'shop';

    ALTER TYPE "public"."enum_offerings_waitlist_interest" RENAME TO "enum_offerings_waitlist_interest_old";
    CREATE TYPE "public"."enum_offerings_waitlist_interest" AS ENUM('course', 'community');
    ALTER TABLE "offerings" ALTER COLUMN "waitlist_interest" TYPE "public"."enum_offerings_waitlist_interest" USING "waitlist_interest"::text::"public"."enum_offerings_waitlist_interest";
    DROP TYPE "public"."enum_offerings_waitlist_interest_old";

    ALTER TYPE "public"."enum__offerings_v_version_waitlist_interest" RENAME TO "enum__offerings_v_version_waitlist_interest_old";
    CREATE TYPE "public"."enum__offerings_v_version_waitlist_interest" AS ENUM('course', 'community');
    ALTER TABLE "_offerings_v" ALTER COLUMN "version_waitlist_interest" TYPE "public"."enum__offerings_v_version_waitlist_interest" USING "version_waitlist_interest"::text::"public"."enum__offerings_v_version_waitlist_interest";
    DROP TYPE "public"."enum__offerings_v_version_waitlist_interest_old";

    ALTER TYPE "public"."enum_subscribers_interests" RENAME TO "enum_subscribers_interests_old";
    CREATE TYPE "public"."enum_subscribers_interests" AS ENUM('newsletter', 'course', 'community', 'kit');
    ALTER TABLE "subscribers_interests" ALTER COLUMN "value" TYPE "public"."enum_subscribers_interests" USING "value"::text::"public"."enum_subscribers_interests";
    DROP TYPE "public"."enum_subscribers_interests_old";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_offerings_waitlist_interest" ADD VALUE IF NOT EXISTS 'shop';
    ALTER TYPE "public"."enum__offerings_v_version_waitlist_interest" ADD VALUE IF NOT EXISTS 'shop';
    ALTER TYPE "public"."enum_subscribers_interests" ADD VALUE IF NOT EXISTS 'shop' BEFORE 'kit';`)
}
