import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/primitives';
import { Scan, Activity, Sparkles } from 'lucide-react';

const SAMPLES = [
  {
    id: 1,
    name: 'Tomato Sample 1',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    baseRipeness: 85,
    baseDefect: 2,
    grade: 'GRADE A',
  },
  {
    id: 2,
    name: 'Tomato Sample 2',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80',
    baseRipeness: 78,
    baseDefect: 5,
    grade: 'GRADE B',
  },
  {
    id: 3,
    name: 'Tomato Sample 3',
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=400&q=80',
    baseRipeness: 92,
    baseDefect: 1,
    grade: 'GRADE A',
  },
];

export default function CropQualitySandbox() {
  const [activeSample, setActiveSample] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ ripeness: number; defect: number; grade: string; confidence: number } | null>(null);

  const runAnalysis = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const s = SAMPLES[activeSample];
      setResult({
        ripeness: s.baseRipeness + Math.floor(Math.random() * 5 - 2),
        defect: Math.max(1, s.baseDefect + Math.floor(Math.random() * 3 - 1)),
        grade: s.grade,
        confidence: 92 + Math.floor(Math.random() * 6),
      });
      setScanning(false);
    }, 1800);
  };

  const preview = SAMPLES[activeSample];
  const ripeness = result?.ripeness ?? preview.baseRipeness;
  const defect = result?.defect ?? preview.baseDefect;
  const grade = result?.grade ?? preview.grade;

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-display font-extrabold text-lg text-text-primary">
          Interactive AI Crop Quality Grading Sandbox
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Simulate a live computer vision analysis: tomato samples
        </p>
      </div>

      {/* Sample selector */}
      <div className="glass-panel-sm p-2 space-y-1.5">
        <div className="px-1 text-[11px] font-bold text-text-muted flex items-center gap-1.5">
          <Scan className="w-3 h-3 text-soil-gold" /> Sample Selector
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
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-text-secondary">LIVE</span>
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
        {scanning ? 'Scanning...' : 'Run AI Analysis'}
      </button>

      {/* Metric badges */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-panel-sm p-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">Ripeness</div>
          <div className={`text-lg font-extrabold ${scanning ? 'text-text-muted' : 'text-soil-mint'}`}>
            {scanning ? '…' : `${ripeness}%`}
          </div>
        </div>
        <div className="glass-panel-sm p-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">Defect Rate</div>
          <div className={`text-lg font-extrabold ${scanning ? 'text-text-muted' : 'text-soil-gold'}`}>
            {scanning ? '…' : `${defect}%`}
          </div>
        </div>
        <div className="glass-panel-sm p-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">Classification</div>
          <div className={`text-lg font-extrabold ${scanning ? 'text-text-muted' : 'text-soil-pale'}`}>
            {scanning ? '…' : grade}
          </div>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-xs">
          <Activity className="w-3.5 h-3.5 text-soil-gold" />
          <span className="text-text-secondary">
            Confidence <strong className="text-soil-goldSoft">{result.confidence}%</strong> · AI CV model v2.4
          </span>
        </motion.div>
      )}
    </GlassCard>
  );
}