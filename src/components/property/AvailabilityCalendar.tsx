
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface AvailabilityCalendarProps {
  unavailableDates: Date[];
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ unavailableDates }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const navigate = useNavigate();

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Check if the selected date is unavailable
    const isUnavailable = unavailableDates.some(unavailableDate =>
      isSameDay(unavailableDate, date)
    );

    if (isUnavailable) {
      // Redirect to contact page if date is unavailable
      navigate('/contact');
      return;
    }

    setSelectedDate(date);
  };

  const isDateDisabled = (date: Date) => {
    return unavailableDates.some(unavailableDate =>
      isSameDay(unavailableDate, date)
    );
  };

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 flex items-center">
        <CalendarIcon className="w-5 h-5 mr-2" />
        Disponibilités
      </h2>
      <Card>
        <CardContent className="p-4">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            numberOfMonths={2}
            className="rounded-md"
          />
          {selectedDate && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">
                Date sélectionnée: {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </p>
              <Button 
                onClick={handleContact}
                className="mt-2 w-full"
              >
                Réserver cette date
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            * Les dates barrées et floues sont déjà réservées. Cliquez dessus pour nous contacter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
