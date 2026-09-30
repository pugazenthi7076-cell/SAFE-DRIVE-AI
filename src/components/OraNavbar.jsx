import React from 'react';
import { useSystem } from '../context/SystemContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Radio, 
  Cpu, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Play, 
  RefreshCw,
  Power
} from 'lucide-react';

export const OraNavbar = ({ 
  currentTab, 
  setCurrentTab, 
  isFullWidth, 
  setIsFullWidth,
  onOpenResetModal 
}) => {
  const { 
    vehicleStatus, 
    alcoholStatus, 
    isBuzzerActive, 
    isSoundMuted, 
    setIsSoundMuted, 
    vehicleId,
    triggerAlcoholDetection,
    resetSafetySystem,
    location,
    hardware
  } = useSystem();

  const isEmergency = vehicleStatus === 'STOPPED' || alcoholStatus === 'ALCOHOL DETECTED';

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'live-monitoring', label: 'Telemetry' },
    { id: 'gps-location', label: 'GPS Radar' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'hardware-status', label: 'Hardware' },
    { id: 'hardware-api', label: 'API Specs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-300 border-b border-white/[0.08] bg-[#05070a]/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-black ring-1 ring-white/20 group-hover:ring-sky-400/50 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <span className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent"></span>
              <Activity className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-bold tracking-tight text-white font-display">
                scroll<span className="text-slate-400">tide</span>
                <span className="mx-1.5 text-xs text-sky-400 font-mono">/</span>
                <span className="text-sky-400">safedrive</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
                ORA SWISS FRAME • {vehicleId}
              </span>
            </div>
          </button>
        </div>

        {/* Center Pill Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full p-1 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Hardware & Live Status Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-[#0c1017]/80 text-xs font-mono text-slate-300">
            <span className={`h-2 w-2 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`}></span>
            <span>{isEmergency ? 'INTERLOCK LOCKED' : 'ESP32 ARMED'}</span>
          </div>

          {/* Buzzer Sound Toggle */}
          {isBuzzerActive && (
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isSoundMuted
                  ? 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  : 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
              }`}
              title={isSoundMuted ? 'Unmute Alarm' : 'Mute Alarm'}
            >
              {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isSoundMuted ? 'Muted' : 'Alarm'}</span>
            </button>
          )}

          {/* Quick Emergency / Reset Action */}
          {vehicleStatus === 'STOPPED' ? (
            <button
              onClick={onOpenResetModal}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Safety</span>
            </button>
          ) : (
            <button
              onClick={() => triggerAlcoholDetection(520, location.latitude, location.longitude, "Manual Safety Interlock Test")}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 text-xs font-semibold transition-all"
              title="Trigger simulated alcohol interlock"
            >
              <Power className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Emergency Cutoff</span>
            </button>
          )}

          {/* Viewport Width Toggle (Mockup Container vs Full Cockpit) */}
          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-white/25 transition-all"
            title={isFullWidth ? "Switch to Scrolltide Mockup View" : "Expand to Full-Width Cockpit"}
          >
            {isFullWidth ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Mockup Frame</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Full Cockpit</span>
              </>
            )}
          </button>
        </div>

      </nav>
    </header>
  );
};
