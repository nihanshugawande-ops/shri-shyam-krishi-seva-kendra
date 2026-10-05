import React, { useState } from 'react';
import { ProductType } from '../../types';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  productType?: ProductType;
  brand?: string;
  name?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  productType = 'कीटनाशक',
  brand,
  name,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);

  // If user provided a real image or uploaded base64 data, try displaying it
  if (src && !loadFailed && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        onError={() => setLoadFailed(true)}
      />
    );
  }

  // Domain-authentic SVG product visual based on product type
  const getTypeTheme = (type: ProductType) => {
    switch (type) {
      case 'कीटनाशक': // Insecticide - red/amber safety accent
        return {
          primary: '#e11d48',
          bgGradient: 'from-[#1c1917] to-[#121316]',
          badge: 'कीटनाशक',
          badgeColor: '#f43f5e',
          capColor: '#be123c',
          bottleType: 'bottle',
        };
      case 'फफूंदनाशक': // Fungicide - blue/cyan protection accent
        return {
          primary: '#0284c7',
          bgGradient: 'from-[#111827] to-[#121316]',
          badge: 'फफूंदनाशक',
          badgeColor: '#38bdf8',
          capColor: '#0369a1',
          bottleType: 'pouch',
        };
      case 'खरपतवारनाशक': // Herbicide - orange/amber accent
        return {
          primary: '#d97706',
          bgGradient: 'from-[#1c1917] to-[#121316]',
          badge: 'खरपतवारनाशक',
          badgeColor: '#fbbf24',
          capColor: '#b45309',
          bottleType: 'canister',
        };
      case 'जैविक उत्पाद': // Bio / Tonic - emerald/green organic accent
        return {
          primary: '#059669',
          bgGradient: 'from-[#062016] to-[#121316]',
          badge: 'जैविक टॉनिक',
          badgeColor: '#34d399',
          capColor: '#047857',
          bottleType: 'bottle',
        };
      case 'उर्वरक': // Fertilizer - golden yellow/leaf accent
        return {
          primary: '#ca8a04',
          bgGradient: 'from-[#1a1810] to-[#121316]',
          badge: 'घुलनशील पोषण',
          badgeColor: '#facc15',
          capColor: '#a16207',
          bottleType: 'pouch',
        };
      case 'बीज': // Seeds - earth amber
        return {
          primary: '#854d0e',
          bgGradient: 'from-[#1c1917] to-[#121316]',
          badge: 'प्रमाणित बीज',
          badgeColor: '#fde047',
          capColor: '#713f12',
          bottleType: 'pouch',
        };
      default:
        return {
          primary: '#10b981',
          bgGradient: 'from-[#181a1f] to-[#121316]',
          badge: 'कृषि समाधान',
          badgeColor: '#34d399',
          capColor: '#059669',
          bottleType: 'bottle',
        };
    }
  };

  const theme = getTypeTheme(productType);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b ${theme.bgGradient} p-4 select-none ${className}`}
      aria-label={alt}
    >
      {/* Subtle radial studio backlight */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${theme.primary} 0%, transparent 65%)`,
        }}
      />

      {/* Realistic Product Vector Illustration */}
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full max-h-52 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-bottle-${productType}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="35%" stopColor="#3f3f46" />
            <stop offset="65%" stopColor="#52525b" />
            <stop offset="100%" stopColor="#27272a" />
          </linearGradient>

          <linearGradient id={`grad-label-${productType}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e4e4e7" />
          </linearGradient>

          <linearGradient id={`grad-pouch-${productType}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="50%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
        </defs>

        {/* Soft shadow under base */}
        <ellipse cx="100" cy="225" rx="55" ry="8" fill="#000000" fillOpacity="0.5" />

        {theme.bottleType === 'pouch' ? (
          // Stand-up Agriculture Pouch / Bag
          <g>
            <path
              d="M50 55 L150 55 L158 215 C158 218 152 222 100 222 C48 222 42 218 42 215 Z"
              fill={`url(#grad-pouch-${productType})`}
              stroke="#52525b"
              strokeWidth="1.5"
            />
            {/* Top seal crimp lines */}
            <path d="M48 55 L152 55 L152 68 L48 68 Z" fill="#18181b" stroke="#71717a" strokeWidth="1" />
            <line x1="55" y1="60" x2="145" y2="60" stroke="#71717a" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="100" cy="48" r="4" fill="#18181b" stroke="#71717a" />

            {/* Pouch Label */}
            <rect x="54" y="80" width="92" height="115" rx="3" fill="#ffffff" />
            <rect x="54" y="80" width="92" height="8" fill={theme.primary} />
            <rect x="54" y="187" width="92" height="8" fill={theme.primary} />

            {/* Brand text */}
            <text x="100" y="102" textAnchor="middle" fill="#09090b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              {brand ? brand.slice(0, 14) : 'AGRICULTURE'}
            </text>
            <text x="100" y="122" textAnchor="middle" fill={theme.primary} fontSize="11" fontWeight="900" fontFamily="sans-serif">
              {name ? name.slice(0, 12) : theme.badge}
            </text>
            <line x1="65" y1="130" x2="135" y2="130" stroke="#d4d4d8" strokeWidth="1" />
            <text x="100" y="145" textAnchor="middle" fill="#52525b" fontSize="8" fontFamily="sans-serif">
              फसल सुरक्षा समाधान
            </text>
            <rect x="70" y="156" width="60" height="16" rx="2" fill={theme.primary} fillOpacity="0.1" />
            <text x="100" y="167" textAnchor="middle" fill={theme.primary} fontSize="7" fontWeight="bold" fontFamily="sans-serif">
              ★ प्रमाणित शुद्धता
            </text>
          </g>
        ) : theme.bottleType === 'canister' ? (
          // Agriculture Medicine Canister (Square/Jug with handle)
          <g>
            {/* Handle */}
            <path
              d="M135 90 C155 90 155 150 135 160"
              stroke="#3f3f46"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Canister Body */}
            <rect
              x="50"
              y="75"
              width="90"
              height="145"
              rx="12"
              fill={`url(#grad-bottle-${productType})`}
              stroke="#52525b"
              strokeWidth="1.5"
            />
            {/* Cap */}
            <rect x="70" y="52" width="50" height="23" rx="4" fill={theme.capColor} stroke="#71717a" strokeWidth="1" />
            <line x1="75" y1="58" x2="115" y2="58" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="75" y1="64" x2="115" y2="64" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />

            {/* Label */}
            <rect x="58" y="100" width="74" height="98" rx="4" fill="#ffffff" />
            <rect x="58" y="100" width="74" height="6" fill={theme.primary} />
            <text x="95" y="120" textAnchor="middle" fill="#18181b" fontSize="9" fontWeight="bold">
              {brand ? brand.slice(0, 12) : 'CROP CARE'}
            </text>
            <text x="95" y="138" textAnchor="middle" fill={theme.primary} fontSize="10" fontWeight="900">
              {name ? name.slice(0, 10) : 'PRO-CARE'}
            </text>
            <text x="95" y="155" textAnchor="middle" fill="#71717a" fontSize="7">
              {theme.badge}
            </text>
            <rect x="68" y="165" width="54" height="14" rx="2" fill="#f4f4f5" />
            <text x="95" y="175" textAnchor="middle" fill="#27272a" fontSize="7" fontWeight="bold">
              उच्च प्रभाव
            </text>
          </g>
        ) : (
          // Precision Bottle with Measuring Cap (standard insecticide/herbicide bottle)
          <g>
            {/* Measuring Cap (translucent cap over bottle neck) */}
            <rect x="80" y="32" width="40" height="22" rx="3" fill="#ffffff" fillOpacity="0.75" stroke="#a1a1aa" strokeWidth="1" />
            <line x1="84" y1="38" x2="96" y2="38" stroke="#71717a" strokeWidth="0.8" />
            <line x1="84" y1="44" x2="102" y2="44" stroke="#71717a" strokeWidth="0.8" />

            {/* Main Safety Cap */}
            <rect x="84" y="52" width="32" height="18" rx="2" fill={theme.capColor} stroke="#27272a" strokeWidth="1" />
            <line x1="88" y1="58" x2="112" y2="58" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />

            {/* Neck */}
            <rect x="87" y="70" width="26" height="12" fill="#3f3f46" />

            {/* Shoulder and Body */}
            <path
              d="M87 82 C70 88 56 100 54 116 L54 212 C54 218 60 222 68 222 L132 222 C140 222 146 218 146 212 L146 116 C144 100 130 88 113 82 Z"
              fill={`url(#grad-bottle-${productType})`}
              stroke="#52525b"
              strokeWidth="1.5"
            />

            {/* Commercial Label */}
            <rect x="60" y="112" width="80" height="92" rx="3" fill={`url(#grad-label-${productType})`} stroke="#d4d4d8" strokeWidth="0.5" />
            <rect x="60" y="112" width="80" height="8" fill={theme.primary} />
            <rect x="60" y="196" width="80" height="8" fill={theme.primary} />

            {/* Label details */}
            <text x="100" y="132" textAnchor="middle" fill="#09090b" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
              {brand ? brand.slice(0, 14) : 'SHREE SHYAM'}
            </text>
            <text x="100" y="152" textAnchor="middle" fill={theme.primary} fontSize="11" fontWeight="900" fontFamily="sans-serif">
              {name ? name.slice(0, 12) : theme.badge}
            </text>
            <line x1="72" y1="158" x2="128" y2="158" stroke="#e4e4e7" strokeWidth="1" />
            <text x="100" y="172" textAnchor="middle" fill="#52525b" fontSize="7.5" fontFamily="sans-serif">
              कृषि रक्षा उत्पाद
            </text>
            <circle cx="100" cy="184" r="5" fill={theme.primary} fillOpacity="0.2" />
            <text x="100" y="186.5" textAnchor="middle" fill={theme.primary} fontSize="6" fontWeight="bold">
              ✓
            </text>
          </g>
        )}
      </svg>

      {/* Subtle indicator tag */}
      <div className="absolute bottom-2 right-2 text-[10px] font-medium tracking-wide text-zinc-400 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/5">
        {theme.badge}
      </div>
    </div>
  );
};
