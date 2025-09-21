
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarViewProps {
  selectedProperty: any;
}

const CalendarView = ({ selectedProperty }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock booking data
  const bookings = {
    '2024-07-15': { type: 'airbnb', guest: 'Marie D.' },
    '2024-07-16': { type: 'airbnb', guest: 'Marie D.' },
    '2024-07-17': { type: 'airbnb', guest: 'Marie D.' },
    '2024-07-20': { type: 'direct', guest: 'Pierre M.' },
    '2024-07-21': { type: 'direct', guest: 'Pierre M.' },
    '2024-07-25': { type: 'blocked', guest: 'Maintenance' },
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getBookingInfo = (day: number) => {
    if (!day) return null;
    return bookings[formatDateKey(day)];
  };

  const getBookingColor = (bookingType: string) => {
    switch (bookingType) {
      case 'airbnb':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'direct':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return '';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthYear = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* Property selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Calendrier des disponibilités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {selectedProperty 
              ? `Calendrier pour: ${selectedProperty.title}` 
              : 'Sélectionnez une propriété dans la vue d\'ensemble pour voir son calendrier'
            }
          </p>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold capitalize">{monthYear}</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2 h-16"></div>;
              }
              
              const booking = getBookingInfo(day);
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div
                  key={day}
                  className={`p-1 h-16 border border-border rounded-md cursor-pointer hover:bg-muted/50 ${
                    isToday ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {booking && (
                    <Badge 
                      className={`text-xs px-1 py-0 ${getBookingColor(booking.type)}`}
                      variant="outline"
                    >
                      {booking.guest}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
                Airbnb
              </Badge>
              <span className="text-sm text-muted-foreground">Réservation Airbnb</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                Direct
              </Badge>
              <span className="text-sm text-muted-foreground">Réservation directe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gray-100 text-gray-800 border-gray-200" variant="outline">
                Bloqué
              </Badge>
              <span className="text-sm text-muted-foreground">Indisponible/Maintenance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
