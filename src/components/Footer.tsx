import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-soil-deep/60 backdrop-blur-md mt-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white">
            <Sprout className="w-4 h-4" />
          </div>
          <div className="text-xs text-text-muted">
            <span className="font-bold text-text-primary">MANN VASSAM</span> · மண் வாசம் — The Smart Soil Marketplace
          </div>
        </div>
        <div className="text-[11px] text-text-muted">
          © {new Date().getFullYear()} Mann Vassam · Celebrating the Fragrance of the Soil
        </div>
      </div>
    </footer>
  );
}