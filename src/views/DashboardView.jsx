import React from 'react';
import { useSystem } from '../context/SystemContext';
import { 
  Car, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Radio, 
  PhoneCall, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Cpu,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export const DashboardView = ({ onOpenResetModal, setCurrentTab }) => {
  const {
    vehicleStatus,
    alcoholStatus,
    alcoholLevel,
    threshold,
    safetyStatus,
    hardware,
    emergencyPhone,
    lastAlertTime,
    incidents,
    location,
    chartData,
    vehicleId
  } = useSystem();

  const isDanger = alcoholStatus === 'ALCOHOL DETECTED' || vehicleStatus === 'STOPPED';

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner / SIH Overview Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/20 p-5 lg:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                IoT Safety Prototype Overview
              </span>
              <span className="text-xs text-slate-400 font-mono">Vehicle ID: {vehicleId}</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
              Vehicle Telemetry & Alcohol Safety Dashboard
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 max-w-3xl mt-1">
              Real-time MQ-3 alcohol sensor monitoring, ESP32 telemetry processing, automatic motor cutoff relay, GPS vehicle tracking, and SIM800L emergency SMS alert system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('live-monitoring')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Live Chart</span>
            </button>

            <button
              onClick={() => setCurrentTab('hardware-api')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-700 flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Hardware API</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 CORE METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* 1. Vehicle Status */}
        <div className={`glass-card p-4 rounded-xl border transition-all ${
          vehicleStatus === 'RUNNING' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-red-500/50 bg-red-950/20 animate-pulse'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Vehicle Status</span>
            <Car className={`w-4 h-4 ${vehicleStatus === 'RUNNING' ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black ${
              vehicleStatus === 'RUNNING' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {vehicleStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {vehicleStatus === 'RUNNING' ? 'Motor Relay Active' : 'Motor Cutoff Triggered'}
          </p>
        </div>

        {/* 2. Alcohol Status */}
        <div className={`glass-card p-4 rounded-xl border transition-all ${
          alcoholStatus === 'SAFE' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-red-500/60 bg-red-950/30 animate-pulse'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Alcohol Status</span>
            {alcoholStatus === 'SAFE' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
            )}
          </div>
          <span className={`text-lg font-black uppercase ${
            alcoholStatus === 'SAFE' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {alcoholStatus}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            {alcoholStatus === 'SAFE' ? 'Driver Normal' : 'Intoxication Detected!'}
          </p>
        </div>

        {/* 3. MQ-3 Alcohol Reading */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>MQ-3 Reading</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${alcoholLevel >= threshold ? 'text-red-400' : 'text-cyan-400'}`}>
              {alcoholLevel}
            </span>
            <span className="text-xs text-slate-400 font-mono">PPM</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${alcoholLevel >= threshold ? 'bg-red-500' : 'bg-cyan-400'}`}
              style={{ width: `${Math.min(100, (alcoholLevel / 800) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Limit: {threshold} PPM</span>
            <span>Max: 1023</span>
          </div>
        </div>

        {/* 4. Safety Status */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Safety Status</span>
            <ShieldCheck className={`w-4 h-4 ${safetyStatus === 'SAFE' ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
          <span className={`text-xl font-extrabold ${safetyStatus === 'SAFE' ? 'text-emerald-400' : 'text-red-400'}`}>
            {safetyStatus}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            {safetyStatus === 'SAFE' ? 'All Systems Clear' : 'Emergency Lockout'}
          </p>
        </div>

        {/* 5. GPS Status */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>GPS Status</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <span className={`text-lg font-bold ${hardware.gps === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'}`}>
            {hardware.gps}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">NEO-6M Module Fixed</p>
        </div>

        {/* 6. GSM Status */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>GSM Status</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <span className={`text-lg font-bold ${hardware.gsm === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'}`}>
            {hardware.gsm}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">SIM800L Network Ready</p>
        </div>

        {/* 7. Emergency Phone */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Registered Contact</span>
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm font-bold text-amber-300 font-mono block truncate">
            {emergencyPhone}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">SMS Recipient</p>
        </div>

        {/* 8. Last Alert Time */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Last Alert Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold text-slate-200 block truncate">
            {lastAlertTime || 'No Recent Alerts'}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Incident Timestamp</p>
        </div>

        {/* 9. Total Incidents */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Incidents</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-2xl font-black text-white">
            {incidents.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Stored in Database</p>
        </div>

        {/* 10. Current GPS Location */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>GPS Location</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 block truncate">
            {location.latitude}, {location.longitude}
          </span>
          <p className="text-[11px] text-slate-400 mt-1 truncate">{location.name}</p>
        </div>

      </div>

      {/* LOWER DASHBOARD GRID: CHART + MAP PREVIEW + HARDWARE SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Alcohol Telemetry Graph */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Live MQ-3 Alcohol Reading Telemetry Stream
              </h3>
              <p className="text-xs text-slate-400">Real-time sensor value vs configured threshold line ({threshold} PPM)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="text-slate-300">Live Reading</span>
              <span className="inline-block w-3 h-0.5 bg-red-500 ml-2"></span>
              <span className="text-slate-300">Limit ({threshold})</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="alcoholGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDanger ? '#ef4444' : '#22d3ee'} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isDanger ? '#ef4444' : '#22d3ee'} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 800]} stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="3 3" label={{ value: `Threshold: ${threshold} PPM`, fill: '#ef4444', fontSize: 10, position: 'top' }} />
                <Area 
                  type="monotone" 
                  dataKey="level" 
                  stroke={isDanger ? '#ef4444' : '#22d3ee'} 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#alcoholGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPS Quick Map Location Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Current Vehicle GPS Marker
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                ACTIVE FIX
              </span>
            </div>
            <p className="text-xs text-slate-400">Coordinates captured by onboard GPS module:</p>
            
            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Latitude:</span>
                <span className="text-emerald-400 font-bold">{location.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Longitude:</span>
                <span className="text-emerald-400 font-bold">{location.longitude}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200">{location.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Google Maps</span>
            </a>

            <button
              onClick={() => setCurrentTab('gps-location')}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all border border-slate-700"
            >
              View Full Interactive Map
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
