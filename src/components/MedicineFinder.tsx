import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Zap,
  PhoneCall,
  MessageCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { Product, StoreSettings, Language } from '../types';

interface MedicineFinderProps {
  products: Product[];
  settings: StoreSettings;
  language: Language;
  onAddToCart?: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

interface CropGuideItem {
  id: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  badgeColor: string;
  problems: {
    problemHi: string;
    problemEn: string;
    category: 'खरपतवार' | 'कीट/इल्ली' | 'फफूंद/रोग' | 'पोषण/ग्रोथ' | 'बीज';
    categoryColor: string;
    recommendedMedicine: string;
    chemicalFormula: string;
    dosageHi: string;
    dosageEn: string;
    waterRatio: string;
    timingHi: string;
    timingEn: string;
    cautionHi: string;
    cautionEn: string;
    matchedProductId: string;
  }[];
}

const CROP_GUIDES: CropGuideItem[] = [
  {
    id: 'wheat',
    nameHi: 'गेहूं (Wheat)',
    nameEn: 'Wheat',
    emoji: '🌾',
    badgeColor: 'from-amber-500/20 to-yellow-600/10 border-amber-500/40 text-amber-300',
    problems: [
      {
        problemHi: 'चौड़ी पत्ती वाले खरपतवार (बथुआ, हिरनखुरी, कृष्णनील, सैंजी)',
        problemEn: 'Broadleaf weeds (Bathua, Hirankhuri, Wild Mustard)',
        category: 'खरपतवार',
        categoryColor: 'bg-cyan-950 border-cyan-700/60 text-cyan-300',
        recommendedMedicine: '2,4-D मुख्य खरपतवारनाशक (2,4-D Amine 58% SL)',
        chemicalFormula: '2,4-D Amine Salt 58% SL Selective Herbicide',
        dosageHi: '400 से 500 मिली प्रति एकड़ (25-30 मिली प्रति 15 लीटर पंप)',
        dosageEn: '400-500 ml per acre in 150L clean water',
        waterRatio: '150 लीटर स्वच्छ पानी प्रति एकड़',
        timingHi: 'गेहूं बोवनी के 30 से 35 दिन बाद (कल्ले फूटते समय), जब खरपतवार 2 से 4 पत्ती की अवस्था में हों।',
        timingEn: 'Apply 30-35 days after sowing during crown root tillering stage.',
        cautionHi: 'गेहूं में गांठ (Jointing Stage) बनने के बाद कदापि न छिड़कें। तेज हवा में स्प्रे न करें ताकि सरसों/चने में न जाए।',
        cautionEn: 'Do not spray after jointing stage. Prevent drift to broadleaf crops.',
        matchedProductId: 'prod-11',
      },
      {
        problemHi: 'पीला रतुआ व फफूंद जनित पत्ती रोग (Yellow Rust / Foliar Blight)',
        problemEn: 'Yellow Rust & fungal leaf blights',
        category: 'फफूंद/रोग',
        categoryColor: 'bg-violet-950 border-violet-700/60 text-violet-300',
        recommendedMedicine: 'नैटिवो (Nativo - Tebuconazole + Trifloxystrobin)',
        chemicalFormula: 'Tebuconazole 50% + Trifloxystrobin 25% WG',
        dosageHi: '120 से 150 ग्राम प्रति एकड़ (12-15 ग्राम प्रति 15 लीटर पंप)',
        dosageEn: '120-150 gm per acre in 150-200L water',
        waterRatio: '150-200 लीटर पानी प्रति एकड़',
        timingHi: 'पत्तियों पर हल्दी जैसा पीला पाउडर या धारियां दिखते ही तुरंत सुबह या शाम के समय छिड़कें।',
        timingEn: 'Spray immediately upon first symptom appearance in early morning or evening.',
        cautionHi: 'तेज धूप में छिड़काव न करें। खेत में नमी बनाकर रखें।',
        cautionEn: 'Avoid spraying under harsh mid-day sun. Maintain soil moisture.',
        matchedProductId: 'prod-4',
      },
      {
        problemHi: 'कल्ले कम फूटना, पीलापन व पोषण की कमी',
        problemEn: 'Poor tillering, yellowing and nutrient deficiency',
        category: 'पोषण/ग्रोथ',
        categoryColor: 'bg-emerald-950 border-emerald-700/60 text-emerald-300',
        recommendedMedicine: 'घुलनशील उर्वरक 19:19:19 (NPK 19:19:19) + टॉनिक',
        chemicalFormula: '100% Water Soluble NPK 19:19:19',
        dosageHi: '1 किलोग्राम प्रति एकड़ (150 लीटर पानी में मिलाकर फोलियर स्प्रे)',
        dosageEn: '1 kg per acre in 150L water as foliar application',
        waterRatio: '150 लीटर पानी प्रति एकड़',
        timingHi: 'पहले व दूसरे पानी के बाद कल्ले फूटते समय समान छिड़काव करें।',
        timingEn: 'Apply during peak vegetative and tillering stages.',
        cautionHi: 'उर्वरक को खरपतवारनाशक के साथ न मिलाएं। अलग से छिड़काव करें।',
        cautionEn: 'Do not tank-mix with selective weedicides.',
        matchedProductId: 'prod-8',
      },
      {
        problemHi: 'उच्च उत्पादन हेतु प्रमाणित गेहूं बीज चयन',
        problemEn: 'Certified high-yielding wheat seed variety',
        category: 'बीज',
        categoryColor: 'bg-amber-950 border-amber-700/60 text-amber-300',
        recommendedMedicine: 'उन्नत गेहूं बीज (HD-3086 / Pusa Gautami)',
        chemicalFormula: 'Certified Wheat Seeds (Rust Resistant)',
        dosageHi: '40 किलोग्राम प्रति एकड़ (बीजोपचार के उपरांत)',
        dosageEn: '40 kg per acre after fungicide seed dressing',
        waterRatio: 'उचित नमी में कतारबद्ध बुवाई',
        timingHi: 'नवंबर माह में उपयुक्त समय पर बुवाई करें।',
        timingEn: 'Optimal sowing window: November.',
        cautionHi: 'बुवाई से पहले साफ फंगीसाइड से बीजोपचार अवश्य करें।',
        cautionEn: 'Treat seeds with Saaf fungicide prior to sowing.',
        matchedProductId: 'prod-10',
      },
    ],
  },
  {
    id: 'chana',
    nameHi: 'चना (Gram)',
    nameEn: 'Gram / Chickpea',
    emoji: '🌱',
    badgeColor: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-300',
    problems: [
      {
        problemHi: 'घाटी छेदक इल्ली (Pod Borer / Helicoverpa armigera)',
        problemEn: 'Gram Pod Borer & foliage caterpillars',
        category: 'कीट/इल्ली',
        categoryColor: 'bg-rose-950 border-rose-700/60 text-rose-300',
        recommendedMedicine: 'कोराजन (Coragen 18.5% SC) अथवा प्रोक्लेम',
        chemicalFormula: 'Chlorantraniliprole 18.5% SC / Emamectin Benzoate',
        dosageHi: 'कोराजन 60 मिली प्रति एकड़ (6 मिली प्रति 15 लीटर पंप)',
        dosageEn: '60 ml per acre in 150-200L water',
        waterRatio: '150-200 लीटर पानी प्रति एकड़',
        timingHi: '50% फूल आने और शुरुआती फलियां बनते समय शाम के समय छिड़काव करें।',
        timingEn: 'Apply at 50% flowering and early pod formation in calm evening.',
        cautionHi: '21 से 25 दिनों तक सुरक्षा देता है। निर्धारित मात्रा 60 मिली ही डालें।',
        cautionEn: 'Provides 21-25 days residual control. Do not overdose.',
        matchedProductId: 'prod-1',
      },
      {
        problemHi: 'उकठा रोग (Wilt), जड़ सड़न व फफूंद संक्रमण',
        problemEn: 'Wilt, collar rot and seed-borne fungal disease',
        category: 'फफूंद/रोग',
        categoryColor: 'bg-violet-950 border-violet-700/60 text-violet-300',
        recommendedMedicine: 'साफ फंगीसाइड (Saaf - Carbendazim 12% + Mancozeb 63% WP)',
        chemicalFormula: 'Carbendazim 12% + Mancozeb 63% WP',
        dosageHi: '2.5 ग्राम प्रति किलो बीज (बीजोपचार) या 2 ग्राम प्रति लीटर पानी',
        dosageEn: '2.5 g per kg seed dressing or 2 g/L water foliar',
        waterRatio: '150 लीटर पानी प्रति एकड़ (फोलियर स्प्रे हेतु)',
        timingHi: 'बुवाई से पहले बीजोपचार करें या खेत में लक्षण दिखने पर जड़ों के पास ड्रेन्चिंग करें।',
        timingEn: 'Treat seeds prior to sowing or root drenching at early wilt onset.',
        cautionHi: 'बीजोपचार के बाद छाया में सुखाकर ही बुवाई करें।',
        cautionEn: 'Dry treated seeds in shade before sowing.',
        matchedProductId: 'prod-2',
      },
    ],
  },
  {
    id: 'soybean',
    nameHi: 'सोयाबीन (Soybean)',
    nameEn: 'Soybean',
    emoji: '🌿',
    badgeColor: 'from-teal-500/20 to-emerald-600/10 border-teal-500/40 text-teal-300',
    problems: [
      {
        problemHi: 'संकरी पत्ती वाले घास कुल के खरपतवार (दूब, सांवा, मौथा)',
        problemEn: 'Narrow-leaf grassy weeds (Echinochloa, Cynodon, Cyperus)',
        category: 'खरपतवार',
        categoryColor: 'bg-cyan-950 border-cyan-700/60 text-cyan-300',
        recommendedMedicine: 'टारगा सुपर (Targa Super - Quizalofop Ethyl 5% EC)',
        chemicalFormula: 'Quizalofop Ethyl 5% EC Selective Herbicide',
        dosageHi: '250 से 300 मिली प्रति एकड़ (25 मिली प्रति 15 लीटर पंप)',
        dosageEn: '250-300 ml per acre in 150L clean water',
        waterRatio: '150 लीटर पानी प्रति एकड़',
        timingHi: 'बोवनी के 15-20 दिनों के भीतर जब खरपतवार 2 से 4 पत्ती की अवस्था में हों और जमीन में नमी हो।',
        timingEn: 'Apply 15-20 days after sowing with sufficient soil moisture.',
        cautionHi: 'मक्का, ज्वार या बाजरे की फसल पर कभी न छिड़कें। यह संकरी पत्ती को पूरी तरह सुखा देता है।',
        cautionEn: 'Never apply on cereal crops like maize or sorghum.',
        matchedProductId: 'prod-6',
      },
      {
        problemHi: 'गर्डल बीटल (चक्र भृंग) व तना छेदक इल्ली',
        problemEn: 'Girdle beetle and stem-boring caterpillars',
        category: 'कीट/इल्ली',
        categoryColor: 'bg-rose-950 border-rose-700/60 text-rose-300',
        recommendedMedicine: 'कोराजन (Coragen 18.5% SC)',
        chemicalFormula: 'Chlorantraniliprole 18.5% SC',
        dosageHi: '60 मिली प्रति एकड़ (150 लीटर पानी में)',
        dosageEn: '60 ml per acre in 150L water',
        waterRatio: '150 लीटर पानी प्रति एकड़',
        timingHi: 'तने पर छल्ला कटाई दिखने पर या शुरुआती कीट प्रकोप पर छिड़कें।',
        timingEn: 'Spray upon observing ring cuts on stems.',
        cautionHi: 'लगातार 20-25 दिन तक सुरक्षा चक्र बनाए रखता है।',
        cautionEn: 'Long residual defense against stem borers.',
        matchedProductId: 'prod-1',
      },
      {
        problemHi: 'हरी इल्ली, तंबाकू इल्ली व सेमीलूपर सुंडी',
        problemEn: 'Green semilooper & Spodoptera caterpillars',
        category: 'कीट/इल्ली',
        categoryColor: 'bg-rose-950 border-rose-700/60 text-rose-300',
        recommendedMedicine: 'प्रोक्लेम (Proclaim - Emamectin Benzoate 5% SG)',
        chemicalFormula: 'Emamectin Benzoate 5% SG',
        dosageHi: '80 से 100 ग्राम प्रति एकड़ (8-10 ग्राम प्रति 15 लीटर पंप)',
        dosageEn: '80-100 g per acre in 150L water',
        waterRatio: '150-200 लीटर पानी प्रति एकड़',
        timingHi: 'शाम के समय जब इल्लियां सक्रिय हों तब छिड़काव करें।',
        timingEn: 'Spray during calm evening hours with thorough leaf coverage.',
        cautionHi: 'यह पत्ती के आर-पार जाकर नीचे छिपी इल्लियों को भी समाप्त करता है।',
        cautionEn: 'Strong translaminar activity against hidden caterpillars.',
        matchedProductId: 'prod-3',
      },
    ],
  },
  {
    id: 'maize',
    nameHi: 'मक्का (Maize)',
    nameEn: 'Maize',
    emoji: '🌽',
    badgeColor: 'from-yellow-500/20 to-amber-600/10 border-yellow-500/40 text-yellow-300',
    problems: [
      {
        problemHi: 'फॉल आर्मीवर्म सुंडी (Fall Armyworm - पत्तियां छलनी करना)',
        problemEn: 'Fall Armyworm (Spodoptera frugiperda)',
        category: 'कीट/इल्ली',
        categoryColor: 'bg-rose-950 border-rose-700/60 text-rose-300',
        recommendedMedicine: 'कोराजन (Coragen 18.5% SC)',
        chemicalFormula: 'Chlorantraniliprole 18.5% SC',
        dosageHi: '60 मिली प्रति एकड़ (6 मिली प्रति 15 लीटर पंप)',
        dosageEn: '60 ml per acre directed into whorls',
        waterRatio: '150-200 लीटर पानी प्रति एकड़',
        timingHi: 'मक्का की गोभ (Whorl) में सीधे दवा पहुंचे इस प्रकार नोजल केंद्रित करके छिड़कें।',
        timingEn: 'Direct spray nozzle right into the maize whorls.',
        cautionHi: 'सुबह या शाम के समय छिड़काव सर्वोत्तम होता है।',
        cautionEn: 'Apply in morning or evening for best absorption.',
        matchedProductId: 'prod-1',
      },
    ],
  },
  {
    id: 'vegetables',
    nameHi: 'सब्जियां (टमाटर / मिर्च / प्याज)',
    nameEn: 'Vegetables',
    emoji: '🥦',
    badgeColor: 'from-rose-500/20 to-red-600/10 border-rose-500/40 text-rose-300',
    problems: [
      {
        problemHi: 'रसचूसक कीट (थ्रिप्स, माहू, हरा मच्छर, सफेद मक्खी)',
        problemEn: 'Sucking pests (Thrips, Aphids, Jassids, Whitefly)',
        category: 'कीट/इल्ली',
        categoryColor: 'bg-rose-950 border-rose-700/60 text-rose-300',
        recommendedMedicine: 'कॉनफिडोर (Confidor - Imidacloprid 17.8% SL)',
        chemicalFormula: 'Imidacloprid 17.8% SL Systemic Insecticide',
        dosageHi: '0.5 से 1 मिली प्रति 2 लीटर पानी (5 मिली प्रति 15 लीटर पंप)',
        dosageEn: '0.5-1 ml per 2 liters of water (5 ml per 15L pump)',
        waterRatio: '150 लीटर पानी प्रति एकड़',
        timingHi: 'पत्तियों की निचली सतह पर रसचूसक कीट दिखने पर छिड़काव करें।',
        timingEn: 'Spray thoroughly on lower surface of leaves at initial pest notice.',
        cautionHi: 'फूल खिलने के समय मधुमक्खी भ्रमण के दौरान छिड़काव से बचें।',
        cautionEn: 'Avoid spraying during active bee foraging hours.',
        matchedProductId: 'prod-7',
      },
      {
        problemHi: 'झुलसा रोग, पत्ती धब्बा व फल सड़न (Blight & Fruit Rot)',
        problemEn: 'Foliar blight, leaf spots and fruit rot',
        category: 'फफूंद/रोग',
        categoryColor: 'bg-violet-950 border-violet-700/60 text-violet-300',
        recommendedMedicine: 'नैटिवो (Nativo) अथवा साफ फंगीसाइड (Saaf)',
        chemicalFormula: 'Tebuconazole + Trifloxystrobin / Carbendazim + Mancozeb',
        dosageHi: 'नैटिवो 120 ग्राम प्रति एकड़ या साफ 2 ग्राम प्रति लीटर पानी',
        dosageEn: 'Nativo 120 g/acre or Saaf 2 g/liter water',
        waterRatio: '150-200 लीटर पानी प्रति एकड़',
        timingHi: 'लक्षण दिखते ही 10-12 दिन के अंतराल पर दोहराएं।',
        timingEn: 'Spray at disease onset, repeat after 10-12 days if required.',
        cautionHi: 'फल तुड़ाई से 7 दिन पूर्व दवा छिड़काव बंद रखें।',
        cautionEn: 'Observe 7 days pre-harvest interval.',
        matchedProductId: 'prod-4',
      },
    ],
  },
  {
    id: 'noncrop',
    nameHi: 'मेड़ व खाली जमीन (Non-Crop)',
    nameEn: 'Bunds & Fallow Land',
    emoji: '🌾',
    badgeColor: 'from-zinc-500/20 to-zinc-700/10 border-zinc-600/40 text-zinc-300',
    problems: [
      {
        problemHi: 'मेड़ व खेत के चारों ओर उगे सभी जिद्दी खरपतवार',
        problemEn: 'Clearing tough perennial weeds on bunds & fence lines',
        category: 'खरपतवार',
        categoryColor: 'bg-cyan-950 border-cyan-700/60 text-cyan-300',
        recommendedMedicine: 'राउण्डअप (Roundup - Glyphosate 41% SL)',
        chemicalFormula: 'Glyphosate 41% SL Non-Selective Herbicide',
        dosageHi: '10 से 12 मिली प्रति लीटर पानी (150 मिली प्रति 15 लीटर पंप)',
        dosageEn: '10-12 ml per liter water on non-crop areas',
        waterRatio: 'खरपतवार भीगने तक पर्याप्त पानी',
        timingHi: 'जब खरपतवार हरे व सक्रिय हों तब मेड़ों पर छिड़कें।',
        timingEn: 'Apply on actively growing green weeds on bunds.',
        cautionHi: 'सक्रिय हरी मुख्य फसल पर कभी न छिड़कें! यह सभी हरी वनस्पति को नष्ट कर देता है।',
        cautionEn: 'Strictly non-selective! Never spray on standing active crop plants.',
        matchedProductId: 'prod-9',
      },
    ],
  },
];

export const MedicineFinder: React.FC<MedicineFinderProps> = ({
  products,
  settings,
  language,
  onAddToCart,
  onQuickOrder,
  onViewDetails,
}) => {
  const isHindi = language === 'hi';
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number>(0);

  const currentCrop = CROP_GUIDES.find((c) => c.id === selectedCropId) || CROP_GUIDES[0];
  const currentProblem = currentCrop.problems[selectedProblemIndex] || currentCrop.problems[0];

  // Match real store product from catalogue
  const matchedStoreProduct = products.find((p) => p.id === currentProblem.matchedProductId);

  const cleanPhone = (settings.whatsapp || settings.officialPhone || '918120464749').replace(
    /[^0-9]/g,
    ''
  );

  const handleWhatsAppInquiry = () => {
    const text = `नमस्ते श्री श्याम कृषि सेवा केंद्र, मुझे "${currentCrop.nameHi}" फसल में "${currentProblem.problemHi}" के लिए अनुशंसित दवाई "${currentProblem.recommendedMedicine}" की उपलब्धता एवं आर्डर की जानकारी चाहिए।`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpenAiDoctor = () => {
    const el = document.getElementById('ai-help');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(
        new CustomEvent('ai-ask-product', {
          detail: {
            productName: currentProblem.recommendedMedicine,
            question: isHindi
              ? `मेरी ${currentCrop.nameHi} की फसल में ${currentProblem.problemHi} की समस्या है। क्या ${currentProblem.recommendedMedicine} डालना सही रहेगा? कृपया सही मात्रा व सावधानियां बताएं।`
              : `I have ${currentProblem.problemEn} in my ${currentCrop.nameEn} crop. Please confirm dosage and application precautions for ${currentProblem.recommendedMedicine}.`,
          },
        })
      );
    }
  };

  return (
    <section
      id="medicine-finder"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#180c05] via-[#241308] to-[#0a1811] border-t border-orange-500/40 relative overflow-hidden"
    >
      {/* Luxury ambient light spheres */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-orange-950/70 to-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-[0_0_25px_rgba(245,158,11,0.2)] mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isHindi ? '🩺 कौन सी दवाई डालना चाहिए? (Crop Problem & Medicine Guide)' : 'Which Medicine To Apply Guide'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Rozha_One',serif]">
            {isHindi ? 'फसल अनुसार सही दवाई एवं डोज गाइड' : 'Crop Disease & Recommended Medicine Finder'}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'अपनी फसल व रोग/खरपतवार चुनें — श्री श्याम कृषि सेवा केंद्र द्वारा प्रमाणित टेक्निकल दवाई, छिड़काव की सही मात्रा एवं पानी का अनुपात तुरंत जानें।'
              : 'Select your crop and infestation. Instantly find the exact certified medicine, dosage per acre, and application timing.'}
          </p>
        </div>

        {/* STEP 1: Crop Selector Horizontal Rail */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-black text-[11px] flex items-center justify-center">1</span>
              <span>{isHindi ? 'अपनी फसल चुनें (Select Your Crop):' : 'Select Crop:'}</span>
            </span>
            <span className="text-[11px] text-zinc-400">
              {CROP_GUIDES.length} {isHindi ? 'फसलें उपलब्ध' : 'crops available'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {CROP_GUIDES.map((crop) => {
              const isSelected = selectedCropId === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => {
                    setSelectedCropId(crop.id);
                    setSelectedProblemIndex(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all shrink-0 cursor-pointer active:scale-95 ${
                    isSelected
                      ? `bg-gradient-to-r ${crop.badgeColor} border-white/40 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.03] ring-1 ring-white/30 text-white`
                      : 'bg-[#141724]/90 hover:bg-[#1a1f30] border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span className="text-base select-none">{crop.emoji}</span>
                  <span>{isHindi ? crop.nameHi : crop.nameEn}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2 & 3: Two-Column Diagnostic Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Problem List for Selected Crop */}
          <div className="lg:col-span-5 bg-[#121522] border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-zinc-950 font-black text-[11px] flex items-center justify-center">2</span>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {isHindi ? `संक्रमण / खरपतवार / रोग चुनें (${currentCrop.nameHi})` : 'Select Problem:'}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentCrop.problems.map((prob, idx) => {
                const isSelected = selectedProblemIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedProblemIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 group active:scale-98 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/70 via-zinc-900 to-amber-950/50 border-amber-500/60 shadow-[0_4px_20px_rgba(245,158,11,0.2)]'
                        : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${prob.categoryColor}`}>
                          {prob.category}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{isHindi ? 'चयनित' : 'Active'}</span>
                          </span>
                        )}
                      </div>
                      <div className={`text-xs sm:text-sm font-bold leading-snug transition-colors ${
                        isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                      }`}>
                        {isHindi ? prob.problemHi : prob.problemEn}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-400 line-clamp-1">
                        दवाई: <span className="text-amber-300 font-semibold">{prob.recommendedMedicine}</span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 mt-1 transition-transform shrink-0 ${
                      isSelected ? 'text-amber-400 translate-x-1' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Prescribed Medicine & Dosage Result Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#151928] via-[#121524] to-[#151a2a] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_15px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Top Badge Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'श्री श्याम कृषि सेवा केंद्र · आधिकारिक सिफारिश' : 'Official Store Recommendation'}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${currentProblem.categoryColor}`}>
                {currentProblem.category}
              </span>
            </div>

            {/* Prescribed Medicine Heading */}
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {isHindi ? '💊 अनुशंसित दवाई (Recommended Medicine):' : 'Prescribed Medicine:'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight font-['Rozha_One',serif]">
                {currentProblem.recommendedMedicine}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                तकनीकी नाम: {currentProblem.chemicalFormula}
              </p>
            </div>

            {/* 4 Detail Grid Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Dosage */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🧪</span>
                  <span>{isHindi ? 'छिड़काव मात्रा (Dosage)' : 'Dosage'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">
                  {isHindi ? currentProblem.dosageHi : currentProblem.dosageEn}
                </div>
              </div>

              {/* Card 2: Water Ratio */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
                  <span>💧</span>
                  <span>{isHindi ? 'पानी की मात्रा' : 'Water Ratio'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">
                  {currentProblem.waterRatio}
                </div>
              </div>

              {/* Card 3: Best Spray Timing */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 sm:col-span-2">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🚜</span>
                  <span>{isHindi ? 'छिड़काव का सही समय एवं विधि' : 'Application Stage & Method'}</span>
                </div>
                <div className="text-xs sm:text-sm text-zinc-200 mt-1 leading-relaxed">
                  {isHindi ? currentProblem.timingHi : currentProblem.timingEn}
                </div>
              </div>

              {/* Card 4: Critical Precautions */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 sm:col-span-2 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <span className="font-bold">{isHindi ? 'विशेष सावधानी: ' : 'Important Caution: '}</span>
                  {isHindi ? currentProblem.cautionHi : currentProblem.cautionEn}
                </div>
              </div>
            </div>

            {/* Matched Product Stock & Action Strip */}
            {matchedStoreProduct && (
              <div className="mt-5 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-zinc-400">
                    {isHindi ? 'दुकान में उपलब्ध पैक:' : 'Store Pack Size:'}{' '}
                    <span className="font-bold text-white">{matchedStoreProduct.packSize}</span>
                  </div>
                  <div className="text-xl font-extrabold text-white tabular-nums flex items-baseline gap-2">
                    <span>₹{matchedStoreProduct.price}</span>
                    {matchedStoreProduct.mrp && matchedStoreProduct.mrp > matchedStoreProduct.price && (
                      <span className="text-xs text-zinc-500 line-through">₹{matchedStoreProduct.mrp}</span>
                    )}
                    <span className="text-[11px] font-bold text-emerald-400">
                      {matchedStoreProduct.inStock ? (isHindi ? '✓ स्टॉक उपलब्ध' : 'In Stock') : (isHindi ? 'स्टॉक समाप्त' : 'Out of Stock')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart(matchedStoreProduct)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isHindi ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
                    </button>
                  )}

                  {onQuickOrder && (
                    <button
                      onClick={() => onQuickOrder(matchedStoreProduct)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-zinc-950 fill-zinc-950" />
                      <span>{isHindi ? '⚡ तुरंत खरीदें (UPI)' : '⚡ Quick Order'}</span>
                    </button>
                  )}

                  {onViewDetails && (
                    <button
                      onClick={() => onViewDetails(matchedStoreProduct)}
                      className="px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer"
                      title={isHindi ? 'पूर्ण विवरण देखें' : 'View Full Details'}
                    >
                      <span>विवरण</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Direct Expert Advice & AI Consultation Row */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleOpenAiDoctor}
                className="flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer group"
              >
                <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>{isHindi ? '✨ AI फसल डॉक्टर से इस दवाई के बारे में पूछें' : '✨ Ask AI Doctor about this medicine'}</span>
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Enquiry'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
