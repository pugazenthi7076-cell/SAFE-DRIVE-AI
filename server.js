import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

// MongoDB Connection URI (Accepts env or defaults to local MongoDB on port 27017)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/safedrive';
let isMongoConnected = false;

// Initial default state
const initialState = {
  settings: {
    vehicle_id: "SV-001",
    emergency_phone: "+91 9876543210",
    threshold: 300,
    monitoring_active: true,
    buzzer_enabled: true,
    auto_sms_enabled: true
  },
  hardware: {
    esp32: "CONNECTED",
    mq3: "CONNECTED",
    gps: "CONNECTED",
    gsm: "CONNECTED",
    motor: "CONNECTED"
  },
  telemetry: {
    vehicle_status: "RUNNING", // RUNNING or STOPPED
    alcohol_status: "SAFE",   // SAFE or ALCOHOL DETECTED
    alcohol_level: 120,
    safety_status: "SAFE",    // SAFE or DANGER
    latitude: 11.0168,
    longitude: 76.9558,
    location_name: "Coimbatore, Tamil Nadu, India",
    last_alert_time: null,
    buzzer_active: false,
    stop_reason: null,
    stopped_at: null
  },
  last_sms: null,
  incidents: [
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
  ]
};

// ============================================
// MONGOOSE SCHEMAS & MODELS
// ============================================

const IncidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicle_id: String,
  type: String,
  alcohol_level: Number,
  threshold: Number,
  date: String,
  time: String,
  timestamp: Number,
  latitude: Number,
  longitude: Number,
  location: String,
  vehicle_status: String,
  alert_status: String,
  phone_number: String,
  sms_text: String
}, { timestamps: true });

const Incident = mongoose.model('Incident', IncidentSchema);

const SystemStateSchema = new mongoose.Schema({
  key: { type: String, default: 'global_state', unique: true },
  settings: Object,
  hardware: Object,
  telemetry: Object,
  last_sms: Object
}, { timestamps: true });

const SystemState = mongoose.model('SystemState', SystemStateSchema);

// Database utility functions
function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading db.json, returning initial state", err);
  }
  return initialState;
}

// In-memory data holder initialized from db.json
let currentData = loadData();

async function syncWithMongo() {
  if (!isMongoConnected) return;
  try {
    // 1. Update State
    await SystemState.findOneAndUpdate(
      { key: 'global_state' },
      {
        key: 'global_state',
        settings: currentData.settings,
        hardware: currentData.hardware,
        telemetry: currentData.telemetry,
        last_sms: currentData.last_sms
      },
      { upsert: true, returnDocument: 'after' }
    );

    // 2. Sync any new incidents
    if (currentData.incidents && currentData.incidents.length > 0) {
      for (const inc of currentData.incidents) {
        await Incident.findOneAndUpdate({ id: inc.id }, inc, { upsert: true });
      }
    }
  } catch (err) {
    console.error("[MONGODB] Sync error:", err.message);
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing db.json", err);
  }
  // Also asynchronously sync to MongoDB
  syncWithMongo();
}

// Helper to construct SMS content
function createSmsContent(vehicleId, lat, lng, timeStr) {
  return `🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle has been stopped automatically.\nVehicle ID: ${vehicleId}\nLocation: https://maps.google.com/?q=${lat},${lng}\nTime: ${timeStr}`;
}

// Format Date string
function formatCurrentDateTime() {
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
}

// Core Trigger Safety Incident Logic
function triggerSafetyIncident(alcoholLevel, customLat = null, customLng = null, reason = "MQ-3 Sensor Threshold Exceeded") {
  const dt = formatCurrentDateTime();
  const lat = customLat || currentData.telemetry.latitude;
  const lng = customLng || currentData.telemetry.longitude;
  
  // 1. Update Telemetry
  currentData.telemetry.alcohol_level = alcoholLevel;
  currentData.telemetry.alcohol_status = "ALCOHOL DETECTED";
  currentData.telemetry.vehicle_status = "STOPPED";
  currentData.telemetry.safety_status = "DANGER";
  currentData.telemetry.last_alert_time = dt.full;
  currentData.telemetry.buzzer_active = true;
  currentData.telemetry.stop_reason = reason;
  currentData.telemetry.stopped_at = dt.full;
  currentData.telemetry.latitude = lat;
  currentData.telemetry.longitude = lng;

  // 2. Build SMS
  const smsText = createSmsContent(currentData.settings.vehicle_id, lat, lng, dt.full);
  const smsObj = {
    phone: currentData.settings.emergency_phone,
    text: smsText,
    timestamp: dt.full,
    status: "SENT"
  };
  currentData.last_sms = smsObj;

  // 3. Create Incident Record
  const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
  const newIncident = {
    id: incidentId,
    vehicle_id: currentData.settings.vehicle_id,
    type: "Alcohol Detected",
    alcohol_level: alcoholLevel,
    threshold: currentData.settings.threshold,
    date: dt.date,
    time: dt.time,
    timestamp: Date.now(),
    latitude: lat,
    longitude: lng,
    location: currentData.telemetry.location_name,
    vehicle_status: "Vehicle Stopped",
    alert_status: "SMS Sent",
    phone_number: currentData.settings.emergency_phone,
    sms_text: smsText
  };

  currentData.incidents.unshift(newIncident);
  saveData(currentData);
  return { newIncident, smsObj };
}

// RESET Safety Logic
function resetSafetySystem() {
  currentData.telemetry.vehicle_status = "RUNNING";
  currentData.telemetry.alcohol_status = "SAFE";
  currentData.telemetry.alcohol_level = 110;
  currentData.telemetry.safety_status = "SAFE";
  currentData.telemetry.buzzer_active = false;
  currentData.telemetry.stop_reason = null;
  currentData.telemetry.stopped_at = null;
  saveData(currentData);
  return currentData;
}

// ---------------- API ENDPOINTS ----------------

// Database Status Endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: isMongoConnected,
    database: isMongoConnected ? 'MongoDB' : 'Local JSON Fallback',
    uri: isMongoConnected ? MONGO_URI.replace(/\/\/.*@/, '//***@') : null,
    incidents_count: currentData.incidents.length
  });
});

// 1. Get System Status & Full Telemetry
app.get('/api/status', (req, res) => {
  res.json({
    settings: currentData.settings,
    hardware: currentData.hardware,
    telemetry: currentData.telemetry,
    last_sms: currentData.last_sms,
    total_incidents: currentData.incidents.length,
    database_connected: isMongoConnected
  });
});

// 2. Real Hardware Telemetry Ingestion Endpoint for ESP32
app.post('/api/telemetry', (req, res) => {
  const { vehicle_id, alcohol_level, alcohol_detected, vehicle_status, latitude, longitude, gps_status, gsm_status } = req.body;
  
  console.log(`[ESP32 TELEMETRY] Received data from ${vehicle_id || 'ESP32'}:`, req.body);

  if (vehicle_id) currentData.settings.vehicle_id = vehicle_id;
  if (latitude) currentData.telemetry.latitude = Number(latitude);
  if (longitude) currentData.telemetry.longitude = Number(longitude);
  if (gps_status) currentData.hardware.gps = gps_status;
  if (gsm_status) currentData.hardware.gsm = gsm_status;

  const reading = Number(alcohol_level) || 0;
  const isAlcohol = alcohol_detected === true || reading >= currentData.settings.threshold;

  if (isAlcohol && currentData.telemetry.vehicle_status !== "STOPPED") {
    triggerSafetyIncident(reading, latitude, longitude, "ESP32 Alcohol Detection Event");
  } else if (!isAlcohol && currentData.telemetry.alcohol_status !== "ALCOHOL DETECTED") {
    currentData.telemetry.alcohol_level = reading;
    currentData.telemetry.alcohol_status = "SAFE";
  }

  saveData(currentData);
  res.json({
    success: true,
    server_time: new Date().toISOString(),
    system_status: currentData.telemetry.vehicle_status,
    action_taken: isAlcohol ? "VEHICLE_STOPPED_ALARM_ACTIVATED" : "NORMAL_MONITORING"
  });
});

// 3. Settings API
app.post('/api/settings', (req, res) => {
  const { emergency_phone, threshold, vehicle_id, monitoring_active, buzzer_enabled, auto_sms_enabled } = req.body;
  if (emergency_phone !== undefined) currentData.settings.emergency_phone = emergency_phone;
  if (threshold !== undefined) currentData.settings.threshold = Number(threshold);
  if (vehicle_id !== undefined) currentData.settings.vehicle_id = vehicle_id;
  if (monitoring_active !== undefined) currentData.settings.monitoring_active = Boolean(monitoring_active);
  if (buzzer_enabled !== undefined) currentData.settings.buzzer_enabled = Boolean(buzzer_enabled);
  if (auto_sms_enabled !== undefined) currentData.settings.auto_sms_enabled = Boolean(auto_sms_enabled);

  saveData(currentData);
  res.json({ success: true, settings: currentData.settings });
});

// 4. Incident Logs API
app.get('/api/incidents', (req, res) => {
  res.json({ incidents: currentData.incidents });
});

// Clear Incidents API
app.delete('/api/incidents', async (req, res) => {
  currentData.incidents = [];
  saveData(currentData);
  if (isMongoConnected) {
    try {
      await Incident.deleteMany({});
    } catch (e) {
      console.error("Error clearing Mongo incidents:", e);
    }
  }
  res.json({ success: true, message: "Incident history cleared" });
});

// 5. Reset Safety System API
app.post('/api/reset', (req, res) => {
  resetSafetySystem();
  res.json({ success: true, telemetry: currentData.telemetry });
});

// 6. Simulation Trigger API
app.post('/api/simulate', (req, res) => {
  const { action, val, lat, lng } = req.body;

  if (action === "SAFE") {
    resetSafetySystem();
  } else if (action === "ALCOHOL_DETECTED") {
    const reading = Number(val) || 540;
    triggerSafetyIncident(reading, lat || 11.0168, lng || 76.9558, "Simulated MQ-3 Spike");
  } else if (action === "VEHICLE_STOP") {
    currentData.telemetry.vehicle_status = "STOPPED";
    currentData.telemetry.stop_reason = "Manual Engine Cut Simulation";
    currentData.telemetry.stopped_at = formatCurrentDateTime().full;
  } else if (action === "GPS_ALERT") {
    const randomLat = 11.0168 + (Math.random() - 0.5) * 0.04;
    const randomLng = 76.9558 + (Math.random() - 0.5) * 0.04;
    currentData.telemetry.latitude = Number(randomLat.toFixed(5));
    currentData.telemetry.longitude = Number(randomLng.toFixed(5));
    currentData.hardware.gps = "CONNECTED";
  } else if (action === "SMS_ALERT") {
    const dt = formatCurrentDateTime();
    const smsText = createSmsContent(currentData.settings.vehicle_id, currentData.telemetry.latitude, currentData.telemetry.longitude, dt.full);
    currentData.last_sms = {
      phone: currentData.settings.emergency_phone,
      text: smsText,
      timestamp: dt.full,
      status: "SENT"
    };
  }

  saveData(currentData);
  res.json({ success: true, telemetry: currentData.telemetry, last_sms: currentData.last_sms, incidents: currentData.incidents });
});

// 7. Hardware Toggle Simulation API
app.post('/api/hardware-toggle', (req, res) => {
  const { component, status } = req.body;
  if (currentData.hardware[component] !== undefined) {
    currentData.hardware[component] = status; // CONNECTED or DISCONNECTED
    saveData(currentData);
  }
  res.json({ success: true, hardware: currentData.hardware });
});

// Initialize MongoDB connection and start server
mongoose.connect(MONGO_URI)
  .then(async () => {
    isMongoConnected = true;
    console.log(`[MONGODB] Connected successfully to ${MONGO_URI}`);
    
    // Seed or pull initial state
    try {
      const existingState = await SystemState.findOne({ key: 'global_state' });
      if (existingState && existingState.settings) {
        currentData.settings = existingState.settings;
        currentData.hardware = existingState.hardware || currentData.hardware;
        currentData.telemetry = existingState.telemetry || currentData.telemetry;
        currentData.last_sms = existingState.last_sms || currentData.last_sms;
      } else {
        await syncWithMongo();
      }

      const mongoIncidents = await Incident.find({}).sort({ timestamp: -1 }).limit(100);
      if (mongoIncidents && mongoIncidents.length > 0) {
        currentData.incidents = mongoIncidents.map(doc => doc.toObject());
      } else {
        await syncWithMongo();
      }
    } catch (seedErr) {
      console.error("[MONGODB] Seed / pull error:", seedErr.message);
    }
  })
  .catch((err) => {
    console.warn(`[MONGODB] Connection warning: ${err.message}. Running with db.json fallback.`);
  });

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Smart Vehicle Safety & Alcohol Alert System Server`);
  console.log(` Express API server listening on http://localhost:${PORT}`);
  console.log(` MongoDB: ${MONGO_URI}`);
  console.log(` Hardware POST URL for ESP32: http://<YOUR_IP>:${PORT}/api/telemetry`);
  console.log(`=======================================================`);
});
