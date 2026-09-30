import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { Activity, ShieldCheck, ShieldAlert, Sliders, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export const LiveMonitoringView = () => {
  const { 
    alcoholLevel, 
    threshold, 
    alcoholStatus, 
    vehicleStatus, 
    chartData, 
    triggerAlcoholDetection,
    resetSafetySystem,
    setThreshold
  } = useSystem();

  const [testSliderVal, setTestSliderVal] = useState(alcoholLevel);

  const isDanger = alcoholStatus === 'ALCOHOL DETECTED' || vehicleStatus === 'STOPPED';

  const handleApplyCustomReading = (val) => {
    setTestSliderVal(val);
    if (val >= threshold) {
      triggerAlcoholDetection(val);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Live MQ-3 Alcohol Sensor Monitoring & Signal Stream
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous analog voltage sampling from ESP32 ADC pin (GPIO34). Threshold logic auto-engages motor cut off relay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDanger ? (
            <div className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/50 font-bold text-xs animate-pulse flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>ALCOHOL DETECTED ({alcoholLevel} PPM)</span>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>SAFE MONITORING ({alcoholLevel} PPM)</span>
            </div>
          )}
        </div>
      </div>

      {/* TOP 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: MQ-3 Sensor Reading */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-semibold">MQ-3 Sensor Reading</span>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-4xl font-black ${isDanger ? 'text-red-400' : 'text-cyan-400'}`}>
              {alcoholLevel}
            </span>
            <span className="text-sm font-mono text-slate-400">PPM (Analog ADC)</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isDanger ? 'bg-red-500' : 'bg-cyan-400'}`}
              style={{ width: `${Math.min(100, (alcoholLevel / 800) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Configured Threshold */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-semibold">Safety Threshold Limit</span>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400">
              {threshold}
            </span>
            <span className="text-sm font-mono text-slate-400">PPM</span>
          </div>
          <p className="text-xs text-slate-400">Readings &gt;= {threshold} trigger immediate vehicle stop.</p>
        </div>

        {/* Card 3: Current Safety Status */}
        <div className={`glass-card p-5 rounded-2xl border flex flex-col justify-between ${
          isDanger ? 'border-red-500/60 bg-red-950/20' : 'border-emerald-500/30 bg-emerald-950/10'
        }`}>
          <span className="text-xs text-slate-400 uppercase font-semibold">Safety & Engine Status</span>
          <div className="my-3">
            <span className={`text-2xl font-black uppercase ${isDanger ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {alcoholStatus}
            </span>
          </div>
          <span className="text-xs text-slate-300">
            Vehicle Motor: <strong className={vehicleStatus === 'RUNNING' ? 'text-emerald-400' : 'text-red-400'}>{vehicleStatus}</strong>
          </span>
        </div>

      </div>

      {/* FULL EXPANDED REAL-TIME LINE GRAPH */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Real-Time Alcohol Signal Graph</h3>
            <p className="text-xs text-slate-400">Live ADC plot sampled every 2.5 seconds</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span> Sensor Signal
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-3 h-0.5 bg-red-400"></span> Threshold ({threshold})
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis domain={[0, 900]} stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <ReferenceLine y={threshold} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke={isDanger ? '#ef4444' : '#06b6d4'} 
                strokeWidth={3}
                fillOpacity={0.2}
                fill={isDanger ? '#ef4444' : '#06b6d4'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LIVE SIMULATION SPRAY / SLIDER CALIBRATOR */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          Interactive MQ-3 Alcohol Concentration Calibrator
        </h3>
        <p className="text-xs text-slate-400">
          Drag the slider to test how the system dynamically responds when alcohol vapor hits the MQ-3 sensor.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <input 
            type="range" 
            min="50" 
            max="800" 
            value={testSliderVal}
            onChange={(e) => handleApplyCustomReading(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-sm font-bold text-amber-400">{testSliderVal} PPM</span>
            <button
              onClick={() => handleApplyCustomReading(520)}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              Trigger High (520)
            </button>
            <button
              onClick={() => { setTestSliderVal(110); resetSafetySystem(); }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Reset Normal (110)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
