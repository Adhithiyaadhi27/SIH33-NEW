import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  Receipt as ReceiptIcon,
  CalendarClock,
  type LucideIcon,
} from 'lucide-react';
import { GlassButton } from '../ui/primitives';
import api from '../../services/api';
import { useNotificationStore } from '../../store/notificationStore';
import useTranslation from '../../services/useTranslation';

export interface CheckoutItem {
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  image?: string;
  grade?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  subLabel: string;
  collect: boolean;
}

export interface OrderBreakdown {
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  platformFeeRate: number;
  total: number;
  lines: Array<Record<string, unknown>>;
  warnings: string[];
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  onSuccess?: (order: Record<string, unknown>) => void;
  deliveryAddress?: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
}

type Step = 'analyzing' | 'method' | 'processing' | 'success' | 'error';

const STATIC_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'UPI', label: 'UPI', subLabel: 'GPay · PhonePe · Paytm', collect: false },
  { id: 'CARD', label: 'Credit / Debit Card', subLabel: 'Visa · Mastercard · RuPay', collect: true },
  { id: 'NETBANKING', label: 'Net Banking', subLabel: 'All major Indian banks', collect: true },
  { id: 'COD', label: 'Cash on Delivery', subLabel: 'Pay when your produce arrives', collect: false },
];

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda'];

const METHOD_ICONS: Record<string, LucideIcon> = {
  UPI: Smartphone,
  CARD: CreditCard,
  NETBANKING: Building2,
  COD: Banknote,
};

function clientBreakdown(items: CheckoutItem[]): OrderBreakdown {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = items.length ? 25 : 0;
  const platformFee = Math.round(subtotal * 0.02 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + platformFee) * 100) / 100;
  return { subtotal, deliveryFee, platformFee, platformFeeRate: 0.02, total, lines: [], warnings: [] };
}

function simulateReceipt(items: CheckoutItem[], methodId: string, breakdown: OrderBreakdown) {
  const seg = (n: number) => Math.random().toString(36).slice(2, 2 + n).toUpperCase();
  return {
    paymentId: `PAY-2026-${seg(6)}`,
    orderId: `ORD-2026-${seg(4)}`,
    receiptNo: `RC-${seg(8)}`,
    gatewayReference: `GATEWAY-${seg(8)}`,
    amount: breakdown.total,
    paymentMethod: methodId,
    items,
    simulated: true,
  };
}

export default function CheckoutModal({
  open,
  onClose,
  items,
  onSuccess,
  deliveryAddress = 'Consumer pickup — Main Market, Chennai',
  userId = 'usr_consumer_1',
  customerName = 'Guest User',
  customerPhone = '',
}: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg glass-panel p-5 sm:p-6 max-h-[92vh] overflow-y-auto"
          >
            <CheckoutFlow
              key={`cf-${items.map((i) => `${i.productId}:${i.quantity}`).join('|')}-${open}`}
              items={items}
              onClose={onClose}
              onSuccess={onSuccess}
              deliveryAddress={deliveryAddress}
              userId={userId}
              customerName={customerName}
              customerPhone={customerPhone}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CheckoutFlow({
  items,
  onClose,
  onSuccess,
  deliveryAddress,
  userId,
  customerName,
  customerPhone,
}: {
  items: CheckoutItem[];
  onClose: () => void;
  onSuccess?: (order: Record<string, unknown>) => void;
  deliveryAddress: string;
  userId: string;
  customerName: string;
  customerPhone: string;
}) {
  const { t } = useTranslation();
  const pushToast = useNotificationStore((s) => s.pushToast);

  const [step, setStep] = useState<Step>('analyzing');
  const [breakdown, setBreakdown] = useState<OrderBreakdown | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>(STATIC_PAYMENT_METHODS);
  const [methodId, setMethodId] = useState('UPI');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);

  // Collect fields
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [bank, setBank] = useState('');

  // On mount, analyze the basket against the live catalog (fallback: client-side)
  useEffect(() => {
    const itemsPayload = items.map((it) => ({
      productId: it.productId,
      name: it.name,
      quantity: it.quantity,
      unit: it.unit,
      price: it.price,
    }));

    api
      .post('/orders/analyze', { items: itemsPayload })
      .then((res) => {
        const analysis = res.data?.analysis as OrderBreakdown | undefined;
        if (analysis) {
          setBreakdown(analysis);
          if (res.data?.paymentMethods?.length) setMethods(res.data.paymentMethods);
        } else {
          setBreakdown(clientBreakdown(items));
        }
        setStep('method');
      })
      .catch(() => {
        // Backend unreachable — compute the breakdown client-side (mock mode)
        setBreakdown(clientBreakdown(items));
        setStep('method');
      });
  }, [items]);

  const collectValid = () => {
    if (methodId === 'UPI') return upiId.includes('@');
    if (methodId === 'CARD') {
      const digits = cardNumber.replace(/\s/g, '');
      return digits.length >= 12 && /^\d{2}\/\d{2}$/.test(cardExpiry) && /^\d{3,4}$/.test(cardCvv);
    }
    if (methodId === 'NETBANKING') return bank.length > 0;
    return true; // COD
  };

  const handlePay = async () => {
    if (!breakdown) return;
    setError('');
    if (!collectValid()) {
      setError(methodId === 'UPI' ? 'Enter a valid UPI ID (name@bank)' : methodId === 'NETBANKING' ? 'Select a bank to continue' : 'Please fill the card details correctly');
      return;
    }

    setStep('processing');

    const itemsPayload = items.map((it) => ({
      productId: it.productId,
      name: it.name,
      quantity: it.quantity,
      unit: it.unit,
      price: it.price,
    }));

    const payload = {
      userId,
      customerName,
      customerPhone,
      deliveryAddress,
      mode: 'Everyday Purchase',
      items: itemsPayload,
      paymentMethod: methodId,
      analysis: breakdown,
    };

    let payment: Record<string, unknown> | null = null;
    let order: Record<string, unknown> | null = null;
    let simulated = false;

    try {
      const initiate = await api.post('/payments/initiate', payload);
      if (!initiate.data?.success) {
        throw new Error(initiate.data?.error ?? 'Could not initiate payment');
      }
      payment = initiate.data;

      const confirm = await api.post('/payments/confirm', { paymentId: initiate.data.paymentId });
      if (confirm.data?.success) {
        payment = confirm.data.payment ?? payment;
        order = confirm.data.order ?? null;
      }
    } catch (err) {
      const maybeAxios = err as { response?: { data?: { error?: string } }; message?: string };
      // A network failure (backend down) → fall back to a client-side simulated gateway
      if (maybeAxios.response?.data?.error) {
        setError(maybeAxios.response.data.error);
        setStep('error');
        return;
      }
      simulated = true;
      payment = simulateReceipt(items, methodId, breakdown);
      order = { id: payment.orderId, total: breakdown.total, paymentStatus: 'PAID_ONLINE' };
    }

    setReceipt({ ...(payment ?? {}), simulated, order });
    setStep('success');
    pushToast({
      title: simulated ? t('payment.receipt') : t('cart.checkout_success'),
      message: simulated ? t('payment.receipt_msg') : t('cart.checkout_success_msg'),
      type: 'success',
    });
    onSuccess?.(order ?? {});
  };

  const methodIcon = METHOD_ICONS[methodId] ?? CreditCard;
  const MethodIcon = methodIcon;
  const methodMeta = {
    UPI: t('payment.upi_id'),
    CARD: t('payment.card_number'),
    NETBANKING: t('payment.bank'),
    COD: t('payment.cod_note'),
  }[methodId];

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-extrabold text-lg text-text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-soil-gold" /> {t('payment.title')}
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">{t('payment.subtitle')}</p>
        </div>
        {step !== 'processing' && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted transition cursor-pointer" aria-label="Close checkout">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Analyzing */}
      {step === 'analyzing' && (
        <div className="py-12 flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-7 h-7 animate-spin text-soil-gold" />
          <p className="text-xs text-text-muted">{t('payment.analyzing')}</p>
        </div>
      )}

      {/* Method selection */}
      {step === 'method' && breakdown && (
        <div className="space-y-4">
          {breakdown.warnings.length > 0 && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-[11px] text-red-300">
              {breakdown.warnings.map((w) => (
                <div key={w}>• {w}</div>
              ))}
            </div>
          )}

          {/* Order summary */}
          <div className="glass-panel-sm p-3 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-soil-gold">{t('payment.order_summary')}</div>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.productId} className="flex justify-between text-xs text-text-primary">
                  <span>
                    {it.name} × {it.quantity} {it.unit}
                  </span>
                  <span className="text-text-muted">₹{(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-text-muted">
                <span>{t('payment.subtotal')}</span>
                <span>₹{breakdown.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>{t('payment.delivery_fee')}</span>
                <span>₹{breakdown.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>
                  {t('payment.platform_fee')} ({(breakdown.platformFeeRate * 100).toFixed(0)}%)
                </span>
                <span>₹{breakdown.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-soil-gold pt-1">
                <span>{t('payment.total')}</span>
                <span>₹{breakdown.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-soil-gold mb-2">{t('payment.method')}</div>
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => {
                const active = methodId === m.id;
                const Icon = METHOD_ICONS[m.id] ?? CreditCard;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethodId(m.id)}
                    className={`text-left rounded-xl border px-3 py-2.5 transition cursor-pointer ${
                      active ? 'border-soil-gold/60 bg-soil-gold/10 shadow-glow-gold' : 'border-white/10 bg-white/5 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                      <Icon className="w-3.5 h-3.5 text-soil-gold" />
                      {m.label}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5 leading-tight">{m.subLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>

{/* Collect fields */}
          <div className="glass-panel-sm p-3 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-primary">
              <MethodIcon className="w-3.5 h-3.5 text-soil-gold" />
              {methodMeta}
            </div>

            {methodId === 'UPI' && (
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder={t('payment.upi_id_placeholder')}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
            )}

            {methodId === 'CARD' && (
              <>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder={t('payment.card_number_placeholder')}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <CalendarClock className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder={t('payment.card_expiry_placeholder')}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                    />
                  </div>
                  <input
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder={t('payment.card_cvv')}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                  />
                </div>
              </>
            )}

            {methodId === 'NETBANKING' && (
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-soil-forest border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald cursor-pointer"
              >
                <option value="">{t('payment.bank')}</option>
                {BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            )}

            {methodId === 'COD' && <p className="text-[11px] text-text-muted">{t('payment.cod_note')}</p>}

            {error && <p className="text-[11px] text-red-400">{error}</p>}

            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> {t('payment.powered_by')} · {t('payment.simulated')}
            </div>
          </div>

          <GlassButton variant="green" className="w-full justify-center" onClick={handlePay}>
            {t('payment.pay', { amount: breakdown.total.toFixed(2) })}
            <span className="text-[10px] opacity-80 ml-1.5">· {t('payment.place_order')}</span>
          </GlassButton>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="py-12 flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-9 h-9 animate-spin text-soil-gold" />
          <p className="text-xs text-text-muted">{t('payment.processing')}</p>
        </div>
      )}

      {/* Success */}
      {step === 'success' && receipt && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-lg text-text-primary">{t('payment.receipt')}</h4>
            <p className="text-xs text-text-muted mt-1">{t('payment.receipt_msg')}</p>
          </div>

          {Boolean(receipt.simulated) && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-soil-gold bg-soil-gold/10 border border-soil-gold/30 rounded-full px-3 py-1">
              <ShieldCheck className="w-3 h-3" /> {t('payment.simulated')}
            </div>
          )}

          <div className="glass-panel-sm p-3 space-y-1.5 text-left">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{t('payment.receipt_no')}</span>
              <span className="font-bold text-soil-gold">{String(receipt.receiptNo ?? receipt.paymentId)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{t('payment.order_id')}</span>
              <span className="font-semibold text-text-primary">{String(receipt.orderId)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{t('payment.payment_id')}</span>
              <span className="font-semibold text-text-primary">{String(receipt.paymentId)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">{t('payment.gateway_ref')}</span>
              <span className="font-semibold text-text-primary">{String(receipt.gatewayReference)}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1.5 border-t border-white/10">
              <span className="text-text-muted">{t('payment.total')}</span>
              <span className="font-extrabold text-soil-gold">₹{Number(receipt.amount ?? breakdown?.total ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-muted">
            <ReceiptIcon className="w-3 h-3 text-soil-gold" />
            {t('payment.powered_by')}
          </div>

          <GlassButton variant="gold" className="w-full justify-center" onClick={onClose}>
            {t('payment.done')}
          </GlassButton>
        </motion.div>
      )}

      {/* Error */}
      {step === 'error' && (
        <div className="py-10 text-center space-y-3">
          <div className="text-2xl">⚠️</div>
          <div className="text-sm font-bold text-text-primary">{t('payment.failed')}</div>
          <p className="text-xs text-text-muted">{error || t('payment.failed_msg')}</p>
          <div className="flex justify-center gap-2 pt-1">
            <GlassButton variant="ghost" onClick={onClose}>
              {t('registration.cancel')}
            </GlassButton>
            <GlassButton variant="green" onClick={() => setStep('method')}>
              {t('payment.place_order')}
            </GlassButton>
          </div>
        </div>
      )}
    </>
  );
}