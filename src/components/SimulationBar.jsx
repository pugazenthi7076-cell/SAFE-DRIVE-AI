import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { ShieldCheck, AlertOctagon, Power, MapPin, Send, PlayCircle, Zap, X, ChevronDown } from 'lucide-react';

export const SimulationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { 
    triggerAlcoholDetection, 
    resetSafetySystem, 
    setVehicleStatus, 
    location, 
    setLocation,
    emergencyPhone,
    vehicleId,
    setLastSms,
    setShowSmsModal,
    runSIHDemoSequence,
    demoSequenceState
  } = useSystem();

  const handleSimulateAlcohol = () => {
    triggerAlcoholDetection(540, location.latitude, location.longitude, "Simulated MQ-3 Alcohol Spike");
  };

  const handleSimulateSafe = () => {
    resetSafetySystem();
  };

  const handleSimulateVehicleStop = () => {
    setVehicleStatus("STOPPED");
  };

  const handleSimulateGpsAlert = () => {
    const newLat = Number((11.0168 + (Math.random() - 0.5) * 0.02).toFixed(5));
    const newLng = Number((76.9558 + (Math.random() - 0.5) * 0.02).toFixed(5));
    setLocation(prev => ({
      ...prev,
      latitude: newLat,
      longitude: newLng,
      name: "Coimbatore South, TN, India"
    }));
  };

  const handleSimulateSmsAlert = () => {
    const now = new Date();
    const dtStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    const smsContent = `🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle has been stopped automatically.\nVehicle ID: ${vehicleId}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}\nTime: ${dtStr}`;
    
    setLastSms({
      phone: emergencyPhone,
      text: smsContent,
      timestamp: dtStr,
      status: "SENT"
    });
    setShowSmsModal(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 pointer-events-auto">
      {!isOpen ? (
        /* Floating Compact Trigger Pill */
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-amber-500/10 active:scale-95 cursor-pointer"
          title="Open Simulation & Testing Panel"
        >
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Zap className="w-3 h-3 fill-amber-400" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200">Simulation Dock</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>
      ) : (
        /* Expanded Floating Glass Action Dock */
        <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl shadow-black/80 max-w-xl w-[calc(100vw-2.5rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-slate-200 tracking-wide">
                Simulation & Testing Dock
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Collapse"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* SIMULATE SAFE */}
            <button
              onClick={handleSimulateSafe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulate Safe</span>
            </button>

            {/* SIMULATE ALCOHOL DETECTED */}
            <button
              onClick={handleSimulateAlcohol}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/50 text-xs font-bold transition-all shadow-md shadow-red-950 cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>Alcohol Spike</span>
            </button>

            {/* SIMULATE VEHICLE STOP */}
            <button
              onClick={handleSimulateVehicleStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Stop Vehicle</span>
            </button>

            {/* SIMULATE GPS ALERT */}
            <button
              onClick={handleSimulateGpsAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>GPS Alert</span>
            </button>

            {/* SIMULATE SMS ALERT */}
            <button
              onClick={handleSimulateSmsAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SMS Alert</span>
            </button>

            {/* AUTO DEMO SEQUENCE */}
            <button
              onClick={runSIHDemoSequence}
              disabled={demoSequenceState.isActive}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                demoSequenceState.isActive
                  ? 'bg-blue-600/40 text-blue-300 cursor-not-allowed border border-blue-400/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/50 border border-blue-400/40'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-white" />
              <span>{demoSequenceState.isActive ? 'Running...' : 'Auto Demo Flow'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
