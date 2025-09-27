import { useState } from 'react';
import Navigation from '@/components/Navigation';
import POSSystem from '@/components/POSSystem';
import Dashboard from '@/components/Dashboard';
import InventoryManager from '@/components/InventoryManager';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pos');

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POSSystem />;
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryManager />;
      default:
        return <POSSystem />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto px-6 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
