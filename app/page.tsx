'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UploadScreen from '@/components/upload-screen';
import AnalyzingScreen from '@/components/analyzing-screen';
import ResultsDashboard from '@/components/results-dashboard';
import { analyzeAudio } from '@/lib/audio-analysis';
import type { AnalysisResult } from '@/types/audio';

export default function Home() {
  const [appState, setAppState] = useState<'idle' | 'analyzing' | 'results'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setAppState('analyzing');
    setError(null);
    try {
      const result = await analyzeAudio(file);
      setAnalysisResult(result);
      setAppState('results');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred during analysis.');
      setAppState('idle');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <h1 className="font-mono text-sm font-semibold tracking-wider text-zinc-200">
              AUDIO_ANALYSIS_ENGINE <span className="text-zinc-500 font-normal">v1.0.0</span>
            </h1>
          </div>
          {appState === 'results' && (
            <button
              onClick={handleReset}
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-600"
            >
              [ NEW_ANALYSIS ]
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {appState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <UploadScreen onUpload={handleUpload} error={error} />
            </motion.div>
          )}

          {appState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <AnalyzingScreen />
            </motion.div>
          )}

          {appState === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <ResultsDashboard data={analysisResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
