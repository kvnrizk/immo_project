
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ShortTermPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('tous');

  // Properties for short-term rental
  const shortTermProperties = [
    {
      id: 3,
      title: "Studio cosy Airbnb",
      price: "75 €/nuit",
      location: "Lyon 2ème",
      type: "saisonnier" as const,
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80",
      description: "Studio parfaitement équipé en plein cœur de Lyon, idéal pour les voyageurs d'affaires.",
      bedrooms: 1,
      area: 35
    },
    {
      id: 6,
      title: "Appartement de charme",
      price: "90 €/nuit",
      location: "Lyon 5ème",
      type: "saisonnier" as const,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
      description: "Appartement de caractère dans le Vieux Lyon, décoré avec raffinement pour vos séjours.",
      bedrooms: 2,
      area: 60
    }
  ];

  const priceRanges = [
    { key: 'tous', label: 'Tous les prix' },
    { key: '0-70', label: 'Moins de 70€/nuit' },
    { key: '70-100', label: '70€ - 100€/nuit' },
    { key: '100+', label: 'Plus de 100€/nuit' }
  ];

  const filteredProperties = shortTermProperties.filter(property => {
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
