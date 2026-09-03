import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Compass, ArrowRight } from 'lucide-react';
import { CrackedSoilIcon } from '../../components/NatureIllustrations';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center bg-nature-pattern">
      <div className="max-w-md card-nature p-8 space-y-6 shadow-nature-lg">
        {/* Subtle Agricultural Cracked Soil Illustration (PRD Section 0.4 & 28) */}
        <CrackedSoilIcon className="w-28 h-28 mx-auto text-nature-leaf" />

        <div className="space-y-2">
          <span className="label-earth block">
            HTTP 404 — Field Coordinates Unmapped
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-nature-primary">
            "Looks like this field has no harvest yet."
          </h1>
          <p className="text-xs text-nature-text/75 max-w-sm mx-auto leading-relaxed">
            The agricultural plot or produce batch you requested might have been reaped, re-routed, or planted under a different seasonal cycle.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto bg-nature-primary hover:bg-nature-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-nature transition cursor-pointer"
          >
            Go Home
          </Link>
          <Link
            to="/marketplace"
            className="w-full sm:w-auto bg-nature-pale hover:bg-nature-soft text-nature-primary border border-nature-soft px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-nature-leaf" />
            <span>Explore Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
