import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';

const PropertiesSection = () => {
  const [activeFilter, setActiveFilter] = useState('tous');

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
    }
  ];

  const filteredProperties = activeFilter === 'tous' 
    ? properties 
    : properties.filter(property => property.type === activeFilter);

  const filters = [
    { key: 'tous', label: 'Tous les biens' },
    { key: 'vente', label: 'À vendre' },
    { key: 'location', label: 'À louer' },
    { key: 'saisonnier', label: 'Location court durée' }
  ];

  return (
    <section id="biens" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Découvrez nos biens immobiliers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une sélection de biens de qualité, rigoureusement choisis pour répondre 
            à tous vos besoins immobiliers.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              variant={activeFilter === filter.key ? "default" : "outline"}
              className={activeFilter === filter.key 
                ? "bg-foreground hover:bg-foreground/90 text-background" 
                : "border-foreground text-foreground hover:bg-foreground hover:text-background"
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

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
            <p className="text-muted-foreground">Aucun bien ne correspond à ce filtre pour le moment.</p>
          </div>
        )}

        {/* Lien vers tous les biens */}
        <div className="text-center mt-12">
          <Link to="/properties">
            <Button 
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              Voir tous nos biens
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
