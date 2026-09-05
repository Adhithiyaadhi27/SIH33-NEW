import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Plus, Minus } from 'lucide-react';
import { GlassCard } from '../ui/primitives';
import { mockSupplyDemand, heatLevels } from '../../data/mockSupplyDemand';

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1.5">
      <button
        onClick={() => map.zoomIn()}
        className="glass-button w-8 h-8 rounded-xl flex items-center justify-center text-text-primary cursor-pointer"
        title="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="glass-button w-8 h-8 rounded-xl flex items-center justify-center text-text-primary cursor-pointer"
        title="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SupplyDemandHeatmap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-display font-extrabold text-lg text-text-primary">
          Live Regional Supply & Demand Heatmap
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Current supply-deficit corridors for key crops across Tamil Nadu
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-soil-forest/40 h-[360px]">
        <MapContainer
          center={[10.8, 78.5]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#0b2b1e' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          {mockSupplyDemand.map((d) => {
            const meta = heatLevels.find((h) => h.key === d.level)!;
            return (
              <CircleMarker
                key={d.id}
                center={[d.lat, d.lng]}
                radius={hovered === d.id ? 20 : 14}
                pathOptions={{
                  color: meta.color,
                  fillColor: meta.color,
                  fillOpacity: hovered === d.id ? 0.85 : 0.55,
                  weight: 2,
                }}
                eventHandlers={{
                  mouseover: () => setHovered(d.id),
                  mouseout: () => setHovered(null),
                }}
              >
                {hovered === d.id && (
                  <Tooltip direction="top" opacity={1}>
                    <div className="text-xs font-bold text-gray-900 min-w-[140px]">
                      <div>{d.name}</div>
                      <div className="text-[10px] mt-0.5">{d.crop}: demand exceeds supply</div>
                      <div className="text-[10px] mt-0.5">Supply {d.supply.toLocaleString()} kg · Demand {d.demand.toLocaleString()} kg</div>
                    </div>
                  </Tooltip>
                )}
              </CircleMarker>
            );
          })}
          <ZoomControls />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold text-soil-gold uppercase tracking-wider">Tamil Crops</span>
        {heatLevels.map((h) => (
          <div key={h.key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: h.color }} />
            <span className="text-[11px] text-text-muted">{h.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}