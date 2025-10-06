
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, BookOpen, Plus, BarChart3, Settings, Mail, X, Clock } from 'lucide-react';

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ activeView, onViewChange, isOpen, onClose }: DashboardSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'bookings', label: 'Réservations', icon: BookOpen },
    { id: 'availability', label: 'Disponibilités', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'add-property', label: 'Ajouter bien', icon: Plus },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handleViewChange = (view: string) => {
    onViewChange(view);
    // Close sidebar on mobile after selecting a view
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile - blocks interaction with page */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 z-50
        w-64 bg-background border-r border-border p-4 h-screen shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Dashboard Admin</h2>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "hover:bg-muted hover:scale-102"
                }`}
                onClick={() => handleViewChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="font-medium text-foreground mb-2">Aide rapide</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos propriétés, calendriers et réservations depuis ce tableau de bord.
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
