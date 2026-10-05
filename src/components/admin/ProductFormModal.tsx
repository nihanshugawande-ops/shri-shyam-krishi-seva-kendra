import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Plus, Image as ImageIcon, Sparkles, Bot, RefreshCw } from 'lucide-react';
import { Product, ProductType, Category } from '../../types';
import { api } from '../../services/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  productToEdit?: Product | null;
  categories: Category[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [categoryEn, setCategoryEn] = useState('');
  const [crop, setCrop] = useState('');
  const [cropEn, setCropEn] = useState('');
  const [productType, setProductType] = useState<ProductType>('कीटनाशक');
  const [packSize, setPackSize] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [mrp, setMrp] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [usageInfo, setUsageInfo] = useState('');
  const [usageInfoEn, setUsageInfoEn] = useState('');
  const [targetPests, setTargetPests] = useState('');
  const [targetPestsEn, setTargetPestsEn] = useState('');
  const [dosageInfo, setDosageInfo] = useState('');
  const [dosageInfoEn, setDosageInfoEn] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [precautionsEn, setPrecautionsEn] = useState('');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addlFileInputRef = useRef<HTMLInputElement>(null);

  const productTypes: ProductType[] = [
    'कीटनाशक',
    'फफूंदनाशक',
    'खरपतवारनाशक',
    'जैविक उत्पाद',
    'उर्वरक',
    'बीज',
    'अन्य कृषि उत्पाद',
  ];

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setNameEn(productToEdit.nameEn || '');
      setBrand(productToEdit.brand || '');
      setCategory(productToEdit.category || (categories[0]?.name || 'गेहूं'));
      setCategoryEn(productToEdit.categoryEn || '');
      setCrop(productToEdit.crop || '');
      setCropEn(productToEdit.cropEn || '');
      setProductType(productToEdit.productType || 'कीटनाशक');
      setPackSize(productToEdit.packSize || '');
      setPrice(productToEdit.price || '');
      setMrp(productToEdit.mrp || '');
      setImage(productToEdit.image || '');
      setAdditionalImages(productToEdit.additionalImages || []);
      setDescription(productToEdit.description || '');
      setDescriptionEn(productToEdit.descriptionEn || '');
      setUsageInfo(productToEdit.usageInfo || '');
      setUsageInfoEn(productToEdit.usageInfoEn || '');
      setTargetPests(productToEdit.targetPests || '');
      setTargetPestsEn(productToEdit.targetPestsEn || '');
      setDosageInfo(productToEdit.dosageInfo || '');
      setDosageInfoEn(productToEdit.dosageInfoEn || '');
      setPrecautions(productToEdit.precautions || '');
      setPrecautionsEn(productToEdit.precautionsEn || '');
      setInStock(productToEdit.inStock ?? true);
      setFeatured(productToEdit.featured ?? false);
    } else {
      setName('');
      setNameEn('');
      setBrand('');
      setCategory(categories[0]?.name || 'गेहूं');
      setCategoryEn(categories[0]?.nameEn || 'Wheat');
      setCrop('');
      setCropEn('');
      setProductType('कीटनाशक');
      setPackSize('500 ml');
      setPrice('');
      setMrp('');
      setImage('');
      setAdditionalImages([]);
      setDescription('');
      setDescriptionEn('');
      setUsageInfo('');
      setUsageInfoEn('');
      setTargetPests('');
      setTargetPestsEn('');
      setDosageInfo('');
      setDosageInfoEn('');
      setPrecautions('');
      setPrecautionsEn('');
      setInStock(true);
      setFeatured(false);
    }
    setError('');
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // AI Auto-Fill Helper
  const handleAiAutoFill = async () => {
    if (!name.trim()) {
      setError('कृपया पहले उत्पाद का नाम दर्ज करें (जैसे 2,4-D, नैटिवो, कोराजन)');
      return;
    }

    setGeneratingAi(true);
    setError('');
    try {
      const adv = await api.getProductAdvisory(name, brand, productType, crop, 'hi');
      if (adv.suitableCrops && !crop) setCrop(adv.suitableCrops);
      if (adv.targetPests && !targetPests) setTargetPests(adv.targetPests);
      if (adv.dosageInfo && !dosageInfo) setDosageInfo(adv.dosageInfo);
      if (adv.usageInfo && !usageInfo) setUsageInfo(adv.usageInfo);
      if (adv.precautions && !precautions) setPrecautions(adv.precautions);
      if (adv.detailedAdvisory && !description) setDescription(adv.detailedAdvisory);
    } catch {
      setError('AI से जानकारी प्राप्त करने में असमर्थ। आप मैन्युअल रूप से विवरण भर सकते हैं।');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('कृपया केवल मान्य फोटो या इमेज फ़ाइल चुनें');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAdditionalImages((prev) => [...prev, dataUrl]);
    };
    reader.readAsDataURL(file);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('उत्पाद का नाम आवश्यक है / Product name is required');
      return;
    }
    if (!brand.trim()) {
      setError('ब्रांड या कंपनी का नाम आवश्यक है / Brand is required');
      return;
    }
    if (price === '' || isNaN(Number(price))) {
      setError('कृपया मान्य विक्रय मूल्य दर्ज करें / Please enter a valid price');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSave({
        name: name.trim(),
        nameEn: nameEn.trim() || undefined,
        brand: brand.trim(),
        category: category || 'गेहूं',
        categoryEn: categoryEn.trim() || undefined,
        crop: crop.trim() || category,
        cropEn: cropEn.trim() || undefined,
        productType,
        packSize: packSize.trim() || '1 इकाई',
        price: Number(price),
        mrp: mrp !== '' ? Number(mrp) : undefined,
        image,
        additionalImages,
        description: description.trim(),
        descriptionEn: descriptionEn.trim() || undefined,
        usageInfo: usageInfo.trim(),
        usageInfoEn: usageInfoEn.trim() || undefined,
        targetPests: targetPests.trim() || undefined,
        targetPestsEn: targetPestsEn.trim() || undefined,
        dosageInfo: dosageInfo.trim() || undefined,
        dosageInfoEn: dosageInfoEn.trim() || undefined,
        precautions: precautions.trim() || undefined,
        precautionsEn: precautionsEn.trim() || undefined,
        inStock,
        featured,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'उत्पाद सहेजने में त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#181a22] border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#13151b]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{productToEdit ? 'उत्पाद संपादित करें (Edit Product)' : 'नया कृषि उत्पाद जोड़ें (Add Product)'}</span>
            </h3>
            <p className="text-xs text-zinc-400">श्री श्याम कृषि सेवा केंद्र इन्वेंटरी एवं प्रयोग विधि प्रबंधन</p>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Auto-Fill Button */}
            <button
              type="button"
              onClick={handleAiAutoFill}
              disabled={generatingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              {generatingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI खोज रहा है...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>✨ AI से ऑटो-भरें</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              aria-label="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-200">
            {error}
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Section 1: Names (Hindi & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                उत्पाद का नाम (हिंदी) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. 2,4-D मुख्य खरपतवारनाशक, कोराजन"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Product Name (English)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. 2,4-D Amine Salt, Coragen"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                ब्रांड / कंपनी (Brand) *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="उदा. Bayer, FMC, Syngenta, Dhanuka"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Section 2: Types, Category, Crops */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                उत्पाद प्रकार (Type) *
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="w-full px-3 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {productTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                श्रेणी / मुख्य फसल *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const selCat = categories.find((c) => c.name === e.target.value);
                  setCategory(e.target.value);
                  if (selCat?.nameEn) setCategoryEn(selCat.nameEn);
                }}
                className="w-full px-3 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.icon || '🌾'} {c.name} {c.nameEn ? `(${c.nameEn})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                🌾 किन-किन फसलों में डाल सकते हैं
              </label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="उदा. गेहूं, मक्का, गन्ना"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2b: Target Pests / Diseases / Weeds (New Core Requirement) */}
          <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-4">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯 फसल रोग, कीट एवं खरपतवार जानकारी (किस-किस चीज के लिए डाल सकते हैं)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  किस-किस रोग / कीट / खरपतवार के लिए डाल सकते हैं (हिंदी)
                </label>
                <input
                  type="text"
                  value={targetPests}
                  onChange={(e) => setTargetPests(e.target.value)}
                  placeholder="उदा. चौड़ी पत्ती के खरपतवार (बथुआ, हिरनखुरी, कृष्णनील, सैंजी)"
                  className="w-full px-3.5 py-2 text-xs text-white bg-zinc-950 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Target Pests / Diseases / Weeds (English)
                </label>
                <input
                  type="text"
                  value={targetPestsEn}
                  onChange={(e) => setTargetPestsEn(e.target.value)}
                  placeholder="e.g. Broadleaf weeds like Bathua, Hirankhuri, Chenopodium"
                  className="w-full px-3.5 py-2 text-xs text-white bg-zinc-950 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  🧪 छिड़काव मात्रा एवं पानी (Dosage & Dilution Ratio)
                </label>
                <input
                  type="text"
                  value={dosageInfo}
                  onChange={(e) => setDosageInfo(e.target.value)}
                  placeholder="उदा. 400 से 500 मिली प्रति एकड़ (150 लीटर पानी, 25 मिली प्रति पंप)"
                  className="w-full px-3.5 py-2 text-xs text-white bg-zinc-950 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  ⚠️ विशेष सावधानियां (Safety Precautions)
                </label>
                <input
                  type="text"
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  placeholder="उदा. गांठ बनने के बाद छिड़काव न करें, तेज हवा में न करें"
                  className="w-full px-3.5 py-2 text-xs text-white bg-zinc-950 border border-zinc-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Pack Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                पैकिंग साइज (Pack Size) *
              </label>
              <input
                type="text"
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                placeholder="उदा. 400 ml, 500 gm, 1 L"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                दुकान मूल्य (₹ Price) *
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="उदा. 260"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                एम.आर.पी. (₹ MRP - यदि हो)
              </label>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="उदा. 310"
                className="w-full px-3.5 py-2 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                उत्पाद फोटो (Image Upload)
              </span>
              <span className="text-[11px] text-zinc-500">
                फोन या कंप्यूटर से अपलोड करें
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-28 h-28 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 text-zinc-500">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 text-zinc-600" />
                    <span className="text-[10px]">कोई फोटो नहीं</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>फोटो चुनें (Upload File)</span>
                </button>
                <p className="text-[11px] text-zinc-500">PNG, JPG या WEBP (अधिकतम 10MB)</p>
              </div>
            </div>
          </div>

          {/* Section 5: Descriptions (Hindi & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                उत्पाद विवरण (Hindi Description)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="फसल कीट या बीमारी रोकथाम विवरण..."
                className="w-full px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Product Description (English)
              </label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Target pests, active ingredients, crop benefits..."
                className="w-full px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 6: Usage Instructions (Hindi & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                🚜 छिड़काव विधि व समय (Hindi Usage Instructions)
              </label>
              <textarea
                rows={2}
                value={usageInfo}
                onChange={(e) => setUsageInfo(e.target.value)}
                placeholder="उदा. गेहूं बोवनी के 30-35 दिन बाद, जब खरपतवार 2-4 पत्ती पर हों, कट नोजल से छिड़कें।"
                className="w-full px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Usage Instructions (English)
              </label>
              <textarea
                rows={2}
                value={usageInfoEn}
                onChange={(e) => setUsageInfoEn(e.target.value)}
                placeholder="e.g. Apply at 30-35 days after sowing with flat-fan nozzle."
                className="w-full px-3.5 py-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 7: Status Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-zinc-800 border-zinc-700"
              />
              <div>
                <span className="text-sm font-semibold text-white">स्टॉक में उपलब्ध है (In Stock)</span>
                <p className="text-[11px] text-zinc-400">टिक हटाने पर &ldquo;स्टॉक में उपलब्ध नहीं&rdquo; दिखेगा</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-zinc-800 border-zinc-700"
              />
              <div>
                <span className="text-sm font-semibold text-white">प्रमुख उत्पाद (Featured)</span>
                <p className="text-[11px] text-zinc-400">होमपेज के विशेष अनुभाग में प्रदर्शित करें</p>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
            >
              {saving ? 'सहेजा जा रहा है...' : 'उत्पाद सहेजें (Save Product)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
