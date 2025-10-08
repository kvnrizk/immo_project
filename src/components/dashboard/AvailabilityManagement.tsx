import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Calendar, ChevronLeft, ChevronRight, User, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { availabilityAPI, reservationAPI } from '@/services/api';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AvailabilityManagement = () => {
  const queryClient = useQueryClient();
  const [weekOffset, setWeekOffset] = useState(0);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);

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

  // Generate time slots matching backend (9:00 to 17:00, excluding 13:00 for lunch)
  const TIME_SLOTS = useMemo(() => {
    return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  }, []);

  // Fetch reservations
  const { data: reservations = [], isLoading: loadingReservations, error: reservationsError } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationAPI.getAll(),
  });

  // Fetch unavailable dates
  const { data: unavailableDates = [], isLoading: loadingUnavailable, error: unavailableError } = useQuery({
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

  // Cancel reservation mutation
  const cancelReservationMutation = useMutation({
    mutationFn: (id: string) => reservationAPI.update(id, { status: 'annulée' as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({ title: 'Réservation annulée', description: 'La réservation a été annulée avec succès.' });
      setReservationToCancel(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  // Delete reservation mutation
  const deleteReservationMutation = useMutation({
    mutationFn: reservationAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({ title: 'Réservation supprimée', description: 'La réservation a été supprimée avec succès.' });
      setReservationToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

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

  // Show loading state
  if (loadingReservations || loadingUnavailable) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium">Chargement...</div>
          <div className="text-sm text-muted-foreground mt-2">Chargement des disponibilités</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (reservationsError || unavailableError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium text-destructive">Erreur</div>
          <div className="text-sm text-muted-foreground mt-2">
            {reservationsError?.message || unavailableError?.message || 'Impossible de charger les données'}
          </div>
        </div>
      </div>
    );
  }

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
        {/* Reservations List View */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Réservations des Clients</CardTitle>
            </div>
            <CardDescription>
              Liste de toutes les visites réservées par les clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune réservation pour le moment
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((reservation) => {
                  const meetingDate = new Date(reservation.meetingDate);
                  const dayName = format(meetingDate, 'EEEE d MMMM yyyy', { locale: fr });
                  const timeSlot = format(meetingDate, 'HH:mm');
                  const endHour = meetingDate.getHours() + 1;

                  return (
                    <div
                      key={reservation.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Date & Time */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 min-w-[200px]">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm capitalize">{dayName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{timeSlot} - {endHour.toString().padStart(2, '0')}:00</span>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{reservation.clientName}</span>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reservation.status === 'en_attente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : reservation.status === 'confirmée'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'annulée'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {reservation.status}
                          </span>

                          {/* Property Type Badge */}
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {reservation.type}
                          </span>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-auto">
                            {reservation.status !== 'annulée' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReservationToCancel(reservation.id)}
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Annuler
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReservationToDelete(reservation.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Property Info */}
                      {reservation.property && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Bien: {reservation.property.title}
                        </div>
                      )}

                      {/* Contact Info & Notes (collapsible details) */}
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          Voir les détails du contact
                        </summary>
                        <div className="mt-2 p-3 bg-muted/50 rounded text-sm space-y-1">
                          <p>Email: {reservation.clientEmail}</p>
                          <p>Téléphone: {reservation.clientPhone}</p>
                          {reservation.notes && (
                            <p className="mt-2">
                              <span className="font-medium">Notes:</span> {reservation.notes}
                            </p>
                          )}
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
            )}
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

      {/* Cancel Reservation Dialog */}
      <AlertDialog open={!!reservationToCancel} onOpenChange={() => setReservationToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Le client sera informé de l'annulation.
              Le créneau redeviendra disponible pour d'autres réservations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reservationToCancel && cancelReservationMutation.mutate(reservationToCancel)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Annuler la réservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Reservation Dialog */}
      <AlertDialog open={!!reservationToDelete} onOpenChange={() => setReservationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?
              Cette action est irréversible et toutes les données seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reservationToDelete && deleteReservationMutation.mutate(reservationToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvailabilityManagement;
