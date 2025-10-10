
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Grid3x3, Map as MapIcon } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertyMap from '@/components/map/PropertyMap';
import SearchFilters, { FilterState } from '@/components/SearchFilters';
import { useProperties } from '@/hooks/useProperties';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'propertySearchPreferences';

const defaultFilters: FilterState = {
  searchTerm: '',
  category: 'tous',
  minPrice: 0,
  maxPrice: 2000000,
  rooms: 'tous',
  bedrooms: 'tous',
  minArea: 0,
  maxArea: 500,
  location: '',
  sortBy: 'recent',
};

const AllProperties = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [hasSavedPreferences, setHasSavedPreferences] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { properties, loading, error } = useProperties();
  const { toast } = useToast();

  const allProperties = properties || [];

  // Check for saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setHasSavedPreferences(!!saved);
  }, []);

  // Extract numeric price from string (handles "€", "/mois", "/nuit")
  const extractPrice = (priceString: string): number => {
    return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
  };

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = allProperties.filter(property => {
      // Search filter
      const matchesSearch = !filters.searchTerm ||
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = filters.category === 'tous' || property.type === filters.category;

      // Price filter
      const price = extractPrice(property.price);
      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;

      // Rooms filter
      const matchesRooms = filters.rooms === 'tous' ||
        (property.rooms && property.rooms >= parseInt(filters.rooms));

      // Bedrooms filter
      const matchesBedrooms = filters.bedrooms === 'tous' ||
        (property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms));

      // Area filter
      const matchesArea = !property.area ||
        (property.area >= filters.minArea && property.area <= filters.maxArea);

      // Location filter
      const matchesLocation = !filters.location ||
        property.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesCategory && matchesPrice &&
             matchesRooms && matchesBedrooms && matchesArea && matchesLocation;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return extractPrice(a.price) - extractPrice(b.price);
        case 'price-desc':
          return extractPrice(b.price) - extractPrice(a.price);
        case 'area-asc':
          return (a.area || 0) - (b.area || 0);
        case 'area-desc':
          return (b.area || 0) - (a.area || 0);
        case 'rooms-asc':
          return (a.rooms || 0) - (b.rooms || 0);
        case 'rooms-desc':
          return (b.rooms || 0) - (a.rooms || 0);
        case 'recent':
        default:
          // Assuming newer properties have higher IDs
          return b.id - a.id;
      }
    });

    return filtered;
  }, [filters, allProperties]);

  // Save preferences to localStorage
  const handleSavePreferences = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      setHasSavedPreferences(true);
      toast({
        title: "Recherche sauvegardée",
        description: "Vos préférences de recherche ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive",
      });
    }
  };

  // Load preferences from localStorage
  const handleLoadPreferences = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedFilters = JSON.parse(saved);
        setFilters(savedFilters);
        toast({
          title: "Recherche chargée",
          description: "Vos préférences ont été restaurées.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences.",
        variant: "destructive",
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters(defaultFilters);
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été effacés.",
    });
  };

  // Delete saved preferences
  const handleDeletePreferences = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedPreferences(false);
      toast({
        title: "Recherche supprimée",
        description: "Vos préférences sauvegardées ont été supprimées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer vos préférences.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des propriétés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec retour */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
              <span>Retour à l'accueil</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Tous nos biens immobiliers</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez notre sélection complète de biens immobiliers
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSavePreferences={handleSavePreferences}
          onLoadPreferences={handleLoadPreferences}
          onDeletePreferences={handleDeletePreferences}
          onClearFilters={handleClearFilters}
          hasSavedPreferences={hasSavedPreferences}
        />

        {/* View Toggle and Results Count */}
        <div className="my-6 flex justify-between items-center">
          <p className="text-muted-foreground text-lg">
            {filteredAndSortedProperties.length} bien{filteredAndSortedProperties.length !== 1 ? 's' : ''} trouvé{filteredAndSortedProperties.length !== 1 ? 's' : ''}
          </p>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              Grille
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="gap-2"
            >
              <MapIcon className="w-4 h-4" />
              Carte
            </Button>
          </div>
        </div>

        {/* Content - Grid or Map View */}
        {filteredAndSortedProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                />
              ))}
            </div>
          ) : (
            <PropertyMap properties={filteredAndSortedProperties} />
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun bien ne correspond à vos critères de recherche.
            </p>
            <p className="text-muted-foreground mt-2">
              Essayez de modifier vos filtres ou votre terme de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProperties;
