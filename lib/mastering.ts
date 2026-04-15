import type { DeliberationOutput } from '@/types/deliberation';
import type { MasteringResult } from '@/types/mastering';
import { postMaster } from '@/lib/api-client';

export async function runMastering(
  audioUrl: string,
  deliberation: DeliberationOutput,
): Promise<MasteringResult> {
  const resultData = await postMaster<{ download_url: string; metrics?: any }>({
    audio_url: audioUrl,
    route: 'dsp_only',
    manual_params: deliberation.adopted_params,
    target_lufs: deliberation.target_lufs,
    target_true_peak: deliberation.target_true_peak,
  });

  const downloadUrl = resultData.download_url;

  let metrics: MasteringResult['metrics'] = {
    lufs_before: 0,
    lufs_after: deliberation.target_lufs,
    true_peak_before: 0,
    true_peak_after: deliberation.target_true_peak,
    dynamic_range_after: 0,
    convergence_loops: 0,
    gain_adjustment_db: 0,
    target_lufs: deliberation.target_lufs,
    target_true_peak: deliberation.target_true_peak,
    engine_version: 'v2_14stage',
  };

  if (resultData.metrics) {
    metrics = { ...metrics, ...resultData.metrics };
  }

  return {
    job_id: crypto.randomUUID(),
    status: 'success',
    metrics,
    download_url: downloadUrl,
  };
}
