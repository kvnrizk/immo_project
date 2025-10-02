
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { propertyAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/data/PropertyData';

interface PropertyFormProps {
  property?: Property | null;
  onSave: () => void;
  onCancel: () => void;
}

const PropertyForm = ({ property, onSave, onCancel }: PropertyFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    bedrooms: '',
    area: '',
    price: '',
    description: '',
    features: '',
    image: '',
    images: ''
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        location: property.location || '',
        type: property.type || '',
        bedrooms: property.bedrooms?.toString() || '',
        area: property.area?.toString() || '',
        price: property.price || '',
        description: property.description || '',
        features: Array.isArray(property.features) ? property.features.join(', ') : '',
        image: property.image || '',
        images: Array.isArray(property.images) ? property.images.join(', ') : ''
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms) || 0,
        area: parseInt(formData.area) || 0,
        price: formData.price,
        description: formData.description,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        image: formData.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        images: formData.images ? formData.images.split(',').map(i => i.trim()).filter(i => i) : []
      };

      if (property?.id) {
        // Update existing property
        await propertyAPI.update(property.id, propertyData);
        toast({
          title: "Succès",
          description: "Propriété modifiée avec succès",
        });
      } else {
        // Create new property
        await propertyAPI.create(propertyData);
        toast({
          title: "Succès",
          description: "Propriété créée avec succès",
        });
      }

      onSave();
    } catch (err) {
      toast({
        title: "Erreur",
        description: property?.id ? "Impossible de modifier la propriété" : "Impossible de créer la propriété",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{property ? 'Modifier la propriété' : 'Ajouter une nouvelle propriété'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la propriété *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Appartement Marais"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de bien *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vente">À vendre</SelectItem>
                  <SelectItem value="location">À louer</SelectItem>
                  <SelectItem value="saisonnier">Location court durée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Adresse complète *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ex: 15 Rue des Rosiers, 75004 Paris"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Nombre de chambres</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="2"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Surface (m²)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="65"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="250 000€ ou 1 200€/mois"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez votre propriété..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Équipements (séparés par des virgules)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              placeholder="Wi-Fi, Cuisine équipée, Balcon, Parking"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image principale (URL)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Autres images (URLs séparées par des virgules)</Label>
            <Textarea
              id="images"
              value={formData.images}
              onChange={(e) => handleInputChange('images', e.target.value)}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
