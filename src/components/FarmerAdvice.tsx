import React, { useState, useMemo } from 'react';
import { BookOpen, Calendar, ArrowRight, Sprout, Search, ExternalLink } from 'lucide-react';
import { Article, Language } from '../types';
import { ArticleModal } from './ArticleModal';

interface FarmerAdviceProps {
  articles: Article[];
  language: Language;
}

export const FarmerAdvice: React.FC<FarmerAdviceProps> = ({ articles, language }) => {
  const isHindi = language === 'hi';
  const publishedArticles = articles.filter((a) => a.published);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = isHindi
    ? [
        { id: 'all', label: 'सभी विषय' },
        { id: 'crop', label: '🌾 फसल जानकारी' },
        { id: 'pest', label: '🪲 कीट प्रबंधन' },
        { id: 'disease', label: '🍄 रोग निवारण' },
        { id: 'soil', label: '🧪 मृदा परीक्षण' },
        { id: 'irrigation', label: '💧 सिंचाई तकनीक' },
        { id: 'care', label: '🌿 फसल सुरक्षा' },
        { id: 'seed', label: '🌱 उन्नत बीज' },
        { id: 'general', label: '📚 सामान्य कृषि ज्ञान' },
      ]
    : [
        { id: 'all', label: 'All Topics' },
        { id: 'crop', label: '🌾 Crop Info' },
        { id: 'pest', label: '🪲 Pest Info' },
        { id: 'disease', label: '🍄 Disease Control' },
        { id: 'soil', label: '🧪 Soil Health' },
        { id: 'irrigation', label: '💧 Irrigation' },
        { id: 'care', label: '🌿 Crop Care' },
        { id: 'seed', label: '🌱 Seed Info' },
        { id: 'general', label: '📚 General Knowledge' },
      ];

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((art) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          art.title.toLowerCase().includes(q) ||
          (art.titleEn && art.titleEn.toLowerCase().includes(q)) ||
          art.description.toLowerCase().includes(q) ||
          art.crop.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedCategory !== 'all') {
        const cat = art.category.toLowerCase();
        if (selectedCategory === 'crop' && !cat.includes('फसल') && !cat.includes('crop')) return false;
        if (selectedCategory === 'pest' && !cat.includes('कीट') && !cat.includes('pest')) return false;
        if (selectedCategory === 'disease' && !cat.includes('रोग') && !cat.includes('disease')) return false;
        if (selectedCategory === 'soil' && !cat.includes('मृदा') && !cat.includes('soil')) return false;
        if (selectedCategory === 'irrigation' && !cat.includes('सिंचाई') && !cat.includes('irrigation')) return false;
        if (selectedCategory === 'care' && !cat.includes('सुरक्षा') && !cat.includes('care')) return false;
        if (selectedCategory === 'seed' && !cat.includes('बीज') && !cat.includes('seed')) return false;
      }

      return true;
    });
  }, [publishedArticles, searchQuery, selectedCategory]);

  return (
    <section id="knowledge" className="py-14 md:py-20 bg-gradient-to-b from-[#081326] via-[#0b1c36] to-[#07131d] border-t border-blue-500/40 relative overflow-hidden">
      {/* Royal Sapphire Blue ambient lighting */}
      <div className="absolute top-1/4 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-400/40 text-blue-200 text-xs font-bold mb-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>{isHindi ? '🌾 वैज्ञानिक कृषि मार्गदर्शन (Crop Knowledge)' : 'Agricultural Knowledge Hub'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-['Rozha_One',serif]">
            {isHindi ? 'कृषि ज्ञान केंद्र' : 'Agriculture Knowledge Center'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            {isHindi
              ? 'फसलों के रोग, कीट प्रबंधन, मिट्टी की जांच व सिंचाई तकनीकों की वैज्ञानिक जानकारी'
              : 'Reliable agronomic articles, disease diagnosis guides, and seasonal crop care advice'}
          </p>
        </div>

        {/* Search & Topic Tabs */}
        <div className="mb-8 space-y-4">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'कृषि विषय, फसल या रोग खोजें...' : 'Search farming topics or diseases...'}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm text-white bg-zinc-900 border border-zinc-700/80 rounded-xl focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="flex flex-col justify-between p-5 rounded-2xl bg-[#181a22] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Sprout className="w-3.5 h-3.5" />
                      <span>{isHindi ? art.crop : (art.cropEn || art.crop)}</span>
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>{art.date}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {isHindi ? art.title : (art.titleEn || art.title)}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {isHindi ? art.description : (art.descriptionEn || art.description)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>{isHindi ? 'विस्तार से पढ़ें' : 'Read Article'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-zinc-400">
            {isHindi ? 'इस विषय पर कोई लेख नहीं मिला।' : 'No articles found in this category.'}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          language={language}
        />
      )}
    </section>
  );
};
