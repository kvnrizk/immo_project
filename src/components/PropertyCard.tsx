
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, GitCompare } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { toast } from 'sonner';

interface PropertyCardProps {
  id: number;
  title: string;
  price: string;
  location: string;
  type: 'vente' | 'location' | 'saisonnier';
  image: string;
  images?: string[];
  description: string;
  bedrooms?: number;
  area?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  type,
  image,
  images,
  description,
  bedrooms,
  area
}) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, toggleComparison, comparisonList, maxItems } = useComparison();

  // Use first image from images array, fallback to image field
  const thumbnailImage = images && images.length > 0 ? images[0] : image;

  // Property object for context operations
  const property = { id, title, price, location, type, image, images, description, bedrooms, area };

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

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Your WhatsApp number - CHANGE THIS TO YOUR NUMBER
    // Format: Country code + number (no spaces, no + sign)
    // Example: For France +33 6 12 34 56 78, use: 33612345678
    const whatsappNumber = '33628676124'; // ⬅️ PUT YOUR WHATSAPP NUMBER HERE

    // Create the property URL
    const propertyUrl = `${window.location.origin}/property/${id}`;

    // Create WhatsApp message
    const message = `Bonjour, je suis intéressé(e) par cette propriété:\n\n${title}\n${location}\nPrix: ${price}\n\nLien: ${propertyUrl}`;

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewDetails = () => {
    navigate(`/property/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property);
    toast.success(
      isFavorite(id) ? 'Retiré des favoris' : 'Ajouté aux favoris',
      { duration: 2000 }
    );
  };

  const handleComparisonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = toggleComparison(property);
    if (!success && !isInComparison(id)) {
      toast.error(`Vous pouvez comparer jusqu'à ${maxItems} propriétés maximum`, { duration: 3000 });
    } else {
      toast.success(
        isInComparison(id) ? 'Retiré de la comparaison' : 'Ajouté à la comparaison',
        { duration: 2000 }
      );
    }
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative">
        <img
          src={getImageUrl(thumbnailImage)}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className={`absolute top-4 left-4 ${getTypeColor(type)}`}>
          {getTypeLabel(type)}
        </Badge>

        {/* Favorite and Comparison buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full shadow-lg transition-all ${
              isFavorite(id)
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            onClick={handleFavoriteClick}
            title={isFavorite(id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-4 h-4 ${isFavorite(id) ? 'fill-current' : ''}`} />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full shadow-lg transition-all ${
              isInComparison(id)
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            onClick={handleComparisonClick}
            title={isInComparison(id) ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
          >
            <GitCompare className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground">{location}</p>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          {bedrooms && (
            <span>{bedrooms} chambre{bedrooms > 1 ? 's' : ''}</span>
          )}
          {area && (
            <span>{area} m²</span>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t">
          <div className="text-2xl font-bold text-primary whitespace-nowrap min-w-[140px]">
            {price}
          </div>
          <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            <Button
              onClick={handleViewDetails}
              size="sm"
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Voir plus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
