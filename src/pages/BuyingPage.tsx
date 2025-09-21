
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const BuyingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('tous');

  // Properties for sale
  const buyingProperties = [
    {
      id: 1,
      title: "Appartement moderne centre-ville",
      price: "285 000 €",
      location: "Lyon 6ème",
      type: "vente" as const,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      description: "Magnifique appartement de 85m² entièrement rénové avec goût, proche des commodités.",
      bedrooms: 3,
      area: 85
    },
    {
      id: 4,
      title: "Loft industriel",
      price: "520 000 €",
      location: "Lyon 7ème",
      type: "vente" as const,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
      description: "Loft unique de 150m² avec vue exceptionnelle, dans un quartier en pleine expansion.",
      bedrooms: 2,
      area: 150
    }
  ];

  const priceRanges = [
    { key: 'tous', label: 'Tous les prix' },
    { key: '0-300000', label: 'Moins de 300 000€' },
    { key: '300000-500000', label: '300 000€ - 500 000€' },
    { key: '500000+', label: 'Plus de 500 000€' }
  ];

  const filteredProperties = buyingProperties.filter(property => {
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
              Biens à vendre
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos propriétés disponibles à l'achat
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

export default BuyingPage;
