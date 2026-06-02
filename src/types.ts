export type ProductType = 'fisico' | 'virtual' | 'afiliado';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  discount?: number;
  isNew?: boolean;
  stock: number;
  specs?: Record<string, string>;
  funnyReview?: {
    author: string;
    text: string;
    rating: number;
  };
  // Extended fields
  type?: ProductType;
  affiliateLink?: string;
  virtualContent?: string;
  orderBumpId?: string;
  orderBumpDiscount?: number;
  gallery?: string[];
  variations?: ProductVariation[];
  videoUrl?: string;
  shippingType?: 'estimated' | 'national';
  // Quiz-related fields
  tags?: string[];
  estiloVisual?: string[];
  prioridade?: string[];
  perfilRecomendado?: string[];
  popularidade?: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  slug: string;
  imageUrl?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  price: number;
  oldPrice?: number;
  image: string;
  buttonText: string;
  bgStyle?: string;
  link?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'received' | 'processing' | 'warp_drive' | 'delivered' | 'abducted';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    portalName: string;
  };
  trackingCode?: string;
  shippingFee: number;
  userEmail?: string;
  userName?: string;
  couponCode?: string;
  paymentMethod?: string;
}

export interface UserProfile {
  name: string;
  species: 'gray' | 'reptilian' | 'human_girl_rocket' | 'human_boy_rocket' | 'custom';
  homePlanet: string;
  dangerLevel: 'harmless' | 'medium' | 'galaxy_destroyer';
  walletBalance: number;
  isRegistered?: boolean;
  avatarUrl?: string;
  email?: string;
  address?: string;
  password?: string;
  xp?: number;
  aliencoins?: number;
  transactions?: GamificationTransaction[];
}

export interface GamificationTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'xp' | 'coins';
  source: string; // e.g. "Missão concluída", "Cashback" ou "Uso em compra"
  isNegative?: boolean; // Se for gasto em compra, isNegative é true
}

export interface GamificationTask {
  id: string;
  title: string;
  description: string;
  rewardType: 'xp' | 'coins';
  rewardAmount: number;
  isActive: boolean;
  limit: 'once' | 'daily' | 'weekly' | 'unlimited';
}

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;            // percent off or R$ off
  freeShipping: boolean;
  firstPurchaseOnly: boolean;
  nonCumulative: boolean;
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
}

export interface PaymentSettings {
  id: string;
  pixDiscountPercent: number;
  maxInstallments: number;
  installmentMinValue: number;  // minimum per installment
  freeShippingThreshold?: number;
  paymentMethods?: string[];
}

export interface Testimonial {
  id: string;
  authorName: string;
  date: string;
  content: string;
  rating: number;
  authorImage?: string;
  productImage?: string; // Imagem do produto enviado pelo cliente
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  content: string;
  rating: number; // 1-5
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}

export interface StoreSettings {
  row1Title: string;
  row1ProductIds: string[];
  row2Title: string;
  row2ProductIds: string[];
  row3Title: string;
  row3ProductIds: string[];
  gridImages: {
    image1: string;
    link1?: string;
    image2: string;
    link2?: string;
    image3: string;
    link3?: string;
  };
}

// ====================================================
// QUIZ "MONTE SEU SETUP" TYPES
// ====================================================

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface QuizBudgetRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
  icon: string;
}

export interface QuizCharacter {
  id: string;
  name: string;
  avatar: string;
  personality: 'sarcastic' | 'hyper' | 'technical';
  comments: Record<string, string[]>;
}

export interface QuizConfig {
  profiles: QuizOption[];
  budgetRanges: QuizBudgetRange[];
  visualStyles: QuizOption[];
  priorities: QuizOption[];
  characters: QuizCharacter[];
  setupNames: Record<string, string>;
}

export interface QuizAnswers {
  profile: string;
  categories: string[];
  budgetRange: string;
  visualStyle: string;
  priority: string;
}

export interface ScoredProduct {
  product: Product;
  score: number;
  matchReasons: string[];
}

export interface SetupResult {
  name: string;
  subtitle: string;
  classification: string;
  profile: string;
  budgetLabel: string;
  visualStyle: string;
  priority: string;
  products: ScoredProduct[];
  characterComment: { character: QuizCharacter; text: string };
}
