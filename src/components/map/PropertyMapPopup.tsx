import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/data/PropertyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Square } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';

interface PropertyMapPopupProps {
  property: Property;
}

const PropertyMapPopup: React.FC<PropertyMapPopupProps> = ({ property }) => {
  const navigate = useNavigate();

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

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  // Use first image from images array, fallback to image field
  const thumbnailImage = property.images && property.images.length > 0
    ? property.images[0]
    : property.image;

  return (
    <div className="w-96 bg-background rounded-lg overflow-hidden shadow-lg">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={getImageUrl(thumbnailImage)}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-2 left-2 ${getTypeColor(property.type)}`}>
          {getTypeLabel(property.type)}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {property.location}
          </div>
        </div>

        {/* Property details */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms}
            </div>
          )}
          {property.area && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              {property.area} m²
            </div>
          )}
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t">
          <div className="text-xl font-bold text-primary whitespace-nowrap flex-shrink-0">
            {property.price}
          </div>
          <Button
            onClick={handleViewDetails}
            size="sm"
            className="bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            Voir plus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapPopup;
