import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
  onViewAll: () => void;
  whatsappNumber?: string;
  language: Language;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onViewDetails,
  onAddToCart,
  onQuickOrder,
  onViewAll,
  whatsappNumber,
  language,
}) => {
  const isHindi = language === 'hi';
  const featuredList = products.filter((p) => p.featured);

  if (featuredList.length === 0) return null;

  return (
    <section id="featured" className="py-14 md:py-20 bg-gradient-to-b from-[#071a12] via-[#092218] to-[#061510] border-t border-b border-emerald-500/30 relative overflow-hidden">
      {/* Background ambient multi-color lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1.5 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHindi ? 'अनुशंसित कृषि समाधान · 100% प्रामाणिक' : 'Curated Solutions · 100% Genuine'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-['Rozha_One',serif]">
              {isHindi ? 'हमारे प्रमुख कृषि उत्पाद' : 'Featured Agriculture Products'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
              {isHindi
                ? 'फसलों की सुरक्षा, रोग नियंत्रण एवं बेहतर पैदावार के लिए सर्वाधिक अनुशंसित उत्पाद। तुरंत ऑनलाइन UPI या नकद ऑर्डर करें।'
                : 'Highly recommended certified crop protection medicines and nutrition boosters. Order online via UPI or Cash.'}
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors group cursor-pointer"
          >
            <span>{isHindi ? `सभी उत्पाद देखें (${products.length})` : `View All Products (${products.length})`}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.slice(0, 8).map((product, idx) => (
            <ProductCard
              key={`featured-${product.id}-${idx}`}
              product={product}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              onQuickOrder={onQuickOrder}
              whatsappNumber={whatsappNumber}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
