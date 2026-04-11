'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Share2, Link2, Shield } from 'lucide-react';

const STORAGE_KEY = 'whiteprint:gdrive-guide-dismissed';
const SERVICE_ACCOUNT_EMAIL = '270124753853-compute@developer.gserviceaccount.com';

interface GdriveGuideModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function isGdriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

export function isGdriveGuideDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export default function GdriveGuideModal({ open, onConfirm, onClose }: GdriveGuideModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onConfirm();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white font-mono">GOOGLE_DRIVE_SETUP</h2>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5">
                <p className="text-sm text-zinc-400">
                  WhitePrint needs public access to your audio file. Follow these steps:
                </p>

                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">1. Upload to Google Drive</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Upload your WAV, FLAC, or AIFF file to Google Drive.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2. Set Sharing Permissions</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Right-click the file → <strong className="text-zinc-300">Share</strong> → <strong className="text-zinc-300">General access</strong> →
                    </p>
                    {/* Visual guide */}
                    <div className="mt-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <span className="text-zinc-600 line-through">Restricted</span>
                        <span className="text-zinc-600">← default (will fail)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-emerald-400 font-bold">Anyone with the link</span>
                        <span className="text-zinc-600">← select this</span>
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-1">
                        Role: Viewer (default) is fine.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Link2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">3. Copy Link & Paste</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Click <strong className="text-zinc-300">Copy link</strong> and paste it into the URL field above.
                    </p>
                  </div>
                </div>

                {/* Alternative: Service Account */}
                <div className="border-t border-zinc-800 pt-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-300">Alternative: Share with Service Account</h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        Instead of making the file public, you can share it directly with our service account:
                      </p>
                      <div className="mt-2 p-2 rounded bg-zinc-900 border border-zinc-800">
                        <code className="text-[11px] text-indigo-400 break-all select-all">
                          {SERVICE_ACCOUNT_EMAIL}
                        </code>
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-1">
                        Add this email as a Viewer in the file&apos;s share settings. The file stays private to you and our service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-zinc-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-xs text-zinc-500">Don&apos;t show this again</span>
                </label>
                <button
                  onClick={handleConfirm}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-sm rounded-lg transition-colors"
                >
                  OK, GOT IT — START ANALYSIS
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
