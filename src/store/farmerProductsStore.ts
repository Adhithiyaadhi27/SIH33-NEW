import { create } from 'zustand';
import { mockProducts, type MockProduct } from '../data/mockProducts';
import { useInventoryStore } from './inventoryStore';

export const FARMER_PRODUCTS_KEY = 'mv_farmer_products';
export const FARMER_DESCRIPTIONS_KEY = 'mv_farmer_descriptions';
export const FARMER_ORG = 'GreenValley FPO';

function loadFarmerProducts(): MockProduct[] {
  try {
    const saved = localStorage.getItem(FARMER_PRODUCTS_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as MockProduct[];
    }
  } catch {
    /* fall back to seed catalog */
  }
  return mockProducts.filter((p) => p.supplier === FARMER_ORG);
}

function loadFarmerDescriptions(): Record<string, string> {
  try {
    const saved = localStorage.getItem(FARMER_DESCRIPTIONS_KEY);
    if (saved) return JSON.parse(saved) as Record<string, string>;
  } catch {
    /* ignore */
  }
  return {};
}

function persistProducts(products: MockProduct[]) {
  try {
    localStorage.setItem(FARMER_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    /* storage unavailable */
  }
}

function persistDescriptions(descriptions: Record<string, string>) {
  try {
    localStorage.setItem(FARMER_DESCRIPTIONS_KEY, JSON.stringify(descriptions));
  } catch {
    /* storage unavailable */
  }
}

// Keep the inventory store in sync so farmer-listed products can be validated
// against stock, reduced at checkout, and reflected in the marketplace.
function syncInventory(p: MockProduct) {
  const state = useInventoryStore.getState();
  const existing = state.items.find((i) => i.id === p.id);
  if (existing) {
    state.updateQuantity(p.id, p.availableQty);
  } else {
    state.addItem({
      id: p.id,
      name: p.name,
      category: p.category,
      quantity: p.availableQty,
      unit: p.unit,
      pricePerUnit: p.price,
      grade: p.grade,
      image: p.image,
    });
  }
}

interface FarmerProductsState {
  products: MockProduct[];
  descriptions: Record<string, string>;
  addProduct: (product: MockProduct, description: string) => void;
  updateProduct: (id: string, patch: Partial<MockProduct>, description?: string) => void;
  removeProduct: (id: string) => void;
  reduceStock: (id: string, qty: number) => void;
}

export const useFarmerProductsStore = create<FarmerProductsState>((set, get) => ({
  products: loadFarmerProducts(),
  descriptions: loadFarmerDescriptions(),

  addProduct: (product, description) => {
    syncInventory(product);
    set((state) => {
      const products = [product, ...state.products];
      const descriptions = description ? { ...state.descriptions, [product.id]: description } : state.descriptions;
      persistProducts(products);
      persistDescriptions(descriptions);
      return { products, descriptions };
    });
  },

  updateProduct: (id, patch, description) => {
    syncInventory({ ...get().products.find((p) => p.id === id), ...patch } as MockProduct);
    set((state) => {
      const products = state.products.map((p) => (p.id === id ? { ...p, ...patch } : p));
      const descriptions = description !== undefined ? { ...state.descriptions, [id]: description } : state.descriptions;
      persistProducts(products);
      persistDescriptions(descriptions);
      return { products, descriptions };
    });
  },

  removeProduct: (id) => {
    useInventoryStore.getState().removeItem(id);
    set((state) => {
      const products = state.products.filter((p) => p.id !== id);
      const descriptions = { ...state.descriptions };
      delete descriptions[id];
      persistProducts(products);
      persistDescriptions(descriptions);
      return { products, descriptions };
    });
  },

  // Called by the checkout flow so farmer-listed stock stays in sync after a
  // consumer purchase (spec §23: inventory consistency everywhere it's shown).
  reduceStock: (id, qty) => {
    set((state) => {
      const products = state.products.map((p) => {
        if (p.id !== id) return p;
        const availableQty = Math.max(0, p.availableQty - qty);
        const availability = availableQty <= 0 ? 'Out of Stock' : availableQty < 50 ? 'Low Stock' : p.availability;
        return { ...p, availableQty, availability };
      });
      persistProducts(products);
      return { products };
    });
  },
}));