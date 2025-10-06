import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { availabilityAPI, reservationAPI, DayOfWeek } from '@/services/api';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const AvailabilityManagement = () => {
  const queryClient = useQueryClient();
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate weekdays (Monday to Friday) for current week
  const weekDays = useMemo(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(addDays(today, weekOffset * 7), { weekStartsOn: 1 });
    const days = [];

    for (let i = 0; i < 5; i++) { // Monday to Friday
      const day = addDays(startOfCurrentWeek, i);
      days.push(day);
    }

    return days;
  }, [weekOffset]);

  // Generate time slots from 9:00 to 16:00
  const TIME_SLOTS = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Fetch reservations
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationAPI.getAll,
  });

  // Fetch unavailable dates
  const { data: unavailableDates = [] } = useQuery({
    queryKey: ['unavailableDates'],
    queryFn: availabilityAPI.getUnavailableDates,
  });

  // Block date mutation
  const blockDateMutation = useMutation({
    mutationFn: (data: { date: string; timeSlot?: string }) => {
      // If timeSlot is provided, block specific time, otherwise block whole day
      return availabilityAPI.createUnavailableDate({
        date: data.date,
        reason: data.timeSlot ? `Bloqué: ${data.timeSlot}` : 'Journée bloquée',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unavailableDates'] });
      toast({ title: 'Date bloquée', description: 'Le créneau a été marqué comme indisponible.' });
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
      toast({ title: 'Date débloquée', description: 'Le créneau est maintenant disponible.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const dayLabels: Record<string, string> = {
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
  };

  // Get reservation for a specific date and time
  const getReservationForSlot = (date: Date, timeSlot: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return reservations.find(res => {
      const resDate = format(new Date(res.meetingDate), 'yyyy-MM-dd');
      const resTime = format(new Date(res.meetingDate), 'HH:mm');
      return resDate === dateStr && resTime === timeSlot && res.status !== 'annulée';
    });
  };

  // Check if a date/time is blocked
  const isSlotBlocked = (date: Date, timeSlot?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableDates.some(blocked => {
      const blockedDateStr = format(new Date(blocked.date), 'yyyy-MM-dd');
      if (timeSlot && blocked.reason?.includes(timeSlot)) {
        return blockedDateStr === dateStr;
      }
      return blockedDateStr === dateStr && !blocked.reason?.includes('Bloqué:');
    });
  };

  // Get blocked slot ID for a specific date/time
  const getBlockedSlotId = (date: Date, timeSlot?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const blocked = unavailableDates.find(b => {
      const blockedDateStr = format(new Date(b.date), 'yyyy-MM-dd');
      if (timeSlot && b.reason?.includes(timeSlot)) {
        return blockedDateStr === dateStr;
      }
      return blockedDateStr === dateStr && !b.reason?.includes('Bloqué:');
    });
    return blocked?.id || null;
  };

  // Toggle block for a specific slot
  const toggleBlockSlot = (date: Date, timeSlot: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const blockedId = getBlockedSlotId(date, timeSlot);

    if (blockedId) {
      // Unblock
      unblockDateMutation.mutate(blockedId);
    } else {
      // Block
      blockDateMutation.mutate({ date: dateStr, timeSlot });
    }
  };

  const canGoPreviousWeek = weekOffset > -4; // Allow going back 4 weeks
  const canGoNextWeek = weekOffset < 8; // Allow going forward 8 weeks

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Disponibilités</h2>
          <p className="text-muted-foreground">
            Gérez vos réservations et bloquez des créneaux
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset(prev => prev - 1)}
          disabled={!canGoPreviousWeek}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Semaine précédente
        </Button>
        <span className="text-sm font-medium">
          {weekOffset === 0 ? 'Cette semaine' : weekOffset > 0 ? `+${weekOffset} semaine${weekOffset > 1 ? 's' : ''}` : `${weekOffset} semaine${weekOffset < -1 ? 's' : ''}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset(prev => prev + 1)}
          disabled={!canGoNextWeek}
        >
          Semaine suivante
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Reservations View */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Réservations de la Semaine</CardTitle>
            </div>
            <CardDescription>
              Voir toutes les réservations clients pour cette semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weekDays.map((day) => {
                const dayName = format(day, 'EEEE', { locale: fr });
                const dayDate = format(day, 'd MMM', { locale: fr });

                return (
                  <div key={day.toISOString()} className="space-y-3">
                    <h4 className="font-semibold text-sm capitalize">
                      {dayName} {dayDate}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                      {TIME_SLOTS.map((timeSlot) => {
                        const reservation = getReservationForSlot(day, timeSlot);
                        const endHour = parseInt(timeSlot.split(':')[0]) + 1;

                        return (
                          <div
                            key={timeSlot}
                            className={`
                              relative p-3 rounded-lg text-sm transition-all duration-200
                              ${
                                reservation
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : 'bg-muted text-muted-foreground'
                              }
                            `}
                          >
                            <div className="font-medium">
                              {timeSlot.slice(0, 5)} - {endHour}:00
                            </div>
                            {reservation && (
                              <div className="flex items-center gap-1 mt-1 text-xs">
                                <User className="w-3 h-3" />
                                <span className="truncate">
                                  {reservation.clientName}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dates Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>Dates Bloquées</CardTitle>
            </div>
            <CardDescription>
              Cliquez sur un créneau pour le bloquer/débloquer. Les créneaux bloqués ne seront pas disponibles pour les clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weekDays.map((day) => {
                const dayName = format(day, 'EEEE', { locale: fr });
                const dayDate = format(day, 'd MMM', { locale: fr });

                return (
                  <div key={day.toISOString()} className="space-y-3">
                    <h4 className="font-semibold text-sm capitalize">
                      {dayName} {dayDate}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                      {TIME_SLOTS.map((timeSlot) => {
                        const reservation = getReservationForSlot(day, timeSlot);
                        const isBlocked = isSlotBlocked(day, timeSlot);
                        const endHour = parseInt(timeSlot.split(':')[0]) + 1;

                        // Can't block if there's a reservation
                        const canToggle = !reservation;

                        return (
                          <button
                            key={timeSlot}
                            type="button"
                            onClick={() => canToggle && toggleBlockSlot(day, timeSlot)}
                            disabled={!canToggle}
                            className={`
                              p-3 rounded-lg text-sm font-medium transition-all duration-200
                              ${
                                reservation
                                  ? 'bg-blue-500 text-white cursor-not-allowed opacity-75'
                                  : isBlocked
                                    ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
                                    : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                              }
                            `}
                          >
                            {timeSlot.slice(0, 5)} - {endHour}:00
                            {reservation && (
                              <div className="text-xs mt-1 opacity-90">Réservé</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Légende</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span>Disponible (cliquez pour bloquer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span>Bloqué (cliquez pour débloquer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span>Réservé (non modifiable)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityManagement;
