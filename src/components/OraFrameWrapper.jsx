import React, { useState, useRef } from 'react';
import { OraNavbar } from './OraNavbar';
import { OraHeroHeader } from './OraHeroHeader';
import { OraTopBar } from './OraTopBar';
import { OraFeaturedModules } from './OraFeaturedModules';
import { OraTechnicalSpecs } from './OraTechnicalSpecs';
import { OraFooter } from './OraFooter';
import { useSystem } from '../context/SystemContext';
import { ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

export const OraFrameWrapper = ({ 
  children, 
  currentTab, 
  setCurrentTab, 
  onOpenResetModal,
  onToggleSidebar 
}) => {
  const [isFullWidth, setIsFullWidth] = useState(false);
  const viewportRef = useRef(null);
  const { vehicleStatus, alcoholStatus, triggerAlcoholDetection, location } = useSystem();

  const scrollToViewport = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans selection:bg-sky-500/25 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Glow & Grain */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] tide-glow opacity-80 blur-3xl"></div>
        <div className="absolute top-[800px] left-1/3 w-[800px] h-[500px] bg-indigo-950/20 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 grain opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Top Announcement Bar (Scrolltide Style) */}
        <div className="relative z-50 w-full bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 text-[#04121f] text-xs font-medium py-2 px-4 select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-center">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#04121f] animate-pulse"></span>
            <span className="font-mono uppercase tracking-wider font-bold">SMART VEHICLE SAFETY AI</span>
            <span className="opacity-70 hidden sm:inline">•</span>
            <span className="hidden sm:inline">ESP32 + MQ-3 + NEO-6M + SIM800L INTERFACED</span>
            <span className="opacity-70">•</span>
            <span className="font-semibold">Live Prototype Active</span>
            <button
              onClick={() => triggerAlcoholDetection(480, location.latitude, location.longitude, "Top Bar Demo Interlock")}
              className="ml-1 rounded-full bg-[#04121f] px-3 py-0.5 text-[11px] font-semibold text-white hover:bg-black transition-colors cursor-pointer"
            >
              Test Interlock →
            </button>
          </div>
        </div>

        {/* Scrolltide Ora Navbar */}
        <OraNavbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          isFullWidth={isFullWidth}
          setIsFullWidth={setIsFullWidth}
          onOpenResetModal={onOpenResetModal}
        />

        {/* Main Presentation Body */}
        <main className="flex-1 pb-16">
          
          {/* Scrolltide Ora Hero Section */}
          <OraHeroHeader onScrollToViewport={scrollToViewport} />

          {/* ========================================================
              THE ORA ROUNDED VIEWPORT MOCKUP WINDOW (THE MAIN FRAME)
              ======================================================== */}
          <div 
            ref={viewportRef}
            className={`transition-all duration-500 ease-out scroll-mt-20 ${
              isFullWidth 
                ? 'w-full px-2 sm:px-4' 
                : 'max-w-7xl mx-auto px-3 sm:px-6'
            }`}
          >
            {/* The Outer Viewport Bezel */}
            <div className="ora-viewport-frame overflow-hidden relative">
              
              {/* Top Ora Bezel Bar */}
              <OraTopBar 
                isFullWidth={isFullWidth} 
                setIsFullWidth={setIsFullWidth}
                onToggleSidebar={onToggleSidebar}
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
              />

              {/* The 4 Featured Telemetry Modules (Ora Timepieces Grid) */}
              <OraFeaturedModules setCurrentTab={setCurrentTab} />

              {/* Viewport Interior Application Window */}
              <div className="w-full bg-[#07090e] min-h-[680px] flex flex-col relative">
                {children}
              </div>

            </div>
          </div>

          {/* Technical Specs & Architecture Breakdown below Viewport */}
          <OraTechnicalSpecs setCurrentTab={setCurrentTab} />

        </main>

        {/* Scrolltide Cinematic Footer */}
        <OraFooter setCurrentTab={setCurrentTab} />

      </div>

    </div>
  );
};
