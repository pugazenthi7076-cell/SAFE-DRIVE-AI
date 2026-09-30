import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Smartphone, Send, CheckCircle2, Copy, ExternalLink, X, MessageSquare } from 'lucide-react';

export const SmsModal = () => {
  const { showSmsModal, setShowSmsModal, lastSms, emergencyPhone } = useSystem();
  const [copied, setCopied] = React.useState(false);

  if (!showSmsModal || !lastSms) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(lastSms.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract maps link from SMS text
  const matchLink = lastSms.text.match(/https:\/\/maps\.google\.com\/\?q=[\d.,]+/);
  const mapsUrl = matchLink ? matchLink[0] : `https://maps.google.com/?q=${lastSms.latitude || 11.0168},${lastSms.longitude || 76.9558}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Smartphone Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-xl text-blue-400 border border-blue-400/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">SIM800L GSM SMS Dispatch</h3>
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SMS SENT
                </span>
              </div>
              <p className="text-xs text-slate-300">
                To Registered Contact: <span className="font-mono text-amber-300 font-bold">{lastSms.phone || emergencyPhone}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSmsModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smartphone SMS Chat Screen Simulation */}
        <div className="p-5 bg-slate-950">
          <div className="text-center text-[11px] font-mono text-slate-500 mb-3">
            Today, {lastSms.timestamp} • Sent via GSM SIM800L Module
          </div>

          {/* SMS Bubble */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/30 shadow-lg text-slate-100 text-xs font-mono space-y-2 whitespace-pre-wrap leading-relaxed">
            {lastSms.text}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{copied ? 'Copied!' : 'Copy SMS Text'}</span>
            </button>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-900"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Google Maps</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setShowSmsModal(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
