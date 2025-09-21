
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface PropertyFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const PropertyForm = ({ onSave, onCancel }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    type: '',
    bedrooms: '',
    area: '',
    price: '',
    description: '',
    amenities: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the property data
    console.log('Saving property:', formData);
    onSave();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter une nouvelle propriété</CardTitle>
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
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
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
              <Label htmlFor="price">Prix par nuit (€) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="120"
                min="0"
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
            <Label htmlFor="amenities">Équipements</Label>
            <Textarea
              id="amenities"
              value={formData.amenities}
              onChange={(e) => handleInputChange('amenities', e.target.value)}
              placeholder="Wi-Fi, Cuisine équipée, Balcon, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
