ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "emailVerified" timestamp NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "image" text NULL;
