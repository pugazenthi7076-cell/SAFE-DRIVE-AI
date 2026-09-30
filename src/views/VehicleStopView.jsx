import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Power, ShieldAlert, Clock, AlertOctagon, Lock, RefreshCw, Cpu, Activity } from 'lucide-react';

export const VehicleStopView = ({ onOpenResetModal }) => {
  const { 
    vehicleStatus, 
    alcoholStatus, 
    alcoholLevel, 
    threshold, 
    stoppedAt, 
    stopReason, 
    vehicleId 
  } = useSystem();

  const isStopped = vehicleStatus === 'STOPPED' || alcoholStatus === 'ALCOHOL DETECTED';

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Card */}
      <div className={`p-6 rounded-2xl border ${
        isStopped 
          ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-red-500 shadow-2xl shadow-red-950 animate-emergency-pulse'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isStopped ? 'bg-red-600 text-white' : 'bg-emerald-600/20 text-emerald-400'}`}>
              <Power className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl lg:text-2xl font-black text-white">
                  Automatic Vehicle Ignition Cutoff System
                </h2>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  isStopped ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {vehicleStatus}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Motor relay safety interlock module connected to ESP32 GPIO pin 23.
              </p>
            </div>
          </div>

          {isStopped && (
            <button
              onClick={onOpenResetModal}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Safety Lockout</span>
            </button>
          )}
        </div>
      </div>

      {/* DETAILED EMERGENCY BANNER IF STOPPED */}
      {isStopped ? (
        <div className="glass-card p-6 rounded-2xl border-2 border-red-500 space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <ShieldAlert className="w-7 h-7 animate-bounce" />
            <h3 className="text-2xl font-black uppercase text-white tracking-wide">
              ALCOHOL DETECTED - VEHICLE STOPPED
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60">
              <span className="text-xs text-slate-400 uppercase">Alcohol Level</span>
              <div className="text-2xl font-black text-red-400 mt-1">{alcoholLevel} PPM</div>
              <span className="text-[11px] text-slate-400">Limit: {threshold} PPM</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60">
              <span className="text-xs text-slate-400 uppercase">Detection Time</span>
              <div className="text-sm font-bold text-white mt-2 font-mono">{stoppedAt || 'Just Now'}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60">
              <span className="text-xs text-slate-400 uppercase">Reason for Stopping</span>
              <div className="text-xs font-semibold text-amber-300 mt-2">{stopReason || 'MQ-3 Sensor Cutoff'}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60">
              <span className="text-xs text-slate-400 uppercase">Ignition Relay Lock</span>
              <div className="text-sm font-bold text-red-400 mt-2 flex items-center gap-1">
                <Lock className="w-4 h-4" /> ENGAGED (HIGH IMPEDANCE)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 leading-relaxed">
            ⚠️ <strong>SAFETY MECHANISM ACTIVE:</strong> The vehicle engine is locked electronically. Restart is strictly disabled until authorized safety reset is initiated.
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Vehicle Motor Operating Normally
          </h3>
          <p className="text-xs text-slate-300">
            No alcohol detected. The relay contacts remain closed, supplying power to the vehicle ignition system.
          </p>
        </div>
      )}

      {/* RELAY SCHEMATIC & HARDWARE ARCHITECTURE */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Hardware Cutoff Relay Architecture
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="font-bold text-blue-400 block mb-1">1. Signal Sensing</span>
            <p className="text-slate-400">MQ-3 outputs analog voltage to ESP32 ADC. If voltage exceeds threshold, ESP32 instantly drops GPIO23 pin output to LOW.</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="font-bold text-blue-400 block mb-1">2. Relay De-energize</span>
            <p className="text-slate-400">The 5V relay module coil de-energizes within 10 milliseconds, breaking the vehicle starter motor / ignition solenoid loop.</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="font-bold text-blue-400 block mb-1">3. Fail-Safe Lockout</span>
            <p className="text-slate-400">System maintains open-circuit lock state and initiates GPS coordinate extraction & emergency SMS alert dispatch.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
