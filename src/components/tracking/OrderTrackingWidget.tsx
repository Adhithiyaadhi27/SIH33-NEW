import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Phone, ChevronRight, ArrowLeft } from 'lucide-react';
import { useOrderTrackingStore, type TrackedOrder } from '../../store/orderTrackingStore';
import { GlassCard, FadeIn } from '../ui/primitives';
import { Link } from 'react-router-dom';

const statusSteps = ['confirmed', 'processing', 'dispatched', 'in_transit', 'delivered'];
const statusLabels = ['Confirmed', 'Processing', 'Dispatched', 'In Transit', 'Delivered'];

const driverIcon = new L.DivIcon({
  html: '<div style="background:#F6BD60;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#081F16" stroke-width="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const destIcon = new L.DivIcon({
  html: '<div style="background:#2E8B57;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function FlyToDriver({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 10, { duration: 1.5 }); }, [lat, lng, map]);
  return null;
}

interface OrderTrackingWidgetProps {
  compact?: boolean;
}

export default function OrderTrackingWidget({ compact }: OrderTrackingWidgetProps) {
  const { orders } = useOrderTrackingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? orders.find((o) => o.id === selectedId) : null;

  if (compact) {
    return (
      <GlassCard className="p-4 space-y-3">
        <h3 className="font-display font-bold text-sm text-text-primary">Active Orders</h3>
        {orders.length === 0 ? (
          <p className="text-[11px] text-text-muted">No active orders</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedId(o.id)}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer text-left"
              >
                <img src={o.productImage} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-text-primary truncate">{o.productName}</div>
                  <div className="text-[9px] text-text-muted">{o.id} · ETA: {o.eta}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
              </button>
            ))}
          </div>
        )}
        {selected && <TrackingDetail order={selected} onClose={() => setSelectedId(null)} />}
      </GlassCard>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Order Tracking</h1>
          <p className="text-xs text-text-muted mt-1">{orders.length} active shipments</p>
        </div>
        <Link to="/marketplace" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back to Marketplace
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          {orders.map((o) => (
            <FadeIn key={o.id}>
              <GlassCard className="p-4 cursor-pointer hover:border-soil-gold/40 transition" onClick={() => setSelectedId(o.id)}>
                <div className="flex items-center gap-4">
                  <img src={o.productImage} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-text-primary">{o.productName}</div>
                    <div className="text-[10px] text-text-muted">{o.id} · {o.driverName} · {o.vehicleNo}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-soil-gold">ETA: {o.eta}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-soil-gold/15 text-soil-gold'
                      }`}>
                        {o.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
        <div>
          {selected ? (
            <TrackingDetail order={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <GlassCard className="p-6 text-center">
              <Navigation className="w-8 h-8 text-soil-gold mx-auto mb-2" />
              <p className="text-xs text-text-muted">Select an order to view live tracking</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

function TrackingDetail({ order, onClose }: { order: TrackedOrder; onClose: () => void }) {
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="glass-panel space-y-3">
      <div className="h-48 rounded-t-3xl overflow-hidden">
        <MapContainer
          center={[order.currentLat, order.currentLng]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <FlyToDriver lat={order.currentLat} lng={order.currentLng} />
          <Marker position={[order.currentLat, order.currentLng]} icon={driverIcon}>
            <Popup><b>{order.driverName}</b><br />{order.vehicleNo}</Popup>
          </Marker>
          <Marker position={[order.destinationLat, order.destinationLng]} icon={destIcon}>
            <Popup><b>Delivery Address</b></Popup>
          </Marker>
          <Polyline
            positions={[[order.currentLat, order.currentLng], [order.destinationLat, order.destinationLng]]}
            pathOptions={{ color: '#F6BD60', weight: 3, dashArray: '8 8' }}
          />
        </MapContainer>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs text-text-primary">{order.productName}</h4>
            <p className="text-[9px] text-text-muted">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-[9px] font-bold text-soil-gold cursor-pointer">Close</button>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-1">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${
                i <= currentStep ? 'bg-soil-gold text-soil-base' : 'bg-white/10 text-text-muted'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              {i < statusSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? 'bg-soil-gold' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-text-muted">
          {statusLabels.map((l) => <span key={l}>{l}</span>)}
        </div>

        {/* Driver info */}
        <div className="glass-panel-sm p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-soil-emerald/40 flex items-center justify-center text-[10px] font-bold text-white">
            {order.driverName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold text-text-primary">{order.driverName}</div>
            <div className="text-[9px] text-text-muted">{order.vehicleNo}</div>
          </div>
          <a href={`tel:${order.driverPhone}`} className="p-2 rounded-lg bg-soil-emerald/30 text-emerald-300 hover:bg-soil-emerald/50 transition">
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Events */}
        <div className="space-y-2">
          {order.events.map((ev, i) => (
            <div key={i} className="flex gap-2 text-[10px]">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-soil-gold shrink-0 mt-0.5" />
                {i < order.events.length - 1 && <div className="w-px flex-1 bg-white/15" />}
              </div>
              <div className="pb-2">
                <div className="font-bold text-text-primary">{ev.status}</div>
                <div className="text-text-muted">{ev.location}</div>
                <div className="text-text-muted/60">{ev.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
