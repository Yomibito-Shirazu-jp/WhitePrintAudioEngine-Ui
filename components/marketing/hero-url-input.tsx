'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import GDriveGuide from '@/components/gdrive-guide';

export default function HeroUrlInput({ onSubmit }: { onSubmit?: (url: string) => void }) {
  const [url, setUrl] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (onSubmit) {
      onSubmit(url.trim());
    } else {
      router.push(`/?url=${encodeURIComponent(url.trim())}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste audio URL — Dropbox, Google Drive, S3..."
              className="w-full bg-zinc-900/80 border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 rounded-lg px-4 py-3.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-sm whitespace-nowrap flex-shrink-0"
          >
            Master Now
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-zinc-600">
          <span>Free. No signup. Supports Google Drive, Dropbox, S3, GCS.</span>
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="inline-flex items-center gap-1 text-indigo-400/60 hover:text-indigo-400 transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            共有方法
          </button>
        </div>
      </form>

      {showGuide && <GDriveGuide onClose={() => setShowGuide(false)} />}
    </>
  );
}
