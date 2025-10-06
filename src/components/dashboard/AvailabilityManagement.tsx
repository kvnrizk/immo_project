import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { availabilityAPI, DayOfWeek } from '@/services/api';
import { format } from 'date-fns';

const AvailabilityManagement = () => {
  const queryClient = useQueryClient();
  const [isBlockDateDialogOpen, setIsBlockDateDialogOpen] = useState(false);

  // Generate time slots from 9:00 to 17:00
  const TIME_SLOTS = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Fetch availability
  const { data: availability = [] } = useQuery({
    queryKey: ['availability'],
    queryFn: availabilityAPI.getAll,
  });

  // Fetch unavailable dates
  const { data: unavailableDates = [] } = useQuery({
    queryKey: ['unavailableDates'],
    queryFn: availabilityAPI.getUnavailableDates,
  });

  // Create availability mutation
  const createAvailabilityMutation = useMutation({
    mutationFn: availabilityAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast({ title: 'Créneau ajouté', description: 'Le créneau est maintenant disponible.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // Delete availability mutation
  const deleteAvailabilityMutation = useMutation({
    mutationFn: availabilityAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast({ title: 'Créneau supprimé', description: 'Le créneau n\'est plus disponible.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // Block date mutation
  const blockDateMutation = useMutation({
    mutationFn: availabilityAPI.createUnavailableDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unavailableDates'] });
      toast({ title: 'Date bloquée', description: 'La date a été marquée comme indisponible.' });
      setIsBlockDateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // Unblock date mutation
  const unblockDateMutation = useMutation({
    mutationFn: availabilityAPI.deleteUnavailableDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unavailableDates'] });
      toast({ title: 'Date débloquée', description: 'La date est maintenant disponible.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const handleBlockDate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    blockDateMutation.mutate({
      date: formData.get('date') as string,
      reason: formData.get('reason') as string || undefined,
    });
  };

  const dayLabels: Record<DayOfWeek, string> = {
    [DayOfWeek.MONDAY]: 'Lundi',
    [DayOfWeek.TUESDAY]: 'Mardi',
    [DayOfWeek.WEDNESDAY]: 'Mercredi',
    [DayOfWeek.THURSDAY]: 'Jeudi',
    [DayOfWeek.FRIDAY]: 'Vendredi',
    [DayOfWeek.SATURDAY]: 'Samedi',
    [DayOfWeek.SUNDAY]: 'Dimanche',
  };

  const daysOrder = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ];

  // Check if a time slot is available for a specific day
  const isSlotAvailable = (day: DayOfWeek, timeSlot: string): boolean => {
    const endHour = parseInt(timeSlot.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    return availability.some(
      (slot) =>
        slot.dayOfWeek === day &&
        slot.startTime === timeSlot &&
        slot.endTime === endTime &&
        slot.isActive
    );
  };

  // Get the availability ID for a time slot
  const getSlotId = (day: DayOfWeek, timeSlot: string): string | null => {
    const endHour = parseInt(timeSlot.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    const slot = availability.find(
      (s) =>
        s.dayOfWeek === day &&
        s.startTime === timeSlot &&
        s.endTime === endTime
    );
    return slot?.id || null;
  };

  // Toggle time slot availability
  const toggleSlot = (day: DayOfWeek, timeSlot: string) => {
    const slotId = getSlotId(day, timeSlot);
    const endHour = parseInt(timeSlot.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    if (slotId) {
      // Slot exists, delete it
      deleteAvailabilityMutation.mutate(slotId);
    } else {
      // Slot doesn't exist, create it
      createAvailabilityMutation.mutate({
        dayOfWeek: day,
        startTime: timeSlot,
        endTime: endTime,
        isActive: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Disponibilités</h2>
          <p className="text-muted-foreground">
            Cliquez sur les créneaux pour les activer/désactiver
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Availability */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Disponibilités Hebdomadaires</CardTitle>
            </div>
            <CardDescription>
              Créneaux d'une heure - Vert = Disponible, Gris = Indisponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {daysOrder.map((day) => (
                <div key={day} className="space-y-3">
                  <h4 className="font-semibold text-sm">{dayLabels[day]}</h4>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((timeSlot) => {
                      const isAvailable = isSlotAvailable(day, timeSlot);
                      const endHour = parseInt(timeSlot.split(':')[0]) + 1;

                      return (
                        <button
                          key={timeSlot}
                          onClick={() => toggleSlot(day, timeSlot)}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium
                            transition-all duration-200 hover:scale-105 hover:shadow-md
                            ${
                              isAvailable
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }
                          `}
                        >
                          {timeSlot} - {endHour}:00
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blocked Dates */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <CardTitle>Dates Bloquées</CardTitle>
              </div>
              <Dialog open={isBlockDateDialogOpen} onOpenChange={setIsBlockDateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Bloquer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bloquer une Date</DialogTitle>
                    <DialogDescription>
                      Aucune réservation ne pourra être prise ce jour
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBlockDate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Raison (optionnel)</Label>
                      <Textarea
                        id="reason"
                        name="reason"
                        placeholder="Ex: Congés, rendez-vous personnel..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Bloquer la date
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              Journées complètement indisponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {unavailableDates.length > 0 ? (
                unavailableDates.map((blockedDate) => (
                  <div
                    key={blockedDate.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {format(new Date(blockedDate.date), 'dd/MM/yyyy')}
                      </p>
                      {blockedDate.reason && (
                        <p className="text-sm text-muted-foreground truncate">
                          {blockedDate.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => unblockDateMutation.mutate(blockedDate.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune date bloquée
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityManagement;
