
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Calendar, MapPin, Bed, Square } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  address: string;
  type: string;
  bedrooms: number;
  area: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  image: string;
  nextBooking?: string;
}

interface PropertiesOverviewProps {
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
}

const PropertiesOverview = ({ onSelectProperty, onEditProperty }: PropertiesOverviewProps) => {
  // Mock data - will be replaced with real data from backend
  const [properties] = useState<Property[]>([
    {
      id: 1,
      title: "Appartement Marais",
      address: "15 Rue des Rosiers, 75004 Paris",
      type: "Appartement",
      bedrooms: 2,
      area: 65,
      price: 120,
      status: 'available',
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=400&q=80",
      nextBooking: "2024-07-15"
    },
    {
      id: 2,
      title: "Studio Montmartre",
      address: "8 Place du Tertre, 75018 Paris",
      type: "Studio",
      bedrooms: 1,
      area: 35,
      price: 85,
      status: 'occupied',
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=400&q=80",
      nextBooking: "2024-07-20"
    },
    {
      id: 3,
      title: "Loft Saint-Germain",
      address: "22 Rue de Seine, 75006 Paris",
      type: "Loft",
      bedrooms: 3,
      area: 95,
      price: 180,
      status: 'maintenance',
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=400&q=80"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Occupé';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Propriétés</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupées</p>
                <p className="text-2xl font-bold text-blue-600">
                  {properties.filter(p => p.status === 'occupied').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bed className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue/mois</p>
                <p className="text-2xl font-bold text-primary">
                  {properties.reduce((sum, p) => sum + p.price, 0)}€
                </p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Square className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}>
                {getStatusLabel(property.status)}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {property.address}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {property.bedrooms} ch.
                </span>
                <span className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  {property.area} m²
                </span>
                <span className="font-semibold text-primary">
                  {property.price}€/nuit
                </span>
              </div>

              {property.nextBooking && (
                <p className="text-xs text-muted-foreground">
                  Prochaine réservation: {property.nextBooking}
                </p>
              )}

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onSelectProperty(property)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onEditProperty(property)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertiesOverview;
