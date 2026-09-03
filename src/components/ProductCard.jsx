import React, { useState } from 'react';
import { Star, MapPin, ShieldCheck, Sparkles, QrCode, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PassportModal from './PassportModal';
import AIQualityModal from './AIQualityModal';
import { api } from '../services/api';

export default function ProductCard({ product, onBulkBuy }) {
  const { addToCart } = useCart();
  const [showPassport, setShowPassport] = useState(false);
  const [passportData, setPassportData] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleOpenPassport = async (e) => {
    e.stopPropagation();
    const res = await api.getProducePassport(product.batchId || 'AGR-2026-1024');
    setPassportData(res.passport);
    setShowPassport(true);
  };

  const handleAddRetail = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <>
      <div className="card-nature flex flex-col justify-between overflow-hidden group transition-all duration-300">
        {/* Top Image & Floating Badges */}
        <div className="relative h-48 overflow-hidden bg-nature-bgSoft">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Quality Grade Chip */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
              product.grade === 'Grade A'
                ? 'bg-nature-primary text-white border border-nature-soft/40'
                : 'bg-nature-harvest text-nature-text font-bold'
            }`}>
              {product.grade}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAIModal(true);
              }}
              className="bg-white/90 hover:bg-white text-nature-primary p-1 rounded-full shadow cursor-pointer transition"
              title="Inspect AI Grading Analysis"
            >
              <Sparkles className="w-3.5 h-3.5 text-nature-ai" />
            </button>
          </div>

          {/* Instant Stock Availability Counter */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-nature-primary shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{product.availableQty} {product.unit} Available</span>
          </div>

          {/* Location & Harvest Date overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-medium drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-nature-orange" /> {product.location}
            </span>
            <span className="text-[10px] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              Harvested {product.harvestDate}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="label-earth text-[10px] block">
                  {product.category}
                </span>
                <h3 className="font-display font-bold text-base text-nature-primary line-clamp-1 group-hover:text-nature-hover transition">
                  {product.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-nature-cream border border-nature-harvest/30 px-2 py-0.5 rounded-lg text-xs font-bold text-nature-earth shrink-0">
                <Star className="w-3 h-3 fill-nature-harvest text-nature-harvest" />
                <span>{product.rating}</span>
              </div>
            </div>

            {/* Supplier & Reliability */}
            <div className="mt-2.5 pt-2 border-t border-nature-soft/30 flex items-center justify-between text-xs text-nature-text/80">
              <span className="truncate max-w-[170px]" title={product.supplier}>
                🌱 {product.supplier}
              </span>
              <span className="font-bold text-nature-primary flex items-center gap-1" title="Supplier Reliability Score">
                <ShieldCheck className="w-3.5 h-3.5 text-nature-leaf" /> {product.supplierReliability}/100
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="pt-2 border-t border-nature-soft/30 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-extrabold text-nature-primary">
                ₹{product.price}
              </span>
              <span className="text-xs text-nature-text/60">/{product.unit}</span>
            </div>
            {product.bulkPrice && (
              <span className="text-[10px] text-nature-earth font-bold bg-nature-cream px-2 py-0.5 rounded-md border border-nature-earth/20">
                Bulk: ₹{product.bulkPrice}/kg (min {product.minBulkQty}kg)
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart (Everyday) & Buy in Bulk */}
          <div className="pt-1 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddRetail}
                className="w-full bg-nature-pale hover:bg-nature-soft/60 text-nature-primary border border-nature-soft py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-nature-leaf" />
                <span>{isAdding ? 'Added!' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => onBulkBuy && onBulkBuy(product)}
                className="w-full bg-nature-primary hover:bg-nature-hover text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-nature-sm cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-nature-orange" />
                <span>Buy in Bulk</span>
              </button>
            </div>

            {/* View Digital Produce Passport */}
            <button
              onClick={handleOpenPassport}
              className="w-full text-center py-1.5 bg-nature-bgSoft/60 hover:bg-nature-pale border border-nature-soft/40 rounded-xl text-[11px] font-semibold text-nature-text hover:text-nature-primary flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-nature-leaf" />
              <span>View Produce Passport ({product.batchId || 'AGR-2026-1024'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPassport && passportData && (
        <PassportModal
          passport={passportData}
          onClose={() => setShowPassport(false)}
        />
      )}

      {showAIModal && (
        <AIQualityModal
          product={product}
          onClose={() => setShowAIModal(false)}
        />
      )}
    </>
  );
}
