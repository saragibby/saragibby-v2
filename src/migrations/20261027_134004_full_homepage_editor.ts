import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_audience_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_kit_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_ventures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"role" varchar,
  	"description" varchar
  );
  
  ALTER TABLE "homepage" ADD COLUMN "always_building" varchar;
  ALTER TABLE "homepage" ADD COLUMN "audience_heading" varchar;
  ALTER TABLE "homepage" ADD COLUMN "offerings_heading" varchar;
  ALTER TABLE "homepage" ADD COLUMN "kit_heading" varchar;
  ALTER TABLE "homepage" ADD COLUMN "consulting_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN "experience_heading" varchar;
  ALTER TABLE "homepage" ADD COLUMN "experience_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN "closing_heading" varchar;
  ALTER TABLE "homepage" ADD COLUMN "closing_description" varchar;
  ALTER TABLE "homepage_audience_items" ADD CONSTRAINT "homepage_audience_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_kit_contents" ADD CONSTRAINT "homepage_kit_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_audiences" ADD CONSTRAINT "homepage_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_industries" ADD CONSTRAINT "homepage_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_ventures" ADD CONSTRAINT "homepage_ventures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_audience_items_order_idx" ON "homepage_audience_items" USING btree ("_order");
  CREATE INDEX "homepage_audience_items_parent_id_idx" ON "homepage_audience_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_kit_contents_order_idx" ON "homepage_kit_contents" USING btree ("_order");
  CREATE INDEX "homepage_kit_contents_parent_id_idx" ON "homepage_kit_contents" USING btree ("_parent_id");
  CREATE INDEX "homepage_audiences_order_idx" ON "homepage_audiences" USING btree ("_order");
  CREATE INDEX "homepage_audiences_parent_id_idx" ON "homepage_audiences" USING btree ("_parent_id");
  CREATE INDEX "homepage_industries_order_idx" ON "homepage_industries" USING btree ("_order");
  CREATE INDEX "homepage_industries_parent_id_idx" ON "homepage_industries" USING btree ("_parent_id");
  CREATE INDEX "homepage_ventures_order_idx" ON "homepage_ventures" USING btree ("_order");
  CREATE INDEX "homepage_ventures_parent_id_idx" ON "homepage_ventures" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_audience_items" CASCADE;
  DROP TABLE "homepage_kit_contents" CASCADE;
  DROP TABLE "homepage_audiences" CASCADE;
  DROP TABLE "homepage_industries" CASCADE;
  DROP TABLE "homepage_ventures" CASCADE;
  ALTER TABLE "homepage" DROP COLUMN "always_building";
  ALTER TABLE "homepage" DROP COLUMN "audience_heading";
  ALTER TABLE "homepage" DROP COLUMN "offerings_heading";
  ALTER TABLE "homepage" DROP COLUMN "kit_heading";
  ALTER TABLE "homepage" DROP COLUMN "consulting_description";
  ALTER TABLE "homepage" DROP COLUMN "experience_heading";
  ALTER TABLE "homepage" DROP COLUMN "experience_description";
  ALTER TABLE "homepage" DROP COLUMN "closing_heading";
  ALTER TABLE "homepage" DROP COLUMN "closing_description";`)
}
