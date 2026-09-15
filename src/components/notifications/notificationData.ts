import { Bell, Package, Truck, TrendingUp, AlertTriangle, IndianRupee, UserPlus, RefreshCw, ShoppingBag } from 'lucide-react';
import type { RoleName } from '../../store/roleStore';

export interface AppNotification {
  id: string;
  role: RoleName;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const ROLE_NOTIFICATIONS: Record<RoleName, Omit<AppNotification, 'read'>[]> = {
  ADMIN: [
    { id: 'admin1', role: 'ADMIN', type: 'USER', title: 'New User Registration', message: 'A new consumer registered from Chennai.', timestamp: '10 mins ago' },
    { id: 'admin2', role: 'ADMIN', type: 'PRODUCT', title: 'Product Approval Pending', message: 'Farmer Raman submitted a new product (Tomato).', timestamp: '32 mins ago' },
    { id: 'admin3', role: 'ADMIN', type: 'PAYMENT', title: 'Payment Issue Flagged', message: 'COD payment pending for order ORD-2026-5542.', timestamp: '1 hour ago' },
    { id: 'admin4', role: 'ADMIN', type: 'ORDER', title: 'New Order Received', message: 'Order #ORD-2026-8817 for 12kg vegetables.', timestamp: '2 hours ago' },
    { id: 'admin5', role: 'ADMIN', type: 'ALERT', title: 'Platform Alert', message: 'Server load at 78%. Auto-scaling enabled.', timestamp: '3 hours ago' },
  ],
  FARMER: [
    { id: 'farmer1', role: 'FARMER', type: 'ORDER', title: 'New Order Received', message: 'Consumer Priya ordered 5kg of your Tomatoes.', timestamp: '10 mins ago' },
    { id: 'farmer2', role: 'FARMER', type: 'PAYMENT', title: 'Payment Received', message: '₹750 credited to your account for order ORD-2026-8802.', timestamp: '1 hour ago' },
    { id: 'farmer3', role: 'FARMER', type: 'PRODUCT', title: 'Product Approved', message: 'Your Onion listing was approved and is now live.', timestamp: '3 hours ago' },
    { id: 'farmer4', role: 'FARMER', type: 'STOCK', title: 'Stock Running Low', message: 'Your Lettuce stock is below 20kg. Consider restocking.', timestamp: '5 hours ago' },
    { id: 'farmer5', role: 'FARMER', type: 'MARKET', title: 'Marketplace Update', message: 'Tomato prices rose 8% in Chennai marketplace.', timestamp: 'Yesterday' },
  ],
  CONSUMER: [
    { id: 'cons1', role: 'CONSUMER', type: 'ORDER', title: 'Order Confirmed', message: 'Your order ORD-2026-8817 has been confirmed.', timestamp: '10 mins ago' },
    { id: 'cons2', role: 'CONSUMER', type: 'ORDER', title: 'Order Packed', message: 'Your order is packed and ready for dispatch.', timestamp: '42 mins ago' },
    { id: 'cons3', role: 'CONSUMER', type: 'DELIVERY', title: 'Out for Delivery', message: 'Your order is out for delivery. ETA 45 minutes.', timestamp: '1 hour ago' },
    { id: 'cons4', role: 'CONSUMER', type: 'PAYMENT', title: 'Payment Confirmed', message: 'Your payment of ₹540 via UPI was successful.', timestamp: '2 hours ago' },
    { id: 'cons5', role: 'CONSUMER', type: 'PROMO', title: 'Fresh Stock Alert', message: 'New Apples arrived at ₹145/kg. Order now!', timestamp: '4 hours ago' },
  ],
};

export const TYPE_ICONS: Record<string, typeof Bell> = {
  ORDER: ShoppingBag,
  PAYMENT: IndianRupee,
  PRODUCT: Package,
  DELIVERY: Truck,
  STOCK: TrendingUp,
  MARKET: TrendingUp,
  ALERT: AlertTriangle,
  USER: UserPlus,
  PROMO: RefreshCw,
};

export const TYPE_COLORS: Record<string, string> = {
  ORDER: 'text-soil-gold',
  PAYMENT: 'text-emerald-300',
  PRODUCT: 'text-soil-mint',
  DELIVERY: 'text-blue-300',
  STOCK: 'text-amber-300',
  MARKET: 'text-soil-gold',
  ALERT: 'text-red-300',
  USER: 'text-purple-300',
  PROMO: 'text-emerald-300',
};