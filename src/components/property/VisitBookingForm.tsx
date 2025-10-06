import React, { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, Mail, Phone, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { reservationAPI, ReservationType } from '@/services/api';

interface VisitBookingFormProps {
  propertyId: number;
  propertyType: 'vente' | 'location';
  propertyTitle?: string;
}

const VisitBookingForm: React.FC<VisitBookingFormProps> = ({
  propertyId,
  propertyType,
  propertyTitle,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: '',
  });

  // Generate weekdays (Monday to Friday) for current week
  const weekDays = useMemo(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(addDays(today, weekOffset * 7), { weekStartsOn: 1 });
    const days = [];

    for (let i = 0; i < 5; i++) { // Monday to Friday
      const day = addDays(startOfCurrentWeek, i);
      // Only show days that are today or in the future
      if (day >= new Date(today.setHours(0, 0, 0, 0))) {
        days.push(day);
      }
    }

    return days;
  }, [weekOffset]);

  // Generate time slots from 9:00 to 16:00 (9-10, 10-11, etc.)
  const TIME_SLOTS = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (propertyId && selectedDate) {
        setLoadingSlots(true);
        setSelectedTime(''); // Reset time when date changes
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const slots = await reservationAPI.getAvailableTimeSlotsPublic(propertyId, dateStr);
          setAvailableSlots(slots);
        } catch (error) {
          console.error('Error fetching slots:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les créneaux disponibles.',
            variant: 'destructive',
          });
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      }
    };
    fetchSlots();
  }, [propertyId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez sélectionner une date et un créneau horaire.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const meetingDate = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`;

      await reservationAPI.createPublic({
        propertyId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        type: propertyType as ReservationType,
        meetingDate,
        notes: formData.notes || undefined,
      });

      toast({
        title: 'Demande envoyée !',
        description: 'Votre demande de visite a été enregistrée. Nous vous contacterons bientôt.',
      });

      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: '',
      });
      setSelectedDate(null);
      setSelectedTime('');
      setAvailableSlots([]);
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la réservation.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canGoPreviousWeek = weekOffset > 0;
  const canGoNextWeek = weekOffset < 4; // Limit to 4 weeks ahead

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Réserver une visite
        </CardTitle>
        <CardDescription>
          Choisissez un jour et un créneau horaire disponible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(prev => prev - 1)}
              disabled={!canGoPreviousWeek}
            >
              <ChevronLeft className="w-4 h-4" />
              Semaine précédente
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              {weekOffset === 0 ? 'Cette semaine' : `Semaine ${weekOffset + 1}`}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(prev => prev + 1)}
              disabled={!canGoNextWeek}
            >
              Semaine suivante
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <Label>Sélectionnez un jour *</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {weekDays.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayName = format(day, 'EEEE', { locale: fr });
                const dayDate = format(day, 'd MMM', { locale: fr });

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime('');
                    }}
                    className={`
                      p-4 rounded-lg border-2 text-center transition-all duration-200
                      hover:scale-105 hover:shadow-md
                      ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="font-semibold text-sm capitalize">
                      {dayName}
                    </div>
                    <div className="text-xs mt-1 opacity-90">
                      {dayDate}
                    </div>
                  </button>
                );
              })}
            </div>
            {weekDays.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun jour disponible cette semaine
              </p>
            )}
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="space-y-2">
              <Label>Sélectionnez un créneau horaire *</Label>
              {loadingSlots ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Chargement des créneaux...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((timeSlot) => {
                    const isAvailable = availableSlots.includes(timeSlot);
                    const isSelected = selectedTime === timeSlot;
                    const endHour = parseInt(timeSlot.split(':')[0]) + 1;

                    return (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => isAvailable && setSelectedTime(timeSlot)}
                        disabled={!isAvailable}
                        className={`
                          p-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${
                            isSelected
                              ? 'bg-primary text-primary-foreground scale-105 shadow-md'
                              : isAvailable
                                ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100 hover:scale-105 hover:shadow-md'
                                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50 line-through'
                          }
                        `}
                      >
                        {timeSlot.slice(0, 5)} - {endHour}:00
                      </button>
                    );
                  })}
                </div>
              )}
              {!loadingSlots && availableSlots.length === 0 && (
                <p className="text-sm text-destructive text-center py-4">
                  Aucun créneau disponible pour cette date
                </p>
              )}
            </div>
          )}

          {/* Client Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Vos informations</h3>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom complet *
              </Label>
              <Input
                id="clientName"
                type="text"
                placeholder="Votre nom"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="votre@email.com"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone *
              </Label>
              <Input
                id="clientPhone"
                type="tel"
                placeholder="+33 6 00 00 00 00"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notes (optionnel)
              </Label>
              <Textarea
                id="notes"
                placeholder="Des questions ou remarques particulières ?"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !selectedDate || !selectedTime}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Réserver une visite'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            * Champs obligatoires
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default VisitBookingForm;
