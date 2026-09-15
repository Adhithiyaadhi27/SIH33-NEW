# Maanvasam Website — Session State

## Project
- **Spec:** `C:\Nexagri\changes(1).md` (33 sections, 1032 lines)
- **Codebase:** `C:\Nexagri\SIH33-NEW` (React 19 + Vite + TS + Zustand + React Router v7 + Flask backend)
- **Design:** Dark glassmorphism, Tailwind, colors: soil-base/deep/forest/leaf/emerald/mint/pale/gold/goldSoft/cream. Fonts: Plus Jakarta Sans + Outfit. Primitives: GlassCard, MetricTile, GlassBadge, GlassButton, FadeIn, DemoDataBadge in `src/components/ui/primitives.tsx`.

## Roles
`ADMIN | FARMER | CONSUMER` (defined in `src/store/roleStore.ts`)

## Demo Credentials
| Role | Email | Password | Route |
|------|-------|----------|-------|
| ADMIN | admin@maanvasam.com | Admin@123 | /admin |
| FARMER | farmer@maanvasam.com | Farmer@123 | /farmer |
| CONSUMER | consumer@maanvasam.com | Consumer@123 | /consumer |

## Routes (App.tsx)
`/` Home (public), `/access-denied`, `/marketplace` (public), `/consumer` (CONSUMER), `/cart` (CONSUMER), `/tracking` (CONSUMER+ADMIN), `/notifications` (any auth), `/farmer` (FARMER), `/admin` (ADMIN), `/admin/analytics` (ADMIN, via Navbar), `/orders` (order history). Legacy: `/fpo`→farmer, `/bulk-buyer`/`/logistics`→admin. `*`→RoleRedirect.

## Completed (✅ — verified vs changes(1).md)
### Infrastructure & Auth
- Backend JWT auth in `backend/app.py`: `JWT_SECRET`, `require_auth`, `require_role`, `/auth/login` endpoint; frontend `api.ts` attaches `mv_token` as Bearer. (§ HIGH 1)
- Role system: stores, registration, login, ProtectedRoute + AccessDenied
- One-click demo login (LoginModal) + manual login + offline fallback
- React `ErrorBoundary.tsx` (class `componentDidCatch`) wired in App.tsx. (§ MED 6)

### Marketplace & Checkout
- Expanded catalog: 38 products (23 veg + 15 fruits) in `mockProducts.ts`
- Marketplace: search, category filters, grid + list views, ProductCard (wishlist, flash deals, add-to-cart), live-price/stock flash feed (backend or simulated)
- **Product details modal** (`ProductDetailsModal.tsx`): full detail view + quantity stepper + Add to Cart, SeasonalTag, FreshnessTimer, PriceComparison, ReviewSection, SubstitutionSuggestion (for out-of-stock), and Bulk/Wholesale request via `BulkOrderModal` + `negotiationStore` for products with `minBulkQty`. (§6, §17, §19)
- CartPage: "Add More Items" → /marketplace; checkout validates stock and calls `inventoryStore.reduceStock` on payment success. (§ HIGH 2)
- Checkout: delivery schedule, payment methods (UPI/Card/NetBanking/COD), success receipt
- Order tracking: GPS map, 5-step progress, driver info, event timeline; `TrackedOrder` includes `total`, `orderDate`, `deliveryAddress`, `paymentStatus`. (§ HIGH 4)

### Dashboards & Admin
- FarmerDashboard: list products, add/edit/delete forms, stock, earnings, order pipeline with accept/reject/dispatch actions. (§ LOW 9)
- ConsumerDashboard: cart/metrics, featured products, quick actions, active orders + notifications
- AdminDashboard (tabbed — Users/Products/Orders/Notifications/Settings): full CRUD, user management, activity feed, Analytics/Reports link, no placeholder toasts. (§ HIGH 3)
- AnalyticsPage + RevenueAnalyticsPage routed under /admin. (§ LOW 10)
- **DemoDataBadge** shown on Admin, Farmer, and Consumer dashboards. (§28 / MED 8)
- Loading states: `usePageLoading`/`DashboardSkeleton` on all dashboards + order history. (§ MED 5)
- Consumer full order history at /orders (OrderHistoryPage). (§ LOW 11)
- Notifications: role-specific (5 per role), read/unread, mark all, persisted to localStorage `notification_read_state`. (§ MED 12)

### Cleanup
- All 12 orphaned/unrouted page files deleted (DisputePage, FarmInventoryPage, GovSchemesPage, LogisticsPage, NegotiationsPage, RegistrationPage, RolePages, SettingsPage, SubscriptionPage, WishlistPage)
- Dead components deleted: `RoleSwitcher`, `RoleCockpit`, `LogisticsDashboard`
- **Recipes removed entirely**: `src/data/recipeData.ts` + `src/components/marketplace/RecipeSuggestions.tsx` deleted; CartPage no longer renders Recipe Suggestions (consumer flow is now pure marketplace/farmer produce)
- **Brinjal removed everywhere**: product removed from `mockProducts.ts`, `backend/mock_data.py` seed, `backend/socketio_handler.py` (id/price/stock), `src/services/realtime.ts` (price feed), `src/data/seasonalData.ts`, `src/store/subscriptionStore.ts` plan (replaced with Carrot), `src/data/mockFPOs.ts` inventory; Marketplace keeps a defensive `/oosimadai/i` filter
- **All broken product images fixed**: 11 product images that returned 404 replaced with verified (HTTP 200) Unsplash URLs; recipe images moot (feature removed)
- **Farmer Add Product flow now persists**: farmer-added/edited/deleted products + descriptions stored in localStorage (`mv_farmer_products`, `mv_farmer_descriptions`); survives refresh; Add/Edit toast confirmations; "Listed Products" & stock metrics update live; seed catalog = `mockProducts` filtered to `GreenValley FPO`
- **Marketplace cart counts**: Browse Marketplace grid cards + list view show an emerald "N in cart" badge (from `useMarketplaceStore.cart`)
- Order data reconciled & user-scoped: `TrackedOrder.userId` tags checkout orders (CartPage) and admin logistics reroutes (`userId: 'admin'`); order history, tracking widget, and consumer dashboard filter to the logged-in user + shared demo orders (farmer B2B `mockOrders` no longer injected into consumer history)
- Breadcrumb fixes: FreshnessTimer now parses `DD-MMM YYYY` (e.g. `09-Sep 2026`) correctly; `usePageLoading` moved to `src/hooks/usePageLoading.ts` (fixes fast-refresh lint); AdminDashboard active tab derived from URL (no setState-in-effect)
- Unused imports lint warnings cleared; `npm run typecheck`, `npm run lint`, and `npm run build` all pass

### Flow & UX Fixes (analysis pass)
- **Farmer "Add Product" now opens the add form**: Navbar link → `/farmer?action=add`; FarmerDashboard reads `action=add` and opens the form + scrolls to Products. "My Products" still → `/farmer?section=products`.
- **Farmer nav completed**: added Notifications item (→ `/notifications`).
- **Delivery address captured**: CartPage has an editable delivery-address input (prefilled from user location) and validates it before checkout; CheckoutModal threads `deliveryAddress`/`userId`/`customerName`/`customerPhone` into the payment payload and the created `TrackedOrder` (event timeline location + `deliveryAddress`).
- **Delivery schedule now real**: the selected date/slot is baked into the order's ETA (e.g. "Wed, 17 Sep · 7-9 AM") instead of a static "Scheduled".
- **Stock caps enforced at interaction level** (spec §23): ProductCard disables Add at `inCartQty >= availableQty` ("Max in cart"); CartPage "+" disables at inventory qty; checkout still hard-blocks over-stock.
- **Farmer stock stays in sync**: new `farmerProductsStore.reduceStock` called from CartPage checkout so farmer-listed product/stock metrics drop with sales.
- **Post-checkout flow**: after the receipt closes, consumer is navigated to `/tracking` for the new order instead of staring at an empty cart.
- **Role-gated purchasing**: marketplace Add to Cart (card, details modal) is restricted to CONSUMER; FARMER/ADMIN/guests see explicit "browse only / sign in to order" disabled states (was: silent phantom cart adds for non-consumers).
- **Delete confirmations** (spec §6): window.confirm on farmer and admin product deletion.
- **ConsumerDashboard "Show More" fixed**: `FEATURED` now slices 9 products (was 6 → toggle was dead code).
- **Farmer product photos**: Add/Edit Product form now has a "Product Photo" upload (file picker → auto-resized to ≤480px JPEG data URL). Preview + remove; uploaded image is stored on the product and shows in "My Products", the marketplace grid, and cart/tracking. Falls back to a default produce image when no photo is set.

## Known Tooling State
- `npm run typecheck` (tsc --noEmit) — clean
- `npm run build` (vite build only) — passes (Vite, ~5s)
- `npm run lint` (oxlint) — clean (zero warnings)
- Generated config/build caches no longer emitted: removed `tsconfig.node.json` + root `references` (no more `vite.config.js`/`vite.config.d.ts`/`*.tsbuildinfo` duplication); `tsconfig.tsbuildinfo`/`tsconfig.node.tsbuildinfo`/`vite.config.js`/`vite.config.d.ts` deleted and gitignored (`*.tsbuildinfo`, `vite.config.js`, `vite.config.d.ts`).
- Removed boilerplate/leftover assets: `src/App.css` (unused Vite template CSS), `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png` (unreferenced). `src/assets/` deleted.
- Removed `backend/__pycache__/` (duplicate `.pyc` caches for Python 3.12 + 3.14; auto-regenerated). `dist/` is normal gitignored build output.

## Outstanding / Optional (not blocking spec)
- Realtime feed and REST endpoints are demo-driven via `useRealtime`/"simulated" fallback when backend is down; JWT middleware implemented in `backend/app.py` but live backend is optional for the demo build.
- Dead-code sweep: all marketplace micro-components are now consumed in the product-details flow / CartPage. No orphaned files remain.

## Key Files
- `src/store/roleStore.ts` — RoleName type
- `src/store/authStore.ts` — AuthUser, DEMO_USERS, setAuth/logout, localStorage
- `src/store/orderTrackingStore.ts` — TrackedOrder (total/orderDate/deliveryAddress/paymentStatus) + addOrder
- `src/store/marketplaceStore.ts` — cart, addToCart, clearCart, totals
- `src/store/inventoryStore.ts` — reduceStock/updateQuantity, called from CartPage checkout
- `src/components/auth/ProtectedRoute.tsx` — route guard
- `src/components/ErrorBoundary.tsx` — error boundary used in App.tsx
- `src/components/Navbar.tsx` — role-specific nav
- `src/components/roles/FarmerDashboard.tsx` — farmer portal
- `src/components/roles/ConsumerDashboard.tsx` — consumer portal
- `src/components/roles/AdminDashboard.tsx` — admin portal (5 tabs + analytics link)
- `src/components/marketplace/ProductDetailsModal.tsx` — product detail view (§6/§17/§19)
- `src/components/marketplace/Marketplace.tsx` — grid/list catalog w/ detail modal wiring
- `src/components/marketplace/ProductCard.tsx` — card w/ "View Details" + Add to Cart
- `src/components/notifications/notificationData.ts` — shared notification data
- `src/components/notifications/NotificationsCenter.tsx` — navbar dropdown
- `src/components/registration/LoginModal.tsx` — one-click demo + manual login
- `src/data/mockProducts.ts` — 38 products (images verified live)
- `src/pages/CartPage.tsx` — cart + checkout (reduceStock on success)
- `src/pages/TrackingPage.tsx` — wraps OrderTrackingWidget
- `src/components/tracking/OrderTrackingWidget.tsx` — GPS map + progress
- `src/pages/Home.tsx` — hero + marketplace inline
- `src/App.tsx` — all routes
- `backend/app.py` — Flask API with JWT auth (require_auth/require_role)
- `backend/mock_data.py` — demo users + products