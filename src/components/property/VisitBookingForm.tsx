import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: '',
  });

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (propertyId && selectedDate) {
        setLoadingSlots(true);
        setSelectedTime(''); // Reset time when date changes
        try {
          const slots = await reservationAPI.getAvailableTimeSlotsPublic(propertyId, selectedDate);
          setAvailableSlots(slots);
          if (slots.length === 0) {
            toast({
              title: 'Aucun créneau disponible',
              description: 'Veuillez sélectionner une autre date.',
              variant: 'destructive',
            });
          }
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
      const meetingDate = `${selectedDate}T${selectedTime}:00`;

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
        description: 'Votre demande de visite a été enregistrée. Nous vous contactons bientôt.',
      });

      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: '',
      });
      setSelectedDate('');
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Réserver une visite
        </CardTitle>
        <CardDescription>
          Choisissez un créneau pour visiter ce bien
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="visitDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date de visite *
            </Label>
            <Input
              id="visitDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <Label htmlFor="visitTime" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Créneau horaire *
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate || loadingSlots}
            >
              <SelectTrigger id="visitTime">
                <SelectValue
                  placeholder={
                    loadingSlots
                      ? 'Chargement...'
                      : !selectedDate
                        ? 'Sélectionnez d\'abord une date'
                        : 'Sélectionner un créneau'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.length === 0 && !loadingSlots && selectedDate && (
                  <SelectItem value="none" disabled>
                    Aucun créneau disponible
                  </SelectItem>
                )}
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Visites disponibles du lundi au vendredi uniquement
            </p>
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
