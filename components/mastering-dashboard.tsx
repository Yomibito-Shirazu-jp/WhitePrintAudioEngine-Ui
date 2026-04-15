'use client';

import { useState } from 'react';
import type { MasteringResult } from '@/types/mastering';
import type { DeliberationOutput } from '@/types/deliberation';
import type { AnalysisResult } from '@/types/audio';
import { motion } from 'framer-motion';
import { Download, Zap, CheckCircle2, Activity, Volume2, Maximize, ThumbsUp, ThumbsDown, Share2, Check, Music, Gauge, Users, ChevronDown, ChevronRight } from 'lucide-react';
import ABPlayer from './ab-player';

interface MasteringDashboardProps {
  data: MasteringResult;
  audioUrl: string | null;
  onReset?: () => void;
  deliberation?: DeliberationOutput | null;
  analysis?: AnalysisResult | null;
}

export default function MasteringDashboard({ data, audioUrl, onReset, deliberation, analysis }: MasteringDashboardProps) {
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDelibDetail, setShowDelibDetail] = useState(false);

  if (!data) return null;
  const metrics = data?.metrics ?? {} as any;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'WhitePrint Mastered Track', url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Clipboard API not available');
        }
      } catch (err) {
        // Fallback for missing permissions or non-secure contexts
        try {
          const input = document.createElement('input');
          input.value = shareUrl;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error('Failed to copy', e);
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 pb-24">
      {/* Top bar: title + actions */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-mono font-bold text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-400" />
            MASTERING_COMPLETE
          </h2>
          {onReset && (
            <button onClick={onReset} className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors uppercase border border-zinc-800 rounded px-2 py-1 bg-zinc-900/50">
              [ New_Session ]
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Rating */}
          <div className="flex items-center gap-1 border border-zinc-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setRating(rating === 'good' ? null : 'good')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors ${
                rating === 'good' ? 'bg-emerald-600/20 text-emerald-400' : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-5 bg-zinc-800" />
            <button
              onClick={() => setRating(rating === 'bad' ? null : 'bad')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors ${
                rating === 'bad' ? 'bg-red-600/20 text-red-400' : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-900'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Share'}
          </button>

          {/* Download */}
          <a
            href={data.download_url}
            download="mastered-track.wav"
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* A/B Player — TOP */}
        <ABPlayer audioUrl={audioUrl} masteredUrl={data.download_url} />

        {/* Status Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-400">Processing Successful</h3>
            <p className="text-xs text-emerald-400/70 mt-0.5">
              Engine {metrics.engine_version} · {metrics.convergence_loops} convergence loops · {metrics.gain_adjustment_db > 0 ? '+' : ''}{metrics.gain_adjustment_db} dB gain
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ComparisonBox
            label="Integrated LUFS"
            before={`${metrics.lufs_before}`}
            after={`${metrics.lufs_after}`}
            target={`${metrics.target_lufs}`}
            unit="LUFS"
            icon={<Volume2 className="w-3.5 h-3.5" />}
          />
          <ComparisonBox
            label="True Peak"
            before={`${metrics.true_peak_before}`}
            after={`${metrics.true_peak_after}`}
            target={`${metrics.target_true_peak}`}
            unit="dBTP"
            icon={<Maximize className="w-3.5 h-3.5" />}
          />
          <MetricBox
            label="Dynamic Range"
            value={`${metrics.dynamic_range_after}`}
            unit="dB"
            icon={<Activity className="w-3.5 h-3.5" />}
          />
          <MetricBox
            label="Gain Adjust"
            value={`${metrics.gain_adjustment_db > 0 ? '+' : ''}${metrics.gain_adjustment_db}`}
            unit="dB"
            icon={<Zap className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Analysis info (if available) */}
        {analysis && (
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/50 overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <Music className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">Track Analysis</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-px" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {analysis.track_identity?.bpm && (
                <AnalysisCell label="BPM" value={Math.round(analysis.track_identity.bpm).toString()} />
              )}
              {analysis.track_identity?.key && (
                <AnalysisCell label="Key" value={analysis.track_identity.key} />
              )}
              {analysis.track_identity?.duration_sec && (
                <AnalysisCell label="Duration" value={`${Math.floor(analysis.track_identity.duration_sec / 60)}:${Math.floor(analysis.track_identity.duration_sec % 60).toString().padStart(2, '0')}`} />
              )}
              {analysis.track_identity?.sample_rate && (
                <AnalysisCell label="Sample Rate" value={`${analysis.track_identity.sample_rate / 1000}kHz`} />
              )}
              {analysis.track_identity?.bit_depth && (
                <AnalysisCell label="Bit Depth" value={`${analysis.track_identity.bit_depth}-bit`} />
              )}
              {analysis.whole_track_metrics?.integrated_lufs != null && (
                <AnalysisCell label="Original LUFS" value={analysis.whole_track_metrics.integrated_lufs.toFixed(1)} />
              )}
            </div>
          </div>
        )}

        {/* Deliberation Results (if available) */}
        {deliberation && (
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/50 overflow-hidden">
            <button
              onClick={() => setShowDelibDetail(!showDelibDetail)}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
              style={{ borderBottom: showDelibDetail ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">AI Deliberation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Score: {(deliberation.deliberation_score * 100).toFixed(0)}%
                </span>
              </div>
              {showDelibDetail ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
            </button>

            {showDelibDetail && (
              <div className="p-5 space-y-5">
                {/* Score breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(deliberation.deliberation_score_detail || {}).map(([key, val]) => (
                    <div key={key} className="text-center p-3 rounded-lg bg-zinc-900/50">
                      <div className="text-lg font-mono font-bold text-white">{((val as number) * 100).toFixed(0)}%</div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Agent opinions */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Agent Opinions</h4>
                  {deliberation.opinions?.map((opinion, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-200">{opinion.agent_name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{opinion.provider}/{opinion.model}</span>
                          {opinion.is_fallback && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">FALLBACK</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                          <span>Confidence: <strong className="text-zinc-300">{(opinion.confidence * 100).toFixed(0)}%</strong></span>
                          <span>{opinion.latency_ms}ms</span>
                        </div>
                      </div>
                      {opinion.rationale && (
                        <p className="text-xs text-zinc-400 leading-relaxed">{opinion.rationale}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Adopted params summary */}
                <div>
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Adopted Parameters</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {Object.entries(deliberation.adopted_params || {}).map(([key, val]) => (
                      <div key={key} className="p-2 rounded bg-zinc-900/50 border border-zinc-800/30">
                        <div className="text-[10px] font-mono text-zinc-500 truncate">{key.replace(/_/g, ' ')}</div>
                        <div className="text-xs font-mono font-bold text-zinc-200 mt-0.5">
                          {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(3)) : String(val)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Runtime info */}
                <div className="flex flex-wrap gap-4 text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/30">
                  <span>Strategy: {deliberation.merge_strategy}</span>
                  <span>Runtime: {deliberation.runtime_ms}ms</span>
                  <span>Tokens: {deliberation.token_usage?.total_tokens?.toLocaleString()}</span>
                  <span>Sages: {Object.keys(deliberation.active_sages || {}).length}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ComparisonBox({ label, before, after, target, unit, icon }: { label: string; before: string; after: string; target: string; unit: string; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4">
      <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        {icon} {label}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-mono text-zinc-500">{before}</span>
        <span className="text-zinc-600">→</span>
        <span className="text-lg font-mono font-bold text-emerald-400">{after}</span>
        <span className="text-[10px] font-mono text-zinc-500">{unit}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-zinc-800/30 flex justify-between text-[10px] font-mono">
        <span className="text-zinc-600">TARGET</span>
        <span className="text-zinc-400">{target} {unit}</span>
      </div>
    </div>
  );
}

function MetricBox({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4">
      <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        {icon} {label}
      </h3>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-mono font-bold text-zinc-100">{value}</span>
        <span className="text-[10px] font-mono text-zinc-500">{unit}</span>
      </div>
    </div>
  );
}

function AnalysisCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-950 p-3 text-center">
      <div className="text-sm font-mono font-bold text-zinc-200">{value}</div>
      <div className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">{label}</div>
    </div>
  );
}
