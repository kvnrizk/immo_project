import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { propertyAPI } from '@/services/api';

const PropertiesSection = () => {
  const [activeFilter, setActiveFilter] = useState('tous');
  const { data: properties = [], isLoading: loading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyAPI.getAll(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const filteredProperties = activeFilter === 'tous'
    ? (properties || [])
    : (properties || []).filter(property => property.type === activeFilter);

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

        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des biens...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error instanceof Error ? error.message : 'Une erreur est survenue'}</p>
          </div>
        )}

        {!loading && !error && (
          <>
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
          </>
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
