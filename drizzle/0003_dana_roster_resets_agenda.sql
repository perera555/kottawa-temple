CREATE TABLE "daily_dana" (
	"id" serial PRIMARY KEY NOT NULL,
	"dana_date" date NOT NULL,
	"slot" text NOT NULL,
	"donor" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code_hash" text NOT NULL,
	"requested_by" text DEFAULT 'user' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "agenda" text DEFAULT '[]' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_dana_date_slot" ON "daily_dana" USING btree ("dana_date","slot");