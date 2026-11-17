CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text DEFAULT 'temple' NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"people" integer DEFAULT 1 NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'registered' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_time" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "host" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "preacher" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "preacher_from" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "allow_registration" boolean DEFAULT false NOT NULL;