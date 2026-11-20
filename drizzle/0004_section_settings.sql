CREATE TABLE "section_settings" (
	"section" text PRIMARY KEY NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"map_query" text DEFAULT '' NOT NULL,
	"facebook_url" text DEFAULT '' NOT NULL,
	"youtube_url" text DEFAULT '' NOT NULL,
	"youtube_channel_id" text DEFAULT '' NOT NULL,
	"instagram_url" text DEFAULT '' NOT NULL,
	"tiktok_url" text DEFAULT '' NOT NULL,
	"is_live" boolean DEFAULT false NOT NULL,
	"live_url" text DEFAULT '' NOT NULL,
	"live_title" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
