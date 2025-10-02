import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function clearDatabase() {
  const client = await pool.connect();

  try {
    console.log('✅ Connected to PostgreSQL database');
    console.log('🗑️  Clearing all data...');

    // Delete all data (in order to respect foreign key constraints)
    await client.query('DELETE FROM unavailable_dates;');
    console.log('✅ Cleared unavailable_dates table');

    await client.query('DELETE FROM bookings;');
    console.log('✅ Cleared bookings table');

    await client.query('DELETE FROM contacts;');
    console.log('✅ Cleared contacts table');

    await client.query('DELETE FROM properties;');
    console.log('✅ Cleared properties table');

    console.log('🎉 All data cleared successfully!');
  } catch (err) {
    console.error('❌ Error clearing database:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

clearDatabase();
