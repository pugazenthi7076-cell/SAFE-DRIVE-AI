import React from 'react';
import { useSystem } from '../context/SystemContext';
import { ShieldCheck, ShieldAlert, Cpu, Radio, Volume2, VolumeX, RefreshCw, Activity, Sun, Moon } from 'lucide-react';

export const Header = ({ onOpenResetModal }) => {
  const { 
    vehicleStatus, 
    alcoholStatus, 
    hardware, 
    isBuzzerActive, 
    isSoundMuted, 
    setIsSoundMuted,
    vehicleId,
    theme,
    toggleTheme
  } = useSystem();

  return (
    <header className="sticky top-0 z-30 bg-[#090d15]/95 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & SIH Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-400/30 rounded-xl text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base lg:text-lg font-bold text-white tracking-tight font-display">
                Smart Vehicle Safety & Alcohol Alert System
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-sky-500/10 text-sky-300 border border-sky-400/30 font-mono uppercase tracking-wider">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Vehicle ID: <span className="text-sky-400 font-semibold">{vehicleId}</span> • ESP32 + MQ-3 + NEO-6M Interfaced
            </p>
          </div>
        </div>

        {/* Header Right Status Badges & Quick Action Controls */}
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
          {/* Hardware Status Pills */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">ESP32:</span>
            <span className={`font-semibold ${hardware.esp32 === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'}`}>
              {hardware.esp32}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">GSM/GPS:</span>
            <span className={`font-semibold ${hardware.gsm === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'}`}>
              ONLINE
            </span>
          </div>

          {/* Sound Buzzer Toggle Button */}
          {isBuzzerActive && (
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isSoundMuted 
                  ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' 
                  : 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse hover:bg-red-500/30'
              }`}
              title={isSoundMuted ? "Unmute Buzzer Alarm" : "Mute Buzzer Alarm"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSoundMuted ? 'Muted' : 'Alarm Active'}</span>
            </button>
          )}

          {/* Reset Safety System Button */}
          {vehicleStatus === "STOPPED" && (
            <button
              onClick={onOpenResetModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Safety</span>
            </button>
          )}

          {/* Master Overall System Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
            alcoholStatus === 'ALCOHOL DETECTED' || vehicleStatus === 'STOPPED'
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-emergency-pulse'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}>
            {alcoholStatus === 'ALCOHOL DETECTED' ? (
              <>
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>DANGER • VEHICLE STOPPED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SYSTEM SAFE • RUNNING</span>
              </>
            )}
          </div>
          {/* Theme Mode Toggle (White Default, Optional Black) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 shadow-sm"
            title={theme === 'light' ? "Switch to Black (Dark) Mode" : "Switch to White (Light) Mode"}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
