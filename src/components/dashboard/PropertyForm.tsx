
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Upload, ImageIcon, Trash2, GripVertical } from 'lucide-react';
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    bedrooms: '',
    area: '',
    price: '',
    description: '',
    features: '',
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
      });
      // Set preview URLs from existing images
      if (property.images && Array.isArray(property.images)) {
        setPreviewUrls(property.images);
      }
    }
  }, [property]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast({
          title: "Erreur",
          description: `${file.name} n'est pas une image valide`,
          variant: "destructive",
        });
      }
      return isImage;
    });

    // Validate file sizes (5MB max)
    const validSizeFiles = validFiles.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidSize) {
        toast({
          title: "Erreur",
          description: `${file.name} est trop volumineux (max 5MB)`,
          variant: "destructive",
        });
      }
      return isValidSize;
    });

    // Create preview URLs
    const newPreviewUrls = validSizeFiles.map(file => URL.createObjectURL(file));

    setSelectedFiles(prev => [...prev, ...validSizeFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = async (index: number) => {
    const imageUrl = previewUrls[index];

    // If it's an existing image from the server (not a blob), delete it from the backend
    if (property?.id && !imageUrl.startsWith('blob:')) {
      try {
        await propertyAPI.deleteImage(property.id, imageUrl);
        toast({
          title: "Succès",
          description: "Image supprimée avec succès",
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'image",
          variant: "destructive",
        });
        return;
      }
    }

    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory for blob URLs
      if (prev[index].startsWith('blob:')) {
        URL.revokeObjectURL(prev[index]);
      }
      return newUrls;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newPreviewUrls = [...previewUrls];
    const newSelectedFiles = [...selectedFiles];

    // Swap the items
    const draggedUrl = newPreviewUrls[draggedIndex];
    const draggedFile = newSelectedFiles[draggedIndex];

    newPreviewUrls.splice(draggedIndex, 1);
    newPreviewUrls.splice(dropIndex, 0, draggedUrl);

    if (draggedFile) {
      newSelectedFiles.splice(draggedIndex, 1);
      newSelectedFiles.splice(dropIndex, 0, draggedFile);
    }

    setPreviewUrls(newPreviewUrls);
    setSelectedFiles(newSelectedFiles);
    setDraggedIndex(null);

    // If editing existing property and all images are from server, update the order
    if (property?.id && newPreviewUrls.every(url => !url.startsWith('blob:'))) {
      try {
        await propertyAPI.reorderImages(property.id, newPreviewUrls);
        toast({
          title: "Succès",
          description: "L'ordre des images a été mis à jour. La première image est maintenant l'image principale.",
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de réorganiser les images",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms) || undefined,
        area: parseInt(formData.area) || undefined,
        price: formData.price,
        description: formData.description,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      };

      let createdProperty;

      if (property?.id) {
        // Update existing property
        await propertyAPI.update(property.id, propertyData);
        createdProperty = property;
        toast({
          title: "Succès",
          description: "Propriété modifiée avec succès",
        });
      } else {
        // Create new property
        createdProperty = await propertyAPI.create(propertyData);
        toast({
          title: "Succès",
          description: "Propriété créée avec succès",
        });
      }

      // Upload images if any were selected
      if (selectedFiles.length > 0 && createdProperty?.id) {
        try {
          await propertyAPI.uploadImages(createdProperty.id.toString(), selectedFiles);
          toast({
            title: "Succès",
            description: "Images téléchargées avec succès",
          });
        } catch (err) {
          toast({
            title: "Avertissement",
            description: "Propriété créée mais erreur lors du téléchargement des images",
            variant: "destructive",
          });
        }
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
            <Label htmlFor="images">Images de la propriété</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Cliquez pour sélectionner des images
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WEBP jusqu'à 5MB (max 10 images)
                </p>
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {window.innerWidth >= 768 ?
                    "💡 Glissez-déposez les images pour changer l'ordre. La première image sera l'image principale." :
                    "La première image est l'image principale."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                      draggable={window.innerWidth >= 768}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      {window.innerWidth >= 768 && (
                        <div className="absolute top-1 left-1 bg-gray-800/70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
