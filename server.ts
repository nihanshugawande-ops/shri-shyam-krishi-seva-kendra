import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initialData } from './src/data/initialData';
import { AppData, Product, Category, Poster, Article, StoreSettings, OrderRequest } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state initialized from file or default
let appData: AppData = initialData;

if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Merge to preserve newly defined fields and updated official phone number
    appData = {
      ...initialData,
      ...parsed,
      settings: {
        ...initialData.settings,
        ...parsed.settings,
        officialPhone: '+91 81204 64749',
        whatsapp: '+91 81204 64749',
        businessHours: 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)',
        businessHoursEn: '07:00 AM to 08:00 PM (Open All Days)',
        licenseNumber: parsed.settings?.licenseNumber || initialData.settings.licenseNumber,
        developerName: 'Nexa',
        developerEmail: 'nexa.com.in21@gmail.com',
      },
      orders: parsed.orders || [],
    };
    if (appData.products && Array.isArray(appData.products)) {
      const seenIds = new Set<string>();
      appData.products = appData.products.filter((p) => {
        if (!p || !p.id || seenIds.has(p.id)) return false;
        seenIds.add(p.id);
        return true;
      });
    }
    saveDataToFile();
  } catch (err) {
    console.warn('Failed to parse store.json, initializing from defaults', err);
    saveDataToFile();
  }
} else {
  saveDataToFile();
}

function saveDataToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data to file:', err);
  }
}

// Initialize server-side Gemini AI client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();

  // Parse JSON payloads with generous limit for image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Endpoints
  // 1. Get all store data
  app.get('/api/data', (_req: Request, res: Response) => {
    res.json(appData);
  });

  // 2. Auth login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;
    const validPasswords = ['kartik123', 'admin', 'shree123', 'shyam123', '8120464749'];
    if (validPasswords.includes(password)) {
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      res.json({ success: true, token, user: { name: 'कार्तिक गावंडे (Kartick Gawande)', role: 'admin' } });
    } else {
      res.status(401).json({ success: false, error: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।' });
    }
  });

  // 3. Products CRUD
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    appData.products.unshift(newProduct);
    saveDataToFile();
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = appData.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'उत्पाद नहीं मिला' });
    }
    appData.products[index] = {
      ...appData.products[index],
      ...req.body,
      id,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    saveDataToFile();
    res.json(appData.products[index]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    appData.products = appData.products.filter((p) => p.id !== id);
    saveDataToFile();
    res.json({ success: true, id });
  });

  // 4. Categories CRUD
  app.post('/api/categories', (req: Request, res: Response) => {
    const newCategory: Category = {
      ...req.body,
      id: req.body.id || `cat-${Date.now()}`,
      order: appData.categories.length + 1
    };
    appData.categories.push(newCategory);
    saveDataToFile();
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = appData.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'श्रेणी नहीं मिली' });
    }
    appData.categories[index] = { ...appData.categories[index], ...req.body, id };
    saveDataToFile();
    res.json(appData.categories[index]);
  });

  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    appData.categories = appData.categories.filter((c) => c.id !== id);
    saveDataToFile();
    res.json({ success: true, id });
  });

  // 5. Posters CRUD
  app.post('/api/posters', (req: Request, res: Response) => {
    const newPoster: Poster = {
      ...req.body,
      id: req.body.id || `poster-${Date.now()}`,
      order: appData.posters.length + 1,
      active: req.body.active !== undefined ? req.body.active : true
    };
    appData.posters.push(newPoster);
    saveDataToFile();
    res.status(201).json(newPoster);
  });

  app.put('/api/posters/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = appData.posters.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'पोस्टर नहीं मिला' });
    }
    appData.posters[index] = { ...appData.posters[index], ...req.body, id };
    saveDataToFile();
    res.json(appData.posters[index]);
  });

  app.delete('/api/posters/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    appData.posters = appData.posters.filter((p) => p.id !== id);
    saveDataToFile();
    res.json({ success: true, id });
  });

  // 6. Articles CRUD
  app.post('/api/articles', (req: Request, res: Response) => {
    const newArticle: Article = {
      ...req.body,
      id: req.body.id || `art-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: req.body.author || 'कार्तिक गावंडे',
      published: req.body.published !== undefined ? req.body.published : true
    };
    appData.articles.unshift(newArticle);
    saveDataToFile();
    res.status(201).json(newArticle);
  });

  app.put('/api/articles/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = appData.articles.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'लेख नहीं मिला' });
    }
    appData.articles[index] = { ...appData.articles[index], ...req.body, id };
    saveDataToFile();
    res.json(appData.articles[index]);
  });

  app.delete('/api/articles/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    appData.articles = appData.articles.filter((a) => a.id !== id);
    saveDataToFile();
    res.json({ success: true, id });
  });

  // 7. Store Settings
  app.put('/api/settings', (req: Request, res: Response) => {
    appData.settings = { ...appData.settings, ...req.body };
    saveDataToFile();
    res.json(appData.settings);
  });

  // 8. Orders / Enquiries with UPI Payment
  app.post('/api/orders', (req: Request, res: Response) => {
    const newOrder: OrderRequest = {
      id: req.body.id || `ORD-${Date.now().toString().slice(-6)}`,
      customerName: req.body.customerName || req.body.farmerName || req.body.name || 'किसान भाई',
      phone: req.body.phone || req.body.farmerPhone || '',
      address: req.body.address || '',
      village: req.body.village || '',
      items: req.body.items || [],
      totalAmount: req.body.totalAmount || 0,
      paymentMethod: req.body.paymentMethod || 'cash',
      upiRefNumber: req.body.upiRefNumber || '',
      paymentStatus: req.body.paymentStatus || (req.body.paymentMethod === 'upi' ? 'paid' : 'pay_on_delivery'),
      message: req.body.message || '',
      date: new Date().toISOString(),
      status: 'pending',
    };
    if (!appData.orders) appData.orders = [];
    appData.orders.unshift(newOrder);
    saveDataToFile();
    res.status(201).json({ success: true, order: newOrder });
  });

  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json(appData.orders || []);
  });

  app.put('/api/orders/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    if (!appData.orders) appData.orders = [];
    const index = appData.orders.findIndex((o) => o.id === id);
    if (index === -1) return res.status(404).json({ error: 'ऑर्डर नहीं मिला' });
    appData.orders[index] = { ...appData.orders[index], ...req.body };
    saveDataToFile();
    res.json(appData.orders[index]);
  });

  app.delete('/api/orders/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    if (!appData.orders) appData.orders = [];
    appData.orders = appData.orders.filter((o) => o.id !== id);
    saveDataToFile();
    res.json({ success: true, id });
  });

  // 9. AI Agriculture Help Center Endpoint (Multimodal Crop Diagnosis & Prescription System)
  app.post('/api/ai/ask', async (req: Request, res: Response) => {
    const { question, language = 'hi', image } = req.body;
    const promptText = question && typeof question === 'string' && question.trim() 
      ? question.trim() 
      : (image ? 'कृपया इस पौधे / फसल की फोटो देखकर बताएं कि इसमें क्या रोग, कीट या खरपतवार का संक्रमण है और कौन सी दवाई, कितनी मात्रा में डालनी चाहिए।' : '');

    if (!promptText && !image) {
      return res.status(400).json({ error: 'सवाल या फसल की फोटो आवश्यक है / Question or crop image is required' });
    }

    const isEn = language === 'en';

    const systemInstruction = `You are the expert, trusted Agronomist & Chief Agricultural Advisor for "श्री श्याम कृषि सेवा केंद्र" (Shree Shyam Krishi Seva Kendra, Proprietor: Kartick Gawande / कार्तिक गावंडे, Phone: +91 81204 64749).
Your Mission:
1. Provide accurate, practical crop advisory, weed identification, pest control, disease diagnosis, and fertilizer management for Indian farmers.
2. Respond in polite, clear, supportive ${isEn ? 'English' : 'Hindi (देवनागरी)'} with relevant agricultural emojis (🌾, 🌿, 🚜, 🩺, 💊, 🧪, ⚠️, 📞).
3. If an image or crop is provided:
   - Identify the crop (e.g. गेहूं / Wheat, चना / Gram, सोयाबीन / Soybean, मक्का / Maize, टमाटर / Tomato, etc.)
   - Identify the exact problem / infection / weed / pest (e.g., चौड़ी पत्ती खरपतवार जैसे बथुआ/हिरनखुरी, पीला रतुआ / Yellow Rust, तना/फली छेदक इल्ली, ब्लाइट, उकठा, आदि)
   - Determine severity level (सामान्य / मध्यम / गंभीर)
   - Specify the recommended medicine with active chemical formulation:
     * If wheat broadleaf weeds (बथुआ, हिरनखुरी, खरपतवार) -> Recommend "2,4-D मुख्य खरपतवारनाशक (2,4-D Amine Salt 58% SL या 38% EC)"
     * If wheat yellow rust / foliar blight -> Recommend "नैटिवो (Nativo - Tebuconazole + Trifloxystrobin)" or "साफ (Saaf Fungicide)"
     * If caterpillars / pod borer in gram/soybean -> Recommend "कोराजन (Coragen)" or "प्रोक्लेम (Proclaim - Emamectin Benzoate)"
     * If narrow-leaf grassy weeds in soybean -> Recommend "टारगा सुपर (Targa Super - Quizalofop Ethyl)"
     * If sucking pests (thrips, aphids) -> Recommend "कॉनफिडोर (Confidor - Imidacloprid)"
     * If crop stress or growth boost -> Recommend "एम्बिशन बायोस्टिमुलेंट (Ambition)" or "NPK 19:19:19"
   - Specify exact dosage (e.g., 400-500 ml/acre or 25-30 ml per 15L spray pump), water requirement (150 L/acre), and nozzle recommendation (Flat-fan/Cut nozzle).
   - Include practical safety instructions and shop contact: "कार्तिक गावंडे (+91 81204 64749)".
4. ALWAYS append a structured prescription block at the end of your response in this EXACT format:
[PRESCRIPTION_START]
{
  "cropName": "...",
  "problem": "...",
  "infectionType": "खरपतवार" | "फफूंद/रोग" | "कीट/इल्ली" | "पोषण की कमी" | "अन्य",
  "severity": "सामान्य" | "मध्यम" | "गंभीर",
  "recommendedMedicine": "...",
  "chemicalFormula": "...",
  "dosage": "...",
  "waterRatio": "...",
  "sprayInstructions": "...",
  "caution": "..."
}
[PRESCRIPTION_END]`;

    let generatedText = '';
    let prescription: any = null;

    // Helper to extract prescription JSON
    const extractPrescription = (text: string) => {
      const match = text.match(/\[PRESCRIPTION_START\]([\s\S]*?)\[PRESCRIPTION_END\]/);
      if (match && match[1]) {
        try {
          prescription = JSON.parse(match[1].trim());
          // Remove the raw prescription tag from display text for clean UI
          text = text.replace(/\[PRESCRIPTION_START\][\s\S]*?\[PRESCRIPTION_END\]/, '').trim();
        } catch (e) {
          console.warn('Failed to parse prescription JSON from model:', e);
        }
      }
      return text;
    };

    // Try Gemini API (first with gemini-3.8-flash, then fallback to gemini-3.1-flash-lite)
    if (ai && geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of modelsToTry) {
        let attempts = 0;
        while (attempts < 2 && !generatedText) {
          attempts++;
          try {
            let contentsPayload: any;
            if (image && typeof image === 'string') {
              const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
              const mimeType = matches ? matches[1] : 'image/jpeg';
              const base64Data = matches ? matches[2] : image;
              contentsPayload = {
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: base64Data,
                    },
                  },
                  {
                    text: promptText,
                  },
                ],
              };
            } else {
              contentsPayload = promptText;
            }

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout with ${modelName}`)), 12000)
            );

            const apiPromise = ai.models.generateContent({
              model: modelName,
              contents: contentsPayload,
              config: {
                systemInstruction,
                temperature: 0.4,
              },
            });

            const response: any = await Promise.race([apiPromise, timeoutPromise]);
            const rawText = response?.text || '';
            if (rawText && rawText.trim()) {
              generatedText = extractPrescription(rawText);
              break; // Successfully got response
            }
          } catch (err: any) {
            console.warn(`Gemini API call attempt ${attempts} with model ${modelName}:`, err?.message || err);
            if (attempts < 2) {
              await new Promise((r) => setTimeout(r, 500));
            }
          }
        }
        if (generatedText) break;
      }
    }

    // High-precision Comprehensive Agronomic Fallback if API was unavailable
    if (!generatedText) {
      const q = (promptText + ' ' + (image ? 'photo image' : '')).toLowerCase();

      if (
        q.includes('2,4-d') ||
        q.includes('240') ||
        q.includes('खरपतवार') ||
        q.includes('बथुआ') ||
        q.includes('weed') ||
        q.includes('गेहूं') ||
        q.includes('gehu') ||
        q.includes('wheat')
      ) {
        if (q.includes('रतुआ') || q.includes('rust') || q.includes('पीला') || q.includes('पत्ती पीली')) {
          generatedText = isEn
            ? `🌾 **Wheat Crop Disease Diagnosis & Treatment:**\n\n• 🍂 **Infection Identified:** Yellow Rust (Puccinia striiformis) / Foliar Rust.\n• 🔬 **Symptoms:** Parallel yellow pustule stripes on leaf blades, powdery yellow spores on fingers.\n• 💊 **Recommended Medicine:** **Nativo (Tebuconazole 50% + Trifloxystrobin 25% WG)** or **Saaf Fungicide**.\n• 🧪 **Dosage:** 120-150 gm per acre in 150-200 liters of clean water.\n• ⚠️ **Spray Technique:** Spray thoroughly with hollow-cone nozzle during early morning or late afternoon.\n• 📞 *Available at Shree Shyam Krishi Seva Kendra — Call Kartick Gawande (+91 81204 64749).*`
            : `🌾 **गेहूं की फसल रोग निदान एवं दवाई परामर्श:**\n\n• 🍂 **रोग की पहचान:** पीला रतुआ (Yellow Rust / पक्सीनिया स्ट्राइफॉर्मिस) का फफूंद संक्रमण।\n• 🔬 **लक्षण:** पत्तियों की सतह पर हल्दी जैसी पीली धारियां और छूने पर पीला पाउडर लगना।\n• 💊 **अनुशंसित दवाई:** **नैटिवो (Nativo - टेबुकोनाजोल + ट्राइफ्लॉक्सीस्ट्रोबिन)** अथवा **साफ फंगीसाइड (कार्बेंडाजिम + मैंकोजेब)**।\n• 🧪 **मात्रा:** नैटिवो 120-150 ग्राम प्रति एकड़ (150-200 लीटर स्वच्छ पानी)।\n• 🚜 **स्प्रे विधि:** लक्षण दिखते ही तुरंत छिड़काव करें। खेत में नमी बनाए रखें।\n• 📞 *श्री श्याम कृषि सेवा केंद्र पर उपलब्ध — स्वामी कार्तिक गावंडे (+91 81204 64749)।*`;
          
          prescription = {
            cropName: isEn ? 'Wheat' : 'गेहूं (Wheat)',
            problem: isEn ? 'Yellow Rust (Fungal Infection)' : 'पीला रतुआ (फफूंद संक्रमण)',
            infectionType: 'फफूंद/रोग',
            severity: 'मध्यम',
            recommendedMedicine: 'नैटिवो (Nativo - Tebuconazole + Trifloxystrobin)',
            chemicalFormula: 'Tebuconazole 50% + Trifloxystrobin 25% WG',
            dosage: '120-150 gm प्रति एकड़ (15 gm प्रति पंप)',
            waterRatio: '150-200 लीटर पानी प्रति एकड़',
            sprayInstructions: 'लक्षण दिखते ही पत्तियों पर दोनों तरफ अच्छी तरह छिड़कें।',
            caution: 'तेज धूप में छिड़काव न करें। मौसम साफ रहने पर ही स्प्रे करें।'
          };
        } else {
          // Broadleaf weeds in wheat (2,4-D)
          generatedText = isEn
            ? `🌾 **Wheat Crop Weed Diagnosis & Herbicide Prescription:**\n\n• 🌿 **Infestation Identified:** Broadleaf Weed Competition (Bathua, Chenopodium album, Hirankhuri, Wild Mustard).\n• 🔬 **Impact:** Weeds aggressively consume fertilizer nitrogen, soil moisture, and suppress wheat tillering.\n• 💊 **Recommended Herbicide:** **2,4-D Amine Salt 58% SL** (or 2,4-D Ethyl Ester 38% EC).\n• 🧪 **Recommended Dosage:** 400 to 500 ml per acre mixed in 150 liters of clean water.\n• 🚜 **Application Timing:** Spray strictly at 30-35 days after sowing (crown root / tillering stage) when weeds have 2-4 leaves.\n• ⚠️ **Critical Caution:** Do not spray after the jointing stage (गांठ बनने के बाद छिड़काव न करें). Always use flat-fan nozzle for uniform soil-level coverage.\n• 📞 *Direct store dispatch available: Call Kartick Gawande at +91 81204 64749.*`
            : `🌾 **गेहूं की फसल में खरपतवार संक्रमण निदान एवं 2,4-D दवाई परामर्श:**\n\n• 🌿 **संक्रमण की पहचान:** गेहूं में चौड़ी पत्ती वाले खरपतवार (बथुआ, कृष्णनील, हिरनखुरी, चटरी-मटरी)।\n• 🔬 **नुकसान:** यह खरपतवार गेहूं की जड़ों का पोषण, यूरिया खाद और पानी सोख लेते हैं जिससे कल्ले कम फूटते हैं।\n• 💊 **अनुशंसित दवाई:** **2,4-D मुख्य खरपतवारनाशक (2,4-D अमाइन साल्ट 58% SL या 38% EC)**।\n• 🧪 **मात्रा:** 400 से 500 मिली प्रति एकड़ (लगभग 25-30 मिली प्रति 15 लीटर स्प्रे पंप)।\n• 🚜 **सही समय:** गेहूं बोवनी के 30 से 35 दिन बाद, जब खरपतवार 2 से 4 पत्ती की अवस्था में हों और खेत में पर्याप्त नमी हो।\n• ⚠️ **सावधानी:** गेहूं में गांठ (Jointing Stage) बनने के बाद 2,4-D का छिड़काव न करें। फ्लैट-फैन या कट नोजल का ही उपयोग करें।\n• 📞 *श्री श्याम कृषि सेवा केंद्र पर मूल स्टॉक उपलब्ध — संपर्क: कार्तिक गावंडे (+91 81204 64749)।*`;

          prescription = {
            cropName: isEn ? 'Wheat' : 'गेहूं (Wheat)',
            problem: isEn ? 'Broadleaf Weeds (Bathua / Hirankhuri)' : 'चौड़ी पत्ती वाले खरपतवार (बथुआ, हिरनखुरी)',
            infectionType: 'खरपतवार',
            severity: 'मध्यम',
            recommendedMedicine: '2,4-D मुख्य खरपतवारनाशक (2,4-D Amine 58% SL)',
            chemicalFormula: '2,4-D Amine Salt 58% SL / 38% EC',
            dosage: '400-500 ml प्रति एकड़ (25-30 ml प्रति 15L पंप)',
            waterRatio: '150 लीटर स्वच्छ पानी प्रति एकड़',
            sprayInstructions: 'गेहूं बोने के 30-35 दिन बाद फ्लैट-फैन नोजल से नमी में छिड़कें।',
            caution: 'गांठ बनने के बाद स्प्रे न करें। तेज हवा में छिड़काव से बचें।'
          };
        }
      } else if (q.includes('चना') || q.includes('chana') || q.includes('इल्ली') || q.includes('pod borer') || q.includes('घाटी')) {
        generatedText = isEn
          ? `🌱 **Gram (Chana) Pod Borer & Caterpillar Advisory:**\n\n• 🐛 **Pest Identified:** Helicoverpa armigera (Gram Pod Borer / Ghatiya Illi).\n• 💊 **Recommended Insecticide:** **Coragen (Chlorantraniliprole 18.5% SC)** or **Proclaim (Emamectin Benzoate 5% SG)**.\n• 🧪 **Dosage:** Coragen 60 ml/acre or Proclaim 80-100 gm/acre in 150 L water.\n• 🚜 **Timing:** Spray during 50% flowering and early pod formation.\n• 📞 *Call Kartick Gawande at +91 81204 64749.*`
          : `🌱 **चना (Gram) फसल में इल्ली संक्रमण एवं रोकथाम:**\n\n• 🐛 **कीट की पहचान:** चना घाटी छेदक इल्ली (Helicoverpa armigera / Pod Borer)।\n• 💊 **अनुशंसित कीटनाशक:** **कोराजन (Coragen - क्लोरेंट्रानिलिप्रोल 18.5% SC)** अथवा **प्रोक्लेम (Proclaim - एमामेक्टिन 5% SG)**।\n• 🧪 **मात्रा:** कोराजन 60 मिली प्रति एकड़ (6 मिली प्रति पंप) अथवा प्रोक्लेम 80-100 ग्राम प्रति एकड़।\n• 🚜 **स्प्रे समय:** 50% फूल आने और शुरुआती फलियां बनते समय छिड़काव करें।\n• 📞 *श्री श्याम कृषि सेवा केंद्र — कार्तिक गावंडे (+91 81204 64749)।*`;

        prescription = {
          cropName: isEn ? 'Gram (Chana)' : 'चना (Gram)',
          problem: isEn ? 'Gram Pod Borer (Caterpillar)' : 'घाटी छेदक इल्ली (Pod Borer)',
          infectionType: 'कीट/इल्ली',
          severity: 'मध्यम',
          recommendedMedicine: 'कोराजन (Coragen) / प्रोक्लेम (Proclaim)',
          chemicalFormula: 'Chlorantraniliprole 18.5% SC / Emamectin Benzoate 5% SG',
          dosage: '60 ml प्रति एकड़ (कोराजन) अथवा 100 gm (प्रोक्लेम)',
          waterRatio: '150-200 लीटर पानी प्रति एकड़',
          sprayInstructions: 'शाम के समय फूल व फलियों पर एकसमान छिड़काव करें।',
          caution: 'फूल खिलने के समय तेज धूप में छिड़काव न करें।'
        };
      } else if (q.includes('सोयाबीन') || q.includes('soybean') || q.includes('गर्डल') || q.includes('सांवा')) {
        generatedText = isEn
          ? `🌱 **Soybean Crop Advisory & Weed/Pest Management:**\n\n• 🌿 **Management:** Apply selective post-emergence herbicide like **Targa Super (Quizalofop Ethyl 5% EC)** for narrow-leaf grassy weeds.\n• 💊 **Dosage:** 250-300 ml per acre at 15-20 days after sowing.\n• 🐛 **Girdle Beetle / Semilooper:** Use **Coragen (60 ml/acre)** if stem ring cuts are noticed.\n• 📞 *Contact Kartick Gawande: +91 81204 64749.*`
          : `🌱 **सोयाबीन फसल सुरक्षा एवं खरपतवार/कीट नियंत्रण:**\n\n• 🌿 **खरपतवार नियंत्रण:** संकरी पत्ती के खरपतवार (दूब, सांवा) के लिए **टारगा सुपर (Targa Super - क्विजालोफॉप 5% EC)** का 250-300 मिली प्रति एकड़ छिड़कें।\n• 🐛 **इल्ली व गर्डल बीटल:** तने में छल्ले दिखने पर **कोराजन (Coragen - 60 मिली प्रति एकड़)** का छिड़काव करें।\n• 🚜 **स्प्रे समय:** सुबह या शाम के शांत मौसम में करें।\n• 📞 *श्री श्याम कृषि सेवा केंद्र: +91 81204 64749।*`;

        prescription = {
          cropName: isEn ? 'Soybean' : 'सोयाबीन (Soybean)',
          problem: isEn ? 'Grassy Weeds & Girdle Beetle' : 'घास कुल के खरपतवार एवं गर्डल बीटल',
          infectionType: 'खरपतवार',
          severity: 'सामान्य',
          recommendedMedicine: 'टारगा सुपर (Targa Super) / कोराजन (Coragen)',
          chemicalFormula: 'Quizalofop Ethyl 5% EC / Chlorantraniliprole 18.5% SC',
          dosage: 'टारगा सुपर 250-300 मिली प्रति एकड़',
          waterRatio: '150 लीटर पानी प्रति एकड़',
          sprayInstructions: 'बोवनी के 15-20 दिन बाद पर्याप्त नमी में छिड़काव करें।',
          caution: 'खेत में सूखा होने पर स्प्रे न करें।'
        };
      } else {
        generatedText = isEn
          ? `🌾 **Shree Shyam Krishi Seva Kendra — Comprehensive Agronomy Advisory:**\n\n• 🩺 **Plant Health & Disease Management:** Maintain balanced nutrition with NPK, Zinc, and Sulfur. Avoid excessive single-nutrient urea application.\n• 💊 **Certified Store Products:** We provide 100% certified pesticides, weedicides (like 2,4-D, Targa Super, Roundup), fungicides (Nativo, Saaf), and bio-stimulants (Ambition).\n• 🚜 **Foliar Spray Technique:** Always dissolve in clean water (150 L/acre) and use appropriate nozzles.\n• 📞 **Expert Guidance:** Call shop owner **Kartick Gawande (+91 81204 64749)** or bring plant sample to the shop.`
          : `🌾 **श्री श्याम कृषि सेवा केंद्र — सम्पूर्ण कृषि एवं फसल सुरक्षा परामर्श:**\n\n• 🩺 **फसल स्वास्थ्य एवं पोषण:** केवल यूरिया पर निर्भर न रहें, फास्फोरस, पोटाश, जिंक और सल्फर का संतुलित उपयोग करें।\n• 💊 **दवाई एवं खरपतवार नियंत्रण:** गेहूं में चौड़ी पत्ती खरपतवार के लिए **2,4-D अमाइन**, रतुआ के लिए **नैटिवो**, इल्लियों के लिए **कोराजन** और वानस्पतिक वृद्धि के लिए **एम्बिशन टॉनिक / NPK 19:19:19** का उपयोग करें।\n• 🚜 **छिड़काव सावधानी:** हमेशा स्वच्छ पानी का प्रयोग करें और उत्पाद लेबल पर दी गई निर्धारित मात्रा का ही छिड़काव करें।\n• 📞 **सीधा विशेषज्ञ परामर्श:** किसी भी रोगग्रस्त पत्ती या फसल की समस्या पर स्वामी **कार्तिक गावंडे जी (+91 81204 64749)** से निःशुल्क सलाह प्राप्त करें।`;

        prescription = {
          cropName: isEn ? 'General Field Crops' : 'सामान्य फसल सुरक्षा (Field Crops)',
          problem: isEn ? 'Nutrient Optimization & Preventive Crop Care' : 'संतुलित पोषण एवं रोग निवारक सुरक्षा',
          infectionType: 'पोषण की कमी',
          severity: 'सामान्य',
          recommendedMedicine: 'एम्बिशन बायोस्टिमुलेंट (Ambition) + NPK 19:19:19',
          chemicalFormula: 'Amino Acids + Fulvic Acid + Balanced NPK',
          dosage: 'एम्बिशन 400-500 ml + NPK 1 kg प्रति एकड़',
          waterRatio: '150 लीटर पानी प्रति एकड़',
          sprayInstructions: 'फसल की वानस्पतिक एवं कल्ले निकलते समय छिड़काव करें।',
          caution: 'तेज धूप में छिड़काव न करें।'
        };
      }
    }

    // Match recommended medicine with actual store product catalog
    let matchedProduct: any = null;
    const allProducts = appData.products || [];
    const textToMatch = `${generatedText} ${prescription?.recommendedMedicine || ''} ${prescription?.problem || ''} ${promptText}`.toLowerCase();

    if (textToMatch.includes('2,4-d') || textToMatch.includes('240') || textToMatch.includes('चौड़ी पत्ती') || textToMatch.includes('बथुआ')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-11') || allProducts.find((p) => p.name.includes('2,4-D'));
    } else if (textToMatch.includes('नैटिवो') || textToMatch.includes('nativo') || textToMatch.includes('रतुआ') || textToMatch.includes('rust')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-4') || allProducts.find((p) => p.name.includes('नैटिवो'));
    } else if (textToMatch.includes('कोराजन') || textToMatch.includes('coragen') || textToMatch.includes('तना छेदक')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-1') || allProducts.find((p) => p.name.includes('कोराजन'));
    } else if (textToMatch.includes('प्रोक्लेम') || textToMatch.includes('proclaim') || textToMatch.includes('इल्ली')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-3') || allProducts.find((p) => p.name.includes('प्रोक्लेम'));
    } else if (textToMatch.includes('साफ') || textToMatch.includes('saaf') || textToMatch.includes('झुलसा') || textToMatch.includes('फफूंद')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-2') || allProducts.find((p) => p.name.includes('साफ'));
    } else if (textToMatch.includes('टारगा') || textToMatch.includes('targa')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-6') || allProducts.find((p) => p.name.includes('टारगा'));
    } else if (textToMatch.includes('एम्बिशन') || textToMatch.includes('ambition') || textToMatch.includes('टॉनिक')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-5') || allProducts.find((p) => p.name.includes('एम्बिशन'));
    } else if (textToMatch.includes('19:19:19') || textToMatch.includes('npk')) {
      matchedProduct = allProducts.find((p) => p.id === 'prod-8') || allProducts.find((p) => p.name.includes('19:19:19'));
    }

    if (prescription && matchedProduct) {
      prescription.matchedProductId = matchedProduct.id;
      prescription.matchedProduct = matchedProduct;
    }

    res.json({
      answer: generatedText,
      prescription,
      recommendedProduct: matchedProduct,
    });
  });

  // 9b. AI Product Advisory & Auto-fill System (Detailed Usage & Crops Intelligence)
  app.post('/api/ai/product-advisory', async (req: Request, res: Response) => {
    const { productName, brand = '', productType = '', crop = '', language = 'hi' } = req.body;
    if (!productName || typeof productName !== 'string') {
      return res.status(400).json({ error: 'दवाई/उत्पाद का नाम आवश्यक है' });
    }

    const isEn = language === 'en';

    const systemPrompt = `You are a certified senior agricultural scientist and chief agronomist for "श्री श्याम कृषि सेवा केंद्र" (Shree Shyam Krishi Seva Kendra, Proprietor: Kartick Gawande, Phone: +91 81204 64749).
A farmer or store admin is inquiring about the agricultural product / medicine: "${productName}" (Brand: ${brand}, Type: ${productType}, Current Crop: ${crop}).

Your task:
1. Provide comprehensive, accurate, practical agronomic intelligence in ${isEn ? 'English' : 'Hindi (देवनागरी)'}.
2. Explicitly specify:
   - Suitable Crops (किन-किन फसलों में डाल सकते हैं)
   - Target Diseases/Pests/Weeds (किस-किस चीज/रोग/कीट/खरपतवार के लिए डाल सकते हैं)
   - Exact Dosage & Dilution (छिड़काव मात्रा, पानी की मात्रा, प्रति पंप डोज)
   - Application Stage & Technique (छिड़काव का सही समय, नोजल, नमी)
   - Safety Precautions (सावधानियां)
3. Return a clean JSON object in this EXACT format:
{
  "suitableCrops": "...",
  "targetPests": "...",
  "dosageInfo": "...",
  "usageInfo": "...",
  "precautions": "...",
  "detailedAdvisory": "..."
}`;

    if (ai && geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
      const advisoryModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of advisoryModels) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Advisory timeout')), 10000)
          );
          const apiPromise = ai.models.generateContent({
            model: modelName,
            contents: `Provide complete farmer application guidance and JSON for agricultural medicine "${productName}"`,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
            },
          });

          const response: any = await Promise.race([apiPromise, timeoutPromise]);
          const text = response?.text || '';
          if (text) {
            const parsed = JSON.parse(text);
            return res.json(parsed);
          }
        } catch (err: any) {
          console.warn(`Gemini product advisory attempt with ${modelName}:`, err?.message || err);
        }
      }
    }

    // High-precision built-in agricultural database fallback
    const p = productName.toLowerCase();
    let suitableCrops = '';
    let targetPests = '';
    let dosageInfo = '';
    let usageInfo = '';
    let precautions = '';
    let detailedAdvisory = '';

    if (p.includes('2,4-d') || p.includes('240')) {
      suitableCrops = isEn ? 'Wheat, Maize, Sugarcane, Sorghum' : 'गेहूं, मक्का, गन्ना, ज्वार';
      targetPests = isEn
        ? 'Broadleaf weeds: Bathua (Chenopodium), Hirankhuri, Wild Mustard, Krishna-neel, Chatari-Matari'
        : 'चौड़ी पत्ती वाले खरपतवार: बथुआ, हिरनखुरी, कृष्णनील, सैंजी, चटरी-मटरी, जंगली गाजर';
      dosageInfo = isEn
        ? '400 to 500 ml per acre in 150 liters of clean water (25-30 ml per 15L spray pump)'
        : '400 से 500 मिली प्रति एकड़ (150 लीटर स्वच्छ पानी, 25-30 मिली प्रति 15 लीटर पंप)';
      usageInfo = isEn
        ? 'Apply strictly at 30-35 days after sowing (crown root / tillering stage) when weeds have 2-4 leaves using flat-fan nozzle.'
        : 'गेहूं बोवनी के 30 से 35 दिन बाद, जब खरपतवार 2 से 4 पत्ती की अवस्था में हों और खेत में पर्याप्त नमी हो, फ्लैट-फैन नोजल से छिड़कें।';
      precautions = isEn
        ? 'Do not spray after jointing stage. Do not spray in high winds or dry soil. Avoid spray drift to broadleaf crops like mustard or gram.'
        : 'गेहूं में गांठ (Jointing Stage) बनने के बाद छिड़काव न करें। खेत में नमी होना अनिवार्य है। पास के सरसों या चने के खेत में दवा उड़ने न दें।';
      detailedAdvisory = isEn
        ? '2,4-D is a selective systemic phenoxy herbicide that selectively kills broadleaf weeds without harming cereal crops when applied at recommended vegetative stages.'
        : '2,4-D अमाइन साल्ट एक चयनात्मक एवं दैहिक शाकनाशी है जो गेहूं की फसल को नुकसान पहुँचाए बिना बथुआ और चौड़ी पत्ती वाले सभी खरपतवारों को जड़ों से समाप्त करता है।';
    } else if (p.includes('नैटिवो') || p.includes('nativo')) {
      suitableCrops = isEn ? 'Wheat, Paddy, Soybean, Chilli, Tomato' : 'गेहूं, धान, सोयाबीन, मिर्च, टमाटर';
      targetPests = isEn
        ? 'Yellow Rust, Brown Rust, Powdery Mildew, Sheath Blight, Anthracnose'
        : 'पीला रतुआ (Yellow Rust), भूरा रतुआ, पाउडरी मिल्ड्यू, शीथ ब्लाइट, पत्ती धब्बा व झुलसा रोग';
      dosageInfo = isEn
        ? '120 to 150 gm per acre in 150-200 liters water (12-15 gm per 15L pump)'
        : '120 से 150 ग्राम प्रति एकड़ (150-200 लीटर पानी, 12-15 ग्राम प्रति 15 लीटर पंप)';
      usageInfo = isEn
        ? 'Spray at early symptom appearance or preventive stage with hollow-cone nozzle.'
        : 'फसल पर रोग के प्रारंभिक लक्षण दिखने पर या बालियाँ/फूल आने की अवस्था में स्वच्छ पानी के साथ समान छिड़काव करें।';
      precautions = isEn
        ? 'Do not spray in harsh afternoon heat. Ensure uniform coverage on both sides of leaves.'
        : 'कड़ी दोपहर में छिड़काव न करें। पत्तियों के ऊपर और नीचे दोनों तरफ दवा का पहुंचना सुनिश्चित करें।';
      detailedAdvisory = isEn
        ? 'Nativo contains Tebuconazole + Trifloxystrobin giving dual-action systemic and mesostemic protection, disease eradication, and plant greening effect.'
        : 'नैटिवो में टेबुकोनाजोल और ट्राइफ्लॉक्सीस्ट्रोबिन का संयोजन है, जो फफूंद को तुरंत नष्ट करता है और फसल को हरियाली व तनाव सहने की शक्ति देता है।';
    } else if (p.includes('कोराजन') || p.includes('coragen')) {
      suitableCrops = isEn ? 'Soybean, Gram, Maize, Paddy, Sugarcane, Vegetables' : 'सोयाबीन, चना, मक्का, धान, गन्ना, टमाटर, गोभी';
      targetPests = isEn
        ? 'Pod Borer (Ghatiya Illi), Stem Borer, Girdle Beetle, Spodoptera, Semilooper'
        : 'घाटी छेदक इल्ली (Pod Borer), तना छेदक, गर्डल बीटल (चक्र भृंग), तंबाकू इल्ली, सेमीलूपर व फल छेदक';
      dosageInfo = isEn
        ? '60 ml per acre in 150-200 liters water (6 ml per 15L spray pump)'
        : '60 मिली प्रति एकड़ (150-200 लीटर पानी, 6 मिली प्रति 15 लीटर स्प्रे पंप)';
      usageInfo = isEn
        ? 'Spray at early larval infestation or 50% flowering/pod formation stage.'
        : 'कीट या इल्लियों के अंडे/शुरुआती सुंडी दिखने पर या 50% फूल व फलियां बनते समय छिड़कें। लंबे समय (21-25 दिन) तक सुरक्षा देता है।';
      precautions = isEn
        ? 'Follow exact dosage. Use clean pond/tubewell water. Wear safety mask.'
        : 'निर्धारित 60 मिली प्रति एकड़ डोज का ही प्रयोग करें। हमेशा स्वच्छ पानी का उपयोग करें और मास्क पहनें।';
      detailedAdvisory = isEn
        ? 'Coragen (Chlorantraniliprole 18.5% SC) paralyzes muscle contraction of chewing pests, stopping crop feeding within minutes.'
        : 'कोराजन इल्लियों की मांसपेशियों को तुरंत शिथिल कर देता है, जिससे वे 10-15 मिनट में फसल खाना बंद कर देती हैं और फसल सुरक्षित रहती है।';
    } else if (p.includes('साफ') || p.includes('saaf')) {
      suitableCrops = isEn ? 'Wheat, Gram, Vegetables, Groundnut, Potato' : 'गेहूं, चना, सब्जियां, मूंगफली, आलू';
      targetPests = isEn
        ? 'Root Rot, Seed Rot, Tikka Disease, Collar Rot, Early/Late Blight'
        : 'जड़ सड़न, उकठा रोग, पत्ती धब्बा, टिक्का रोग, झुलसा और बीज जनित फफूंद रोग';
      dosageInfo = isEn
        ? '2 gm per liter water for foliar spray; 2.5 gm per kg seed for seed dressing'
        : '2 ग्राम प्रति लीटर पानी (फोलियर स्प्रे हेतु) अथवा 2.5 ग्राम प्रति किलो बीज (बीजोपचार हेतु)';
      usageInfo = isEn
        ? 'Excellent for seed treatment prior to sowing and foliar application during early vegetative phase.'
        : 'बोवनी से पूर्व बीजोपचार के लिए सर्वोत्तम। फसल की प्रारंभिक अवस्था में जड़ क्षेत्र में नमी देने या पत्तों पर छिड़कने हेतु उपयोगी।';
      precautions = isEn
        ? 'Store in a dry place. Keep away from direct moisture.'
        : 'सूखे व ठंडे स्थान पर रखें। बीजोपचार के बाद छाया में सुखाकर ही बुवाई करें।';
      detailedAdvisory = isEn
        ? 'Saaf (Carbendazim 12% + Mancozeb 63% WP) provides both contact and systemic broad-spectrum fungal prevention.'
        : 'साफ फंगीसाइड संपर्क और दैहिक दोनों क्रियाओं द्वारा पौधों को जड़ से पत्ती तक फफूंद जनित रोगों से सुरक्षा प्रदान करता है।';
    } else {
      suitableCrops = isEn ? 'All seasonal field crops & vegetables' : 'सभी मौसमी फसलें, अनाज, दलहन एवं सब्जियां';
      targetPests = isEn
        ? 'General disease prevention, insect management, and crop health optimization'
        : 'सामान्य कीट नियंत्रण, फफूंद रोकथाम अथवा संतुलित पोषण वृद्धि';
      dosageInfo = isEn ? 'Follow official container label' : 'उत्पाद के डिब्बे पर दिए गए आधिकारिक लेबल अनुसार उपयोग करें';
      usageInfo = isEn ? 'Apply during early morning or late afternoon' : 'सुबह या शाम के समय स्वच्छ पानी में घोलकर समान छिड़काव करें';
      precautions = isEn ? 'Wear protective gear and store safely' : 'सुरक्षात्मक वस्त्र व दस्ताने पहनें और बच्चों की पहुंच से दूर रखें';
      detailedAdvisory = isEn
        ? 'Consult store agronomist Kartick Gawande at +91 81204 64749 for customized field advisory.'
        : 'विस्तृत व सटीक परामर्श हेतु सीधे स्वामी कार्तिक गावंडे जी (+91 81204 64749) से संपर्क करें।';
    }

    res.json({
      suitableCrops,
      targetPests,
      dosageInfo,
      usageInfo,
      precautions,
      detailedAdvisory,
    });
  });

  // 10. Image Upload
  app.post('/api/upload', (req: Request, res: Response) => {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'इमेज डेटा आवश्यक है' });
    }
    res.json({ url: dataUrl, filename: filename || 'uploaded_image.png' });
  });

  // 11. Reset / Seed
  app.post('/api/reset', (_req: Request, res: Response) => {
    appData = JSON.parse(JSON.stringify(initialData));
    saveDataToFile();
    res.json({ success: true, message: 'डेटा सफलतापूर्वक रीसेट किया गया' });
  });

  // Vite Integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
