import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, CheckCircle2, MapPin, Calendar, Truck, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export default function PassportModal({ passport, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (passport && canvasRef.current) {
      const payload = JSON.stringify({
        batchId: passport.batchId,
        product: passport.product,
        origin: passport.origin,
        grade: passport.grade,
        verificationUrl: `https://agridirect.ai/produce-passport/${passport.batchId}`
      });
      QRCode.toCanvas(canvasRef.current, payload, {
        width: 140,
        margin: 1,
        color: {
          dark: '#1B4D3E',
          light: '#FFFFFF'
        }
      });
    }
  }, [passport]);

  if (!passport) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-agri-bright/30 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-dark to-agri-deep text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-agri-mint text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Official Digital Produce Passport
          </div>
          <h2 className="font-display text-2xl font-bold">{passport.product}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-agri-pale">
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold text-white">
              {passport.batchId}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-agri-harvest" /> {passport.origin}
            </span>
            <span className="bg-agri-accent/30 text-agri-mint px-2 py-0.5 rounded-full font-semibold">
              {passport.grade} ({passport.qualityScore || 94.6}% Score)
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* QR Code & Origin Overview */}
          <div className="flex flex-col sm:flex-row gap-5 items-center bg-agri-soft/50 p-4 rounded-2xl border border-agri-bright/20">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <canvas ref={canvasRef} />
              <span className="text-[10px] font-mono text-gray-500 mt-1">Scan for Field Proof</span>
            </div>
            <div className="flex-1 text-xs space-y-2">
              <div className="font-semibold text-agri-dark text-sm">
                FPO Aggregation: {passport.fpo?.name}
              </div>
              <p className="text-gray-600">
                <strong>Batch Yield:</strong> {passport.quantity}
              </p>
              <p className="text-gray-600">
                <strong>Geo-Location:</strong> {passport.gpsCoordinates?.latitude}° N, {passport.gpsCoordinates?.longitude}° E ({passport.gpsCoordinates?.plotName})
              </p>
              <p className="text-gray-600">
                <strong>Cold Chain Telemetry:</strong> Temp: {passport.warehouse?.temperature || '12.4°C'} | Humidity: {passport.warehouse?.humidity || '88%'}
              </p>
              <div className="inline-flex items-center gap-1 text-agri-deep font-bold text-[11px] bg-agri-pale px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Blockchain Authenticated & Verified
              </div>
            </div>
          </div>

          {/* Farmer Contributors Breakdown */}
          {passport.farmerContributors && passport.farmerContributors.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-sm text-agri-dark mb-2">
                🌾 Aggregated Farmer Contributors
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {passport.farmerContributors.map((farmer, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-2.5 rounded-xl text-xs">
                    <div className="font-semibold text-gray-900">{farmer.name}</div>
                    <div className="text-[11px] text-gray-500">{farmer.plot}</div>
                    <div className="mt-1 font-bold text-agri-leaf">{farmer.qty}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Farm-to-Fork Timeline */}
          <div>
            <h4 className="font-display font-bold text-sm text-agri-dark mb-3">
              🚚 Farm-to-Fork Traceability Timeline
            </h4>
            <div className="space-y-4 border-l-2 border-agri-bright/40 ml-3 pl-4">
              {passport.timeline?.map((step, idx) => (
                <div key={idx} className="relative text-xs">
                  <span className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                    step.status === 'COMPLETED' ? 'bg-agri-deep' : step.status === 'IN_TRANSIT' ? 'bg-agri-harvest animate-pulse' : 'bg-gray-300'
                  }`} />
                  <div className="flex items-center justify-between font-semibold text-gray-900">
                    <span>{step.step}</span>
                    <span className="text-[10px] text-gray-400">{step.timestamp}</span>
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">{step.location}</div>
                  <p className="text-gray-600 mt-1 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">AgriDirect Authenticity Stamp</span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Print Passport
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-agri-deep hover:bg-agri-dark text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
