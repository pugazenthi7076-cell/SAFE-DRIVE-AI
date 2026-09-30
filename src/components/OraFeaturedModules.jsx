import React from 'react';
import { useSystem } from '../context/SystemContext';
import { 
  Power, 
  Activity, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpRight,
  Gauge,
  Wifi,
  Navigation
} from 'lucide-react';

export const OraFeaturedModules = ({ setCurrentTab }) => {
  const { 
    vehicleStatus, 
    alcoholStatus, 
    alcoholLevel, 
    threshold, 
    location, 
    hardware, 
    lastSms,
    triggerAlcoholDetection,
    resetSafetySystem
  } = useSystem();

  const isEmergency = vehicleStatus === 'STOPPED' || alcoholStatus === 'ALCOHOL DETECTED';
  const bacPercent = (alcoholLevel * 0.0002).toFixed(3);

  const modules = [
    {
      num: '01',
      title: 'Engine Ignition Interlock',
      subtitle: 'Songle 10A Optocoupled Relay',
      metric: vehicleStatus,
      metricLabel: 'Relay Circuit State',
      status: vehicleStatus === 'RUNNING' ? 'ACTIVE • NOMINAL' : 'CUTOFF • LOCKED',
      isDanger: vehicleStatus === 'STOPPED',
      viewTab: 'vehicle-stop',
      icon: Power,
      accent: 'sky',
      details: vehicleStatus === 'RUNNING' ? '12V DC Ignition Circuit Closed' : 'Power Rail Cut by MCU Relay'
    },
    {
      num: '02',
      title: 'MQ-3 Alcohol Sensor Matrix',
      subtitle: 'Semiconductor SnO2 Gas Core',
      metric: `${alcoholLevel} PPM`,
      metricLabel: `BAC: ${bacPercent}% (Max: ${(threshold * 0.0002).toFixed(3)}%)`,
      status: alcoholStatus === 'SAFE' ? 'NORMAL • AIR CLEAR' : 'ALERT • EXCEEDED',
      isDanger: alcoholStatus === 'ALCOHOL DETECTED',
      viewTab: 'live-monitoring',
      icon: Activity,
      accent: 'amber',
      details: `Threshold set at ${threshold} PPM • 240Hz Polling`
    },
    {
      num: '03',
      title: 'NEO-6M Satellite GPS',
      subtitle: '50-Channel High Precision GNSS',
      metric: `${location.latitude.toFixed(4)}°N`,
      metricLabel: `${location.longitude.toFixed(4)}°E • 9 Satellites`,
      status: 'LOCKED • FIX 3D',
      isDanger: false,
      viewTab: 'gps-location',
      icon: Navigation,
      accent: 'cyan',
      details: location.name || 'Coimbatore Transit Corridor'
    },
    {
      num: '04',
      title: 'SIM800L Emergency GSM',
      subtitle: 'Quad-Band Automated SMS Core',
      metric: lastSms ? 'DISPATCHED' : 'STANDBY',
      metricLabel: hardware.gsm === 'CONNECTED' ? 'Cellular RSSI: -68 dBm' : 'Connecting...',
      status: hardware.gsm === 'CONNECTED' ? 'ONLINE • READY' : 'OFFLINE',
      isDanger: false,
      viewTab: 'emergency-contact',
      icon: Radio,
      accent: 'emerald',
      details: lastSms ? `Last Alert: ${lastSms.phone}` : 'SOS Matrix Armed for Alert'
    }
  ];

  return (
    <div className="w-full bg-[#070a10] border-b border-white/[0.08] px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-ora-serif text-xs font-bold uppercase tracking-[0.2em] text-white">
            FEATURED TELEMETRY MODULES
          </span>
          <span className="text-slate-600 font-mono text-xs">/</span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            4 Cores Interfaced
          </span>
        </div>
        <button 
          onClick={() => setCurrentTab('live-monitoring')}
          className="text-xs font-mono text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
        >
          <span>VIEW ALL TELEMETRY</span>
          <span>→</span>
        </button>
      </div>

      {/* 4 Cards Grid - Replicating Ora's Timepieces Carousel / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.num}
              onClick={() => setCurrentTab(m.viewTab)}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 p-4 cursor-pointer flex flex-col justify-between ${
                m.isDanger
                  ? 'border-red-500/50 bg-red-950/20 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.3)]'
                  : 'border-white/[0.08] bg-[#0c1017]/90 hover:border-sky-400/40 hover:bg-[#0f1420] hover:shadow-[0_12px_40px_-15px_rgba(56,189,248,0.25)] hover:-translate-y-0.5'
              }`}
            >
              {/* Subtle Card Glow */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>

              {/* Card Header: Number & Icon */}
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-sky-400 transition-colors">
                    {m.num}
                  </span>
                  <div className={`p-2 rounded-xl border transition-colors ${
                    m.isDanger
                      ? 'border-red-500/40 bg-red-500/10 text-red-400 animate-pulse'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 group-hover:border-sky-400/30 group-hover:text-sky-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Module Title & Subtitle */}
                <h4 className="mt-3 text-sm font-semibold text-white tracking-tight group-hover:text-sky-200 transition-colors">
                  {m.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  {m.subtitle}
                </p>
              </div>

              {/* Metric & Details */}
              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-baseline justify-between">
                  <span className={`text-base font-bold font-mono ${
                    m.isDanger ? 'text-red-400' : 'text-white'
                  }`}>
                    {m.metric}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {m.metricLabel}
                  </span>
                </div>
                
                {/* Status Indicator Bar */}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      m.isDanger ? 'bg-red-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    }`}></span>
                    <span className={`text-[10px] font-mono font-medium ${
                      m.isDanger ? 'text-red-300' : 'text-slate-400'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  
                  {/* Circular Arrow Button (like Ora timepiece card) */}
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.05] border border-white/10 text-slate-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all transform group-hover:scale-105">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
