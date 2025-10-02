import pool from '../config/database.js';

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, p.title as property_title, p.location as property_location
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get bookings for a specific property
export const getBookingsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const result = await pool.query(
      `SELECT * FROM bookings WHERE property_id = $1 ORDER BY start_date ASC`,
      [propertyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching property bookings:', error);
    res.status(500).json({ error: 'Failed to fetch property bookings' });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT b.*, p.title as property_title, p.location as property_location
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      WHERE b.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      property_id,
      client_name,
      client_email,
      client_phone,
      start_date,
      end_date,
      guests,
      total_price,
      notes
    } = req.body;

    await client.query('BEGIN');

    // Check if property exists
    const propertyCheck = await client.query(
      'SELECT * FROM properties WHERE id = $1',
      [property_id]
    );

    if (propertyCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check for overlapping bookings
    const overlapCheck = await client.query(
      `SELECT * FROM bookings
       WHERE property_id = $1
       AND status != 'cancelled'
       AND (
         (start_date <= $2 AND end_date >= $2) OR
         (start_date <= $3 AND end_date >= $3) OR
         (start_date >= $2 AND end_date <= $3)
       )`,
      [property_id, start_date, end_date]
    );

    if (overlapCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Property is already booked for these dates' });
    }

    // Create booking
    const result = await client.query(
      `INSERT INTO bookings
       (property_id, client_name, client_email, client_phone, start_date, end_date, guests, total_price, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [property_id, client_name, client_email, client_phone, start_date, end_date, guests, total_price, notes]
    );

    // Add unavailable dates for the booking period
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const dates = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    for (const date of dates) {
      await client.query(
        'INSERT INTO unavailable_dates (property_id, unavailable_date, reason) VALUES ($1, $2, $3)',
        [property_id, date.toISOString().split('T')[0], 'Booked']
      );
    }

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    client.release();
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_name,
      client_email,
      client_phone,
      start_date,
      end_date,
      guests,
      total_price,
      status,
      notes
    } = req.body;

    const result = await pool.query(
      `UPDATE bookings
       SET client_name = $1, client_email = $2, client_phone = $3,
           start_date = $4, end_date = $5, guests = $6, total_price = $7,
           status = $8, notes = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [client_name, client_email, client_phone, start_date, end_date, guests, total_price, status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // Get booking details
    const bookingResult = await client.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Update booking status
    await client.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['cancelled', id]
    );

    // Remove unavailable dates for this booking
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      await client.query(
        'DELETE FROM unavailable_dates WHERE property_id = $1 AND unavailable_date = $2',
        [booking.property_id, date.toISOString().split('T')[0]]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  } finally {
    client.release();
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
