import { useState, useEffect } from 'react';
import { Property } from '@/data/PropertyData';
import { propertyAPI } from '@/services/api';

export const useProperties = (type?: string) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getAll(type);
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type]);

  return { properties, loading, error };
};

export const useProperty = (id: number) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getById(id);
        setProperty(data);
        setError(null);
      } catch (err) {
        setError('Failed to load property');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
};

export const useUnavailableDates = (propertyId: number) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getUnavailableDates(propertyId);
        setDates(data);
        setError(null);
      } catch (err) {
        setError('Failed to load unavailable dates');
        console.error('Error fetching unavailable dates:', err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchDates();
    }
  }, [propertyId]);

  return { dates, loading, error };
};
