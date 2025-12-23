-- Create singular user table expected by the auth adapter and copy data from existing users
CREATE TABLE IF NOT EXISTS "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "name" text,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "user_email_unique" UNIQUE("email")
);

-- Copy data from legacy "users" table if present
INSERT INTO "user" (id, email, name, created_at)
SELECT id, email, name, created_at FROM "users"
ON CONFLICT (id) DO NOTHING;

-- Create account table used by Auth adapter
CREATE TABLE IF NOT EXISTS "account" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL REFERENCES "user"("id"),
  "type" varchar(50) NOT NULL,
  "provider" text,
  "providerAccountId" text,
  "refresh_token" text,
  "access_token" text,
  "expires_at" timestamp,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text
);
