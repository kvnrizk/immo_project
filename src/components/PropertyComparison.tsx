import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '@/contexts/ComparisonContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Euro, Home, Bed, Maximize2, Eye } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';

interface PropertyComparisonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({ open, onOpenChange }) => {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const navigate = useNavigate();

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

  const handleViewProperty = (id: number) => {
    navigate(`/property/${id}`);
    onOpenChange(false);
  };

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Comparaison de biens</DialogTitle>
              <DialogDescription>
                Comparez jusqu'à 3 propriétés côte à côte
              </DialogDescription>
            </div>
            {comparisonList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearComparison();
                  onOpenChange(false);
                }}
              >
                Tout effacer
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Comparison Table */}
        <div className="grid gap-6 mt-6" style={{ gridTemplateColumns: `repeat(${comparisonList.length}, 1fr)` }}>
          {comparisonList.map((property) => (
            <div key={property.id} className="border rounded-lg overflow-hidden">
              {/* Image */}
              <div className="relative">
                <img
                  src={getImageUrl(property.images?.[0] || property.image)}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => removeFromComparison(property.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Badge className={`absolute bottom-2 left-2 ${getTypeColor(property.type)}`}>
                  {getTypeLabel(property.type)}
                </Badge>
              </div>

              {/* Details */}
              <div className="p-4 space-y-4">
                {/* Title */}
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">{property.title}</h3>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 text-primary">
                  <Euro className="w-5 h-5" />
                  <span className="font-bold text-xl">{property.price}</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span className="text-sm">{property.location}</span>
                </div>

                {/* Features */}
                <div className="space-y-2 pt-2 border-t">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="w-4 h-4 text-muted-foreground" />
                      <span>{property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2 text-sm">
                      <Maximize2 className="w-4 h-4 text-muted-foreground" />
                      <span>{property.area} m²</span>
                    </div>
                  )}
                  {property.type && (
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      <span>{getTypeLabel(property.type)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="text-sm text-muted-foreground">
                  <p className="line-clamp-3">{property.description}</p>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  onClick={() => handleViewProperty(property.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir les détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyComparison;
