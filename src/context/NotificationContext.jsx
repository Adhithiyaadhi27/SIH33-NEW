import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_1",
    role: "all",
    type: "AI_DEMAND_ALERT",
    title: "📈 Regional Demand Surge Forecast",
    message: "AI Predictor forecasts +42% tomato demand in Chennai over the next 14 days due to festival season.",
    time: "10 mins ago",
    read: false
  },
  {
    id: "notif_2",
    role: "Bulk Buyer",
    type: "SUPPLIER_MATCH",
    title: "🤝 Smart Aggregation Match Ready",
    message: "Requirement REQ-1 (5,000 kg Onion) has been 100% matched across 3 verified FPOs.",
    time: "45 mins ago",
    read: false
  },
  {
    id: "notif_3",
    role: "FPO",
    type: "WASTE_WARNING",
    title: "⚠️ Perishability & Waste Alert",
    message: "Salem Depot has 2,000 kg Tomatoes near shelf-life threshold. Automated flash discount and redirection active.",
    time: "2 hours ago",
    read: true
  },
  {
    id: "notif_4",
    role: "Logistics Partner",
    type: "LOGISTICS_ASSIGNMENT",
    title: "🚚 New Dispatch Corridor Assigned",
    message: "Assigned 16-Ton Nashik to Chennai Onion corridor (ORD-2026-5501). Pickup scheduled for 06:00 AM.",
    time: "3 hours ago",
    read: true
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        toast,
        showToast
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-agri-dark text-white px-5 py-3.5 rounded-xl shadow-2xl border border-agri-bright/40 flex items-center gap-3">
          <span className="text-xl">{toast.type === 'success' ? '🌱' : '⚠️'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
