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
  try {
    const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='user' ORDER BY ordinal_position`);
    console.log('user table columns:\n', res.rows.map(r => `${r.column_name} : ${r.data_type}`).join('\n'));
  } catch (err) {
    console.error('error:', err.message);
  } finally {
    await client.end();
  }
})();