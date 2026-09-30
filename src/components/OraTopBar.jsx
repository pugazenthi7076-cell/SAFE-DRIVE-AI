import React from 'react';
import { useSystem } from '../context/SystemContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  ShieldAlert,
  Sliders,
  Car
} from 'lucide-react';

export const OraTopBar = ({ 
  isFullWidth, 
  setIsFullWidth, 
  onToggleSidebar, 
  setCurrentTab,
  currentTab
}) => {
  const { vehicleStatus, alcoholStatus, incidents, vehicleId } = useSystem();
  const isEmergency = vehicleStatus === 'STOPPED' || alcoholStatus === 'ALCOHOL DETECTED';

  return (
    <div className="w-full bg-[#080b12] border-b border-white/[0.08] px-4 py-3 flex items-center justify-between select-none">
      
      {/* Left: Minimal Menu & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20 transition-all"
          title="Toggle Navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`}></span>
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-300 hidden sm:inline">
            {isEmergency ? 'SAFETY INTERLOCK TRIGGERED' : 'CHASSIS SECURED'}
          </span>
        </div>
      </div>

      {/* Center: Luxury Swiss Ora Telemetry Brand */}
      <div className="flex flex-col items-center text-center">
        <span className="font-ora-serif text-[12px] sm:text-[14px] font-bold tracking-[0.24em] text-white uppercase flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-sky-400 hidden xs:inline-block"></span>
          ORA SWISS <span className="text-slate-500 font-light">•</span> SAFETY ENGINE
          <span className="h-1 w-1 rounded-full bg-sky-400 hidden xs:inline-block"></span>
        </span>
        <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase hidden md:inline">
          GENEVA MK-IV TELEMETRIC ARCHITECTURE • {vehicleId}
        </span>
      </div>

      {/* Right: Quick Tools & Viewport Toggle */}
      <div className="flex items-center gap-2">
        {/* Incident Alerts Pill */}
        <button
          onClick={() => setCurrentTab('incidents')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono transition-all ${
            incidents.length > 0 && isEmergency
              ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse'
              : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-white'
          }`}
          title="View Incidents"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">{incidents.length}</span>
        </button>

        {/* Viewport Scale Mode */}
        <button
          onClick={() => setIsFullWidth(!isFullWidth)}
          className="hidden sm:grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20 transition-all"
          title={isFullWidth ? "Collapse Viewport Frame" : "Expand Viewport Frame"}
        >
          {isFullWidth ? <Minimize2 className="h-3.5 w-3.5 text-sky-400" /> : <Maximize2 className="h-3.5 w-3.5 text-sky-400" />}
        </button>
      </div>

    </div>
  );
};
