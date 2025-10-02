import pool from '../config/database.js';

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const { type } = req.query;

    let query = 'SELECT * FROM properties';
    let params = [];

    if (type) {
      query += ' WHERE type = $1';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Get property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// Get unavailable dates for a property
export const getUnavailableDates = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT unavailable_date FROM unavailable_dates WHERE property_id = $1',
      [id]
    );

    const dates = result.rows.map(row => row.unavailable_date);
    res.json(dates);
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    res.status(500).json({ error: 'Failed to fetch unavailable dates' });
  }
};

// Create new property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      price,
      location,
      type,
      image,
      description,
      bedrooms,
      area,
      images,
      features
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties
       (title, price, location, type, image, description, bedrooms, area, images, features)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, price, location, type, image, description, bedrooms, area, images, features]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      price,
      location,
      type,
      image,
      description,
      bedrooms,
      area,
      images,
      features
    } = req.body;

    const result = await pool.query(
      `UPDATE properties
       SET title = $1, price = $2, location = $3, type = $4, image = $5,
           description = $6, bedrooms = $7, area = $8, images = $9, features = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [title, price, location, type, image, description, bedrooms, area, images, features, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

// Add unavailable date
export const addUnavailableDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { unavailable_date, reason } = req.body;

    const result = await pool.query(
      'INSERT INTO unavailable_dates (property_id, unavailable_date, reason) VALUES ($1, $2, $3) RETURNING *',
      [id, unavailable_date, reason || 'Booked']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding unavailable date:', error);
    res.status(500).json({ error: 'Failed to add unavailable date' });
  }
};

// Remove unavailable date
export const removeUnavailableDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { unavailable_date } = req.body;

    const result = await pool.query(
      'DELETE FROM unavailable_dates WHERE property_id = $1 AND unavailable_date = $2 RETURNING *',
      [id, unavailable_date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Unavailable date not found' });
    }

    res.json({ message: 'Unavailable date removed successfully' });
  } catch (error) {
    console.error('Error removing unavailable date:', error);
    res.status(500).json({ error: 'Failed to remove unavailable date' });
  }
};
