const fs = require('fs');
const path = require('path');
function loadEnv(file) {
  const content = fs.readFileSync(file, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!key) continue;
    const value = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    process.env[key.trim()] = value;
  }
}
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) loadEnv(envPath);

const { Client } = require('pg');
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const sql = `select "account"."userId", "account"."type", "account"."provider", "account"."providerAccountId", "account"."refresh_token", "account"."access_token", "account"."expires_at", "account"."token_type", "account"."scope", "account"."id_token", "account"."session_state", "user"."id", "user"."name", "user"."email", "user"."emailVerified", "user"."image" from "account" inner join "user" on "account"."userId" = "user"."id" where ("account"."provider" = $1 and "account"."providerAccountId" = $2)`;
  try {
    const res = await client.query(sql, ['google','108522710677400309282']);
    console.log('rows:', res.rows);
  } catch (err) {
    console.error('error:', err);
  } finally {
    await client.end();
  }
})();