import { useState, useEffect } from 'react';
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
import { format } from 'date-fns';

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

  // Update form when reservation changes (for editing)
  useEffect(() => {
    if (reservation) {
      form.reset({
        propertyId: reservation.propertyId,
        clientName: reservation.clientName,
        clientEmail: reservation.clientEmail,
        clientPhone: reservation.clientPhone,
        type: reservation.type,
        meetingDate: format(new Date(reservation.meetingDate), "yyyy-MM-dd'T'HH:mm"),
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
    }
  }, [reservation, defaultPropertyId, form]);

  const createMutation = useMutation({
    mutationFn: (data: CreateReservationDto) => reservationAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Réservation créée avec succès');
      onOpenChange(false);
      form.reset();
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date et heure du rendez-vous *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

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
