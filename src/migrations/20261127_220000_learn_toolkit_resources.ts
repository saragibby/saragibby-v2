import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Resources now feed /learn and /toolkit. The type list grows (tutorial
// becomes how-to), and items gain a pillar, an access label, and a
// last-checked date. The new columns are nullable or defaulted, but
// 'tutorial' is removed: the old admin can't save a former tutorial, or a
// new one, once this runs. Apply it and deploy the code back to back.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_resources_resource_type" RENAME TO "enum_resources_resource_type_old";
    CREATE TYPE "public"."enum_resources_resource_type" AS ENUM('guide', 'article', 'video', 'template', 'checklist', 'prompt', 'calculator', 'how-to', 'agent');
    ALTER TABLE "resources" ALTER COLUMN "resource_type" TYPE "public"."enum_resources_resource_type"
      USING (CASE "resource_type"::text WHEN 'tutorial' THEN 'how-to' ELSE "resource_type"::text END)::"public"."enum_resources_resource_type";
    DROP TYPE "public"."enum_resources_resource_type_old";

    ALTER TYPE "public"."enum__resources_v_version_resource_type" RENAME TO "enum__resources_v_version_resource_type_old";
    CREATE TYPE "public"."enum__resources_v_version_resource_type" AS ENUM('guide', 'article', 'video', 'template', 'checklist', 'prompt', 'calculator', 'how-to', 'agent');
    ALTER TABLE "_resources_v" ALTER COLUMN "version_resource_type" TYPE "public"."enum__resources_v_version_resource_type"
      USING (CASE "version_resource_type"::text WHEN 'tutorial' THEN 'how-to' ELSE "version_resource_type"::text END)::"public"."enum__resources_v_version_resource_type";
    DROP TYPE "public"."enum__resources_v_version_resource_type_old";

    CREATE TYPE "public"."enum_resources_pillar" AS ENUM('time-back', 'grow', 'dont-get-burned');
    CREATE TYPE "public"."enum_resources_access" AS ENUM('free', 'email');
    CREATE TYPE "public"."enum__resources_v_version_pillar" AS ENUM('time-back', 'grow', 'dont-get-burned');
    CREATE TYPE "public"."enum__resources_v_version_access" AS ENUM('free', 'email');

    ALTER TABLE "resources"
      ADD COLUMN "pillar" "public"."enum_resources_pillar",
      ADD COLUMN "access" "public"."enum_resources_access" DEFAULT 'free',
      ADD COLUMN "last_checked" timestamp(3) with time zone;
    ALTER TABLE "_resources_v"
      ADD COLUMN "version_pillar" "public"."enum__resources_v_version_pillar",
      ADD COLUMN "version_access" "public"."enum__resources_v_version_access" DEFAULT 'free',
      ADD COLUMN "version_last_checked" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_resources_v"
      DROP COLUMN "version_pillar",
      DROP COLUMN "version_access",
      DROP COLUMN "version_last_checked";
    ALTER TABLE "resources"
      DROP COLUMN "pillar",
      DROP COLUMN "access",
      DROP COLUMN "last_checked";
    DROP TYPE "public"."enum__resources_v_version_pillar";
    DROP TYPE "public"."enum__resources_v_version_access";
    DROP TYPE "public"."enum_resources_pillar";
    DROP TYPE "public"."enum_resources_access";

    ALTER TYPE "public"."enum__resources_v_version_resource_type" RENAME TO "enum__resources_v_version_resource_type_new";
    CREATE TYPE "public"."enum__resources_v_version_resource_type" AS ENUM('article', 'guide', 'tutorial');
    ALTER TABLE "_resources_v" ALTER COLUMN "version_resource_type" TYPE "public"."enum__resources_v_version_resource_type"
      USING (CASE
        WHEN "version_resource_type" IS NULL THEN NULL
        WHEN "version_resource_type"::text IN ('article', 'guide') THEN "version_resource_type"::text
        WHEN "version_resource_type"::text = 'video' THEN 'article'
        ELSE 'tutorial' END)::"public"."enum__resources_v_version_resource_type";
    DROP TYPE "public"."enum__resources_v_version_resource_type_new";

    ALTER TYPE "public"."enum_resources_resource_type" RENAME TO "enum_resources_resource_type_new";
    CREATE TYPE "public"."enum_resources_resource_type" AS ENUM('article', 'guide', 'tutorial');
    ALTER TABLE "resources" ALTER COLUMN "resource_type" TYPE "public"."enum_resources_resource_type"
      USING (CASE
        WHEN "resource_type" IS NULL THEN NULL
        WHEN "resource_type"::text IN ('article', 'guide') THEN "resource_type"::text
        WHEN "resource_type"::text = 'video' THEN 'article'
        ELSE 'tutorial' END)::"public"."enum_resources_resource_type";
    DROP TYPE "public"."enum_resources_resource_type_new";`)
}
