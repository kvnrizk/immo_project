
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/data/PropertyData';
import ImageLightbox from './ImageLightbox';
import { getImageUrl } from '@/utils/imageUrl';

interface PropertyImagesProps {
  property: Property;
  getTypeColor: (type: string) => string;
  getTypeLabel: (type: string) => string;
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ 
  property, 
  getTypeColor, 
  getTypeLabel 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Combine main image with additional images
  const allImages = property.images || [property.image];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={getImageUrl(property.image)}
          alt={property.title}
          className="w-full h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
        />
        <Badge className={`absolute top-4 left-4 ${getTypeColor(property.type)}`}>
          {getTypeLabel(property.type)}
        </Badge>
      </div>
      
      {property.images && Array.isArray(property.images) && property.images.length > 1 && (
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${property.title} - ${index + 2}`}
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(index + 1)}
            />
          ))}
        </div>
      )}

      <ImageLightbox
        images={allImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={selectedImageIndex}
        propertyTitle={property.title}
      />
    </div>
  );
};

export default PropertyImages;
