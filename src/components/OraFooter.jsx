import React, { useState } from 'react';
import { Activity, Send, Check, ShieldCheck, Heart } from 'lucide-react';

export const OraFooter = ({ setCurrentTab }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#05070a]">
      
      {/* Background Tide Glow & Sine Waves */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="tide-glow absolute inset-0 opacity-60"></div>
        <div className="grain absolute inset-0"></div>
        <svg className="absolute inset-x-0 bottom-8 w-full opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
          <path d="M0 60 C 150 20, 300 100, 450 60 S 750 20, 900 60 1200 60 1200 60" stroke="url(#footwave)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="footwave" x1="0" x2="1200" y1="0" y2="0">
              <stop stopColor="#7dd3fc" stopOpacity="0" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Newsletter & Action Callout */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400">
          ZERO-TOLERANCE VEHICLE SAFETY PLATFORM
        </p>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
          Drive with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300">future.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm sm:text-base text-slate-400">
          Smart Vehicle Safety & Alcohol Alert System — engineered for smart cities, commercial fleets, and personal transport protection.
        </p>

        {/* Email Subscribe Box */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@fleet.gov"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:bg-white/[0.06]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Dispatch Updates</span>
              )}
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-slate-500 font-mono">
          IoT telemetry data updates & firmware release notifications.
        </p>
      </div>

      {/* Massive Display Watermark */}
      <div className="pointer-events-none select-none px-5 sm:px-6" aria-hidden="true">
        <div className="mx-auto max-w-7xl text-center">
          <div className="bg-gradient-to-b from-white/[0.06] to-transparent bg-clip-text font-display text-[16vw] font-black leading-[0.75] tracking-[-0.04em] text-transparent">
            SAFEDRIVE
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>© 2026 Safe Drive AI • Ora Swiss Viewport Edition. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider">
            <span>Powered by ESP32 + MQ-3 + NEO-6M</span>
            <span>•</span>
            <span className="text-sky-400">Scrolltide Aesthetic</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
