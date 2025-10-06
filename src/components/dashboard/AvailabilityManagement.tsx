import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Clock, Calendar, Trash2, X } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { availabilityAPI, DayOfWeek } from '@/services/api';
import { format } from 'date-fns';

const AvailabilityManagement = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBlockDateDialogOpen, setIsBlockDateDialogOpen] = useState(false);

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
      toast({ title: 'Disponibilité ajoutée', description: 'Votre créneau a été ajouté avec succès.' });
      setIsAddDialogOpen(false);
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
      toast({ title: 'Supprimé', description: 'Créneau supprimé avec succès.' });
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

  const handleAddAvailability = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createAvailabilityMutation.mutate({
      dayOfWeek: formData.get('dayOfWeek') as DayOfWeek,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      isActive: true,
    });
  };

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

  // Group availability by day
  const availabilityByDay = availability.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<DayOfWeek, typeof availability>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Disponibilités</h2>
          <p className="text-muted-foreground">
            Définissez vos horaires de disponibilité et bloquez des dates spécifiques
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Availability */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <CardTitle>Disponibilités Hebdomadaires</CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un Créneau</DialogTitle>
                    <DialogDescription>
                      Définissez vos heures de disponibilité pour un jour de la semaine
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddAvailability} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dayOfWeek">Jour</Label>
                      <Select name="dayOfWeek" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(dayLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Heure de début</Label>
                        <Input
                          id="startTime"
                          name="startTime"
                          type="time"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">Heure de fin</Label>
                        <Input
                          id="endTime"
                          name="endTime"
                          type="time"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Ajouter le créneau
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              Vos heures de disponibilité par défaut chaque semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dayLabels).map(([day, label]) => (
                <div key={day} className="space-y-2">
                  <h4 className="font-semibold text-sm">{label}</h4>
                  <div className="space-y-2">
                    {availabilityByDay[day as DayOfWeek]?.length > 0 ? (
                      availabilityByDay[day as DayOfWeek].map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <span className="text-sm">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAvailabilityMutation.mutate(slot.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun créneau</p>
                    )}
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
                <CardTitle>Dates Indisponibles</CardTitle>
              </div>
              <Dialog open={isBlockDateDialogOpen} onOpenChange={setIsBlockDateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Bloquer une date
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bloquer une Date</DialogTitle>
                    <DialogDescription>
                      Marquez une date comme indisponible pour les réservations
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
              Dates spécifiques où vous n'êtes pas disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unavailableDates.length > 0 ? (
                unavailableDates.map((blockedDate) => (
                  <div
                    key={blockedDate.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(blockedDate.date), 'dd/MM/yyyy')}
                      </p>
                      {blockedDate.reason && (
                        <p className="text-sm text-muted-foreground">{blockedDate.reason}</p>
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
