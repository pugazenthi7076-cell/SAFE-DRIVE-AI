import React from 'react';
import { useSystem } from '../context/SystemContext';
import { MapPin, Navigation, ExternalLink, RefreshCw, Radio, ShieldAlert } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Marker SVG to prevent Leaflet asset path resolution issues in Vite
const customMarkerIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="
      background-color: #ef4444; 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      border: 3px solid #ffffff; 
      box-shadow: 0 0 15px rgba(239,68,68,0.8);
      display: flex; 
      align-items: center; 
      justify-content: center;
      color: white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const GpsLocationView = () => {
  const { location, setLocation, vehicleId, alcoholStatus, vehicleStatus } = useSystem();

  const googleMapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;

  const handleRefreshGpsFix = () => {
    // Simulate slight jitter fix from NEO-6M satellite sync
    const newLat = Number((location.latitude + (Math.random() - 0.5) * 0.005).toFixed(5));
    const newLng = Number((location.longitude + (Math.random() - 0.5) * 0.005).toFixed(5));
    setLocation(prev => ({
      ...prev,
      latitude: newLat,
      longitude: newLng
    }));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            Live GPS Tracking & Geofencing System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            NEO-6M NMEA sentence parser receiving latitude/longitude over ESP32 UART2 (GPIO16/GPIO17).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshGpsFix}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Fix</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/40"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Latitude</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {location.latitude}° N
          </div>
          <span className="text-[11px] text-slate-500">WGS84 Format</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Longitude</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {location.longitude}° E
          </div>
          <span className="text-[11px] text-slate-500">WGS84 Format</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Location Status</span>
          <div className="text-lg font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> 3D SATELLITE FIX
          </div>
          <span className="text-[11px] text-slate-500">8 Satellites Tracked</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Address / City</span>
          <div className="text-sm font-bold text-white mt-1 truncate">
            {location.name}
          </div>
          <span className="text-[11px] text-slate-500">Tamil Nadu, India</span>
        </div>

      </div>

      {/* INTERACTIVE LEAFLET MAP CONTAINER */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Interactive Vehicle Map View</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {location.latitude}, {location.longitude}
          </span>
        </div>

        <div className="h-[450px] w-full rounded-xl overflow-hidden border border-slate-700/60 relative">
          <MapContainer 
            center={[location.latitude, location.longitude]} 
            zoom={14} 
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.latitude, location.longitude]} icon={customMarkerIcon}>
              <Popup>
                <div className="text-xs font-sans text-slate-900 p-1 space-y-1">
                  <div className="font-bold text-blue-700">{vehicleId} Location</div>
                  <div>Status: <strong>{vehicleStatus}</strong></div>
                  <div>Alcohol: <strong>{alcoholStatus}</strong></div>
                  <div className="text-[10px] text-slate-600 font-mono">{location.latitude}, {location.longitude}</div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

    </div>
  );
};
