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
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const res = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
    console.log('tables:', res.rows.map(r => r.table_name));
    await client.end();
  } catch (err) {
    console.error('error:', err.message);
    process.exit(1);
  }
})();