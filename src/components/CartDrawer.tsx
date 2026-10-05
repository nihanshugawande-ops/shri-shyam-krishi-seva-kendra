import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  QrCode,
  Smartphone,
  Banknote,
  Copy,
  Check,
  Phone,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { CartItem, Language, StoreSettings, OrderRequest } from '../types';
import { ProductImage } from './common/ProductImage';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  language: Language;
  settings: StoreSettings;
}

type CheckoutStep = 'cart' | 'details' | 'payment' | 'confirmed';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  language,
  settings,
}) => {
  const isHindi = language === 'hi';

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<OrderRequest | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cleanPhone = (settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || settings.officialPhone || '+918120464749').replace(/[^0-9]/g, '');

  const shopUpiId = settings.upiId || '8120464749@upi';
  const shopUpiName = settings.upiName || 'श्री श्याम कृषि सेवा केंद्र';

  // Standard Unified UPI URL with amount and payee info
  const upiPayUrl = `upi://pay?pa=${shopUpiId}&pn=${encodeURIComponent(
    shopUpiName
  )}&am=${subtotal}&cu=INR&tn=${encodeURIComponent('दवाई ऑर्डर भुगतान')}`;

  // QR Code URL generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiPayUrl
  )}&bgcolor=161822&color=ffffff&qzone=1`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(shopUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProceedToDetails = () => {
    if (items.length === 0) return;
    setStep('details');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError(isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }
    const cleanP = phone.replace(/[^0-9]/g, '');
    if (cleanP.length < 10) {
      setError(isHindi ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handleFinalOrderSubmit = async () => {
    setSubmitting(true);
    setError('');

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: OrderRequest = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      village: village.trim(),
      address: address.trim(),
      items: items.map((i) => ({
        productId: i.product.id,
        name: isHindi ? i.product.name : i.product.nameEn || i.product.name,
        packSize: i.product.packSize,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalAmount: subtotal,
      paymentMethod,
      upiRefNumber: upiUtr.trim(),
      paymentStatus: paymentMethod === 'upi' ? 'paid' : 'pay_on_delivery',
      message: message.trim(),
      date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      await api.submitOrder(newOrder);
      setPlacedOrder(newOrder);
      setStep('confirmed');
      onClearCart();
    } catch (err: any) {
      setError(err?.message || (isHindi ? 'ऑर्डर सबमिट करने में समस्या आई।' : 'Failed to submit order.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWhatsAppReceipt = () => {
    const orderToUse = placedOrder;
    if (!orderToUse) return;

    const itemsSummary = orderToUse.items
      .map((it, idx) => `${idx + 1}. ${it.name} (${it.packSize}) x ${it.quantity} = ₹${it.price * it.quantity}`)
      .join('\n');

    const paymentInfo =
      orderToUse.paymentMethod === 'upi'
        ? `⚡ *भुगतान माध्यम:* ऑनलाइन UPI (PhonePe / GPay)\n*UPI UTR / संदर्भ क्र.:* ${orderToUse.upiRefNumber || 'सत्यापन प्रक्रियाधीन'}`
        : `💵 *भुगतान माध्यम:* दुकान पर नकद भुगतान (Pay Cash at Shop)`;

    const text = encodeURIComponent(
      `*🛒 नया दवाई ऑर्डर — श्री श्याम कृषि सेवा केंद्र*\n` +
      `*ऑर्डर नंबर:* ${orderToUse.id}\n` +
      `*दिनांक:* ${new Date(orderToUse.date).toLocaleString('hi-IN')}\n\n` +
      `*👤 ग्राहक का नाम:* ${orderToUse.customerName}\n` +
      `*📞 मोबाइल नंबर:* ${orderToUse.phone}\n` +
      `*📍 गांव / पता:* ${orderToUse.village || ''} ${orderToUse.address || ''}\n\n` +
      `*📦 ऑर्डर की गई दवाइयाँ:*\n${itemsSummary}\n\n` +
      `*💰 कुल राशि:* ₹${orderToUse.totalAmount.toLocaleString('en-IN')}\n` +
      `${paymentInfo}\n` +
      (orderToUse.message ? `*📝 किसान संदेश:* ${orderToUse.message}\n\n` : '\n') +
      `कृपया ऑर्डर की पुष्टि कर दवाइयों की डिलीवरी / उपलब्धता का समय बताएं। धन्यवाद!`
    );

    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex justify-end transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0e1015] border-l border-zinc-800/90 h-full flex flex-col shadow-2xl text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#12141a]">
          <div className="flex items-center gap-2.5">
            {step !== 'cart' && step !== 'confirmed' && (
              <button
                onClick={() => setStep(step === 'payment' ? 'details' : 'cart')}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white mr-1 cursor-pointer"
                title="पीछे जाएं"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {step === 'cart' && (isHindi ? 'आपकी कार्ट (दवाइयाँ)' : 'Your Medicine Cart')}
                {step === 'details' && (isHindi ? 'डिलीवरी एवं किसान विवरण' : 'Customer & Delivery Info')}
                {step === 'payment' && (isHindi ? 'UPI एवं ऑनलाइन भुगतान' : 'UPI & Payment Checkout')}
                {step === 'confirmed' && (isHindi ? 'ऑर्डर सफलतापूर्वक प्राप्त हुआ!' : 'Order Placed Successfully!')}
              </h2>
              <div className="text-[10px] text-zinc-400">
                श्री श्याम कृषि सेवा केंद्र · स्वा. कार्तिक गावंडे
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART VIEW */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-500">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-300">
                    {isHindi ? 'आपकी कार्ट अभी खाली है' : 'Your cart is empty'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    {isHindi
                      ? 'फसल सुरक्षा दवाइयाँ, फफूंदनाशक, कीटनाशक व बीज सूची से उत्पाद जोड़ें।'
                      : 'Browse our catalog and select crop protection medicines to order.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-5 py-2.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 cursor-pointer"
                  >
                    {isHindi ? 'दवाइयाँ ब्राउज़ करें' : 'Browse Products'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800/80">
                    <span>
                      {isHindi ? `कुल उत्पाद (${items.length})` : `Selected Items (${items.length})`}
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{isHindi ? 'कार्ट खाली करें' : 'Clear All'}</span>
                    </button>
                  </div>

                  {items.map(({ product, quantity }) => {
                    const name = isHindi ? product.name : product.nameEn || product.name;
                    return (
                      <div
                        key={product.id}
                        className="p-3.5 rounded-2xl bg-[#14161f] border border-zinc-800/80 hover:border-zinc-700 flex gap-3 items-center justify-between"
                      >
                        <div className="w-16 h-16 rounded-xl bg-zinc-950 p-1 shrink-0 overflow-hidden border border-zinc-800 flex items-center justify-center">
                          <ProductImage
                            src={product.image}
                            alt={name}
                            productType={product.productType}
                            brand={product.brand}
                            name={name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                            <span className="text-emerald-400 font-semibold">{product.brand}</span>
                            <span>·</span>
                            <span>{product.packSize}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                            {name}
                          </h4>
                          <div className="text-xs font-bold text-white font-mono mt-1">
                            ₹{product.price.toLocaleString('en-IN')}{' '}
                            <span className="text-[10px] text-zinc-500 font-normal">/ प्रति इकाई</span>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                              title="कम करें"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-white font-mono">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                              title="बढ़ाएं"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 sm:p-5 bg-[#12141a] border-t border-zinc-800 space-y-3">
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>{isHindi ? 'दवाइयों का कुल मूल्य:' : 'Subtotal:'}</span>
                    <span className="text-white font-mono font-bold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>{isHindi ? 'जीएसटी एवं बिलिंग:' : 'Taxes & Invoicing:'}</span>
                    <span>{isHindi ? 'समाहित (100% पक्का बिल)' : 'Included'}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500">
                    <span>{isHindi ? 'वितरण / पिकअप:' : 'Delivery / Store Pickup:'}</span>
                    <span>{isHindi ? 'दुकान से प्राप्त करें या स्थानीय डिलीवरी' : 'Store Pickup / Local'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">
                    {isHindi ? 'कुल देय राशि:' : 'Total Amount:'}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={handleProceedToDetails}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
                >
                  <span>{isHindi ? 'ऑर्डर एवं UPI पेमेंट के लिए आगे बढ़ें' : 'Proceed to Checkout & UPI Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CUSTOMER & DELIVERY DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="flex-1 flex flex-col justify-between">
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                <span>{isHindi ? 'ऑर्डर की जाने वाली दवाइयाँ:' : 'Selected Medicines:'}</span>
                <span className="text-white font-bold font-mono">
                  {items.length} उत्पाद (₹{subtotal.toLocaleString('en-IN')})
                </span>
              </div>

              {error && (
                <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {isHindi ? 'आपका नाम (Farmer / Customer Name) *' : 'Your Full Name *'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isHindi ? 'उदा. रामेश्वर पाटीदार / किसान भाई' : 'e.g. Rameshwar Patidar'}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {isHindi ? 'मोबाइल नंबर (10 अंकों का फोन नंबर) *' : 'Mobile Number (10 Digits) *'}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="98XXXXXXXX"
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {isHindi ? 'गांव / कस्बा (Village / Town) *' : 'Village / Town *'}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={isHindi ? 'उदा. रामपुर / स्थानीय' : 'e.g. Rampur'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {isHindi ? 'पता / लैंडमार्क (Address)' : 'Street Address / Landmark'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isHindi ? 'मंडी के पास / मुख्य मार्ग' : 'Near Mandi Gate'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {isHindi ? 'फसल संबंधी विशेष टिप्पणी / संदेश (वैकल्पिक)' : 'Order Note / Message (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isHindi
                      ? 'उदा. गेहूं की 5 एकड़ की फसल के लिए चाहिए, छिड़काव की सलाह भी चाहिए...'
                      : 'Any specific requests or requirements...'
                  }
                  className="w-full px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-[#12141a] border-t border-zinc-800 space-y-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <span>{isHindi ? 'भुगतान माध्यम चुनें (UPI / Cash)' : 'Choose Payment Method (UPI / Cash)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PAYMENT METHOD (UPI / CASH) */}
        {step === 'payment' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="text-xs text-zinc-400">
                {isHindi ? 'कृपया भुगतान का माध्यम चुनें:' : 'Select your payment method:'}
              </div>

              {/* Payment Option Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'upi'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      फास्ट & सुरक्षित
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">⚡ UPI पेमेंट</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">PhonePe, GPay, Paytm, QR</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      दुकान पर
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">💵 नकद भुगतान</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">दुकान पर या डिलीवरी पर</div>
                  </div>
                </button>
              </div>

              {/* UPI PAYMENT DETAILS CONTAINER */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-[#141620] border border-zinc-700/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span>{isHindi ? 'दुकान का आधिकारिक UPI QR कोड' : 'Official Shop UPI QR'}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {shopUpiName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-500 uppercase">देय राशि</div>
                      <div className="text-base font-bold text-emerald-400 font-mono">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Scan Guide */}
                  <div className="flex flex-col items-center justify-center p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-44 h-44 rounded-lg bg-white p-2 shadow-2xl"
                    />
                    <p className="text-[11px] text-zinc-400 mt-2.5 text-center font-medium">
                      {isHindi
                        ? 'PhonePe / GPay / Paytm से स्कैन करके ₹' + subtotal.toLocaleString('en-IN') + ' का भुगतान करें'
                        : 'Scan with any UPI app to pay ₹' + subtotal.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* One-Tap Mobile UPI App Buttons */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] text-zinc-400 font-semibold">
                      {isHindi ? 'मोबाइल ऐप से सीधे भुगतान करें:' : 'Pay directly via UPI apps:'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={upiPayUrl}
                        className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all cursor-pointer shadow active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PhonePe / GPay</span>
                      </a>
                      <a
                        href={upiPayUrl}
                        className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all cursor-pointer shadow active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Paytm / Any UPI</span>
                      </a>
                    </div>
                  </div>

                  {/* Copy UPI ID */}
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">दुकान की UPI ID:</span>
                      <span className="font-mono font-bold text-emerald-400">{shopUpiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>कॉपी हुआ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>कॉपी करें</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* UTR Input */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      {isHindi
                        ? 'भुगतान के बाद 12-अंकों का UPI संदर्भ / UTR नंबर (वैकल्पिक)'
                        : 'UPI UTR / Reference No. (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={upiUtr}
                      onChange={(e) => setUpiUtr(e.target.value)}
                      placeholder="उदा. 427819XXXXXX"
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY DETAILS */}
              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-[#141620] border border-zinc-700/80 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? 'दुकान पर या डिलीवरी पर नकद भुगतान' : 'Pay Cash at Store / Delivery'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {isHindi
                      ? 'आपका ऑर्डर सुरक्षित दर्ज कर लिया जाएगा। आप दुकान पर आकर दवाइयाँ प्राप्त कर सकते हैं और नकद भुगतान कर सकते हैं।'
                      : 'Your order will be reserved. You can pay cash in person when picking up medicines from the shop.'}
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
                    कुल देय राशि: ₹{subtotal.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-[#12141a] border-t border-zinc-800 space-y-2">
              <button
                type="button"
                onClick={handleFinalOrderSubmit}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                {submitting ? (
                  <span>{isHindi ? 'ऑर्डर दर्ज हो रहा है...' : 'Processing Order...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'upi'
                        ? isHindi
                          ? `UPI भुगतान किया — ऑर्डर कन्फर्म करें (₹${subtotal.toLocaleString('en-IN')})`
                          : `Confirm UPI Order (₹${subtotal.toLocaleString('en-IN')})`
                        : isHindi
                        ? `नकद भुगतान के साथ ऑर्डर कन्फर्म करें (₹${subtotal.toLocaleString('en-IN')})`
                        : `Confirm Cash Order (₹${subtotal.toLocaleString('en-IN')})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED RECEIPT SCREEN */}
        {step === 'confirmed' && placedOrder && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between space-y-6">
            <div className="text-center pt-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500/80 mx-auto flex items-center justify-center text-emerald-400 shadow-2xl mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isHindi ? '✓ ऑर्डर सफलतापूर्वक प्राप्त हुआ' : '✓ Order Confirmed'}
              </span>

              <h3 className="text-lg sm:text-xl font-bold text-white mt-2 font-['Rozha_One',serif]">
                श्री श्याम कृषि सेवा केंद्र
              </h3>

              <div className="text-xs text-zinc-400 mt-1">
                ऑर्डर क्रमांक (Order ID):{' '}
                <span className="font-mono font-bold text-white">{placedOrder.id}</span>
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-[#141620] border border-zinc-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">{isHindi ? 'किसान / ग्राहक:' : 'Customer:'}</span>
                <span className="text-white font-bold">{placedOrder.customerName} ({placedOrder.phone})</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">{isHindi ? 'भुगतान माध्यम:' : 'Payment Mode:'}</span>
                <span className="text-emerald-400 font-bold">
                  {placedOrder.paymentMethod === 'upi' ? '⚡ ऑनलाइन UPI' : '💵 दुकान पर नकद'}
                </span>
              </div>

              {placedOrder.upiRefNumber && (
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">{isHindi ? 'UPI UTR / संदर्भ:' : 'UPI UTR:'}</span>
                  <span className="text-white font-mono">{placedOrder.upiRefNumber}</span>
                </div>
              )}

              {/* Items List */}
              <div className="pt-1">
                <div className="text-[11px] text-zinc-400 font-semibold mb-1.5">
                  {isHindi ? 'ऑर्डर की गई दवाइयाँ:' : 'Ordered Items:'}
                </div>
                <div className="space-y-1.5">
                  {placedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-zinc-300 text-[11px]">
                      <span>
                        {idx + 1}. {it.name} ({it.packSize}) x {it.quantity}
                      </span>
                      <span className="font-mono text-white">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {isHindi ? 'कुल राशि:' : 'Total Amount:'}
                </span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  ₹{placedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSendWhatsAppReceipt}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isHindi ? 'व्हाट्सएप पर ऑर्डर रसीद भेजें (+91 81204 64749)' : 'Send Receipt on WhatsApp'}</span>
              </button>

              <a
                href={`tel:${cleanPhone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? 'दुकानदार से बात करें (+91 81204 64749)' : 'Call Store directly'}</span>
              </a>

              <button
                onClick={() => {
                  setStep('cart');
                  setPlacedOrder(null);
                  onClose();
                }}
                className="w-full text-center py-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {isHindi ? 'वापस मुख्य वेबसाइट पर जाएं' : 'Return to Store'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
