'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, AlertCircle } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [aPeaks, setAPeaks] = useState<Float32Array | null>(null);
  const [bPeaks, setBPeaks] = useState<Float32Array | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const aRef = useRef<HTMLAudioElement | null>(null);
  const bRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const active = activeTrack === 'A' ? aRef : bRef;
  const inactive = activeTrack === 'A' ? bRef : aRef;
  const activePeaks = activeTrack === 'A' ? aPeaks : bPeaks;

  // Extract waveform peaks from audio URL
  const extractPeaks = useCallback(async (url: string, setCb: (p: Float32Array) => void) => {
    try {
      const audioCtx = new AudioContext();
      const response = await fetch(url);
      if (!response.ok) return;
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const numBars = 200;
      const blockSize = Math.floor(channelData.length / numBars);
      const peaks = new Float32Array(numBars);
      for (let i = 0; i < numBars; i++) {
        let sum = 0;
        const start = i * blockSize;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(channelData[start + j]);
        }
        peaks[i] = sum / blockSize;
      }
      // Normalize
      const max = Math.max(...peaks);
      if (max > 0) {
        for (let i = 0; i < peaks.length; i++) {
          peaks[i] /= max;
        }
      }
      setCb(peaks);
      audioCtx.close();
    } catch {
      // CORS or decode failure — no waveform
    }
  }, []);

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
    extractPeaks(audioUrl, setAPeaks);
    return () => { a.pause(); a.src = ''; };
  }, [audioUrl, extractPeaks]);

  // Init B (mastered)
  useEffect(() => {
    if (!masteredUrl) return;
    const b = new Audio();
    b.preload = 'metadata';
    b.src = masteredUrl;
    bRef.current = b;
    b.addEventListener('loadedmetadata', () => { setBReady(true); setDuration(b.duration); });
    b.addEventListener('error', () => setBReady(false));
    extractPeaks(masteredUrl, setBPeaks);
    return () => { b.pause(); b.src = ''; };
  }, [masteredUrl, extractPeaks]);

  // Volume sync
  useEffect(() => {
    const v = isMuted ? 0 : volume;
    if (aRef.current) aRef.current.volume = v;
    if (bRef.current) bRef.current.volume = v;
  }, [volume, isMuted]);

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

  // Canvas waveform rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const peaks = activePeaks;
      if (!peaks || peaks.length === 0) {
        // No waveform — draw placeholder bars
        ctx.fillStyle = activeTrack === 'B' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.05)';
        for (let i = 0; i < 200; i++) {
          const x = (i / 200) * w;
          const barH = (Math.random() * 0.3 + 0.1) * h;
          ctx.fillRect(x, (h - barH) / 2, w / 200 - 1, barH);
        }
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const barW = w / peaks.length;
      const progressFrac = progress / 100;
      const accentRGB = activeTrack === 'B' ? [16, 185, 129] : [165, 160, 255];

      for (let i = 0; i < peaks.length; i++) {
        const x = i * barW;
        const peakVal = peaks[i];
        const barH = Math.max(2, peakVal * h * 0.85);
        const y = (h - barH) / 2;
        const frac = i / peaks.length;

        if (frac < progressFrac) {
          // Played region — bright
          ctx.fillStyle = `rgba(${accentRGB[0]},${accentRGB[1]},${accentRGB[2]},0.85)`;
        } else {
          // Unplayed region — dim
          ctx.fillStyle = `rgba(${accentRGB[0]},${accentRGB[1]},${accentRGB[2]},0.15)`;
        }

        // Rounded bars
        const radius = Math.min(1.5, barW / 2 - 0.5);
        const bw = barW - 1;
        if (bw > 0 && barH > 0) {
          ctx.beginPath();
          ctx.roundRect(x, y, bw, barH, radius);
          ctx.fill();
        }
      }

      // Playhead line
      if (duration > 0) {
        const px = progressFrac * w;
        ctx.fillStyle = `rgba(${accentRGB[0]},${accentRGB[1]},${accentRGB[2]},1)`;
        ctx.fillRect(px - 0.5, 0, 1.5, h);

        // Glow
        const grad = ctx.createLinearGradient(px - 8, 0, px + 8, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `rgba(${accentRGB[0]},${accentRGB[1]},${accentRGB[2]},0.25)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(px - 8, 0, 16, h);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activePeaks, progress, activeTrack, duration]);

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

  const seekTo = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const el = active.current;
    if (el && el.duration) {
      el.currentTime = pct * el.duration;
      setProgress(pct * 100);
      setCurrentTime(pct * el.duration);
    }
  }, [active]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    seekTo(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) seekTo(e.clientX);
  }, [isDragging, seekTo]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
      if (e.code === 'KeyX') {
        handleSwitch(activeTrack === 'A' ? 'B' : 'A');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeTrack, handleSwitch]);

  const skip = (d: number) => {
    const el = active.current;
    if (el && el.duration) el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + d));
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const isB = activeTrack === 'B';

  return (
    <div className="rounded-xl overflow-hidden select-none" style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header: A/B toggle */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: isB ? '#10b981' : '#a5a0ff', boxShadow: isB ? '0 0 8px rgba(16,185,129,0.4)' : '0 0 8px rgba(165,160,255,0.4)' }} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: isB ? '#10b981' : '#a5a0ff' }}>
            {isB ? 'Mastered' : 'Original'}
          </span>
        </div>

        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => handleSwitch('A')}
            disabled={!aReady}
            className="relative px-5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all duration-200"
            style={{
              background: !isB ? 'rgba(165,160,255,0.1)' : 'transparent',
              color: !aReady ? '#222' : !isB ? '#a5a0ff' : '#444',
            }}
          >
            A · Original
            {!isB && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: '#a5a0ff' }} />}
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.04)' }} />
          <button
            onClick={() => handleSwitch('B')}
            disabled={!bReady}
            className="relative px-5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all duration-200"
            style={{
              background: isB ? 'rgba(16,185,129,0.1)' : 'transparent',
              color: !bReady ? '#222' : isB ? '#10b981' : '#444',
            }}
          >
            B · Mastered
            {isB && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500" />}
          </button>
        </div>
      </div>

      {!aReady && audioUrl && (
        <div className="flex items-center gap-2 px-5 py-1.5 text-[10px] font-mono text-amber-500/60" style={{ background: 'rgba(255,170,0,0.02)' }}>
          <AlertCircle className="w-3 h-3 shrink-0" />
          Original audio unavailable (external URL may block cross-origin).
        </div>
      )}

      {/* Waveform canvas */}
      <div
        ref={containerRef}
        className="relative cursor-pointer group"
        style={{ height: 120 }}
        onMouseDown={handleMouseDown}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Track label watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-mono font-black uppercase tracking-[0.5em] transition-all duration-300"
            style={{
              fontSize: isSwitching ? 28 : 22,
              color: isB ? 'rgba(16,185,129,0.06)' : 'rgba(165,160,255,0.06)',
            }}
          >
            {isB ? 'MASTERED' : 'ORIGINAL'}
          </span>
        </div>

        {/* Hover time indicator */}
        {duration > 0 && (
          <div className="absolute bottom-1 right-2 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ color: isB ? 'rgba(16,185,129,0.5)' : 'rgba(165,160,255,0.5)' }}>
            {fmt(currentTime)} / {fmt(duration)}
          </div>
        )}
      </div>

      {/* Transport bar */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {/* Time */}
        <div className="flex items-center gap-2 w-28">
          <span className="text-xs font-mono tabular-nums font-bold" style={{ color: isB ? '#10b981' : '#a5a0ff' }}>
            {fmt(currentTime)}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">/</span>
          <span className="text-[10px] font-mono tabular-nums text-zinc-600">
            {duration ? fmt(duration) : '0:00'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={() => skip(-5)} className="text-zinc-500 hover:text-white transition-colors p-1">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!bReady}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-20"
            style={{
              background: isB ? '#10b981' : '#a5a0ff',
              boxShadow: isB ? '0 0 20px rgba(16,185,129,0.3)' : '0 0 20px rgba(165,160,255,0.3)',
            }}
          >
            {isPlaying
              ? <Pause className="w-4 h-4" style={{ fill: '#0a0a0c', color: '#0a0a0c' }} />
              : <Play className="w-4 h-4 ml-0.5" style={{ fill: '#0a0a0c', color: '#0a0a0c' }} />
            }
          </button>
          <button onClick={() => skip(5)} className="text-zinc-500 hover:text-white transition-colors p-1">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume + shortcuts hint */}
        <div className="flex items-center gap-3 w-28 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-500 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            className="w-16 accent-zinc-500 h-1"
          />
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="px-5 pb-2 flex items-center gap-4 text-[9px] font-mono text-zinc-600">
        <span><kbd className="px-1 py-0.5 rounded bg-zinc-800/50 text-zinc-500">Space</kbd> Play/Pause</span>
        <span><kbd className="px-1 py-0.5 rounded bg-zinc-800/50 text-zinc-500">X</kbd> A/B Switch</span>
      </div>
    </div>
  );
}
