
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

const AllProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [priceRange, setPriceRange] = useState('tous');

  const properties = [
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
      id: 4,
      title: "Loft industriel",
      price: "520 000 €",
      location: "Lyon 7ème",
      type: "vente" as const,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
      description: "Loft unique de 150m² avec vue exceptionnelle, dans un quartier en pleine expansion.",
      bedrooms: 2,
      area: 150
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
    },
    {
      id: 7,
      title: "Villa avec piscine",
      price: "750 000 €",
      location: "Lyon 9ème",
      type: "vente" as const,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      description: "Magnifique villa de 200m² avec piscine et grand jardin, dans quartier résidentiel calme.",
      bedrooms: 5,
      area: 200
    },
    {
      id: 8,
      title: "Duplex moderne",
      price: "1 800 €/mois",
      location: "Lyon 3ème",
      type: "location" as const,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      description: "Duplex de 110m² avec terrasse, dans immeuble récent avec ascenseur et parking.",
      bedrooms: 3,
      area: 110
    }
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
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
  }, [searchTerm, selectedCategory, priceRange, properties]);

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
