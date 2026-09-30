import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { Settings, Save, CheckCircle2, PhoneCall, Sliders, Car, Volume2, Send, Sun, Moon } from 'lucide-react';

export const SettingsView = () => {
  const { 
    emergencyPhone, setEmergencyPhone, 
    threshold, setThreshold, 
    vehicleId, setVehicleId,
    isSoundMuted, setIsSoundMuted,
    theme, setTheme
  } = useSystem();

  const [localPhone, setLocalPhone] = useState(emergencyPhone);
  const [localThreshold, setLocalThreshold] = useState(threshold);
  const [localVehicleId, setLocalVehicleId] = useState(vehicleId);
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setEmergencyPhone(localPhone);
    setThreshold(Number(localThreshold));
    setVehicleId(localVehicleId);
    
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);

    // Push settings to Express API
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emergency_phone: localPhone,
        threshold: Number(localThreshold),
        vehicle_id: localVehicleId
      })
    }).catch(() => {});
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            System Administration & Threshold Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure safety thresholds, vehicle identification, emergency contact numbers, and alarm audio parameters.
          </p>
        </div>

        {saveMessage && (
          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved to Database!
          </span>
        )}
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSaveSettings} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        
        {/* Field 1: Registered Emergency Contact */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            Registered Emergency Phone Number
          </label>
          <p className="text-xs text-slate-400">
            Emergency SMS alerts containing vehicle ID and Google Maps location link will be dispatched to this number upon threshold breach.
          </p>
          <input
            type="text"
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            placeholder="+91 XXXXXXXXXX"
            className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500 mt-2"
            required
          />
        </div>

        {/* Field 2: MQ-3 Alcohol Safety Threshold */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              MQ-3 Alcohol Safety Threshold Limit (PPM)
            </label>
            <span className="font-mono text-sm font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30">
              {localThreshold} PPM
            </span>
          </div>
          <p className="text-xs text-slate-400">
            If the MQ-3 sensor reading meets or exceeds this threshold, the safety algorithm immediately cuts vehicle ignition and triggers emergency workflows.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <input
              type="range"
              min="100"
              max="700"
              step="10"
              value={localThreshold}
              onChange={(e) => setLocalThreshold(e.target.value)}
              className="w-full max-w-md accent-cyan-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="100"
              max="700"
              value={localThreshold}
              onChange={(e) => setLocalThreshold(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs text-center"
            />
          </div>
        </div>

        {/* Field 3: Vehicle Identifier */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-400" />
            Vehicle Fleet Identification Code
          </label>
          <p className="text-xs text-slate-400">Unique identifier appended in SMS payloads and incident logs.</p>
          <input
            type="text"
            value={localVehicleId}
            onChange={(e) => setLocalVehicleId(e.target.value)}
            placeholder="SV-001"
            className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500 mt-2"
            required
          />
        </div>

        {/* Field 4: Display Appearance & Theme (White Default, Optional Black) */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Interface Theme & Appearance
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your preferred visual presentation style. White (Light Mode) is configured as default.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-1">
            {/* White Theme Option */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                theme === 'light'
                  ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    White Theme
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                      Default
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Clean, crisp light dashboard layout</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                theme === 'light' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
              }`}>
                {theme === 'light' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            {/* Black Theme Option */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                theme === 'dark'
                  ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Black Theme
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold uppercase">
                      Optional
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Deep obsidian night cockpit style</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                theme === 'dark' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
              }`}>
                {theme === 'dark' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* Field 5: Alarm Sound Settings */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              Piezo Buzzer Web Audio Alarm Tone
            </label>
            <p className="text-xs text-slate-400 mt-0.5">Synthesize 880Hz audio alarm when alcohol is detected.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
              !isSoundMuted 
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {!isSoundMuted ? 'Audio Enabled' : 'Audio Muted'}
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/50 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
