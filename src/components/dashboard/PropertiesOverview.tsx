
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Power, PowerOff, Calendar, MapPin, Bed, Square, Trash2 } from 'lucide-react';
import { propertyAPI } from '@/services/api';
import { Property } from '@/data/PropertyData';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/utils/imageUrl';

interface PropertiesOverviewProps {
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
}

const PropertiesOverview = ({ onSelectProperty, onEditProperty }: PropertiesOverviewProps) => {
  const { toast } = useToast();

  // Use React Query for properties with cache invalidation support
  const { data: properties = [], isLoading: loading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyAPI.getAll(undefined, true), // Include inactive properties in dashboard
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: 'always', // Always refetch on mount
  });

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

  const handleToggleActive = async (id: number) => {
    try {
      const updatedProperty = await propertyAPI.toggleActive(id);
      setLocalProperties(prev =>
        prev.map(p => p.id === id ? updatedProperty : p)
      );
      toast({
        title: "Succès",
        description: updatedProperty.isActive ? "Propriété activée" : "Propriété désactivée",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut",
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
    return <div className="text-center py-12 text-red-500">{error.message || 'Une erreur est survenue'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Total</p>
                  <div className="md:hidden h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold mt-1">{localProperties.length}</p>
              </div>
              <div className="hidden md:flex h-8 w-8 bg-primary/10 rounded-full items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">À vendre</p>
                  <div className="md:hidden h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
                  {localProperties.filter(p => p.type === 'vente').length}
                </p>
              </div>
              <div className="hidden md:flex h-8 w-8 bg-green-100 rounded-full items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">À louer</p>
                  <div className="md:hidden h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bed className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {localProperties.filter(p => p.type === 'location').length}
                </p>
              </div>
              <div className="hidden md:flex h-8 w-8 bg-blue-100 rounded-full items-center justify-center">
                <Bed className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Saisonnier</p>
                  <div className="md:hidden h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Square className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-primary mt-1">
                  {localProperties.filter(p => p.type === 'saisonnier').length}
                </p>
              </div>
              <div className="hidden md:flex h-8 w-8 bg-primary/10 rounded-full items-center justify-center">
                <Square className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localProperties.map((property) => {
          // Use first image from images array, fallback to image field
          const thumbnailImage = property.images && property.images.length > 0
            ? property.images[0]
            : property.image;

          return (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={getImageUrl(thumbnailImage)}
                alt={property.title}
                className={`w-full h-48 object-cover rounded-t-lg transition-opacity ${
                  property.isActive ? 'opacity-100' : 'opacity-50'
                }`}
              />
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                {getTypeLabel(property.type)}
              </Badge>
              {!property.isActive && (
                <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm">Désactivé</Badge>
                </div>
              )}
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
                  variant={property.isActive ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleToggleActive(property.id)}
                >
                  {property.isActive ? (
                    <>
                      <Power className="w-4 h-4 mr-1" />
                      Actif
                    </>
                  ) : (
                    <>
                      <PowerOff className="w-4 h-4 mr-1" />
                      Inactif
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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
        );
        })}
      </div>
    </div>
  );
};

export default PropertiesOverview;
