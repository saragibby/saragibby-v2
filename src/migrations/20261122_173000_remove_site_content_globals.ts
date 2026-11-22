import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS
      "homepage_audience_items",
      "homepage_kit_contents",
      "homepage_audiences",
      "homepage_industries",
      "homepage_ventures",
      "homepage_credibility_items",
      "homepage_rels",
      "homepage",
      "site_navigation",
      "site_social_links",
      "site"
    CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "site_navigation" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );

    CREATE TABLE "site_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );

    CREATE TABLE "site" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'Sara Gibby' NOT NULL,
      "site_description" varchar,
      "contact_email" varchar,
      "seo_defaults_title" varchar,
      "seo_defaults_description" varchar,
      "seo_defaults_social_image_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "homepage_credibility_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );

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

    CREATE TABLE "homepage" (
      "id" serial PRIMARY KEY NOT NULL,
      "always_building" varchar,
      "audience_heading" varchar,
      "offerings_heading" varchar,
      "kit_heading" varchar,
      "consulting_description" varchar,
      "experience_heading" varchar,
      "experience_description" varchar,
      "closing_heading" varchar,
      "closing_description" varchar,
      "hero_eyebrow" varchar,
      "hero_heading" varchar NOT NULL,
      "hero_description" varchar,
      "hero_portrait_id" integer,
      "hero_primary_label" varchar,
      "hero_primary_href" varchar,
      "story_heading" varchar,
      "story_body" jsonb,
      "story_image_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "homepage_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "resources_id" integer,
      "offerings_id" integer
    );

    ALTER TABLE "site_navigation"
      ADD CONSTRAINT "site_navigation_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_social_links"
      ADD CONSTRAINT "site_social_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site"
      ADD CONSTRAINT "site_seo_defaults_social_image_id_media_id_fk"
      FOREIGN KEY ("seo_defaults_social_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage_credibility_items"
      ADD CONSTRAINT "homepage_credibility_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_audience_items"
      ADD CONSTRAINT "homepage_audience_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_kit_contents"
      ADD CONSTRAINT "homepage_kit_contents_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_audiences"
      ADD CONSTRAINT "homepage_audiences_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_industries"
      ADD CONSTRAINT "homepage_industries_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_ventures"
      ADD CONSTRAINT "homepage_ventures_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage"
      ADD CONSTRAINT "homepage_hero_portrait_id_media_id_fk"
      FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage"
      ADD CONSTRAINT "homepage_story_image_id_media_id_fk"
      FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage_rels"
      ADD CONSTRAINT "homepage_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_rels"
      ADD CONSTRAINT "homepage_rels_resources_fk"
      FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_rels"
      ADD CONSTRAINT "homepage_rels_offerings_fk"
      FOREIGN KEY ("offerings_id") REFERENCES "public"."offerings"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "site_navigation_order_idx" ON "site_navigation" USING btree ("_order");
    CREATE INDEX "site_navigation_parent_id_idx" ON "site_navigation" USING btree ("_parent_id");
    CREATE INDEX "site_social_links_order_idx" ON "site_social_links" USING btree ("_order");
    CREATE INDEX "site_social_links_parent_id_idx" ON "site_social_links" USING btree ("_parent_id");
    CREATE INDEX "site_seo_defaults_seo_defaults_social_image_idx" ON "site" USING btree ("seo_defaults_social_image_id");
    CREATE INDEX "homepage_credibility_items_order_idx" ON "homepage_credibility_items" USING btree ("_order");
    CREATE INDEX "homepage_credibility_items_parent_id_idx" ON "homepage_credibility_items" USING btree ("_parent_id");
    CREATE INDEX "homepage_audience_items_order_idx" ON "homepage_audience_items" USING btree ("_order");
    CREATE INDEX "homepage_audience_items_parent_id_idx" ON "homepage_audience_items" USING btree ("_parent_id");
    CREATE INDEX "homepage_kit_contents_order_idx" ON "homepage_kit_contents" USING btree ("_order");
    CREATE INDEX "homepage_kit_contents_parent_id_idx" ON "homepage_kit_contents" USING btree ("_parent_id");
    CREATE INDEX "homepage_audiences_order_idx" ON "homepage_audiences" USING btree ("_order");
    CREATE INDEX "homepage_audiences_parent_id_idx" ON "homepage_audiences" USING btree ("_parent_id");
    CREATE INDEX "homepage_industries_order_idx" ON "homepage_industries" USING btree ("_order");
    CREATE INDEX "homepage_industries_parent_id_idx" ON "homepage_industries" USING btree ("_parent_id");
    CREATE INDEX "homepage_ventures_order_idx" ON "homepage_ventures" USING btree ("_order");
    CREATE INDEX "homepage_ventures_parent_id_idx" ON "homepage_ventures" USING btree ("_parent_id");
    CREATE INDEX "homepage_hero_hero_portrait_idx" ON "homepage" USING btree ("hero_portrait_id");
    CREATE INDEX "homepage_story_story_image_idx" ON "homepage" USING btree ("story_image_id");
    CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
    CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
    CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
    CREATE INDEX "homepage_rels_resources_id_idx" ON "homepage_rels" USING btree ("resources_id");
    CREATE INDEX "homepage_rels_offerings_id_idx" ON "homepage_rels" USING btree ("offerings_id");`)
}
