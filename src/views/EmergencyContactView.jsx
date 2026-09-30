import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { PhoneCall, Send, Edit3, Save, Trash2, CheckCircle2, Shield, MessageSquare, ExternalLink } from 'lucide-react';

export const EmergencyContactView = () => {
  const { emergencyPhone, setEmergencyPhone, lastSms, setLastSms, setShowSmsModal, location, vehicleId } = useSystem();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhone, setTempPhone] = useState(emergencyPhone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePhone = (e) => {
    e.preventDefault();
    if (!tempPhone.trim()) return;
    setEmergencyPhone(tempPhone.trim());
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    // Sync to backend
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emergency_phone: tempPhone.trim() })
    }).catch(() => {});
  };

  const handleTestSms = () => {
    const now = new Date();
    const dtStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    const smsContent = `🚨 SAFETY ALERT\nAlcohol detected in vehicle.\nVehicle has been stopped automatically.\nVehicle ID: ${vehicleId}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}\nTime: ${dtStr}`;
    
    setLastSms({
      phone: emergencyPhone,
      text: smsContent,
      timestamp: dtStr,
      status: "SENT"
    });
    setShowSmsModal(true);
  };

  const handleDeletePhone = () => {
    if (window.confirm("Are you sure you want to clear the registered emergency contact number?")) {
      setEmergencyPhone("+91 ");
      setTempPhone("+91 ");
      setIsEditing(true);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-amber-400" />
            Registered Emergency Contact & GSM Dispatcher
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure the emergency mobile phone number registered to receive immediate SMS alerts via SIM800L module.
          </p>
        </div>

        <button
          onClick={handleTestSms}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Test Emergency SMS Dispatch</span>
        </button>
      </div>

      {/* EMERGENCY CONTACT DISPLAY & EDIT CARD */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Registered Administrator Emergency Number
          </h3>
          {saveSuccess && (
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Updated Successfully!
            </span>
          )}
        </div>

        {!isEditing ? (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Current Contact Number</span>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                Emergency Contact: {emergencyPhone}
              </div>
              <p className="text-xs text-slate-400 mt-1">SMS alerts will be automatically routed to this number upon threshold violation.</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { setTempPhone(emergencyPhone); setIsEditing(true); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Edit Number</span>
              </button>

              <button
                onClick={handleDeletePhone}
                className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 font-semibold text-xs flex items-center gap-1.5 border border-red-800/60"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePhone} className="p-6 rounded-xl bg-slate-900 border border-blue-500/40 space-y-4">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              Enter New Registered Mobile Number (Include +91 for India):
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base focus:outline-none focus:border-blue-500"
                required
              />
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

      </div>

      {/* RECENT SMS DISPATCH LOG CARD */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          GSM SMS Dispatch History Log
        </h3>

        {lastSms ? (
          <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Recipient: <strong className="text-amber-300 font-mono">{lastSms.phone}</strong></span>
              <span className="font-mono text-emerald-400 font-bold">Status: {lastSms.status}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 whitespace-pre-wrap border border-slate-800">
              {lastSms.text}
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Timestamp: {lastSms.timestamp}</span>
              <button
                onClick={() => setShowSmsModal(true)}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> View Smartphone Preview
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800">
            No SMS alerts dispatched yet. Click "Test Emergency SMS Dispatch" above to trigger a demo SMS.
          </div>
        )}
      </div>

    </div>
  );
};
