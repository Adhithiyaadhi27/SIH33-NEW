"""
AgriDirect AI — Socket.IO Realtime Event Handler
Emits periodic price, stock, metric, route, heatmap, and grade updates.
"""

import random
import time
from flask_socketio import SocketIO, emit

socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")

# Product IDs spanning the full backend catalog + frontend mockProducts.ts
PRODUCT_IDS = [
    "prod_tomato", "prod_beans", "prod_potato", "prod_apple",
    "prod_onion", "prod_brinjal", "prod_carrot", "prod_mango",
    "prod_rice", "prod_dal", "prod_orange", "prod_turmeric",
]

BASE_PRICES = {
    "prod_tomato": 30.0,
    "prod_beans": 23.5,
    "prod_potato": 28.0,
    "prod_apple": 145.0,
    "prod_onion": 32.0,
    "prod_brinjal": 26.0,
    "prod_carrot": 35.0,
    "prod_mango": 120.0,
    "prod_rice": 46.5,
    "prod_dal": 92.0,
    "prod_orange": 74.0,
    "prod_turmeric": 430.0,
}

BASE_STOCK = {
    "prod_tomato": 500,
    "prod_beans": 300,
    "prod_potato": 1200,
    "prod_apple": 850,
    "prod_onion": 2500,
    "prod_brinjal": 700,
    "prod_carrot": 600,
    "prod_mango": 450,
    "prod_rice": 3100,
    "prod_dal": 2200,
    "prod_orange": 950,
    "prod_turmeric": 380,
}

DISTRICTS = [
    {"name": "Chennai", "level": "high"},
    {"name": "Madurai", "level": "normal"},
    {"name": "Coimbatore", "level": "medium"},
    {"name": "Tiruchirappalli", "level": "medium"},
    {"name": "Salem", "level": "low"},
    {"name": "Erode", "level": "normal"},
    {"name": "Theni", "level": "normal"},
    {"name": "Ooty", "level": "low"},
    {"name": "Vellore", "level": "medium"},
    {"name": "Thoothukudi", "level": "low"},
]

# Mutable state for prices/stock
price_state = dict(BASE_PRICES)
stock_state = dict(BASE_STOCK)
harvest_total = 5000
transit_total = 1793
delivery_total = 1753

# Active flash discounts driven by the cold-chain reroute engine.
# pid -> {"productId", "originalPrice", "price", "discountPct", "reason",
#         "depot", "expiresIn"}
FLASH_DEALS: dict = {}


def set_flash_deal(product_id: str, deal: dict):
    """Activate a flash discount for a product and broadcast it in realtime."""
    payload = dict(deal)
    payload["productId"] = product_id
    payload["flash"] = True
    FLASH_DEALS[product_id] = payload
    socketio.emit("flash:update", payload)


def clear_flash_deal(product_id: str):
    """Remove a flash discount and broadcast the clearance."""
    if product_id in FLASH_DEALS:
        del FLASH_DEALS[product_id]
        socketio.emit("flash:update", {"productId": product_id, "flash": False})


def flash_price(pid: str, base: float) -> float:
    """Return the flash-discounted price if a deal is active, else the base price."""
    deal = FLASH_DEALS.get(pid)
    if deal:
        return float(deal.get("price", base))
    return float(base)


def seed_flash_deals_from_proposals(proposals):
    """Activate flash deals for every pending reroute proposal (startup)."""
    for p in proposals:
        if p.get("status") != "PENDING":
            continue
        set_flash_deal(p["productId"], {
            "originalPrice": p.get("originalPrice", 0),
            "price": p.get("discountedPrice", p.get("originalPrice", 0)),
            "discountPct": p.get("flashDiscountPct", 0),
            "reason": f"{p['depotName']}: {p['quantityKg']} kg {p['product']} near shelf-life — flash redirect deal",
            "depot": p["depotName"],
            "expiresIn": f"{int(p.get('shelfLifeRemainingDays', 1) * 24)}h",
        })


def emit_reroute_update(payload):
    socketio.emit("logistics:reroute", payload)


def _drift_price(pid):
    """Apply realistic ±2-5% drift to a product price."""
    current = price_state[pid]
    pct = random.uniform(-0.05, 0.05)
    new_price = round(max(5.0, current * (1 + pct)), 2)
    price_state[pid] = new_price
    return new_price


def _drift_stock(pid):
    """Fluctuate available stock slightly."""
    base = BASE_STOCK[pid]
    delta = random.randint(-50, 80)
    new_qty = max(10, stock_state[pid] + delta)
    stock_state[pid] = min(new_qty, base * 2)
    return stock_state[pid]


def _background_emitter():
    """Background greenlet that emits realtime events every ~4 seconds."""
    while True:
        socketio.sleep(4)

        # Pick 1-2 random products to update
        targets = random.sample(PRODUCT_IDS, k=min(2, len(PRODUCT_IDS)))

        for pid in targets:
            new_price = _drift_price(pid)
            new_stock = _drift_stock(pid)

            socketio.emit("price:update", {"productId": pid, "price": new_price})
            socketio.emit("stock:update", {"productId": pid, "availableQty": new_stock})

        # Emit metric updates (harvest/transit/delivery slowly increment)
        global transit_total, delivery_total
        if random.random() < 0.3:
            transit_total += random.randint(1, 5)
        if random.random() < 0.25:
            delivery_total += random.randint(1, 4)

        socketio.emit("metric:update", {"key": "harvest", "value": harvest_total})
        socketio.emit("metric:update", {"key": "transit", "value": transit_total})
        socketio.emit("metric:update", {"key": "delivery", "value": delivery_total})

        # Occasional heatmap update (10% chance)
        if random.random() < 0.1:
            district = random.choice(DISTRICTS)
            levels = ["high", "medium", "low", "normal"]
            socketio.emit("heatmap:update", {
                "district": district["name"],
                "level": random.choice(levels),
            })

        # Occasional route update (5% chance)
        if random.random() < 0.05:
            socketio.emit("route:update", {
                "routeId": "route_mdu_chn",
                "longitude": 78.1198 + random.uniform(-0.5, 0.5),
                "latitude": 9.9252 + random.uniform(0, 3.0),
            })

        # Keep active flash-deal snapshot fresh for any client that just joined
        for _pid, deal in list(FLASH_DEALS.items()):
            socketio.emit("flash:update", dict(deal))


def start_background_emitter():
    """Start the background price emitter (call after socketio is initialized)."""
    socketio.start_background_task(_background_emitter)


@socketio.on("connect")
def handle_connect():
    """Client connected — send initial state snapshot."""
    emit("connected", {"status": "ok", "message": "Connected to MANN VASSAM realtime feed"})
    # Send current snapshot for all products
    for pid in PRODUCT_IDS:
        emit("price:update", {"productId": pid, "price": price_state[pid]})
        emit("stock:update", {"productId": pid, "availableQty": stock_state[pid]})

    # Send active flash-deal snapshot (perishable produce redirect engine)
    for _pid, deal in list(FLASH_DEALS.items()):
        emit("flash:update", dict(deal))


@socketio.on("disconnect")
def handle_disconnect():
    pass


@socketio.on("request:price")
def handle_price_request(data):
    """Client can request current price for a specific product."""
    pid = data.get("productId", "")
    if pid in price_state:
        emit("price:update", {"productId": pid, "price": price_state[pid]})
