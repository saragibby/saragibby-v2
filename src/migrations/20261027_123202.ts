import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_media_access_level" AS ENUM('public');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_resources_resource_type" AS ENUM('article', 'guide', 'tutorial');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_version_resource_type" AS ENUM('article', 'guide', 'tutorial');
  CREATE TYPE "public"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_offerings_availability" AS ENUM('preview', 'waitlist', 'available');
  CREATE TYPE "public"."enum_offerings_waitlist_interest" AS ENUM('course', 'community', 'shop');
  CREATE TYPE "public"."enum_offerings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__offerings_v_version_availability" AS ENUM('preview', 'waitlist', 'available');
  CREATE TYPE "public"."enum__offerings_v_version_waitlist_interest" AS ENUM('course', 'community', 'shop');
  CREATE TYPE "public"."enum__offerings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_subscribers_interests" AS ENUM('newsletter', 'course', 'community', 'shop', 'kit');
  CREATE TYPE "public"."enum_subscribers_state" AS ENUM('pending', 'confirmed', 'unsubscribed');
  CREATE TYPE "public"."enum_subscribers_consent_state" AS ENUM('pending', 'consented', 'not-consented', 'withdrawn');
  CREATE TYPE "public"."enum_subscribers_starter_kit_delivery_state" AS ENUM('not-requested', 'pending', 'queued', 'delivered', 'failed');
  CREATE TYPE "public"."enum_suppressions_reason" AS ENUM('unsubscribe', 'hard-bounce', 'complaint', 'administrative');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'in-progress', 'closed');
  CREATE TYPE "public"."enum_inquiries_notification_state" AS ENUM('pending', 'queued', 'sent', 'failed');
  CREATE TYPE "public"."enum_newsletter_campaigns_status" AS ENUM('draft', 'scheduled', 'sending', 'sent', 'failed');
  CREATE TYPE "public"."enum_newsletter_deliveries_status" AS ENUM('queued', 'sending', 'sent', 'failed', 'skipped');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'send-confirmation', 'send-starter-kit', 'notify-inquiry', 'queue-newsletter', 'send-newsletter-recipient');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'send-confirmation', 'send-starter-kit', 'notify-inquiry', 'queue-newsletter', 'send-newsletter-recipient');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"access_level" "enum_media_access_level" DEFAULT 'public' NOT NULL,
  	"attribution" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "starter_kit_assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kit_version" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"resource_type" "enum_resources_resource_type",
  	"topic" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"cover_id" integer,
  	"video_u_r_l" varchar,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_resource_type" "enum__resources_v_version_resource_type",
  	"version_topic" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_cover_id" integer,
  	"version_video_u_r_l" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "offerings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"availability" "enum_offerings_availability",
  	"cta_label" varchar,
  	"cta_destination" varchar,
  	"waitlist_interest" "enum_offerings_waitlist_interest",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_offerings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_offerings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_availability" "enum__offerings_v_version_availability",
  	"version_cta_label" varchar,
  	"version_cta_destination" varchar,
  	"version_waitlist_interest" "enum__offerings_v_version_waitlist_interest",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__offerings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "subscribers_interests" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_subscribers_interests",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"state" "enum_subscribers_state" DEFAULT 'pending' NOT NULL,
  	"consent_state" "enum_subscribers_consent_state" DEFAULT 'not-consented' NOT NULL,
  	"marketing_consent" boolean DEFAULT false NOT NULL,
  	"consent_wording_version" varchar,
  	"consent_timestamp" timestamp(3) with time zone,
  	"source" varchar NOT NULL,
  	"starter_kit_requested" boolean DEFAULT false NOT NULL,
  	"starter_kit_delivery_state" "enum_subscribers_starter_kit_delivery_state" DEFAULT 'not-requested' NOT NULL,
  	"confirmation_sent_at" timestamp(3) with time zone,
  	"confirmed_at" timestamp(3) with time zone,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"last_email_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "suppressions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"reason" "enum_suppressions_reason" NOT NULL,
  	"occurred_at" timestamp(3) with time zone NOT NULL,
  	"source" varchar NOT NULL,
  	"external_event_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"project_type" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"notification_state" "enum_inquiries_notification_state" DEFAULT 'pending' NOT NULL,
  	"notification_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar NOT NULL,
  	"preview_text" varchar,
  	"body" jsonb NOT NULL,
  	"status" "enum_newsletter_campaigns_status" DEFAULT 'draft' NOT NULL,
  	"send_at" timestamp(3) with time zone,
  	"queued_at" timestamp(3) with time zone,
  	"queueing_complete" boolean DEFAULT false NOT NULL,
  	"queued_recipient_count" numeric DEFAULT 0 NOT NULL,
  	"sent_at" timestamp(3) with time zone,
  	"last_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_deliveries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"delivery_key" varchar NOT NULL,
  	"campaign_id" integer NOT NULL,
  	"subscriber_id" integer NOT NULL,
  	"status" "enum_newsletter_deliveries_status" NOT NULL,
  	"sent_at" timestamp(3) with time zone,
  	"last_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"starter_kit_assets_id" integer,
  	"pages_id" integer,
  	"resources_id" integer,
  	"offerings_id" integer,
  	"subscribers_id" integer,
  	"suppressions_id" integer,
  	"inquiries_id" integer,
  	"newsletter_campaigns_id" integer,
  	"newsletter_deliveries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE "starter_kit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"delivery_copy" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "starter_kit_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"starter_kit_assets_id" integer
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offerings_v" ADD CONSTRAINT "_offerings_v_parent_id_offerings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offerings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscribers_interests" ADD CONSTRAINT "subscribers_interests_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletter_deliveries" ADD CONSTRAINT "newsletter_deliveries_campaign_id_newsletter_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletter_deliveries" ADD CONSTRAINT "newsletter_deliveries_subscriber_id_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_starter_kit_assets_fk" FOREIGN KEY ("starter_kit_assets_id") REFERENCES "public"."starter_kit_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offerings_fk" FOREIGN KEY ("offerings_id") REFERENCES "public"."offerings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_suppressions_fk" FOREIGN KEY ("suppressions_id") REFERENCES "public"."suppressions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_campaigns_fk" FOREIGN KEY ("newsletter_campaigns_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_deliveries_fk" FOREIGN KEY ("newsletter_deliveries_id") REFERENCES "public"."newsletter_deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation" ADD CONSTRAINT "site_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_social_links" ADD CONSTRAINT "site_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_seo_defaults_social_image_id_media_id_fk" FOREIGN KEY ("seo_defaults_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_credibility_items" ADD CONSTRAINT "homepage_credibility_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_offerings_fk" FOREIGN KEY ("offerings_id") REFERENCES "public"."offerings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "starter_kit_rels" ADD CONSTRAINT "starter_kit_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."starter_kit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "starter_kit_rels" ADD CONSTRAINT "starter_kit_rels_starter_kit_assets_fk" FOREIGN KEY ("starter_kit_assets_id") REFERENCES "public"."starter_kit_assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "starter_kit_assets_updated_at_idx" ON "starter_kit_assets" USING btree ("updated_at");
  CREATE INDEX "starter_kit_assets_created_at_idx" ON "starter_kit_assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "starter_kit_assets_filename_idx" ON "starter_kit_assets" USING btree ("filename");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_cover_idx" ON "resources" USING btree ("cover_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "resources" USING btree ("_status");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_cover_idx" ON "_resources_v" USING btree ("version_cover_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "_resources_v" USING btree ("latest");
  CREATE UNIQUE INDEX "offerings_slug_idx" ON "offerings" USING btree ("slug");
  CREATE INDEX "offerings_updated_at_idx" ON "offerings" USING btree ("updated_at");
  CREATE INDEX "offerings_created_at_idx" ON "offerings" USING btree ("created_at");
  CREATE INDEX "offerings__status_idx" ON "offerings" USING btree ("_status");
  CREATE INDEX "_offerings_v_parent_idx" ON "_offerings_v" USING btree ("parent_id");
  CREATE INDEX "_offerings_v_version_version_slug_idx" ON "_offerings_v" USING btree ("version_slug");
  CREATE INDEX "_offerings_v_version_version_updated_at_idx" ON "_offerings_v" USING btree ("version_updated_at");
  CREATE INDEX "_offerings_v_version_version_created_at_idx" ON "_offerings_v" USING btree ("version_created_at");
  CREATE INDEX "_offerings_v_version_version__status_idx" ON "_offerings_v" USING btree ("version__status");
  CREATE INDEX "_offerings_v_created_at_idx" ON "_offerings_v" USING btree ("created_at");
  CREATE INDEX "_offerings_v_updated_at_idx" ON "_offerings_v" USING btree ("updated_at");
  CREATE INDEX "_offerings_v_latest_idx" ON "_offerings_v" USING btree ("latest");
  CREATE INDEX "subscribers_interests_order_idx" ON "subscribers_interests" USING btree ("order");
  CREATE INDEX "subscribers_interests_parent_idx" ON "subscribers_interests" USING btree ("parent_id");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE UNIQUE INDEX "suppressions_email_idx" ON "suppressions" USING btree ("email");
  CREATE INDEX "suppressions_updated_at_idx" ON "suppressions" USING btree ("updated_at");
  CREATE INDEX "suppressions_created_at_idx" ON "suppressions" USING btree ("created_at");
  CREATE INDEX "inquiries_email_idx" ON "inquiries" USING btree ("email");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "newsletter_campaigns_updated_at_idx" ON "newsletter_campaigns" USING btree ("updated_at");
  CREATE INDEX "newsletter_campaigns_created_at_idx" ON "newsletter_campaigns" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_deliveries_delivery_key_idx" ON "newsletter_deliveries" USING btree ("delivery_key");
  CREATE INDEX "newsletter_deliveries_campaign_idx" ON "newsletter_deliveries" USING btree ("campaign_id");
  CREATE INDEX "newsletter_deliveries_subscriber_idx" ON "newsletter_deliveries" USING btree ("subscriber_id");
  CREATE INDEX "newsletter_deliveries_updated_at_idx" ON "newsletter_deliveries" USING btree ("updated_at");
  CREATE INDEX "newsletter_deliveries_created_at_idx" ON "newsletter_deliveries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_starter_kit_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("starter_kit_assets_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_offerings_id_idx" ON "payload_locked_documents_rels" USING btree ("offerings_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_suppressions_id_idx" ON "payload_locked_documents_rels" USING btree ("suppressions_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_deliveries_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_deliveries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_navigation_order_idx" ON "site_navigation" USING btree ("_order");
  CREATE INDEX "site_navigation_parent_id_idx" ON "site_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_social_links_order_idx" ON "site_social_links" USING btree ("_order");
  CREATE INDEX "site_social_links_parent_id_idx" ON "site_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_seo_defaults_seo_defaults_social_image_idx" ON "site" USING btree ("seo_defaults_social_image_id");
  CREATE INDEX "homepage_credibility_items_order_idx" ON "homepage_credibility_items" USING btree ("_order");
  CREATE INDEX "homepage_credibility_items_parent_id_idx" ON "homepage_credibility_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_portrait_idx" ON "homepage" USING btree ("hero_portrait_id");
  CREATE INDEX "homepage_story_story_image_idx" ON "homepage" USING btree ("story_image_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_resources_id_idx" ON "homepage_rels" USING btree ("resources_id");
  CREATE INDEX "homepage_rels_offerings_id_idx" ON "homepage_rels" USING btree ("offerings_id");
  CREATE INDEX "starter_kit_rels_order_idx" ON "starter_kit_rels" USING btree ("order");
  CREATE INDEX "starter_kit_rels_parent_idx" ON "starter_kit_rels" USING btree ("parent_id");
  CREATE INDEX "starter_kit_rels_path_idx" ON "starter_kit_rels" USING btree ("path");
  CREATE INDEX "starter_kit_rels_starter_kit_assets_id_idx" ON "starter_kit_rels" USING btree ("starter_kit_assets_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "starter_kit_assets" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "offerings" CASCADE;
  DROP TABLE "_offerings_v" CASCADE;
  DROP TABLE "subscribers_interests" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "suppressions" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "newsletter_campaigns" CASCADE;
  DROP TABLE "newsletter_deliveries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_navigation" CASCADE;
  DROP TABLE "site_social_links" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "homepage_credibility_items" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "starter_kit" CASCADE;
  DROP TABLE "starter_kit_rels" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_access_level";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_resources_resource_type";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum__resources_v_version_resource_type";
  DROP TYPE "public"."enum__resources_v_version_status";
  DROP TYPE "public"."enum_offerings_availability";
  DROP TYPE "public"."enum_offerings_waitlist_interest";
  DROP TYPE "public"."enum_offerings_status";
  DROP TYPE "public"."enum__offerings_v_version_availability";
  DROP TYPE "public"."enum__offerings_v_version_waitlist_interest";
  DROP TYPE "public"."enum__offerings_v_version_status";
  DROP TYPE "public"."enum_subscribers_interests";
  DROP TYPE "public"."enum_subscribers_state";
  DROP TYPE "public"."enum_subscribers_consent_state";
  DROP TYPE "public"."enum_subscribers_starter_kit_delivery_state";
  DROP TYPE "public"."enum_suppressions_reason";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_notification_state";
  DROP TYPE "public"."enum_newsletter_campaigns_status";
  DROP TYPE "public"."enum_newsletter_deliveries_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
