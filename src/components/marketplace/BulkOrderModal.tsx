import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Package, Check, XCircle, MessageSquare } from 'lucide-react';
import { useNegotiationStore, type Negotiation } from '../../store/negotiationStore';
import { GlassCard } from '../ui/primitives';

interface BulkOrderModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  minBulkQty: number;
}

export default function BulkOrderModal({ open, onClose, productId, productName, productImage, originalPrice, minBulkQty }: BulkOrderModalProps) {
  const { createNegotiation, sendBuyerMessage, acceptOffer, negotiations } = useNegotiationStore();
  const [qty, setQty] = useState(minBulkQty);
  const [offerPrice, setOfferPrice] = useState(originalPrice);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeNegId, setActiveNegId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const activeNeg = activeNegId ? negotiations.find((n) => n.id === activeNegId) : null;

  const handleStartNegotiation = () => {
    const negId = createNegotiation(productId, productName, productImage, originalPrice, qty);
    setActiveNegId(negId);
    sendBuyerMessage(negId, `I'd like to order ${qty}kg at ₹${offerPrice}/kg. Total: ₹${(qty * offerPrice).toLocaleString()}`, offerPrice);
    setChatOpen(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeNegId) return;
    sendBuyerMessage(activeNegId, messageText);
    setMessageText('');
  };

  const handleClose = () => {
    setChatOpen(false);
    setActiveNegId(null);
    setMessageText('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!chatOpen ? (
              /* Order Form */
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-soil-deep/60">
                      <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-text-primary">Bulk Order Request</h3>
                      <p className="text-[10px] text-text-muted">{productName}</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"><X className="w-4 h-4 text-text-muted" /></button>
                </div>

                <div className="glass-panel-sm p-3 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide">Quantity (min {minBulkQty}kg)</label>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(minBulkQty, Number(e.target.value)))}
                      min={minBulkQty}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-soil-emerald"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide">Your Offer Price (₹/{originalPrice > 100 ? 'kg' : 'kg'})</label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-soil-emerald"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Listed Price:</span>
                    <span className="text-text-primary">₹{originalPrice}/kg</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Your Offer:</span>
                    <span className="text-soil-gold font-bold">₹{offerPrice}/kg</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
                    <span className="text-text-muted">Estimated Total:</span>
                    <span className="font-extrabold text-soil-gold">₹{(qty * offerPrice).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleStartNegotiation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-soil-emerald to-soil-leaf text-white text-xs font-bold cursor-pointer hover:brightness-110 transition"
                >
                  <Package className="w-3.5 h-3.5" />
                  Start Negotiation
                </button>
              </div>
            ) : activeNeg ? (
              /* Chat Interface */
              <div className="flex flex-col h-[70vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-soil-gold" />
                    <div>
                      <h3 className="font-bold text-xs text-text-primary">Negotiation: {activeNeg.productName}</h3>
                      <p className="text-[9px] text-text-muted">
                        {activeNeg.requestedQty}kg · Status: 
                        <span className={`ml-1 font-bold ${activeNeg.status === 'accepted' ? 'text-emerald-400' : activeNeg.status === 'declined' ? 'text-red-400' : 'text-soil-gold'}`}>
                          {activeNeg.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"><X className="w-4 h-4 text-text-muted" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeNeg.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        msg.sender === 'buyer'
                          ? 'bg-soil-emerald/30 rounded-br-sm'
                          : 'bg-white/10 rounded-bl-sm'
                      }`}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[9px] font-bold text-text-muted">{msg.sender === 'buyer' ? 'You' : 'Seller'}</span>
                        </div>
                        <p className="text-[11px] text-text-primary leading-relaxed">{msg.text}</p>
                        {msg.price && (
                          <div className="mt-1 px-2 py-1 rounded-lg bg-soil-gold/15 text-[10px] font-bold text-soil-gold">
                            Offer: ₹{msg.price}/kg = ₹{(msg.price * activeNeg.requestedQty).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {activeNeg.status === 'open' || activeNeg.status === 'countered' ? (
                  <div className="p-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message or counter-offer..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-soil-emerald placeholder:text-text-muted/50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="p-2 rounded-xl bg-soil-emerald/40 text-white disabled:opacity-40 cursor-pointer hover:bg-soil-emerald/60 transition"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => activeNegId && acceptOffer(activeNegId)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-600/40 text-emerald-300 text-[10px] font-bold cursor-pointer hover:bg-emerald-600/60 transition"
                      >
                        <Check className="w-3 h-3" /> Accept Final Price
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-500/20 text-red-300 text-[10px] font-bold cursor-pointer hover:bg-red-500/30 transition"
                      >
                        <XCircle className="w-3 h-3" /> End Negotiation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 text-center text-xs font-bold ${activeNeg.status === 'accepted' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {activeNeg.status === 'accepted' ? '✓ Deal accepted! Proceed to checkout.' : 'Negotiation ended.'}
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
