export interface TrackIdentity {
  duration_sec: number;
  sample_rate: number;
  bpm: number | null;
  key: string | null;
  bit_depth: number;
}

export interface WholeTrackMetrics {
  integrated_lufs: number;
  true_peak_dbtp: number;
  lra_lu: number;
  psr_db: number;
  crest_db: number;
  stereo_width: number;
  stereo_correlation: number;
  low_mono_correlation_below_120hz: number;
  harshness_risk: number;
  mud_risk: number;
  sub_ratio: number;
  bass_ratio: number;
  low_mid_ratio: number;
  mid_ratio: number;
  high_ratio: number;
  air_ratio: number;
}

export interface TimeSeriesCircuitEnvelopes {
  resolution_sec: number;
  lufs: number[];
  crest_db: number[];
  width: number[];
  sub_ratio: number[];
  bass_ratio: number[];
  vocal_presence: number[];
  spectral_brightness: number[];
  low_mono_correlation: number[];
  transient_sharpness: number[];
}

export interface PhysicalSection {
  start_sec: number;
  end_sec: number;
  avg_lufs: number;
  avg_width: number;
}

export interface DetectedProblem {
  issue: string;
  severity: 'high' | 'medium' | 'low';
  value: number;
}

export interface AnalysisResult {
  track_identity: TrackIdentity;
  whole_track_metrics: WholeTrackMetrics;
  time_series_circuit_envelopes: TimeSeriesCircuitEnvelopes;
  physical_sections: PhysicalSection[];
  detected_problems: DetectedProblem[];
}
