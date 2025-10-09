import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Heart, Home } from 'lucide-react';

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500 fill-current" />
                  Mes Favoris
                </h1>
                <p className="text-muted-foreground">
                  {favorites.length === 0
                    ? 'Aucun bien en favori pour le moment'
                    : `${favorites.length} bien${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {favorites.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
                      clearFavorites();
                    }
                  }}
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Tout supprimer
                </Button>
              )}
            </div>
          </div>

          {/* Empty state */}
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Aucun favori pour le moment
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explorez nos biens immobiliers et ajoutez vos coups de cœur à vos favoris en cliquant sur l'icône cœur.
              </p>
              <Link to="/properties">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Home className="w-4 h-4 mr-2" />
                  Découvrir nos biens
                </Button>
              </Link>
            </div>
          ) : (
            /* Properties grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
