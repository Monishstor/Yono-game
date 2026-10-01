import { expect, describe, test } from 'bun:test';
import { calculateAppSearchScore } from './searchIndexer';
import { YonoApp, PromoCode } from '../types';

describe('calculateAppSearchScore', () => {
  const mockApp: YonoApp = {
    id: 'test-app-1',
    name: 'Super Casino',
    slug: 'super-casino',
    tagline: 'The best casino game',
    category: ['slots_casino'],
    signupBonus: 500,
    maxSignupBonus: 1000,
    minWithdrawal: 100,
    referBonus: 50,
    referCommission: '30%',
    rating: 4.5,
    reviewsCount: 100,
    downloads: '1M+',
    apkSize: '50MB',
    version: '1.0.0',
    releaseDate: '2023-01-01',
    badge: 'HOT',
    colorTheme: 'red',
    iconGradient: 'red-to-orange',
    iconSymbol: '🎰',
    gamesList: ['Aviator', 'Slots', 'Dragon vs Tiger'],
    paymentMethods: ['UPI', 'Paytm'],
    instantWithdrawal: true,
    vipLevels: 5,
    dailyBonusEligible: true,
    referCode: 'SUPERCASINO123',
    description: 'Play Super Casino and win big.',
    features: ['Fast Withdrawal', '24/7 Support'],
    withdrawalSpeed: 'Instant',
    safetyScore: 99
  };

  test('returns 0 score for empty query', () => {
    const result = calculateAppSearchScore(mockApp, '   ');
    expect(result.score).toBe(0);
    expect(result.isExactMatch).toBe(false);
    expect(result.matchReasons.length).toBe(0);
  });

  test('exact app name match (Tier 1)', () => {
    const result = calculateAppSearchScore(mockApp, 'Super Casino');
    expect(result.score).toBeGreaterThanOrEqual(15000);
    expect(result.isExactMatch).toBe(true);
    expect(result.matchReasons).toContain('Exact App Name');
  });

  test('exact refer code match (Tier 1)', () => {
    const result = calculateAppSearchScore(mockApp, 'SUPERCASINO123');
    expect(result.score).toBeGreaterThanOrEqual(14000);
    expect(result.isExactMatch).toBe(true);
    expect(result.matchReasons).toContain('Exact Refer/Promo Code');
  });

  test('exact promo code match (Tier 1)', () => {
    const promoCodes: PromoCode[] = [{
      code: 'WELCOME500',
      title: 'Welcome Bonus',
      reward: '500 Coins',
      expiry: '2024-12-31',
      appTarget: 'Super Casino',
      usesLeft: 100,
      status: 'Active'
    }];
    const result = calculateAppSearchScore(mockApp, 'welcome500', promoCodes);
    expect(result.score).toBeGreaterThanOrEqual(13500);
    expect(result.isExactMatch).toBe(true);
    expect(result.matchReasons).toContain('Promo Code "WELCOME500"');
  });

  test('exact game match (Tier 1)', () => {
    const result = calculateAppSearchScore(mockApp, 'Dragon vs Tiger');
    expect(result.score).toBeGreaterThanOrEqual(12000);
    expect(result.isExactMatch).toBe(true);
    expect(result.matchReasons).toContain('Exact Game: Dragon vs Tiger');
  });

  test('exact bonus amount match (Tier 1)', () => {
    const result = calculateAppSearchScore(mockApp, '500 bonus');
    expect(result.score).toBeGreaterThanOrEqual(10000);
    expect(result.matchReasons).toContain('Exact Bonus ₹500');
  });

  test('exact slug match (Tier 1)', () => {
    const result = calculateAppSearchScore(mockApp, 'super-casino');
    expect(result.score).toBeGreaterThanOrEqual(9000);
    expect(result.isExactMatch).toBe(true);
    expect(result.matchReasons).toContain('Exact URL Slug');
  });

  test('name prefix match (Tier 2)', () => {
    const result = calculateAppSearchScore(mockApp, 'Super');
    expect(result.score).toBeGreaterThanOrEqual(7000);
    expect(result.matchReasons).toContain('Name Prefix Match');
  });

  test('word start match (Tier 2)', () => {
    const result = calculateAppSearchScore(mockApp, 'Casi');
    expect(result.score).toBeGreaterThanOrEqual(6500);
    expect(result.matchReasons).toContain('Word Start Match');
  });

  test('all keywords in name (Tier 3)', () => {
    const result = calculateAppSearchScore(mockApp, 'Casino Super'); // reversed order
    expect(result.score).toBeGreaterThanOrEqual(4000);
    expect(result.matchReasons).toContain('All Keywords in Name');
  });

  test('tagline match (Tier 3)', () => {
    const result = calculateAppSearchScore(mockApp, 'best casino');
    expect(result.score).toBeGreaterThanOrEqual(1800);
    expect(result.matchReasons).toContain('Tagline Match');
  });

  test('feature match (Tier 3)', () => {
    const result = calculateAppSearchScore(mockApp, 'Fast Withdrawal');
    expect(result.score).toBeGreaterThanOrEqual(1500);
    expect(result.matchReasons).toContain('Feature Match');
  });

  test('badge match (Tier 3)', () => {
    const result = calculateAppSearchScore(mockApp, 'HOT');
    expect(result.score).toBeGreaterThanOrEqual(1400);
    expect(result.matchReasons).toContain('Badge Match');
  });

  test('payment method match (Tier 3)', () => {
    const result = calculateAppSearchScore(mockApp, 'UPI');
    expect(result.score).toBeGreaterThanOrEqual(1200);
    expect(result.matchReasons).toContain('Payment: UPI');
  });

  test('description match (Tier 3)', () => {
    const result = calculateAppSearchScore(mockApp, 'play super casino');
    expect(result.score).toBeGreaterThanOrEqual(800);
    expect(result.matchReasons).toContain('Description Match');
  });

  test('typo tolerance match (Tier 4)', () => {
    // Score should be > 0 due to Levenshtein distance matching "Casino"
    const result = calculateAppSearchScore(mockApp, 'Casina');
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1000);
    expect(result.matchReasons.some(r => r.startsWith('Fuzzy match on'))).toBe(true);
  });

  test('typo tolerance on games (Tier 4)', () => {
    const result = calculateAppSearchScore(mockApp, 'Aviater');
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1000);
    expect(result.matchReasons).toContain('Fuzzy game: Aviator');
  });
});
