import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Search,
  CheckCircle2,
  FileText,
  AlertCircle,
  Upload,
  Send,
  LifeBuoy
} from 'lucide-react';
import { api } from '../services/api';

const FAQS = [
  {
    q: "How does AI Quality Grading work?",
    a: "Our system uses Computer Vision algorithms to evaluate pixel-level surface defects, color uniformity, and skin firmness against national export grading standards. Note: The quality assessment is AI-assisted and is not an absolute warranty."
  },
  {
    q: "Can individual farmers list produce without an FPO?",
    a: "Per platform governance, individual farmers participate through certified local Farmers Producer Organizations (FPOs) or smart aggregation clusters to ensure quality compliance and fair pooled pricing."
  },
  {
    q: "What is the Digital Produce Passport?",
    a: "It is a verifiable digital certificate linked to an agricultural batch ID with a QR code. It traces origin GPS coordinates, harvest time, FPO sorting details, and temperature-controlled logistics."
  },
  {
    q: "How does Multi-Supplier Smart Aggregation function?",
    a: "When a commercial buyer needs a large quantity (e.g. 5,000 kg), our engine automatically combines compatible lots from multiple nearby farmers/FPOs into a single consolidated fulfillment contract."
  }
];

export default function SupportPage() {
  const [tickets, setTickets] = useState([
    {
      id: "TCK-4081",
      category: "Quality Dispute",
      orderId: "ORD-2026-7104",
      subject: "Minor surface bruising in tomato shipment",
      priority: "Medium",
      status: "In Progress",
      createdAt: "Today, 10:30 AM"
    }
  ]);
  const [formData, setFormData] = useState({
    category: 'Produce Quality Dispute',
    orderId: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [submitted, setSubmitted] = useState(false);
  const [searchFaq, setSearchFaq] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.submitSupportTicket(formData);
      setTickets([res.ticket, ...tickets]);
      setSubmitted(true);
      setFormData({
        category: 'Produce Quality Dispute',
        orderId: '',
        subject: '',
        description: '',
        priority: 'Medium'
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFaqs = FAQS.filter(
    (f) => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-agri-dark via-agri-deep to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-agri-mint">
            <LifeBuoy className="w-3.5 h-3.5" /> 24x7 Agro-Dispute & Support Desk
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
            Help Center & Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-agri-pale/90 leading-relaxed">
            Resolve delivery issues, lodge quality discrepancies, query produce passports, or communicate with our dedicated mandi grievance officers.
          </p>
        </div>
      </div>

      {/* Main Grid: Ticket Form on Left, FAQs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Raise Support Ticket Form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">
              Raise an Agricultural Grievance / Ticket
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Assigned to regional packhouse quality auditors within 30 minutes.
            </p>
          </div>

          {submitted && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ticket registered successfully! Our dispute officer will review your batch log.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Issue Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                >
                  <option value="Produce Quality Dispute">Produce Quality Dispute</option>
                  <option value="Cold Transit Delay">Cold Transit Delay</option>
                  <option value="Weight / Quantity Mismatch">Weight / Quantity Mismatch</option>
                  <option value="Escrow & Payment Release">Escrow & Payment Release</option>
                  <option value="Produce Passport Verification">Produce Passport Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Related Order or Batch ID</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-2026-7821"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of issue..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
                >
                  <option value="Low">Low (General Inquiry)</option>
                  <option value="Medium">Medium (Produce Quality Notice)</option>
                  <option value="High">High (Perishable Loss Risk / Delivery Stuck)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description</label>
              <textarea
                rows="4"
                required
                placeholder="Describe the discrepancy, batch number, or assistance required..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-deep"
              />
            </div>

            {/* Photo / Document upload attachment simulation */}
            <div className="p-3 border-2 border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500 cursor-pointer hover:border-agri-bright">
              <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <span>Click to attach produce photos or delivery weighbridge receipts (Max 10MB)</span>
            </div>

            <button
              type="submit"
              className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-3 rounded-xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket for Investigation</span>
            </button>
          </form>

          {/* Active Tickets List */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
              Your Registered Tickets ({tickets.length})
            </h3>
            {tickets.map((t) => (
              <div key={t.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">{t.id}: {t.subject}</span>
                  <div className="text-[11px] text-gray-500">{t.category} &bull; Order: {t.orderId}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant answers about marketplace bidding, quality grading, and passports.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-agri-deep shadow-sm"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                <h4 className="font-bold text-sm text-agri-dark">{faq.q}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
