import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@/data/PropertyData';
import { propertyAPI } from '@/services/api';

interface FavoritesContextType {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
  toggleFavorite: (property: Property) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedIds = localStorage.getItem('favoriteProperties');
        if (storedIds) {
          const ids: number[] = JSON.parse(storedIds);
          // Fetch full property details for each favorite
          const properties = await propertyAPI.getAll();
          const favoriteProperties = properties.filter(p => ids.includes(p.id));
          setFavorites(favoriteProperties);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      const ids = favorites.map(p => p.id);
      localStorage.setItem('favoriteProperties', JSON.stringify(ids));
    }
  }, [favorites, loading]);

  const addFavorite = (property: Property) => {
    setFavorites(prev => {
      if (!prev.find(p => p.id === property.id)) {
        return [...prev, property];
      }
      return prev;
    });
  };

  const removeFavorite = (propertyId: number) => {
    setFavorites(prev => prev.filter(p => p.id !== propertyId));
  };

  const isFavorite = (propertyId: number): boolean => {
    return favorites.some(p => p.id === propertyId);
  };

  const toggleFavorite = (property: Property) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
