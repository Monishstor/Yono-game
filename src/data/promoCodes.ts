import { PromoCode, WithdrawalRecord } from '../types';

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'SDN3PUEWV9P',
    title: 'Spin Winner ₹18+ Instant & ₹3000-₹10K Daily Pack',
    reward: '₹18+ Instant Free Bonus + ₹3000-10000 7-28 Day Login + 50%-150% Extra Cashback',
    expiry: 'Official Active Code',
    appTarget: 'Spin Winner',
    usesLeft: 9999,
    status: 'Hot'
  },
  {
    code: 'RS3QBNF7XBT',
    title: 'Rumble Rummy ₹49+ Welcome Pack',
    reward: '₹6 Joining Free + ₹43 7-Day Login + 100% First Deposit Cashback',
    expiry: 'Official Active Code',
    appTarget: 'Rumble Rummy',
    usesLeft: 9999,
    status: 'Hot'
  },
  {
    code: 'ADEWQ4W5AFF',
    title: 'Spin Crush ₹50 Instant Welcome Pack',
    reward: '₹50 Immediate Welcome Bonus + VIP Free Daily Spins + 30% Lifetime Share',
    expiry: 'Official Active Code',
    appTarget: 'Spin Crush',
    usesLeft: 9999,
    status: 'Hot'
  },
  {
    code: 'PJB8B835KV5',
    title: 'Yono Slots Malamaal Welcome Code',
    reward: '₹11-₹50 Free Mobile Bind + 150% First Deposit Cashback + VIP Daily Codes',
    expiry: 'Official Active Code',
    appTarget: 'Yono Slots',
    usesLeft: 9999,
    status: 'Hot'
  },
  {
    code: 'MPXEDCSW6MG',
    title: 'Yono Rummy 3-in-1 Rewards Code',
    reward: '₹13+ Instant Bonus + ₹90 7-Day Login + 30% Deposit Cashback',
    expiry: 'Official Active Code',
    appTarget: 'Yono Rummy',
    usesLeft: 9999,
    status: 'Hot'
  },
  {
    code: 'RRTN8BM3',
    title: 'Official Yono Games Welcome Pack',
    reward: '₹50 Free Welcome + ₹100 7-Day Login + 100% Deposit Match',
    expiry: 'Official Active Code',
    appTarget: 'Yono Games',
    usesLeft: 9999,
    status: 'Hot'
  },
  {
    code: 'YONO2026',
    title: 'New Year 2026 Welcome Pack',
    reward: '₹150 Free Cash Chips',
    expiry: '24 Hours Left',
    appTarget: 'All Yono Apps',
    usesLeft: 428,
    status: 'Hot'
  },
  {
    code: 'VIPROYAL500',
    title: 'High Roller VIP Bonus Code',
    reward: '₹500 Deposit Match + 50 Free Spins',
    expiry: 'Valid Today',
    appTarget: 'Yono VIP & Yono 777',
    usesLeft: 112,
    status: 'Hot'
  },
  {
    code: 'SPIN100FREE',
    title: 'Daily Lucky Wheel Free Token',
    reward: '₹100 Instant Bonus',
    expiry: 'Expiring Soon',
    appTarget: 'Spin Winner & Spin Crush',
    usesLeft: 89,
    status: 'Expiring Soon'
  },
  {
    code: 'ARCADEX50',
    title: 'Arcade Aviator Booster',
    reward: '₹50 Free Crash Credit',
    expiry: 'Valid for 3 Days',
    appTarget: 'Yono Arcade & 101z',
    usesLeft: 640,
    status: 'Active'
  },
  {
    code: 'RUMMYKING100',
    title: 'Jaiho & Yono Rummy Special',
    reward: '₹100 Free Table Entry Voucher',
    expiry: 'Valid This Week',
    appTarget: 'Yono Rummy & Jaiho Rummy',
    usesLeft: 310,
    status: 'Active'
  }
];

export const LIVE_WITHDRAWALS: WithdrawalRecord[] = [
  { id: 'tx-1', user: 'Rahul S.', phoneMasked: '+91 98****4120', amount: 3500, appName: 'Yono 777', method: 'UPI', timeAgo: 'Just now', status: 'Success' },
  { id: 'tx-2', user: 'Vikram P.', phoneMasked: '+91 87****9033', amount: 1200, appName: 'Spin Winner', method: 'Paytm', timeAgo: '1 min ago', status: 'Success' },
  { id: 'tx-3', user: 'Amit K.', phoneMasked: '+91 91****5541', amount: 8400, appName: 'Yono VIP Games', method: 'IMPS Bank', timeAgo: '2 mins ago', status: 'Success' },
  { id: 'tx-4', user: 'Deepak M.', phoneMasked: '+91 70****1198', amount: 2100, appName: 'Yono Arcade', method: 'PhonePe', timeAgo: '3 mins ago', status: 'Success' },
  { id: 'tx-5', user: 'Sunil G.', phoneMasked: '+91 94****7823', amount: 5000, appName: 'Jaiho Rummy', method: 'UPI', timeAgo: '4 mins ago', status: 'Success' },
  { id: 'tx-6', user: 'Pankaj V.', phoneMasked: '+91 88****3412', amount: 1850, appName: 'MBM Bet', method: 'Paytm', timeAgo: '6 mins ago', status: 'Success' },
  { id: 'tx-7', user: 'Manoj R.', phoneMasked: '+91 96****6609', amount: 10500, appName: 'Gold Yono Rummy', method: 'IMPS Bank', timeAgo: '7 mins ago', status: 'Success' },
  { id: 'tx-8', user: 'Rohan T.', phoneMasked: '+91 99****8812', amount: 950, appName: 'Spin Gold', method: 'UPI', timeAgo: '9 mins ago', status: 'Success' },
];
