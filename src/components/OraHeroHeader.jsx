import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { Play, Heart, Link, Check, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export const OraHeroHeader = ({ onScrollToViewport }) => {
  const { runSIHDemoSequence, demoSequenceState, vehicleId } = useSystem();
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const stackPills = [
    'landing',
    'canvas',
    'scrub',
    'luxury',
    'editorial',
    'dark',
    'react 19',
    'vite',
    'esp32 dual-core',
    'mq-3 alcohol',
    'neo-6m gps',
    'sim800l gsm'
  ];

  return (
    <div className="relative pt-8 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Background Tide Glow Effect */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 tide-glow opacity-80 -z-10 blur-2xl"></div>

      {/* Breadcrumb Navigation */}
      <nav className="text-sm font-mono text-slate-500 flex items-center gap-2" aria-label="Breadcrumb">
        <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Templates</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Ora</span>
        <span className="text-slate-600">/</span>
        <span className="text-sky-400 font-semibold">Safe Drive AI</span>
      </nav>

      {/* Header Tags & Category Badges */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-400 font-mono uppercase tracking-wider">
          Landing Page
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-400 font-mono uppercase tracking-wider">
          IoT Telematics
        </span>
        <span className="ora-badge-premium">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Premium</span>
        </span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Prototype • {vehicleId}</span>
        </span>
      </div>

      {/* Main Title */}
      <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-white leading-[1.02]">
        Ora <span className="text-slate-500 font-light">·</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-300">Safe Drive AI</span>
      </h1>

      {/* Subtitle Description */}
      <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-400 leading-relaxed font-light">
        A Geneva-grade vehicle safety interlock storefront built on a real-time IoT telemetric frame: 
        240Hz sensor polling, MQ-3 alcohol ignition cut-off, NEO-6M orbital GPS tracking, and SIM800L emergency GSM dispatch — framed inside the iconic Ora Swiss viewport with no animation library bloat.
      </p>

      {/* Action Row matching Ora exactly */}
      <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
        
        {/* Primary Bone Pill CTA */}
        <button
          onClick={onScrollToViewport}
          className="ora-pill-bone px-7 py-3 text-sm font-semibold inline-flex items-center gap-2 group cursor-pointer"
        >
          <span>Launch Telemetry Engine</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>

        {/* SIH Demo Flow Video / Sequence Button */}
        <button
          onClick={runSIHDemoSequence}
          disabled={demoSequenceState.isRunning}
          className="group relative inline-flex items-center gap-3 rounded-full border border-sky-400/30 bg-sky-500/[0.08] hover:bg-sky-500/[0.14] hover:border-sky-400/60 px-5 py-2.5 transition-all text-left"
        >
          <span className="grid shrink-0 place-items-center rounded-full h-8 w-8 bg-sky-400 text-black group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          </span>
          <div className="flex flex-col leading-tight pr-1">
            <span className="font-semibold text-white text-xs">
              {demoSequenceState.isRunning ? `Demo: Step ${demoSequenceState.currentStep}/6` : 'Why Safe Drive AI?'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {demoSequenceState.isRunning ? 'Executing test flow...' : '3 min 35 sec live demo'}
            </span>
          </div>
          <span className="text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 transform">→</span>
        </button>

        {/* Favorite Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`grid h-10 w-10 place-items-center rounded-full border transition-all cursor-pointer ${
            isLiked 
              ? 'border-red-500/50 bg-red-500/10 text-red-400' 
              : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
          }`}
          title="Save to favorites"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Share Link Button */}
        <button
          onClick={handleShare}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white transition-all cursor-pointer"
          title="Copy frame link"
        >
          {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link className="h-4 w-4" />}
        </button>
      </div>

      {/* Tech Stack Tags Row */}
      <div className="mt-8 flex flex-wrap gap-2">
        {stackPills.map((tag) => (
          <span key={tag} className="ora-tag">
            {tag}
          </span>
        ))}
      </div>

    </div>
  );
};
