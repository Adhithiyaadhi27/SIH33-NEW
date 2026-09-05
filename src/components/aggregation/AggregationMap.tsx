import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

interface Node {
  id: string;
  label: string;
  lat: number;
  lng: number;
  type: 'farm' | 'fpo' | 'aggregation' | 'distribution';
  color: string;
}

interface Route {
  from: string;
  to: string;
  weight: string;
}

const nodes: Node[] = [
  { id: 'mdu-fpo', label: 'Madurai FPO', lat: 9.9252, lng: 78.1198, type: 'fpo', color: '#7CCFA2' },
  { id: 'manapparai', label: 'Manapparai', lat: 10.607, lng: 78.424, type: 'farm', color: '#F6BD60' },
  { id: 'dindigul', label: 'Dindigul', lat: 10.3673, lng: 77.9803, type: 'aggregation', color: '#FAD48A' },
  { id: 'chennai', label: 'Chennai', lat: 13.0827, lng: 80.2707, type: 'distribution', color: '#2E8B57' },
  { id: 'trichy', label: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, type: 'farm', color: '#F6BD60' },
];

const routes: Route[] = [
  { from: 'manapparai', to: 'mdu-fpo', weight: '1,793 kg' },
  { from: 'trichy', to: 'mdu-fpo', weight: '1,793 kg' },
  { from: 'mdu-fpo', to: 'dindigul', weight: '' },
  { from: 'dindigul', to: 'chennai', weight: '' },
];

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

export default function AggregationMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-soil-forest/40 h-[420px]">
      <MapContainer
        center={[11.5, 78.5]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#0b2b1e' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {/* Routes (animated dashed lines) */}
        {routes.map((route, i) => {
          const a = nodeById[route.from];
          const b = nodeById[route.to];
          return (
            <Polyline
              key={i}
              positions={[[a.lat, a.lng], [b.lat, b.lng]]}
              pathOptions={{
                color: '#F6BD60',
                weight: 2,
                opacity: 0.7,
                dashArray: '6 6',
                className: 'route-animated',
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <CircleMarker
            key={n.id}
            center={[n.lat, n.lng]}
            radius={n.type === 'distribution' ? 9 : n.type === 'aggregation' ? 8 : 6}
            pathOptions={{ color: n.color, fillColor: n.color, fillOpacity: 0.9 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="text-xs font-bold">{n.label}</div>
            </Tooltip>
            {n.type === 'distribution' && (
              <Popup>
                <div className="text-xs text-gray-900">Chennai — Distribution Hub</div>
              </Popup>
            )}
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Label overlay: Farmer → FPO → Aggregation → Logistics → Buyer */}
      <div className="absolute top-3 left-3 z-10 glass-panel-sm px-3 py-2 text-[11px] font-bold text-text-primary">
        <span className="text-soil-gold">Farmer</span> → <span className="text-soil-mint">FPO</span> →{' '}
        <span className="text-soil-goldSoft">Aggregation</span> → Logistics →{' '}
        <span className="text-soil-pale">Buyer</span>
      </div>

      {/* Live tile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-3 right-3 z-10 glass-panel-sm px-3 py-1.5 flex items-center gap-2"
      >
        <span className="flex h-2 w-2 rounded-full bg-soil-gold animate-pulse" />
        <span className="text-[10px] font-bold text-text-secondary">LIVE ROUTE FLOW</span>
      </motion.div>
    </div>
  );
}
