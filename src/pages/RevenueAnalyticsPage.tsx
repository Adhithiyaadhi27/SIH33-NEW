import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { GlassCard, FadeIn, MetricTile, DemoDataBadge } from '../components/ui/primitives';

const REVENUE_DATA = [
  { month: 'Apr', revenue: 45000, orders: 32 },
  { month: 'May', revenue: 52000, orders: 41 },
  { month: 'Jun', revenue: 48000, orders: 36 },
  { month: 'Jul', revenue: 61000, orders: 52 },
  { month: 'Aug', revenue: 73000, orders: 61 },
  { month: 'Sep', revenue: 68000, orders: 55 },
];

const TOP_PRODUCTS = [
  { name: 'Tomato', value: 35, color: '#F6BD60' },
  { name: 'Potato', value: 25, color: '#2E8B57' },
  { name: 'Onion', value: 20, color: '#FAD48A' },
  { name: 'Carrot', value: 12, color: '#7CCFA2' },
  { name: 'Others', value: 8, color: '#8FB3A0' },
];

const BUYER_DATA = [
  { name: 'Week 1', direct: 12000, bulk: 8000, subscription: 5000 },
  { name: 'Week 2', direct: 15000, bulk: 9500, subscription: 5500 },
  { name: 'Week 3', direct: 13000, bulk: 11000, subscription: 6000 },
  { name: 'Week 4', direct: 18000, bulk: 10000, subscription: 7000 },
];

export default function RevenueAnalyticsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Revenue Analytics</h1>
          <p className="text-xs text-text-muted mt-1">Track your earnings, top products, and buyer channels</p>
        </div>
        <Link to="/admin/analytics" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back to Analytics
        </Link>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          <MetricTile label="Total Revenue" value="₹3.47L" icon={<span className="text-lg">💰</span>} accent="text-soil-gold" />
          <MetricTile label="Total Orders" value="277" icon={<span className="text-lg">📦</span>} accent="text-emerald-400" />
          <MetricTile label="Avg. Order Value" value="₹1,253" icon={<span className="text-lg">📊</span>} accent="text-soil-goldSoft" />
          <MetricTile label="Repeat Rate" value="68%" icon={<span className="text-lg">🔄</span>} accent="text-blue-400" />
        </div>
      </div>
      <div className="flex justify-end -mt-2">
        <DemoDataBadge />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <FadeIn className="lg:col-span-2">
          <GlassCard className="p-5">
            <h3 className="font-display font-bold text-sm text-text-primary mb-3">Revenue Trend</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F6BD60" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#F6BD60" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#8FB3A0" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8FB3A0" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: 'rgba(11,43,30,0.92)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#EAF6EE' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#F6BD60" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Top Products Pie */}
        <FadeIn delay={0.05}>
          <GlassCard className="p-5">
            <h3 className="font-display font-bold text-sm text-text-primary mb-3">Top Products</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={TOP_PRODUCTS} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {TOP_PRODUCTS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(11,43,30,0.92)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#EAF6EE' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {TOP_PRODUCTS.map((p) => (
                <div key={p.name} className="flex items-center gap-1 text-[9px]">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-text-muted">{p.name} ({p.value}%)</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Buyer Channels */}
      <FadeIn delay={0.1}>
        <GlassCard className="p-5">
          <h3 className="font-display font-bold text-sm text-text-primary mb-3">Sales by Buyer Channel</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUYER_DATA}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#8FB3A0" fontSize={11} tickLine={false} />
                <YAxis stroke="#8FB3A0" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ background: 'rgba(11,43,30,0.92)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#EAF6EE' }} />
                <Legend wrapperStyle={{ color: '#EAF6EE', fontSize: 11 }} />
                <Bar dataKey="direct" name="Direct Sales" fill="#F6BD60" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bulk" name="Bulk Orders" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                <Bar dataKey="subscription" name="Subscriptions" fill="#7CCFA2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
