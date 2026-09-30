import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Cpu, Activity, MapPin, Radio, Power, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const HardwareStatusView = () => {
  const { hardware, toggleHardwareComponent } = useSystem();

  const components = [
    {
      key: 'esp32',
      name: 'ESP32 Microcontroller',
      type: 'Core Controller Module',
      pin: '3.3V / GND / Wi-Fi',
      icon: Cpu,
      desc: 'Dual-core Xtensa 240MHz MCU processing sensor telemetry and HTTP REST client requests.'
    },
    {
      key: 'mq3',
      name: 'MQ-3 Alcohol Sensor',
      type: 'Analog Gas Sensor',
      pin: 'ADC Pin GPIO34',
      icon: Activity,
      desc: 'Tin dioxide (SnO2) semiconductor gas sensor measuring ethanol vapor concentrations.'
    },
    {
      key: 'gps',
      name: 'NEO-6M GPS Module',
      type: 'Satellite Receiver',
      pin: 'UART2 (RX2:16, TX2:17)',
      icon: MapPin,
      desc: 'High precision NMEA satellite positioning engine tracking live latitude and longitude.'
    },
    {
      key: 'gsm',
      name: 'SIM800L GSM Module',
      type: 'Cellular SMS Transceiver',
      pin: 'UART1 (RX1:26, TX1:27)',
      icon: Radio,
      desc: 'Quad-band GSM/GPRS module executing AT commands for emergency SMS alerts.'
    },
    {
      key: 'motor',
      name: 'Motor Cutoff Controller',
      type: '5V Optocoupled Relay',
      pin: 'Digital Pin GPIO23',
      icon: Power,
      desc: 'High-current relay interlock connected in series with vehicle ignition coil.'
    }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            Hardware Component Health & Connection Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status check for onboard ESP32 peripherals. Click component toggles to simulate physical disconnect/reconnect events.
          </p>
        </div>
      </div>

      {/* HARDWARE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((item) => {
          const Icon = item.icon;
          const isConnected = hardware[item.key] === 'CONNECTED';

          return (
            <div
              key={item.key}
              className={`glass-card p-6 rounded-2xl border transition-all ${
                isConnected
                  ? 'border-emerald-500/30 bg-slate-900/80 hover:border-emerald-500/50'
                  : 'border-red-500/50 bg-red-950/20 hover:border-red-500/80'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{item.name}</h3>
                    <span className="text-xs text-slate-400">{item.type}</span>
                  </div>
                </div>

                {/* Connection Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                }`}>
                  {isConnected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{hardware[item.key]}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {item.desc}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Pin: {item.pin}</span>

                {/* Simulation Toggle Switch */}
                <button
                  onClick={() => toggleHardwareComponent(item.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                    isConnected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                  }`}
                >
                  {isConnected ? 'Simulate Disconnect' : 'Reconnect Hardware'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
