import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '@/data/PropertyData';

interface ComparisonContextType {
  comparisonList: Property[];
  addToComparison: (property: Property) => boolean;
  removeFromComparison: (propertyId: number) => void;
  isInComparison: (propertyId: number) => boolean;
  toggleComparison: (property: Property) => boolean;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 3; // Limit comparison to 3 properties

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comparisonList, setComparisonList] = useState<Property[]>([]);

  const addToComparison = (property: Property): boolean => {
    if (comparisonList.length >= MAX_COMPARISON_ITEMS) {
      return false; // Can't add more
    }

    if (!comparisonList.find(p => p.id === property.id)) {
      setComparisonList(prev => [...prev, property]);
      return true;
    }
    return true; // Already in list
  };

  const removeFromComparison = (propertyId: number) => {
    setComparisonList(prev => prev.filter(p => p.id !== propertyId));
  };

  const isInComparison = (propertyId: number): boolean => {
    return comparisonList.some(p => p.id === propertyId);
  };

  const toggleComparison = (property: Property): boolean => {
    if (isInComparison(property.id)) {
      removeFromComparison(property.id);
      return true;
    } else {
      return addToComparison(property);
    }
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        isInComparison,
        toggleComparison,
        clearComparison,
        maxItems: MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
