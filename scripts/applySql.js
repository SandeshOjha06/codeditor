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
  const file = process.argv[2] || '0001_add_auth_tables.sql';
  const sqlPath = path.resolve(__dirname, '..', 'drizzle', file);
  if (!fs.existsSync(sqlPath)) throw new Error('sql file not found: ' + sqlPath);
  const sql = fs.readFileSync(sqlPath, 'utf8');
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('applied migration');
    await client.end();
  } catch (err) {
    console.error('error applying sql:', err.message);
    try { await client.query('ROLLBACK'); } catch (_) {}
    process.exit(1);
  }
})();