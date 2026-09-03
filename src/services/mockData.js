/**
 * Frontend Mock Data Fallback
 * Synchronized with the backend/mock_data.py specifications
 */

export const INITIAL_USERS = [
  {
    id: "usr_consumer_1",
    name: "Priya Sundaram",
    email: "priya@example.com",
    role: "Consumer",
    phone: "+91 98765 43210",
    city: "Chennai",
    state: "Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "usr_buyer_1",
    name: "Karthik Raja",
    company: "Evergreen Supermarkets Pvt Ltd",
    email: "karthik@evergreen.in",
    role: "Bulk Buyer",
    phone: "+91 98401 22334",
    city: "Chennai",
    state: "Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "usr_fpo_1",
    name: "S. Ramanathan",
    organization: "Madurai GreenValley Farmers Producer Co-op",
    email: "fpo@greenvalley.org",
    role: "FPO",
    phone: "+91 94432 88990",
    city: "Madurai",
    state: "Tamil Nadu",
    memberFarmersCount: 340,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "usr_logistics_1",
    name: "Murugan K.",
    organization: "Veloce Agri-Logistics",
    email: "logistics@veloceagro.com",
    role: "Logistics Partner",
    phone: "+91 99620 11223",
    city: "Madurai - Chennai Corridor",
    fleetSize: 18,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "usr_admin_1",
    name: "AgriDirect System Admin",
    email: "admin@agridirect.ai",
    role: "Admin",
    phone: "+91 80 4000 9000",
    city: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    name: "Heritage Country Tomato (நாட்டு தக்காளி)",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    availableQty: 500,
    minBulkQty: 50,
    bulkPrice: 22,
    grade: "Grade A",
    supplier: "ABC Farmer (via GreenValley FPO)",
    supplierId: "usr_fpo_1",
    location: "Madurai, Tamil Nadu",
    harvestDate: "2026-08-28",
    availability: "Ready Stock",
    supplierReliability: 94,
    rating: 4.7,
    reviewsCount: 86,
    batchId: "AGR-2026-1024",
    shelfLifeDays: 8,
    stockAgeDays: 1,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    description: "Naturally ripened vine tomatoes grown in organic red soil of Madurai. High lycopene content, firm skin, ideal for cooking and fresh salads."
  },
  {
    id: "prod_2",
    name: "Ooty Table Potato (நீலகிரி உருளைக்கிழங்கு)",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    availableQty: 1200,
    minBulkQty: 100,
    bulkPrice: 26,
    grade: "Grade A",
    supplier: "Nilgiris High-Altitude FPO",
    supplierId: "usr_fpo_2",
    location: "Ooty, Tamil Nadu",
    harvestDate: "2026-08-27",
    availability: "Ready Stock",
    supplierReliability: 96,
    rating: 4.8,
    reviewsCount: 112,
    batchId: "AGR-2026-1038",
    shelfLifeDays: 30,
    stockAgeDays: 2,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    description: "Crisp hill-station potatoes free from sprouting. Excellent dry matter for chips, fries, and traditional curries."
  },
  {
    id: "prod_3",
    name: "Nashik Red Onion (नाशिक लाल कांदा)",
    category: "Vegetables",
    price: 28,
    unit: "kg",
    availableQty: 2500,
    minBulkQty: 150,
    bulkPrice: 24,
    grade: "Grade B",
    supplier: "Sahyadri Agro Farmers Co-op",
    supplierId: "usr_fpo_3",
    location: "Nashik, Maharashtra",
    harvestDate: "2026-08-25",
    availability: "Ready Stock",
    supplierReliability: 89,
    rating: 4.6,
    reviewsCount: 94,
    batchId: "AGR-2026-1012",
    shelfLifeDays: 21,
    stockAgeDays: 4,
    wasteRisk: "Medium",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    description: "Medium-sized pungent red onions cured under sun drying. High sulfur pungent aroma, standard commercial grade."
  },
  {
    id: "prod_4",
    name: "Karnal Aged 1121 Basmati Rice",
    category: "Grains",
    price: 85,
    unit: "kg",
    availableQty: 4000,
    minBulkQty: 200,
    bulkPrice: 78,
    grade: "Grade A",
    supplier: "Haryana Grain Producers Union",
    supplierId: "usr_fpo_4",
    location: "Karnal, Haryana",
    harvestDate: "2026-07-15",
    availability: "Ready Stock",
    supplierReliability: 98,
    rating: 4.9,
    reviewsCount: 145,
    batchId: "AGR-2026-0899",
    shelfLifeDays: 365,
    stockAgeDays: 20,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    description: "Extra long grain aged basmati with rich aroma and non-sticky elongation post cooking."
  },
  {
    id: "prod_5",
    name: "Latur Desi Toor Dal (तुवर डाळ)",
    category: "Pulses",
    price: 130,
    unit: "kg",
    availableQty: 1800,
    minBulkQty: 100,
    bulkPrice: 120,
    grade: "Grade A",
    supplier: "Marathwada Organic Pulse FPO",
    supplierId: "usr_fpo_5",
    location: "Latur, Maharashtra",
    harvestDate: "2026-08-10",
    availability: "Ready Stock",
    supplierReliability: 95,
    rating: 4.8,
    reviewsCount: 67,
    batchId: "AGR-2026-0941",
    shelfLifeDays: 180,
    stockAgeDays: 12,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    description: "Unpolished organic yellow split pigeon peas. Rich protein yield with authentic aroma."
  },
  {
    id: "prod_6",
    name: "Kinnaur Royal Delicious Apples",
    category: "Fruits",
    price: 145,
    unit: "kg",
    availableQty: 850,
    minBulkQty: 50,
    bulkPrice: 132,
    grade: "Grade A",
    supplier: "Himachal Apple Collective",
    supplierId: "usr_fpo_6",
    location: "Kinnaur, Himachal Pradesh",
    harvestDate: "2026-08-26",
    availability: "Ready Stock",
    supplierReliability: 93,
    rating: 4.9,
    reviewsCount: 180,
    batchId: "AGR-2026-1045",
    shelfLifeDays: 25,
    stockAgeDays: 3,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    description: "High-altitude handpicked crisp red apples. Wax-free, naturally sweet and packed in eco-friendly crates."
  },
  {
    id: "prod_7",
    name: "Nagpur Mandarin Oranges (नागपूर संत्री)",
    category: "Fruits",
    price: 55,
    unit: "kg",
    availableQty: 1500,
    minBulkQty: 100,
    bulkPrice: 48,
    grade: "Grade A",
    supplier: "Vidarbha Citrus FPO",
    supplierId: "usr_fpo_7",
    location: "Nagpur, Maharashtra",
    harvestDate: "2026-08-27",
    availability: "Ready Stock",
    supplierReliability: 91,
    rating: 4.7,
    reviewsCount: 78,
    batchId: "AGR-2026-1051",
    shelfLifeDays: 14,
    stockAgeDays: 2,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80",
    description: "Juicy loose-jacket mandarins with perfect sweet-tart balance. Excellent for fresh table consumption or cold-pressed juices."
  },
  {
    id: "prod_8",
    name: "Erode Organic Alleppey Finger Turmeric",
    category: "Spices",
    price: 165,
    unit: "kg",
    availableQty: 900,
    minBulkQty: 50,
    bulkPrice: 150,
    grade: "Grade A",
    supplier: "Kongu Spices Producers Co-op",
    supplierId: "usr_fpo_8",
    location: "Erode, Tamil Nadu",
    harvestDate: "2026-07-20",
    availability: "Ready Stock",
    supplierReliability: 97,
    rating: 4.9,
    reviewsCount: 89,
    batchId: "AGR-2026-0870",
    shelfLifeDays: 365,
    stockAgeDays: 18,
    wasteRisk: "Low",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    description: "GI-tagged Erode turmeric fingers containing >4.8% natural curcumin. Cured and sun-dried according to organic export standards."
  }
];

export const INITIAL_PASSPORT = {
  batchId: "AGR-2026-1024",
  product: "Heritage Country Tomato",
  variety: "Local Country Desi (நாட்டு தக்காளி)",
  quantity: "2,000 kg (Aggregated from 3 farmers)",
  grade: "Grade A",
  qualityScore: 94.6,
  origin: "Madurai, Tamil Nadu, India",
  gpsCoordinates: {
    latitude: 9.9252,
    longitude: 78.1198,
    plotName: "Plot 4B & 7A, Alanganallur Green Belt"
  },
  farmerContributors: [
    { name: "M. Murugesan", plot: "Alanganallur Plot 4B", qty: "800 kg", soilType: "Red Loamy" },
    { name: "S. Chelladurai", plot: "Vadipatti Plot 12C", qty: "700 kg", soilType: "Alluvial" },
    { name: "P. Kalyani", plot: "Usilampatti Plot 3A", qty: "500 kg", soilType: "Red Loamy" }
  ],
  fpo: {
    name: "Madurai GreenValley Farmers Producer Co-op",
    regNumber: "FPO-TN-MDU-2021-0842",
    manager: "S. Ramanathan",
    verificationDate: "2026-08-28 10:30 AM"
  },
  warehouse: {
    name: "Madurai Integrated Agro-Cold Hub",
    temperature: "12.4 °C",
    humidity: "88%",
    intakeTimestamp: "2026-08-28 03:15 PM"
  },
  logistics: {
    partner: "Veloce Agri-Logistics",
    vehicleNumber: "TN-58-BZ-4412 (Refrigerated Eicher Pro)",
    driverName: "K. Murugan",
    dispatchTimestamp: "2026-08-29 06:00 AM",
    iotSensorId: "IOT-TEMP-9982",
    currentLocation: "Tiruchirappalli Corridor (En route to Chennai)"
  },
  verificationStatus: "VERIFIED_AUTHENTIC",
  timeline: [
    {
      step: "Farmer Plot Harvest",
      timestamp: "2026-08-28 06:30 AM",
      location: "Alanganallur & Vadipatti, Madurai",
      status: "COMPLETED",
      description: "Hand-harvested at optimal 85% vine-ripeness stage.",
      gps: "9.9252° N, 78.1198° E"
    },
    {
      step: "AI Quality Grading & Classification",
      timestamp: "2026-08-28 09:45 AM",
      location: "GreenValley FPO Grading Facility",
      status: "COMPLETED",
      description: "Scanned via AgriDirect Computer Vision AI. Classification: Grade A (Confidence: 94.6%).",
      inspector: "AI Auto-Assessor V2.4"
    },
    {
      step: "FPO Multi-Farmer Aggregation",
      timestamp: "2026-08-28 11:30 AM",
      location: "GreenValley Sorting Hub, Madurai",
      status: "COMPLETED",
      description: "Combined 3 farmer yields into verified 2,000 kg export-grade batch AGR-2026-1024."
    },
    {
      step: "Cold Chain Warehouse Intake",
      timestamp: "2026-08-28 03:15 PM",
      location: "Madurai Agro-Cold Hub",
      status: "COMPLETED",
      description: "Pre-cooled to 12.4°C. Relative humidity calibrated to 88% to arrest decay."
    },
    {
      step: "Smart Logistics Dispatch",
      timestamp: "2026-08-29 06:00 AM",
      location: "Corridor NH-45 Madurai -> Chennai",
      status: "IN_TRANSIT",
      description: "Loaded in refrigerated carrier TN-58-BZ-4412 with real-time temperature telemetry."
    },
    {
      step: "Buyer Delivery & Digital PoD",
      timestamp: "Expected 2026-08-29 04:30 PM",
      location: "Koyambedu Wholesale & Retail Hub, Chennai",
      status: "SCHEDULED",
      description: "Automated QR code scan & digital signature verification upon delivery."
    }
  ]
};

export const INITIAL_REQUIREMENTS = [
  {
    id: "req_1",
    buyerId: "usr_buyer_1",
    buyerName: "Karthik Raja (Evergreen Supermarkets)",
    product: "Onion",
    category: "Vegetables",
    quantity: 5000,
    unit: "kg",
    budgetMin: 25,
    budgetMax: 28,
    targetDate: "2026-09-10",
    destination: "Chennai Central Cold Warehouse, TN",
    status: "OPEN_FOR_BIDS",
    createdAt: "2026-08-30",
    bidsCount: 4,
    aggregatedStatus: "Aggregated (3 Suppliers Selected)",
    matchingScore: 95,
    bids: [
      {
        bidId: "bid_101",
        supplierName: "Sahyadri Agro Farmers Co-op",
        supplierRole: "FPO",
        location: "Nashik, Maharashtra",
        quantityOffered: 2500,
        pricePerKg: 26.50,
        grade: "Grade A",
        reliabilityScore: 94,
        distanceKm: 1150,
        status: "ACCEPTED"
      },
      {
        bidId: "bid_102",
        supplierName: "Dindigul Onion Growers Union",
        supplierRole: "FPO",
        location: "Dindigul, Tamil Nadu",
        quantityOffered: 1500,
        pricePerKg: 27.00,
        grade: "Grade A",
        reliabilityScore: 91,
        distanceKm: 420,
        status: "ACCEPTED"
      },
      {
        bidId: "bid_103",
        supplierName: "Perambalur Small Farmers Group",
        supplierRole: "FPO",
        location: "Perambalur, Tamil Nadu",
        quantityOffered: 1000,
        pricePerKg: 26.00,
        grade: "Grade B",
        reliabilityScore: 88,
        distanceKm: 280,
        status: "ACCEPTED"
      }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-2026-7821",
    userId: "usr_consumer_1",
    customerName: "Priya Sundaram",
    customerPhone: "+91 98765 43210",
    deliveryAddress: "Flat 4B, Emerald Heights, Anna Nagar West, Chennai - 600040",
    mode: "Everyday Purchase",
    items: [
      {
        productId: "prod_1",
        name: "Heritage Country Tomato",
        quantity: 3,
        unit: "kg",
        price: 25,
        batchId: "AGR-2026-1024"
      },
      {
        productId: "prod_2",
        name: "Ooty Table Potato",
        quantity: 2,
        unit: "kg",
        price: 30,
        batchId: "AGR-2026-1038"
      }
    ],
    subtotal: 135,
    deliveryFee: 25,
    tax: 0,
    total: 160,
    paymentStatus: "PAID_ONLINE",
    paymentMethod: "UPI (Google Pay)",
    orderStatus: "IN_TRANSIT",
    createdAt: "2026-08-31 08:30 AM",
    estimatedDelivery: "Today, 11:30 AM",
    logisticsPartner: "Veloce Instant Delivery",
    trackingNumber: "VEL-CHN-88219",
    timeline: [
      { status: "PENDING", time: "08:30 AM", completed: true },
      { status: "CONFIRMED", time: "08:32 AM", completed: true },
      { status: "PROCESSING", time: "08:40 AM", completed: true },
      { status: "READY_FOR_PICKUP", time: "09:05 AM", completed: true },
      { status: "PICKED_UP", time: "09:20 AM", completed: true },
      { status: "IN_TRANSIT", time: "09:35 AM", completed: true },
      { status: "DELIVERED", time: "11:30 AM", completed: false }
    ]
  }
];

export const USERS = INITIAL_USERS;
export const PRODUCTS = INITIAL_PRODUCTS;
export const ORDERS = INITIAL_ORDERS;
export const BUYER_REQUIREMENTS = INITIAL_REQUIREMENTS;
export const PRODUCE_PASSPORTS = { [INITIAL_PASSPORT.batchId]: INITIAL_PASSPORT };
