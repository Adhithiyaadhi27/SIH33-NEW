import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  FileText,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const TIMELINE_STEPS = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED'
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.getOrders();
      setOrders(res.orders || []);
      if (res.orders && res.orders.length > 0) {
        setSelectedOrder(res.orders[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStepIndex = (status) => {
    const idx = TIMELINE_STEPS.indexOf(status);
    return idx !== -1 ? idx : 5; // default in transit
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-agri-dark to-agri-deep text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl">
            Orders & Cold-Chain Tracking
          </h1>
          <p className="text-xs sm:text-sm text-agri-pale/90 mt-0.5">
            Full lifecycle visibility: PENDING &rarr; CONFIRMED &rarr; PROCESSING &rarr; READY &rarr; IN TRANSIT &rarr; DELIVERED
          </p>
        </div>
        <Link
          to="/marketplace"
          className="bg-white text-agri-dark hover:bg-agri-pale font-bold px-4 py-2 rounded-xl text-xs transition shadow self-start sm:self-auto"
        >
          Browse Fresh Catalog
        </Link>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-gray-900">
            Order Records ({orders.length})
          </h3>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedOrder?.id === ord.id
                    ? 'bg-agri-soft/80 border-agri-deep shadow-md ring-2 ring-agri-deep/10'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-agri-leaf bg-agri-pale px-2 py-0.5 rounded">
                      {ord.id}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">
                      {ord.items?.map(i => i.name).join(', ')}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ord.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-agri-pale text-agri-dark'
                  }`}>
                    {ord.orderStatus}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>Total: <strong>₹{ord.total}</strong></span>
                  <span>{ord.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Lifecycle Timeline */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400">Order ID: {selectedOrder.id}</span>
                  <h2 className="font-display font-bold text-2xl text-agri-dark mt-1">
                    ₹{selectedOrder.total} &bull; {selectedOrder.paymentStatus}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Delivery to: {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Downloading GST e-Invoice PDF...")}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice</span>
                  </button>
                  <Link
                    to="/refund"
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    Cancel / Refund
                  </Link>
                </div>
              </div>

              {/* Lifecycle Progress Bar (PRD Section 32) */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-agri-dark">
                  Lifecycle Progress Timeline
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-xs">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.orderStatus);
                    const isCompleted = idx <= currentIdx;
                    return (
                      <div key={step} className="space-y-1.5">
                        <div className={`h-2.5 rounded-full transition-all ${
                          isCompleted ? 'bg-agri-deep shadow-sm' : 'bg-gray-200'
                        }`} />
                        <span className={`text-[10px] block leading-tight font-semibold ${
                          isCompleted ? 'text-agri-dark font-bold' : 'text-gray-400'
                        }`}>
                          {step.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3 pt-2">
                <h4 className="font-display font-bold text-sm text-gray-900">
                  Harvest Items Manifest
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Batch ID</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Rate</th>
                        <th className="p-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {selectedOrder.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="p-3 font-bold text-gray-900">{item.name}</td>
                          <td className="p-3 font-mono text-agri-leaf">{item.batchId}</td>
                          <td className="p-3">{item.quantity} {item.unit}</td>
                          <td className="p-3">₹{item.price}/{item.unit}</td>
                          <td className="p-3 font-bold text-agri-dark">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <p className="text-sm text-gray-500">Select an order on the left to view timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
