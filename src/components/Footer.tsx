import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-soil-deep/60 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white">
            <Sprout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="text-[11px] sm:text-xs text-text-muted text-center sm:text-left">
            <span className="font-bold text-text-primary">MANN VASSAM</span> · <span className="hidden sm:inline">மண் வாசம் — The Smart Soil Marketplace</span><span className="sm:hidden">Smart Soil Marketplace</span>
          </div>
        </div>
        <div className="text-[10px] sm:text-[11px] text-text-muted text-center">
          © {new Date().getFullYear()} Mann Vassam · Celebrating the Fragrance of the Soil
        </div>
      </div>
    </footer>
  );
}