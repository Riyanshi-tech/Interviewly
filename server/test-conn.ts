import "dotenv/config";
import { Pool } from 'pg';

const rawConnectionString = process.env.DATABASE_URL;
const connectionString = rawConnectionString?.replace(/&?channel_binding=require/, "");

console.log("Connection string (masked):", connectionString?.replace(/:[^@]*@/, ":***@"));

const pool = new Pool({ connectionString });

async function test() {
  console.log("Attempting to connect with pg...");
  try {
    const client = await pool.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    client.release();
  } catch (err: any) {
    console.error("Connection failed:", err.message);
    console.error("Error code:", err.code);
    console.error("Stack:", err.stack);
  } finally {
    await pool.end();
  }
}

test();
