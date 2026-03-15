'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const STEPS = [
  "Validating header integrity...",
  "Computing Track Spectrum (FFT)...",
  "Applying BS.1770-4 K-weighting...",
  "Extracting Time-Series Circuit Envelopes...",
  "Calculating True Peak (4x oversampling)...",
  "Detecting physical section boundaries...",
  "Evaluating engineering problem sensitivity...",
  "Finalizing JSON payload..."
];

export default function AnalyzingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center">
      {/* Radar/Scanner Animation */}
      <div className="relative w-48 h-48 mb-12">
        <div className="absolute inset-0 rounded-full border border-zinc-800" />
        <div className="absolute inset-4 rounded-full border border-zinc-800/50" />
        <div className="absolute inset-8 rounded-full border border-zinc-800/30" />
        
        {/* Scanning line */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, transparent 80%, rgba(99, 102, 241, 0.4) 100%)'
          }}
        >
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-indigo-500 origin-bottom shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
        </motion.div>
        
        {/* Center node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,1)]" />
      </div>

      <div className="w-full space-y-6">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>

        {/* Terminal Output */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs h-32 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
          
          <div className="flex flex-col justify-end h-full space-y-1">
            {STEPS.slice(0, currentStep + 1).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-zinc-600">{`[${(i * 0.125).toFixed(3)}]`}</span>
                <span className={i === currentStep ? "text-indigo-400" : "text-zinc-500"}>
                  {step}
                </span>
                {i < currentStep && <span className="text-emerald-500 ml-auto">OK</span>}
                {i === currentStep && (
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-1.5 h-3 bg-indigo-400 ml-auto"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
