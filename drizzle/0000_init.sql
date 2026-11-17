CREATE TABLE "dana_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text DEFAULT 'temple' NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"dana_date" date NOT NULL,
	"dana_type" text DEFAULT 'noon' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"category" text DEFAULT 'other' NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"event_date" date,
	"start_time" text DEFAULT '' NOT NULL,
	"schedule" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"album" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"image_url" text NOT NULL,
	"taken_at" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaders" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"type" text DEFAULT 'prefect' NOT NULL,
	"name" text NOT NULL,
	"position" text DEFAULT '' NOT NULL,
	"grade" text DEFAULT '' NOT NULL,
	"year" integer,
	"image_url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"user_id" integer,
	"reply" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"kind" text DEFAULT 'notice' NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"link_url" text DEFAULT '' NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"published_at" date DEFAULT now() NOT NULL,
	"expires_at" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"admission_no" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	"grade" text DEFAULT '' NOT NULL,
	"age" integer,
	"guardian_name" text DEFAULT '' NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"achievement" text DEFAULT '' NOT NULL,
	"show_on_website" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"name" text NOT NULL,
	"position" text DEFAULT '' NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"message" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_no" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"avatar_url" text DEFAULT '' NOT NULL,
	"last_seen_at" timestamp,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_member_no_unique" UNIQUE("member_no"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"category" text DEFAULT 'bana' NOT NULL,
	"title" text NOT NULL,
	"video_url" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"recorded_at" date,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
