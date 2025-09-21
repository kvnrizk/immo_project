
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const RentingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('tous');

  // Properties for rent
  const rentingProperties = [
    {
      id: 2,
      title: "Maison familiale avec jardin",
      price: "1 200 €/mois",
      location: "Villeurbanne",
      type: "location" as const,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
      description: "Belle maison de 120m² avec jardin privatif, idéale pour une famille.",
      bedrooms: 4,
      area: 120
    },
    {
      id: 5,
      title: "Appartement T3 lumineux",
      price: "950 €/mois",
      location: "Caluire-et-Cuire",
      type: "location" as const,
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80",
      description: "T3 de 70m² avec balcon et vue dégagée, dans résidence récente avec parking.",
      bedrooms: 2,
      area: 70
    }
  ];

  const priceRanges = [
    { key: 'tous', label: 'Tous les prix' },
    { key: '0-800', label: 'Moins de 800€' },
    { key: '800-1200', label: '800€ - 1200€' },
    { key: '1200+', label: 'Plus de 1200€' }
  ];

  const filteredProperties = rentingProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Biens à louer
            </h1>
            <p className="text-xl text-muted-foreground">
              Trouvez votre prochain logement en location
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

export default RentingPage;
