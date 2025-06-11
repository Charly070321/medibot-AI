import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'records':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Patient Records</h1>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Patient records management coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Analysis History</h1>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Analysis history will be displayed here...</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return <Settings />;
      case 'analysis':
      default:
        return <Dashboard />;
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;