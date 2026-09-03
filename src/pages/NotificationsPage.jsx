import React, { useState } from 'react';
import { Bell, Sparkles, AlertTriangle, Truck, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const [filter, setFilter] = useState('ALL'); // ALL, AI, SUPPLY, ORDERS

  const filtered = notifications.filter((n) => {
    if (filter === 'AI') return n.type.includes('AI') || n.type.includes('WASTE');
    if (filter === 'LOGISTICS') return n.type.includes('LOGISTICS');
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-display font-bold text-2xl text-agri-dark">
            Notification Center & Agro-Alerts
          </h1>
          <p className="text-xs text-gray-500">
            Real-time notifications across demand changes, waste alerts, and delivery milestones
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-xs font-bold text-agri-deep hover:underline cursor-pointer self-start sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['ALL', 'AI', 'LOGISTICS'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filter === f
                ? 'bg-agri-dark text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
              n.read ? 'bg-white border-gray-200' : 'bg-agri-soft border-agri-bright/40 shadow-sm'
            }`}
          >
            <div className="p-2 rounded-xl bg-white shadow-sm border border-gray-100 text-lg">
              {n.type.includes('AI') ? '📈' : n.type.includes('WASTE') ? '⚠️' : '🚚'}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                <span className="text-[10px] text-gray-400">{n.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
