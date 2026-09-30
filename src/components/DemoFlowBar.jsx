import React from 'react';
import { useSystem } from '../context/SystemContext';
import { CheckCircle2, Circle, ArrowRight, Play, XCircle } from 'lucide-react';

export const DemoFlowBar = () => {
  const { demoSequenceState, setDemoSequenceState } = useSystem();

  if (!demoSequenceState.isActive) return null;

  return (
    <div className="bg-slate-900/95 border-b border-blue-500/30 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            LIVE DEMONSTRATION WORKFLOW SEQUENCE
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
            Step {demoSequenceState.currentStep} of {demoSequenceState.steps.length}
          </span>
        </div>
        <button
          onClick={() => setDemoSequenceState(prev => ({ ...prev, isActive: false }))}
          className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
        >
          <XCircle className="w-4 h-4" /> Close Tracker
        </button>
      </div>

      {/* Steps Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5 overflow-x-auto pb-1">
        {demoSequenceState.steps.map((step) => {
          const isDone = demoSequenceState.currentStep >= step.id;
          const isCurrent = demoSequenceState.currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-2 rounded-lg text-[11px] font-medium border flex flex-col items-center text-center transition-all ${
                isCurrent
                  ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg shadow-blue-900/50 scale-105 animate-pulse'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span className="font-bold font-mono">#{step.id}</span>
              </div>
              <span className="line-clamp-2 leading-tight">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
