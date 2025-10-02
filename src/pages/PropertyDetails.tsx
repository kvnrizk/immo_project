
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PropertyImages from '@/components/property/PropertyImages';
import PropertyInfo from '@/components/property/PropertyInfo';
import AvailabilityCalendar from '@/components/property/AvailabilityCalendar';
import ContactCard from '@/components/property/ContactCard';
import { useProperty, useUnavailableDates } from '@/hooks/useProperties';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(Number(id));
  const { dates: unavailableDates } = useUnavailableDates(Number(id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navigation />
        <div className="text-center pt-20">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navigation />
        <div className="text-center pt-20">
          <h1 className="text-2xl font-bold mb-4">Bien non trouvé</h1>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vente':
        return 'bg-secondary text-secondary-foreground';
      case 'location':
        return 'bg-muted text-muted-foreground';
      case 'saisonnier':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vente':
        return 'À vendre';
      case 'location':
        return 'À louer';
      case 'saisonnier':
        return 'Location court durée';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <PropertyImages 
              property={property}
              getTypeColor={getTypeColor}
              getTypeLabel={getTypeLabel}
            />

            {/* Property Details */}
            <div className="space-y-6">
              <PropertyInfo property={property} />

              {/* Availability Calendar for seasonal rentals */}
              {property.type === 'saisonnier' && (
                <AvailabilityCalendar unavailableDates={unavailableDates} />
              )}

              {/* Contact Button */}
              <ContactCard />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
