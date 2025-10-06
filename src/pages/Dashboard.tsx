
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PropertiesOverview from '@/components/dashboard/PropertiesOverview';
import CalendarManagement from '@/components/dashboard/CalendarManagement';
import BookingsManagement from '@/components/dashboard/BookingsManagement';
import ContactsManagement from '@/components/dashboard/ContactsManagement';
import PropertyForm from '@/components/dashboard/PropertyForm';
import Settings from '@/components/dashboard/Settings';
import Statistics from '@/components/dashboard/Statistics';
import { Menu } from 'lucide-react';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setActiveView('add-property');
  };

  const handleSaveProperty = () => {
    setEditingProperty(null);
    setActiveView('overview');
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setActiveView('overview');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <PropertiesOverview onSelectProperty={setSelectedProperty} onEditProperty={handleEditProperty} />;
      case 'calendar':
        return <CalendarManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'contacts':
        return <ContactsManagement />;
      case 'add-property':
        return <PropertyForm property={editingProperty} onSave={handleSaveProperty} onCancel={handleCancelEdit} />;
      case 'analytics':
        return <Statistics />;
      case 'settings':
        return <Settings />;
      default:
        return <PropertiesOverview onSelectProperty={setSelectedProperty} onEditProperty={handleEditProperty} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex relative">
        <DashboardSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 z-30 p-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
            {activeView === 'overview' && <DashboardHeader activeView={activeView} />}
            <div className={activeView === 'overview' ? 'mt-6' : ''}>
              {renderActiveView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
