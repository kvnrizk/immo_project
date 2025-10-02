import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';

const router = express.Router();

// GET /api/contacts - Get all contact submissions
router.get('/', getAllContacts);

// GET /api/contacts/:id - Get contact by ID
router.get('/:id', getContactById);

// POST /api/contacts - Create new contact submission
router.post('/', createContact);

// PATCH /api/contacts/:id/status - Update contact status
router.patch('/:id/status', updateContactStatus);

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', deleteContact);

export default router;
