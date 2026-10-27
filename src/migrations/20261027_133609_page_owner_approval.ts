import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "owner_approved" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_owner_approved" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "owner_approved";
  ALTER TABLE "_pages_v" DROP COLUMN "version_owner_approved";`)
}
