
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

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);

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
      case 'settings':
        return <Settings />;
      default:
        return <PropertiesOverview onSelectProperty={setSelectedProperty} onEditProperty={handleEditProperty} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 p-6">
          {activeView === 'overview' && <DashboardHeader activeView={activeView} />}
          <div className={activeView === 'overview' ? 'mt-6' : ''}>
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
