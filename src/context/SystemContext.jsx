import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  // 1. Core State
  const [vehicleId, setVehicleId] = useState("SV-001");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 9876543210");
  const [threshold, setThreshold] = useState(300);
  
  // Statuses
  const [vehicleStatus, setVehicleStatus] = useState("RUNNING"); // RUNNING | STOPPED
  const [alcoholStatus, setAlcoholStatus] = useState("SAFE"); // SAFE | ALCOHOL DETECTED
  const [alcoholLevel, setAlcoholLevel] = useState(120);
  const [safetyStatus, setSafetyStatus] = useState("SAFE"); // SAFE | DANGER
  const [stopReason, setStopReason] = useState(null);
  const [stoppedAt, setStoppedAt] = useState(null);
  
  // Hardware Status
  const [hardware, setHardware] = useState({
    esp32: "CONNECTED",
    mq3: "CONNECTED",
    gps: "CONNECTED",
    gsm: "CONNECTED",
    motor: "CONNECTED"
  });

  // Location
  const [location, setLocation] = useState({
    latitude: 11.0168,
    longitude: 76.9558,
    name: "Coimbatore, Tamil Nadu, India",
    gpsStatus: "CONNECTED"
  });

  // Controls & Alarm
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [isBuzzerActive, setIsBuzzerActive] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [lastSms, setLastSms] = useState(null);
  const [lastAlertTime, setLastAlertTime] = useState(null);
  const [showSmsModal, setShowSmsModal] = useState(false);

  // Theme State: White (light) default, Black (dark) optional
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }, [theme]);

  // SIH Demo Sequence Tracker
  const [demoSequenceState, setDemoSequenceState] = useState({
    isActive: false,
    currentStep: 0,
    steps: [
      { id: 1, title: "SYSTEM READY", status: "completed" },
      { id: 2, title: "Vehicle Running", status: "pending" },
      { id: 3, title: "MQ-3 Detects Alcohol", status: "pending" },
      { id: 4, title: "ESP32 Sends Data", status: "pending" },
      { id: 5, title: "Application Shows ALCOHOL DETECTED", status: "pending" },
      { id: 6, title: "Vehicle Changes to STOPPED", status: "pending" },
      { id: 7, title: "Buzzer/Alert Activated", status: "pending" },
      { id: 8, title: "GPS Location Captured", status: "pending" },
      { id: 9, title: "Emergency SMS Generated", status: "pending" },
      { id: 10, title: "SMS SENT", status: "pending" },
      { id: 11, title: "Incident Saved in History", status: "pending" }
    ]
  });

  // Incident History
  const [incidents, setIncidents] = useState([
    {
      id: "INC-1001",
      vehicle_id: "SV-001",
      type: "Alcohol Detected",
      alcohol_level: 520,
      threshold: 300,
      date: "26-09-2026",
      time: "14:30:15",
      timestamp: Date.now() - 3600000 * 2,
      latitude: 11.0168,
      longitude: 76.9558,
      location: "Coimbatore",
      vehicle_status: "Vehicle Stopped",
      alert_status: "SMS Sent",
      phone_number: "+91 9876543210",
      sms_text: "🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle has been stopped automatically.\nVehicle ID: SV-001\nLocation: https://maps.google.com/?q=11.0168,76.9558\nTime: 26-09-2026 14:30:15"
    }
  ]);

  // Real-time sensor graph history stream (last 30 points)
  const [chartData, setChartData] = useState(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const timeStr = new Date(now - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initial.push({
        time: timeStr,
        level: Math.floor(100 + Math.random() * 40),
        threshold: 300
      });
    }
    return initial;
  });

  // Audio Context Ref for Buzzer
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Format Helper
  const getFormattedDateTime = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return {
      date: `${d}-${m}-${y}`,
      time: `${hh}:${mm}:${ss}`,
      full: `${d}-${m}-${y} ${hh}:${mm}:${ss}`
    };
  };

  // Audio Alarm Synthesis (Buzzer tone)
  useEffect(() => {
    if (isBuzzerActive && !isSoundMuted) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        if (!oscRef.current) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch alarm tone
          
          // Pulsing amplitude effect
          gain.gain.setValueAtTime(0.1, ctx.currentTime);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          oscRef.current = { osc, gain, ctx };
        }
      } catch (err) {
        console.warn("Audio Context init warning:", err);
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.osc.stop();
          oscRef.current.osc.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.osc.stop();
          oscRef.current.osc.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
    };
  }, [isBuzzerActive, isSoundMuted]);

  // Periodic Telemetry Chart Stream & Server Sync
  useEffect(() => {
    if (!isMonitoringActive) return;

    const interval = setInterval(() => {
      // 1. Stream random slight variance if vehicle is RUNNING and SAFE
      setAlcoholLevel((prev) => {
        if (vehicleStatus === "STOPPED" || alcoholStatus === "ALCOHOL DETECTED") {
          return prev; // keep high reading
        }
        const delta = (Math.random() - 0.5) * 12;
        const newLevel = Math.max(50, Math.min(240, Math.round(prev + delta)));
        
        // Add to chart
        setChartData((cData) => {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const updated = [...cData, { time: nowStr, level: newLevel, threshold: threshold }];
          if (updated.length > 25) updated.shift();
          return updated;
        });

        return newLevel;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isMonitoringActive, vehicleStatus, alcoholStatus, threshold]);

  // Fetch status from Express server if available
  const syncWithServer = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        if (data.telemetry) {
          setVehicleStatus(data.telemetry.vehicle_status);
          setAlcoholStatus(data.telemetry.alcohol_status);
          setAlcoholLevel(data.telemetry.alcohol_level);
          setSafetyStatus(data.telemetry.safety_status);
          setIsBuzzerActive(data.telemetry.buzzer_active);
          if (data.telemetry.last_alert_time) setLastAlertTime(data.telemetry.last_alert_time);
          if (data.telemetry.stop_reason !== undefined) setStopReason(data.telemetry.stop_reason);
          if (data.telemetry.stopped_at !== undefined) setStoppedAt(data.telemetry.stopped_at);
          if (data.telemetry.latitude && data.telemetry.longitude) {
            setLocation(prev => ({
              ...prev,
              latitude: data.telemetry.latitude,
              longitude: data.telemetry.longitude,
              name: data.telemetry.location_name || prev.name
            }));
          }
        }
        if (data.settings) {
          setEmergencyPhone(data.settings.emergency_phone);
          setThreshold(data.settings.threshold);
          setVehicleId(data.settings.vehicle_id);
        }
        if (data.hardware) {
          setHardware(data.hardware);
        }
      }
    } catch (e) {
      // Graceful fallback to client state if server is offline
    }
  };

  // Sync incidents from server
  const syncIncidentsFromServer = async () => {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        if (data.incidents && data.incidents.length > 0) {
          setIncidents(data.incidents);
        }
      }
    } catch (e) {
      // Graceful fallback if server offline
    }
  };

  useEffect(() => {
    syncWithServer();
    syncIncidentsFromServer();

    // Auto-poll server every 5 seconds to stay in sync with ESP32 hardware
    const pollInterval = setInterval(() => {
      syncWithServer();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  // Core Safety Triggering Function
  const triggerAlcoholDetection = (reading = 540, customLat = null, customLng = null, reason = "MQ-3 Sensor Alcohol Spike Detected") => {
    const dt = getFormattedDateTime();
    const lat = customLat || location.latitude;
    const lng = customLng || location.longitude;
    const level = Number(reading);

    // 1. Update Core State
    setAlcoholLevel(level);
    setAlcoholStatus("ALCOHOL DETECTED");
    setVehicleStatus("STOPPED");
    setSafetyStatus("DANGER");
    setStopReason(reason);
    setStoppedAt(dt.full);
    setLastAlertTime(dt.full);
    setIsBuzzerActive(true);

    // 2. Build SMS
    const smsContent = `🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle has been stopped automatically.\nVehicle ID: ${vehicleId}\nLocation: https://maps.google.com/?q=${lat},${lng}\nTime: ${dt.full}`;
    const smsObj = {
      phone: emergencyPhone,
      text: smsContent,
      timestamp: dt.full,
      status: "SENT"
    };
    setLastSms(smsObj);
    setShowSmsModal(true);

    // 3. Create Incident
    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInc = {
      id: incidentId,
      vehicle_id: vehicleId,
      type: "Alcohol Detected",
      alcohol_level: level,
      threshold: threshold,
      date: dt.date,
      time: dt.time,
      timestamp: Date.now(),
      latitude: lat,
      longitude: lng,
      location: location.name,
      vehicle_status: "Vehicle Stopped",
      alert_status: "SMS Sent",
      phone_number: emergencyPhone,
      sms_text: smsContent
    };

    setIncidents(prev => [newInc, ...prev]);

    // Push high value into chart
    setChartData(cData => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const updated = [...cData, { time: nowStr, level: level, threshold: threshold }];
      if (updated.length > 25) updated.shift();
      return updated;
    });

    // Notify backend
    fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ALCOHOL_DETECTED', val: level, lat, lng })
    }).catch(() => {});
  };

  // RESET Safety System Function
  const resetSafetySystem = () => {
    setVehicleStatus("RUNNING");
    setAlcoholStatus("SAFE");
    setAlcoholLevel(110);
    setSafetyStatus("SAFE");
    setStopReason(null);
    setStoppedAt(null);
    setIsBuzzerActive(false);

    // Add safe reading to chart
    setChartData(cData => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const updated = [...cData, { time: nowStr, level: 110, threshold: threshold }];
      if (updated.length > 25) updated.shift();
      return updated;
    });

    fetch('/api/reset', { method: 'POST' }).catch(() => {});
  };

  // Run Animated SIH Step-by-Step Demonstration Flow
  const runSIHDemoSequence = () => {
    // Reset all steps to pending before starting
    setDemoSequenceState({
      isActive: true,
      currentStep: 1,
      steps: [
        { id: 1, title: "SYSTEM READY", status: "completed" },
        { id: 2, title: "Vehicle Running", status: "pending" },
        { id: 3, title: "MQ-3 Detects Alcohol", status: "pending" },
        { id: 4, title: "ESP32 Sends Data", status: "pending" },
        { id: 5, title: "Application Shows ALCOHOL DETECTED", status: "pending" },
        { id: 6, title: "Vehicle Changes to STOPPED", status: "pending" },
        { id: 7, title: "Buzzer/Alert Activated", status: "pending" },
        { id: 8, title: "GPS Location Captured", status: "pending" },
        { id: 9, title: "Emergency SMS Generated", status: "pending" },
        { id: 10, title: "SMS SENT", status: "pending" },
        { id: 11, title: "Incident Saved in History", status: "pending" }
      ]
    });
    
    // Step 1: System Ready
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 2 }));
      setVehicleStatus("RUNNING");
      setAlcoholStatus("SAFE");
      setAlcoholLevel(120);
      setIsBuzzerActive(false);
    }, 1200);

    // Step 3: MQ-3 detects alcohol
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 3 }));
      setAlcoholLevel(580);
    }, 2800);

    // Step 4: ESP32 sends data
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 4 }));
    }, 4000);

    // Step 5 & 6: App shows ALCOHOL DETECTED & Vehicle STOPPED
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 6 }));
      setAlcoholStatus("ALCOHOL DETECTED");
      setVehicleStatus("STOPPED");
      setSafetyStatus("DANGER");
    }, 5200);

    // Step 7: Buzzer/Alert Activated
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 7 }));
      setIsBuzzerActive(true);
    }, 6400);

    // Step 8: GPS Location Captured
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 8 }));
    }, 7600);

    // Step 9 & 10: Emergency SMS Generated & Sent
    setTimeout(() => {
      setDemoSequenceState(prev => ({ ...prev, currentStep: 10 }));
      const dt = getFormattedDateTime();
      const smsContent = `🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle has been stopped automatically.\nVehicle ID: ${vehicleId}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}\nTime: ${dt.full}`;
      setLastSms({
        phone: emergencyPhone,
        text: smsContent,
        timestamp: dt.full,
        status: "SENT"
      });
      setShowSmsModal(true);
    }, 8800);

    // Step 11: Incident Saved in History
    setTimeout(() => {
      const dt = getFormattedDateTime();
      setDemoSequenceState(prev => ({ ...prev, currentStep: 11 }));
      const newInc = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicle_id: vehicleId,
        type: "Alcohol Detected (Live Demo)",
        alcohol_level: 580,
        threshold: threshold,
        date: dt.date,
        time: dt.time,
        timestamp: Date.now(),
        latitude: location.latitude,
        longitude: location.longitude,
        location: location.name,
        vehicle_status: "Vehicle Stopped",
        alert_status: "SMS Sent",
        phone_number: emergencyPhone,
        sms_text: `🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle ID: ${vehicleId}`
      };
      setIncidents(prev => [newInc, ...prev]);
    }, 10000);
  };

  // Hardware Connection Toggle
  const toggleHardwareComponent = (key) => {
    setHardware(prev => {
      const updated = {
        ...prev,
        [key]: prev[key] === "CONNECTED" ? "DISCONNECTED" : "CONNECTED"
      };
      fetch('/api/hardware-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component: key, status: updated[key] })
      }).catch(() => {});
      return updated;
    });
  };

  const value = {
    vehicleId, setVehicleId,
    emergencyPhone, setEmergencyPhone,
    threshold, setThreshold,
    vehicleStatus, setVehicleStatus,
    alcoholStatus, setAlcoholStatus,
    alcoholLevel, setAlcoholLevel,
    safetyStatus, setSafetyStatus,
    stopReason, setStopReason,
    stoppedAt, setStoppedAt,
    hardware, setHardware, toggleHardwareComponent,
    location, setLocation,
    isMonitoringActive, setIsMonitoringActive,
    isBuzzerActive, setIsBuzzerActive,
    isSoundMuted, setIsSoundMuted,
    lastSms, setLastSms,
    lastAlertTime, setLastAlertTime,
    showSmsModal, setShowSmsModal,
    incidents, setIncidents,
    chartData,
    triggerAlcoholDetection,
    resetSafetySystem,
    demoSequenceState, setDemoSequenceState, runSIHDemoSequence,
    theme, setTheme, toggleTheme
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within a SystemProvider");
  return context;
};
