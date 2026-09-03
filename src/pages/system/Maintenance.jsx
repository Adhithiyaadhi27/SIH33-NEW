import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Wrench, Home } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center bg-nature-pattern">
      <div className="max-w-md card-nature p-8 space-y-6 shadow-nature-lg">
        {/* Agricultural Maintenance Illustration */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-nature-pale rounded-full border border-nature-soft shadow-inner">
          <span className="text-5xl animate-spin-slow">🚜</span>
          <div className="absolute -top-1 -right-1 bg-nature-harvest text-nature-text p-2 rounded-full shadow-md">
            <Wrench className="w-4 h-4 text-nature-earth" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="label-earth block">
            Scheduled Mandi Telemetry Maintenance
          </span>
          <h1 className="font-display font-bold text-2xl text-nature-primary">
            "We're preparing the fields for something better."
          </h1>
          <p className="text-xs text-nature-text/75 leading-relaxed">
            Our AI database indexes and regional mandi price feeds are undergoing scheduled calibration. Normal trading corridors will resume shortly.
          </p>
        </div>

        <div className="p-3 bg-nature-bgSoft rounded-2xl border border-nature-soft/40 text-xs text-nature-primary font-mono">
          System Status: Calibrating AI Quality Model v2.4
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-nature-primary hover:bg-nature-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-nature transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
