
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Calendar, MapPin, Bed, Square, Trash2 } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { propertyAPI } from '@/services/api';
import { Property } from '@/data/PropertyData';
import { useToast } from '@/hooks/use-toast';

interface PropertiesOverviewProps {
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
}

const PropertiesOverview = ({ onSelectProperty, onEditProperty }: PropertiesOverviewProps) => {
  const { properties, loading, error } = useProperties();
  const { toast } = useToast();
  const [localProperties, setLocalProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (properties) {
      setLocalProperties(properties);
    }
  }, [properties]);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) return;

    try {
      await propertyAPI.delete(id);
      setLocalProperties(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Succès",
        description: "Propriété supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la propriété",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'vente': 'À vendre',
      'location': 'À louer',
      'saisonnier': 'Location courte durée'
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="text-center py-12">Chargement des propriétés...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Propriétés</p>
                <p className="text-2xl font-bold">{localProperties.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">À vendre</p>
                <p className="text-2xl font-bold text-green-600">
                  {localProperties.filter(p => p.type === 'vente').length}
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
                <p className="text-sm font-medium text-muted-foreground">À louer</p>
                <p className="text-2xl font-bold text-blue-600">
                  {localProperties.filter(p => p.type === 'location').length}
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
                <p className="text-sm font-medium text-muted-foreground">Saisonnier</p>
                <p className="text-2xl font-bold text-primary">
                  {localProperties.filter(p => p.type === 'saisonnier').length}
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
        {localProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'}
                alt={property.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                {getTypeLabel(property.type)}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location}
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
                  {property.price}
                </span>
              </div>

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
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(property.id)}
                >
                  <Trash2 className="w-4 h-4" />
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
