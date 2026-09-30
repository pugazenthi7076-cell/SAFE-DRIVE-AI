import React from 'react';
import { useSystem } from '../context/SystemContext';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  Cpu, 
  Sliders, 
  Settings, 
  Code,
  ShieldCheck,
  ShieldAlert,
  Car,
  Power
} from 'lucide-react';


export const Sidebar = ({ currentTab, setCurrentTab }) => {
  const { incidents, vehicleStatus, alcoholStatus } = useSystem();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'incidents', label: 'Incident History', icon: AlertTriangle, badge: incidents.length },
    { id: 'gps-location', label: 'GPS Location', icon: MapPin },
    { id: 'emergency-contact', label: 'Emergency Contact', icon: PhoneCall },
    { id: 'hardware-status', label: 'Hardware Status', icon: Cpu },
    { id: 'vehicle-stop', label: 'Vehicle Stop Info', icon: Power, danger: vehicleStatus === 'STOPPED' },
    { id: 'system-controls', label: 'System Controls', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'hardware-api', label: 'ESP32 API / Code', icon: Code },
  ];


  return (
    <aside className="w-full md:w-64 bg-[#07090f]/95 border-r border-white/[0.08] flex flex-col justify-between shrink-0">
      <div className="p-3 lg:p-4">
        {/* Navigation Section Title */}
        <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
          SYSTEM NAVIGATION
        </div>

        {/* Links */}
        <nav className="mt-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                    : item.danger
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-sky-400' : item.danger ? 'text-red-400 animate-pulse' : 'text-slate-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    alcoholStatus === 'ALCOHOL DETECTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.danger && !item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                    STOP
                  </span>
                )}
              </button>

            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Card */}
      <div className="p-3 lg:p-4 border-t border-slate-800">
        <div className={`p-3 rounded-xl border text-xs ${
          vehicleStatus === 'STOPPED' 
            ? 'bg-red-500/10 border-red-500/30 text-red-300' 
            : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
        }`}>
          <div className="flex items-center gap-2 font-semibold text-white mb-1">
            <Car className="w-4 h-4 text-blue-400" />
            <span>Vehicle State</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-slate-400">Ignition Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              vehicleStatus === 'RUNNING' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {vehicleStatus}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-slate-400">Sensor Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              alcoholStatus === 'SAFE' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400 animate-pulse'
            }`}>
              {alcoholStatus}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
