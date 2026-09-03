import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { HarvestBasketIcon, WiltingSproutIcon } from './NatureIllustrations';

export default function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handlePlaceOrder = async () => {
    setIsCheckingOut(true);
    try {
      const orderPayload = {
        mode: 'Everyday Purchase',
        items,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: 'UPI (Instant Settlement)'
      };
      const res = await api.createOrder(orderPayload);
      setOrderComplete(res.order);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => {
          setIsDrawerOpen(false);
          setOrderComplete(null);
        }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-nature-card shadow-nature-lg flex flex-col border-l border-nature-soft/40">
          {/* Header */}
          <div className="p-4 bg-nature-bgSoft border-b border-nature-soft/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧺</span>
              <h2 className="font-display font-bold text-lg text-nature-primary">
                Fresh Produce Basket
              </h2>
            </div>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setOrderComplete(null);
              }}
              className="p-1 rounded-xl text-nature-earth hover:text-nature-primary hover:bg-white cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderComplete ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in">
                <HarvestBasketIcon className="w-24 h-24 mx-auto" />
                <h3 className="font-display font-bold text-xl text-nature-primary">Harvest Secured!</h3>
                <p className="text-xs text-nature-text/80 px-4">
                  Order ID <strong className="text-nature-primary">{orderComplete.id}</strong> has been transmitted directly to GreenValley FPO for instant harvest packhouse dispatch.
                </p>
                <div className="bg-nature-bgSoft p-3.5 rounded-2xl text-xs text-left space-y-1 text-nature-text border border-nature-soft/40">
                  <p><strong>Estimated Delivery:</strong> 45-60 mins via Veloce cold cargo</p>
                  <p><strong>Produce Passport:</strong> Dynamic batch QR generated</p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setOrderComplete(null);
                      navigate('/orders');
                    }}
                    className="w-full bg-nature-primary hover:bg-nature-hover text-white py-3 rounded-xl font-bold text-xs shadow-nature transition cursor-pointer"
                  >
                    Track Live Delivery
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setOrderComplete(null);
                      navigate('/produce-passport');
                    }}
                    className="w-full bg-nature-pale text-nature-primary py-2.5 rounded-xl font-bold hover:bg-nature-soft/60 text-xs transition cursor-pointer"
                  >
                    View Batch Passport
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <WiltingSproutIcon className="w-20 h-20 mx-auto" />
                <h3 className="font-bold text-nature-primary">Your basket is empty</h3>
                <p className="text-xs text-nature-text/70 max-w-xs mx-auto">
                  Browse fresh farm harvests on the Blinkit-style instant catalog and add farm-direct produce.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white p-3.5 rounded-2xl border border-nature-soft/40 shadow-nature-sm items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-nature-soft/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-nature-primary truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-nature-text/70">
                      ₹{item.price} / {item.unit} &bull; <span className="text-nature-leaf font-bold">{item.grade}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-nature-bgSoft hover:bg-nature-pale flex items-center justify-center text-nature-text text-xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-nature-primary">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-nature-pale hover:bg-nature-soft flex items-center justify-center text-nature-primary text-xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-nature-primary block">
                      ₹{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-nature-tomato mt-2 cursor-pointer transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with checkout summary */}
          {!orderComplete && items.length > 0 && (
            <div className="p-4 bg-nature-bgSoft border-t border-nature-soft/40 space-y-3">
              <div className="space-y-1.5 text-xs text-nature-text/80">
                <div className="flex justify-between">
                  <span>Harvest Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Transit Dispatch</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-nature-primary pt-1 border-t border-nature-soft/30">
                  <span>Total Payable</span>
                  <span className="text-nature-primary text-base">₹{total}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-nature-primary bg-nature-pale px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 shrink-0 text-nature-leaf" />
                <span>Direct farmer realization guarantee & digital passport included.</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                className="w-full bg-nature-primary hover:bg-nature-hover text-white font-bold py-3 px-4 rounded-xl shadow-nature flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Securing Harvest...</span>
                ) : (
                  <>
                    <span>Proceed to Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
