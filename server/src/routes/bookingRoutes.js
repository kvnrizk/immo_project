import express from 'express';
import {
  getAllBookings,
  getBookingsByProperty,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// GET /api/bookings - Get all bookings
router.get('/', getAllBookings);

// GET /api/bookings/property/:propertyId - Get bookings for a specific property
router.get('/property/:propertyId', getBookingsByProperty);

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', getBookingById);

// POST /api/bookings - Create new booking
router.post('/', createBooking);

// PUT /api/bookings/:id - Update booking
router.put('/:id', updateBooking);

// PATCH /api/bookings/:id/cancel - Cancel booking
router.patch('/:id/cancel', cancelBooking);

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', deleteBooking);

export default router;
