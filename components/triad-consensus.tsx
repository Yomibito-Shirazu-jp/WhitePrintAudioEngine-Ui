'use client';

import { BrainCircuit, AlertCircle, Scale, CheckCircle2 } from 'lucide-react';
import type { DeliberationOutput } from '@/types/deliberation';

interface TriadConsensusProps {
  data: DeliberationOutput;
}

export default function TriadConsensus({ data }: TriadConsensusProps) {
  if (!data) return null;
  const summary = (data as any).trivium_summary || 'Deliberation completed.';
  const score = data.deliberation_score_detail ?? { global: 0.5, dynamics: 0.5, tone: 0.5, stereo: 0.5, saturation: 0.5 };

  const categories = [
    { name: 'Dynamics', score: score.dynamics },
    { name: 'Tone', score: score.tone },
    { name: 'Stereo Image', score: score.stereo },
    { name: 'Harmonics', score: score.saturation },
  ];

  const conflict = categories.reduce((min, curr) => (curr.score < min.score ? curr : min), categories[0]);

  return (
    <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-widest">THE TRIAD CONSENSUS</h2>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Physics × Structure × Aesthetics</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5 relative z-10">
        <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-indigo-500 pl-4 italic">
          &ldquo;{summary}&rdquo;
        </p>
      </div>

      {/* Conflict + Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="p-4 bg-zinc-800/50 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider">PRIMARY CONFLICT</span>
          </div>
          <p className="text-sm text-zinc-200 font-medium mb-1">{conflict.name}</p>
          <p className="text-xs text-zinc-500">
            AI alignment: <span className="text-red-300 font-mono">{(conflict.score * 100).toFixed(0)}%</span>
          </p>
        </div>

        <div className="p-4 bg-zinc-800/50 rounded-lg border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <Scale className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider">RESOLUTION</span>
          </div>
          <p className="text-sm text-zinc-200 font-medium mb-1">Weighted Median Merge</p>
          <p className="text-xs text-zinc-500">
            LOGICA mediated GRAMMATICA&apos;s constraints and RHETORICA&apos;s vision via confidence-weighted consensus.
          </p>
        </div>
      </div>

      {/* Global Alignment */}
      <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] text-zinc-500 font-mono">GLOBAL ALIGNMENT</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-40 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{ width: `${(score.global || 0) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {((score.global || 0) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
