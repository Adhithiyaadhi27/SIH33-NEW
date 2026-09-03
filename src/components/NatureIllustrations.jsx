import React from 'react';

/**
 * Curved Leaf-Vein Line Divider (PRD Section 0.4)
 * Subtle botanical transition between major sections
 */
export function LeafVeinDivider({ className = "" }) {
  return (
    <div className={`w-full flex items-center justify-center py-6 overflow-hidden ${className}`}>
      <svg
        className="w-full max-w-4xl h-8 text-nature-leaf/30"
        viewBox="0 0 1200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 20C200 20 250 5 400 20C550 35 650 5 800 20C950 35 1000 20 1200 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        {/* Leaf sprout motif in center */}
        <path
          d="M590 20C590 10 600 5 600 5C600 5 610 10 610 20C610 30 600 35 600 35C600 35 590 30 590 20Z"
          fill="currentColor"
          className="text-nature-leaf/50"
        />
        <line x1="600" y1="5" x2="600" y2="35" stroke="#1B4332" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * Organic Blob Shape for Hero CTA Backdrops & Highlights
 */
export function OrganicBlob({ className = "", color = "bg-nature-soft/20" }) {
  return (
    <div
      className={`absolute rounded-[40%_60%_70%_30%_/_40%_50%_60%_55%] blur-2xl pointer-events-none transition-all ${color} ${className}`}
    />
  );
}

/**
 * Harvest Basket Micro-Illustration (PRD Section 0.4)
 * Used for order success, cart items, and rich harvest states
 */
export function HarvestBasketIcon({ className = "w-16 h-16 text-nature-leaf" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Basket Body */}
      <path
        d="M12 28L18 54C18.5 56 20.5 58 23 58H41C43.5 58 45.5 56 46 54L52 28H12Z"
        fill="#F5EEDC"
        stroke="#6B4226"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Weave Lines */}
      <path d="M15 36H49M17 44H47M19 52H45" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 28L28 58M32 28L32 58M40 28L36 58" stroke="#6B4226" strokeWidth="2" opacity="0.4" />
      {/* Handle */}
      <path
        d="M20 28C20 14 26 8 32 8C38 8 44 14 44 28"
        stroke="#6B4226"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Fresh Produce in Basket */}
      {/* Tomato */}
      <circle cx="26" cy="24" r="8" fill="#E63946" stroke="#1B4332" strokeWidth="1.5" />
      <path d="M26 14C24 16 26 18 26 18M28 14C27 16 26 18 26 18" stroke="#40916C" strokeWidth="2" strokeLinecap="round" />
      {/* Orange Carrot / Citrus */}
      <circle cx="38" cy="24" r="8" fill="#F4A259" stroke="#6B4226" strokeWidth="1.5" />
      {/* Leaf Tops */}
      <path d="M38 15C36 12 39 10 41 12C41 14 39 15 38 15Z" fill="#40916C" />
      <path d="M30 18C28 15 32 14 34 16C33 17 31 18 30 18Z" fill="#95D5B2" />
    </svg>
  );
}

/**
 * Wilting Sprout Micro-Illustration (PRD Section 0.4)
 * Used for empty states, empty basket, zero search results
 */
export function WiltingSproutIcon({ className = "w-16 h-16 text-nature-leaf" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soil Mound */}
      <ellipse cx="32" cy="54" rx="22" ry="6" fill="#F5EEDC" stroke="#6B4226" strokeWidth="2.5" />
      {/* Soil Cracks */}
      <path d="M22 54L28 56M36 53L42 55" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      {/* Wilting Stem curving down */}
      <path
        d="M32 52C32 40 28 32 20 28C16 26 12 30 14 34"
        stroke="#40916C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Drooping Leaf 1 */}
      <path
        d="M20 28C14 26 10 32 12 36C16 38 20 32 20 28Z"
        fill="#95D5B2"
        stroke="#40916C"
        strokeWidth="1.5"
      />
      {/* Drooping Leaf 2 */}
      <path
        d="M28 36C26 30 32 28 36 32C38 36 32 38 28 36Z"
        fill="#D8F3DC"
        stroke="#40916C"
        strokeWidth="1.5"
      />
      {/* Gentle water drop */}
      <path
        d="M44 26C44 23 48 18 48 18C48 18 52 23 52 26C52 28.2 50.2 30 48 30C45.8 30 44 28.2 44 26Z"
        fill="#95D5B2"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Cracked Soil Micro-Illustration (PRD Section 0.4)
 * Used for 404 "Looks like this field has no harvest yet"
 */
export function CrackedSoilIcon({ className = "w-24 h-24" }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Organic Ground Patch */}
      <path
        d="M12 48C12 28 28 14 48 14C68 14 84 28 84 48C84 68 68 82 48 82C28 82 12 68 12 48Z"
        fill="#F5EEDC"
        stroke="#6B4226"
        strokeWidth="3"
      />
      {/* Dry Soil Cracks */}
      <path
        d="M48 24L44 38L52 50L46 68M44 38L32 44L24 40M52 50L64 46L72 54M46 68L56 74"
        stroke="#6B4226"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small Single Resilient Green Sprout Emerging */}
      <path
        d="M48 64C48 58 54 54 58 50"
        stroke="#40916C"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M58 50C62 48 66 52 64 56C60 58 56 52 58 50Z"
        fill="#95D5B2"
        stroke="#1B4332"
        strokeWidth="1.5"
      />
    </svg>
  );
}
