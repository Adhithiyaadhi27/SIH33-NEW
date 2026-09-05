import { useState } from 'react';
import { LayoutGrid, List, Search, Filter } from 'lucide-react';
import { GlassCard } from '../ui/primitives';
import { mockProducts } from '../../data/mockProducts';
import { useRealtime } from '../../services/realtime';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Vegetables', 'Fruits'];

export default function Marketplace() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(mockProducts);

  // Live realtime pricing & stock updates
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display font-extrabold text-lg text-text-primary">Marketplace</h2>
          <p className="text-xs text-text-muted mt-0.5">Sample product listings, real-time pricing</p>
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
          placeholder="Search produce..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
        />
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 glass-panel-sm rounded-2xl">
          <div className="text-3xl mb-2">🥬</div>
          <div className="font-bold text-text-primary">No produce matches this filter</div>
          <p className="text-xs text-text-muted mt-1">Try adjusting your search or category.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="glass-panel-sm p-3 flex items-center gap-4">
              <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-text-primary">{p.name}</div>
                <div className="text-[11px] text-text-muted">{p.location} · {p.supplier} · {p.grade}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-soil-gold">₹{p.price.toFixed(2)}/<span className="text-xs">{p.unit}</span></div>
                <div className="text-[10px] text-text-muted">{p.availableQty} kg available</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}