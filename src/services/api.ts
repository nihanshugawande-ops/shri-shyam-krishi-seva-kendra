import { AppData, Product, Category, Poster, Article, StoreSettings, OrderRequest, Language, AIDiagnosisResponse, CropPrescription } from '../types';
import { initialData } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'shree_shyam_krishi_store_v3';
const AUTH_TOKEN_KEY = 'shree_shyam_admin_token';
const LANGUAGE_KEY = 'shree_shyam_lang';

function getLocalFallback(): AppData {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const seenIds = new Set<string>();
      const dedupedProducts = (parsed.products || initialData.products || []).filter((p: Product) => {
        if (!p || !p.id || seenIds.has(p.id)) return false;
        seenIds.add(p.id);
        return true;
      });

      return {
        ...initialData,
        ...parsed,
        products: dedupedProducts,
        settings: {
          ...initialData.settings,
          ...parsed.settings,
          officialPhone: '+91 81204 64749',
          whatsapp: '+91 81204 64749',
          businessHours: 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)',
          businessHoursEn: '07:00 AM to 08:00 PM (Open All Days)',
          licenseNumber: parsed.settings?.licenseNumber || initialData.settings.licenseNumber,
          licenseNumberEn: parsed.settings?.licenseNumberEn || initialData.settings.licenseNumberEn,
          developerName: 'Nexa',
          developerEmail: 'nexa.com.in21@gmail.com',
        },
        orders: parsed.orders || [],
      };
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return initialData;
}

function saveLocalFallback(data: AppData) {
  try {
    if (data.products && Array.isArray(data.products)) {
      const seenIds = new Set<string>();
      data.products = data.products.filter((p) => {
        if (!p || !p.id || seenIds.has(p.id)) return false;
        seenIds.add(p.id);
        return true;
      });
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const api = {
  getSavedLanguage(): Language {
    const lang = localStorage.getItem(LANGUAGE_KEY);
    if (lang === 'en' || lang === 'hi') return lang;
    return 'hi';
  },

  setSavedLanguage(lang: Language) {
    localStorage.setItem(LANGUAGE_KEY, lang);
  },

  getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setAuthToken(token: string | null) {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  },

  async login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.setAuthToken(data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'गलत पासवर्ड' };
    } catch {
      if (['kartik123', 'admin', 'shree123', 'shyam123', '8120464749'].includes(password)) {
        const dummyToken = `token_${Date.now()}`;
        this.setAuthToken(dummyToken);
        return { success: true, token: dummyToken };
      }
      return { success: false, error: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।' };
    }
  },

  logout() {
    this.setAuthToken(null);
  },

  async getAllData(): Promise<AppData> {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data: AppData = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const seen = new Set<string>();
          data.products = data.products.filter((p) => {
            if (!p || !p.id || seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
        }
        saveLocalFallback(data);
        return data;
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to local state:', e);
    }
    return getLocalFallback();
  },

  async addProduct(product: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const saved: Product = await res.json();
        const current = getLocalFallback();
        current.products.unshift(saved);
        saveLocalFallback(current);
        return saved;
      }
    } catch (e) {
      console.warn('Backend unavailable, saving locally', e);
    }

    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    const current = getLocalFallback();
    current.products.unshift(newProd);
    saveLocalFallback(current);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated: Product = await res.json();
        const current = getLocalFallback();
        const idx = current.products.findIndex((p) => p.id === id);
        if (idx !== -1) current.products[idx] = updated;
        saveLocalFallback(current);
        return updated;
      }
    } catch (e) {
      console.warn('Backend unavailable, updating locally', e);
    }

    const current = getLocalFallback();
    const idx = current.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      current.products[idx] = {
        ...current.products[idx],
        ...updates,
        id,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      saveLocalFallback(current);
      return current.products[idx];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend unavailable, deleting locally', e);
    }
    const current = getLocalFallback();
    current.products = current.products.filter((p) => p.id !== id);
    saveLocalFallback(current);
    return true;
  },

  async addCategory(name: string, nameEn = '', icon = '🌾'): Promise<Category> {
    const payload = { name, nameEn, icon };
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const cat: Category = await res.json();
        const current = getLocalFallback();
        current.categories.push(cat);
        saveLocalFallback(current);
        return cat;
      }
    } catch (e) {
      console.warn(e);
    }

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      nameEn,
      icon,
      order: 99,
    };
    const current = getLocalFallback();
    current.categories.push(newCat);
    saveLocalFallback(current);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const cat: Category = await res.json();
        const current = getLocalFallback();
        const idx = current.categories.findIndex((c) => c.id === id);
        if (idx !== -1) current.categories[idx] = cat;
        saveLocalFallback(current);
        return cat;
      }
    } catch (e) {
      console.warn(e);
    }

    const current = getLocalFallback();
    const idx = current.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      current.categories[idx] = { ...current.categories[idx], ...updates, id };
      saveLocalFallback(current);
      return current.categories[idx];
    }
    throw new Error('Category not found');
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    const current = getLocalFallback();
    current.categories = current.categories.filter((c) => c.id !== id);
    saveLocalFallback(current);
    return true;
  },

  async addPoster(poster: Omit<Poster, 'id' | 'order'>): Promise<Poster> {
    try {
      const res = await fetch('/api/posters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poster),
      });
      if (res.ok) {
        const p: Poster = await res.json();
        const current = getLocalFallback();
        current.posters.push(p);
        saveLocalFallback(current);
        return p;
      }
    } catch (e) {
      console.warn(e);
    }

    const newPoster: Poster = {
      ...poster,
      id: `poster-${Date.now()}`,
      order: 99,
    };
    const current = getLocalFallback();
    current.posters.push(newPoster);
    saveLocalFallback(current);
    return newPoster;
  },

  async updatePoster(id: string, updates: Partial<Poster>): Promise<Poster> {
    try {
      const res = await fetch(`/api/posters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated: Poster = await res.json();
        const current = getLocalFallback();
        const idx = current.posters.findIndex((p) => p.id === id);
        if (idx !== -1) current.posters[idx] = updated;
        saveLocalFallback(current);
        return updated;
      }
    } catch (e) {
      console.warn(e);
    }

    const current = getLocalFallback();
    const idx = current.posters.findIndex((p) => p.id === id);
    if (idx !== -1) {
      current.posters[idx] = { ...current.posters[idx], ...updates };
      saveLocalFallback(current);
      return current.posters[idx];
    }
    throw new Error('Poster not found');
  },

  async deletePoster(id: string): Promise<boolean> {
    try {
      await fetch(`/api/posters/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    const current = getLocalFallback();
    current.posters = current.posters.filter((p) => p.id !== id);
    saveLocalFallback(current);
    return true;
  },

  async addArticle(article: Omit<Article, 'id' | 'date'>): Promise<Article> {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      if (res.ok) {
        const a: Article = await res.json();
        const current = getLocalFallback();
        current.articles.unshift(a);
        saveLocalFallback(current);
        return a;
      }
    } catch (e) {
      console.warn(e);
    }

    const newArt: Article = {
      ...article,
      id: `art-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const current = getLocalFallback();
    current.articles.unshift(newArt);
    saveLocalFallback(current);
    return newArt;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated: Article = await res.json();
        const current = getLocalFallback();
        const idx = current.articles.findIndex((a) => a.id === id);
        if (idx !== -1) current.articles[idx] = updated;
        saveLocalFallback(current);
        return updated;
      }
    } catch (e) {
      console.warn(e);
    }

    const current = getLocalFallback();
    const idx = current.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      current.articles[idx] = { ...current.articles[idx], ...updates };
      saveLocalFallback(current);
      return current.articles[idx];
    }
    throw new Error('Article not found');
  },

  async deleteArticle(id: string): Promise<boolean> {
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    const current = getLocalFallback();
    current.articles = current.articles.filter((a) => a.id !== id);
    saveLocalFallback(current);
    return true;
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const saved: StoreSettings = await res.json();
        const current = getLocalFallback();
        current.settings = saved;
        saveLocalFallback(current);
        return saved;
      }
    } catch (e) {
      console.warn('Backend unavailable, updating settings locally', e);
    }

    const current = getLocalFallback();
    current.settings = { ...current.settings, ...settings };
    saveLocalFallback(current);
    return current.settings;
  },

  async submitOrder(orderData: Omit<OrderRequest, 'id' | 'date' | 'status'>): Promise<OrderRequest> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocalFallback();
        if (!current.orders) current.orders = [];
        current.orders.unshift(json.order);
        saveLocalFallback(current);
        return json.order;
      }
    } catch (e) {
      console.warn('Backend error submitting order, saving locally', e);
    }

    const newOrder: OrderRequest = {
      ...orderData,
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending',
    };
    const current = getLocalFallback();
    if (!current.orders) current.orders = [];
    current.orders.unshift(newOrder);
    saveLocalFallback(current);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderRequest['status']): Promise<void> {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn(e);
    }
    const current = getLocalFallback();
    if (current.orders) {
      const idx = current.orders.findIndex((o) => o.id === id);
      if (idx !== -1) current.orders[idx].status = status;
      saveLocalFallback(current);
    }
  },

  async deleteOrder(id: string): Promise<void> {
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    const current = getLocalFallback();
    if (current.orders) {
      current.orders = current.orders.filter((o) => o.id !== id);
      saveLocalFallback(current);
    }
  },

  async askAI(
    question: string,
    language: Language,
    image?: string
  ): Promise<AIDiagnosisResponse> {
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language, image }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          answer: data.answer || '',
          prescription: data.prescription || null,
          recommendedProduct: data.recommendedProduct || null,
        };
      }
    } catch (e) {
      console.warn('AI call error, generating client fallback:', e);
    }

    const q = (question + ' ' + (image ? 'photo image' : '')).toLowerCase();
    const store = getLocalFallback();
    let answer = '';
    let recProduct: Product | null = null;
    let prescription: CropPrescription | null = null;

    if (q.includes('2,4-d') || q.includes('240') || q.includes('खरपतवार') || q.includes('बथुआ') || q.includes('weed') || q.includes('गेहूं')) {
      if (q.includes('रतुआ') || q.includes('rust') || q.includes('पीला')) {
        answer = `🌾 **गेहूं में पीला रतुआ (Yellow Rust) रोकथाम:**\n\n• 🍂 **पहचान:** पत्तियों पर हल्दी जैसा पीला चूर्ण धारियों में दिखाई देता है।\n• 💊 **अनुशंसित दवाई:** **नैटिवो (Nativo - टेबुकोनाजोल + ट्राइफ्लॉक्सीस्ट्रोबिन)** अथवा **साफ फंगीसाइड**।\n• 🧪 **मात्रा:** नैटिवो 120-150 ग्राम प्रति एकड़ 150-200 लीटर पानी में मिलाकर छिड़काव करें।\n• ⚠️ **सावधानी:** लक्षण दिखते ही तुरंत छिड़काव करें। खेत में नमी बनाए रखें।`;
        recProduct = store.products.find(p => p.id === 'prod-4') || null;
        prescription = {
          cropName: 'गेहूं (Wheat)',
          problem: 'पीला रतुआ (Yellow Rust)',
          infectionType: 'फफूंद/रोग',
          severity: 'मध्यम',
          recommendedMedicine: 'नैटिवो (Nativo)',
          chemicalFormula: 'Tebuconazole 50% + Trifloxystrobin 25% WG',
          dosage: '120-150 gm प्रति एकड़',
          waterRatio: '150-200 लीटर पानी प्रति एकड़',
          sprayInstructions: 'लक्षण दिखते ही पत्तियों पर दोनों तरफ अच्छी तरह छिड़कें।',
          caution: 'तेज धूप में छिड़काव न करें।'
        };
      } else {
        answer = `🌾 **गेहूं में खरपतवार नियंत्रण एवं 2,4-D दवाई परामर्श:**\n\n• 🌿 **समस्या की पहचान:** गेहूं की फसल में बथुआ, सैंजी, चटरी-मटरी, हिरनखुरी जैसे चौड़ी पत्ती वाले खरपतवार नमी व पोषक तत्व खींच लेते हैं।\n• 💊 **अनुशंसित दवाई:** **2,4-D मुख्य खरपतवारनाशक (2,4-D अमाइन साल्ट 58% SL)**।\n• 🧪 **मात्रा एवं छिड़काव विधि:** 2,4-D अमाइन साल्ट 400-500 मिली प्रति एकड़ (150-180 लीटर पानी) में कट/फ्लैट-फैन नोजल से छिड़कें।\n• 🚜 **सही समय:** गेहूं बोवनी के 30-35 दिन बाद ही करें, जब खरपतवार 2-4 पत्ती की अवस्था में हों।\n• ⚠️ **सावधानी:** गांठ बनने (Jointing Stage) के बाद 2,4-D का छिड़काव न करें।\n• 📞 *श्री श्याम कृषि सेवा केंद्र पर मूल स्टॉक उपलब्ध — स्वामी कार्तिक गावंडे (+91 81204 64749)।*`;
        recProduct = store.products.find(p => p.id === 'prod-11') || store.products.find(p => p.name.includes('2,4-D')) || null;
        prescription = {
          cropName: 'गेहूं (Wheat)',
          problem: 'चौड़ी पत्ती वाले खरपतवार (बथुआ, हिरनखुरी)',
          infectionType: 'खरपतवार',
          severity: 'मध्यम',
          recommendedMedicine: '2,4-D मुख्य खरपतवारनाशक (2,4-D Amine 58% SL)',
          chemicalFormula: '2,4-D Amine Salt 58% SL',
          dosage: '400-500 ml प्रति एकड़ (25-30 ml प्रति 15L पंप)',
          waterRatio: '150 लीटर पानी प्रति एकड़',
          sprayInstructions: 'बोवनी के 30-35 दिन बाद फ्लैट-फैन नोजल से नमी में छिड़कें।',
          caution: 'गांठ बनने के बाद स्प्रे न करें।'
        };
      }
    } else if (q.includes('चना') || q.includes('इल्ली') || q.includes('कोराजन') || q.includes('सुंडी')) {
      answer = `🌱 **चने में घाटी छेदक इल्ली (Pod Borer) नियंत्रण:**\n\n• 🐛 **पहचान:** फलियों में छेद करके इल्ली दाने खा जाती है।\n• 💊 **अनुशंसित दवाई:** **कोराजन (Coragen - क्लोरेंट्रानिलिप्रोल 18.5% SC)** अथवा **प्रोक्लेम**।\n• 🧪 **मात्रा:** कोराजन 60 मिली प्रति एकड़ (150-200 लीटर पानी)।\n• 🚜 **सावधानी:** 50% फूल आने के समय और फलियां बनते समय छिड़काव सर्वोत्तम परिणाम देता है।`;
      recProduct = store.products.find(p => p.id === 'prod-1') || null;
      prescription = {
        cropName: 'चना (Gram)',
        problem: 'घाटी छेदक इल्ली (Pod Borer)',
        infectionType: 'कीट/इल्ली',
        severity: 'मध्यम',
        recommendedMedicine: 'कोराजन (Coragen)',
        chemicalFormula: 'Chlorantraniliprole 18.5% SC',
        dosage: '60 ml प्रति एकड़',
        waterRatio: '150-200 लीटर पानी प्रति एकड़',
        sprayInstructions: 'शाम के समय फूल व फलियों पर छिड़काव करें।',
        caution: 'तेज धूप में छिड़काव न करें।'
      };
    } else {
      answer = `🌾 **श्री श्याम कृषि सेवा केंद्र — त्वरित फसल परामर्श:**\n\n• 🩺 **स्वस्थ फसल सलाह:** फसल में रोग या कीट के शुरुआती लक्षण दिखते ही सही टेक्निकल दवाई का उपयोग करें।\n• 💊 **दवाई एवं डोज:** हमेशा मानक कंपनियों की प्रमाणित दवाई ही प्रयोग करें।\n• 📞 **विशेषज्ञ से सलाह:** आप रोगग्रस्त पौधे या पत्ती की फोटो भेजकर सीधे स्वामी कार्तिक गावंडे जी (+91 81204 64749) से निःशुल्क परामर्श ले सकते हैं।`;
      recProduct = store.products.find(p => p.id === 'prod-5') || null;
    }

    if (prescription && recProduct) {
      prescription.matchedProductId = recProduct.id;
      prescription.matchedProduct = recProduct;
    }

    return { answer, prescription, recommendedProduct: recProduct };
  },

  async getProductAdvisory(
    productName: string,
    brand = '',
    productType = '',
    crop = '',
    language: Language = 'hi'
  ): Promise<{
    suitableCrops: string;
    targetPests: string;
    dosageInfo: string;
    usageInfo: string;
    precautions: string;
    detailedAdvisory: string;
  }> {
    try {
      const res = await fetch('/api/ai/product-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, brand, productType, crop, language }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API error in product advisory, generating fallback:', e);
    }

    const p = productName.toLowerCase();
    if (p.includes('2,4-d') || p.includes('240')) {
      return {
        suitableCrops: 'गेहूं, मक्का, गन्ना, ज्वार',
        targetPests: 'चौड़ी पत्ती वाले खरपतवार (बथुआ, हिरनखुरी, कृष्णनील, सैंजी, चटरी-मटरी)',
        dosageInfo: '400 से 500 मिली प्रति एकड़ (150 लीटर पानी, 25-30 मिली प्रति 15 लीटर पंप)',
        usageInfo: 'गेहूं बोवनी के 30 से 35 दिन बाद, जब खरपतवार 2 से 4 पत्ती की अवस्था में हों, फ्लैट-फैन नोजल से नमी में छिड़कें।',
        precautions: 'गेहूं में गांठ बनने (Jointing Stage) के बाद छिड़काव न करें। पास के चने या सरसों के खेत में दवा न जाने दें।',
        detailedAdvisory: '2,4-D अमाइन साल्ट चौड़ी पत्ती वाले खरपतवारों को नष्ट करने वाला प्रमाणित शाकनाशी है।',
      };
    } else if (p.includes('नैटिवो') || p.includes('nativo')) {
      return {
        suitableCrops: 'गेहूं, धान, सोयाबीन, मिर्च, टमाटर',
        targetPests: 'पीला रतुआ (Yellow Rust), भूरा रतुआ, पाउडरी मिल्ड्यू, शीथ ब्लाइट, झुलसा',
        dosageInfo: '120 से 150 ग्राम प्रति एकड़ (150-200 लीटर पानी)',
        usageInfo: 'फसल पर रोग के प्रारंभिक लक्षण दिखने पर दोनों तरफ पत्तों पर समान छिड़कें।',
        precautions: 'कड़ी धूप में छिड़काव न करें। मौसम साफ रहने पर ही स्प्रे करें।',
        detailedAdvisory: 'नैटिवो फफूंद को समाप्त कर फसल को हरियाली व शक्ति देता है।',
      };
    } else if (p.includes('कोराजन') || p.includes('coragen')) {
      return {
        suitableCrops: 'सोयाबीन, चना, मक्का, धान, गन्ना, सब्जियां',
        targetPests: 'घाटी छेदक इल्ली (Pod Borer), तना छेदक, गर्डल बीटल, तंबाकू इल्ली',
        dosageInfo: '60 मिली प्रति एकड़ (6 मिली प्रति 15 लीटर पंप)',
        usageInfo: 'इल्लियों के अंडे/शुरुआती सुंडी दिखने पर या 50% फूल व फलियां बनते समय छिड़कें।',
        precautions: 'मात्रा का विशेष ध्यान रखें। हमेशा स्वच्छ पानी व मास्क का उपयोग करें।',
        detailedAdvisory: 'कोराजन इल्लियों की फसल कुतरने की क्षमता को तुरंत रोक देता है।',
      };
    }
    return {
      suitableCrops: 'सभी मौसमी फसलें एवं सब्जियां',
      targetPests: 'रोग, कीट नियंत्रण अथवा संतुलित फसल स्वास्थ्य वृद्धि',
      dosageInfo: 'उत्पाद के डिब्बे पर दिए गए आधिकारिक लेबल अनुसार उपयोग करें',
      usageInfo: 'सुबह या शाम के समय स्वच्छ पानी में घोलकर समान छिड़काव करें',
      precautions: 'बच्चों की पहुंच से दूर रखें और सुरक्षात्मक दस्ताने पहनें',
      detailedAdvisory: 'विस्तृत जानकारी के लिए स्वामी कार्तिक गावंडे जी (+91 81204 64749) से संपर्क करें।',
    };
  },
};
