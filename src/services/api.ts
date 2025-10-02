import { Property } from '@/data/PropertyData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Properties API
export const propertyAPI = {
  // Get all properties
  getAll: async (type?: string): Promise<Property[]> => {
    const url = type ? `${API_URL}/properties?type=${type}` : `${API_URL}/properties`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  // Get property by ID
  getById: async (id: number): Promise<Property> => {
    const response = await fetch(`${API_URL}/properties/${id}`);
    if (!response.ok) throw new Error('Failed to fetch property');
    return response.json();
  },

  // Get unavailable dates for a property
  getUnavailableDates: async (id: number): Promise<Date[]> => {
    const response = await fetch(`${API_URL}/properties/${id}/unavailable-dates`);
    if (!response.ok) throw new Error('Failed to fetch unavailable dates');
    const dates = await response.json();
    return dates.map((date: string) => new Date(date));
  },

  // Create new property
  create: async (property: Omit<Property, 'id'>): Promise<Property> => {
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (!response.ok) throw new Error('Failed to create property');
    return response.json();
  },

  // Update property
  update: async (id: number, property: Partial<Property>): Promise<Property> => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (!response.ok) throw new Error('Failed to update property');
    return response.json();
  },

  // Delete property
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete property');
  },
};

// Contacts API
export const contactAPI = {
  // Submit contact form
  submit: async (formData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to submit contact form');
    return response.json();
  },

  // Get all contacts (for admin)
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${API_URL}/contacts`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  // Update contact status
  updateStatus: async (id: number, status: string): Promise<any> => {
    const response = await fetch(`${API_URL}/contacts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update contact status');
    return response.json();
  },
};

// Bookings API
export const bookingAPI = {
  // Get all bookings
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  // Get bookings for a property
  getByProperty: async (propertyId: number): Promise<any[]> => {
    const response = await fetch(`${API_URL}/bookings/property/${propertyId}`);
    if (!response.ok) throw new Error('Failed to fetch property bookings');
    return response.json();
  },

  // Create booking
  create: async (bookingData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    return response.json();
  },

  // Update booking
  update: async (id: number, bookingData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  },

  // Cancel booking
  cancel: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
  },

  // Delete booking
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete booking');
  },
};
