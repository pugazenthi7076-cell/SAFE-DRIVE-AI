import React, { useState } from 'react';
import { SystemProvider } from './context/SystemContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SimulationBar } from './components/SimulationBar';
import { DemoFlowBar } from './components/DemoFlowBar';
import { EmergencyWarningBanner } from './components/EmergencyWarningBanner';
import { SmsModal } from './components/SmsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

import { DashboardView } from './views/DashboardView';
import { LiveMonitoringView } from './views/LiveMonitoringView';
import { IncidentHistoryView } from './views/IncidentHistoryView';
import { GpsLocationView } from './views/GpsLocationView';
import { EmergencyContactView } from './views/EmergencyContactView';
import { HardwareStatusView } from './views/HardwareStatusView';
import { SystemControlsView } from './views/SystemControlsView';
import { SettingsView } from './views/SettingsView';
import { HardwareApiGuideView } from './views/HardwareApiGuideView';
import { VehicleStopView } from './views/VehicleStopView';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onOpenResetModal={() => setIsResetModalOpen(true)} setCurrentTab={setCurrentTab} />;
      case 'live-monitoring':
        return <LiveMonitoringView />;
      case 'incidents':
        return <IncidentHistoryView />;
      case 'gps-location':
        return <GpsLocationView />;
      case 'emergency-contact':
        return <EmergencyContactView />;
      case 'hardware-status':
        return <HardwareStatusView />;
      case 'system-controls':
        return <SystemControlsView onOpenResetModal={() => setIsResetModalOpen(true)} />;
      case 'settings':
        return <SettingsView />;
      case 'hardware-api':
        return <HardwareApiGuideView />;
      case 'vehicle-stop':
        return <VehicleStopView onOpenResetModal={() => setIsResetModalOpen(true)} />;

      default:
        return <DashboardView onOpenResetModal={() => setIsResetModalOpen(true)} setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* Top Header */}
      <Header onOpenResetModal={() => setIsResetModalOpen(true)} />

      {/* Floating Simulation Dock */}
      <SimulationBar />

      {/* SIH Step-by-Step Live Demo Tracker */}
      <DemoFlowBar />

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-12">
          {/* Prominent Emergency Warning Banner when Stopped */}
          <EmergencyWarningBanner onOpenResetModal={() => setIsResetModalOpen(true)} />

          {/* Active View Content */}
          {renderCurrentView()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 text-center text-xs text-slate-500">
        Smart Vehicle Safety & Alcohol Alert System • IoT Vehicle Safety Platform • Powered by ESP32, MQ-3, NEO-6M GPS & SIM800L GSM
      </footer>

      {/* Modals */}
      <SmsModal />
      <ResetConfirmModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
