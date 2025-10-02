
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';

const AllProperties = () => {
  // Fetch properties from database
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [priceRange, setPriceRange] = useState('tous');
  const { properties, loading, error } = useProperties();

  const allProperties = properties || [];

  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'tous' || property.type === selectedCategory;
      
      const matchesPriceRange = (() => {
        if (priceRange === 'tous') return true;
        
        // Extract numeric price for comparison
        const numericPrice = parseInt(property.price.replace(/[^\d]/g, ''));
        
        switch (priceRange) {
          case 'moins-200k':
            return property.type === 'vente' && numericPrice < 200000;
          case '200k-500k':
            return property.type === 'vente' && numericPrice >= 200000 && numericPrice <= 500000;
          case 'plus-500k':
            return property.type === 'vente' && numericPrice > 500000;
          case 'moins-1000':
            return (property.type === 'location' || property.type === 'saisonnier') && numericPrice < 1000;
          case '1000-2000':
            return (property.type === 'location' || property.type === 'saisonnier') && numericPrice >= 1000 && numericPrice <= 2000;
          case 'plus-2000':
            return (property.type === 'location' || property.type === 'saisonnier') && numericPrice > 2000;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesCategory && matchesPriceRange;
    });
  }, [searchTerm, selectedCategory, priceRange, allProperties]);

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vente':
        return 'À vendre';
      case 'location':
        return 'À louer';
      case 'saisonnier':
        return 'Location court durée';
      default:
        return 'Tous';
    }
  };

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

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Rechercher par titre, lieu ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre par catégorie */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="lg:w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Toutes catégories</SelectItem>
                <SelectItem value="vente">À vendre</SelectItem>
                <SelectItem value="location">À louer</SelectItem>
                <SelectItem value="saisonnier">Location court durée</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre par prix */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Gamme de prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les prix</SelectItem>
                <SelectItem value="moins-200k">Moins de 200k €</SelectItem>
                <SelectItem value="200k-500k">200k - 500k €</SelectItem>
                <SelectItem value="plus-500k">Plus de 500k €</SelectItem>
                <SelectItem value="moins-1000">Moins de 1000 €</SelectItem>
                <SelectItem value="1000-2000">1000 - 2000 €</SelectItem>
                <SelectItem value="plus-2000">Plus de 2000 €</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bouton pour réinitialiser les filtres */}
          {(searchTerm || selectedCategory !== 'tous' || priceRange !== 'tous') && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('tous');
                  setPriceRange('tous');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProperties.length} bien{filteredProperties.length !== 1 ? 's' : ''} trouvé{filteredProperties.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille des biens */}
        {filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
              />
            ))}
          </div>
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
