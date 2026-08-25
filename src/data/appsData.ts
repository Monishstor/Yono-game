import { YonoApp, AppCategory } from '../types';

export const CATEGORY_TABS: { id: AppCategory; label: string; icon?: string; badge?: string }[] = [
  { id: 'all', label: 'All Yono Games' },
  { id: 'trending', label: '🔥 Trending 2026', badge: 'HOT' },
  { id: 'new', label: '✨ Newly Launched' },
  { id: 'high_bonus', label: '💰 Max Bonus (₹500+)' },
  { id: 'low_withdrawal', label: '⚡ Min ₹100 Withdrawal' },
  { id: 'rummy_teenpatti', label: '🃏 Rummy & Teen Patti' },
  { id: 'slots_casino', label: '🎰 Slots & Casino' },
  { id: 'aviator_mines', label: '🚀 Aviator & Mines' },
];

// Real Verified Yono Apps List
export const YONO_APPS: YonoApp[] = [
  {
    id: 'yono-games-official',
    name: 'Yono Games',
    tagline: 'Get ₹50 Free Welcome Bonus + 7-Day ₹100 Login & 100% Extra Deposit Bonus',
    imageUrl: '/yono-games-logo.svg',
    downloadUrl: 'https://youonogamespartner.com/?code=RRTN8BM3&t=1787657824',
    category: ['all', 'trending', 'new', 'high_bonus', 'low_withdrawal', 'rummy_teenpatti', 'slots_casino', 'aviator_mines'],
    signupBonus: 50,
    maxSignupBonus: 5000,
    minWithdrawal: 100,
    referBonus: 100,
    referCommission: '60% Lifetime Cashback',
    rating: 4.9,
    reviewsCount: 154200,
    downloads: '10M+',
    apkSize: '46.2 MB',
    version: 'v2026.8.1',
    releaseDate: '2026-08-25',
    badge: '🔥 #1 OFFICIAL',
    colorTheme: 'from-emerald-500 to-green-600',
    iconGradient: 'from-emerald-400 via-green-500 to-emerald-600',
    iconSymbol: '♠',
    gamesList: ['Rummy', 'Teen Patti', 'Dragon vs Tiger', 'Mines', 'Aviator', '7 Up Down', 'Andar Bahar', 'Car Roulette', 'Zoo Roulette', 'Slots 777'],
    paymentMethods: ['Instant UPI', 'Paytm', 'PhonePe', 'Google Pay', 'IMPS Bank'],
    instantWithdrawal: true,
    vipLevels: 10,
    dailyBonusEligible: true,
    referCode: 'RRTN8BM3',
    description: 'Join Yono Games today and start your journey to riches! Exclusive Benefits for New Players: 1️⃣ Register now and get a welcome bonus up to ₹50 FREE. 2️⃣ Enjoy a 7-day login bonus worth ₹100 FREE. 3️⃣ Deposit & claim up to 100% extra bonus instantly. Instant ₹100 UPI withdrawals tested and verified daily.',
    features: [
      'Welcome bonus up to ₹50 FREE on mobile registration',
      '7-Day consecutive login bonus worth ₹100 FREE',
      'First deposit 100% extra cash bonus instantly',
      'Instant ₹100 minimum withdrawal directly to UPI / Bank',
      'Official Referral Code: RRTN8BM3 (Auto-applied)',
      'Tested 100% virus-free verified official APK'
    ],
    withdrawalSpeed: '1-3 Minutes (Instant UPI)',
    safetyScore: 100,
    isCustom: false
  }
];
