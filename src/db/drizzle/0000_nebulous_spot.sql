CREATE TABLE IF NOT EXISTS "users" (
	"phone" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text NOT NULL,
	"cars" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
