import React from 'react';
import { useSystem } from '../context/SystemContext';
import { ShieldAlert, AlertTriangle, RefreshCw, Volume2, VolumeX, Clock, FileText, Lock } from 'lucide-react';

export const EmergencyWarningBanner = ({ onOpenResetModal }) => {
  const { 
    vehicleStatus, 
    alcoholStatus, 
    stoppedAt, 
    stopReason, 
    alcoholLevel, 
    threshold,
    isSoundMuted,
    setIsSoundMuted,
    isBuzzerActive
  } = useSystem();

  if (vehicleStatus !== "STOPPED" && alcoholStatus !== "ALCOHOL DETECTED") {
    return null;
  }

  return (
    <div className="mx-4 mt-4 p-5 rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-2 border-red-500 shadow-2xl shadow-red-950/80 animate-emergency-pulse">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Main Warning Title & Icon */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-700/50 shrink-0">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl lg:text-2xl font-black text-white tracking-wide uppercase">
                ALCOHOL DETECTED - VEHICLE STOPPED
              </h2>
              <span className="px-2.5 py-1 text-xs font-black rounded-md bg-red-500 text-white animate-pulse">
                CRITICAL EMERGENCY LOCKOUT
              </span>
            </div>

            <p className="text-sm text-red-200 font-medium">
              The safety system detected alcohol level exceeding configured safety threshold ({alcoholLevel} PPM vs limit {threshold} PPM). Motor ignition relay cut off automatically.
            </p>

            {/* Metadata Chips */}
            <div className="flex items-center gap-4 mt-3 flex-wrap text-xs text-red-200 font-mono">
              <div className="flex items-center gap-1.5 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-800/60">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>Detection Time: <strong className="text-white">{stoppedAt || 'Just Now'}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-800/60">
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Reason: <strong className="text-white">{stopReason || 'MQ-3 Sensor Safety Cutoff'}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-800/60">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Engine Lock: <strong className="text-emerald-400">ENGAGED</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-red-800/60">
          {isBuzzerActive && (
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="px-3 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />}
              <span>{isSoundMuted ? 'Buzzer Muted' : 'Silence Alarm'}</span>
            </button>
          )}

          <button
            onClick={onOpenResetModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-950 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Safety System</span>
          </button>
        </div>

      </div>
    </div>
  );
};
