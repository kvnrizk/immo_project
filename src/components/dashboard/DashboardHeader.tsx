
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Home, BookOpen, Download } from 'lucide-react';

interface DashboardHeaderProps {
  activeView: string;
}

const DashboardHeader = ({ activeView }: DashboardHeaderProps) => {
  const getTitle = () => {
    switch (activeView) {
      case 'overview':
        return 'Vue d\'ensemble';
      case 'calendar':
        return 'Calendrier';
      case 'bookings':
        return 'Réservations';
      case 'add-property':
        return 'Ajouter';
      default:
        return 'Dashboard';
    }
  };

  const getIcon = () => {
    switch (activeView) {
      case 'overview':
        return <Home className="w-5 h-5 md:w-6 md:h-6" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 md:w-6 md:h-6" />;
      case 'bookings':
        return <BookOpen className="w-5 h-5 md:w-6 md:h-6" />;
      case 'add-property':
        return <Plus className="w-5 h-5 md:w-6 md:h-6" />;
      default:
        return <Home className="w-5 h-5 md:w-6 md:h-6" />;
    }
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-foreground">{getTitle()}</h1>
      </div>

      <div className="flex gap-2 md:gap-3">
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Exporter</span>
        </Button>
        <Button className="bg-primary hover:bg-primary/90 transition-all hover:scale-105" size="sm">
          <Plus className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Nouvelle propriété</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
