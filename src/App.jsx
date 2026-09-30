import React, { useState } from 'react';
import { SystemProvider } from './context/SystemContext';
import { OraFrameWrapper } from './components/OraFrameWrapper';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <OraFrameWrapper
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onOpenResetModal={() => setIsResetModalOpen(true)}
      onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
    >
      {/* Viewport Internal Header */}
      <Header onOpenResetModal={() => setIsResetModalOpen(true)} />

      {/* SIH Step-by-Step Live Demo Tracker */}
      <DemoFlowBar />

      {/* Main Layout Body inside the Ora Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#07090e]">
        
        {/* Left Sidebar (collapsible via OraTopBar menu button) */}
        {isSidebarOpen && (
          <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-12 bg-[#07090e]">
          {/* Prominent Emergency Warning Banner when Stopped */}
          <EmergencyWarningBanner onOpenResetModal={() => setIsResetModalOpen(true)} />

          {/* Active View Content */}
          <div className="p-1 sm:p-2">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Floating Simulation Dock */}
      <SimulationBar />

      {/* Modals */}
      <SmsModal />
      <ResetConfirmModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} />
    </OraFrameWrapper>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
