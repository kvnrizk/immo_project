import React from 'react';
import { Search, Filter, SlidersHorizontal, Bookmark, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface FilterState {
  searchTerm: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  minArea: number;
  maxArea: number;
  location: string;
  sortBy: string;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSavePreferences: () => void;
  onLoadPreferences: () => void;
  onClearFilters: () => void;
  hasSavedPreferences: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSavePreferences,
  onLoadPreferences,
  onClearFilters,
  hasSavedPreferences,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.category !== 'tous' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000000 ||
    filters.bedrooms !== 'tous' ||
    filters.minArea > 0 ||
    filters.maxArea < 500 ||
    filters.location !== '' ||
    filters.sortBy !== 'recent';

  // Determine max price based on category
  const getMaxPriceForCategory = () => {
    if (filters.category === 'vente') return 2000000;
    if (filters.category === 'location') return 5000;
    if (filters.category === 'saisonnier') return 500;
    return 2000000; // Default for "tous"
  };

  const formatPrice = (value: number) => {
    if (filters.category === 'vente' || (filters.category === 'tous' && value > 10000)) {
      return `${(value / 1000).toFixed(0)}k €`;
    }
    return `${value} €`;
  };

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      {/* Search Bar */}
      <div className="space-y-2">
        <Label htmlFor="search">Recherche</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            id="search"
            placeholder="Rechercher par titre, lieu ou description..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes catégories</SelectItem>
              <SelectItem value="vente">À vendre</SelectItem>
              <SelectItem value="location">À louer</SelectItem>
              <SelectItem value="saisonnier">Location court durée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms Filter */}
        <div className="space-y-2">
          <Label>Chambres</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Nombre de chambres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Trier par</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SlidersHorizontal size={16} className="mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="area-asc">Surface croissante</SelectItem>
              <SelectItem value="area-desc">Surface décroissante</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters Collapsible */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <SlidersHorizontal size={16} className="mr-2" />
            {isAdvancedOpen ? 'Masquer' : 'Afficher'} les filtres avancés
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label>Gamme de prix</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
                className="w-32"
              />
              <span className="text-muted-foreground">à</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice === getMaxPriceForCategory() ? '' : filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || getMaxPriceForCategory())}
                className="w-32"
              />
            </div>
            <div className="pt-2">
              <Slider
                min={0}
                max={getMaxPriceForCategory()}
                step={filters.category === 'vente' ? 10000 : 50}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={([min, max]) => {
                  updateFilter('minPrice', min);
                  updateFilter('maxPrice', max);
                }}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatPrice(filters.minPrice)}</span>
                <span>{formatPrice(filters.maxPrice)}</span>
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div className="space-y-3">
            <Label>Surface (m²)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minArea || ''}
                onChange={(e) => updateFilter('minArea', parseInt(e.target.value) || 0)}
                className="w-32"
              />
              <span className="text-muted-foreground">à</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxArea === 500 ? '' : filters.maxArea}
                onChange={(e) => updateFilter('maxArea', parseInt(e.target.value) || 500)}
                className="w-32"
              />
            </div>
            <div className="pt-2">
              <Slider
                min={0}
                max={500}
                step={5}
                value={[filters.minArea, filters.maxArea]}
                onValueChange={([min, max]) => {
                  updateFilter('minArea', min);
                  updateFilter('maxArea', max);
                }}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filters.minArea} m²</span>
                <span>{filters.maxArea} m²</span>
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              placeholder="Ex: Lyon, Villeurbanne, Lyon 6ème..."
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="flex items-center gap-2">
            <X size={16} />
            Réinitialiser
          </Button>
        )}
        <Button variant="outline" onClick={onSavePreferences} className="flex items-center gap-2">
          <Bookmark size={16} />
          Sauvegarder la recherche
        </Button>
        {hasSavedPreferences && (
          <Button variant="secondary" onClick={onLoadPreferences} className="flex items-center gap-2">
            <Bookmark size={16} className="fill-current" />
            Charger la recherche
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
