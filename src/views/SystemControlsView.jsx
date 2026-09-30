import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Sliders, Play, Pause, RefreshCw, AlertOctagon, Send, MapPin, Power, CheckCircle2 } from 'lucide-react';

export const SystemControlsView = ({ onOpenResetModal }) => {
  const { 
    isMonitoringActive, 
    setIsMonitoringActive, 
    triggerAlcoholDetection, 
    setVehicleStatus, 
    location, 
    setLocation,
    emergencyPhone,
    vehicleId,
    setLastSms,
    setShowSmsModal
  } = useSystem();

  const handleTestAlcoholAlert = () => {
    triggerAlcoholDetection(550, location.latitude, location.longitude, "Manual Safety Control Test");
  };

  const handleTestSms = () => {
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

  const handleTestGps = () => {
    const newLat = Number((11.0168 + (Math.random() - 0.5) * 0.03).toFixed(5));
    const newLng = Number((76.9558 + (Math.random() - 0.5) * 0.03).toFixed(5));
    setLocation(prev => ({
      ...prev,
      latitude: newLat,
      longitude: newLng,
      name: "Coimbatore Hackathon Zone, India"
    }));
  };

  const handleTestVehicleStop = () => {
    setVehicleStatus("STOPPED");
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-400" />
            System Control & Diagnostic Command Panel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Execute manual diagnostic tests, toggle live sampling engine, or trigger safety resets.
          </p>
        </div>
      </div>

      {/* MONITORING START / STOP CONTROL */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Live Sampling Engine State</h3>
        
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">MQ-3 Polling Engine:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-black ${
                isMonitoringActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {isMonitoringActive ? 'ACTIVE (2.5s INTERVAL)' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Controls continuous telemetry data streaming and graph plotting.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isMonitoringActive ? (
              <button
                onClick={() => setIsMonitoringActive(false)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950"
              >
                <Pause className="w-4 h-4" />
                <span>Stop Monitoring</span>
              </button>
            ) : (
              <button
                onClick={() => setIsMonitoringActive(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
              >
                <Play className="w-4 h-4" />
                <span>Start Monitoring</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MANUAL TEST CONTROLS GRID */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Diagnostic Test Triggers</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Test 1: Reset Safety System */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-emerald-400 text-sm block mb-1">Reset Safety System</span>
              <p className="text-xs text-slate-400">Requires confirmation modal. Clears safety lockout and restores vehicle engine to RUNNING.</p>
            </div>
            <button
              onClick={onOpenResetModal}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Safety System</span>
            </button>
          </div>

          {/* Test 2: Test Alcohol Alert */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-red-400 text-sm block mb-1">Test Alcohol Alert</span>
              <p className="text-xs text-slate-400">Simulates high alcohol level spike (550 PPM), engaging motor stop, alarm, and SMS alert workflow.</p>
            </div>
            <button
              onClick={handleTestAlcoholAlert}
              className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-950"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Test Alcohol Alert</span>
            </button>
          </div>

          {/* Test 3: Test SMS Alert */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-purple-400 text-sm block mb-1">Test SMS Alert</span>
              <p className="text-xs text-slate-400">Generates emergency SMS payload with vehicle ID and Google Maps link, displaying smartphone popup.</p>
            </div>
            <button
              onClick={handleTestSms}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-950"
            >
              <Send className="w-4 h-4" />
              <span>Test SMS Alert</span>
            </button>
          </div>

          {/* Test 4: Test GPS Fix */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-cyan-400 text-sm block mb-1">Test GPS Fix</span>
              <p className="text-xs text-slate-400">Updates live latitude and longitude coordinates to simulate vehicle location change.</p>
            </div>
            <button
              onClick={handleTestGps}
              className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-950"
            >
              <MapPin className="w-4 h-4" />
              <span>Test GPS Location</span>
            </button>
          </div>

          {/* Test 5: Test Vehicle Stop */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-amber-400 text-sm block mb-1">Test Vehicle Stop</span>
              <p className="text-xs text-slate-400">Directly cuts off vehicle motor relay status from RUNNING to STOPPED.</p>
            </div>
            <button
              onClick={handleTestVehicleStop}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-950"
            >
              <Power className="w-4 h-4" />
              <span>Test Vehicle Stop</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
