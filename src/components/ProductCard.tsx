import React, { useState } from 'react';
import { Eye, MessageCircle, ShoppingBag, Check, Zap } from 'lucide-react';
import { Product, Language } from '../types';
import { ProductImage } from './common/ProductImage';

function getProductTypeTheme(type?: string) {
  switch (type) {
    case 'फफूंदनाशक':
      return {
        badgeBg: 'bg-violet-950/80 border-violet-700/60 text-violet-300',
        cardBorder: 'hover:border-violet-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(139,92,246,0.18)]',
        accentColor: 'text-violet-400',
        tagBg: 'bg-violet-950/70 border-violet-800/60 text-violet-300',
        buttonBg: 'bg-violet-700 hover:bg-violet-600',
      };
    case 'कीटनाशक':
      return {
        badgeBg: 'bg-rose-950/80 border-rose-700/60 text-rose-300',
        cardBorder: 'hover:border-rose-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(244,63,94,0.18)]',
        accentColor: 'text-rose-400',
        tagBg: 'bg-rose-950/70 border-rose-800/60 text-rose-300',
        buttonBg: 'bg-rose-700 hover:bg-rose-600',
      };
    case 'खरपतवारनाशक':
      return {
        badgeBg: 'bg-cyan-950/80 border-cyan-700/60 text-cyan-300',
        cardBorder: 'hover:border-cyan-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(6,182,212,0.18)]',
        accentColor: 'text-cyan-400',
        tagBg: 'bg-cyan-950/70 border-cyan-800/60 text-cyan-300',
        buttonBg: 'bg-cyan-700 hover:bg-cyan-600',
      };
    case 'उर्वरक':
      return {
        badgeBg: 'bg-amber-950/80 border-amber-700/60 text-amber-300',
        cardBorder: 'hover:border-amber-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(245,158,11,0.18)]',
        accentColor: 'text-amber-400',
        tagBg: 'bg-amber-950/70 border-amber-800/60 text-amber-300',
        buttonBg: 'bg-amber-600 hover:bg-amber-500',
      };
    case 'बीज':
      return {
        badgeBg: 'bg-orange-950/80 border-orange-700/60 text-orange-300',
        cardBorder: 'hover:border-orange-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(249,115,22,0.18)]',
        accentColor: 'text-orange-400',
        tagBg: 'bg-orange-950/70 border-orange-800/60 text-orange-300',
        buttonBg: 'bg-orange-700 hover:bg-orange-600',
      };
    case 'जैविक उत्पाद':
      return {
        badgeBg: 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300',
        cardBorder: 'hover:border-emerald-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.18)]',
        accentColor: 'text-emerald-400',
        tagBg: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-300',
        buttonBg: 'bg-emerald-700 hover:bg-emerald-600',
      };
    default:
      return {
        badgeBg: 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300',
        cardBorder: 'hover:border-emerald-500/60',
        glow: 'group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.15)]',
        accentColor: 'text-emerald-400',
        tagBg: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-300',
        buttonBg: 'bg-emerald-700 hover:bg-emerald-600',
      };
  }
}

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
  whatsappNumber?: string;
  language?: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onQuickOrder,
  whatsappNumber = '918120464749',
  language = 'hi',
}) => {
  const [addedAnim, setAddedAnim] = useState(false);
  const isHindi = language === 'hi';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const productName = isHindi ? product.name : product.nameEn || product.name;
  const categoryName = isHindi ? product.category : product.categoryEn || product.category;
  const description = isHindi ? product.description : product.descriptionEn || product.description;
  const theme = getProductTypeTheme(product.productType);

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `नमस्ते श्री श्याम कृषि सेवा केंद्र, मुझे "${productName}" (${product.packSize}) के बारे में जानकारी एवं मूल्य की पुष्टि चाहिए।`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 1200);
    }
  };

  const handleQuickOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickOrder) {
      onQuickOrder(product);
    } else if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className={`group flex flex-col justify-between rounded-2xl bg-[#12141c] border border-zinc-800/90 ${theme.cardBorder} transition-all duration-300 hover:-translate-y-1.5 ${theme.glow} cursor-pointer overflow-hidden relative shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.5)]`}
    >
      <div>
        {/* Product Visual Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#090b10] border-b border-zinc-800/80">
          <ProductImage
            src={product.image}
            alt={productName}
            productType={product.productType}
            brand={product.brand}
            name={productName}
            className="w-full h-full object-contain p-2"
          />

          {/* Product Type Luxury Tag */}
          <div className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border shadow-md backdrop-blur-md ${theme.badgeBg}`}>
            {product.productType}
          </div>

          {/* Stock / Availability Flag */}
          {!product.inStock ? (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-3 py-1 text-xs font-bold text-rose-300 bg-rose-950/90 border border-rose-800 rounded-lg shadow-lg">
                {isHindi ? 'स्टॉक में उपलब्ध नहीं' : 'Out of Stock'}
              </span>
            </div>
          ) : (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isHindi ? 'उपलब्ध' : 'In Stock'}</span>
            </div>
          )}

          {/* Featured Marker */}
          {product.featured && (
            <div className="absolute top-2.5 left-2.5 text-[10px] font-bold text-amber-300 bg-zinc-950/90 border border-amber-500/40 px-2 py-0.5 rounded-lg shadow-sm">
              {isHindi ? '★ प्रमुख' : '★ Featured'}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Metadata: Brand · Category · Pack Size */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-zinc-400 mb-1.5 font-medium">
            <span className="text-white font-bold">{product.brand}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{categoryName}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-mono font-semibold">{product.packSize}</span>
          </div>

          {/* Product Name */}
          <h3 className={`text-base font-bold text-white group-hover:${theme.accentColor} transition-colors line-clamp-1 font-['Rozha_One',serif]`}>
            {productName}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Quick Crop & Treatment Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.crop && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/60">
                <span>🌾</span>
                <span className="truncate max-w-[120px]">{isHindi ? product.crop : (product.cropEn || product.crop)}</span>
              </span>
            )}
            {product.targetPests && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${theme.tagBg}`}>
                <span>🎯</span>
                <span className="truncate max-w-[120px]">{isHindi ? product.targetPests : (product.targetPestsEn || product.targetPests)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-zinc-800/80 flex items-baseline justify-between mb-3.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-zinc-500 line-through tabular-nums font-mono">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {product.packSize}
          </span>
        </div>

        {/* Primary Action: Direct Quick Order Button (UPI / Cash) */}
        <div className="space-y-2 mb-2">
          <button
            onClick={handleQuickOrderClick}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHindi ? '⚡ तुरंत ऑर्डर करें (UPI / नकद)' : '⚡ Quick Order (UPI / Cash)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                addedAnim
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-zinc-700'
              } disabled:opacity-40 disabled:cursor-not-allowed active:scale-95`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  <span>{isHindi ? 'जुड़ गया' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHindi ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => onViewDetails(product)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-700/80 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isHindi ? 'विवरण' : 'Details'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp quick enquiry */}
        <button
          onClick={handleWhatsAppInquiry}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-emerald-300 transition-colors"
        >
          <MessageCircle className="w-3 h-3 text-emerald-400" />
          <span>{isHindi ? 'व्हाट्सएप पर पूछें' : 'Enquire on WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};
