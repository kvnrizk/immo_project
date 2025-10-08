import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  reservationAPI,
  propertyAPI,
  ReservationType,
  ReservationStatus,
  type Reservation,
  type CreateReservationDto,
} from '@/services/api';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const reservationSchema = z.object({
  propertyId: z.number().min(1, 'Property is required'),
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  clientPhone: z.string().min(10, 'Valid phone number is required'),
  type: z.nativeEnum(ReservationType),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  notes: z.string().optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: Reservation | null;
  defaultPropertyId?: number;
}

export function ReservationForm({
  open,
  onOpenChange,
  reservation,
  defaultPropertyId,
}: ReservationFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Fetch properties for dropdown
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyAPI.getAll(),
  });

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      propertyId: defaultPropertyId || 0,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      type: ReservationType.VENTE,
      meetingDate: '',
      notes: '',
      status: ReservationStatus.EN_ATTENTE,
    },
  });

  const watchPropertyId = form.watch('propertyId');

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

  // Generate time slots matching backend (9:00 to 17:00, excluding 13:00 for lunch)
  const TIME_SLOTS = useMemo(() => {
    return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  }, []);

  // Fetch available slots when date or property changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (watchPropertyId && selectedDate) {
        setLoadingSlots(true);
        setSelectedTime(''); // Reset time when date changes
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const slots = await reservationAPI.getAvailableTimeSlots(watchPropertyId, dateStr);
          setAvailableSlots(slots);
        } catch (error) {
          toast.error('Erreur lors du chargement des créneaux disponibles');
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      }
    };
    fetchSlots();
  }, [watchPropertyId, selectedDate]);

  // Update form when reservation changes (for editing)
  useEffect(() => {
    if (reservation) {
      const meetingDateTime = new Date(reservation.meetingDate);
      setSelectedDate(meetingDateTime);
      setSelectedTime(format(meetingDateTime, 'HH:mm'));

      form.reset({
        propertyId: reservation.propertyId,
        clientName: reservation.clientName,
        clientEmail: reservation.clientEmail,
        clientPhone: reservation.clientPhone,
        type: reservation.type,
        meetingDate: format(meetingDateTime, "yyyy-MM-dd'T'HH:mm"),
        notes: reservation.notes || '',
        status: reservation.status,
      });
    } else if (defaultPropertyId) {
      form.reset({
        propertyId: defaultPropertyId,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        type: ReservationType.VENTE,
        meetingDate: '',
        notes: '',
        status: ReservationStatus.EN_ATTENTE,
      });
      setSelectedDate(null);
      setSelectedTime('');
    }
  }, [reservation, defaultPropertyId, form]);

  const createMutation = useMutation({
    mutationFn: (data: CreateReservationDto) => reservationAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservationStats'] });
      toast.success('Réservation créée avec succès');
      onOpenChange(false);
      form.reset();
      setSelectedDate(null);
      setSelectedTime('');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création de la réservation');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReservationDto> }) =>
      reservationAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservationStats'] });
      toast.success('Réservation mise à jour avec succès');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la réservation');
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      if (reservation) {
        await updateMutation.mutateAsync({ id: reservation.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
          </DialogTitle>
          <DialogDescription>
            {reservation
              ? 'Modifiez les détails de la réservation de visite'
              : 'Créez une nouvelle réservation pour une visite de propriété (vente ou location)'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propriété *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une propriété" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.title} - {property.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 6 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de transaction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ReservationType.VENTE}>Vente</SelectItem>
                        <SelectItem value={ReservationType.LOCATION}>Location</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(prev => prev - 1)}
                disabled={weekOffset <= 0}
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
                disabled={weekOffset >= 4}
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
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem>
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
                              onClick={() => {
                                if (isAvailable) {
                                  setSelectedTime(timeSlot);
                                  const dateStr = format(selectedDate, 'yyyy-MM-dd');
                                  field.onChange(`${dateStr}T${timeSlot}:00`);
                                }
                              }}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Status field for editing */}
            {reservation && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ReservationStatus.EN_ATTENTE}>En attente</SelectItem>
                        <SelectItem value={ReservationStatus.CONFIRMEE}>Confirmée</SelectItem>
                        <SelectItem value={ReservationStatus.ANNULEE}>Annulée</SelectItem>
                        <SelectItem value={ReservationStatus.EXPIREE}>Expirée</SelectItem>
                        <SelectItem value={ReservationStatus.TERMINEE}>Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations supplémentaires..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Enregistrement...'
                  : reservation
                    ? 'Mettre à jour'
                    : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
