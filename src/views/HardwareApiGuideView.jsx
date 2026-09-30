import React, { useState } from 'react';
import { Cpu, Code, Copy, CheckCircle2, Terminal, Radio, Server } from 'lucide-react';

export const HardwareApiGuideView = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const sampleJson = `{
  "vehicle_id": "SV-001",
  "alcohol_level": 520,
  "alcohol_detected": true,
  "vehicle_status": "STOPPED",
  "latitude": 11.0168,
  "longitude": 76.9558,
  "gps_status": "CONNECTED"
}`;

  const curlCommand = `curl -X POST http://localhost:5000/api/telemetry \\
  -H "Content-Type: application/json" \\
  -d '${sampleJson.replace(/\n/g, '')}'`;

  const arduinoCode = `// ESP32 Smart Vehicle Safety & Alcohol Alert System
// Real Hardware Integration C++ Code for Smart India Hackathon

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server Telemetry Endpoint URL (Replace with your Laptop / Server IP)
const char* serverUrl = "http://192.168.1.100:5000/api/telemetry";

// Hardware Pin Definitions
const int MQ3_PIN = 34;       // MQ-3 Analog ADC Pin
const int RELAY_PIN = 23;     // Motor Cutoff Relay Pin
const int BUZZER_PIN = 18;    // Piezo Alarm Buzzer Pin

const int THRESHOLD = 300;    // Configured Safety Limit

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  digitalWrite(RELAY_PIN, HIGH); // Relay Closed (Vehicle Engine Running)
  digitalWrite(BUZZER_PIN, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
}

void loop() {
  int alcoholValue = analogRead(MQ3_PIN);
  bool isAlcoholDetected = alcoholValue >= THRESHOLD;
  
  if (isAlcoholDetected) {
    digitalWrite(RELAY_PIN, LOW);   // CUT OFF MOTOR IGNITION RELAY
    digitalWrite(BUZZER_PIN, HIGH); // ACTIVATE ALARM BUZZER
  } else {
    digitalWrite(RELAY_PIN, HIGH);  // MOTOR RUNNING
    digitalWrite(BUZZER_PIN, LOW);
  }

  // Send Telemetry POST Request to Web Application
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["vehicle_id"] = "SV-001";
    doc["alcohol_level"] = alcoholValue;
    doc["alcohol_detected"] = isAlcoholDetected;
    doc["vehicle_status"] = isAlcoholDetected ? "STOPPED" : "RUNNING";
    doc["latitude"] = 11.0168;
    doc["longitude"] = 76.9558;
    doc["gps_status"] = "CONNECTED";

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);
    
    http.end();
  }

  delay(3000); // Poll every 3 seconds
}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            ESP32 Microcontroller Hardware API & Integration Guide
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete documentation and ready-to-flash Arduino C++ firmware for connecting real ESP32 hardware to this dashboard.
          </p>
        </div>
      </div>

      {/* API SPECIFICATION CARD */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-400" />
          HTTP REST Telemetry Payload Spec (Requirement #13)
        </h3>
        
        <p className="text-xs text-slate-300">
          The application exposes <code className="text-cyan-400 font-mono">POST /api/telemetry</code> to ingest real-time sensor measurements:
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre>{sampleJson}</pre>
        </div>
      </div>

      {/* cURL TEST COMMAND */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            Terminal cURL Test Command
          </h3>
          <button
            onClick={() => copyToClipboard(curlCommand, 'curl')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            {copiedCurl ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedCurl ? 'Copied cURL!' : 'Copy Command'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
          <code>{curlCommand}</code>
        </div>
      </div>

      {/* COMPLETE ARDUINO ESP32 CODE SNIPPET */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            ESP32 Arduino C++ Firmware (Copy & Flash to ESP32 Board)
          </h3>
          <button
            onClick={() => copyToClipboard(arduinoCode, 'code')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/40"
          >
            {copiedCode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Copied C++ Code!' : 'Copy ESP32 Firmware Code'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto max-h-96">
          <pre>{arduinoCode}</pre>
        </div>
      </div>

    </div>
  );
};
