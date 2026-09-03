import axios from 'axios';
import {
  INITIAL_PRODUCTS,
  INITIAL_PASSPORT,
  INITIAL_REQUIREMENTS,
  INITIAL_ORDERS,
  INITIAL_USERS
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization token if available in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agridirect_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Products
  getProducts: async (params = {}) => {
    try {
      const res = await apiClient.get('/products', { params });
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, using client fallback for products');
      let prods = [...INITIAL_PRODUCTS];
      if (params.category && params.category !== 'all') {
        prods = prods.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        prods = prods.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()) || p.location.toLowerCase().includes(params.search.toLowerCase()));
      }
      return { success: true, count: prods.length, products: prods };
    }
  },

  getProductDetail: async (id) => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      const prod = INITIAL_PRODUCTS.find(p => p.id === id) || INITIAL_PRODUCTS[0];
      return { success: true, product: prod };
    }
  },

  // Requirements & Reverse Bidding
  getRequirements: async () => {
    try {
      const res = await apiClient.get('/requirements');
      return res.data;
    } catch (err) {
      return { success: true, requirements: INITIAL_REQUIREMENTS };
    }
  },

  createRequirement: async (reqData) => {
    try {
      const res = await apiClient.post('/requirements', reqData);
      return res.data;
    } catch (err) {
      const newReq = {
        id: `req_${Date.now()}`,
        ...reqData,
        status: 'OPEN_FOR_BIDS',
        createdAt: new Date().toISOString().split('T')[0],
        bidsCount: 0,
        bids: []
      };
      return { success: true, requirement: newReq };
    }
  },

  // Smart Aggregation Matching
  matchAggregation: async (data) => {
    try {
      const res = await apiClient.post('/aggregation/match', data);
      return res.data;
    } catch (err) {
      const targetQty = Number(data.quantity) || 5000;
      const suppliers = [
        { supplierName: 'Farmer M. Murugesan (Madurai)', type: 'Farmer (under FPO)', location: 'Alanganallur, Madurai', allocatedQuantity: Math.min(1000, targetQty), pricePerKg: 24.50, reliabilityScore: 95 },
        { supplierName: 'Farmer S. Chelladurai (Madurai)', type: 'Farmer (under FPO)', location: 'Vadipatti, Madurai', allocatedQuantity: Math.min(1500, Math.max(0, targetQty - 1000)), pricePerKg: 25.00, reliabilityScore: 92 },
        { supplierName: 'GreenValley FPO Warehouse C', type: 'FPO Co-op Hub', location: 'Madurai Hub', allocatedQuantity: Math.min(2500, Math.max(0, targetQty - 2500)), pricePerKg: 24.00, reliabilityScore: 96 }
      ];
      const fulfilled = suppliers.reduce((acc, s) => acc + s.allocatedQuantity, 0);
      return {
        success: true,
        aggregation: {
          targetQuantity: targetQty,
          fulfilledQuantity: fulfilled,
          isFulfilled: fulfilled >= targetQty,
          suppliersCount: suppliers.filter(s => s.allocatedQuantity > 0).length,
          averagePricePerKg: 24.40,
          aggregateReliability: 94.5,
          selectedSuppliers: suppliers.filter(s => s.allocatedQuantity > 0)
        }
      };
    }
  },

  // AI Quality Grading
  analyzeQuality: async (payload) => {
    try {
      const res = await apiClient.post('/quality/analyze', payload);
      return res.data;
    } catch (err) {
      const isA = payload.sampleQuality === 'optimal';
      return {
        success: true,
        assessment: {
          product: payload.product || 'Tomato',
          assessedAt: new Date().toISOString(),
          grade: isA ? 'Grade A' : 'Grade B',
          confidenceScore: isA ? 95.8 : 88.4,
          metrics: {
            colorUniformity: isA ? '96.2%' : '84.0%',
            surfaceBlemishRatio: isA ? '1.2%' : '8.5%',
            firmnessScore: isA ? 'Firm / Peak Freshness' : 'Moderate / Processing Grade',
            estimatedShelfLife: isA ? '9 days' : '4 days',
            exportStandardMet: isA
          },
          disclaimer: 'The quality assessment is AI-assisted and is not an absolute warranty.'
        }
      };
    }
  },

  // Demand Forecast
  getDemandForecast: async (product = 'Tomato') => {
    try {
      const res = await apiClient.get(`/demand/${product}`);
      return res.data;
    } catch (err) {
      return {
        success: true,
        forecast: {
          region: 'Chennai, Tamil Nadu',
          product: product,
          horizonDays: 14,
          currentDemand: 3500,
          predictedDemand: 5000,
          availableSupply: 3200,
          predictedShortage: 1800,
          confidenceScore: 92.4,
          status: 'SHORTAGE_RISK',
          historicalTrend: [
            { label: 'Day -10', demand: 3100, supply: 3300 },
            { label: 'Day -7', demand: 3250, supply: 3300 },
            { label: 'Day -4', demand: 3400, supply: 3250 },
            { label: 'Today', demand: 3500, supply: 3200 },
            { label: 'Day +5', demand: 4100, supply: 3100 },
            { label: 'Day +10', demand: 4700, supply: 3000 },
            { label: 'Day +14', demand: 5000, supply: 3200 }
          ],
          aiRecommendations: [
            'Route 1,800 kg surplus from Madurai and Dindigul FPOs immediately',
            'Pre-contract bulk buyers at guaranteed ₹24/kg floor price',
            'Notify logistics partners for refrigerated fleet reservation'
          ]
        }
      };
    }
  },

  // Waste & Anomaly
  getWasteRisk: async () => {
    try {
      const res = await apiClient.get('/waste-risk');
      return res.data;
    } catch (err) {
      return {
        success: true,
        data: {
          wasteAlerts: [
            {
              id: 'waste_01',
              product: 'Tomato (Batch AGR-2026-0980)',
              location: 'Salem Secondary Depot',
              stockQuantity: 2000,
              unit: 'kg',
              stockAgeDays: 6,
              shelfLifeRemainingDays: 2,
              wasteRisk: 'HIGH',
              projectedLossInr: 48000,
              aiRecommendations: [
                'Target nearby bulk sauce processors & food catering units within 45 km radius',
                'Apply flash discount of 25% (₹18/kg) on consumer Blinkit showcase',
                'Initiate cold transit relocation to high-demand Chennai hub'
              ]
            }
          ],
          anomalyAlerts: [
            {
              id: 'anom_01',
              type: 'QUANTITY_INCONSISTENCY',
              severity: 'WARNING',
              entity: 'Depot 3 Intake — Nashik',
              details: 'Reported weighbridge intake 14,200 kg vs. aggregate dispatch manifest 12,800 kg (+10.9% variance).',
              timestamp: 'Today, 11:20 AM',
              status: 'UNDER_INVESTIGATION'
            }
          ]
        }
      };
    }
  },

  // Produce Passport
  getProducePassport: async (batchId) => {
    try {
      const res = await apiClient.get(`/passport/${batchId}`);
      return res.data;
    } catch (err) {
      return { success: true, passport: INITIAL_PASSPORT };
    }
  },

  // Orders
  getOrders: async () => {
    try {
      const res = await apiClient.get('/orders');
      return res.data;
    } catch (err) {
      return { success: true, orders: INITIAL_ORDERS };
    }
  },

  createOrder: async (orderData) => {
    try {
      const res = await apiClient.post('/orders', orderData);
      return res.data;
    } catch (err) {
      const newOrd = {
        id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ...orderData,
        orderStatus: 'CONFIRMED',
        createdAt: 'Just now',
        estimatedDelivery: 'Within 45-90 mins',
        timeline: [
          { status: 'PENDING', time: 'Just now', completed: true },
          { status: 'CONFIRMED', time: 'Just now', completed: true },
          { status: 'PROCESSING', time: 'Pending', completed: false },
          { status: 'READY_FOR_PICKUP', time: 'Pending', completed: false },
          { status: 'PICKED_UP', time: 'Pending', completed: false },
          { status: 'IN_TRANSIT', time: 'Pending', completed: false },
          { status: 'DELIVERED', time: 'Pending', completed: false }
        ]
      };
      return { success: true, order: newOrd };
    }
  },

  // Logistics
  getLogistics: async () => {
    try {
      const res = await apiClient.get('/logistics');
      return res.data;
    } catch (err) {
      return {
        success: true,
        assignments: [
          {
            assignmentId: 'LOG-ASG-9901',
            orderId: 'ORD-2026-7821',
            pickupLocation: 'Anna Nagar Hub Dark Store, Chennai',
            dropLocation: 'Flat 4B, Emerald Heights, Anna Nagar West, Chennai',
            distanceKm: 3.8,
            estTimeMinutes: 18,
            vehicle: 'Hero Electric Cargo Bike (TN-01-EQ-9102)',
            riderName: 'Suresh Kumar',
            status: 'IN_TRANSIT',
            earnings: 45
          }
        ]
      };
    }
  },

  // Support
  submitSupportTicket: async (ticketData) => {
    try {
      const res = await apiClient.post('/support', ticketData);
      return res.data;
    } catch (err) {
      return {
        success: true,
        ticket: {
          id: `TCK-${Math.floor(4080 + Math.random() * 100)}`,
          ...ticketData,
          status: 'Open',
          createdAt: 'Just now',
          assignedTo: 'Agricultural Support Desk'
        }
      };
    }
  }
};
