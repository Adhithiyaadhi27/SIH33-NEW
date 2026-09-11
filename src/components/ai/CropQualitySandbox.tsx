import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/primitives';
import { Scan, Activity, Sparkles, Loader2 } from 'lucide-react';
import useTranslation from '../../services/useTranslation';
import { useRealtimeStatus } from '../../services/realtime';
import api from '../../services/api';

const SAMPLES = [
  {
    id: 1,
    name: 'Tomato Sample 1',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    baseRipeness: 85,
    baseDefect: 2,
    grade: 'Grade A',
    sampleQuality: 'optimal',
  },
  {
    id: 2,
    name: 'Tomato Sample 2',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80',
    baseRipeness: 78,
    baseDefect: 5,
    grade: 'Grade B',
    sampleQuality: 'fair',
  },
  {
    id: 3,
    name: 'Tomato Sample 3',
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=400&q=80',
    baseRipeness: 92,
    baseDefect: 1,
    grade: 'Grade A',
    sampleQuality: 'optimal',
  },
];

interface AnalysisResult {
  ripeness: number;
  defect: number;
  grade: string;
  confidence: number;
  colorUniformity?: string;
  firmnessScore?: string;
  shelfLife?: string;
}

function normalizeGrade(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes('a')) return 'GRADE A';
  if (s.includes('b')) return 'GRADE B';
  return 'GRADE C';
}

export default function CropQualitySandbox() {
  const { t } = useTranslation();
  const feedStatus = useRealtimeStatus();
  const [activeSample, setActiveSample] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const runAnalysis = async () => {
    setScanning(true);
    setResult(null);
    const sample = SAMPLES[activeSample];

    try {
      const res = await api.post('/quality/analyze', {
        product: 'Tomato',
        sampleQuality: sample.sampleQuality,
        imageUrl: sample.image,
      });

      if (res.data?.success) {
        const a = res.data.assessment;
        const metrics = a.metrics ?? {};
        setResult({
          ripeness: 100 - (parseFloat(String(metrics.surfaceBlemishRatio ?? 0).replace('%', ''))) || sample.baseRipeness,
          defect: parseFloat(String(metrics.surfaceBlemishRatio ?? 2).replace('%', '')),
          grade: normalizeGrade(a.grade ?? sample.grade),
          confidence: a.confidenceScore ?? 90,
          colorUniformity: metrics.colorUniformity,
          firmnessScore: metrics.firmnessScore,
          shelfLife: metrics.estimatedShelfLife,
        });
      } else {
        throw new Error(res.data?.error ?? 'Analysis failed');
      }
    } catch {
      // Fallback to local simulation if the backend is unreachable
      setTimeout(() => {
        const s = SAMPLES[activeSample];
        setResult({
          ripeness: s.baseRipeness + Math.floor(Math.random() * 5 - 2),
          defect: Math.max(1, s.baseDefect + Math.floor(Math.random() * 3 - 1)),
          grade: normalizeGrade(s.grade),
          confidence: 92 + Math.floor(Math.random() * 6),
        });
      }, 800);
    } finally {
      setTimeout(() => setScanning(false), 900);
    }
  };

  const preview = SAMPLES[activeSample];
  const ripeness = result?.ripeness ?? preview.baseRipeness;
  const defect = result?.defect ?? preview.baseDefect;
  const grade = result?.grade ?? normalizeGrade(preview.grade);

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
      <div>
        <h2 className="font-display font-extrabold text-lg text-text-primary">
          {t('ai.title')}
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          {t('ai.subtitle')}
        </p>
      </div>

      {/* Sample selector */}
      <div className="glass-panel-sm p-2 space-y-1.5">
        <div className="px-1 text-[11px] font-bold text-text-muted flex items-center gap-1.5">
          <Scan className="w-3 h-3 text-soil-gold" /> {t('ai.sample_selector')}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {SAMPLES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => { setActiveSample(idx); setResult(null); }}
              className={`px-2 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                activeSample === idx ? 'bg-soil-gold/25 text-soil-gold border border-soil-gold/40' : 'bg-white/5 text-text-muted hover:bg-white/10'
              }`}
            >
              <img src={s.image} alt={s.name} className="w-9 h-9 rounded-lg object-cover" />
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scanner display */}
      <div className="scan-frame relative h-52 bg-soil-deep/60 mx-auto max-w-xs">
        <img
          src={SAMPLES[activeSample].image}
          alt={SAMPLES[activeSample].name}
          className="w-full h-full object-cover opacity-80"
        />
        {/* Detection box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-[18%] border-2 border-soil-mint/70 rounded-lg">
            <span className="absolute -top-2.5 left-2 bg-soil-emerald text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              tomato_95%
            </span>
          </div>
        </div>
        {/* Scanning line */}
        {scanning ? (
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-soil-gold shadow-glow-gold animate-scan-line"
            style={{ top: '4%' }}
          />
        ) : (
          <div className="absolute top-3 right-3 glass-panel-sm px-2 py-1 flex items-center gap-1.5">
            <span className={`flex h-1.5 w-1.5 rounded-full ${feedStatus === 'live' ? 'bg-emerald-400' : 'bg-soil-gold'} animate-pulse`} />
            <span className="text-[9px] font-bold text-text-secondary">
              {feedStatus === 'live' ? t('marketplace.live_feed') : feedStatus === 'simulated' ? t('marketplace.simulated_feed') : t('marketplace.connecting')}
            </span>
          </div>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={runAnalysis}
        disabled={scanning}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-soil-emerald to-soil-leaf text-white py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition cursor-pointer disabled:opacity-60"
      >
        <Sparkles className="w-4 h-4 text-soil-gold" />
        {scanning ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-4 h-4 animate-spin" /> {t('ai.scanning')}
          </span>
        ) : (
          t('ai.run_analysis')
        )}
      </button>

      {/* Metric badges */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-panel-sm p-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">{t('ai.ripeness')}</div>
          <div className={`text-lg font-extrabold ${scanning ? 'text-text-muted' : 'text-soil-mint'}`}>
            {scanning ? '…' : `${Math.max(1, Math.min(100, ripeness))}%`}
          </div>
        </div>
        <div className="glass-panel-sm p-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">{t('ai.defect_rate')}</div>
          <div className={`text-lg font-extrabold ${scanning ? 'text-text-muted' : 'text-soil-gold'}`}>
            {scanning ? '…' : `${defect.toFixed(1)}%`}
          </div>
        </div>
        <div className="glass-panel-sm p-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">{t('ai.classification')}</div>
          <div className={`text-lg font-extrabold ${scanning ? 'text-text-muted' : 'text-soil-pale'}`}>
            {scanning ? '…' : grade}
          </div>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-xs">
            <Activity className="w-3.5 h-3.5 text-soil-gold" />
            <span className="text-text-secondary">
              {t('ai.confidence')} <strong className="text-soil-goldSoft">{result.confidence}%</strong> · {t('ai.model_version')}
            </span>
          </div>
          {(result.colorUniformity || result.firmnessScore || result.shelfLife) && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-text-muted">
              {result.colorUniformity && <span>Color: {result.colorUniformity}</span>}
              {result.firmnessScore && <span>· {result.firmnessScore}</span>}
              {result.shelfLife && <span>· Shelf: {result.shelfLife}</span>}
            </div>
          )}
        </motion.div>
      )}
    </GlassCard>
  );
}