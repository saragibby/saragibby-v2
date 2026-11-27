import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Adds the kit signup profile fields to subscribers. All new columns are
// nullable, so this is safe to apply before the code that writes them ships.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_subscribers_business_type" AS ENUM('service', 'retail-ecommerce', 'agency-freelancer', 'startup-tech', 'restaurant-hospitality', 'nonprofit', 'other');
    ALTER TABLE "subscribers" ADD COLUMN "source_page" varchar;
    ALTER TABLE "subscribers" ADD COLUMN "first_name" varchar;
    ALTER TABLE "subscribers" ADD COLUMN "business_type" "enum_subscribers_business_type";
    ALTER TABLE "subscribers" ADD COLUMN "business_type_other" varchar;
    ALTER TABLE "subscribers" ADD COLUMN "starter_kit_requested_at" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "subscribers" DROP COLUMN "source_page";
    ALTER TABLE "subscribers" DROP COLUMN "first_name";
    ALTER TABLE "subscribers" DROP COLUMN "business_type";
    ALTER TABLE "subscribers" DROP COLUMN "business_type_other";
    ALTER TABLE "subscribers" DROP COLUMN "starter_kit_requested_at";
    DROP TYPE "public"."enum_subscribers_business_type";`)
}
