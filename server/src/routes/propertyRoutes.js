import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  getUnavailableDates,
  createProperty,
  updateProperty,
  deleteProperty,
  addUnavailableDate,
  removeUnavailableDate
} from '../controllers/propertyController.js';

const router = express.Router();

// GET /api/properties - Get all properties (with optional type filter)
router.get('/', getAllProperties);

// GET /api/properties/:id - Get property by ID
router.get('/:id', getPropertyById);

// GET /api/properties/:id/unavailable-dates - Get unavailable dates for a property
router.get('/:id/unavailable-dates', getUnavailableDates);

// POST /api/properties/:id/unavailable-dates - Add unavailable date
router.post('/:id/unavailable-dates', addUnavailableDate);

// DELETE /api/properties/:id/unavailable-dates - Remove unavailable date
router.delete('/:id/unavailable-dates', removeUnavailableDate);

// POST /api/properties - Create new property
router.post('/', createProperty);

// PUT /api/properties/:id - Update property
router.put('/:id', updateProperty);

// DELETE /api/properties/:id - Delete property
router.delete('/:id', deleteProperty);

export default router;
