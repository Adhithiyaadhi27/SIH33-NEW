"""
Realistic Indian Agricultural Dataset for AgriDirect AI
Includes real locations, varieties, market prices, FPO networks,
traceability passports, and AI metrics.
"""

USERS = [
    {
        "id": "usr_consumer_1",
        "name": "Priya Sundaram",
        "email": "priya@example.com",
        "role": "Consumer",
        "phone": "+91 98765 43210",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
    },
    {
        "id": "usr_buyer_1",
        "name": "Karthik Raja (Evergreen Mart)",
        "email": "karthik@evergreen.in",
        "role": "Bulk Buyer",
        "phone": "+91 98401 22334",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "company": "Evergreen Supermarkets Pvt Ltd",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
    },
    {
        "id": "usr_fpo_1",
        "name": "GreenValley FPO (S. Ramanathan)",
        "email": "fpo@greenvalley.org",
        "role": "FPO",
        "phone": "+91 94432 88990",
        "city": "Madurai",
        "state": "Tamil Nadu",
        "organization": "Madurai GreenValley Farmers Producer Co-op",
        "memberFarmersCount": 340,
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
    },
    {
        "id": "usr_logistics_1",
        "name": "Veloce Agri-Logistics (Murugan)",
        "email": "logistics@veloceagro.com",
        "role": "Logistics Partner",
        "phone": "+91 99620 11223",
        "city": "Madurai - Chennai Corridor",
        "state": "Tamil Nadu",
        "fleetSize": 18,
        "vehicleType": "Refrigerated 4-Ton & 8-Ton Eicher Trucks",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"
    },
    {
        "id": "usr_admin_1",
        "name": "AgriDirect System Administrator",
        "email": "admin@agridirect.ai",
        "role": "Admin",
        "phone": "+91 80 4000 9000",
        "city": "Bangalore",
        "state": "Karnataka",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80"
    }
]

PRODUCTS = [
    {
        "id": "prod_1",
        "name": "Heritage Country Tomato (நாட்டு தக்காளி)",
        "category": "Vegetables",
        "price": 25,
        "unit": "kg",
        "availableQty": 500,
        "minBulkQty": 50,
        "bulkPrice": 22,
        "grade": "Grade A",
        "supplier": "ABC Farmer (via GreenValley FPO)",
        "supplierId": "usr_fpo_1",
        "location": "Madurai, Tamil Nadu",
        "harvestDate": "2026-08-28",
        "availability": "Ready Stock",
        "supplierReliability": 94,
        "rating": 4.7,
        "reviewsCount": 86,
        "batchId": "AGR-2026-1024",
        "shelfLifeDays": 8,
        "stockAgeDays": 1,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
        "description": "Naturally ripened vine tomatoes grown in organic red soil of Madurai. High lycopene content, firm skin, ideal for cooking and fresh salads."
    },
    {
        "id": "prod_2",
        "name": "Ooty Table Potato (நீலகிரி உருளைக்கிழங்கு)",
        "category": "Vegetables",
        "price": 30,
        "unit": "kg",
        "availableQty": 1200,
        "minBulkQty": 100,
        "bulkPrice": 26,
        "grade": "Grade A",
        "supplier": "Nilgiris High-Altitude FPO",
        "supplierId": "usr_fpo_2",
        "location": "Ooty, Tamil Nadu",
        "harvestDate": "2026-08-27",
        "availability": "Ready Stock",
        "supplierReliability": 96,
        "rating": 4.8,
        "reviewsCount": 112,
        "batchId": "AGR-2026-1038",
        "shelfLifeDays": 30,
        "stockAgeDays": 2,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
        "description": "Crisp hill-station potatoes free from sprouting. Excellent dry matter for chips, fries, and traditional curries."
    },
    {
        "id": "prod_3",
        "name": "Nashik Red Onion (नाशिक लाल कांदा)",
        "category": "Vegetables",
        "price": 28,
        "unit": "kg",
        "availableQty": 2500,
        "minBulkQty": 150,
        "bulkPrice": 24,
        "grade": "Grade B",
        "supplier": "Sahyadri Agro Farmers Co-op",
        "supplierId": "usr_fpo_3",
        "location": "Nashik, Maharashtra",
        "harvestDate": "2026-08-25",
        "availability": "Ready Stock",
        "supplierReliability": 89,
        "rating": 4.6,
        "reviewsCount": 94,
        "batchId": "AGR-2026-1012",
        "shelfLifeDays": 21,
        "stockAgeDays": 4,
        "wasteRisk": "Medium",
        "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
        "description": "Medium-sized pungent red onions cured under sun drying. High sulfur pungent aroma, standard commercial grade."
    },
    {
        "id": "prod_4",
        "name": "Karnal Aged 1121 Basmati Rice",
        "category": "Grains",
        "price": 85,
        "unit": "kg",
        "availableQty": 4000,
        "minBulkQty": 200,
        "bulkPrice": 78,
        "grade": "Grade A",
        "supplier": "Haryana Grain Producers Union",
        "supplierId": "usr_fpo_4",
        "location": "Karnal, Haryana",
        "harvestDate": "2026-07-15",
        "availability": "Ready Stock",
        "supplierReliability": 98,
        "rating": 4.9,
        "reviewsCount": 145,
        "batchId": "AGR-2026-0899",
        "shelfLifeDays": 365,
        "stockAgeDays": 20,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        "description": "Extra long grain aged basmati with rich aroma and non-sticky elongation post cooking."
    },
    {
        "id": "prod_5",
        "name": "Latur Desi Toor Dal (तुवर डाळ)",
        "category": "Pulses",
        "price": 130,
        "unit": "kg",
        "availableQty": 1800,
        "minBulkQty": 100,
        "bulkPrice": 120,
        "grade": "Grade A",
        "supplier": "Marathwada Organic Pulse FPO",
        "supplierId": "usr_fpo_5",
        "location": "Latur, Maharashtra",
        "harvestDate": "2026-08-10",
        "availability": "Ready Stock",
        "supplierReliability": 95,
        "rating": 4.8,
        "reviewsCount": 67,
        "batchId": "AGR-2026-0941",
        "shelfLifeDays": 180,
        "stockAgeDays": 12,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
        "description": "Unpolished organic yellow split pigeon peas. Rich protein yield with authentic aroma."
    },
    {
        "id": "prod_6",
        "name": "Kinnaur Royal Delicious Apples",
        "category": "Fruits",
        "price": 145,
        "unit": "kg",
        "availableQty": 850,
        "minBulkQty": 50,
        "bulkPrice": 132,
        "grade": "Grade A",
        "supplier": "Himachal Apple Growers Collective",
        "supplierId": "usr_fpo_6",
        "location": "Kinnaur, Himachal Pradesh",
        "harvestDate": "2026-08-26",
        "availability": "Ready Stock",
        "supplierReliability": 93,
        "rating": 4.9,
        "reviewsCount": 180,
        "batchId": "AGR-2026-1045",
        "shelfLifeDays": 25,
        "stockAgeDays": 3,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        "description": "High-altitude handpicked crisp red apples. Wax-free, naturally sweet and packed in eco-friendly crates."
    },
    {
        "id": "prod_7",
        "name": "Nagpur Mandarin Oranges (नागपूर संत्री)",
        "category": "Fruits",
        "price": 55,
        "unit": "kg",
        "availableQty": 1500,
        "minBulkQty": 100,
        "bulkPrice": 48,
        "grade": "Grade A",
        "supplier": "Vidarbha Citrus FPO",
        "supplierId": "usr_fpo_7",
        "location": "Nagpur, Maharashtra",
        "harvestDate": "2026-08-27",
        "availability": "Ready Stock",
        "supplierReliability": 91,
        "rating": 4.7,
        "reviewsCount": 78,
        "batchId": "AGR-2026-1051",
        "shelfLifeDays": 14,
        "stockAgeDays": 2,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80",
        "description": "Juicy loose-jacket mandarins with perfect sweet-tart balance. Excellent for fresh table consumption or cold-pressed juices."
    },
    {
        "id": "prod_8",
        "name": "Erode Organic Alleppey Finger Turmeric",
        "category": "Spices",
        "price": 165,
        "unit": "kg",
        "availableQty": 900,
        "minBulkQty": 50,
        "bulkPrice": 150,
        "grade": "Grade A",
        "supplier": "Kongu Spices Producers Co-op",
        "supplierId": "usr_fpo_8",
        "location": "Erode, Tamil Nadu",
        "harvestDate": "2026-07-20",
        "availability": "Ready Stock",
        "supplierReliability": 97,
        "rating": 4.9,
        "reviewsCount": 89,
        "batchId": "AGR-2026-0870",
        "shelfLifeDays": 365,
        "stockAgeDays": 18,
        "wasteRisk": "Low",
        "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
        "description": "GI-tagged Erode turmeric fingers containing >4.8% natural curcumin. Cured and sun-dried according to organic export standards."
    }
]

BUYER_REQUIREMENTS = [
    {
        "id": "req_1",
        "buyerId": "usr_buyer_1",
        "buyerName": "Karthik Raja (Evergreen Supermarkets)",
        "product": "Onion",
        "category": "Vegetables",
        "quantity": 5000,
        "unit": "kg",
        "budgetMin": 25,
        "budgetMax": 28,
        "targetDate": "2026-09-10",
        "destination": "Chennai Central Cold Warehouse, TN",
        "status": "OPEN_FOR_BIDS",
        "createdAt": "2026-08-30",
        "bidsCount": 4,
        "aggregatedStatus": "Aggregated (3 Suppliers Selected)",
        "matchingScore": 95,
        "bids": [
            {
                "bidId": "bid_101",
                "supplierName": "Sahyadri Agro Farmers Co-op",
                "supplierRole": "FPO",
                "location": "Nashik, Maharashtra",
                "quantityOffered": 2500,
                "pricePerKg": 26.50,
                "grade": "Grade A",
                "reliabilityScore": 94,
                "distanceKm": 1150,
                "status": "ACCEPTED"
            },
            {
                "bidId": "bid_102",
                "supplierName": "Dindigul Onion Growers Union",
                "supplierRole": "FPO",
                "location": "Dindigul, Tamil Nadu",
                "quantityOffered": 1500,
                "pricePerKg": 27.00,
                "grade": "Grade A",
                "reliabilityScore": 91,
                "distanceKm": 420,
                "status": "ACCEPTED"
            },
            {
                "bidId": "bid_103",
                "supplierName": "Perambalur Small Farmers Group",
                "supplierRole": "FPO",
                "location": "Perambalur, Tamil Nadu",
                "quantityOffered": 1000,
                "pricePerKg": 26.00,
                "grade": "Grade B",
                "reliabilityScore": 88,
                "distanceKm": 280,
                "status": "ACCEPTED"
            },
            {
                "bidId": "bid_104",
                "supplierName": "Kolar Agri Traders",
                "supplierRole": "FPO",
                "location": "Kolar, Karnataka",
                "quantityOffered": 3000,
                "pricePerKg": 29.50,
                "grade": "Grade A",
                "reliabilityScore": 82,
                "distanceKm": 310,
                "status": "REJECTED_PRICE_EXCEEDED"
            }
        ]
    },
    {
        "id": "req_2",
        "buyerId": "usr_buyer_2",
        "buyerName": "Nilgiri Fresh Juice & Beverages",
        "product": "Nagpur Mandarin Oranges",
        "category": "Fruits",
        "quantity": 3000,
        "unit": "kg",
        "budgetMin": 45,
        "budgetMax": 50,
        "targetDate": "2026-09-12",
        "destination": "Bangalore Fulfillment Hub, KA",
        "status": "MATCHING_IN_PROGRESS",
        "createdAt": "2026-08-31",
        "bidsCount": 2,
        "aggregatedStatus": "AI Matching 2 Suppliers",
        "matchingScore": 88,
        "bids": []
    }
]

PRODUCE_PASSPORTS = {
    "AGR-2026-1024": {
        "batchId": "AGR-2026-1024",
        "product": "Heritage Country Tomato",
        "variety": "Local Country Desi (நாட்டு தக்காளி)",
        "quantity": "2,000 kg (Aggregated from 3 farmers)",
        "grade": "Grade A",
        "qualityScore": 94.6,
        "origin": "Madurai, Tamil Nadu, India",
        "gpsCoordinates": {
            "latitude": 9.9252,
            "longitude": 78.1198,
            "plotName": "Plot 4B & 7A, Alanganallur Green Belt"
        },
        "farmerContributors": [
            {"name": "M. Murugesan", "plot": "Alanganallur Plot 4B", "qty": "800 kg", "soilType": "Red Loamy"},
            {"name": "S. Chelladurai", "plot": "Vadipatti Plot 12C", "qty": "700 kg", "soilType": "Alluvial"},
            {"name": "P. Kalyani", "plot": "Usilampatti Plot 3A", "qty": "500 kg", "soilType": "Red Loamy"}
        ],
        "fpo": {
            "id": "fpo_greenvalley",
            "name": "Madurai GreenValley Farmers Producer Co-op",
            "regNumber": "FPO-TN-MDU-2021-0842",
            "manager": "S. Ramanathan",
            "verificationDate": "2026-08-28 10:30 AM"
        },
        "warehouse": {
            "id": "wh_central_mdu",
            "name": "Madurai Integrated Agro-Cold Hub",
            "temperature": "12.4 °C",
            "humidity": "88%",
            "intakeTimestamp": "2026-08-28 03:15 PM"
        },
        "logistics": {
            "partner": "Veloce Agri-Logistics",
            "vehicleNumber": "TN-58-BZ-4412 (Refrigerated Eicher Pro)",
            "driverName": "K. Murugan",
            "dispatchTimestamp": "2026-08-29 06:00 AM",
            "iotSensorId": "IOT-TEMP-9982",
            "currentLocation": "Tiruchirappalli Bypass (En route to Chennai)"
        },
        "verificationStatus": "VERIFIED_AUTHENTIC",
        "timeline": [
            {
                "step": "Farmer Plot Harvest",
                "timestamp": "2026-08-28 06:30 AM",
                "location": "Alanganallur & Vadipatti, Madurai",
                "status": "COMPLETED",
                "description": "Hand-harvested at optimal 85% vine-ripeness stage.",
                "gps": "9.9252° N, 78.1198° E"
            },
            {
                "step": "AI Quality Grading & Classification",
                "timestamp": "2026-08-28 09:45 AM",
                "location": "GreenValley FPO Grading Facility",
                "status": "COMPLETED",
                "description": "Scanned via AgriDirect Computer Vision AI. Classification: Grade A (Confidence: 94.6%).",
                "inspector": "AI Auto-Assessor V2.4"
            },
            {
                "step": "FPO Multi-Farmer Aggregation",
                "timestamp": "2026-08-28 11:30 AM",
                "location": "GreenValley Sorting Hub, Madurai",
                "status": "COMPLETED",
                "description": "Combined 3 farmer yields into verified 2,000 kg export-grade batch AGR-2026-1024."
            },
            {
                "step": "Cold Chain Warehouse Intake",
                "timestamp": "2026-08-28 03:15 PM",
                "location": "Madurai Agro-Cold Hub",
                "status": "COMPLETED",
                "description": "Pre-cooled to 12.4°C. Relative humidity calibrated to 88% to arrest decay."
            },
            {
                "step": "Smart Logistics Dispatch",
                "timestamp": "2026-08-29 06:00 AM",
                "location": "Corridor NH-45 Madurai -> Chennai",
                "status": "IN_TRANSIT",
                "description": "Loaded in refrigerated carrier TN-58-BZ-4412 with real-time temperature telemetry."
            },
            {
                "step": "Buyer Delivery & Digital PoD",
                "timestamp": "Expected 2026-08-29 04:30 PM",
                "location": "Koyambedu Wholesale & Retail Hub, Chennai",
                "status": "SCHEDULED",
                "description": "Automated QR code scan & digital signature verification upon delivery."
            }
        ]
    }
}

DEMAND_PREDICTIONS = [
    {
        "region": "Chennai, Tamil Nadu",
        "product": "Tomato",
        "currentDemand": 3500,
        "predictedDemand": 5000,
        "availableSupply": 3200,
        "predictedShortage": 1800,
        "unit": "kg",
        "horizonDays": 14,
        "confidenceScore": 92.4,
        "drivers": [
            "Upcoming Festival Season (Ganesh Chaturthi + Onam)",
            "Excess rainfall in neighbouring Andhra belt affecting supply",
            "Retail supermarket demand surge (+28%)"
        ],
        "recommendedActions": [
            "Route 1,800 kg surplus from Madurai and Dindigul FPOs immediately",
            "Pre-contract bulk buyers at guaranteed ₹24/kg floor price",
            "Notify logistics partners for refrigerated fleet reservation"
        ],
        "historicalTrend": [
            {"date": "Day -10", "demand": 3100, "supply": 3300},
            {"date": "Day -7", "demand": 3250, "supply": 3300},
            {"date": "Day -4", "demand": 3400, "supply": 3250},
            {"date": "Today", "demand": 3500, "supply": 3200},
            {"date": "Day +5", "demand": 4100, "supply": 3100},
            {"date": "Day +10", "demand": 4700, "supply": 3000},
            {"date": "Day +14", "demand": 5000, "supply": 3200}
        ]
    },
    {
        "region": "Bangalore, Karnataka",
        "product": "Onion",
        "currentDemand": 6200,
        "predictedDemand": 7400,
        "availableSupply": 8100,
        "predictedShortage": 0,
        "predictedSurplus": 700,
        "unit": "kg",
        "horizonDays": 21,
        "confidenceScore": 89.1,
        "drivers": [
            "Heavy arrivals from Bijapur and Chitradurga harvests",
            "Stable consumer consumption baseline"
        ],
        "recommendedActions": [
            "Identify export / inter-state corridors to Kerala & Tamil Nadu",
            "Offer promotional volume discounts for restaurant bulk buyers",
            "Inspect warehouse storage to prevent humidity-triggered sprouting"
        ],
        "historicalTrend": [
            {"date": "Day -10", "demand": 5800, "supply": 7200},
            {"date": "Day -7", "demand": 6000, "supply": 7600},
            {"date": "Day -4", "demand": 6100, "supply": 7900},
            {"date": "Today", "demand": 6200, "supply": 8100},
            {"date": "Day +7", "demand": 6800, "supply": 8000},
            {"date": "Day +14", "demand": 7100, "supply": 7900},
            {"date": "Day +21", "demand": 7400, "supply": 8100}
        ]
    }
]

WASTE_AND_ANOMALIES = {
    "wasteAlerts": [
        {
            "id": "waste_01",
            "product": "Tomato (Batch AGR-2026-0980)",
            "location": "Salem Secondary Depot",
            "stockQuantity": 2000,
            "unit": "kg",
            "stockAgeDays": 6,
            "shelfLifeRemainingDays": 2,
            "salesVelocity": "Low (120 kg/day)",
            "wasteRisk": "HIGH",
            "projectedLossInr": 48000,
            "aiRecommendations": [
                "Target nearby bulk sauce processors & food catering units within 45 km radius",
                "Apply flash discount of 25% (₹18/kg) on consumer Blinkit showcase",
                "Initiate cold transit relocation to high-demand Chennai hub"
            ]
        },
        {
            "id": "waste_02",
            "product": "Spinach & Greens (Batch AGR-2026-1055)",
            "location": "Coimbatore Packhouse",
            "stockQuantity": 450,
            "unit": "kg",
            "stockAgeDays": 2,
            "shelfLifeRemainingDays": 1,
            "salesVelocity": "Medium (180 kg/day)",
            "wasteRisk": "HIGH",
            "projectedLossInr": 13500,
            "aiRecommendations": [
                "Prioritize instant delivery dispatch for morning retail consumer carts",
                "Bundle with salad boxes at special introductory price",
                "Divert unsold evening stock to local dehydrating unit"
            ]
        }
    ],
    "anomalyAlerts": [
        {
            "id": "anom_01",
            "type": "QUANTITY_INCONSISTENCY",
            "severity": "WARNING",
            "entity": "Depot 3 Intake — Nashik",
            "details": "Reported weighbridge intake 14,200 kg vs. aggregate dispatch manifest 12,800 kg (+10.9% variance).",
            "timestamp": "2026-08-31 11:20 AM",
            "status": "UNDER_INVESTIGATION"
        },
        {
            "id": "anom_02",
            "type": "SUDDEN_CANCELLATION_SPIKE",
            "severity": "CRITICAL",
            "entity": "Buyer Account BYR-9844",
            "details": "4 bulk orders cancelled within 40 minutes post supplier matching. Escrow lock placed for review.",
            "timestamp": "2026-08-30 04:50 PM",
            "status": "FLAGGED_FOR_ADMIN"
        }
    ]
}

SUPPLIER_RELIABILITY_SCORES = {
    "usr_fpo_1": {
        "supplierId": "usr_fpo_1",
        "supplierName": "Madurai GreenValley Farmers Producer Co-op",
        "overallScore": 94,
        "tier": "Tier-1 Certified FPO",
        "metrics": {
            "onTimeDelivery": 96.2,
            "quantityAccuracy": 94.8,
            "qualityConsistency": 93.5,
            "orderCompletion": 98.1,
            "cancellationRate": 0.8
        },
        "totalOrdersCompleted": 428,
        "totalVolumeDeliveredTonnes": 680,
        "disputesRaised": 2,
        "disputesResolved": 2
    },
    "usr_fpo_3": {
        "supplierId": "usr_fpo_3",
        "supplierName": "Sahyadri Agro Farmers Co-op",
        "overallScore": 89,
        "tier": "Tier-1 Verified FPO",
        "metrics": {
            "onTimeDelivery": 88.5,
            "quantityAccuracy": 92.0,
            "qualityConsistency": 89.4,
            "orderCompletion": 94.0,
            "cancellationRate": 2.1
        },
        "totalOrdersCompleted": 310,
        "totalVolumeDeliveredTonnes": 1150,
        "disputesRaised": 5,
        "disputesResolved": 4
    }
}

ORDERS = [
    {
        "id": "ORD-2026-7821",
        "userId": "usr_consumer_1",
        "customerName": "Priya Sundaram",
        "customerPhone": "+91 98765 43210",
        "deliveryAddress": "Flat 4B, Emerald Heights, Anna Nagar West, Chennai - 600040",
        "mode": "Everyday Purchase",
        "items": [
            {
                "productId": "prod_1",
                "name": "Heritage Country Tomato",
                "quantity": 3,
                "unit": "kg",
                "price": 25,
                "batchId": "AGR-2026-1024"
            },
            {
                "productId": "prod_2",
                "name": "Ooty Table Potato",
                "quantity": 2,
                "unit": "kg",
                "price": 30,
                "batchId": "AGR-2026-1038"
            }
        ],
        "subtotal": 135,
        "deliveryFee": 25,
        "tax": 0,
        "total": 160,
        "paymentStatus": "PAID_ONLINE",
        "paymentMethod": "UPI (Google Pay)",
        "orderStatus": "IN_TRANSIT",
        "createdAt": "2026-08-31 08:30 AM",
        "estimatedDelivery": "Today, 11:30 AM",
        "logisticsPartner": "Veloce Instant Delivery",
        "trackingNumber": "VEL-CHN-88219",
        "timeline": [
            {"status": "PENDING", "time": "08:30 AM", "completed": True},
            {"status": "CONFIRMED", "time": "08:32 AM", "completed": True},
            {"status": "PROCESSING", "time": "08:40 AM", "completed": True},
            {"status": "READY_FOR_PICKUP", "time": "09:05 AM", "completed": True},
            {"status": "PICKED_UP", "time": "09:20 AM", "completed": True},
            {"status": "IN_TRANSIT", "time": "09:35 AM", "completed": True},
            {"status": "DELIVERED", "time": "11:30 AM", "completed": False}
        ]
    },
    {
        "id": "ORD-2026-5501",
        "userId": "usr_buyer_1",
        "customerName": "Karthik Raja (Evergreen Mart)",
        "customerPhone": "+91 98401 22334",
        "deliveryAddress": "Central Distribution Center, GNT Road, Madhavaram, Chennai - 600110",
        "mode": "Bulk Procurement",
        "items": [
            {
                "productId": "prod_3",
                "name": "Nashik Red Onion (Aggregated)",
                "quantity": 5000,
                "unit": "kg",
                "price": 26.50,
                "batchId": "AGR-2026-1012"
            }
        ],
        "subtotal": 132500,
        "deliveryFee": 3500,
        "tax": 0,
        "total": 136000,
        "paymentStatus": "ESCROW_LOCKED",
        "paymentMethod": "Commercial Bank Transfer & Escrow",
        "orderStatus": "PROCESSING",
        "createdAt": "2026-08-30 02:15 PM",
        "estimatedDelivery": "2026-09-03 10:00 AM",
        "logisticsPartner": "Veloce Heavy Haul Corridor",
        "trackingNumber": "VEL-BLK-44012",
        "timeline": [
            {"status": "PENDING", "time": "Aug 30 02:15 PM", "completed": True},
            {"status": "CONFIRMED", "time": "Aug 30 02:40 PM", "completed": True},
            {"status": "PROCESSING", "time": "Aug 30 04:00 PM", "completed": True},
            {"status": "READY_FOR_PICKUP", "time": "Aug 31 06:00 AM", "completed": False},
            {"status": "PICKED_UP", "time": "Scheduled", "completed": False},
            {"status": "IN_TRANSIT", "time": "Scheduled", "completed": False},
            {"status": "DELIVERED", "time": "Sep 03", "completed": False}
        ]
    }
]

LOGISTICS_ASSIGNMENTS = [
    {
        "assignmentId": "LOG-ASG-9901",
        "orderId": "ORD-2026-7821",
        "pickupLocation": "Anna Nagar Hub Dark Store, Chennai",
        "dropLocation": "Flat 4B, Emerald Heights, Anna Nagar West, Chennai",
        "distanceKm": 3.8,
        "estTimeMinutes": 18,
        "vehicle": "Hero Electric Cargo Bike (TN-01-EQ-9102)",
        "riderName": "Suresh Kumar",
        "riderPhone": "+91 97890 12345",
        "status": "IN_TRANSIT",
        "earnings": 45,
        "proofOfDelivery": None
    },
    {
        "assignmentId": "LOG-ASG-8812",
        "orderId": "ORD-2026-5501",
        "pickupLocation": "Sahyadri FPO Aggregation Hub, Nashik",
        "dropLocation": "Madhavaram Central DC, Chennai",
        "distanceKm": 1180,
        "estTimeHours": 34,
        "vehicle": "16-Ton Multi-Axle BharatBenz (MH-15-EG-8022)",
        "driverName": "P. Ramesh & Co-Driver",
        "driverPhone": "+91 94222 33445",
        "status": "READY_FOR_PICKUP",
        "earnings": 8500,
        "proofOfDelivery": None
    }
]

SUPPORT_TICKETS = [
    {
        "id": "TCK-4081",
        "category": "Quality Dispute",
        "orderId": "ORD-2026-7104",
        "subject": "Minor surface bruising in 5 kg tomato shipment",
        "description": "Upon opening box 2, roughly 8-10 tomatoes had pressure bruises sustained during transit.",
        "priority": "Medium",
        "status": "In Progress",
        "createdAt": "2026-08-30 05:20 PM",
        "assignedTo": "Quality Assurance Team (Madurai)",
        "resolutionNote": "Partial refund of ₹45 approved & credited to buyer wallet."
    },
    {
        "id": "TCK-4079",
        "category": "Logistics & Delay",
        "orderId": "ORD-2026-6992",
        "subject": "Highway diversion near Hosur delayed truck arrival by 3 hours",
        "description": "Heavy vehicle traffic diversion on Bangalore-Chennai highway.",
        "priority": "Low",
        "status": "Resolved",
        "createdAt": "2026-08-29 01:10 PM",
        "assignedTo": "Dispatch Operations",
        "resolutionNote": "Driver rerouted via Krishnagiri bypass. Delivered successfully."
    }
]

NOTIFICATIONS = [
    {
        "id": "notif_1",
        "role": "all",
        "type": "AI_DEMAND_ALERT",
        "title": "📈 Regional Demand Surge Forecast",
        "message": "AI Predictor projects +42% tomato demand in Chennai over the next 14 days due to upcoming festival season.",
        "time": "10 mins ago",
        "read": False
    },
    {
        "id": "notif_2",
        "role": "Bulk Buyer",
        "type": "SUPPLIER_MATCH",
        "title": "🤝 Smart Aggregation Match Ready",
        "message": "Requirement REQ-1 (5,000 kg Onion) has been 100% matched across 3 verified FPOs.",
        "time": "45 mins ago",
        "read": False
    },
    {
        "id": "notif_3",
        "role": "FPO",
        "type": "WASTE_WARNING",
        "title": "⚠️ Perishability & Waste Alert",
        "message": "Salem Depot has 2,000 kg Tomatoes near shelf-life threshold. Automated flash discount and redirection active.",
        "time": "2 hours ago",
        "read": True
    },
    {
        "id": "notif_4",
        "role": "Logistics Partner",
        "type": "LOGISTICS_ASSIGNMENT",
        "title": "🚚 New Dispatch Corridor Assigned",
        "message": "Assigned 16-Ton Nashik to Chennai Onion corridor (ORD-2026-5501). Pickup scheduled for 06:00 AM.",
        "time": "3 hours ago",
        "read": True
    }
]
