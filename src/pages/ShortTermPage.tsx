
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';

const ShortTermPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('tous');

  // Fetch properties for short-term rental from API
  const { properties, loading, error } = useProperties('saisonnier');

  const priceRanges = [
    { key: 'tous', label: 'Tous les prix' },
    { key: '0-70', label: 'Moins de 70€/nuit' },
    { key: '70-100', label: '70€ - 100€/nuit' },
    { key: '100+', label: 'Plus de 100€/nuit' }
  ];

  const filteredProperties = (properties || []).filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement des propriétés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Location court durée
            </h1>
            <p className="text-xl text-muted-foreground">
              Séjours courts et locations de vacances
            </p>
          </div>

          {/* Search and filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Rechercher par titre ou localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {priceRanges.map((range) => (
                <Button
                  key={range.key}
                  onClick={() => setPriceRange(range.key)}
                  variant={priceRange === range.key ? "default" : "outline"}
                  className={priceRange === range.key 
                    ? "bg-foreground hover:bg-foreground/90 text-background" 
                    : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Properties grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun bien ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortTermPage;
