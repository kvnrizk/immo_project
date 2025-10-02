import pool from './database.js';

const addCurrentDates = async () => {
  const client = await pool.connect();

  try {
    console.log('🔧 Adding current unavailable dates...');

    // Get seasonal rental property IDs
    const propertiesResult = await client.query(`
      SELECT id FROM properties WHERE type = 'saisonnier' ORDER BY id LIMIT 2;
    `);

    if (propertiesResult.rows.length >= 1) {
      const prop1Id = propertiesResult.rows[0].id;
      const prop2Id = propertiesResult.rows.length > 1 ? propertiesResult.rows[1].id : null;

      // Add dates for October 2025 (current month)
      await client.query(`
        INSERT INTO unavailable_dates (property_id, unavailable_date, reason)
        VALUES
          ($1, '2025-10-15', 'Booked'),
          ($1, '2025-10-16', 'Booked'),
          ($1, '2025-10-20', 'Booked'),
          ($1, '2025-10-25', 'Booked'),
          ($1, '2025-11-01', 'Booked'),
          ($1, '2025-11-05', 'Booked')
        ON CONFLICT DO NOTHING;
      `, [prop1Id]);
      console.log(`✅ Added unavailable dates for property ${prop1Id}`);

      if (prop2Id) {
        await client.query(`
          INSERT INTO unavailable_dates (property_id, unavailable_date, reason)
          VALUES
            ($1, '2025-10-15', 'Booked'),
            ($1, '2025-10-22', 'Booked'),
            ($1, '2025-10-30', 'Booked'),
            ($1, '2025-11-10', 'Booked')
          ON CONFLICT DO NOTHING;
        `, [prop2Id]);
        console.log(`✅ Added unavailable dates for property ${prop2Id}`);
      }
    }

    console.log('🎉 Current unavailable dates added successfully!');

  } catch (error) {
    console.error('❌ Error adding dates:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

addCurrentDates();
