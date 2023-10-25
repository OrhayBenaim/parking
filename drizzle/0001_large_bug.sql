ALTER TABLE "users" ADD PRIMARY KEY ("phone");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "id";