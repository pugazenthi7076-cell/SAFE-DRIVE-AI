import React, { useState, useMemo } from 'react';
import { useSystem } from '../context/SystemContext';
import { AlertTriangle, Search, Filter, Download, Trash2, Calendar, Car, ShieldAlert, CheckCircle2, ExternalLink, MapPin, Eye } from 'lucide-react';

export const IncidentHistoryView = () => {
  const { incidents, setIncidents } = useSystem();

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterAlertStatus, setFilterAlertStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected incident for modal detail
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Filtered dataset calculation
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      if (filterDate && !inc.date.includes(filterDate)) return false;
      if (filterVehicle !== 'ALL' && inc.vehicle_id !== filterVehicle) return false;
      if (filterType !== 'ALL' && !inc.type.toLowerCase().includes(filterType.toLowerCase())) return false;
      if (filterAlertStatus !== 'ALL' && inc.alert_status !== filterAlertStatus) return false;
      
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesId = inc.id.toLowerCase().includes(query);
        const matchesLoc = inc.location.toLowerCase().includes(query);
        const matchesPhone = inc.phone_number.includes(query);
        if (!matchesId && !matchesLoc && !matchesPhone) return false;
      }
      return true;
    });
  }, [incidents, filterDate, filterVehicle, filterType, filterAlertStatus, searchTerm]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredIncidents.length === 0) return;
    const headers = ["Incident ID", "Vehicle ID", "Incident Type", "Alcohol Level (PPM)", "Date", "Time", "Latitude", "Longitude", "Location", "Vehicle Status", "Alert Status", "Emergency Phone"];
    const rows = filteredIncidents.map(inc => [
      inc.id,
      inc.vehicle_id,
      inc.type,
      inc.alcohol_level,
      inc.date,
      inc.time,
      inc.latitude,
      inc.longitude,
      `"${inc.location}"`,
      `"${inc.vehicle_status}"`,
      `"${inc.alert_status}"`,
      `"${inc.phone_number}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vehicle_incidents_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all incident history records?")) {
      setIncidents([]);
      fetch('/api/incidents', { method: 'DELETE' }).catch(() => {});
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            Safety Incident Audit Log & Incident History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persistent log of all alcohol threshold breaches, emergency motor cutoffs, GPS tracking markers, and SMS alert logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredIncidents.length === 0}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-900/40"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearHistory}
            disabled={incidents.length === 0}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 disabled:opacity-40 text-red-400 font-semibold text-xs flex items-center gap-1.5 border border-red-800/60"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase">
          <Filter className="w-4 h-4 text-blue-400" /> Filter & Search Records:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="text"
              placeholder="Filter Date (DD-MM-YYYY)"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Vehicle Filter */}
          <div>
            <select
              value={filterVehicle}
              onChange={(e) => setFilterVehicle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Vehicles</option>
              <option value="SV-001">SV-001</option>
              <option value="SV-002">SV-002</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Incident Types</option>
              <option value="Alcohol Detected">Alcohol Detected</option>
            </select>
          </div>

          {/* Alert Status Filter */}
          <div>
            <select
              value={filterAlertStatus}
              onChange={(e) => setFilterAlertStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Alert Statuses</option>
              <option value="SMS Sent">SMS Sent</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* INCIDENTS TABLE */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Incident ID</th>
                <th className="p-4">Vehicle ID</th>
                <th className="p-4">Incident Type</th>
                <th className="p-4">Reading</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Location</th>
                <th className="p-4">Vehicle Status</th>
                <th className="p-4">Alert Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-4 font-bold text-blue-400">{inc.id}</td>
                    <td className="p-4 text-slate-300 font-bold">{inc.vehicle_id}</td>
                    <td className="p-4 text-red-400 font-sans font-semibold">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        {inc.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-300">{inc.alcohol_level} PPM</td>
                    <td className="p-4 text-slate-300 font-sans">
                      {inc.date} <span className="text-slate-500 font-mono">{inc.time}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-sans truncate max-w-[150px]">
                      {inc.location}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-sans font-bold text-[11px]">
                        {inc.vehicle_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans font-bold text-[11px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" /> {inc.alert_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-sans font-semibold text-xs border border-blue-500/30 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500 font-sans text-xs">
                    No matching incidents found in database log.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INCIDENT DETAIL DRAWER MODAL */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedIncident.id} Details</h3>
                  <p className="text-xs text-slate-400">{selectedIncident.type} Safety Record</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 text-xs"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Vehicle ID</span>
                <strong className="text-blue-400 text-sm">{selectedIncident.vehicle_id}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Alcohol Reading</span>
                <strong className="text-red-400 text-sm">{selectedIncident.alcohol_level} PPM</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Date & Time</span>
                <strong className="text-slate-200">{selectedIncident.date} {selectedIncident.time}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Registered Phone</span>
                <strong className="text-amber-300">{selectedIncident.phone_number}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">GPS Coordinates</span>
                <strong className="text-emerald-400">{selectedIncident.latitude}, {selectedIncident.longitude}</strong> ({selectedIncident.location})
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono whitespace-pre-wrap text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase font-sans block mb-1">Dispatched SMS Payload:</span>
              {selectedIncident.sms_text}
            </div>

            <div className="flex justify-end pt-2">
              <a
                href={`https://maps.google.com/?q=${selectedIncident.latitude},${selectedIncident.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-900"
              >
                <ExternalLink className="w-4 h-4" /> Open Coordinates in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
