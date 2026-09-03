import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Camera,
  Layers,
  ArrowRight,
  Activity,
  CheckCircle2,
  RefreshCw,
  Clock,
  Zap,
  BarChart3,
  Cpu
} from 'lucide-react';
import AIQualityModal from '../components/AIQualityModal';
import { api } from '../services/api';
import { LeafVeinDivider } from '../components/NatureIllustrations';

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState('demand'); // 'demand', 'quality', 'waste', 'reliability', 'architecture'
  const [demandData, setDemandData] = useState(null);
  const [wasteData, setWasteData] = useState(null);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    setLoading(true);
    try {
      const [demandRes, wasteRes] = await Promise.all([
        api.getDemandForecast('Tomato'),
        api.getWasteRisk()
      ]);
      setDemandData(demandRes.forecast);
      setWasteData(wasteRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-nature-pattern">
      {/* AI Zone Banner with AI Blue/Purple Accent (PRD Section 0.2 & 30) */}
      <div className="ai-zone-gradient text-white rounded-basket-lg p-6 sm:p-10 shadow-nature-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-nature-pale">
            <Cpu className="w-3.5 h-3.5 text-nature-harvest" /> AI Core Intelligence Suite
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
            Supply Chain Intelligence & Quality Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-nature-pale/90 leading-relaxed">
            Multi-model neural intelligence combining regional weather data, historical consumption, computer-vision grading, and shelf-life decay modeling.
          </p>
        </div>

        {/* AI Zone Glow Accent */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-nature-ai/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Feature Tabs (PRD Section 12, 15, 17, 18, 30) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-nature-soft/40">
        {[
          { id: 'demand', label: '📈 Demand & Shortage Predictor' },
          { id: 'quality', label: '📸 AI Quality Grading' },
          { id: 'waste', label: '⚠️ Waste & Anomaly Engine' },
          { id: 'reliability', label: '⭐ Supplier Reliability Score' },
          { id: 'architecture', label: '🏗️ AI System Architecture' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-nature-primary text-white shadow-nature'
                : 'bg-nature-card text-nature-text hover:bg-nature-bgSoft border border-nature-soft/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Demand & Shortage Predictor (PRD Section 15) */}
      {activeTab === 'demand' && demandData && (
        <div className="space-y-6 animate-in fade-in">
          <div className="card-nature p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-nature-soft/30">
              <div>
                <span className="label-earth block">
                  Forecast Region: {demandData.region}
                </span>
                <h2 className="font-display font-bold text-2xl text-nature-primary mt-1">
                  14-Day Horizon Shortage Forecast ({demandData.product})
                </h2>
              </div>
              <span className="chip-nature text-xs self-start sm:self-auto">
                AI Confidence: {demandData.confidenceScore}%
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-nature-bgSoft/60 p-4 rounded-2xl border border-nature-soft/40">
                <span className="text-xs text-nature-earth font-bold block uppercase">Baseline Demand</span>
                <strong className="text-2xl font-display text-nature-primary">{demandData.currentDemand.toLocaleString()} kg</strong>
              </div>
              <div className="bg-nature-pale/80 p-4 rounded-2xl border border-nature-soft">
                <span className="text-xs text-nature-primary font-bold block uppercase">Predicted Demand</span>
                <strong className="text-2xl font-display text-nature-hover">{demandData.predictedDemand.toLocaleString()} kg</strong>
              </div>
              <div className="bg-nature-bgSoft/60 p-4 rounded-2xl border border-nature-soft/40">
                <span className="text-xs text-nature-earth font-bold block uppercase">Available Supply</span>
                <strong className="text-2xl font-display text-nature-primary">{demandData.availableSupply.toLocaleString()} kg</strong>
              </div>
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
                <span className="text-xs text-nature-tomato font-bold block uppercase">Projected Deficit</span>
                <strong className="text-2xl font-display text-nature-tomato">-{demandData.predictedShortage.toLocaleString()} kg</strong>
              </div>
            </div>

            {/* Historical vs Predicted Trend Chart Bars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-nature-text">
                <span>Timeline Projection (Historical vs. Next 14 Days)</span>
                <span className="text-nature-earth">Demand (Deep Green) vs Supply (Sage Gray)</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center pt-2">
                {demandData.historicalTrend.map((step, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="h-36 bg-nature-bgSoft/80 rounded-2xl flex items-end justify-center p-1.5 gap-1.5 border border-nature-soft/30">
                      <div
                        style={{ height: `${(step.demand / 5500) * 100}%` }}
                        className="w-1/2 bg-nature-primary rounded-t-lg transition-all"
                        title={`Demand: ${step.demand} kg`}
                      />
                      <div
                        style={{ height: `${(step.supply / 5500) * 100}%` }}
                        className="w-1/2 bg-nature-soft rounded-t-lg transition-all"
                        title={`Supply: ${step.supply} kg`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-nature-text block">{step.label}</span>
                    <span className="text-[9px] text-nature-earth block">{step.demand} kg</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended AI Actions */}
            <div className="bg-nature-pale/80 p-5 rounded-basket border border-nature-soft space-y-3">
              <h4 className="font-display font-bold text-sm text-nature-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-nature-ai" /> Automated AI Shortage Mitigations
              </h4>
              <ul className="space-y-2 text-xs text-nature-text/80">
                {demandData.aiRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-nature-leaf shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Quality Grading (PRD Section 12 & 20) */}
      {activeTab === 'quality' && (
        <div className="card-nature p-8 shadow-nature text-center max-w-2xl mx-auto space-y-6 animate-in fade-in">
          <div className="w-16 h-16 bg-nature-pale rounded-2xl text-nature-primary flex items-center justify-center mx-auto shadow-nature-sm">
            <Camera className="w-8 h-8 text-nature-leaf" />
          </div>
          <h3 className="font-display font-bold text-2xl text-nature-primary">
            Instant Computer-Vision Quality Classification
          </h3>
          <p className="text-xs sm:text-sm text-nature-text/75 leading-relaxed">
            Upload or inspect produce photos through our deep convolutional neural network. Evaluates skin purity, surface blemish ratios, and classifies into Grade A / B / C.
          </p>

          <button
            onClick={() => setShowQualityModal(true)}
            className="bg-nature-primary hover:bg-nature-hover text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition shadow-nature inline-flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-nature-ai" />
            <span>Launch Live AI Scanner</span>
          </button>

          <div className="p-4 bg-nature-cream/80 rounded-2xl border border-nature-harvest/40 text-left text-xs text-nature-earth">
            <strong>Mandatory Legal Statement:</strong> "The quality assessment is AI-assisted and is not an absolute warranty."
          </div>
        </div>
      )}

      {/* Tab 3: Waste & Anomaly Engine (PRD Section 17 & 25) */}
      {activeTab === 'waste' && wasteData && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shelf Life Decay Tracking */}
            <div className="card-nature p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-nature-soft/30">
                <h3 className="font-display font-bold text-base text-nature-primary flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-nature-tomato" /> Shelf-Life Decay Radar
                </h3>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  High Risk Batches
                </span>
              </div>

              {wasteData.wasteAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span>{alert.product}</span>
                    <span className="bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full font-bold">
                      {alert.wasteRisk} RISK
                    </span>
                  </div>
                  <p className="text-nature-text/80">
                    📍 {alert.location} &bull; Stock: <strong>{alert.stockQuantity} {alert.unit}</strong> (Age: {alert.stockAgeDays}d, Shelf-life remaining: {alert.shelfLifeRemainingDays}d)
                  </p>
                  <div className="bg-white p-3 rounded-xl space-y-1 text-nature-text border border-rose-100">
                    <span className="font-bold text-nature-primary text-[11px] block">AI Automated Mitigations:</span>
                    {alert.aiRecommendations.map((r, i) => (
                      <p key={i} className="text-[11px] flex items-center gap-1">
                        &rarr; {r}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Anomaly Surveillance (AI Blue/Purple Accent) */}
            <div className="card-nature p-6 space-y-4 border-nature-ai/30">
              <div className="flex items-center justify-between pb-3 border-b border-nature-soft/30">
                <h3 className="font-display font-bold text-base text-nature-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-nature-ai" /> Operational Anomaly Detector
                </h3>
                <span className="chip-nature text-[10px]">Surveillance Active</span>
              </div>

              {wasteData.anomalyAlerts.map((anom) => (
                <div key={anom.id} className="p-4 bg-nature-bgSoft/60 rounded-2xl border border-nature-soft/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-nature-primary">
                    <span>{anom.type.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] bg-nature-harvest/30 text-nature-earth px-2 py-0.5 rounded font-bold">
                      {anom.severity}
                    </span>
                  </div>
                  <p className="text-nature-earth font-semibold">{anom.entity}</p>
                  <p className="text-nature-text/80">{anom.details}</p>
                  <span className="text-[10px] text-gray-400 block pt-1">{anom.timestamp} &bull; Status: {anom.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Supplier Reliability Score (PRD Section 18 & 26) */}
      {activeTab === 'reliability' && (
        <div className="card-nature p-8 space-y-6 max-w-3xl mx-auto animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-nature-soft/30">
            <div>
              <span className="label-earth block">
                Audited FPO Co-op Profile
              </span>
              <h3 className="font-display font-bold text-2xl text-nature-primary mt-1">
                Madurai GreenValley Farmers Producer Co-op
              </h3>
              <p className="text-xs text-nature-text/70">Consolidating 340 smallholder farmers in Tamil Nadu</p>
            </div>

            <div className="bg-nature-pale border border-nature-soft px-5 py-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-nature-leaf block">Trust Score</span>
              <span className="font-display font-extrabold text-3xl text-nature-primary">94 / 100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-nature-bgSoft/70 p-4 rounded-2xl border border-nature-soft/30">
              <span className="text-xs text-nature-earth block">On-Time Delivery</span>
              <strong className="text-xl text-nature-primary font-display">96.2%</strong>
            </div>
            <div className="bg-nature-bgSoft/70 p-4 rounded-2xl border border-nature-soft/30">
              <span className="text-xs text-nature-earth block">Quantity Accuracy</span>
              <strong className="text-xl text-nature-primary font-display">94.8%</strong>
            </div>
            <div className="bg-nature-bgSoft/70 p-4 rounded-2xl border border-nature-soft/30">
              <span className="text-xs text-nature-earth block">Quality Consistency</span>
              <strong className="text-xl text-nature-primary font-display">93.5%</strong>
            </div>
            <div className="bg-nature-bgSoft/70 p-4 rounded-2xl border border-nature-soft/30">
              <span className="text-xs text-nature-earth block">Order Completion</span>
              <strong className="text-xl text-nature-primary font-display">98.1%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: AI System Architecture (PRD Section 30) */}
      {activeTab === 'architecture' && (
        <div className="card-nature p-8 space-y-6 animate-in fade-in">
          <h3 className="font-display font-bold text-xl text-nature-primary">
            AgriDirect AI End-to-End Pipeline Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-nature-bgSoft/80 rounded-2xl border border-nature-soft/40 space-y-3">
              <span className="font-bold text-sm text-nature-primary block">1. Ingested Data Sources</span>
              <ul className="space-y-1.5 text-nature-text/80">
                <li>&bull; Real-time marketplace searches & orders</li>
                <li>&bull; Buyer reverse-bidding requirements</li>
                <li>&bull; Weather & seasonal precipitation records</li>
                <li>&bull; Packhouse CV camera feeds & manifests</li>
                <li>&bull; Historical supplier dispute logs</li>
              </ul>
            </div>
            <div className="p-5 bg-nature-pale/80 rounded-2xl border border-nature-soft space-y-3">
              <span className="font-bold text-sm text-nature-primary block">2. AI / ML Intelligence Core</span>
              <ul className="space-y-1.5 text-nature-text/80">
                <li>&bull; 14-30 Day Shortage Forecast Engine</li>
                <li>&bull; OpenCV & CNN Quality Classifier</li>
                <li>&bull; Perishability Decay & Waste Radar</li>
                <li>&bull; Dynamic Supplier Reliability Matrix</li>
                <li>&bull; Multi-Supplier Smart Aggregator</li>
              </ul>
            </div>
            <div className="p-5 bg-nature-card rounded-2xl border border-nature-leaf/40 space-y-3 shadow-nature-sm">
              <span className="font-bold text-sm text-nature-leaf block">3. Automated Actions</span>
              <ul className="space-y-1.5 text-nature-text/80">
                <li>&bull; Automated corridor fleet reservations</li>
                <li>&bull; Flash price markdown on near-expiry items</li>
                <li>&bull; Multi-farmer aggregation contracts</li>
                <li>&bull; Instant QR digital produce passport</li>
                <li>&bull; Anomaly escrow lock triggers</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quality Scanner Modal */}
      {showQualityModal && (
        <AIQualityModal
          product={{ name: "Country Vine Tomato", grade: "Grade A" }}
          onClose={() => setShowQualityModal(false)}
        />
      )}

      <LeafVeinDivider />
    </div>
  );
}
