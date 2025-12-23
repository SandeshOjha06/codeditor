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