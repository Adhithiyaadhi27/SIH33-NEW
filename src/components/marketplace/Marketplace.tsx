import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Search, Filter, Radio, Eye, ShoppingCart } from 'lucide-react';
import { GlassCard } from '../ui/primitives';
import { SkeletonCard } from '../ui/skeleton';
import { mockProducts, type MockProduct } from '../../data/mockProducts';
import { useRealtime, useRealtimeStatus } from '../../services/realtime';
import { useFlashDealStore, applyFlashUpdate } from '../../store/flashDealStore';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { useFarmerProductsStore } from '../../store/farmerProductsStore';
import api from '../../services/api';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetailsModal';

const CATEGORIES = ['All', 'Vegetables', 'Fruits'];
const ALLOWED_CATEGORIES = new Set(['Vegetables', 'Fruits']);

const FEED_STATUS_TEXT: Record<string, string> = {
  live: 'Live',
  simulated: 'Simulated',
  connecting: 'Connecting',
};

function cleanProductName(raw: string): string {
  return raw
    .split(/[()]/)
    .filter((part, i) => i % 2 === 0 || /^[\x20-\x7E]*$/.test(part))
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function toMockProduct(p: Record<string, unknown>): MockProduct {
  return {
    id: String(p.id ?? ''),
    name: cleanProductName(String(p.name ?? '')),
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
  const deals = useFlashDealStore((s) => s.deals);
  const cart = useMarketplaceStore((s) => s.cart);
  const inventoryItems = useInventoryStore((s) => s.items);
  const updateInventoryStock = useInventoryStore((s) => s.updateQuantity);
  const farmerProducts = useFarmerProductsStore((s) => s.products);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<MockProduct[]>(mockProducts);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState<MockProduct | null>(null);

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
    updateInventoryStock(productId, availableQty);
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, availableQty } : p)));
  });
  useRealtime('flash:update', (payload) => {
    applyFlashUpdate(payload);
  });

  // Core inventory store is the single source of truth for stock, so
  // marketplace availability stays consistent with purchases made on the
  // consumer cart/checkout flow (spec §23: updated quantity reflected
  // wherever inventory is displayed).
  const stockById = inventoryItems.reduce<Record<string, number>>((map, item) => {
    map[item.id] = item.quantity;
    return map;
  }, {});

  // Merge farmer-listed products (spec §18 → §19): farmer additions override
  // catalog entries with the same id (reflecting their latest stock/price edits)
  // and brand-new listings are appended so consumers can buy them.
  const mergedBase = [...products];
  farmerProducts.forEach((fp) => {
    const idx = mergedBase.findIndex((p) => p.id === fp.id);
    if (idx >= 0) mergedBase[idx] = { ...fp };
    else mergedBase.push({ ...fp });
  });

  const displayProducts = mergedBase.map((p) => ({
    ...p,
    availableQty: stockById[p.id] !== undefined ? stockById[p.id] : p.availableQty,
  }));

  const filtered = displayProducts.filter((p) => {
    if (!ALLOWED_CATEGORIES.has(p.category)) return false;
    if (/oosimadai/i.test(p.name)) return false;
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
          <p className="text-xs text-text-muted mt-0.5">Verified vegetables and fruits with live pricing</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
            <ProductCard key={p.id} product={p} onViewDetail={setDetailProduct} />
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
                {deals[p.id] ? (
                  <div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="line-through text-[10px] text-text-muted">₹{deals[p.id].originalPrice.toFixed(2)}</span>
                      <span className="font-extrabold text-red-300">₹{deals[p.id].price.toFixed(2)}</span>
                    </div>
                    <span className="text-[9px] font-bold text-red-300">FLASH {deals[p.id].discountPct}% OFF</span>
                  </div>
                ) : (
                  <div className="font-extrabold text-soil-gold">₹{p.price.toFixed(2)}/<span className="text-xs">{p.unit}</span></div>
                )}
                <div className={`text-[10px] ${p.availableQty === 0 ? 'text-red-400 font-bold' : 'text-text-muted'}`}>
                  {p.availableQty === 0 ? 'Out of Stock' : `${p.availableQty} ${p.unit} available`}
                </div>
                {cart.some((i) => i.id === p.id) && (
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/25">
                    <ShoppingCart className="w-2.5 h-2.5" /> {cart.find((i) => i.id === p.id)?.quantity ?? 0} in cart
                  </span>
                )}
              </div>
              <button
                onClick={() => setDetailProduct(p)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-soil-gold border border-soil-gold/30 hover:bg-soil-gold/10 transition cursor-pointer"
              >
                <Eye className="w-3 h-3" /> View
              </button>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailsModal key={detailProduct.id} product={detailProduct} onClose={() => setDetailProduct(null)} />
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
