import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ReservationForm } from './ReservationForm';
import { toast } from 'sonner';
import {
  reservationAPI,
  ReservationType,
  ReservationStatus,
  type Reservation,
  type FilterReservationDto,
} from '@/services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarIcon,
  Clock,
  MapPin,
  MoreVertical,
  Phone,
  Mail,
  Plus,
  X,
} from 'lucide-react';

const statusColors: Record<ReservationStatus, string> = {
  [ReservationStatus.EN_ATTENTE]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [ReservationStatus.CONFIRMEE]: 'bg-green-100 text-green-800 border-green-300',
  [ReservationStatus.ANNULEE]: 'bg-red-100 text-red-800 border-red-300',
  [ReservationStatus.EXPIREE]: 'bg-gray-100 text-gray-800 border-gray-300',
  [ReservationStatus.TERMINEE]: 'bg-blue-100 text-blue-800 border-blue-300',
};

const statusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.EN_ATTENTE]: 'En attente',
  [ReservationStatus.CONFIRMEE]: 'Confirmée',
  [ReservationStatus.ANNULEE]: 'Annulée',
  [ReservationStatus.EXPIREE]: 'Expirée',
  [ReservationStatus.TERMINEE]: 'Terminée',
};

const typeLabels: Record<ReservationType, string> = {
  [ReservationType.VENTE]: 'Vente',
  [ReservationType.LOCATION]: 'Location',
};

const BookingsManagement = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterReservationDto>({});
  const [formOpen, setFormOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

  // Fetch reservations with filters
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => reservationAPI.getAll(filters),
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['reservationStats'],
    queryFn: () => reservationAPI.getStatistics(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reservationAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservationStats'] });
      toast.success('Réservation supprimée avec succès');
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression de la réservation');
    },
  });

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setReservationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reservationToDelete) {
      deleteMutation.mutate(reservationToDelete);
    }
  };

  const handleNewReservation = () => {
    setSelectedReservation(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedReservation(null);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Mobile Optimized */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Total</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground hidden md:block" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">En attente</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-yellow-600">{stats.byStatus?.en_attente || 0}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Confirmées</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-green-600">{stats.byStatus?.confirmée || 0}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Vente</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.byType?.vente || 0}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-purple-600">{stats.byType?.location || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Réservations de visites</CardTitle>
              <CardDescription className="text-sm">Gérez les rendez-vous de visite pour vos biens (vente & location)</CardDescription>
            </div>
            <Button onClick={handleNewReservation} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle réservation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters - Mobile Optimized */}
          <div className="mb-6 flex flex-col md:flex-row flex-wrap gap-3">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === 'all' ? undefined : (value as ReservationStatus),
                }))
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={ReservationStatus.EN_ATTENTE}>En attente</SelectItem>
                <SelectItem value={ReservationStatus.CONFIRMEE}>Confirmée</SelectItem>
                <SelectItem value={ReservationStatus.ANNULEE}>Annulée</SelectItem>
                <SelectItem value={ReservationStatus.EXPIREE}>Expirée</SelectItem>
                <SelectItem value={ReservationStatus.TERMINEE}>Terminée</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  type: value === 'all' ? undefined : (value as ReservationType),
                }))
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value={ReservationType.VENTE}>Vente</SelectItem>
                <SelectItem value={ReservationType.LOCATION}>Location</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full md:w-auto">
                <X className="mr-2 h-4 w-4" />
                Effacer les filtres
              </Button>
            )}
          </div>

          {/* Reservations Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Aucune réservation</p>
              <p className="text-sm text-muted-foreground">
                Commencez par créer une nouvelle réservation de visite
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Propriété</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de visite</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{reservation.clientName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{reservation.clientEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{reservation.clientPhone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{reservation.property?.title}</p>
                            {reservation.property?.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{reservation.property.location}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{typeLabels[reservation.type]}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(reservation.meetingDate), 'PPp', { locale: fr })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[reservation.status]} variant="outline">
                            {statusLabels[reservation.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(reservation.id)}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={statusColors[reservation.status]} variant="outline">
                              {statusLabels[reservation.status]}
                            </Badge>
                            <Badge variant="outline">{typeLabels[reservation.type]}</Badge>
                          </div>
                          <p className="font-semibold text-base">{reservation.clientName}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(reservation.id)}
                              className="text-red-600"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{reservation.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{reservation.clientPhone}</span>
                        </div>

                        <div className="pt-2 border-t mt-3">
                          <p className="font-medium text-sm mb-1">{reservation.property?.title}</p>
                          {reservation.property?.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{reservation.property.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground pt-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">
                            {format(new Date(reservation.meetingDate), 'PPp', { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ReservationForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        reservation={selectedReservation}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La réservation sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsManagement;
