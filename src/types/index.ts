export type Language = 'hi' | 'en';

export type ProductType = 
  | 'कीटनाशक' 
  | 'फफूंदनाशक' 
  | 'खरपतवारनाशक' 
  | 'जैविक उत्पाद' 
  | 'उर्वरक' 
  | 'बीज' 
  | 'अन्य कृषि उत्पाद';

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  brand: string;
  category: string;
  categoryEn?: string;
  crop: string;
  cropEn?: string;
  productType: ProductType;
  productTypeEn?: string;
  packSize: string;
  price: number;
  mrp?: number;
  image: string;
  additionalImages?: string[];
  description: string;
  descriptionEn?: string;
  usageInfo?: string;
  usageInfoEn?: string;
  targetPests?: string;
  targetPestsEn?: string;
  dosageInfo?: string;
  dosageInfoEn?: string;
  precautions?: string;
  precautionsEn?: string;
  inStock: boolean;
  featured: boolean;
  dateAdded: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
  description?: string;
  descriptionEn?: string;
  order: number;
}

export interface Poster {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  image: string;
  buttonText?: string;
  buttonTextEn?: string;
  buttonLink?: string;
  active: boolean;
  order: number;
}

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  crop: string;
  cropEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  content: string;
  contentEn?: string;
  image?: string;
  externalLink?: string;
  date: string;
  author: string;
  published: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRequest {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  village?: string;
  items: {
    productId: string;
    name: string;
    packSize: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  message?: string;
  paymentMethod?: 'upi' | 'cash';
  upiRefNumber?: string;
  paymentStatus?: 'pending' | 'paid' | 'pay_on_delivery';
  date: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
}

export interface CropPrescription {
  cropName: string;
  problem: string;
  infectionType: 'खरपतवार' | 'फफूंद/रोग' | 'कीट/इल्ली' | 'पोषण की कमी' | 'अन्य';
  severity: 'सामान्य' | 'मध्यम' | 'गंभीर';
  recommendedMedicine: string;
  chemicalFormula?: string;
  dosage: string;
  waterRatio: string;
  sprayInstructions: string;
  caution: string;
  matchedProductId?: string;
  matchedProduct?: Product;
}

export interface AIDiagnosisResponse {
  answer: string;
  prescription?: CropPrescription | null;
  recommendedProduct?: Product | null;
}

export interface StoreSettings {
  shopName: string;
  shopNameEn: string;
  ownerName: string;
  ownerNameEn: string;
  officialPhone: string;
  whatsapp: string;
  gmail: string;
  upiId?: string;
  upiName?: string;
  heroHeading: string;
  heroHeadingEn: string;
  heroSubheading: string;
  heroSubheadingEn: string;
  heroImage: string;
  
  // Location details
  address: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;

  // License & Credits
  licenseNumber: string;
  licenseNumberEn: string;
  developerName: string;
  developerEmail: string;

  businessHours: string;
  businessHoursEn: string;
  aboutText: string;
  aboutTextEn: string;
  announcement: string;
  announcementEn: string;
  announcementActive: boolean;
  footerText: string;
  footerTextEn: string;
}

export interface AppData {
  products: Product[];
  categories: Category[];
  posters: Poster[];
  articles: Article[];
  orders: OrderRequest[];
  settings: StoreSettings;
}
