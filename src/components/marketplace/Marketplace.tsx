import { useEffect, useState } from 'react';
import { LayoutGrid, List, Search, Filter, Loader2, Radio } from 'lucide-react';
import { GlassCard } from '../ui/primitives';
import { mockProducts, type MockProduct } from '../../data/mockProducts';
import { useRealtime, useRealtimeStatus } from '../../services/realtime';
import api from '../../services/api';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Vegetables', 'Fruits'];

const FEED_STATUS_TEXT: Record<string, string> = {
  live: 'Live',
  simulated: 'Simulated',
  connecting: 'Connecting',
};

function toMockProduct(p: Record<string, unknown>): MockProduct {
  return {
    id: String(p.id ?? ''),
    name: String(p.name ?? ''),
    category: String(p.category ?? 'Vegetables'),
    price: Number(p.price ?? 0),
    unit: String(p.unit ?? 'kg'),
    availableQty: Number(p.availableQty ?? 0),
    grade: String(p.grade ?? 'Grade A'),
    supplier: String(p.supplier ?? 'Verified FPO'),
    location: String(p.location ?? ''),
    harvestDate: String(p.harvestDate ?? ''),
    availability: String(p.availability ?? 'Ready Stock'),
    image: String(p.image ?? ''),
    minBulkQty: p.minBulkQty ? Number(p.minBulkQty) : undefined,
    bulkPrice: p.bulkPrice ? Number(p.bulkPrice) : undefined,
    brand: 'Farm Passport Verified',
  };
}

export default function Marketplace() {
  const feedStatus = useRealtimeStatus();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<MockProduct[]>(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/products')
      .then((res) => {
        if (cancelled || !res.data?.success) return;
        const mapped = (res.data.products ?? []).map((p: Record<string, unknown>) => toMockProduct(p));
        if (mapped.length > 0) setProducts(mapped);
      })
      .catch(() => {
        /* keep mockProducts when backend is down */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useRealtime('price:update', ({ productId, price }) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, price } : p)));
  });
  useRealtime('stock:update', ({ productId, availableQty }) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, availableQty } : p)));
  });

  const filtered = products.filter((p) => {
    const okCat = category === 'All' || p.category === category;
    const okQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase());
    return okCat && okQuery;
  });

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-extrabold text-lg text-text-primary">Browse Marketplace</h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                feedStatus === 'live'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
                  : feedStatus === 'connecting'
                    ? 'bg-white/10 text-text-muted border-white/20'
                    : 'bg-soil-gold/15 text-soil-gold border-soil-gold/30'
              }`}
              title={FEED_STATUS_TEXT[feedStatus] ?? 'Connecting'}
            >
              <Radio className="w-3 h-3" />
              <span className="relative flex h-1.5 w-1.5">
                {feedStatus !== 'connecting' && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${feedStatus === 'live' ? 'bg-emerald-400' : 'bg-soil-gold'}`} />
                )}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${feedStatus === 'live' ? 'bg-emerald-400' : feedStatus === 'simulated' ? 'bg-soil-gold' : 'bg-text-muted'}`} />
              </span>
              {FEED_STATUS_TEXT[feedStatus] ?? 'Connecting'}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">Verified FPO products with live pricing and digital farm passports</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="glass-panel-sm p-1 flex items-center gap-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${view === 'grid' ? 'bg-soil-gold/25 text-soil-gold' : 'text-text-muted'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${view === 'list' ? 'bg-soil-gold/25 text-soil-gold' : 'text-text-muted'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          {/* Category filter */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-panel-sm pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-text-primary focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-soil-forest">{c}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-soil-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-soil-gold absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, locations..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
        />
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-text-muted py-12 glass-panel-sm rounded-2xl">
          <Loader2 className="w-4 h-4 animate-spin text-soil-gold" /> Loading live catalog...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 glass-panel-sm rounded-2xl">
          <div className="text-3xl mb-2">🥬</div>
          <div className="font-bold text-text-primary">No products found</div>
          <p className="text-xs text-text-muted mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} allProducts={products} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="glass-panel-sm p-3 flex items-center gap-4">
              <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-text-primary">{p.name}</div>
                <div className="text-[11px] text-text-muted">{p.location} · {p.supplier} · {p.grade}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-soil-gold">₹{p.price.toFixed(2)}/<span className="text-xs">{p.unit}</span></div>
                <div className={`text-[10px] ${p.availableQty === 0 ? 'text-red-400 font-bold' : 'text-text-muted'}`}>
                  {p.availableQty === 0 ? 'Out of Stock' : `${p.availableQty} kg available`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
