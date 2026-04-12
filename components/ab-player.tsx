'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, AlertCircle } from 'lucide-react';

interface ABPlayerProps {
  audioUrl: string | null;
  masteredUrl: string | null;
}

export default function ABPlayer({ audioUrl, masteredUrl }: ABPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<'A' | 'B'>('B');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [aReady, setAReady] = useState(false);
  const [bReady, setBReady] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isSwitching, setIsSwitching] = useState(false);

  const aRef = useRef<HTMLAudioElement | null>(null);
  const bRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const active = activeTrack === 'A' ? aRef : bRef;
  const inactive = activeTrack === 'A' ? bRef : aRef;

  // Init A (original)
  useEffect(() => {
    if (!audioUrl) return;
    const a = new Audio();
    a.crossOrigin = 'anonymous';
    a.preload = 'metadata';
    a.src = audioUrl;
    aRef.current = a;
    a.addEventListener('loadedmetadata', () => setAReady(true));
    a.addEventListener('error', () => setAReady(false));
    return () => { a.pause(); a.src = ''; };
  }, [audioUrl]);

  // Init B (mastered)
  useEffect(() => {
    if (!masteredUrl) return;
    const b = new Audio();
    b.preload = 'metadata';
    b.src = masteredUrl;
    bRef.current = b;
    b.addEventListener('loadedmetadata', () => { setBReady(true); setDuration(b.duration); });
    b.addEventListener('error', () => setBReady(false));
    return () => { b.pause(); b.src = ''; };
  }, [masteredUrl]);

  // Volume sync
  useEffect(() => {
    if (aRef.current) aRef.current.volume = volume;
    if (bRef.current) bRef.current.volume = volume;
  }, [volume]);

  // Time tracking
  useEffect(() => {
    const el = active.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration) {
        setProgress((el.currentTime / el.duration) * 100);
        setCurrentTime(el.currentTime);
      }
    };
    const onEnd = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    return () => { el.removeEventListener('timeupdate', onTime); el.removeEventListener('ended', onEnd); };
  }, [activeTrack, active]);

  // Play/pause
  useEffect(() => {
    const act = active.current;
    const inact = inactive.current;
    if (!act) return;
    if (isPlaying) act.play().catch(() => {});
    else act.pause();
    if (inact) inact.pause();
  }, [isPlaying, activeTrack, active, inactive]);

  // A/B switch
  const handleSwitch = useCallback((track: 'A' | 'B') => {
    if (track === activeTrack) return;
    setIsSwitching(true);
    const cur = active.current;
    const next = track === 'A' ? aRef.current : bRef.current;
    if (cur && next) {
      next.currentTime = cur.currentTime;
      cur.pause();
      if (isPlaying) next.play().catch(() => {});
    }
    setActiveTrack(track);
    setTimeout(() => setIsSwitching(false), 200);
  }, [activeTrack, isPlaying, active]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const el = active.current;
    if (el && el.duration) {
      el.currentTime = pct * el.duration;
      setProgress(pct * 100);
    }
  };

  const skip = (d: number) => {
    const el = active.current;
    if (el && el.duration) el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + d));
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const accentColor = activeTrack === 'B' ? '#10b981' : '#ffffff';

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#050505', border: '1px solid #1a1b1f' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1a1b1f' }}>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">A/B Comparison</span>

        {/* Track toggle */}
        <div className="flex items-center gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid #1a1b1f' }}>
          <button
            onClick={() => handleSwitch('A')}
            disabled={!aReady}
            className="relative px-6 py-2 text-[11px] font-mono uppercase tracking-wider transition-all duration-300"
            style={{
              background: activeTrack === 'A' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: !aReady ? '#2a2b2f' : activeTrack === 'A' ? '#fff' : '#4a4b4f',
            }}
          >
            A · Original
            {activeTrack === 'A' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
          </button>
          <div style={{ width: 1, height: 24, background: '#1a1b1f' }} />
          <button
            onClick={() => handleSwitch('B')}
            disabled={!bReady}
            className="relative px-6 py-2 text-[11px] font-mono uppercase tracking-wider transition-all duration-300"
            style={{
              background: activeTrack === 'B' ? 'rgba(16,185,129,0.08)' : 'transparent',
              color: !bReady ? '#2a2b2f' : activeTrack === 'B' ? '#10b981' : '#4a4b4f',
            }}
          >
            B · Mastered
            {activeTrack === 'B' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500" />}
          </button>
        </div>
      </div>

      {!aReady && audioUrl && (
        <div className="flex items-center gap-2 px-6 py-2 text-[10px] font-mono text-amber-500/70" style={{ background: 'rgba(255,170,0,0.03)' }}>
          <AlertCircle className="w-3 h-3 shrink-0" />
          Original audio unavailable (external URL may block cross-origin).
        </div>
      )}

      {/* Waveform / Progress area */}
      <div className="relative cursor-pointer group" style={{ height: 100 }} onClick={seek}>
        {/* Progress background */}
        <div
          className="absolute top-0 bottom-0 left-0 transition-all duration-100"
          style={{ width: `${progress}%`, background: `${accentColor}08` }}
        />

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-300"
            style={{ color: `${accentColor}15`, fontSize: isSwitching ? 14 : 11 }}
          >
            {activeTrack === 'B' ? 'MASTERED' : 'ORIGINAL'}
          </span>
        </div>

        {/* Grid lines */}
        {duration > 0 && Array.from({ length: Math.floor(duration / 10) }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{ left: `${((i + 1) * 10 / duration) * 100}%`, width: 1, background: '#1a1b1f' }}
          />
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none transition-all duration-75"
          style={{ left: `${progress}%`, width: 1, background: accentColor, boxShadow: `0 0 12px ${accentColor}40` }}
        >
          <div
            className="absolute -top-0 -left-[22px] text-[9px] font-mono px-1.5 py-0.5"
            style={{ background: '#050505', color: accentColor, border: `1px solid ${accentColor}30` }}
          >
            {fmt(currentTime)}
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #1a1b1f' }}>
        {/* Time */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono tabular-nums" style={{ color: accentColor }}>
            {fmt(currentTime)}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">/</span>
          <span className="text-[11px] font-mono tabular-nums text-zinc-600">
            {duration ? fmt(duration) : '0:00'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5">
          <button onClick={() => skip(-5)} className="text-zinc-600 hover:text-white transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!bReady}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-20"
            style={{ background: accentColor, color: '#050505' }}
          >
            {isPlaying
              ? <Pause className="w-4 h-4" style={{ fill: '#050505' }} />
              : <Play className="w-4 h-4 ml-0.5" style={{ fill: '#050505' }} />
            }
          </button>
          <button onClick={() => skip(5)} className="text-zinc-600 hover:text-white transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-zinc-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-zinc-500"
          />
        </div>
      </div>
    </div>
  );
}
