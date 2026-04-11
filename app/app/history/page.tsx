'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import SiteHeader from '@/components/site-header';

type Job = {
  id: string;
  input_file_name: string | null;
  status: string;
  route: string | null;
  lufs_before: number | null;
  lufs_after: number | null;
  true_peak_before: number | null;
  true_peak_after: number | null;
  bpm: number | null;
  musical_key: string | null;
  duration_sec: number | null;
  created_at: string;
  completed_at: string | null;
};

export default function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login?redirect=/app/history';
        return;
      }

      const { data } = await supabase
        .from('jobs')
        .select('id, input_file_name, status, route, lufs_before, lufs_after, true_peak_before, true_peak_after, bpm, musical_key, duration_sec, created_at, completed_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setJobs(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const formatDuration = (sec: number | null) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'failed': return 'text-red-400';
      case 'cancelled': return 'text-zinc-500';
      default: return 'text-yellow-400';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center">
        <div className="w-6 h-6 rounded bg-indigo-500 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
      <SiteHeader>
        <Link href="/app" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-600">
          [ BACK ]
        </Link>
      </SiteHeader>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">Mastering History</h1>

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 mb-4">No mastering jobs yet.</p>
            <Link href="/app" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Start your first mastering &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center gap-6"
              >
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-200 truncate">
                    {job.input_file_name || 'Untitled'}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                    <span>{formatDuration(job.duration_sec)}</span>
                    {job.bpm && <span>{Math.round(Number(job.bpm))} BPM</span>}
                    {job.musical_key && <span>{job.musical_key}</span>}
                  </div>
                </div>

                {/* LUFS before/after */}
                {job.lufs_before != null && job.lufs_after != null && (
                  <div className="text-xs text-center hidden sm:block">
                    <div className="text-zinc-500">LUFS</div>
                    <div className="text-zinc-300">
                      {Number(job.lufs_before).toFixed(1)} &rarr; {Number(job.lufs_after).toFixed(1)}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className={`text-xs font-mono ${statusColor(job.status)}`}>
                  {job.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
