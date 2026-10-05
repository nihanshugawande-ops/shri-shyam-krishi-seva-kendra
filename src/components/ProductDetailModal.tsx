import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Sparkles,
  Bot,
  Zap,
  Target,
  FlaskConical,
  Tractor,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product, StoreSettings, Language } from '../types';
import { ProductImage } from './common/ProductImage';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  settings: StoreSettings;
  onAddToCart?: (product: Product, quantity: number) => void;
  onQuickOrder?: (product: Product, quantity: number) => void;
  language?: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  settings,
  onAddToCart,
  onQuickOrder,
  language = 'hi',
}) => {
  if (!product) return null;

  const isHindi = language === 'hi';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // AI advisory state
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null);
  const [showAiReport, setShowAiReport] = useState(false);

  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  const currentImage = allImages[activeImageIndex] || product.image;

  const cleanPhone = (settings.whatsapp || settings.officialPhone || '+918120464749').replace(
    /[^0-9]/g,
    ''
  );

  const productName = isHindi ? product.name : (product.nameEn || product.name);
  const categoryName = isHindi ? product.category : (product.categoryEn || product.category);
  const cropName = isHindi ? product.crop : (product.cropEn || product.crop);
  const description = isHindi ? product.description : (product.descriptionEn || product.description);
  const usageInfo = isHindi ? product.usageInfo : (product.usageInfoEn || product.usageInfo);
  const targetPests = isHindi ? product.targetPests : (product.targetPestsEn || product.targetPests);
  const dosageInfo = isHindi ? product.dosageInfo : (product.dosageInfoEn || product.dosageInfo);
  const precautions = isHindi ? product.precautions : (product.precautionsEn || product.precautions);

  // Fetch AI Advisory for this specific product
  const handleFetchAiAdvisory = async () => {
    if (aiAdvisory) {
      setShowAiReport(!showAiReport);
      return;
    }

    setLoadingAi(true);
    setShowAiReport(true);
    try {
      const res = await api.getProductAdvisory(
        product.name,
        product.brand,
        product.productType,
        product.crop,
        language
      );
      setAiAdvisory(res.detailedAdvisory || res.usageInfo || 'परामर्श तैयार है।');
    } catch {
      setAiAdvisory(
        isHindi
          ? `🌾 ${productName} का उपयोग अनुशंसित फसल (${cropName || 'फसल'}) में लेबल अनुसार करें। अधिक जानकारी हेतु स्वामी कार्तिक गावंडे जी (+91 81204 64749) से संपर्क करें।`
          : `Apply ${productName} as per official container instructions. Contact Kartick Gawande at +91 81204 64749 for field advice.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `नमस्ते श्री श्याम कृषि सेवा केंद्र, मुझे "${productName}" (${product.packSize}, मात्रा: ${qty}) के बारे में अधिक जानकारी व उपलब्धता जाननी है।`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${(settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '')}`;
  };

  const handleOpenAiDoctor = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('ai-help');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.dispatchEvent(
          new CustomEvent('ai-ask-product', {
            detail: {
              productName,
              question: isHindi
                ? `नमस्ते, क्या मैं अपनी फसल में "${productName}" डाल सकता हूँ? इसकी सही मात्रा, उपयुक्त फसलें और छिड़काव का समय क्या है?`
                : `Hello, can I use "${productName}" in my crop? What is the recommended dosage, suitable crops and spray timing?`,
            },
          })
        );
      }
    }, 150);
  };

  const handleAddCart = () => {
    if (onAddToCart) {
      onAddToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleBuyNow = () => {
    if (onQuickOrder) {
      onQuickOrder(product, qty);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#141620] border border-zinc-700/80 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.7)] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-[#171a26] via-[#141622] to-[#171a26] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'श्री श्याम कृषि सेवा केंद्र · आधिकारिक उत्पाद विवरण' : 'Official Product Details'}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column (5 cols): Visual Showcase & Pack */}
            <div className="md:col-span-5 flex flex-col">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 p-3 shadow-inner flex items-center justify-center">
                <ProductImage
                  src={currentImage}
                  alt={productName}
                  productType={product.productType}
                  brand={product.brand}
                  name={productName}
                  className="w-full h-full object-contain"
                />

                {product.featured && (
                  <div className="absolute top-3 left-3 text-[10px] font-bold text-amber-300 bg-amber-950/90 border border-amber-600/50 px-2.5 py-1 rounded-lg shadow">
                    ⭐ {isHindi ? 'विशेष अनुशंसित' : 'Top Choice'}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-emerald-500 scale-105 shadow-md'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Price & Savings Card */}
              <div className="mt-4 p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-md">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-zinc-400">
                      {isHindi ? 'दुकान मूल्य (Store Price)' : 'Price'}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {product.mrp && product.mrp > product.price && (
                    <div className="text-right">
                      <div className="text-[11px] text-zinc-500">MRP</div>
                      <div className="text-sm text-zinc-400 line-through tabular-nums">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-emerald-400 font-bold">
                        {isHindi ? 'बचत:' : 'Save:'} ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="text-zinc-400">
                    {isHindi ? 'पैकिंग साइज:' : 'Pack Size:'}{' '}
                    <span className="font-bold text-white">{product.packSize}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-zinc-200">
                      {product.inStock
                        ? isHindi
                          ? 'स्टॉक में उपलब्ध'
                          : 'In Stock'
                        : isHindi
                        ? 'स्टॉक समाप्त'
                        : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Help Trigger Button */}
              <button
                onClick={handleFetchAiAdvisory}
                disabled={loadingAi}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border border-emerald-500/40 text-emerald-300 hover:text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>
                  {loadingAi
                    ? isHindi
                      ? 'AI जानकारी ला रहा है...'
                      : 'Fetching AI Advice...'
                    : isHindi
                    ? '✨ AI से इस दवाई का संपूर्ण विवरण पूछें'
                    : '✨ Ask AI Agronomist About This'}
                </span>
                {showAiReport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Right Column (7 cols): Full Agronomic Usage Breakdown */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                {/* Brand & Type Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white bg-zinc-800 border border-zinc-700">
                    {product.brand}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800/60">
                    {categoryName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium text-amber-300 bg-amber-950/80 border border-amber-800/60">
                    {product.productType}
                  </span>
                </div>

                {/* Product Title */}
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Rozha_One',serif]">
                  {productName}
                </h2>

                {/* Description */}
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {description}
                </p>

                {/* AI Interactive Report Dropdown if Triggered */}
                {showAiReport && aiAdvisory && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-zinc-900 border border-emerald-500/40 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isHindi ? '🌾 AI कृषि वैज्ञानिक परामर्श (AI Advisory):' : 'AI Agronomist Report:'}</span>
                    </div>
                    <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                      {aiAdvisory}
                    </div>
                  </div>
                )}

                {/* 4 CORE AGRONOMIC CARDS AS REQUESTED BY USER */}
                <div className="mt-5 space-y-3">
                  {/* Card 1: Where to Apply (Suitable Crops) */}
                  <div className="p-3.5 rounded-xl bg-[#181b24] border border-zinc-700/80 flex items-start gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 text-base mt-0.5">
                      🌾
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                        {isHindi ? 'किन-किन फसलों में डाल सकते हैं (Suitable Crops)' : 'Suitable Crops:'}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                        {cropName || (isHindi ? 'गेहूं, चना, सोयाबीन, मक्का एवं अन्य संबंधित फसलें' : 'Wheat, Gram, Soybean, and related crops')}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: What it treats (Target Pests / Weeds / Diseases) */}
                  <div className="p-3.5 rounded-xl bg-[#181b24] border border-zinc-700/80 flex items-start gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0 text-base mt-0.5">
                      🎯
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                        {isHindi ? 'किस-किस चीज/रोग/कीट/खरपतवार के लिए डाल सकते हैं (Target Pests & Diseases)' : 'What it treats:'}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                        {targetPests ||
                          (product.name.includes('2,4-D') || product.name.includes('240')
                            ? isHindi
                              ? 'गेहूं में बथुआ, हिरनखुरी, कृष्णनील, सैंजी, चटरी-मटरी जैसी चौड़ी पत्ती वाले खरपतवार'
                              : 'Broadleaf weeds (Bathua, Hirankhuri, Chenopodium) in wheat'
                            : product.productType === 'फफूंदनाशक'
                            ? isHindi
                              ? 'पीला रतुआ, भूरा रतुआ, झुलसा, पाउडरी मिल्ड्यू व फफूंद जनित रोग'
                              : 'Rust, foliar blights, powdery mildew'
                            : product.productType === 'कीटनाशक'
                            ? isHindi
                              ? 'घाटी छेदक इल्ली, तना छेदक, गर्डल बीटल, रसचूसक कीट'
                              : 'Pod borer, caterpillars, stem borers'
                            : isHindi
                            ? 'रोग, कीट नियंत्रण अथवा फसल विकास व पोषक तत्व'
                            : 'Target pests and crop health enhancement')}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Dosage & Water Ratio */}
                  <div className="p-3.5 rounded-xl bg-[#181b24] border border-zinc-700/80 flex items-start gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-700/50 flex items-center justify-center text-sky-400 shrink-0 text-base mt-0.5">
                      🧪
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                        {isHindi ? 'छिड़काव मात्रा एवं पानी (Dosage & Dilution)' : 'Dosage & Dilution:'}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                        {dosageInfo ||
                          (product.name.includes('2,4-D')
                            ? isHindi
                              ? '400 से 500 मिली प्रति एकड़ (150 लीटर पानी, 25-30 मिली प्रति 15 लीटर पंप)'
                              : '400-500 ml per acre in 150 L water'
                            : isHindi
                            ? 'उत्पाद लेबल अनुसार 1.5 से 2 मिली / ग्राम प्रति लीटर पानी'
                            : 'As per product label recommendations')}
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Spray Timing & Instructions */}
                  <div className="p-3.5 rounded-xl bg-[#181b24] border border-zinc-700/80 flex items-start gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0 text-base mt-0.5">
                      🚜
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                        {isHindi ? 'छिड़काव विधि व सही समय (Application Stage & Method)' : 'Application Timing:'}
                      </div>
                      <div className="text-xs sm:text-sm text-zinc-200 mt-0.5">
                        {usageInfo ||
                          (isHindi
                            ? 'सुबह या शाम के शांत मौसम में पर्याप्त नमी होने पर फ्लैट-फैन नोजल से समान छिड़काव करें।'
                            : 'Apply uniformly during morning or evening hours with proper soil moisture.')}
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Precautions */}
                  {precautions && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-200">
                        <span className="font-bold">{isHindi ? 'सावधानी: ' : 'Caution: '}</span>
                        {precautions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase & Action Controls */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                {/* Quantity Selector & Main Buy Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between border border-zinc-700 bg-zinc-900 rounded-xl p-1 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      disabled={qty <= 1}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-white tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((prev) => prev + 1)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>{isHindi ? 'कार्ट में जोड़ा गया!' : 'Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <span>{isHindi ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now / UPI Checkout */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-zinc-900 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-zinc-950 fill-zinc-950" />
                    <span>{isHindi ? '⚡ तुरंत खरीदें (UPI)' : '⚡ Instant Order (UPI)'}</span>
                  </button>
                </div>

                {/* Direct Contact Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isHindi ? 'व्हाट्सएप पूछताछ' : 'WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isHindi ? 'कॉल करें' : 'Call Expert'}</span>
                  </button>
                </div>

                {/* Consult AI Doctor with this Product Button */}
                <button
                  type="button"
                  onClick={handleOpenAiDoctor}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>
                    {isHindi
                      ? `🌱 AI फसल डॉक्टर से "${productName}" के बारे में पूछें / खेत की फोटो भेजें`
                      : `🌱 Ask AI Crop Doctor about "${productName}" / Send Photo`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
