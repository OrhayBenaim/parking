ALTER TABLE "users" DROP CONSTRAINT "user_pk";--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("phone");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "user_pk" UNIQUE("phone");