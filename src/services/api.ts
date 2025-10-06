import { Property } from '@/data/PropertyData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(property),
    });
    if (!response.ok) throw new Error('Failed to create property');
    return response.json();
  },

  // Update property
  update: async (id: number, property: Partial<Property>): Promise<Property> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(property),
    });
    if (!response.ok) throw new Error('Failed to update property');
    return response.json();
  },

  // Delete property
  delete: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete property');
  },

  // Upload images for a property
  uploadImages: async (propertyId: string, files: File[]): Promise<Property> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/properties/${propertyId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload images');
    return response.json();
  },

  // Toggle property active status
  toggleActive: async (id: number): Promise<Property> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/properties/${id}/toggle-active`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to toggle property status');
    return response.json();
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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  // Update contact status
  updateStatus: async (id: number, status: string): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contacts/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
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

// Reservation Types (for Vente & Location visits only)
export enum ReservationType {
  VENTE = 'vente',
  LOCATION = 'location',
}

export enum ReservationStatus {
  EN_ATTENTE = 'en_attente',
  CONFIRMEE = 'confirmée',
  ANNULEE = 'annulée',
  EXPIREE = 'expirée',
  TERMINEE = 'terminée',
}

export interface Reservation {
  id: string;
  propertyId: number;
  property?: Property;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: ReservationType;
  meetingDate: string;
  status: ReservationStatus;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  propertyId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: ReservationType;
  meetingDate: string;
  notes?: string;
  status?: ReservationStatus;
}

export interface UpdateReservationDto {
  propertyId?: number;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  type?: ReservationType;
  meetingDate?: string;
  notes?: string;
  status?: ReservationStatus;
}

export interface FilterReservationDto {
  status?: ReservationStatus;
  type?: ReservationType;
  propertyId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Reservations API
export const reservationAPI = {
  // Get all reservations with optional filters
  getAll: async (filters?: FilterReservationDto): Promise<Reservation[]> => {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();

    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.propertyId) queryParams.append('propertyId', filters.propertyId.toString());
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = queryParams.toString()
      ? `${API_URL}/reservations?${queryParams}`
      : `${API_URL}/reservations`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  },

  // Get single reservation by ID
  getById: async (id: string): Promise<Reservation> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch reservation');
    return response.json();
  },

  // Get reservation statistics
  getStatistics: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch reservation statistics');
    return response.json();
  },

  // Create new reservation
  create: async (data: CreateReservationDto): Promise<Reservation> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Unauthorized');
    }
    return response.json();
  },

  // Update reservation
  update: async (id: string, data: UpdateReservationDto): Promise<Reservation> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update reservation');
    }
    return response.json();
  },

  // Delete reservation
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete reservation');
  },
};

// Analytics Types
export interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface CountryStats {
  country: string;
  count: number;
}

export interface DailyVisitor {
  date: string;
  count: number;
}

export interface PageView {
  page: string;
  count: number;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  timestamp: string;
}

export interface AnalyticsData {
  visitorStats: VisitorStats;
  countryStats: CountryStats[];
  dailyVisitors: DailyVisitor[];
  topPages: PageView[];
}

// Analytics API
export const analyticsAPI = {
  // Track page view
  trackPageView: async (page: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  },

  // Get analytics data
  getAnalytics: async (): Promise<AnalyticsData> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  // Get health check
  getHealth: async (): Promise<HealthCheck> => {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error('Failed to fetch health status');
    return response.json();
  },
};
