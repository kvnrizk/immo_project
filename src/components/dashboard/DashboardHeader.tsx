
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Home, BookOpen } from 'lucide-react';

interface DashboardHeaderProps {
  activeView: string;
}

const DashboardHeader = ({ activeView }: DashboardHeaderProps) => {
  const getTitle = () => {
    switch (activeView) {
      case 'overview':
        return 'Vue d\'ensemble des propriétés';
      case 'calendar':
        return 'Calendrier des disponibilités';
      case 'bookings':
        return 'Gestion des réservations';
      case 'add-property':
        return 'Ajouter une propriété';
      default:
        return 'Dashboard';
    }
  };

  const getIcon = () => {
    switch (activeView) {
      case 'overview':
        return <Home className="w-6 h-6" />;
      case 'calendar':
        return <Calendar className="w-6 h-6" />;
      case 'bookings':
        return <BookOpen className="w-6 h-6" />;
      case 'add-property':
        return <Plus className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {getIcon()}
        <h1 className="text-3xl font-bold text-foreground">{getTitle()}</h1>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline">
          Exporter les données
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle propriété
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
