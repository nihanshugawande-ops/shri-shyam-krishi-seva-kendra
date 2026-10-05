import React, { useState, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { Product, Category, ProductType, Language } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
  whatsappNumber?: string;
  language: Language;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  onViewDetails,
  onAddToCart,
  onQuickOrder,
  whatsappNumber,
  language,
}) => {
  const isHindi = language === 'hi';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [priceSort, setPriceSort] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const productTypes: ProductType[] = [
    'कीटनाशक',
    'फफूंदनाशक',
    'खरपतवारनाशक',
    'जैविक उत्पाद',
    'उर्वरक',
    'बीज',
    'अन्य कृषि उत्पाद',
  ];

  // Suggestions for search
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    const set = new Set<string>();

    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) set.add(p.name);
      if (p.nameEn && p.nameEn.toLowerCase().includes(q)) set.add(p.nameEn);
      if (p.brand.toLowerCase().includes(q)) set.add(p.brand);
      if (p.crop.toLowerCase().includes(q)) set.add(p.crop);
    });

    return Array.from(set).slice(0, 5);
  }, [products, searchTerm]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const matches =
            item.name.toLowerCase().includes(q) ||
            (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
            item.brand.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.categoryEn && item.categoryEn.toLowerCase().includes(q)) ||
            item.crop.toLowerCase().includes(q) ||
            (item.cropEn && item.cropEn.toLowerCase().includes(q)) ||
            item.productType.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (selectedCategory !== 'all') {
          if (
            item.category !== selectedCategory &&
            item.categoryEn !== selectedCategory &&
            !item.crop.includes(selectedCategory)
          ) {
            return false;
          }
        }

        if (selectedType !== 'all') {
          if (item.productType !== selectedType) return false;
        }

        if (stockOnly && !item.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'low-high') return a.price - b.price;
        if (priceSort === 'high-low') return b.price - a.price;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, selectedType, stockOnly, priceSort]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    stockOnly ||
    priceSort !== 'default';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setStockOnly(false);
    setPriceSort('default');
  };

  return (
    <section id="products" className="py-12 md:py-20 bg-gradient-to-b from-[#061510] via-[#091e17] to-[#07131e] relative overflow-hidden">
      {/* Multi-tone ambient glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.25)] mb-3">
            <span>💊</span>
            <span>{isHindi ? '100% असली व प्रमाणित कृषि दवाइयां' : '100% Genuine Certified Medicines'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Rozha_One',serif]">
            {isHindi ? 'कृषि उत्पाद एवं फसल सुरक्षा दवाइयाँ' : 'Agricultural Medicines & Store Catalog'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/70">
            {isHindi
              ? 'विभिन्न फसलों के लिए प्रमाणित कीटनाशक, फफूंदनाशक, बीज एवं फसल पोषण उत्पाद'
              : 'Certified insecticides, fungicides, herbicides, fertilizers, and hybrid seeds'}
          </p>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="bg-gradient-to-r from-[#0c261b] via-[#0a2330] to-[#0c261b] p-4 sm:p-5 rounded-3xl border border-emerald-500/35 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input with Autocomplete Suggestions */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  isHindi
                    ? 'दवाई का नाम, कंपनी, फसल या बीमारी खोजें...'
                    : 'Search medicine name, brand, crop or disease...'
                }
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white bg-zinc-900 border border-zinc-700/80 rounded-xl focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#181a22] border border-zinc-700 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-zinc-800">
                  {searchSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(s);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center justify-between"
                    >
                      <span>{s}</span>
                      <Sparkles className="w-3 h-3 text-zinc-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Controls on Desktop */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Product Type Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">
                  {isHindi ? 'सभी प्रकार (कीटनाशक, टॉनिक...)' : 'All Product Types'}
                </option>
                {productTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Price Sort */}
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="default">{isHindi ? 'क्रमबद्ध करें' : 'Sort by'}</option>
                <option value="low-high">
                  {isHindi ? 'मूल्य: कम से अधिक' : 'Price: Low to High'}
                </option>
                <option value="high-low">
                  {isHindi ? 'मूल्य: अधिक से कम' : 'Price: High to Low'}
                </option>
              </select>

              {/* Stock only toggle */}
              <button
                onClick={() => setStockOnly(!stockOnly)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                  stockOnly
                    ? 'bg-zinc-800 border-zinc-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                    stockOnly ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-500'
                  }`}
                >
                  {stockOnly && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{isHindi ? 'केवल उपलब्ध स्टॉक' : 'In Stock Only'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Crop / Category Filter Tabs with Distinct Vibrant Luxury Colors */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-zinc-400 whitespace-nowrap mr-1 font-bold">
              {isHindi ? '🌾 फसल अनुसार:' : '🌾 By Crop:'}
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-zinc-900/90 text-zinc-300 hover:text-white border-zinc-700/80 hover:border-zinc-500'
              }`}
            >
              {isHindi ? 'सभी फसलें (All)' : 'All Crops'}
            </button>
            {categories.map((cat, idx) => {
              const catLabel = isHindi ? cat.name : (cat.nameEn || cat.name);
              const isSelected = selectedCategory === cat.name || selectedCategory === cat.nameEn;
              
              // Distinct palette per category
              const palettes = [
                { active: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]', hover: 'hover:border-amber-500/60 text-amber-200' },
                { active: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 font-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]', hover: 'hover:border-emerald-500/60 text-emerald-200' },
                { active: 'bg-gradient-to-r from-sky-500 to-blue-400 text-zinc-950 font-black border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]', hover: 'hover:border-sky-500/60 text-sky-200' },
                { active: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]', hover: 'hover:border-rose-500/60 text-rose-200' },
                { active: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]', hover: 'hover:border-purple-500/60 text-purple-200' },
                { active: 'bg-gradient-to-r from-orange-500 to-amber-400 text-zinc-950 font-black border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]', hover: 'hover:border-orange-500/60 text-orange-200' },
                { active: 'bg-gradient-to-r from-lime-500 to-emerald-400 text-zinc-950 font-black border-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.4)]', hover: 'hover:border-lime-500/60 text-lime-200' },
              ];
              const pal = palettes[idx % palettes.length];

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? `${pal.active}`
                      : `bg-zinc-900/90 text-zinc-300 hover:text-white border-zinc-800 ${pal.hover}`
                  }`}
                >
                  <span className="text-sm select-none">{cat.icon || '🌾'}</span>
                  <span>{catLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active filter count & clear */}
          {hasActiveFilters && (
            <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
              <span>
                {filteredProducts.length} {isHindi ? 'उत्पाद मिले' : 'products found'}
              </span>
              <button
                onClick={resetFilters}
                className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>{isHindi ? 'फ़िल्टर हटाएं' : 'Reset Filters'}</span>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={`cat-${product.id}-${idx}`}
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onQuickOrder={onQuickOrder}
                whatsappNumber={whatsappNumber}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl border border-zinc-800 bg-[#161820] px-6 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              {selectedCategory !== 'all'
                ? isHindi
                  ? 'इस श्रेणी में अभी कोई उत्पाद उपलब्ध नहीं है।'
                  : 'No products currently available in this category.'
                : isHindi
                ? 'अभी कोई उत्पाद उपलब्ध नहीं है।'
                : 'No products found.'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6">
              {isHindi
                ? 'कृपया अन्य फसल, श्रेणी या खोज शब्द चुनकर देखें अथवा दुकान से सीधे संपर्क करें।'
                : 'Please try searching with another keyword or contact our store directly.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all cursor-pointer"
              >
                {isHindi ? 'सभी उत्पाद देखें' : 'View All Products'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
