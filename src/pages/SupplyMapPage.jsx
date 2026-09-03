import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Truck,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

const MAP_NODES = [
  {
    id: "node_mdu",
    city: "Madurai, Tamil Nadu",
    type: "SURPLUS",
    product: "Heritage Tomato",
    qty: "+4,500 kg Surplus",
    description: "Peak harvest yield across 340 smallholder plots. 85% vine ripe.",
    actionRecommendation: "Direct dispatch via refrigerated NH-45 corridor to Chennai shortage hub.",
    lat: "9.9252° N",
    lng: "78.1198° E",
    color: "bg-emerald-500",
    badgeColor: "bg-emerald-100 text-emerald-800"
  },
  {
    id: "node_chn",
    city: "Chennai, Tamil Nadu",
    type: "SHORTAGE",
    product: "Heritage Tomato",
    qty: "-1,800 kg Deficit",
    description: "Surge in urban supermarket & wholesale demand ahead of festival week.",
    actionRecommendation: "Receiving 4 Reefer trucks from Madurai. Pre-booking orders at ₹25/kg.",
    lat: "13.0827° N",
    lng: "80.2707° E",
    color: "bg-rose-500",
    badgeColor: "bg-rose-100 text-rose-800"
  },
  {
    id: "node_nsk",
    city: "Nashik, Maharashtra",
    type: "SURPLUS",
    product: "Red Onion",
    qty: "+12,000 kg Surplus",
    description: "Cured storage stock ready at Sahyadri FPO aggregation yards.",
    actionRecommendation: "Multi-axle 16-ton fleet dispatched towards Bangalore & Chennai cold warehouses.",
    lat: "19.9975° N",
    lng: "73.7898° E",
    color: "bg-emerald-500",
    badgeColor: "bg-emerald-100 text-emerald-800"
  },
  {
    id: "node_blr",
    city: "Bangalore, Karnataka",
    type: "SHORTAGE",
    product: "Red Onion & Pulses",
    qty: "-3,200 kg Deficit",
    description: "High urban B2B canteen and restaurant requirements.",
    actionRecommendation: "Intake scheduled at Electronic City DC from Nashik corridor.",
    lat: "12.9716° N",
    lng: "77.5946° E",
    color: "bg-amber-500",
    badgeColor: "bg-amber-100 text-amber-800"
  },
  {
    id: "node_ooty",
    city: "Ooty, Nilgiris, TN",
    type: "HARVEST_HUB",
    product: "Table Potato",
    qty: "8,000 kg Packhouse Yield",
    description: "High altitude organic crop currently being graded via AI Computer Vision.",
    actionRecommendation: "Standard allocation to regional retail baskets.",
    lat: "11.4102° N",
    lng: "76.6950° E",
    color: "bg-sky-500",
    badgeColor: "bg-sky-100 text-sky-800"
  }
];

export default function SupplyMapPage() {
  const [selectedNode, setSelectedNode] = useState(MAP_NODES[0]);
  const [activeLayer, setActiveLayer] = useState('ALL'); // ALL, SURPLUS, SHORTAGE, TRANSIT

  const filteredNodes = MAP_NODES.filter((n) => {
    if (activeLayer === 'ALL') return true;
    if (activeLayer === 'SURPLUS') return n.type === 'SURPLUS';
    if (activeLayer === 'SHORTAGE') return n.type === 'SHORTAGE';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-agri-dark via-teal-900 to-agri-deep text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-agri-pale">
            <Layers className="w-3.5 h-3.5 text-agri-mint" /> Geospatial Agricultural Telemetry
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
            🗺️ Live Supply Heat Map & Shortage Vectors
          </h1>
          <p className="text-xs sm:text-sm text-agri-pale/90 leading-relaxed">
            AI-monitored spatial intelligence mapping regional agricultural surpluses against high-demand urban centers to eliminate wastage and synchronize cold logistics corridors.
          </p>
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Map Layers:</span>
          {['ALL', 'SURPLUS', 'SHORTAGE'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeLayer === layer
                  ? 'bg-agri-dark text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {layer === 'ALL' ? '🌐 All Spatial Nodes' : layer === 'SURPLUS' ? '🟢 Regional Surpluses' : '🔴 Deficit Hotspots'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Surplus Cluster
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Demand Deficit
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Active Harvest Hub
          </span>
        </div>
      </div>

      {/* Main Map Visualization Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Stylized Geospatial Canvas */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-slate-900 to-agri-dark rounded-3xl p-6 shadow-2xl relative min-h-[480px] flex flex-col justify-between overflow-hidden border border-gray-800">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#52B788_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Simulated Geographic Vector Corridors */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-agri-mint font-mono border border-agri-bright/30">
              <Sparkles className="w-3.5 h-3.5" /> AI Route Optimization: Active Highway Corridors
            </div>
          </div>

          {/* Interactive Geographic Map Pins */}
          <div className="relative z-10 h-72 w-full my-auto flex items-center justify-around">
            {filteredNodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex flex-col items-center cursor-pointer group transition-transform ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div className="relative">
                    <span className={`w-4 h-4 rounded-full ${node.color} block animate-ping absolute inset-0 opacity-75`} />
                    <div className={`w-10 h-10 rounded-2xl ${node.color} flex items-center justify-center text-white shadow-lg border-2 ${
                      isSelected ? 'border-white ring-4 ring-agri-bright/50' : 'border-gray-900'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded-md shadow drop-shadow">
                    {node.city.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-agri-pale font-medium">
                    {node.product}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic AI Corridor Route Graphic Overlay */}
          <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-agri-harvest animate-bounce" />
              <span className="font-semibold">Live Highway Transit:</span>
              <span className="text-agri-mint">Madurai (Surplus) &rarr; Chennai (Deficit) [450 km via NH-45]</span>
            </div>
            <span className="text-[11px] bg-agri-leaf/40 px-2 py-0.5 rounded-full font-mono">
              Temp: 12.4°C Telemetry OK
            </span>
          </div>
        </div>

        {/* Right Detail Card for Selected Node */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedNode.badgeColor}`}>
                {selectedNode.type}
              </span>
              <span className="text-xs font-mono text-gray-400">
                {selectedNode.lat}, {selectedNode.lng}
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-gray-900">
                {selectedNode.city}
              </h3>
              <p className="text-sm font-semibold text-agri-deep mt-0.5">
                {selectedNode.product} &bull; <span className="text-gray-700">{selectedNode.qty}</span>
              </p>
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Cluster Field Assessment
              </span>
              <p className="leading-relaxed">{selectedNode.description}</p>
            </div>

            <div className="space-y-2 text-xs text-agri-dark bg-agri-soft p-4 rounded-2xl border border-agri-bright/30">
              <span className="text-[10px] uppercase font-bold text-agri-leaf flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-agri-harvest" /> AI Actionable Recommendation
              </span>
              <p className="leading-relaxed font-medium">{selectedNode.actionRecommendation}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(`Initiating dispatch reservation for ${selectedNode.city}`)}
                className="w-full bg-agri-deep hover:bg-agri-dark text-white py-3 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve Corridor Capacity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
