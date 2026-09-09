import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Send, CheckCircle, XCircle } from 'lucide-react';
import { useDisputeStore, type Dispute } from '../store/disputeStore';
import { GlassCard, FadeIn } from '../components/ui/primitives';

export default function DisputePage() {
  const { disputes, createDispute, addMessage } = useDisputeStore();
  const [showForm, setShowForm] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [productName, setProductName] = useState('');
  const [issueType, setIssueType] = useState<Dispute['issueType']>('quality');
  const [description, setDescription] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const selected = selectedId ? disputes.find((d) => d.id === selectedId) : null;

  const handleSubmit = () => {
    if (!orderId || !description) return;
    createDispute({ orderId, productName, issueType, description });
    setOrderId('');
    setProductName('');
    setDescription('');
    setShowForm(false);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedId) return;
    addMessage(selectedId, 'buyer', replyText);
    setReplyText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Dispute Resolution</h1>
          <p className="text-xs text-text-muted mt-1">Report issues with orders and track resolution status</p>
        </div>
        <Link to="/marketplace" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-soil-emerald to-soil-leaf text-white text-xs font-bold cursor-pointer hover:brightness-110 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
        </button>
      </div>

      {showForm && (
        <GlassCard className="p-4 space-y-3">
          <h3 className="font-bold text-sm text-text-primary">New Dispute</h3>
          <div className="grid grid-cols-2 gap-2">
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID (e.g. ORD-2026-XXXX)" className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald" />
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name" className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald" />
          </div>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value as Dispute['issueType'])} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none cursor-pointer">
            <option value="quality">Quality Issue</option>
            <option value="missing">Missing Items</option>
            <option value="damaged">Damaged in Transit</option>
            <option value="wrong_item">Wrong Item Received</option>
            <option value="late_delivery">Late Delivery</option>
          </select>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." rows={3} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald resize-none" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-soil-emerald/40 text-emerald-300 text-xs font-bold cursor-pointer hover:bg-soil-emerald/60 transition">Submit</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-text-muted text-xs font-bold cursor-pointer hover:bg-white/10 transition">Cancel</button>
          </div>
        </GlassCard>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Disputes List */}
        <div className="md:col-span-1 space-y-2">
          {disputes.length === 0 ? (
            <GlassCard className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-text-muted">No disputes filed</p>
            </GlassCard>
          ) : (
            disputes.map((d) => (
              <GlassCard
                key={d.id}
                small
                className={`p-3 cursor-pointer transition ${selectedId === d.id ? 'border-soil-gold/40' : ''}`}
                onClick={() => setSelectedId(d.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-primary">{d.orderId}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    d.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-400' :
                    d.status === 'open' ? 'bg-amber-500/15 text-amber-400' :
                    d.status === 'under_review' ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {d.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-[9px] text-text-muted mt-0.5">{d.productName} · {d.issueType}</div>
                {d.refundAmount && (
                  <div className="text-[9px] text-emerald-400 font-bold mt-1">Refund: ₹{d.refundAmount}</div>
                )}
              </GlassCard>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="md:col-span-2">
          {selected ? (
            <GlassCard className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-text-primary">{selected.orderId} — {selected.productName}</h3>
                  <p className="text-[10px] text-text-muted capitalize">Issue: {selected.issueType.replace('_', ' ')} · Filed: {selected.createdAt}</p>
                </div>
                {selected.status === 'resolved' && selected.refundAmount && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> ₹{selected.refundAmount} refund issued
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      msg.sender === 'buyer' ? 'bg-soil-emerald/30 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'
                    }`}>
                      <div className="text-[9px] font-bold text-text-muted mb-0.5">{msg.sender === 'buyer' ? 'You' : 'Admin'}</div>
                      <p className="text-[11px] text-text-primary">{msg.text}</p>
                      <div className="text-[8px] text-text-muted/60 mt-0.5">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selected.status !== 'resolved' && (
                <div className="flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                    placeholder="Add more details..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-soil-emerald"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="p-2 rounded-xl bg-soil-emerald/40 text-emerald-300 disabled:opacity-40 cursor-pointer hover:bg-soil-emerald/60 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-soil-gold mx-auto mb-2" />
              <p className="text-xs text-text-muted">Select a dispute to view details</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
