import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Trash2, AlertTriangle, TrendingUp, DollarSign, Box } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { GlassCard, FadeIn } from '../components/ui/primitives';

export default function FarmInventoryPage() {
  const { items, updateQuantity, addItem, removeItem, getStats } = useInventoryStore();
  const stats = getStats();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Vegetables');
  const [newQty, setNewQty] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [newUnit, setNewUnit] = useState('kg');

  const handleAdd = () => {
    if (!newName || newQty <= 0) return;
    addItem({
      name: newName,
      category: newCategory,
      quantity: newQty,
      unit: newUnit,
      pricePerUnit: newPrice,
      grade: 'Grade A',
      harvestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      storageLocation: 'Main Storage',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=60',
    });
    setNewName('');
    setNewQty(0);
    setNewPrice(0);
    setShowAdd(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Farm Inventory</h1>
          <p className="text-xs text-text-muted mt-1">Manage your stock levels and track produce</p>
        </div>
        <Link to="/marketplace" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassCard small className="p-3 text-center">
          <Box className="w-4 h-4 text-soil-gold mx-auto mb-1" />
          <div className="font-extrabold text-lg text-soil-gold">{stats.totalItems}</div>
          <div className="text-[9px] text-text-muted">Total Products</div>
        </GlassCard>
        <GlassCard small className="p-3 text-center">
          <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="font-extrabold text-lg text-emerald-400">₹{stats.totalValue.toLocaleString()}</div>
          <div className="text-[9px] text-text-muted">Total Value</div>
        </GlassCard>
        <GlassCard small className="p-3 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="font-extrabold text-lg text-amber-400">{stats.lowStockCount}</div>
          <div className="text-[9px] text-text-muted">Low Stock</div>
        </GlassCard>
        <GlassCard small className="p-3 text-center">
          <Package className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <div className="font-extrabold text-lg text-red-400">{stats.outOfStockCount}</div>
          <div className="text-[9px] text-text-muted">Out of Stock</div>
        </GlassCard>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-soil-emerald to-soil-leaf text-white text-xs font-bold cursor-pointer hover:brightness-110 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <GlassCard className="p-4 space-y-3">
          <h3 className="font-bold text-sm text-text-primary">Add New Product</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Product name" className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald" />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none cursor-pointer">
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
            <input type="number" value={newQty || ''} onChange={(e) => setNewQty(Number(e.target.value))} placeholder="Qty" className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald" />
            <input type="number" value={newPrice || ''} onChange={(e) => setNewPrice(Number(e.target.value))} placeholder="Price/kg" className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-soil-emerald/40 text-emerald-300 text-xs font-bold cursor-pointer hover:bg-soil-emerald/60 transition">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl bg-white/5 text-text-muted text-xs font-bold cursor-pointer hover:bg-white/10 transition">Cancel</button>
          </div>
        </GlassCard>
      )}

      {/* Inventory List */}
      <div className="space-y-2">
        {items.map((item) => (
          <FadeIn key={item.id}>
            <GlassCard small className="p-3 flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-text-primary">{item.name}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.status === 'in_stock' ? 'bg-emerald-500/15 text-emerald-400' :
                    item.status === 'low_stock' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-[9px] text-text-muted">{item.grade} · {item.storageLocation} · Harvested {item.harvestDate}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 25))} className="w-6 h-6 rounded-lg bg-white/10 text-text-muted text-xs flex items-center justify-center cursor-pointer hover:bg-white/20">−</button>
                  <span className="text-[11px] font-bold text-soil-gold w-12 text-center">{item.quantity} {item.unit}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 25)} className="w-6 h-6 rounded-lg bg-white/10 text-text-muted text-xs flex items-center justify-center cursor-pointer hover:bg-white/20">+</button>
                </div>
                <div className="text-right w-16">
                  <div className="text-[10px] font-bold text-text-primary">₹{item.pricePerUnit}/{item.unit}</div>
                  <div className="text-[8px] text-text-muted">₹{(item.quantity * item.pricePerUnit).toLocaleString()}</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-1 text-text-muted hover:text-red-400 transition cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
