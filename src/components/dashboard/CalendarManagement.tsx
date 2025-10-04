import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';
import { propertyAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CalendarManagement = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const { properties } = useProperties('saisonnier');
  const { toast } = useToast();

  // Load unavailable dates when property is selected
  useEffect(() => {
    if (selectedPropertyId) {
      loadUnavailableDates();
    }
  }, [selectedPropertyId]);

  const loadUnavailableDates = async () => {
    if (!selectedPropertyId) return;

    try {
      setLoading(true);
      const dates = await propertyAPI.getUnavailableDates(selectedPropertyId);
      setUnavailableDates(dates);
    } catch (error) {
      console.error('Error loading unavailable dates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les dates indisponibles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => {
      const d1 = new Date(unavailableDate);
      return (
        d1.getFullYear() === date.getFullYear() &&
        d1.getMonth() === date.getMonth() &&
        d1.getDate() === date.getDate()
      );
    });
  };

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date || !selectedPropertyId) return;

    // Toggle availability: if date is unavailable, make it available, and vice versa
    if (isDateUnavailable(date)) {
      await handleRemoveUnavailableDate(date);
    } else {
      await handleAddUnavailableDate(date);
    }

    setSelectedDate(undefined);
  };

  const handleAddUnavailableDate = async (dateToAdd?: Date) => {
    const targetDate = dateToAdd || selectedDate;
    if (!targetDate || !selectedPropertyId) return;

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/properties/${selectedPropertyId}/unavailable-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unavailable_date: format(targetDate, 'yyyy-MM-dd'),
          reason: 'Booked'
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to add unavailable date');

      toast({
        title: "Succès",
        description: "Date marquée comme indisponible"
      });

      // Reload unavailable dates
      await loadUnavailableDates();
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error adding unavailable date:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la date indisponible",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUnavailableDate = async (dateToRemove: Date) => {
    if (!selectedPropertyId) return;

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/properties/${selectedPropertyId}/unavailable-dates`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unavailable_date: format(dateToRemove, 'yyyy-MM-dd')
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to remove unavailable date');

      toast({
        title: "Succès",
        description: "Date marquée comme disponible"
      });

      // Reload unavailable dates
      await loadUnavailableDates();
    } catch (error) {
      console.error('Error removing unavailable date:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer la date indisponible",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedProperty = properties?.find(p => p.id === selectedPropertyId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestion du calendrier</h2>
        <p className="text-muted-foreground">
          Gérez les dates disponibles pour vos locations court durée
        </p>
      </div>

      {/* Property Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Sélectionner une propriété
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties?.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedPropertyId(property.id)}
                className={`relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                  selectedPropertyId === property.id
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <img
                  src={property.image?.startsWith('http') ? property.image : `http://localhost:3000${property.image}` || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'}
                  alt={property.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 bg-white">
                  <h3 className="font-semibold text-sm truncate">{property.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                  <p className="text-xs font-medium text-primary mt-1">{property.price}</p>
                </div>
                {selectedPropertyId === property.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          {properties?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucune propriété de court durée disponible
            </p>
          )}
        </CardContent>
      </Card>

      {/* Calendar and Dates Management */}
      {selectedPropertyId && selectedProperty && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendrier</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une date pour la marquer comme indisponible
              </p>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                modifiers={{
                  unavailable: unavailableDates
                }}
                modifiersClassNames={{
                  unavailable: 'bg-red-100 text-red-900 line-through hover:bg-red-200'
                }}
                numberOfMonths={2}
                className="rounded-md border"
              />

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Instructions:</strong> Cliquez sur une date pour basculer sa disponibilité.
                </p>
                <ul className="mt-2 text-xs text-blue-800 space-y-1">
                  <li>• <span className="text-red-600 font-semibold">Dates barrées en rouge</span> = indisponibles</li>
                  <li>• <span className="font-semibold">Dates normales</span> = disponibles</li>
                  <li>• Cliquez pour rendre indisponible ou disponible</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Unavailable Dates List */}
          <Card>
            <CardHeader>
              <CardTitle>Dates indisponibles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Liste des dates actuellement indisponibles
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {loading && (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                )}

                {!loading && unavailableDates.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune date indisponible pour cette propriété
                  </p>
                )}

                {!loading && unavailableDates.map((date, index) => {
                  const dateObj = new Date(date);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {format(dateObj, 'dd MMMM yyyy', { locale: fr })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUnavailableDate(dateObj)}
                        disabled={loading}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedPropertyId && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              Sélectionnez une propriété pour gérer son calendrier
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarManagement;
