import React from 'react';
import { useSystem } from '../context/SystemContext';
import { ShieldCheck, AlertTriangle, X } from 'lucide-react';

export const ResetConfirmModal = ({ isOpen, onClose }) => {
  const { resetSafetySystem } = useSystem();

  if (!isOpen) return null;

  const handleConfirm = () => {
    resetSafetySystem();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Reset Safety System?</h3>
              <p className="text-xs text-slate-400">System Authorization Required</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to reset the safety cutoff system? This will clear the emergency engine lock, restore the vehicle state to <strong className="text-emerald-400">RUNNING</strong>, turn off the piezo buzzer alarm, and reset the MQ-3 sensor status to <strong className="text-emerald-400">SAFE</strong>.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
