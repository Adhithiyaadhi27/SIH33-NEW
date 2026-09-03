import React, { useState } from 'react';
import { X, Sparkles, Upload, CheckCircle2, AlertTriangle, ShieldAlert, Camera, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const SAMPLE_PREVIEWS = [
  {
    name: 'Prime Harvest Tomato (Grade A sample)',
    type: 'optimal',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Market Grade Tomato (Grade B sample)',
    type: 'fair',
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=500&q=80'
  }
];

export default function AIQualityModal({ product, onClose, onGraded }) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_PREVIEWS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = async (sample = selectedSample) => {
    setIsAnalyzing(true);
    setResult(null);

    // Realistic scanning duration
    setTimeout(async () => {
      try {
        const res = await api.analyzeQuality({
          product: product?.name || 'Country Tomato',
          sampleQuality: sample.type
        });
        setResult(res.assessment);
        if (onGraded) onGraded(res.assessment);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-agri-bright/30 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-dark via-agri-deep to-agri-leaf text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-agri-mint text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-agri-harvest" /> Computer Vision Inspection
          </div>
          <h2 className="font-display text-2xl font-bold">AI Crop Quality Assessment</h2>
          <p className="text-xs text-agri-pale mt-1">
            OpenCV feature extraction & multi-spectral color grading pipeline
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Sample Selector or Photo Upload Simulator */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Select or Upload Produce Photo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_PREVIEWS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSample(sample);
                    runAnalysis(sample);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                    selectedSample.name === sample.name
                      ? 'border-agri-deep bg-agri-soft/80 ring-2 ring-agri-deep/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={sample.image}
                    alt={sample.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">
                      {sample.name.split('(')[0]}
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {sample.type === 'optimal' ? 'Grade A Target' : 'Commercial Grade'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Preview Window */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 h-60 flex items-center justify-center">
            <img
              src={selectedSample.image}
              alt="Scan preview"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Scanning Laser Animation */}
            {isAnalyzing && (
              <>
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-agri-bright to-transparent animate-laser shadow-[0_0_15px_#52B788]" />
                <div className="absolute inset-0 bg-agri-leaf/15 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 border-4 border-agri-bright border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="font-mono text-xs font-bold tracking-widest uppercase bg-black/60 px-3 py-1 rounded-full">
                    Extracting Color Saturation & Skin Purity...
                  </span>
                </div>
              </>
            )}

            {!isAnalyzing && !result && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => runAnalysis(selectedSample)}
                  className="bg-agri-deep hover:bg-agri-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Start AI Quality Scan
                </button>
              </div>
            )}
          </div>

          {/* AI Result Card */}
          {result && (
            <div className="p-4 bg-agri-soft/80 border border-agri-bright/30 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500">Verified Output</span>
                  <div className="text-xl font-extrabold text-agri-dark flex items-center gap-2">
                    <span>{result.grade}</span>
                    <span className="text-xs bg-agri-deep text-white px-2 py-0.5 rounded-full">
                      {result.confidenceScore}% Confidence
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => runAnalysis(selectedSample)}
                  className="p-2 text-agri-deep hover:bg-agri-pale rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-scan
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">Color Uniformity</span>
                  <span className="font-bold text-gray-800">{result.metrics.colorUniformity}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">Blemish Ratio</span>
                  <span className="font-bold text-gray-800">{result.metrics.surfaceBlemishRatio}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">Firmness</span>
                  <span className="font-bold text-gray-800 truncate block">{result.metrics.firmnessScore.split('/')[0]}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">Shelf Life Est.</span>
                  <span className="font-bold text-agri-leaf">{result.metrics.estimatedShelfLife}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory PRD Disclaimer */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Legal Notice:</strong> "The quality assessment is AI-assisted and is not an absolute warranty." Quality certificates should be validated alongside physical packhouse grading manifests.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">AgriVision CV Model v2.4</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-agri-deep hover:bg-agri-dark text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Apply to Listing & Close
          </button>
        </div>
      </div>
    </div>
  );
}
