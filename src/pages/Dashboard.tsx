
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PropertiesOverview from '@/components/dashboard/PropertiesOverview';
import CalendarView from '@/components/dashboard/CalendarView';
import BookingsManagement from '@/components/dashboard/BookingsManagement';
import PropertyForm from '@/components/dashboard/PropertyForm';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <PropertiesOverview onSelectProperty={setSelectedProperty} onEditProperty={() => setActiveView('add-property')} />;
      case 'calendar':
        return <CalendarView selectedProperty={selectedProperty} />;
      case 'bookings':
        return <BookingsManagement />;
      case 'add-property':
        return <PropertyForm onSave={() => setActiveView('overview')} onCancel={() => setActiveView('overview')} />;
      default:
        return <PropertiesOverview onSelectProperty={setSelectedProperty} onEditProperty={() => setActiveView('add-property')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 flex">
        <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 p-6">
          <DashboardHeader activeView={activeView} />
          <div className="mt-6">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
