import React, { useState } from 'react';
import {
  Package,
  Layers,
  Image as ImageIcon,
  BookOpen,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  Search,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { AppData, Product, Category, Poster, Article, StoreSettings, OrderRequest } from '../../types';
import { api } from '../../services/api';
import { ProductFormModal } from './ProductFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminDashboardProps {
  data: AppData;
  onRefreshData: () => Promise<void>;
  onClose: () => void;
}

type TabType = 'overview' | 'products' | 'orders' | 'categories' | 'posters' | 'articles' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onRefreshData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Deletion state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'product' | 'category' | 'poster' | 'article' | 'order';
    name: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Product table search & filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Category addition & editing state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('🌾');
  const [savingCategory, setSavingCategory] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatNameEn, setEditCatNameEn] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('🌾');

  // Poster modal/form state
  const [posterTitle, setPosterTitle] = useState('');
  const [posterTitleEn, setPosterTitleEn] = useState('');
  const [posterSubtitle, setPosterSubtitle] = useState('');
  const [posterSubtitleEn, setPosterSubtitleEn] = useState('');
  const [posterImage, setPosterImage] = useState('');
  const [posterButtonText, setPosterButtonText] = useState('दवाइयाँ देखें');
  const [posterButtonTextEn, setPosterButtonTextEn] = useState('View Medicines');
  const [posterButtonLink, setPosterButtonLink] = useState('#products');
  const [editingPosterId, setEditingPosterId] = useState<string | null>(null);
  const [showPosterForm, setShowPosterForm] = useState(false);

  // Article state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleTitleEn, setArticleTitleEn] = useState('');
  const [articleCrop, setArticleCrop] = useState('');
  const [articleCropEn, setArticleCropEn] = useState('');
  const [articleCategory, setArticleCategory] = useState('फसल सुरक्षा / Crop Care');
  const [articleDesc, setArticleDesc] = useState('');
  const [articleDescEn, setArticleDescEn] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleContentEn, setArticleContentEn] = useState('');
  const [articleImage, setArticleImage] = useState('');
  const [articleLink, setArticleLink] = useState('');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...data.settings });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsMsg, setGpsMsg] = useState<string | null>(null);

  const handleDetectAdminGps = () => {
    if (!navigator.geolocation) {
      alert('GPS Not Supported');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSettingsForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        }));
        setGpsMsg(`✓ वर्तमान GPS स्थिति प्राप्त: ${lat.toFixed(4)}, ${lng.toFixed(4)} (दुकान की लोकेशन सेट हो गई)`);
        setTimeout(() => setGpsMsg(null), 5000);
      },
      (err) => {
        setDetectingGps(false);
        alert('GPS अनुमति नहीं मिली या सिग्नल उपलब्ध नहीं है।');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // Quick stats
  const totalProducts = data.products.length;
  const inStockProducts = data.products.filter((p) => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const featuredProducts = data.products.filter((p) => p.featured).length;
  const totalCategories = data.categories.length;
  const totalOrders = data.orders?.length || 0;
  const pendingOrders = (data.orders || []).filter((o) => o.status === 'pending').length;

  // Filter products for admin table
  const filteredProducts = data.products.filter((p) => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
      return false;
    }
    return true;
  });

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productData);
    } else {
      await api.addProduct(productData as any);
    }
    await onRefreshData();
  };

  const handleToggleStock = async (product: Product) => {
    await api.updateProduct(product.id, { inStock: !product.inStock });
    await onRefreshData();
  };

  const handleToggleFeatured = async (product: Product) => {
    await api.updateProduct(product.id, { featured: !product.featured });
    await onRefreshData();
  };

  const promptDelete = (
    id: string,
    type: 'product' | 'category' | 'poster' | 'article' | 'order',
    name: string
  ) => {
    setItemToDelete({ id, type, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);

    try {
      if (itemToDelete.type === 'product') {
        await api.deleteProduct(itemToDelete.id);
      } else if (itemToDelete.type === 'category') {
        await api.deleteCategory(itemToDelete.id);
      } else if (itemToDelete.type === 'poster') {
        await api.deletePoster(itemToDelete.id);
      } else if (itemToDelete.type === 'article') {
        await api.deleteArticle(itemToDelete.id);
      } else if (itemToDelete.type === 'order') {
        await api.deleteOrder(itemToDelete.id);
      }
      await onRefreshData();
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    await api.addCategory(newCategoryName.trim(), newCategoryNameEn.trim(), newCategoryIcon || '🌾');
    setNewCategoryName('');
    setNewCategoryNameEn('');
    setSavingCategory(false);
    await onRefreshData();
  };

  const handleStartEditCat = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatNameEn(cat.nameEn || '');
    setEditCatIcon(cat.icon || '🌾');
  };

  const handleCancelEditCat = () => {
    setEditingCatId(null);
    setEditCatName('');
    setEditCatNameEn('');
    setEditCatIcon('🌾');
  };

  const handleSaveEditCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatId || !editCatName.trim()) return;
    setSavingCategory(true);
    await api.updateCategory(editingCatId, {
      name: editCatName.trim(),
      nameEn: editCatNameEn.trim(),
      icon: editCatIcon || '🌾',
    });
    setSavingCategory(false);
    setEditingCatId(null);
    await onRefreshData();
  };

  const handleSavePoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterTitle.trim()) return;

    if (editingPosterId) {
      await api.updatePoster(editingPosterId, {
        title: posterTitle,
        titleEn: posterTitleEn,
        subtitle: posterSubtitle,
        subtitleEn: posterSubtitleEn,
        image: posterImage,
        buttonText: posterButtonText,
        buttonTextEn: posterButtonTextEn,
        buttonLink: posterButtonLink,
      });
    } else {
      await api.addPoster({
        title: posterTitle,
        titleEn: posterTitleEn,
        subtitle: posterSubtitle,
        subtitleEn: posterSubtitleEn,
        image: posterImage,
        buttonText: posterButtonText,
        buttonTextEn: posterButtonTextEn,
        buttonLink: posterButtonLink,
        active: true,
      });
    }
    setShowPosterForm(false);
    setEditingPosterId(null);
    setPosterTitle('');
    setPosterTitleEn('');
    setPosterSubtitle('');
    setPosterSubtitleEn('');
    setPosterImage('');
    await onRefreshData();
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;

    if (editingArticleId) {
      await api.updateArticle(editingArticleId, {
        title: articleTitle,
        titleEn: articleTitleEn,
        crop: articleCrop || 'सामान्य',
        cropEn: articleCropEn,
        category: articleCategory,
        description: articleDesc,
        descriptionEn: articleDescEn,
        content: articleContent,
        contentEn: articleContentEn,
        image: articleImage,
        externalLink: articleLink,
      });
    } else {
      await api.addArticle({
        title: articleTitle,
        titleEn: articleTitleEn,
        crop: articleCrop || 'सामान्य',
        cropEn: articleCropEn,
        category: articleCategory,
        description: articleDesc,
        descriptionEn: articleDescEn,
        content: articleContent,
        contentEn: articleContentEn,
        image: articleImage,
        externalLink: articleLink,
        author: data.settings.ownerName || 'कार्तिक गावंडे',
        published: true,
      });
    }
    setShowArticleForm(false);
    setEditingArticleId(null);
    setArticleTitle('');
    setArticleTitleEn('');
    setArticleCrop('');
    setArticleCropEn('');
    setArticleDesc('');
    setArticleDescEn('');
    setArticleContent('');
    setArticleContentEn('');
    setArticleImage('');
    setArticleLink('');
    await onRefreshData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderRequest['status']) => {
    await api.updateOrderStatus(orderId, status);
    await onRefreshData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    await api.updateSettings(settingsForm);
    setSavingSettings(false);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
    await onRefreshData();
  };

  const handleLogout = () => {
    api.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#101115] flex flex-col">
      {/* Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-[#161820] border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm">
            कृ
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {data.settings.shopName} — एडमिन डैशबोर्ड
            </h1>
            <p className="text-[11px] text-zinc-400">
              स्वामी: {data.settings.ownerName} ({data.settings.officialPhone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onRefreshData}
            title="रीफ्रेश करें"
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>वेबसाइट देखें</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#14151c] border-r border-zinc-800 p-3 sm:p-4 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>डैशबोर्ड अवलोकन</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>उत्पाद प्रबंधन ({data.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>ऑर्डर व पूछताछ ({totalOrders})</span>
            </div>
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-black">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>फसल श्रेणियां ({data.categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posters')}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'posters'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>होमपेज बैनर/पोस्टर ({data.posters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ज्ञान केंद्र लेख ({data.articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>वेबसाइट व संपर्क सेटिंग्स</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">डैशबोर्ड अवलोकन</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  दुकान के कुल उत्पाद, स्टॉक स्थिति, प्राप्त ऑर्डर अनुरोध एवं त्वरित कार्य
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-xl bg-[#181a22] border border-zinc-800">
                  <div className="text-xs text-zinc-400">कुल उत्पाद</div>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                    {totalProducts}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181a22] border border-zinc-800">
                  <div className="text-xs text-emerald-400">स्टॉक में उपलब्ध</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                    {inStockProducts}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181a22] border border-zinc-800">
                  <div className="text-xs text-rose-400">स्टॉक नहीं</div>
                  <div className="text-2xl font-bold text-rose-400 mt-1 tabular-nums">
                    {outOfStockProducts}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181a22] border border-zinc-800">
                  <div className="text-xs text-zinc-300">प्रमुख उत्पाद</div>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                    {featuredProducts}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181a22] border border-zinc-800">
                  <div className="text-xs text-emerald-400">ऑर्डर अनुरोध</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                    {totalOrders}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181a22] border border-zinc-800">
                  <div className="text-xs text-zinc-400">कुल श्रेणियां</div>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                    {totalCategories}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800">
                <h3 className="text-sm font-bold text-white mb-3">त्वरित कार्य</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>नया उत्पाद जोड़ें</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>ऑर्डर / पूछताछ देखें ({pendingOrders} लंबित)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>दुकान फोन, पता व Gmail बदलें</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">कृषि उत्पाद प्रबंधन</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    हिंदी एवं अंग्रेजी विवरण, फोटो, मूल्य व स्टॉक नियंत्रित करें
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>नया उत्पाद जोड़ें (Add Product)</span>
                </button>
              </div>

              {/* Search Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#161820] p-3 rounded-xl border border-zinc-800">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="उत्पाद, कंपनी या श्रेणी खोजें..."
                    className="w-full pl-9 pr-4 py-1.5 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none"
                >
                  <option value="all">सभी श्रेणियां</option>
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-[#181a22] border border-zinc-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#14151b] text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">उत्पाद (Name)</th>
                        <th className="py-3 px-4">कंपनी</th>
                        <th className="py-3 px-4">श्रेणी / प्रकार</th>
                        <th className="py-3 px-4">🌾 उपयुक्त फसलें</th>
                        <th className="py-3 px-4">🎯 रोग / खरपतवार</th>
                        <th className="py-3 px-4">पैकिंग</th>
                        <th className="py-3 px-4">मूल्य</th>
                        <th className="py-3 px-4 text-center">स्टॉक</th>
                        <th className="py-3 px-4 text-center">प्रमुख</th>
                        <th className="py-3 px-4 text-right">कार्य</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            <div>{p.name}</div>
                            {p.nameEn && <div className="text-[11px] text-zinc-400">{p.nameEn}</div>}
                          </td>
                          <td className="py-3 px-4 text-zinc-300">{p.brand}</td>
                          <td className="py-3 px-4 text-zinc-400">
                            {p.category} ({p.productType})
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/50 text-emerald-300 text-[11px] font-medium whitespace-nowrap">
                              {p.crop || p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-[11px] text-amber-300/90 max-w-[200px] truncate" title={p.targetPests}>
                              {p.targetPests || '-'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-zinc-200 font-mono">{p.packSize}</td>
                          <td className="py-3 px-4 font-bold text-white tabular-nums">
                            ₹{p.price}
                            {p.mrp && (
                              <span className="text-[10px] text-zinc-500 block font-normal line-through">
                                ₹{p.mrp}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                                  : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                              }`}
                            >
                              {p.inStock ? 'उपलब्ध' : 'स्टॉक नहीं'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1 rounded cursor-pointer ${
                                p.featured ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg cursor-pointer"
                                title="संपादित करें"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => promptDelete(p.id, 'product', p.name)}
                                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                                title="हटाएं"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-12 text-center text-xs text-zinc-400">
                    कोई उत्पाद नहीं मिला
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS / ENQUIRIES */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">ग्राहक ऑर्डर एवं पूछताछ सूची</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  वेबसाइट कार्ट के माध्यम से किसानों द्वारा भेजे गए ऑर्डर अनुरोध
                </p>
              </div>

              <div className="space-y-4">
                {(data.orders || []).length > 0 ? (
                  data.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                              {ord.id}
                            </span>
                            <span className="text-sm font-bold text-white">{ord.customerName}</span>
                            <span className="text-xs text-emerald-400 font-mono">
                              📞 {ord.phone}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentMethod === 'upi'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            }`}>
                              {ord.paymentMethod === 'upi' ? '⚡ ऑनलाइन UPI' : '💵 नकद (Cash)'}
                            </span>
                            {ord.upiRefNumber && (
                              <span className="text-[11px] font-mono text-zinc-300">
                                UTR: {ord.upiRefNumber}
                              </span>
                            )}
                            <span>·</span>
                            <span>{ord.village && `गांव: ${ord.village}`} {ord.address && `(${ord.address})`}</span>
                            <span>·</span>
                            <span>{new Date(ord.date).toLocaleString('hi-IN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value as OrderRequest['status'])
                            }
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                              ord.status === 'completed'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                                : ord.status === 'contacted'
                                ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                                : 'bg-amber-950/80 text-amber-400 border-amber-800'
                            }`}
                          >
                            <option value="pending">लंबित (Pending)</option>
                            <option value="contacted">संपर्क किया (Contacted)</option>
                            <option value="completed">पूर्ण / डिलीवर (Completed)</option>
                            <option value="cancelled">रद्द (Cancelled)</option>
                          </select>

                          <a
                            href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 rounded-lg border border-emerald-800/40"
                            title="WhatsApp Chat"
                          >
                            WhatsApp
                          </a>

                          <button
                            onClick={() => promptDelete(ord.id, 'order', `${ord.customerName} का ऑर्डर`)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-zinc-800/60">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                            <span className="text-zinc-200">
                              {item.name} ({item.packSize}) x {item.quantity}
                            </span>
                            <span className="font-mono text-zinc-300">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                        <span className="text-zinc-400 italic">
                          {ord.message ? `संदेश: "${ord.message}"` : 'कोई विशेष संदेश नहीं'}
                        </span>
                        <div className="font-bold text-white text-sm">
                          कुल योग: <span className="text-emerald-400">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-xs text-zinc-400 bg-[#161820] rounded-2xl border border-zinc-800">
                    अभी कोई ऑर्डर अनुरोध प्राप्त नहीं हुआ है।
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">फसल श्रेणियां (Categories)</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  वेबसाइट पर प्रदर्शित होने वाली फसल श्रेणियां प्रबंधित करें
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800">
                <h3 className="text-sm font-bold text-white mb-3">नई श्रेणी जोड़ें</h3>
                <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                    placeholder="आइकॉन (🌾)"
                    className="px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl text-center"
                  />
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="नाम (हिंदी) उदा. चना"
                    className="px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    value={newCategoryNameEn}
                    onChange={(e) => setNewCategoryNameEn(e.target.value)}
                    placeholder="Name (English) e.g. Gram"
                    className="px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                  />
                  <button
                    type="submit"
                    disabled={savingCategory}
                    className="px-5 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 cursor-pointer"
                  >
                    {savingCategory ? 'जोड़ा जा रहा है...' : 'श्रेणी जोड़ें'}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl bg-[#181a22] border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
                {data.categories.map((c) => (
                  <div key={c.id} className="p-4">
                    {editingCatId === c.id ? (
                      <form onSubmit={handleSaveEditCat} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
                        <input
                          type="text"
                          value={editCatIcon}
                          onChange={(e) => setEditCatIcon(e.target.value)}
                          placeholder="🌾"
                          className="px-2.5 py-1.5 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-lg text-center"
                        />
                        <input
                          type="text"
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          placeholder="नाम (हिंदी)"
                          className="px-3 py-1.5 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-lg"
                          required
                        />
                        <input
                          type="text"
                          value={editCatNameEn}
                          onChange={(e) => setEditCatNameEn(e.target.value)}
                          placeholder="Name (English)"
                          className="px-3 py-1.5 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            disabled={savingCategory}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg cursor-pointer"
                          >
                            सहेजें
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditCat}
                            className="px-3 py-1.5 text-xs text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer"
                          >
                            रद्द करें
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{c.icon || '🌾'}</span>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {c.name} {c.nameEn && <span className="text-xs text-zinc-400">({c.nameEn})</span>}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {data.products.filter((p) => p.category === c.name).length} उत्पाद जुड़े हैं
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditCat(c)}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer"
                            title="संपादित करें"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => promptDelete(c.id, 'category', c.name)}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: POSTERS */}
          {activeTab === 'posters' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">होमपेज बैनर एवं पोस्टर</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    होमपेज स्लाइडर में दिखने वाले मुख्य प्रचारक बैनर प्रबंधित करें
                  </p>
                </div>
                {!showPosterForm && (
                  <button
                    onClick={() => {
                      setEditingPosterId(null);
                      setPosterTitle('');
                      setPosterTitleEn('');
                      setPosterSubtitle('');
                      setPosterSubtitleEn('');
                      setPosterImage('');
                      setShowPosterForm(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>नया बैनर जोड़ें</span>
                  </button>
                )}
              </div>

              {showPosterForm && (
                <form onSubmit={handleSavePoster} className="p-5 rounded-2xl bg-[#181a22] border border-zinc-700 space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    {editingPosterId ? 'बैनर संपादित करें' : 'नया बैनर जोड़ें'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">शीर्षक (हिंदी) *</label>
                      <input
                        type="text"
                        value={posterTitle}
                        onChange={(e) => setPosterTitle(e.target.value)}
                        placeholder="उदा. आपकी फसल — हमारी प्राथमिकता"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={posterTitleEn}
                        onChange={(e) => setPosterTitleEn(e.target.value)}
                        placeholder="e.g. Your Crop — Our Priority"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">उप-शीर्षक (हिंदी)</label>
                      <input
                        type="text"
                        value={posterSubtitle}
                        onChange={(e) => setPosterSubtitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Subtitle (English)</label>
                      <input
                        type="text"
                        value={posterSubtitleEn}
                        onChange={(e) => setPosterSubtitleEn(e.target.value)}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1">बैनर फोटो (Image URL)</label>
                    <input
                      type="text"
                      value={posterImage}
                      onChange={(e) => setPosterImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPosterForm(false)}
                      className="px-4 py-2 text-xs text-zinc-300 bg-zinc-800 rounded-lg cursor-pointer"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg cursor-pointer"
                    >
                      सहेजें
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {data.posters.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-[#181a22] border border-zinc-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      {p.titleEn && <div className="text-xs text-zinc-400">{p.titleEn}</div>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await api.updatePoster(p.id, { active: !p.active });
                          await onRefreshData();
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          p.active ? 'bg-zinc-800 text-emerald-400 border border-zinc-700' : 'bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {p.active ? 'सक्रिय' : 'निष्क्रिय'}
                      </button>

                      <button
                        onClick={() => promptDelete(p.id, 'poster', p.title)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">कृषि ज्ञान केंद्र लेख (Knowledge Hub)</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    फसल रोग, कीट प्रबंधन, सिंचाई व मिट्टी जांच की वैज्ञानिक जानकारी प्रकाशित करें
                  </p>
                </div>
                {!showArticleForm && (
                  <button
                    onClick={() => {
                      setEditingArticleId(null);
                      setArticleTitle('');
                      setArticleTitleEn('');
                      setArticleCrop('');
                      setArticleCropEn('');
                      setArticleDesc('');
                      setArticleDescEn('');
                      setArticleContent('');
                      setArticleContentEn('');
                      setArticleImage('');
                      setArticleLink('');
                      setShowArticleForm(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>नया लेख जोड़ें</span>
                  </button>
                )}
              </div>

              {showArticleForm && (
                <form onSubmit={handleSaveArticle} className="p-5 rounded-2xl bg-[#181a22] border border-zinc-700 space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    {editingArticleId ? 'लेख संपादित करें' : 'नया लेख जोड़ें'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">लेख शीर्षक (हिंदी) *</label>
                      <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={articleTitleEn}
                        onChange={(e) => setArticleTitleEn(e.target.value)}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">विषय श्रेणी (Category)</label>
                      <select
                        value={articleCategory}
                        onChange={(e) => setArticleCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      >
                        <option value="फसल जानकारी / Crop Info">🌾 फसल जानकारी (Crop Info)</option>
                        <option value="कीट प्रबंधन / Pest Management">🪲 कीट प्रबंधन (Pest Management)</option>
                        <option value="रोग निवारण / Disease Control">🍄 रोग निवारण (Disease Control)</option>
                        <option value="मृदा परीक्षण / Soil Health">🧪 मृदा परीक्षण (Soil Health)</option>
                        <option value="सिंचाई तकनीक / Irrigation">💧 सिंचाई तकनीक (Irrigation)</option>
                        <option value="फसल सुरक्षा / Crop Care">🌿 फसल सुरक्षा (Crop Care)</option>
                        <option value="बीज जानकारी / Seed Info">🌱 उन्नत बीज (Seed Info)</option>
                        <option value="सामान्य कृषि ज्ञान / General Agriculture">📚 सामान्य ज्ञान (General)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">संबंधित फसल (Crop)</label>
                      <input
                        type="text"
                        value={articleCrop}
                        onChange={(e) => setArticleCrop(e.target.value)}
                        placeholder="उदा. गेहूं / सोयाबीन"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1">संक्षिप्त सारांश (Hindi)</label>
                    <textarea
                      rows={2}
                      value={articleDesc}
                      onChange={(e) => setArticleDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1">विस्तृत सामग्री (Hindi Content)</label>
                    <textarea
                      rows={4}
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1">फोटो लिंक (Image URL)</label>
                    <input
                      type="text"
                      value={articleImage}
                      onChange={(e) => setArticleImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowArticleForm(false)}
                      className="px-4 py-2 text-xs text-zinc-300 bg-zinc-800 rounded-lg cursor-pointer"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg cursor-pointer"
                    >
                      सहेजें
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {data.articles.map((art) => (
                  <div key={art.id} className="p-4 rounded-xl bg-[#181a22] border border-zinc-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-emerald-400">{art.crop}</span>
                        <span className="text-[10px] text-zinc-500">· {art.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{art.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await api.updateArticle(art.id, { published: !art.published });
                          await onRefreshData();
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          art.published ? 'bg-zinc-800 text-emerald-400 border border-zinc-700' : 'bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {art.published ? 'प्रकाशित' : 'अप्रकाशित'}
                      </button>

                      <button
                        onClick={() => promptDelete(art.id, 'article', art.title)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">वेबसाइट सामग्री, स्थान व संपर्क सेटिंग्स</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  दुकान का नाम, स्वामी, फोन, व्हाट्सएप, Gmail, पता, Google Maps व सूचनाएं बदलें
                </p>
              </div>

              {settingsSavedMessage && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200">
                  सेटिंग्स सफलतापूर्वक सहेजी गईं!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. Identity & Contacts */}
                <div className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>प्रतिष्ठान एवं संपर्क विवरण</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">दुकान का नाम (हिंदी)</label>
                      <input
                        type="text"
                        value={settingsForm.shopName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Shop Name (English)</label>
                      <input
                        type="text"
                        value={settingsForm.shopNameEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopNameEn: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">स्वामी (Owner Hindi)</label>
                      <input
                        type="text"
                        value={settingsForm.ownerName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Owner Name (English)</label>
                      <input
                        type="text"
                        value={settingsForm.ownerNameEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerNameEn: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">
                        आधिकारिक फोन (Official Phone) *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.officialPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, officialPhone: e.target.value })}
                        placeholder="+91 81204 64749"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">व्हाट्सएप (WhatsApp) *</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        placeholder="+91 81204 64749"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">
                        Gmail (मालिक बाद में दर्ज करेंगे)
                      </label>
                      <input
                        type="email"
                        value={settingsForm.gmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gmail: e.target.value })}
                        placeholder="owner@gmail.com"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Detailed Location System */}
                <div className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>दुकान स्थान एवं नेविगेशन विवरण (Location System)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">दुकान का पता (Street / Road)</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">गांव / क्षेत्र (Village / Area)</label>
                      <input
                        type="text"
                        value={settingsForm.village}
                        onChange={(e) => setSettingsForm({ ...settingsForm, village: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">तहसील (Tehsil)</label>
                      <input
                        type="text"
                        value={settingsForm.tehsil}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tehsil: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">जिला (District)</label>
                      <input
                        type="text"
                        value={settingsForm.district}
                        onChange={(e) => setSettingsForm({ ...settingsForm, district: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">राज्य (State)</label>
                      <input
                        type="text"
                        value={settingsForm.state}
                        onChange={(e) => setSettingsForm({ ...settingsForm, state: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">पिन कोड (PIN)</label>
                      <input
                        type="text"
                        value={settingsForm.pincode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-zinc-300 font-semibold">Google Maps Link</label>
                      <button
                        type="button"
                        onClick={handleDetectAdminGps}
                        disabled={detectingGps}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{detectingGps ? 'GPS खोजा जा रहा है...' : '📍 मेरी वर्तमान डिवाइस GPS से लोकेशन भरें'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={settingsForm.googleMapsUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    />
                    {gpsMsg && (
                      <div className="mt-1.5 text-[11px] text-emerald-400 font-medium">
                        {gpsMsg}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">अक्षांश (Latitude)</label>
                      <input
                        type="number"
                        step="any"
                        value={settingsForm.latitude || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, latitude: parseFloat(e.target.value) || null })}
                        placeholder="23.0215"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">देशांतर (Longitude)</label>
                      <input
                        type="number"
                        step="any"
                        value={settingsForm.longitude || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, longitude: parseFloat(e.target.value) || null })}
                        placeholder="76.7214"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Shop Hours, License & Tech Credits */}
                <div className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>दुकान समय, अनुज्ञप्ति एवं तकनीकी सह-संस्थापक (Credentials & Timing)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">दुकान समय (हिंदी)</label>
                      <input
                        type="text"
                        value={settingsForm.businessHours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                        placeholder="सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Operating Hours (English)</label>
                      <input
                        type="text"
                        value={settingsForm.businessHoursEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, businessHoursEn: e.target.value })}
                        placeholder="07:00 AM to 08:00 PM (Open All Days)"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-semibold mb-1">
                      अधिकृत शासकीय अनुज्ञप्ति / लाइसेंस (Shop License)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.licenseNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, licenseNumber: e.target.value })}
                      placeholder="अधिकृत कृषि रसायन एवं बीज विक्रय अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024"
                      className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">
                        वेबसाइट निर्माण / तकनीकी सह-संस्थापक (Co-Founder & Web Partner)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.developerName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, developerName: e.target.value })}
                        placeholder="Nexa"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">
                        डेवलपर ईमेल (Developer Email)
                      </label>
                      <input
                        type="email"
                        value={settingsForm.developerEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, developerEmail: e.target.value })}
                        placeholder="nexa.com.in21@gmail.com"
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Hero & Notice */}
                <div className="p-5 rounded-2xl bg-[#181a22] border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">हीरो एवं शीर्ष सूचना (Bilingual)</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">हीरो हेडिंग (हिंदी)</label>
                      <input
                        type="text"
                        value={settingsForm.heroHeading}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Hero Heading (English)</label>
                      <input
                        type="text"
                        value={settingsForm.heroHeadingEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadingEn: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">उप-शीर्षक (हिंदी)</label>
                      <input
                        type="text"
                        value={settingsForm.heroSubheading}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 font-semibold mb-1">Subheading (English)</label>
                      <input
                        type="text"
                        value={settingsForm.heroSubheadingEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadingEn: e.target.value })}
                        className="w-full px-3 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {savingSettings ? 'सहेजा जा रहा है...' : 'सभी सेटिंग्स सहेजें (Save All Settings)'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
        categories={data.categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        title="क्या आप इस उत्पाद को हटाना चाहते हैं?"
        itemName={itemToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        confirmLoading={deleteLoading}
      />
    </div>
  );
};
