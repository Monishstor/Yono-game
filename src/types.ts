export type AppCategory = 
  | 'all'
  | 'trending'
  | 'new'
  | 'high_bonus'
  | 'low_withdrawal'
  | 'rummy_teenpatti'
  | 'slots_casino'
  | 'aviator_mines';

export interface YonoApp {
  id: string;
  name: string;
  tagline: string;
  imageUrl?: string; // Custom uploaded image (data URL or web URL)
  downloadUrl?: string; // Custom direct APK download link
  category: AppCategory[];
  signupBonus: number;
  maxSignupBonus?: number;
  minWithdrawal: number;
  referBonus: number;
  referCommission: string;
  rating: number;
  reviewsCount: number;
  downloads: string;
  apkSize: string;
  version: string;
  releaseDate: string;
  badge?: string; // e.g. "HOT", "NEW 2026", "TOP CHOICE", "₹1500 BONUS", "FAST PAY"
  colorTheme: string; // Tailwind gradient/accent color
  iconGradient: string;
  iconSymbol: string;
  gamesList: string[];
  paymentMethods: string[];
  instantWithdrawal: boolean;
  vipLevels: number;
  dailyBonusEligible: boolean;
  referCode: string;
  description: string;
  features: string[];
  withdrawalSpeed: string; // e.g. "1-5 Minutes"
  safetyScore: number; // e.g. 99%
  isCustom?: boolean; // Tag for user-added apps
}

export interface PromoCode {
  code: string;
  title: string;
  reward: string;
  expiry: string;
  appTarget: string;
  usesLeft: number;
  status: 'Active' | 'Hot' | 'Expiring Soon';
}

export interface WithdrawalRecord {
  id: string;
  user: string;
  phoneMasked: string;
  amount: number;
  appName: string;
  method: 'UPI' | 'Paytm' | 'IMPS Bank' | 'PhonePe';
  timeAgo: string;
  status: 'Success';
}

export interface TickerNotice {
  id: string;
  type: 'sparkles' | 'zap' | 'shield' | 'flame' | 'gift';
  text: string;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  siteAuthor?: string;
  googleSiteVerification?: string;
  robotsDirective?: string;
  telegramLink: string;
  telegramSubscribers: string;
  whatsappSupport?: string;
  whatsappShareText?: string;
  showTicker: boolean;
  showAgeDisclaimer: boolean;
  showPlayProtectBadge: boolean;
  notices: TickerNotice[];
  adminPin: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'bonus' | 'withdrawal' | 'download' | 'referral' | 'general';
}
