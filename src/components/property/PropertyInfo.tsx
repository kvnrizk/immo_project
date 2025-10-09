
import React from 'react';
import { MapPin, Bed, Square, Bath, Trees, Car, Wifi, Utensils } from 'lucide-react';
import { Property } from '@/data/PropertyData';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  // Helper function to get additional property details based on property type and features
  const getAdditionalDetails = () => {
    const details = [];
    
    // Add bathroom info (assume 1 for studio, bedrooms count for larger properties)
    const bathrooms = property.bedrooms === 1 ? 1 : Math.min(property.bedrooms || 1, 2);
    details.push({
      icon: Bath,
      text: `${bathrooms} salle${bathrooms > 1 ? 's' : ''} de bain`,
      key: 'bathroom'
    });

    // Check features for specific amenities
    if (property.features) {
      if (property.features.some(f => f.toLowerCase().includes('balcon'))) {
        details.push({
          icon: Trees,
          text: 'Balcon',
          key: 'balcon'
        });
      }
      
      if (property.features.some(f => f.toLowerCase().includes('garage') || f.toLowerCase().includes('parking'))) {
        details.push({
          icon: Car,
          text: 'Parking',
          key: 'parking'
        });
      }
      
      if (property.features.some(f => f.toLowerCase().includes('wifi'))) {
        details.push({
          icon: Wifi,
          text: 'Wifi',
          key: 'wifi'
        });
      }
      
      if (property.features.some(f => f.toLowerCase().includes('cuisine'))) {
        details.push({
          icon: Utensils,
          text: 'Cuisine équipée',
          key: 'cuisine'
        });
      }
    }
    
    return details;
  };

  const additionalDetails = getAdditionalDetails();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {property.title}
        </h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {property.location}
          </div>
          <div className="text-3xl font-bold text-primary">
            {property.price}
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {property.bedrooms && (
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-2" />
            {property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}
          </div>
        )}
        {property.area && (
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-2" />
            {property.area} m²
          </div>
        )}
        {additionalDetails.map((detail) => (
          <div key={detail.key} className="flex items-center">
            <detail.icon className="w-4 h-4 mr-2" />
            {detail.text}
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-muted-foreground leading-relaxed">
          {property.description}
        </p>
      </div>

      {/* Features */}
      {property.features && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Caractéristiques</h2>
          <div className="grid grid-cols-2 gap-2">
            {property.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyInfo;
