import React, { useState, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  HelpCircle,
  Camera,
  Image as ImageIcon,
  X,
  ShoppingCart,
  Zap,
  Download,
  CheckCircle2,
  Share2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Language, StoreSettings, Product, AIDiagnosisResponse, CropPrescription } from '../types';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string;
  prescription?: CropPrescription | null;
  recommendedProduct?: Product | null;
  timestamp: string;
}

interface AiHelpCenterProps {
  language: Language;
  settings: StoreSettings;
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
}

export const AiHelpCenter: React.FC<AiHelpCenterProps> = ({
  language,
  settings,
  products = [],
  onAddToCart,
  onQuickOrder,
}) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Realistic Sample Test Presets for Instant User Testing
  const samplePresets = [
    {
      title: isHindi ? '🌾 गेहूं: चौड़ी पत्ती खरपतवार (2,4-D)' : '🌾 Wheat: Broadleaf Weeds (2,4-D)',
      question: isHindi
        ? 'गेहूं की फसल में बथुआ और चौड़ी पत्ती के खरपतवार हैं। 2,4-D कब और कैसे डालना चाहिए?'
        : 'Broadleaf weeds like Bathua in wheat. When and how to spray 2,4-D?',
      // Sample leaf icon placeholder for visual preview
      sampleImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231a2e1d"/><circle cx="150" cy="100" r="70" fill="%232d5a32"/><path d="M120 140 Q150 40 180 140" stroke="%2384cc16" stroke-width="10" fill="none"/><text x="150" y="175" fill="%23ecfccb" font-size="14" font-weight="bold" text-anchor="middle">Wheat Broadleaf Weeds</text></svg>',
    },
    {
      title: isHindi ? '🌾 गेहूं: पीला रतुआ (नैटिवो)' : '🌾 Wheat: Yellow Rust (Nativo)',
      question: isHindi
        ? 'गेहूं की पत्तियों पर हल्दी जैसा पीला चूर्ण दिख रहा है। क्या यह पीला रतुआ है? कौन सी दवाई डालें?'
        : 'Yellow powder on wheat leaves. Is it yellow rust and what medicine to apply?',
      sampleImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%232c2411"/><circle cx="150" cy="100" r="70" fill="%235a441b"/><path d="M110 130 L190 70 M120 150 L180 90" stroke="%23eab308" stroke-width="8" stroke-linecap="round"/><text x="150" y="175" fill="%23fef08a" font-size="14" font-weight="bold" text-anchor="middle">Yellow Rust Infection</text></svg>',
    },
    {
      title: isHindi ? '🌱 चना: घाटी इल्ली (कोराजन)' : '🌱 Gram: Pod Borer (Coragen)',
      question: isHindi
        ? 'चने की फसल में फलियों में छेद करने वाली घाटी इल्ली लग रही है। उचित कीटनाशक बताएं।'
        : 'Pod borer caterpillars infesting gram pods. Recommend effective insecticide.',
      sampleImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231a2624"/><circle cx="150" cy="100" r="70" fill="%2322473f"/><path d="M110 100 Q150 70 190 100 Q150 130 110 100" fill="%2310b981"/><text x="150" y="175" fill="%23a7f3d0" font-size="14" font-weight="bold" text-anchor="middle">Gram Pod Borer</text></svg>',
    },
    {
      title: isHindi ? '🌿 सोयाबीन: खरपतवार (टारगा सुपर)' : '🌿 Soybean: Weeds (Targa Super)',
      question: isHindi
        ? 'सोयाबीन में संकरी पत्ती के खरपतवार (दूब, सांवा) के लिए कौन सा खरपतवारनाशक डालें?'
        : 'Grassy weeds in soybean field. Which selective herbicide to apply?',
      sampleImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2319222a"/><circle cx="150" cy="100" r="70" fill="%23233847"/><path d="M150 150 L150 50 M120 100 L180 70" stroke="%2338bdf8" stroke-width="6" stroke-linecap="round"/><text x="150" y="175" fill="%23bae6fd" font-size="14" font-weight="bold" text-anchor="middle">Soybean Weed Control</text></svg>',
    },
  ];

  const initialGreeting: Message = {
    id: 'msg-0',
    sender: 'ai',
    text: isHindi
      ? `🙏 नमस्ते किसान भाई! मैं **श्री श्याम कृषि सेवा केंद्र** का आधिकारिक AI कृषि विशेषज्ञ एवं फसल डॉक्टर हूँ। 🌾\n\n📸 **फसल की पत्ती या रोग की फोटो भेजें:** आप सीधे खेत से अपने गेहूं, चना, सोयाबीन आदि फसल की फोटो अपलोड कर सकते हैं। हमारा AI तुरंत बीमारी / खरपतवार (जैसे गेहूं में चौड़ी पत्ती, पीला रतुआ आदि) की पहचान करके **दवाई की पर्ची (Prescription)** और **2,4-D / नैटिवो / कोराजन** की सही मात्रा बताएगा! 🩺\n\n💬 नीचे दिए गए बटन से फोटो चुनें या सीधे सवाल पूछें:`
      : `🙏 Welcome Farmer Friend! I am the official AI Agronomist & Crop Doctor for **Shree Shyam Krishi Seva Kendra**. 🌾\n\n📸 **Send a Crop/Leaf Photo:** Upload a photo directly from your field. Our AI will instantly identify infections, weeds (like broadleaf weeds in wheat, yellow rust, caterpillars), provide an official digital Prescription Card, and recommend exact dosages like 2,4-D, Nativo, or Coragen! 🩺`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for product question trigger from product modal
  React.useEffect(() => {
    const handleAiAskProduct = (e: any) => {
      if (e?.detail?.question) {
        setInputQuestion(e.detail.question);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      }
    };
    window.addEventListener('ai-ask-product', handleAiAskProduct);
    return () => window.removeEventListener('ai-ask-product', handleAiAskProduct);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // Handle Photo selection from camera / file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(isHindi ? 'कृपया 10MB से छोटी फोटो चुनें।' : 'Please choose an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Generate and Download Visual Prescription Image Graphic onto Canvas
  const handleDownloadPrescriptionImage = (prescription: CropPrescription, messageText: string) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1000);

      // Gold border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 760, 960);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, 740, 940);

      // Header Banner
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(40, 40, 720, 110);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(settings.shopName || 'श्री श्याम कृषि सेवा केंद्र', 400, 85);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '16px sans-serif';
      ctx.fillText('🩺 आधिकारिक डिजिटल फसल सुरक्षा एवं दवाई पर्ची (Digital Agronomy Prescription)', 400, 120);

      // Doctor / Shop Details
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`स्वामी: ${settings.ownerName || 'कार्तिक गावंडे'}`, 60, 185);
      ctx.fillText(`📞 हेल्पलाइन: ${settings.officialPhone || '+91 81204 64749'}`, 480, 185);
      ctx.fillText(`दिनांक: ${new Date().toLocaleDateString('hi-IN')}`, 60, 215);
      ctx.fillText(`लाइसेंस: ${settings.licenseNumber || 'प्रमाणित कीटनाशक विक्रेता'}`, 480, 215);

      // Divider line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 235);
      ctx.lineTo(740, 235);
      ctx.stroke();

      // Card Section 1: Crop & Problem
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(60, 255, 680, 100);

      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🌾 फसल (Crop):', 80, 290);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(prescription.cropName, 220, 290);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🦠 संक्रमण / रोग:', 80, 330);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${prescription.problem} (${prescription.severity} स्तर)`, 240, 330);

      // Card Section 2: Recommended Medicine (Highlighted)
      ctx.fillStyle = '#065f46';
      ctx.fillRect(60, 375, 680, 130);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('💊 अनुशंसित दवाई (Recommended Medicine):', 80, 415);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(prescription.recommendedMedicine, 80, 455);

      if (prescription.chemicalFormula) {
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText(`टेक्निकल फार्मूला: ${prescription.chemicalFormula}`, 80, 485);
      }

      // Card Section 3: Dosage & Water
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(60, 525, 680, 150);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🧪 छिड़काव मात्रा (Dose):', 80, 560);
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px sans-serif';
      ctx.fillText(prescription.dosage, 290, 560);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('💧 पानी की मात्रा (Water):', 80, 600);
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px sans-serif';
      ctx.fillText(prescription.waterRatio, 290, 600);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🚜 छिड़काव विधि:', 80, 640);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText(prescription.sprayInstructions || 'फ्लैट-फैन नोजल से एकसमान स्प्रे करें।', 290, 640);

      // Card Section 4: Caution & Safety
      ctx.fillStyle = '#451a03';
      ctx.fillRect(60, 695, 680, 100);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText('⚠️ विशेष कृषि सावधानी:', 80, 730);

      ctx.fillStyle = '#fef3c7';
      ctx.font = '15px sans-serif';
      ctx.fillText(prescription.caution || 'उत्पाद के डिब्बे पर दिए गए आधिकारिक लेबल निर्देशों का पालन करें।', 80, 765);

      // Footer Seal & Advice
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⭐ 100% असली व प्रमाणित उत्पाद की गारंटी · श्री श्याम कृषि सेवा केंद्र ⭐', 400, 835);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('दुकान का पता: ' + (settings.address || 'मुख्य बाजार'), 400, 870);
      ctx.fillText('कॉल / व्हाट्सएप सहायता: ' + (settings.officialPhone || '+91 81204 64749'), 400, 895);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('यह पर्ची श्री श्याम AI फसल डॉक्टर द्वारा जारी की गई है।', 400, 935);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ShreeShyam_Fasal_Parchi_${prescription.cropName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error('Error generating canvas prescription:', e);
      alert(isHindi ? 'पर्ची डाउनलोड करने में त्रुटि आई।' : 'Failed to download prescription.');
    }
  };

  const handleSend = async (customText?: string, customImage?: string) => {
    const textToSend = (customText !== undefined ? customText : inputQuestion).trim();
    const imageToSend = customImage !== undefined ? customImage : selectedImage;

    if ((!textToSend && !imageToSend) || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend || (isHindi ? '🌾 फसल की फोटो की जांच करें' : '🌾 Diagnose this crop photo'),
      image: imageToSend || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setSelectedImage(null);
    setLoading(true);
    scrollToBottom();

    try {
      const response: AIDiagnosisResponse = await api.askAI(textToSend, language, imageToSend || undefined);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        prescription: response.prescription || null,
        recommendedProduct: response.recommendedProduct || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: isHindi
          ? '🌾 **श्री श्याम कृषि सेवा केंद्र — फसल डॉक्टर परामर्श:**\n\n• 🩺 **तकनीकी सलाह:** आपके सवाल/फोटो की जांच की गई है। सटीक रोग व खरपतवार की रोकथाम के लिए प्रमाणित दवाइयों (जैसे 2,4-D अमाइन, नैटिवो या कोराजन) का सही समय पर छिड़काव करें।\n• 📞 **सीधा संपर्क:** अधिक जानकारी अथवा दवाई मंगवाने के लिए सीधे स्वामी **कार्तिक गावंडे जी** से **+91 81204 64749** पर संपर्क करें।'
          : '🌾 **Shree Shyam Krishi Seva Kendra — Crop Advisory:**\n\n• 🩺 For instant field advice and authentic crop medicine dispatch, call store owner **Kartick Gawande** at **+91 81204 64749**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleShareWhatsApp = (msg: Message) => {
    const text = `🌾 *श्री श्याम कृषि सेवा केंद्र - फसल डॉक्टर परामर्श*\n\n${msg.text}\n\n${
      msg.prescription
        ? `💊 *अनुशंसित दवाई:* ${msg.prescription.recommendedMedicine}\n🧪 *डोज:* ${msg.prescription.dosage}\n💧 *पानी:* ${msg.prescription.waterRatio}\n\n`
        : ''
    }📞 संपर्क: ${settings.officialPhone || '+91 81204 64749'}`;
    const cleanPhone = (settings.whatsapp || settings.officialPhone || '918120464749').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="ai-help" className="py-16 md:py-24 bg-gradient-to-b from-[#07131e] via-[#091b2c] to-[#061814] border-t border-sky-500/30 relative overflow-hidden">
      {/* Luminous Sky Blue & Electric Cyan ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-sky-500/15 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-500/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-sky-200 bg-sky-950/80 border border-sky-400/50 rounded-full mb-3 shadow-[0_0_25px_rgba(14,165,233,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span>{isHindi ? '🤖 24/7 AI फसल डॉक्टर (Luminous AI Agronomist)' : '🤖 24/7 AI Crop Doctor & Agronomist'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Rozha_One',serif]">
            {isHindi ? 'फसल की फोटो भेजें और दवाई पर्ची प्राप्त करें' : 'Snap Crop Photo & Get Medicine Prescription'}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? '📸 गेहूं, चना, सोयाबीन आदि की पत्ती या रोग की फोटो अपलोड करें। हमारा AI तुरंत बीमारी / खरपतवार (जैसे 2,4-D, नैटिवो, कोराजन) की पहचान कर दवाई की पर्ची बनाकर देगा!'
              : '📸 Upload leaf or weed photos. Our AI agronomist identifies infections, issues official prescription cards, and recommends exact dosages!'}
          </p>
        </div>

        {/* Instant Test Presets Bar */}
        <div className="mb-6 bg-[#131620]/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindi ? '⚡ 1-क्लिक टेस्ट (सीधे चलाकर देखें):' : '⚡ 1-Click Diagnostic Test:'}</span>
            </span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              {isHindi ? 'क्लिक करते ही AI फोटो व 2,4-D दवाई पर्ची बनाएगा' : 'Generates instant AI diagnosis & prescription'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset.question, preset.sampleImage)}
                disabled={loading}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-emerald-500/50 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-600/40 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform text-sm">
                  {idx === 0 ? '🌾' : idx === 1 ? '🍂' : idx === 2 ? '🐛' : '🌿'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-300 truncate">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {idx === 0 ? '2,4-D खरपतवार' : idx === 1 ? 'पीला रतुआ नैटिवो' : idx === 2 ? 'कोराजन इल्ली' : 'टारगा सुपर'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Luxury Chat Container */}
        <div className="rounded-3xl bg-[#13151f] border border-zinc-700/80 shadow-[0_10px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[650px] sm:h-[720px] transition-all">
          {/* Top Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#171a26] via-[#151722] to-[#171a26] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/40 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#13151f] animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{isHindi ? 'श्री श्याम AI फसल विशेषज्ञ' : 'Shree Shyam AI Agronomist'}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800/80 rounded-full">
                    {isHindi ? 'लाइव डॉक्टर' : 'Live'}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>स्वामी: कार्तिक गावंडे · 100% प्रमाणित दवाइयाँ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${(settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-200 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{isHindi ? 'कार्तिक जी से बात करें' : 'Call Ag Officer'}</span>
              </a>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#0f1118]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 sm:gap-4 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-900 to-zinc-900 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0 mt-1 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-br-none border border-emerald-500/30'
                      : 'bg-[#161824] border border-zinc-800 text-zinc-100 rounded-tl-none'
                  }`}
                >
                  {/* User Uploaded Image Preview in Chat */}
                  {m.image && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-white/20 max-w-[280px] bg-black/40">
                      <img src={m.image} alt="Crop sample" className="w-full h-auto object-cover max-h-48" />
                      <div className="px-2.5 py-1 text-[11px] bg-black/60 text-zinc-200 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-emerald-400" />
                        <span>{isHindi ? 'अपलोड की गई फसल फोटो' : 'Uploaded crop photo'}</span>
                      </div>
                    </div>
                  )}

                  {/* Main Message Text with Clean Formatting */}
                  <div className="whitespace-pre-line space-y-1 font-sans">{m.text}</div>

                  {/* AI Generated Prescription Card (दवाई की पर्ची) */}
                  {m.prescription && (
                    <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#18202d] to-[#121620] border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 border-b border-l border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                        🩺 Digital Prescription
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-300">
                            {isHindi ? 'श्री श्याम डिजिटल फसल पर्ची' : 'Shree Shyam Digital Crop RX'}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {isHindi ? 'लाइसेंस प्राप्त कीटनाशक पर्ची' : 'Verified Agronomy Advice'}
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 mb-3">
                        <div>
                          <span className="text-zinc-400">{isHindi ? '🌾 फसल:' : 'Crop:'}</span>{' '}
                          <span className="font-semibold text-white">{m.prescription.cropName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">{isHindi ? '🦠 रोग/संक्रमण:' : 'Problem:'}</span>{' '}
                          <span className="font-semibold text-amber-300">{m.prescription.problem}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">{isHindi ? '🧪 छिड़काव मात्रा:' : 'Dosage:'}</span>{' '}
                          <span className="font-semibold text-emerald-300">{m.prescription.dosage}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">{isHindi ? '💧 पानी:' : 'Water:'}</span>{' '}
                          <span className="font-semibold text-sky-300">{m.prescription.waterRatio}</span>
                        </div>
                      </div>

                      {/* Highlighted Recommended Medicine Banner */}
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 mb-3">
                        <div className="text-[11px] text-emerald-400 font-semibold mb-0.5">
                          {isHindi ? '💊 मुख्य अनुशंसित दवाई (Recommended Medicine):' : '💊 Recommended Medicine:'}
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-white">
                          {m.prescription.recommendedMedicine}
                        </div>
                        {m.prescription.chemicalFormula && (
                          <div className="text-[11px] text-emerald-300/80 mt-0.5">
                            {m.prescription.chemicalFormula}
                          </div>
                        )}
                        {m.prescription.sprayInstructions && (
                          <div className="text-xs text-zinc-300 mt-1.5 pt-1.5 border-t border-emerald-800/60">
                            🚜 {m.prescription.sprayInstructions}
                          </div>
                        )}
                      </div>

                      {/* Matched Store Product with 1-Click Cart & UPI Buy */}
                      {m.recommendedProduct && (
                        <div className="p-3 bg-zinc-900/90 rounded-xl border border-emerald-600/50 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] text-emerald-400 font-semibold uppercase">
                              {isHindi ? '✓ दुकान के स्टॉक में उपलब्ध' : '✓ In Stock at Store'}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-white">
                              {m.recommendedProduct.name} ({m.recommendedProduct.packSize})
                            </div>
                            <div className="text-xs text-emerald-400 font-extrabold">
                              ₹{m.recommendedProduct.price}{' '}
                              {m.recommendedProduct.mrp && (
                                <span className="text-zinc-500 line-through text-[10px] ml-1">
                                  ₹{m.recommendedProduct.mrp}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {onAddToCart && (
                              <button
                                onClick={() => onAddToCart(m.recommendedProduct!)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>{isHindi ? 'कार्ट में डालें' : 'Add to Cart'}</span>
                              </button>
                            )}

                            {onQuickOrder && (
                              <button
                                onClick={() => onQuickOrder(m.recommendedProduct!)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>{isHindi ? 'तुरंत खरीदें' : 'Buy Now'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Download & Share Prescription Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800">
                        <button
                          onClick={() => handleDownloadPrescriptionImage(m.prescription!, m.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isHindi ? '📥 पर्ची डाउनलोड करें (PNG कार्ड)' : 'Download RX Card (PNG)'}</span>
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(m)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'व्हाट्सएप पर भेजें' : 'Share on WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      m.sender === 'user' ? 'text-emerald-200' : 'text-zinc-500'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.sender === 'ai' && (
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(m.text);
                          setCopiedId(m.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === m.id ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {isHindi ? 'कॉपी हुआ' : 'Copied'}
                          </span>
                        ) : (
                          <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#161824] border border-zinc-800 rounded-2xl p-4 text-xs sm:text-sm text-zinc-300 flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>
                    {isHindi
                      ? '🌾 फसल व फोटो का विश्लेषण जारी है, 2,4-D / दवाई की पर्ची तैयार हो रही है...'
                      : 'Analyzing crop photo and preparing prescription card...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload Preview Tray if User Selected a File */}
          {selectedImage && (
            <div className="p-3 bg-[#171a26] border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/60 shrink-0 bg-black">
                  <img src={selectedImage} alt="Selected crop" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isHindi ? 'फसल फोटो संलग्न की गई' : 'Crop photo attached'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {isHindi ? 'भेजें बटन दबाकर तुरंत रोग व दवाई जानें' : 'Press Send to get diagnosis'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-[#141622] border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Photo Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 sm:px-3.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md active:scale-95"
                title={isHindi ? 'फोटो खींचें या अपलोड करें' : 'Attach photo'}
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{isHindi ? 'फोटो भेजें' : 'Photo'}</span>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder={
                  selectedImage
                    ? isHindi
                      ? 'इस फोटो के बारे में कुछ और पूछना चाहते हैं? (या सीधे भेजें)...'
                      : 'Add question about this photo (or just click Send)...'
                    : isHindi
                    ? 'फसल, गेहूं खरपतवार, रोग या दवाई पूछें (उदा. गेहूं में 2,4-D कब डालें)...'
                    : 'Ask about crop care, wheat weeds, 2,4-D, Nativo dosage...'
                }
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-white bg-zinc-900/90 border border-zinc-700/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-500"
              />

              <button
                type="submit"
                disabled={loading || (!inputQuestion.trim() && !selectedImage)}
                className="p-2.5 sm:px-4 text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-xl transition-all shadow-md shrink-0 cursor-pointer active:scale-95 font-semibold text-xs flex items-center gap-1.5"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{isHindi ? 'पूछें' : 'Send'}</span>
              </button>
            </form>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isHindi
                    ? '⚠️ रासायनिक दवाई की मात्रा हेतु उत्पाद डिब्बे पर दिए गए आधिकारिक लेबल का पालन करें।'
                    : '⚠️ Always follow manufacturer label instructions for chemical dosages.'}
                </span>
              </div>
              <span className="hidden sm:inline text-zinc-500 font-medium">
                कार्तिक गावंडे · +91 81204 64749
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
