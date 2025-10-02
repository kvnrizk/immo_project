import pool from '../config/database.js';

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// Get contact by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

// Create new contact submission
export const createContact = async (req, res) => {
  try {
    const {
      nom,
      email,
      telephone,
      typeProjet,
      typeBien,
      nombrePieces,
      surfaceRange,
      budgetRange,
      localisation,
      delai,
      message
    } = req.body;

    // Extract min/max from ranges
    const surfaceMin = surfaceRange ? surfaceRange[0] : null;
    const surfaceMax = surfaceRange ? surfaceRange[1] : null;
    const budgetMin = budgetRange ? budgetRange[0] : null;
    const budgetMax = budgetRange ? budgetRange[1] : null;

    const result = await pool.query(
      `INSERT INTO contacts
       (nom, email, telephone, type_projet, type_bien, nombre_pieces,
        surface_min, surface_max, budget_min, budget_max, localisation, delai, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        nom,
        email,
        telephone,
        typeProjet,
        typeBien,
        nombrePieces,
        surfaceMin,
        surfaceMax,
        budgetMin,
        budgetMax,
        localisation,
        delai,
        message
      ]
    );

    res.status(201).json({
      message: 'Contact submitted successfully',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE contacts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Failed to update contact status' });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};
