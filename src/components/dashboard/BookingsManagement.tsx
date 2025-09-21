
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Calendar, User, MapPin, Euro } from 'lucide-react';

interface Booking {
  id: number;
  propertyTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  source: 'airbnb' | 'direct' | 'booking.com';
  phone: string;
  email: string;
}

const BookingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: 1,
      propertyTitle: "Appartement Marais",
      guestName: "Marie Dubois",
      checkIn: "2024-07-15",
      checkOut: "2024-07-18",
      nights: 3,
      totalPrice: 360,
      status: 'confirmed',
      source: 'airbnb',
      phone: "+33 6 12 34 56 78",
      email: "marie.dubois@email.com"
    },
    {
      id: 2,
      propertyTitle: "Studio Montmartre",
      guestName: "Pierre Martin",
      checkIn: "2024-07-20",
      checkOut: "2024-07-22",
      nights: 2,
      totalPrice: 170,
      status: 'confirmed',
      source: 'direct',
      phone: "+33 6 87 65 43 21",
      email: "pierre.martin@email.com"
    },
    {
      id: 3,
      propertyTitle: "Loft Saint-Germain",
      guestName: "Sophie Wilson",
      checkIn: "2024-07-25",
      checkOut: "2024-07-30",
      nights: 5,
      totalPrice: 900,
      status: 'pending',
      source: 'booking.com',
      phone: "+44 20 1234 5678",
      email: "sophie.wilson@email.com"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'airbnb':
        return 'bg-red-100 text-red-800';
      case 'direct':
        return 'bg-blue-100 text-blue-800';
      case 'booking.com':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Réservations totales</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmées</p>
                <p className="text-2xl font-bold text-green-600">{confirmedBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold text-primary">{totalRevenue}€</p>
              </div>
              <Euro className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Rechercher par nom ou propriété..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                Toutes
              </Button>
              <Button
                variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('confirmed')}
              >
                Confirmées
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
              >
                En attente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status === 'confirmed' ? 'Confirmée' : 
                       booking.status === 'pending' ? 'En attente' : 'Annulée'}
                    </Badge>
                    <Badge className={getSourceColor(booking.source)} variant="outline">
                      {booking.source}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.propertyTitle}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {booking.checkIn} - {booking.checkOut} ({booking.nights} nuits)
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {booking.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{booking.totalPrice}€</p>
                    <p className="text-sm text-muted-foreground">{booking.phone}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                    <Button size="sm">
                      Contacter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune réservation ne correspond à vos critères.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingsManagement;
