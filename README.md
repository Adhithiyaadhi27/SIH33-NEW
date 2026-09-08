# AgriDirect AI — Next-Gen AI Agricultural Marketplace & Smart Supply Chain

AgriDirect AI is a production-ready, synchronized agricultural technology platform that directly connects agricultural supply (FPOs & smallholder farmers) with consumers and commercial bulk buyers.

## Core Vision
> **Predict demand &rarr; Discover supply &rarr; Verify quality &rarr; Aggregate supply &rarr; Reduce wastage &rarr; Deliver efficiently.**

---

## 🌟 8 Major Capabilities
1. **⚡ Blinkit-Style Instant Stock Showcase**: Live visual catalog of fresh fruits, vegetables, pulses, and grains with instant kg availability counters.
2. **📸 AI Quality Grading**: OpenCV & Computer Vision inspection classifying skin purity, color saturation, and blemishes into Grade A/B/C with confidence scores and mandatory legal disclaimer: *"The quality assessment is AI-assisted and is not an absolute warranty."*
3. **🏷️ Digital Produce Passport**: Dynamic QR-coded batch certificate (e.g. `AGR-2026-1024`) tracing Farmer Plot GPS &rarr; Harvest &rarr; FPO Collection &rarr; Cold Chain Warehouse &rarr; Highway Transit &rarr; Buyer Delivery.
4. **🗺️ Live Supply Heat Map**: Geospatial intelligence displaying regional agricultural surplus hubs (e.g. Madurai) and deficit demand clusters (e.g. Chennai).
5. **📈 Demand & Supply Predictor**: 14-30 day regional shortage forecast based on order velocity, festival seasonality, and weather telemetry.
6. **🏪 Buyers Marketplace**: Reverse-bidding platform where commercial buyers publish RFPs and FPOs submit competitive offers.
7. **⚠️ Waste & Anomaly Engine**: Shelf-life decay tracking calculating spoilage risks (HIGH/MED/LOW) with automated mitigation discounts and relocation advice.
8. **⭐ Supplier Reliability Score**: 0-100 trust matrix evaluating on-time delivery %, quantity accuracy %, and dispute resolution history.

---

## 👥 Stakeholder Roles & Access Control
- **Consumer**: Everyday produce basket shopping, instant delivery tracking, produce passport inspection.
- **Bulk Buyer**: Large commercial procurement, RFP reverse-bidding, supplier comparison, escrow locks.
- **FPO**: Smallholder farmer member management, land records, aggregated warehouse inventories, bulk bids.
- **Logistics Partner**: Assigned deliveries, refrigerated vehicle telemetry, route optimization, digital Proof of Delivery (PoD).
- **Admin**: Master platform governance, user audit logs, escrow settlement authorizations, AI anomaly surveillance.
- **CRITICAL FARMER GOVERNANCE RULE**: There is **NO standalone Farmer Dashboard**. Farmers participate through certified local FPOs, marketplace aggregations, digital traceability passports, and admin registries.

---

## 💻 Technology Stack
- **Frontend**: React 19 + Vite + Tailwind CSS + React Router v7 + Axios + TanStack Query + Zustand + Socket.IO Client + Framer Motion + React Leaflet + Recharts + Lucide Icons + Canvas QR Code
- **Backend**: Python Flask RESTful API + Flask-SocketIO realtime feed (`backend/app.py`, `backend/socketio_handler.py`)
- **AI/ML Engine**: Computer Vision quality classification, 14-30 day shortage forecasting model, perishability decay calculator, multi-supplier smart aggregation algorithm (`backend/ai_engine.py`)

---

## 🚀 Getting Started

### 1. Backend Setup (start first)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
The REST API runs on `http://localhost:5000/api` and the Socket.IO realtime feed on `http://localhost:5000/socket.io`. The background price emitter updates product prices every ~4 seconds globally.

### 2. Frontend Setup
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. The Vite dev server proxies `/api` and `/socket.io` to the Flask backend, so no CORS configuration is needed locally. If the backend is unreachable, the UI automatically falls back to a built-in mock realtime provider.

### 3. Environment Variables (`.env`)
```bash
VITE_API_URL=""          # leave empty to use the /api Vite proxy
VITE_SOCKET_URL=""       # leave empty to use the /socket.io Vite proxy
```

---

## 🌐 Multilingual Support
The navbar **language toggle** (globe icon) switches the entire UI between:
- English (`en`) · Tamil (`ta`) · Hindi (`hi`) · Telugu (`te`) · Kannada (`kn`)

Translations are stored server-side (`backend/translations.py`) and fetched via `GET /api/translations/:lang`. The chosen language persists in `localStorage`.

## ⚡ Realtime Architecture
- **REST** (`/api/*`) — CRUD for products, orders, registration, passport, analytics, supply-demand.
- **Socket.IO** events emitted by the backend: `price:update`, `stock:update`, `metric:update`, `route:update`, `heatmap:update`, `grade:update`.
- The frontend service layer (`src/services/realtime.ts`) subscribes to these events; the marketplace, activity feed, and heatmap update live without any page refresh.

---

## 🧪 One-Click Demo Personas
Use the **Demo Role Selector** located on the top navigation bar or dashboard sidebar to switch instantaneously between:
- `Priya Sundaram (Consumer)`
- `Karthik Raja (Bulk Buyer)`
- `S. Ramanathan (FPO Co-op)`
- `Murugan K. (Logistics Partner)`
- `System Administrator (Admin)`
