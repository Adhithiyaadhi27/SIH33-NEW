import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  Truck,
  Layers,
  ArrowUpDown,
  Tag,
  CheckCircle2
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SmartAggregationWidget from '../components/SmartAggregationWidget';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WiltingSproutIcon, LeafVeinDivider } from '../components/NatureIllustrations';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices'];
const GRADES = ['All Grades', 'Grade A', 'Grade B'];

export default function Marketplace() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [activeMode, setActiveMode] = useState(role === 'Bulk Buyer' ? 'bulk' : 'retail'); // 'retail' or 'bulk'
  const [bulkTargetProduct, setBulkTargetProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedGrade, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedGrade !== 'All Grades') params.grade = selectedGrade;
      if (searchQuery) params.search = searchQuery;

      const res = await api.getProducts(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reliability') return b.supplierReliability - a.supplierReliability;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-nature-pattern">
      {/* Header Banner (PRD Section 11 & 16) */}
      <div className="hero-nature-gradient text-white rounded-basket-lg p-6 sm:p-10 shadow-nature-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-nature-pale">
            <span className="animate-pulse">⚡</span> Blinkit-Style Instant Stock Showcase
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            🥦 NEXT-GEN FRESH PRODUCE MARKETPLACE 🍎
          </h1>
          <p className="text-xs sm:text-base text-nature-pale/90 leading-relaxed">
            Real-time visual catalog displaying live fruit, vegetable, grain, and spice inventory directly sourced from verified FPOs and smallholder farmers.
          </p>

          {/* Purchasing Mode Toggle Switch (Everyday vs Bulk) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-black/30 p-1 rounded-2xl flex items-center gap-1 border border-white/20">
              <button
                onClick={() => setActiveMode('retail')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'retail'
                    ? 'bg-white text-nature-primary shadow-sm'
                    : 'text-nature-pale hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-nature-leaf" />
                <span>Everyday Purchase (Retail)</span>
              </button>
              <button
                onClick={() => setActiveMode('bulk')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'bulk'
                    ? 'bg-nature-orange text-white shadow-sm'
                    : 'text-nature-pale hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Bulk Procurement & Aggregation</span>
              </button>
            </div>
            {activeMode === 'bulk' && (
              <span className="text-xs text-nature-harvest font-medium">
                Showing commercial rates & multi-supplier smart aggregation
              </span>
            )}
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute right-[-40px] bottom-[-40px] w-96 h-96 bg-nature-leaf/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Multi-Supplier Smart Aggregation Widget (Visible in Bulk Mode) */}
      {activeMode === 'bulk' && (
        <div className="animate-in fade-in zoom-in-95">
          <SmartAggregationWidget
            requirement={{
              product: bulkTargetProduct ? bulkTargetProduct.name.split('(')[0] : 'Heritage Country Tomato',
              quantity: 5000
            }}
          />
        </div>
      )}

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-nature-earth absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search produce (e.g. Tomato, Madurai, Onion)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-nature-card border border-nature-soft/50 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nature-primary shadow-nature-sm"
            />
          </div>

          {/* Sort & Quality Grade Selectors */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 bg-nature-card border border-nature-soft/50 rounded-xl text-xs font-semibold text-nature-text focus:outline-none focus:ring-2 focus:ring-nature-primary shadow-nature-sm cursor-pointer"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-nature-card border border-nature-soft/50 rounded-xl text-xs font-semibold text-nature-text focus:outline-none focus:ring-2 focus:ring-nature-primary shadow-nature-sm cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
              <option value="reliability">Supplier Reliability</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-nature-primary text-white shadow-nature'
                  : 'bg-nature-card text-nature-text hover:bg-nature-bgSoft border border-nature-soft/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-nature p-4 animate-pulse space-y-3">
              <div className="w-full h-44 bg-nature-bgSoft rounded-2xl" />
              <div className="h-4 bg-nature-bgSoft rounded w-3/4" />
              <div className="h-3 bg-nature-bgSoft rounded w-1/2" />
              <div className="h-8 bg-nature-bgSoft rounded-xl" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-nature-card rounded-basket-lg border border-nature-soft/50 p-8 space-y-4 shadow-nature">
          <WiltingSproutIcon className="w-20 h-20 mx-auto" />
          <h3 className="font-display font-bold text-xl text-nature-primary">
            No produce matches this filter
          </h3>
          <p className="text-xs text-nature-text/70 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different agricultural category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedGrade('All Grades');
              setSearchQuery('');
            }}
            className="bg-nature-primary hover:bg-nature-hover text-white px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-nature-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBulkBuy={(prod) => {
                setBulkTargetProduct(prod);
                setActiveMode('bulk');
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      )}

      {/* Leaf Vein Divider at bottom */}
      <LeafVeinDivider />
    </div>
  );
}
