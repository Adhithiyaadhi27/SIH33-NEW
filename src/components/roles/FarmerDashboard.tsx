import { useState, type ChangeEvent, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Sprout,
  Package,
  Boxes,
  Wallet,
  ShoppingBag,
  Store,
  Plus,
  Pencil,
  Trash2,
  ClipboardList,
  TrendingUp,
  MapPin,
  Check,
  X,
  Truck,
  Camera,
  ImageOff,
} from 'lucide-react';
import { GlassCard, MetricTile, GlassBadge, GlassButton, SectionHeading, FadeIn, DemoDataBadge } from '../ui/primitives';
import { DashboardSkeleton } from '../ui/skeleton';
import { usePageLoading } from '../../hooks/usePageLoading';
import { mockProducts, type MockProduct } from '../../data/mockProducts';
import { mockOrders, type MockOrder } from '../../data/mockOrders';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useFarmerProductsStore, FARMER_ORG } from '../../store/farmerProductsStore';
import { useOrderTrackingStore, type TrackedOrder } from '../../store/orderTrackingStore';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80';

interface ProductFormState {
  name: string;
  category: string;
  description: string;
  price: string;
  unit: string;
  availableQty: string;
  availability: string;
  image: string;
}

type FarmerOrderStatus = MockOrder['status'] | 'CANCELLED';

interface FarmerOrder {
  id: string;
  product: string;
  quantityKg: number;
  from: string;
  to: string;
  eta: string;
  status: FarmerOrderStatus;
}

const toFarmerOrder = (o: MockOrder): FarmerOrder => ({ ...o });

// Maps the consumer tracking pipeline onto the farmer's order vocabulary so
// marketplace purchases flow into the farmer's queue as PENDING orders.
const TRACKED_TO_FARMER_STATUS: Record<TrackedOrder['status'], FarmerOrderStatus> = {
  confirmed: 'PENDING',
  processing: 'AGGREGATING',
  dispatched: 'AGGREGATING',
  in_transit: 'IN_TRANSIT',
  delivered: 'DELIVERED',
};

const EMPTY_FORM: ProductFormState = {
  name: '',
  category: 'Vegetables',
  description: '',
  price: '',
  unit: 'kg',
  availableQty: '',
  availability: 'Ready Stock',
  image: '',
};

const INPUT_CLASS =
  'w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-text-primary placeholder-text-muted focus:border-soil-gold/50 focus:outline-none transition';

const statusBadge = (status: string) => {
  const lower = status.toLowerCase();
  if (lower.includes('out')) return 'bg-red-500/15 text-red-300 border-red-400/30';
  if (lower.includes('low')) return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
  return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30';
};

const ORDER_STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-300',
  AGGREGATING: 'bg-sky-500/15 text-sky-300',
  IN_TRANSIT: 'bg-emerald-500/15 text-emerald-300',
  DELIVERED: 'bg-white/10 text-text-muted',
  CANCELLED: 'bg-red-500/15 text-red-300',
};

function formatInr(value: number) {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

// Reads a user-selected image, downscales it (max 480px wide) and returns a
// JPEG data URL so it can be persisted to localStorage with the product.
function fileToResizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        const MAX_W = 480;
        const scale = Math.min(1, MAX_W / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unsupported'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function FarmerDashboard() {
  const loading = usePageLoading();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer Raman';
  const org = user?.organization ?? FARMER_ORG;
  const location = user?.city ?? user?.location ?? 'Madurai';

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [saveError, setSaveError] = useState('');
  const [farmerOrders, setFarmerOrders] = useState<FarmerOrder[]>(() => mockOrders.map(toFarmerOrder));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const [searchParams] = useSearchParams();
  const farmerProducts = useFarmerProductsStore((s) => s.products);
  const descriptions = useFarmerProductsStore((s) => s.descriptions);
  const addProduct = useFarmerProductsStore((s) => s.addProduct);
  const updateProduct = useFarmerProductsStore((s) => s.updateProduct);
  const removeProduct = useFarmerProductsStore((s) => s.removeProduct);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setShowForm(true);
  };

  useEffect(() => {
    const section = searchParams.get('section');
    const action = searchParams.get('action');
    if (action === 'add') {
      const timer = setTimeout(() => {
        openAddForm();
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
    if (!section) return;
    const id = section === 'products' ? 'products' : section === 'orders' ? 'orders' : null;
    if (id) {
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const onlineOrders = useOrderTrackingStore((s) => s.orders);
  const updateTrackedStatus = useOrderTrackingStore((s) => s.updateStatus);
  const farmerProductIds = new Set(farmerProducts.map((p) => p.id));

  const onlineFarmerRows = onlineOrders
    .filter((o) => o.items?.some((i) => farmerProductIds.has(i.productId)))
    .map((o) => ({
      id: o.id,
      product: o.productName.replace(/\s*\(.*?\)\s*$/, '').trim() || o.productName,
      quantityKg: (o.items ?? []).reduce((sum, i) => sum + i.quantity, 0),
      amount: o.total,
      date: o.orderDate,
      from: 'Online Marketplace',
      to: o.deliveryAddress,
      eta: o.eta,
      status: TRACKED_TO_FARMER_STATUS[o.status],
    }));

  const priceOf = (name: string) => mockProducts.find((p) => p.name === name)?.price ?? 30;
  const transactions = [
    ...onlineFarmerRows.map((o) => ({
      id: o.id,
      product: o.product,
      qty: o.quantityKg,
      amount: o.amount,
      status: o.status,
      date: o.date,
    })),
    ...farmerOrders.map((o) => ({
      id: o.id,
      product: o.product,
      qty: o.quantityKg,
      amount: o.quantityKg * priceOf(o.product),
      status: o.status,
      date: o.eta,
    })),
  ];

  const totalStockQty = farmerProducts.reduce((sum, p) => sum + p.availableQty, 0);
  const totalStockValue = farmerProducts.reduce((sum, p) => sum + p.price * p.availableQty, 0);
  const totalEarnings = transactions.filter((t) => t.status !== 'CANCELLED').reduce((sum, t) => sum + t.amount, 0);
  const activeOrders = [...onlineFarmerRows, ...farmerOrders].filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;

  const allOrderRows: Array<{ online: boolean } & (typeof onlineFarmerRows)[number] | { online: boolean } & FarmerOrder> = [
    ...onlineFarmerRows.map((o) => ({ ...o, online: true })),
    ...farmerOrders.map((o) => ({ ...o, online: false })),
  ];

  const setField =
    (field: keyof ProductFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const openEditForm = (p: MockProduct) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      description: descriptions[p.id] ?? '',
      price: String(p.price),
      unit: p.unit,
      availableQty: String(p.availableQty),
      availability: p.availability,
      image: p.image,
    });
    setSaveError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setSaveError('');
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch {
      pushToast({ title: 'Image upload failed', message: 'Could not read that file. Try a different image.', type: 'error' });
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setSaveError('Product name is required.');
      return;
    }
    const price = Number(form.price);
    const qty = Number(form.availableQty);
    if (!price || price <= 0) {
      setSaveError('Enter a valid price.');
      return;
    }
    if (Number.isNaN(qty) || qty < 0) {
      setSaveError('Enter a valid available quantity.');
      return;
    }

    const productImage = form.image.trim() || FALLBACK_IMAGE;

    if (editingId) {
      updateProduct(
        editingId,
        { name: form.name.trim(), category: form.category, price, unit: form.unit || 'kg', availableQty: qty, availability: form.availability, image: productImage },
        form.description,
      );
      pushToast({ title: 'Product updated', message: `${form.name.trim()} was updated and is live in the marketplace`, type: 'success' });
    } else {
      const newId = `prod_own_${Date.now()}`;
      const newProduct: MockProduct = {
        id: newId,
        name: form.name.trim(),
        category: form.category,
        price,
        unit: form.unit || 'kg',
        availableQty: qty,
        grade: 'Grade A',
        supplier: org,
        location,
        harvestDate: '11-Sep 2026',
        availability: form.availability,
        image: productImage,
        brand: 'Farm Passport Verified',
      };
      addProduct(newProduct, form.description);
      pushToast({ title: 'Product listed', message: `${newProduct.name} is now live in the marketplace`, type: 'success' });
    }
    closeForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from your listed products? This removes it from the marketplace.`)) return;
    removeProduct(id);
  };

  const setOrderStatus = (id: string, status: FarmerOrderStatus, message: string, toastType: 'success' | 'error' = 'success') => {
    setFarmerOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    pushToast({ title: message, message: `${id} updated in your order queue`, type: toastType });
  };

  const setOnlineOrderStatus = (id: string, status: TrackedOrder['status'], message: string, toastType: 'success' | 'error' = 'success') => {
    updateTrackedStatus(id, status);
    pushToast({ title: message, message: `${id} updated in your order queue`, type: toastType });
  };

  const acceptOrder = (id: string, online: boolean) => {
    if (online) setOnlineOrderStatus(id, 'processing', 'Order accepted');
    else setOrderStatus(id, 'AGGREGATING', 'Order accepted');
  };
  const rejectOrder = (id: string) => setOrderStatus(id, 'CANCELLED', 'Order rejected', 'error');

  const dispatchOrder = (id: string, online: boolean) => {
    if (online) setOnlineOrderStatus(id, 'in_transit', 'Order dispatched');
    else {
      setFarmerOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'IN_TRANSIT', eta: 'Today EOD' } : o)));
      pushToast({ title: 'Consignment dispatched', message: `${id} is now in transit to the destination hub`, type: 'success' });
    }
  };

  if (loading) {
    return <DashboardSkeleton metricCount={4} listCount={3} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <GlassBadge gold>
              <Sprout className="w-3 h-3" /> Farmer Portal
            </GlassBadge>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary mt-2">Farmer Dashboard</h1>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-soil-gold" />
              Welcome back, <span className="font-bold text-text-secondary">{firstName}</span> · {org} · {location}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DemoDataBadge />
            <GlassButton variant="gold" onClick={openAddForm}>
              <Plus className="w-4 h-4" /> Add Product
            </GlassButton>
          </div>
        </div>
      </FadeIn>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile label="Listed Products" value={String(farmerProducts.length)} icon={<Package className="w-5 h-5" />} accent="text-soil-gold" />
        <MetricTile label="Available Stock" value={`${formatInr(totalStockQty)} kg`} icon={<Boxes className="w-5 h-5" />} accent="text-soil-mint" />
        <MetricTile label="Total Earnings" value={`₹${formatInr(totalEarnings)}`} icon={<Wallet className="w-5 h-5" />} accent="text-soil-goldSoft" />
        <MetricTile label="Active Orders" value={String(activeOrders)} icon={<ShoppingBag className="w-5 h-5" />} accent="text-emerald-300" />
      </div>

      {/* Add / Edit product form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-soil-gold" />
                <h2 className="font-display font-bold text-base text-text-primary">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Product Name</label>
                  <input className={INPUT_CLASS} placeholder="e.g. Cauliflower" value={form.name} onChange={setField('name')} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Category</label>
                  <select className={INPUT_CLASS} value={form.category} onChange={setField('category')}>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Description</label>
                  <textarea
                    className={`${INPUT_CLASS} min-h-[72px] resize-none`}
                    placeholder="Describe your produce, farming practices, grade…"
                    value={form.description}
                    onChange={setField('description')}
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Product Photo</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {form.image ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-soil-gold/30 bg-soil-deep/40 shrink-0">
                        <img src={form.image} alt="Product preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl border border-dashed border-white/20 bg-soil-deep/40 flex flex-col items-center justify-center gap-1 text-text-muted shrink-0">
                        <ImageOff className="w-4 h-4" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">No photo</span>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <GlassButton variant="ghost" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="w-3.5 h-3.5" /> {form.image ? 'Change Photo' : 'Upload Photo'}
                      </GlassButton>
                      {form.image && (
                        <button
                          onClick={() => setForm((f) => ({ ...f, image: '' }))}
                          className="block text-[10px] font-bold text-red-300 hover:text-red-200 transition cursor-pointer"
                        >
                          Remove photo
                        </button>
                      )}
                      <div className="text-[9px] text-text-muted">JPG/PNG, auto-resized. Saved with your product.</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Price (₹)</label>
                  <input className={INPUT_CLASS} type="number" min="0" step="0.5" placeholder="e.g. 35" value={form.price} onChange={setField('price')} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Unit</label>
                  <input className={INPUT_CLASS} placeholder="e.g. kg, dozen, piece" value={form.unit} onChange={setField('unit')} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Available Quantity</label>
                  <input className={INPUT_CLASS} type="number" min="0" step="1" placeholder="e.g. 500" value={form.availableQty} onChange={setField('availableQty')} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Availability</label>
                  <select className={INPUT_CLASS} value={form.availability} onChange={setField('availability')}>
                    <option>Ready Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>

              {saveError && (
                <div className="mt-3.5 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-400/30 rounded-xl px-3.5 py-2.5">
                  {saveError}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <GlassButton variant="green" onClick={handleSave}>
                  <Check className="w-4 h-4" /> Save Product
                </GlassButton>
                <GlassButton variant="ghost" onClick={closeForm}>
                  <X className="w-4 h-4" /> Cancel
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browse Marketplace */}
      <FadeIn delay={0.05}>
        <section className="space-y-4">
          <SectionHeading
            kicker="Marketplace"
            title="Browse Marketplace"
            subtitle="Consumer-facing prices across the Maanvasam marketplace — see what your produce sells for."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {mockProducts.map((p) => (
              <div
                key={p.id}
                className="glass-panel-sm overflow-hidden group hover:border-soil-gold/40 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-32 overflow-hidden bg-soil-deep/60">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-[9px] font-bold text-text-primary">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-[9px] font-bold border ${statusBadge(p.availability)}`}>
                      {p.availability}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-1.5 flex-1 flex flex-col">
                  <div>
                    <h4 className="font-display font-bold text-sm text-text-primary">{p.name}</h4>
                    <p className="text-[10px] text-text-muted">{p.location} · {p.supplier}</p>
                  </div>
                  <div className="mt-auto flex items-baseline justify-between gap-2">
                    <span className="text-base font-extrabold text-soil-gold">
                      ₹{p.price.toFixed(2)}
                      <span className="text-[10px] text-text-muted font-semibold">/{p.unit}</span>
                    </span>
                    <span className="text-[10px] text-text-muted">{p.availableQty.toLocaleString()} in stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* My Products */}
      <FadeIn delay={0.1}>
        <section id="products" className="space-y-4 scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading
              kicker="My Store"
              title="My Products"
              subtitle={`${farmerProducts.length} product(s) listed under ${org}.`}
            />
            <GlassButton onClick={openAddForm}>
              <Plus className="w-4 h-4" /> Add Product
            </GlassButton>
          </div>

          <div className="space-y-2.5">
            {farmerProducts.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Store className="w-8 h-8 mx-auto text-text-muted mb-2" />
                <div className="font-bold text-sm text-text-primary">No products yet</div>
                <p className="text-[11px] text-text-muted mt-1">Add your first product to start selling.</p>
              </GlassCard>
            ) : (
              farmerProducts.map((p) => (
                <div
                  key={p.id}
                  className="glass-panel-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3 transition hover:border-soil-gold/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-text-primary">{p.name}</div>
                      <div className="text-[10px] text-text-muted flex items-center gap-1.5">
                        <GlassBadge className="!px-2 !py-0">{p.category}</GlassBadge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-sm text-soil-gold">
                      ₹{p.price.toFixed(2)}
                      <span className="text-[10px] text-text-muted">/{p.unit}</span>
                    </div>
                    <div className="text-[10px] text-text-muted">{p.availableQty.toLocaleString()} {p.unit} in stock</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusBadge(p.availability)}`}>
                      {p.availability}
                    </span>
                    <GlassButton variant="ghost" className="!px-3 !py-1.5 !text-[11px] !text-soil-goldSoft" onClick={() => openEditForm(p)}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </GlassButton>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/25 transition cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </FadeIn>

      {/* Orders + Earnings */}
      <div id="orders" className="grid lg:grid-cols-2 gap-5 scroll-mt-28">
        {/* Orders */}
        <FadeIn delay={0.15}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-soil-gold" />
              <h2 className="font-display font-bold text-base text-text-primary">Recent Orders</h2>
            </div>
            <GlassCard className="p-4 space-y-2.5">
              {allOrderRows.map((o) => (
                <div key={o.id} className="glass-panel-sm px-3.5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{o.id}</span>
                      {o.online && (
                        <span className="px-1.5 py-0.5 rounded-full bg-soil-mint/15 text-soil-mint border border-soil-mint/30 text-[8px] font-bold uppercase tracking-wider">Online</span>
                      )}
                      <span className="font-bold text-text-primary">{o.product}</span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-1">
                      Buyer: <span className="text-text-secondary font-semibold">{o.to}</span> · {o.quantityKg.toLocaleString()} kg
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="text-[10px] text-text-muted">{o.eta}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ORDER_STATUS_BADGE[o.status] ?? 'bg-white/10 text-text-muted'}`}>
                      {o.status.replace('_', ' ')}
                    </span>
                    {o.status === 'PENDING' && (
                      <>
                        <GlassButton variant="green" onClick={() => acceptOrder(o.id, o.online)} className="!px-2.5 !py-1 !text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Accept
                        </GlassButton>
                        {!o.online && (
                          <GlassButton variant="ghost" onClick={() => rejectOrder(o.id)} className="!px-2.5 !py-1 !text-[10px] flex items-center gap-1 !text-red-300">
                            <X className="w-3 h-3" /> Reject
                          </GlassButton>
                        )}
                      </>
                    )}
                    {o.status === 'AGGREGATING' && (
                      <GlassButton variant="gold" onClick={() => dispatchOrder(o.id, o.online)} className="!px-2.5 !py-1 !text-[10px] flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Dispatch
                      </GlassButton>
                    )}
                  </div>
                </div>
              ))}
            </GlassCard>
          </section>
        </FadeIn>

        {/* Earnings Summary */}
        <FadeIn delay={0.2}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-soil-gold" />
              <h2 className="font-display font-bold text-base text-text-primary">Earnings Summary</h2>
            </div>
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Earnings</div>
                  <div className="font-display font-extrabold text-3xl text-soil-gold">₹{formatInr(totalEarnings)}</div>
                  <div className="text-[10px] text-text-muted mt-1">across {transactions.length} order(s)</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-soil-gold/15 border border-soil-gold/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-soil-gold" />
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <div className="flex items-center justify-between rounded-xl bg-soil-deep/40 px-3.5 py-2.5 text-xs">
                <span className="text-text-muted">Current stock value</span>
                <span className="font-bold text-soil-mint">₹{formatInr(totalStockValue)}</span>
              </div>

              <div className="space-y-2">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'DELIVERED' ? 'bg-soil-mint' : t.status === 'CANCELLED' ? 'bg-red-400' : 'bg-soil-gold'}`} />
                      <span className={`text-[11px] truncate ${t.status === 'CANCELLED' ? 'text-text-muted line-through' : 'text-text-primary font-semibold'}`}>{t.product}</span>
                      <span className="text-text-muted">× {t.qty.toLocaleString()} kg</span>
                    </div>
                    <span className="font-bold text-text-secondary shrink-0">₹{formatInr(t.amount)}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}