import { YonoApp, AppCategory, PromoCode } from '../types';

export type SortOption = 'popular' | 'bonus_high' | 'withdrawal_low' | 'rating' | 'newest';

/**
 * Normalizes text for case-insensitive and punctuation-agnostic search
 */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[₹$€¥,.:;!?'"()[\]{}|/\\#*★🔥🎰⚡🚀👑💰🎁🃏✨+_\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strips all spaces and symbols to allow continuous matching (e.g. "bet213" -> "bet213", "BET 213" -> "bet213")
 */
export function cleanContinuous(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\s\-_.:,/()#*★🔥🎰⚡🚀👑💰🎁🃏✨₹$€¥+]/g, '');
}

/**
 * Tokenizes text into unique non-empty words
 */
export function tokenize(text: string | null | undefined): string[] {
  const norm = normalizeText(text);
  if (!norm) return [];
  return norm.split(' ').filter(Boolean);
}

/**
 * Fast Levenshtein distance for typo tolerance
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export interface SearchScoreResult {
  score: number;
  isExactMatch: boolean;
  matchReasons: string[];
}

/**
 * Multi-tiered ranking algorithm that assigns mathematical relevance scores.
 * Exact matches on game names, bonuses, or promo codes receive the highest tier score (10,000+ points).
 */
export function calculateAppSearchScore(
  app: YonoApp,
  rawQuery: string,
  promoCodes?: PromoCode[]
): SearchScoreResult {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return { score: 0, isExactMatch: false, matchReasons: [] };
  }

  const rawLower = trimmed.toLowerCase();
  const normalizedQuery = normalizeText(trimmed);
  const continuousQuery = cleanContinuous(trimmed);
  const queryTokens = tokenize(trimmed);

  let score = 0;
  let isExactMatch = false;
  const matchReasons: string[] = [];

  // Extract raw and continuous app fields
  const rawName = (app.name || '').trim();
  const nameLower = rawName.toLowerCase();
  const nameNorm = normalizeText(rawName);
  const nameContinuous = cleanContinuous(rawName);
  const nameTokens = tokenize(rawName);

  const rawSlug = (app.slug || '').trim().toLowerCase();
  const rawReferCode = (app.referCode || '').trim();
  const referCodeLower = rawReferCode.toLowerCase();
  const referCodeContinuous = cleanContinuous(rawReferCode);

  const rawTagline = (app.tagline || '').toLowerCase();
  const rawBadge = (app.badge || '').toLowerCase();
  const rawDesc = (app.description || '').toLowerCase();

  // Extract numeric intent (e.g. searching "51", "731", "500", "100", "777", "213")
  const numericMatch = trimmed.match(/\d+/g);
  const extractedNumbers = numericMatch ? numericMatch.map(n => parseInt(n, 10)) : [];
  const primaryNumber = extractedNumbers.length > 0 ? extractedNumbers[0] : null;

  // -------------------------------------------------------------
  // TIER 1: EXACT MATCHES (Score: 10,000 - 20,000)
  // Guaranteed to appear at the very top of search results
  // -------------------------------------------------------------

  // 1.1 Exact App Name Match (Full match)
  if (nameLower === rawLower || nameNorm === normalizedQuery || nameContinuous === continuousQuery) {
    score += 15000;
    isExactMatch = true;
    matchReasons.push('Exact App Name');
  }

  // 1.2 Exact Referral Code Match (Direct exact match on promo/refer code)
  if (referCodeLower === rawLower || referCodeContinuous === continuousQuery) {
    score += 14000;
    isExactMatch = true;
    matchReasons.push('Exact Refer/Promo Code');
  }

  // 1.3 Exact Promo Code Vault Match (User searched a promo code tied to this app)
  if (promoCodes && promoCodes.length > 0) {
    for (const promo of promoCodes) {
      const pCodeLower = (promo.code || '').trim().toLowerCase();
      const pTargetLower = (promo.appTarget || '').trim().toLowerCase();
      if (pCodeLower === rawLower || cleanContinuous(promo.code) === continuousQuery) {
        if (
          pTargetLower === nameLower ||
          pTargetLower === 'all yono apps' ||
          pTargetLower.includes(nameLower) ||
          nameLower.includes(pTargetLower) ||
          app.id === promo.appTarget
        ) {
          score += 13500;
          isExactMatch = true;
          matchReasons.push(`Promo Code "${promo.code}"`);
        }
      }
    }
  }

  // 1.4 Exact Specific Game in Games List (e.g. "Aviator", "Points Rummy", "Dragon vs Tiger")
  if (app.gamesList && app.gamesList.length > 0) {
    for (const game of app.gamesList) {
      const gLower = game.toLowerCase().trim();
      const gNorm = normalizeText(game);
      const gContinuous = cleanContinuous(game);

      if (gLower === rawLower || gNorm === normalizedQuery || gContinuous === continuousQuery) {
        score += 12000;
        isExactMatch = true;
        matchReasons.push(`Exact Game: ${game}`);
        break;
      }
    }
  }

  // 1.5 Exact Bonus Amount Match (e.g. searching "₹731", "731 bonus", "51", "500")
  if (primaryNumber !== null) {
    const isSignupBonusMatch = app.signupBonus === primaryNumber;
    const isMaxBonusMatch = app.maxSignupBonus === primaryNumber;
    const isReferBonusMatch = app.referBonus === primaryNumber;
    const isMinWithdrawalMatch = app.minWithdrawal === primaryNumber;

    if (isSignupBonusMatch || isMaxBonusMatch || isReferBonusMatch) {
      score += 10000;
      matchReasons.push(`Exact Bonus ₹${primaryNumber}`);
    } else if (isMinWithdrawalMatch) {
      score += 8000;
      matchReasons.push(`Min ₹${primaryNumber} Withdrawal`);
    }
  }

  // 1.6 Exact Slug Match
  if (rawSlug === rawLower || cleanContinuous(rawSlug) === continuousQuery) {
    score += 9000;
    isExactMatch = true;
    matchReasons.push('Exact URL Slug');
  }

  // -------------------------------------------------------------
  // TIER 2: PREFIX & WORD-START MATCHES (Score: 4,000 - 8,000)
  // -------------------------------------------------------------

  // 2.1 Name starts with query
  if (nameLower.startsWith(rawLower) || nameContinuous.startsWith(continuousQuery)) {
    score += 7000;
    matchReasons.push('Name Prefix Match');
  }

  // 2.2 Word inside name starts with query (e.g. "Yono 777" query "777" or "BET 213" query "213")
  const wordStartsWithQuery = nameTokens.some(token => token.startsWith(normalizedQuery) || token === normalizedQuery);
  if (wordStartsWithQuery && !nameLower.startsWith(rawLower)) {
    score += 6500;
    matchReasons.push('Word Start Match');
  }

  // 2.3 Refer code starts with query
  if (referCodeLower.startsWith(rawLower) || referCodeContinuous.startsWith(continuousQuery)) {
    score += 5500;
    matchReasons.push('Refer Code Prefix');
  }

  // 2.4 Game name in gamesList starts with query
  if (app.gamesList) {
    const gameStartMatch = app.gamesList.find(g => {
      const gNorm = normalizeText(g);
      return gNorm.startsWith(normalizedQuery) || g.toLowerCase().startsWith(rawLower);
    });
    if (gameStartMatch) {
      score += 5000;
      matchReasons.push(`Game Prefix: ${gameStartMatch}`);
    }
  }

  // -------------------------------------------------------------
  // TIER 3: MULTI-TOKEN & SUBSTRING MATCHES (Score: 1,000 - 3,500)
  // -------------------------------------------------------------

  // 3.1 All query tokens found in app name
  if (queryTokens.length > 1) {
    const allTokensInName = queryTokens.every(qToken => 
      nameTokens.some(nToken => nToken.includes(qToken)) || nameLower.includes(qToken)
    );
    if (allTokensInName) {
      score += 4000;
      matchReasons.push('All Keywords in Name');
    }
  }

  // 3.2 Substring in continuous name (e.g. "213" in "bet213")
  if (nameContinuous.includes(continuousQuery)) {
    score += 3000;
    matchReasons.push('Name Substring');
  }

  // 3.3 Game in games list contains query
  if (app.gamesList) {
    const gameContainsMatch = app.gamesList.find(g => {
      const gNorm = normalizeText(g);
      const gCont = cleanContinuous(g);
      return gNorm.includes(normalizedQuery) || gCont.includes(continuousQuery);
    });
    if (gameContainsMatch && !matchReasons.some(r => r.startsWith('Game'))) {
      score += 2500;
      matchReasons.push(`Game Match: ${gameContainsMatch}`);
    }
  }

  // 3.4 Tagline / Features Match
  if (rawTagline.includes(rawLower) || cleanContinuous(rawTagline).includes(continuousQuery)) {
    score += 1800;
    matchReasons.push('Tagline Match');
  }

  if (app.features && app.features.length > 0) {
    const featureMatch = app.features.find(f => normalizeText(f).includes(normalizedQuery));
    if (featureMatch) {
      score += 1500;
      matchReasons.push('Feature Match');
    }
  }

  // 3.5 Badge Match (e.g. "HOT", "NEW 2026", "TOP CHOICE")
  if (rawBadge && (rawBadge.includes(rawLower) || normalizeText(rawBadge).includes(normalizedQuery))) {
    score += 1400;
    matchReasons.push('Badge Match');
  }

  // 3.6 Payment Method Match (e.g. "Paytm", "UPI", "PhonePe", "IMPS")
  if (app.paymentMethods && app.paymentMethods.length > 0) {
    const payMatch = app.paymentMethods.find(p => normalizeText(p).includes(normalizedQuery));
    if (payMatch) {
      score += 1200;
      matchReasons.push(`Payment: ${payMatch}`);
    }
  }

  // 3.7 Description Match
  if (rawDesc.includes(rawLower) || cleanContinuous(rawDesc).includes(continuousQuery)) {
    score += 800;
    matchReasons.push('Description Match');
  }

  // -------------------------------------------------------------
  // TIER 4: TYPO TOLERANCE & FUZZY MATCHING (Score: 300 - 900)
  // -------------------------------------------------------------
  if (score === 0 && continuousQuery.length >= 4) {
    // Check Levenshtein distance on individual words in app name
    for (const token of nameTokens) {
      if (token.length >= 3) {
        const dist = levenshtein(token, normalizedQuery);
        // Allow 1 edit for words length 4-6, 2 edits for words >= 7
        const maxAllowedDist = normalizedQuery.length >= 7 ? 2 : 1;
        if (dist <= maxAllowedDist) {
          score += Math.max(200, 800 - dist * 300);
          matchReasons.push(`Fuzzy match on "${token}"`);
          break;
        }
      }
    }

    // Check Levenshtein on gamesList
    if (score === 0 && app.gamesList) {
      for (const game of app.gamesList) {
        const gTokens = tokenize(game);
        for (const gToken of gTokens) {
          if (gToken.length >= 4) {
            const dist = levenshtein(gToken, normalizedQuery);
            if (dist <= 1) {
              score += 600;
              matchReasons.push(`Fuzzy game: ${game}`);
              break;
            }
          }
        }
        if (score > 0) break;
      }
    }
  }

  return {
    score,
    isExactMatch,
    matchReasons
  };
}

/**
 * Main Search, Filter & Sort Indexer Engine
 */
export function indexAndSearchApps(
  apps: YonoApp[],
  searchQuery: string,
  selectedCategory: AppCategory,
  sortBy: SortOption,
  promoCodes?: PromoCode[]
): YonoApp[] {
  const rawQuery = searchQuery.trim();

  // 1. If NO search query, perform fast category filtering and standard sorting
  if (!rawQuery) {
    return apps
      .filter((app) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'yono_games') {
          return app.category.includes('yono_games') || (!app.category.includes('color_trading') && !app.category.includes('diwa_games'));
        }
        if (selectedCategory === 'diwa_games') {
          return app.category.includes('diwa_games') || app.name.toLowerCase().includes('diwa') || (app.tagline && app.tagline.toLowerCase().includes('diwa'));
        }
        if (selectedCategory === 'color_trading') {
          return app.category.includes('color_trading');
        }
        return app.category.includes(selectedCategory);
      })
      .sort((a, b) => {
        // Pin to bottom rule
        if (a.pinToBottom && !b.pinToBottom) return 1;
        if (!a.pinToBottom && b.pinToBottom) return -1;

        if (sortBy === 'bonus_high') {
          return (b.maxSignupBonus || b.signupBonus) - (a.maxSignupBonus || a.signupBonus);
        }
        if (sortBy === 'withdrawal_low') {
          return a.minWithdrawal - b.minWithdrawal;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'newest') {
          return b.version.localeCompare(a.version);
        }
        return b.reviewsCount - a.reviewsCount;
      });
  }

  // 2. ACTIVE SEARCH QUERY:
  // Calculate mathematical relevance scores for every app
  interface ScoredApp {
    app: YonoApp;
    score: number;
    isExactMatch: boolean;
    matchReasons: string[];
  }

  const scoredApps: ScoredApp[] = [];

  for (const app of apps) {
    const result = calculateAppSearchScore(app, rawQuery, promoCodes);

    // Keep app only if it has a positive match score
    if (result.score > 0) {
      scoredApps.push({
        app,
        score: result.score,
        isExactMatch: result.isExactMatch,
        matchReasons: result.matchReasons
      });
    }
  }

  // 3. Sort by Search Relevance Score Descending
  // Exact matches (score >= 10,000) are guaranteed at the top
  scoredApps.sort((a, b) => {
    // If one app is pinned to bottom, keep it lower UNLESS it's an exact match
    if (a.app.pinToBottom && !b.app.pinToBottom && !a.isExactMatch) return 1;
    if (!a.app.pinToBottom && b.app.pinToBottom && !b.isExactMatch) return -1;

    // Primary sort: Search Relevance Score
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Secondary fallback sort: by selected sort option
    if (sortBy === 'bonus_high') {
      return (b.app.maxSignupBonus || b.app.signupBonus) - (a.app.maxSignupBonus || a.app.signupBonus);
    }
    if (sortBy === 'withdrawal_low') {
      return a.app.minWithdrawal - b.app.minWithdrawal;
    }
    if (sortBy === 'rating') {
      return b.app.rating - a.app.rating;
    }
    return b.app.reviewsCount - a.app.reviewsCount;
  });

  return scoredApps.map(item => item.app);
}
