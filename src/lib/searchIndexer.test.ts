import { expect, test, describe } from 'bun:test';
import { indexAndSearchApps } from './searchIndexer';
import { YonoApp, PromoCode } from '../types';

const baseApp: YonoApp = {
  id: '',
  name: '',
  tagline: '',
  category: [],
  signupBonus: 0,
  minWithdrawal: 0,
  referBonus: 0,
  referCommission: '',
  rating: 0,
  reviewsCount: 0,
  downloads: '',
  apkSize: '',
  version: '1.0.0',
  releaseDate: '',
  colorTheme: '',
  iconGradient: '',
  iconSymbol: '',
  gamesList: [],
  paymentMethods: [],
  instantWithdrawal: false,
  vipLevels: 0,
  dailyBonusEligible: false,
  referCode: '',
  description: '',
  features: [],
  withdrawalSpeed: '',
  safetyScore: 0,
};

const mockApps: YonoApp[] = [
  {
    ...baseApp,
    id: 'app1',
    name: 'App One',
    category: ['yono_games'],
    signupBonus: 100,
    maxSignupBonus: 150,
    minWithdrawal: 50,
    rating: 4.5,
    reviewsCount: 100,
    version: '1.0.0',
  },
  {
    ...baseApp,
    id: 'app2',
    name: 'App Two',
    category: ['color_trading'],
    signupBonus: 200,
    minWithdrawal: 100,
    rating: 4.0,
    reviewsCount: 200,
    version: '1.1.0',
  },
  {
    ...baseApp,
    id: 'app3',
    name: 'Diwa Game',
    tagline: 'Best diwa game',
    category: ['diwa_games'],
    signupBonus: 50,
    minWithdrawal: 20,
    rating: 4.8,
    reviewsCount: 50,
    version: '2.0.0',
  },
  {
    ...baseApp,
    id: 'yono-games-official',
    name: 'Yono Games Official',
    category: ['yono_games'],
    signupBonus: 500,
    minWithdrawal: 10,
    rating: 5.0,
    reviewsCount: 1000,
    version: '3.0.0',
    pinToTop: true,
  },
  {
    ...baseApp,
    id: 'yono-rummy-official',
    name: 'Yono Rummy Official',
    category: ['rummy_teenpatti'],
    signupBonus: 300,
    minWithdrawal: 30,
    rating: 4.9,
    reviewsCount: 800,
    version: '2.5.0',
    pinToTop: true,
  },
  {
    ...baseApp,
    id: 'app4',
    name: 'App Four Bottom',
    category: ['all'],
    signupBonus: 10,
    minWithdrawal: 5,
    rating: 3.0,
    reviewsCount: 10,
    version: '0.9.0',
    pinToBottom: true,
  },
];

const mockPromoCodes: PromoCode[] = [
  {
    code: 'PROMO100',
    title: '100 Bonus',
    reward: '100',
    expiry: '2025-12-31',
    appTarget: 'app1',
    usesLeft: 100,
    status: 'Active',
  },
  {
    code: 'YONO500',
    title: '500 Bonus',
    reward: '500',
    expiry: '2025-12-31',
    appTarget: 'all yono apps',
    usesLeft: 50,
    status: 'Active',
  },
];

describe('indexAndSearchApps', () => {
  describe('Category Filtering (Empty Search Query)', () => {
    test('should return all apps for category "all"', () => {
      const results = indexAndSearchApps(mockApps, '', 'all', 'rating');
      expect(results.length).toBe(6);
      expect(results.map(a => a.id)).toContain('app1');
    });

    test('should correctly filter by "yono_games"', () => {
      // yono_games should include apps with category 'yono_games' or apps that are NOT 'color_trading' & 'diwa_games'
      const results = indexAndSearchApps(mockApps, '', 'yono_games', 'rating');
      expect(results.map(a => a.id)).toContain('app1');
      expect(results.map(a => a.id)).toContain('yono-games-official');
      expect(results.map(a => a.id)).toContain('app4'); // app4 is 'all', so it's not color_trading or diwa_games
      expect(results.map(a => a.id)).not.toContain('app2'); // app2 is color_trading
      expect(results.map(a => a.id)).not.toContain('app3'); // app3 is diwa_games
    });

    test('should correctly filter by "color_trading"', () => {
      const results = indexAndSearchApps(mockApps, '', 'color_trading', 'rating');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('app2');
    });

    test('should correctly filter by "diwa_games"', () => {
      // app3 is 'diwa_games'
      const results = indexAndSearchApps(mockApps, '', 'diwa_games', 'rating');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('app3');
    });
  });

  describe('Sorting (Empty Search Query)', () => {
    // Note: Pinning logic applies before sorting, so we expect pinned apps at top/bottom.
    // For sort tests, we'll focus on the order of the unpinned apps, or all apps if we mock them without pins.

    const unpinnedApps = mockApps.filter(app => !app.pinToTop && !app.pinToBottom);

    test('should sort by bonus_high', () => {
      const results = indexAndSearchApps(unpinnedApps, '', 'all', 'bonus_high');
      // expected order by bonus: app2 (200), app1 (max: 150), app3 (50)
      expect(results.map(a => a.id)).toEqual(['app2', 'app1', 'app3']);
    });

    test('should sort by withdrawal_low', () => {
      const results = indexAndSearchApps(unpinnedApps, '', 'all', 'withdrawal_low');
      // expected order by minWithdrawal: app3 (20), app1 (50), app2 (100)
      expect(results.map(a => a.id)).toEqual(['app3', 'app1', 'app2']);
    });

    test('should sort by rating', () => {
      const results = indexAndSearchApps(unpinnedApps, '', 'all', 'rating');
      // expected order by rating: app3 (4.8), app1 (4.5), app2 (4.0)
      expect(results.map(a => a.id)).toEqual(['app3', 'app1', 'app2']);
    });

    test('should sort by newest', () => {
      const results = indexAndSearchApps(unpinnedApps, '', 'all', 'newest');
      // expected order by version: app3 (2.0.0), app2 (1.1.0), app1 (1.0.0)
      expect(results.map(a => a.id)).toEqual(['app3', 'app2', 'app1']);
    });
  });

  describe('Pinning (Empty Search Query)', () => {
    test('should pin apps to top in specific order and to bottom', () => {
      // Use the full mockApps which includes pinned apps.
      const results = indexAndSearchApps(mockApps, '', 'all', 'rating');

      // Expected:
      // 1. yono-games-official (pinToTop, specific rule)
      // 2. yono-rummy-official (pinToTop, specific rule)
      // 3. app3 (rating 4.8)
      // 4. app1 (rating 4.5)
      // 5. app2 (rating 4.0)
      // 6. app4 (pinToBottom)
      expect(results.map(a => a.id)).toEqual([
        'yono-games-official',
        'yono-rummy-official',
        'app3',
        'app1',
        'app2',
        'app4'
      ]);
    });
  });

  describe('Active Search Query', () => {
    test('should return exact match on app name at the top', () => {
      // Searching for "App Two" exactly
      const results = indexAndSearchApps(mockApps, 'App Two', 'all', 'rating');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('app2');
    });

    test('should return exact match on promo code', () => {
      // Searching for promo code "PROMO100", appTarget is "app1"
      const results = indexAndSearchApps(mockApps, 'PROMO100', 'all', 'rating', mockPromoCodes);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('app1');
    });

    test('should match on bonus amount', () => {
      // Searching for "500", should match Yono Games Official (signupBonus 500)
      const results = indexAndSearchApps(mockApps, '500', 'all', 'rating');
      expect(results.length).toBeGreaterThan(0);
      // "500" should score high on 'yono-games-official'
      expect(results[0].id).toBe('yono-games-official');
    });

    test('should match on fuzzy search', () => {
      // Searching for "apptw" (typo of "apptwo")
      const results = indexAndSearchApps(mockApps, 'apptw', 'all', 'rating');
      expect(results.length).toBeGreaterThan(0);
      expect(results.map(a => a.id)).toContain('app2');
    });

    test('should fallback to sort options when search scores match', () => {
      // We will search for a generic term that hits multiple apps equally
      // Let's add a tagline that matches to both app1 and app2.
      const modifiedApps = [...mockApps];
      modifiedApps[0] = { ...modifiedApps[0], tagline: 'amazing game feature' };
      modifiedApps[1] = { ...modifiedApps[1], tagline: 'amazing feature included' };

      // Search for "amazing" -> Should hit Tagline Match for both (score +1800)
      const results = indexAndSearchApps(modifiedApps, 'amazing', 'all', 'rating');
      expect(results.length).toBe(2);

      // Since sorting is 'rating', and app1(4.5) > app2(4.0), app1 should come first
      expect(results[0].id).toBe('app1');
      expect(results[1].id).toBe('app2');

      const resultsBonus = indexAndSearchApps(modifiedApps, 'amazing', 'all', 'bonus_high');
      // Sorting by bonus_high, app2(200) > app1(100), app2 should come first
      expect(resultsBonus[0].id).toBe('app2');
      expect(resultsBonus[1].id).toBe('app1');
    });
  });
});
