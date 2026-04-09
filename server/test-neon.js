const { Client } = require('pg');
require('dotenv').config();

const connectionStringPooler = process.env.DATABASE_URL;
const connectionStringDirect = connectionStringPooler.replace('-pooler', '');

async function test(str, name) {
  const client = new Client({ connectionString: str });
  try {
    await client.connect();
    console.log(`Success connecting to ${name}!`);
    await client.end();
  } catch (e) {
    console.error(`Failed connecting to ${name}:`, e.message);
  }
}

async function run() {
  await test(connectionStringPooler, 'Pooled URL');
  await test(connectionStringDirect, 'Direct URL');
}
run();
