
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, BookOpen, Plus, BarChart3, Settings, Mail } from 'lucide-react';

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const DashboardSidebar = ({ activeView, onViewChange }: DashboardSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'bookings', label: 'Réservations', icon: BookOpen },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'add-property', label: 'Ajouter bien', icon: Plus },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="w-64 bg-muted/30 border-r border-border p-4 h-screen">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground mb-4">Dashboard Admin</h2>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeView === item.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-lg">
        <h3 className="font-medium text-foreground mb-2">Aide rapide</h3>
        <p className="text-sm text-muted-foreground">
          Gérez vos propriétés, calendriers et réservations depuis ce tableau de bord.
        </p>
      </div>
    </div>
  );
};

export default DashboardSidebar;
