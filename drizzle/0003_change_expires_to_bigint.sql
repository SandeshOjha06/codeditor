-- Convert expires_at on account to bigint so epoch seconds insertions succeed
ALTER TABLE "account" ALTER COLUMN "expires_at" TYPE bigint USING (
  CASE WHEN pg_typeof("expires_at") = 'timestamp without time zone'::regtype
       THEN extract(epoch from "expires_at")::bigint
       ELSE NULL::bigint
  END
);
