import React from 'react';
import { Cpu, ShieldCheck, Zap, Radio, Terminal, ExternalLink } from 'lucide-react';

export const OraTechnicalSpecs = ({ setCurrentTab }) => {
  const specs = [
    { label: 'Microcontroller', value: 'ESP32 Dual-Core Xtensa 32-bit (240MHz)' },
    { label: 'Gas Sensor Core', value: 'MQ-3 SnO2 Semiconductor (0.05 - 10 mg/L)' },
    { label: 'Satellite GNSS', value: 'u-blox NEO-6M 50-Channel Engine (2.5m CEP)' },
    { label: 'Cellular Engine', value: 'SIM800L Quad-Band GPRS/GSM (Class 12)' },
    { label: 'Ignition Interlock', value: 'Songle 10A 250VAC Optocoupled Relay' },
    { label: 'Auditory Siren', value: 'Active Piezo 90dB High-Decibel Buzzer' },
    { label: 'Web Engine', value: 'React 19 • Vite • Tailwind • Leaflet GIS' },
    { label: 'API Protocols', value: 'HTTP REST / JSON / Serial 115200 Baud' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.08] mt-16">
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        
        {/* Left Editorial Breakdown */}
        <article className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-semibold">
              GENEVA TELEMETRIC ARCHITECTURE
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Engineered for instantaneous cut-off and automated emergency dispatch.
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-slate-300 font-light">
            Safe Drive AI transforms standard vehicular operation into an actively monitored safety ecosystem. 
            By deploying a high-speed MQ-3 semiconductor sensor matrix within the cabin, the system samples alcohol vapor density in real-time. 
            When ethanol molecules exceed calibrated thresholds, the ESP32 microcontroller triggers an optical isolation relay that breaks the primary 12V vehicle ignition circuit, ensuring the vehicle cannot be operated under the influence.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-slate-400">
            Simultaneously, the on-board NEO-6M satellite receiver locks pinpoint geographic coordinates, and the SIM800L cellular module broadcasts an emergency alert payload containing Google Maps navigation links to designated family contacts and law enforcement dispatchers.
          </p>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#090d14]">
              <span className="text-sky-400 font-mono text-xl font-bold">240Hz</span>
              <h5 className="text-xs font-semibold text-white mt-1">Sensor Polling</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">Sub-millisecond analog gas sampling with zero buffer lag.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#090d14]">
              <span className="text-emerald-400 font-mono text-xl font-bold">100%</span>
              <h5 className="text-xs font-semibold text-white mt-1">Hardware Failsafe</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">Relay default-off interlock blocks bypass attempts.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#090d14]">
              <span className="text-amber-400 font-mono text-xl font-bold">&lt;1.8s</span>
              <h5 className="text-xs font-semibold text-white mt-1">SMS Dispatch</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">Direct GSM cellular transmission with live GPS coordinates.</p>
            </div>
          </div>
        </article>

        {/* Right Hardware Specifications Aside */}
        <aside className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <span>Hardware & Telemetric Stack</span>
            </h3>
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#090d14] divide-y divide-white/[0.05] overflow-hidden">
              {specs.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="text-slate-400 font-mono">{s.label}</span>
                  <span className="text-white font-medium text-right ml-2">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Connect CTA Card */}
          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/20 via-[#0a0f18] to-slate-900 p-5 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl"></div>
            <h4 className="font-semibold text-white text-sm">Hardware Interfacing Guide</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Ready to wire the ESP32 breadboard? Access the complete pinout diagrams, Arduino C++ firmware, and REST API payload specs.
            </p>
            <button
              onClick={() => setCurrentTab('hardware-api')}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-slate-100 transition-colors"
            >
              <span>View ESP32 Code & API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
