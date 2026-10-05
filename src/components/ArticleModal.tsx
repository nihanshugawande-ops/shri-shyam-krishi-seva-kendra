import React from 'react';
import { X, Calendar, User, Sprout, ShieldAlert, ExternalLink } from 'lucide-react';
import { Article, Language } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  language?: Language;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, language = 'hi' }) => {
  if (!article) return null;
  const isHindi = language === 'hi';

  const title = isHindi ? article.title : (article.titleEn || article.title);
  const crop = isHindi ? article.crop : (article.cropEn || article.crop);
  const description = isHindi ? article.description : (article.descriptionEn || article.description);
  const content = isHindi ? article.content : (article.contentEn || article.content);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#161820] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#121316] p-6 flex flex-col justify-end border-b border-zinc-800">
          {article.image && (
            <img
              src={article.image}
              alt={title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
            />
          )}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-md mb-2">
              <Sprout className="w-3.5 h-3.5" />
              <span>{crop}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight font-['Rozha_One',serif]">
              {title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-zinc-400 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>{isHindi ? `लेखक: ${article.author}` : `Author: ${article.author}`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{article.date}</span>
            </div>
          </div>

          {/* Description Highlight */}
          <p className="text-sm font-medium text-emerald-200/90 leading-relaxed bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/40">
            {description}
          </p>

          {/* Full Content */}
          <div className="text-sm text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line">
            {content}
          </div>

          {/* External Reference Link if provided */}
          {article.externalLink && (
            <div className="pt-2">
              <a
                href={article.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                <span>{isHindi ? 'आधिकारिक संदर्भ देखें' : 'View External Resource'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Compliance & Safety Advisory Note */}
          <div className="p-4 bg-zinc-900/90 rounded-xl border border-zinc-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-400 leading-relaxed">
              <span className="font-semibold text-zinc-300">
                {isHindi ? 'महत्वपूर्ण सूचना:' : 'Agronomic Advisory:'}
              </span>{' '}
              {isHindi
                ? 'किसी भी कृषि दवाई या कीटनाशक का प्रयोग करने से पूर्व उसके डिब्बे पर दिए गए आधिकारिक लेबल निर्देशों का पालन करें। रोग या कीट के सही निदान के लिए दुकान पर नमूना लाकर परामर्श प्राप्त करें।'
                : 'Always adhere strictly to official container label instructions for pesticide dosage. Bring a fresh foliage sample to the store for certified agronomic diagnosis.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
