import type { AnalysisResult } from '@/types/audio';
import { postMaster } from '@/lib/api-client';

export async function analyzeAudio(audioUrl: string): Promise<AnalysisResult> {
  return postMaster<AnalysisResult>({
    audio_url: audioUrl,
    route: 'analyze_only',
  });
}
