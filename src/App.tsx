import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { YONO_APPS } from './data/appsData';
import { PROMO_CODES, LIVE_WITHDRAWALS } from './data/promoCodes';
import { YonoApp, AppCategory, PromoCode, SiteSettings, WithdrawalRecord } from './types';
import { LiveTicker } from './components/LiveTicker';
import { Header } from './components/Header';
import { AppGrid } from './components/AppGrid';
import { SeoSchema } from './components/SeoSchema';
import { useTheme } from './lib/theme';
import { Sun, Moon, ArrowRightLeft, Loader2 } from 'lucide-react';
import { startAppsSync, startSettingsSync, saveAppToFirestore, deleteAppFromFirestore, saveSettingsToFirestore } from './lib/firebaseSync';

// Lazy-loaded components to minimize initial bundle size and maximize PageSpeed score (100% Green)
const InstallGuide = lazy(() => import('./components/InstallGuide').then(m => ({ default: m.InstallGuide })));
const FaqSection = lazy(() => import('./components/FaqSection').then(m => ({ default: m.FaqSection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const ResponsibleGamingBanner = lazy(() => import('./components/ResponsibleGamingBanner').then(m => ({ default: m.ResponsibleGamingBanner })));
const LiveWithdrawalFeed = lazy(() => import('./components/LiveWithdrawalFeed').then(m => ({ default: m.LiveWithdrawalFeed })));
const FloatingTelegramBar = lazy(() => import('./components/FloatingTelegramBar').then(m => ({ default: m.FloatingTelegramBar })));

const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AdminLoginPage = lazy(() => import('./components/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const GameLandingPage = lazy(() => import('./components/GameLandingPage').then(m => ({ default: m.GameLandingPage })));
const DownloadModal = lazy(() => import('./components/DownloadModal').then(m => ({ default: m.DownloadModal })));
const AppDetailModal = lazy(() => import('./components/AppDetailModal').then(m => ({ default: m.AppDetailModal })));
const PromoCodeVault = lazy(() => import('./components/PromoCodeVault').then(m => ({ default: m.PromoCodeVault })));
const DailyCheckinModal = lazy(() => import('./components/DailyCheckinModal').then(m => ({ default: m.DailyCheckinModal })));
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const AppEditorModal = lazy(() => import('./components/AppEditorModal').then(m => ({ default: m.AppEditorModal })));

type SortOption = 'popular' | 'bonus_high' | 'withdrawal_low' | 'rating' | 'newest';

// Storage keys for persistent state
const APPS_STORAGE_KEY = 'yono_user_custom_apps_v12';
const PROMOS_STORAGE_KEY = 'yono_custom_promos_v12';
const SETTINGS_STORAGE_KEY = 'yono_site_settings_v12';
const WITHDRAWALS_STORAGE_KEY = 'yono_withdrawals_v12';
const AUTH_STORAGE_KEY = 'yono_admin_auth_session_v12';

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'ALL NEW YONO APPS, JAIHOSPIN, SLOTS WINNER, TOP RUMMY & JAIHO RUMMY (2026) - APK Downloads',
  metaDescription: 'Official portal for JaihoSpin, Slots Winner, Top Rummy, JaiHo Rummy & Dhan Game APK Downloads with ₹10-₹777 Welcome Bonus, 200% Deposit Cashback & ₹100 instant UPI withdrawals.',
  metaKeywords: 'jaihospin, jaiho spin, jaihospin apk download, jaiho spin referral code 7TAQW92DSQE, slots winner, top rummy, jaiho rummy, abc rummy, dhan game, saga slots, all yono games, yono app list 2026, all yono vip',
  canonicalUrl: 'https://yonoj.netlify.app',
  siteAuthor: 'Yono VIP Official Network',
  googleSiteVerification: 'qrp2K5vYd82Cx3k1E2_0oUczGSXl3c9LcNhUjr686gY',
  telegramLink: 'https://t.me/yonojiunauxcom',
  telegramSubscribers: '88K',
  whatsappSupport: '+91 98765 43210',
  showTicker: true,
  showAgeDisclaimer: true,
  showPlayProtectBadge: true,
  whatsappShareText: '👑 Download JaihoSpin & Slots Winner with Free ₹10-₹100 Welcome Bonus + 200% Deposit Cashback & Instant ₹100 UPI Cashout! Code: 7TAQW92DSQE',
  adminPin: 'admin123',
  notices: [
    { id: 'jaihospin-1', type: 'sparkles', text: '✨ JAIHOSPIN LAUNCH: Free ₹10–₹100 Welcome Bonus + 60%–200% Deposit Cashback + Win ₹5,000 Spin Wheel! Code: 7TAQW92DSQE' },
    { id: 'slots-1', type: 'sparkles', text: '🏆 SLOTS WINNER PE AAO, KING BAN JAAO: Instant ₹18-₹100 Signup + Up to 250% Bonus (Max ₹25,000) + VIP Daily Cashback! Code: K4EZ1TA1HEP' },
    { id: 'top-1', type: 'sparkles', text: '👑 TOP RUMMY INDIA #1: ₹5 Free Instant Joining + ₹80 7-Day Login Bonus + 100% First Deposit Cashback! Code: 7K9QGK4RFQ6' },
    { id: '0', type: 'sparkles', text: '🎯 JAIHO RUMMY LAUNCH: ₹9-₹89 Free Sweet Start (Bina Deposit) + 150% 1st Deposit Bonus + 1% Lifetime Win Commission! Code: E74UDCLFRCL' },
    { id: '1', type: 'sparkles', text: '💎 ABC RUMMY VIP INVITATION: Up to ₹100 Welcome Cash + 200% 1st Deposit Boost + ₹10,000 Lucky Spin!' },
    { id: '2', type: 'sparkles', text: '👑 DHAN GAME OFFICIAL: Up to ₹777 Welcome Bonus FREE + 886% 7-Day Login + 500% Deposit Bonus!' },
    { id: '3', type: 'flame', text: '🎰 SAGA SLOTS LIVE: ₹7 Instant Joining + ₹259 7-Days Login Bonus + 100% Deposit Cashback!' },
    { id: '4', type: 'gift', text: '🎁 JaihoSpin: 7TAQW92DSQE | Slots Winner: K4EZ1TA1HEP | Top Rummy: 7K9QGK4RFQ6 | JaiHo Rummy: E74UDCLFRCL' },
    { id: '5', type: 'shield', text: '🛡️ Safe & Tested: Direct APK download verified 100% virus-free on Android 13, 14 & 15.' }
  ]
};

export default function App() {
  // Helper to find an app by ID or slug
  const findAppBySlugOrId = (slugOrId: string, list: YonoApp[]) => {
    if (!slugOrId) return null;
    const clean = slugOrId.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
    return list.find((a) => 
      (a.slug && a.slug.toLowerCase() === clean) ||
      a.id.toLowerCase() === clean ||
      (a.slug && a.slug.replace(/-apk-download|-apk|-download/g, '') === clean.replace(/-apk-download|-apk|-download/g, '')) ||
      a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean ||
      a.id.replace(/-vip-official|-official|-vip/g, '') === clean ||
      clean.includes(a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) ||
      a.name.toLowerCase().includes(clean.replace(/-/g, ' '))
    ) || null;
  };

  // Helper to detect initial landing app from URL query, hash, or pathname
  const detectLandingAppFromUrl = (list: YonoApp[]): YonoApp | null => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get('app') || params.get('game') || params.get('apk');
    if (appParam) {
      const found = findAppBySlugOrId(appParam, list);
      if (found) return found;
    }
    const hash = window.location.hash;
    if (hash.startsWith('#/app/') || hash.startsWith('#app-') || hash.startsWith('#/game/')) {
      const hashSlug = hash.replace(/^#\/(app|game)\//, '').replace(/^#app-/, '');
      const found = findAppBySlugOrId(hashSlug, list);
      if (found) return found;
    }
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (path && path !== '' && !path.includes('.') && path !== 'admin') {
      const found = findAppBySlugOrId(path, list);
      if (found) return found;
    }
    return null;
  };

  // 1. Current Route / View detection from URL (#admin, ?admin, ?wp_admin, etc.)
  const [currentHash, setCurrentHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) return window.location.hash;
      if (window.location.search.includes('admin') || window.location.search.includes('wp_admin')) {
        return '#admin';
      }
    }
    return '#/';
  });

  // Programmatic Game Landing Page State (e.g. ?app=spin-gold-apk-download or /#app-xyz)
  const [activeLandingApp, setActiveLandingApp] = useState<YonoApp | null>(() => {
    return detectLandingAppFromUrl(YONO_APPS);
  });

  // 2. Apps Dataset (Hydrated with real Yono Games apps)
  const [apps, setApps] = useState<YonoApp[]>(() => {
    try {
      const saved = localStorage.getItem(APPS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customApps = parsed.filter((a: YonoApp) => a.isCustom === true && !YONO_APPS.some(d => d.id === a.id));
          const updatedDefaults = YONO_APPS.map(defaultApp => {
            const found = parsed.find((p: YonoApp) => p.id === defaultApp.id);
            return found ? { ...found, ...defaultApp, isCustom: false } : defaultApp;
          });
          const merged = [...updatedDefaults, ...customApps];
          localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.error('Failed to load apps from localStorage', e);
    }
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(YONO_APPS));
    return YONO_APPS;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window === 'undefined') return;
      setCurrentHash(window.location.hash || '#/');

      const matchedApp = detectLandingAppFromUrl(apps);
      if (matchedApp) {
        setActiveLandingApp(matchedApp);
      } else {
        const params = new URLSearchParams(window.location.search);
        const hasAppParam = params.has('app') || params.has('game') || params.has('apk');
        const hasAppHash = window.location.hash.startsWith('#/app/') || window.location.hash.startsWith('#app-') || window.location.hash.startsWith('#/game/');
        if (!hasAppParam && !hasAppHash) {
          setActiveLandingApp(null);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [apps]);

  // 3. Promo Codes
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem(PROMOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updatedPromos = PROMO_CODES.map(defaultPromo => {
            const found = parsed.find((p: PromoCode) => p.code === defaultPromo.code);
            return found || defaultPromo;
          });
          const customPromos = parsed.filter((p: PromoCode) => !PROMO_CODES.some(d => d.code === p.code));
          const merged = [...updatedPromos, ...customPromos];
          localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.error('Failed to load promos', e);
    }
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(PROMO_CODES));
    return PROMO_CODES;
  });

  // 4. Site Settings (Telegram, Notices, Admin Password)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const merged = { ...DEFAULT_SETTINGS, ...parsed };
          if (!merged.telegramLink || merged.telegramLink === 'https://t.me/' || merged.telegramLink === 'https://t.me') {
            merged.telegramLink = 'https://t.me/yonojiunauxcom';
          }
          return merged;
        }
      }
    } catch (e) {
      console.error('Failed to load site settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // 5. Live Withdrawal Feed Records
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load withdrawals', e);
    }
    return LIVE_WITHDRAWALS;
  });

  // 6. Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      // Auto authenticate if opened from WordPress Admin Bridge (?wp_admin_auto=1)
      if (typeof window !== 'undefined' && window.location.search.includes('wp_admin_auto=1')) {
        return true;
      }
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Modal States
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { theme, isLight, toggleTheme } = useTheme();

  // Search & Catalog View States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Interactive Modals
  const [selectedDownloadApp, setSelectedDownloadApp] = useState<YonoApp | null>(null);
  const [selectedDetailApp, setSelectedDetailApp] = useState<YonoApp | null>(null);
  const [isPromoCodesOpen, setIsPromoCodesOpen] = useState(false);
  const [isDailyCheckinOpen, setIsDailyCheckinOpen] = useState(false);

  // App Editor Modal (Add/Edit App with photo upload)
  const [isAppEditorOpen, setIsAppEditorOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState<YonoApp | null>(null);

  // Keyboard shortcut (Ctrl + Shift + A) to quickly navigate to Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.hash = '#admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save Helpers
  const saveAppsToStorage = (updatedApps: YonoApp[]) => {
    setApps(updatedApps);
    try {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(updatedApps));
    } catch (e) {
      console.error('Storage save error', e);
    }
  };

  // Firebase Firestore Asynchronous Real-Time Sync (Deferred to keep Mobile 95+ PageSpeed)
  useEffect(() => {
    // 1. Listen for real-time app updates from Firestore
    const stopAppsSync = startAppsSync((firestoreApps) => {
      setApps((prevApps) => {
        const merged = [...prevApps];
        firestoreApps.forEach((fsApp) => {
          const idx = merged.findIndex((a) => a.id === fsApp.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...fsApp };
          } else {
            merged.unshift(fsApp);
          }
        });
        try {
          localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {}
        return merged;
      });
    });

    // 2. Listen for global settings
    const stopSettingsSync = startSettingsSync((newSettings) => {
      setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    });

    return () => {
      stopAppsSync();
      stopSettingsSync();
    };
  }, []);

  const handleSavePromoCodes = (updatedPromos: PromoCode[]) => {
    setPromoCodes(updatedPromos);
    try {
      localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(updatedPromos));
    } catch (e) {
      console.error('Promos save error', e);
    }
  };

  const handleSaveSiteSettings = (updatedSettings: SiteSettings) => {
    setSiteSettings(updatedSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (e) {
      console.error('Settings save error', e);
    }
    // Save to Firestore asynchronously
    saveSettingsToFirestore(updatedSettings);
  };

  const handleSaveWithdrawals = (updatedRecords: WithdrawalRecord[]) => {
    setWithdrawalRecords(updatedRecords);
    try {
      localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(updatedRecords));
    } catch (e) {
      console.error('Withdrawals save error', e);
    }
  };

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch (e) {}
    window.location.hash = '#admin';
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminMode(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
    window.location.hash = '#/';
  };

  const handleGoToPublicSite = () => {
    window.location.hash = '#/';
  };

  const handleGoToAdmin = () => {
    window.location.hash = '#admin';
  };

  // Filtered and sorted apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Category check
      if (selectedCategory !== 'all' && !app.category.includes(selectedCategory)) {
        return false;
      }

      // Search query check (name, tagline, games, symbol, referCode, badge)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesTagline = app.tagline ? app.tagline.toLowerCase().includes(query) : false;
        const matchesGame = app.gamesList?.some((g) => g.toLowerCase().includes(query)) || false;
        const matchesSymbol = app.iconSymbol ? app.iconSymbol.toLowerCase().includes(query) : false;
        const matchesReferCode = app.referCode ? app.referCode.toLowerCase().includes(query) : false;
        const matchesBadge = app.badge ? app.badge.toLowerCase().includes(query) : false;
        return matchesName || matchesTagline || matchesGame || matchesSymbol || matchesReferCode || matchesBadge;
      }

      return true;
    }).sort((a, b) => {
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
  }, [apps, searchQuery, selectedCategory, sortBy]);

  // Direct Instant Download Toast Notification
  const [downloadToast, setDownloadToast] = useState<{ appName: string; code?: string } | null>(null);

  const handleDownloadClick = (app: YonoApp) => {
    // 1. Auto-copy referral code
    if (app.referCode) {
      try {
        navigator.clipboard.writeText(app.referCode);
      } catch (e) {}
    }

    // 2. Trigger instant floating toast
    setDownloadToast({
      appName: app.name,
      code: app.referCode
    });
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);

    // 3. Directly open / trigger APK download and referral link
    const targetUrl = app.downloadUrl || 'https://t.me/';
    window.open(targetUrl, '_blank');
  };

  const handleOpenLandingPage = (app: YonoApp) => {
    setActiveLandingApp(app);
    if (typeof window !== 'undefined') {
      const slug = app.slug || app.id;
      const newUrl = `${window.location.pathname}?app=${slug}`;
      window.history.pushState({ appSlug: slug, appId: app.id }, '', newUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToHome = () => {
    setActiveLandingApp(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewDetails = (app: YonoApp) => {
    handleOpenLandingPage(app);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // App Editor Handlers
  const handleAddNewApp = () => {
    setAppToEdit(null);
    setIsAppEditorOpen(true);
  };

  const handleOpenEditApp = (app: YonoApp) => {
    setAppToEdit(app);
    setIsAppEditorOpen(true);
  };

  const handleSaveApp = (savedApp: YonoApp) => {
    const existingIndex = apps.findIndex((a) => a.id === savedApp.id);
    let updated: YonoApp[];
    if (existingIndex >= 0) {
      updated = [...apps];
      updated[existingIndex] = savedApp;
    } else {
      updated = [savedApp, ...apps];
    }
    saveAppsToStorage(updated);

    // Save to Firestore asynchronously
    saveAppToFirestore(savedApp);

    if (selectedDetailApp && selectedDetailApp.id === savedApp.id) {
      setSelectedDetailApp(savedApp);
    }
  };

  const handleDeleteApp = (appId: string) => {
    const updated = apps.filter((a) => a.id !== appId);
    saveAppsToStorage(updated);

    // Delete from Firestore asynchronously
    deleteAppFromFirestore(appId);

    if (selectedDetailApp?.id === appId) {
      setSelectedDetailApp(null);
    }
    if (selectedDownloadApp?.id === appId) {
      setSelectedDownloadApp(null);
    }
  };

  // Full Export / Import JSON
  const handleExportAllData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      version: '3.0',
      apps,
      promoCodes,
      siteSettings,
      withdrawalRecords
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `yono_portal_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportAllData = (backup: any) => {
    if (backup && typeof backup === 'object') {
      if (Array.isArray(backup.apps)) saveAppsToStorage(backup.apps);
      if (Array.isArray(backup.promoCodes)) handleSavePromoCodes(backup.promoCodes);
      if (backup.siteSettings) handleSaveSiteSettings(backup.siteSettings);
      if (Array.isArray(backup.withdrawalRecords)) handleSaveWithdrawals(backup.withdrawalRecords);
    }
  };

  const handleResetFactory = () => {
    if (window.confirm('Reset all apps and settings to empty state?')) {
      saveAppsToStorage([]);
      handleSavePromoCodes(PROMO_CODES);
      handleSaveSiteSettings(DEFAULT_SETTINGS);
      handleSaveWithdrawals(LIVE_WITHDRAWALS);
    }
  };

  // ========================================================
  // ROUTE 1: ADMIN PANEL (WHEN URL IS #admin & LOGGED IN)
  // ========================================================
  const isAdminRoute = currentHash.includes('admin');

  if (isAdminRoute && isAdminLoggedIn) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }>
        <AdminPanel
          apps={apps}
          promoCodes={promoCodes}
          siteSettings={siteSettings}
          withdrawalRecords={withdrawalRecords}
          onAddNewApp={handleAddNewApp}
          onEditApp={handleOpenEditApp}
          onDeleteApp={handleDeleteApp}
          onUpdateApps={saveAppsToStorage}
          onSavePromoCodes={handleSavePromoCodes}
          onSaveSiteSettings={handleSaveSiteSettings}
          onSaveWithdrawals={handleSaveWithdrawals}
          onExportAllData={handleExportAllData}
          onImportAllData={handleImportAllData}
          onResetFactory={handleResetFactory}
          onCloseAdmin={handleGoToPublicSite}
          onLogout={handleAdminLogout}
        />
      </Suspense>
    );
  }

  // ========================================================
  // ROUTE 2: ADMIN LOGIN PAGE (WHEN URL IS #admin & NOT LOGGED IN)
  // ========================================================
  if (isAdminRoute && !isAdminLoggedIn) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }>
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={handleGoToPublicSite}
          currentPin={siteSettings.adminPin}
        />
      </Suspense>
    );
  }

  // ========================================================
  // ROUTE 3: PUBLIC USER PANEL (VISITOR WEBSITE)
  // ========================================================
  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col selection:bg-amber-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300`}>
      {/* Automated Programmatic Google SEO & Schema.org JSON-LD Injector (Supports Single-App & Full-List) */}
      <SeoSchema apps={apps} activeApp={activeLandingApp} siteSettings={siteSettings} siteTitle={siteSettings.siteTitle} />

      {/* 18+ Age & Responsible Gaming Legal Compliance Banner */}
      <ResponsibleGamingBanner showAgeDisclaimer={siteSettings.showAgeDisclaimer} />

      {/* Top Notice Ticker */}
      <LiveTicker
        onOpenPromo={() => setIsPromoCodesOpen(true)}
        notices={siteSettings.notices}
        showTicker={siteSettings.showTicker}
      />

      {/* Main Header & Nav */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPromoCodes={() => setIsPromoCodesOpen(true)}
        onOpenDailyCheckin={() => setIsDailyCheckinOpen(true)}
        onToggleTableView={() => setViewMode((prev) => (prev === 'grid' ? 'table' : 'grid'))}
        isTableView={viewMode === 'table'}
        onScrollToSection={handleScrollToSection}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminPanel={handleGoToAdmin}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeLandingApp ? (
          /* PROGRAMMATIC GAME-SPECIFIC SEO LANDING PAGE (Google Rich Result Feed & High-Converting UX) */
          <Suspense fallback={
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-sm font-bold text-slate-400">Loading {activeLandingApp.name}...</span>
            </div>
          }>
            <GameLandingPage
              app={activeLandingApp}
              allApps={apps}
              siteSettings={siteSettings}
              onBackToHome={handleBackToHome}
              onSelectApp={handleOpenLandingPage}
              onDownload={handleDownloadClick}
            />
          </Suspense>
        ) : (
          /* ALL YONO GAMES CATALOG VIEW */
          <>
            {/* All Yono Apps Catalog Section */}
            <section id="all-apps-section" className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {isAdminLoggedIn && (
                <div className="flex items-center justify-end mb-4">
                  <button
                    id="catalog-admin-add-btn"
                    onClick={handleAddNewApp}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>+ Add New Game (नया ऐप जोड़ें)</span>
                  </button>
                </div>
              )}

              {/* Clean App Grid */}
              <AppGrid
                apps={filteredApps}
                onDownload={handleOpenLandingPage}
                onViewDetails={handleViewDetails}
                onResetFilters={handleResetFilters}
                onEdit={isAdminLoggedIn && isAdminMode ? handleOpenEditApp : undefined}
              />
            </section>

            {/* 4-Step Installation & Troubleshooting Guide */}
            <Suspense fallback={null}>
              <InstallGuide />
              <FaqSection />
            </Suspense>
          </>
        )}
      </main>

      {/* Instant Download Toast Feedback */}
      {downloadToast && (
        <div
          id="instant-download-toast"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-500/50 shadow-2xl shadow-amber-500/20 text-white flex items-center gap-3 animate-bounce"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <div className="text-xs font-black text-amber-300">
              Downloading {downloadToast.appName}...
            </div>
            <div className="text-[11px] text-slate-300">
              {downloadToast.code
                ? `Referral Code ${downloadToast.code} Copied to Clipboard!`
                : 'Direct Working APK Download Starting...'}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Live Withdrawal Toasts & Footer elements */}
      <Suspense fallback={null}>
        <LiveWithdrawalFeed records={withdrawalRecords} />
        <Footer
          onOpenPromo={() => setIsPromoCodesOpen(true)}
          onScrollTo={handleScrollToSection}
          telegramLink={siteSettings.telegramLink}
        />
        <FloatingTelegramBar
          telegramLink={siteSettings.telegramLink}
          memberCount={`${siteSettings.telegramSubscribers || '88K'} Members`}
        />
      </Suspense>

      {/* Floating Theme Quick Switcher with Arrow Indicator */}
      <div className="fixed bottom-20 right-4 z-30 hidden sm:flex items-center">
        <button
          id="floating-theme-switch-btn"
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs shadow-2xl border transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
            isLight
              ? 'bg-white/95 text-slate-900 border-slate-300 shadow-slate-400/30'
              : 'bg-slate-900/95 text-amber-300 border-amber-500/40 shadow-black/60'
          }`}
          title={isLight ? 'Switch to Dark Mode (रात का डार्क मोड)' : 'Switch to Light Mode (दिन का लाइट मोड)'}
        >
          {isLight ? (
            <>
              <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Light</span>
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600 ml-0.5" />
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-amber-400 fill-amber-400/40" />
              <span>Dark</span>
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Interactive Modals loaded on-demand */}
      <Suspense fallback={null}>
        {selectedDownloadApp && (
          <DownloadModal
            app={selectedDownloadApp}
            isOpen={!!selectedDownloadApp}
            onClose={() => setSelectedDownloadApp(null)}
          />
        )}

        {selectedDetailApp && (
          <AppDetailModal
            app={selectedDetailApp}
            isOpen={!!selectedDetailApp}
            onClose={() => setSelectedDetailApp(null)}
            onDownload={handleDownloadClick}
            onEdit={isAdminLoggedIn ? handleOpenEditApp : undefined}
          />
        )}

        {isDailyCheckinOpen && (
          <DailyCheckinModal
            isOpen={isDailyCheckinOpen}
            onClose={() => setIsDailyCheckinOpen(false)}
          />
        )}

        {isPromoCodesOpen && (
          <PromoCodeVault
            isOpen={isPromoCodesOpen}
            onClose={() => setIsPromoCodesOpen(false)}
            promoCodes={promoCodes}
          />
        )}

        {isAdminLoginModalOpen && (
          <AdminLoginModal
            isOpen={isAdminLoginModalOpen}
            onClose={() => setIsAdminLoginModalOpen(false)}
            onLoginSuccess={handleAdminLoginSuccess}
            currentPin={siteSettings.adminPin}
          />
        )}

        {isAppEditorOpen && (
          <AppEditorModal
            isOpen={isAppEditorOpen}
            onClose={() => setIsAppEditorOpen(false)}
            appToEdit={appToEdit}
            onSaveApp={handleSaveApp}
            onDeleteApp={handleDeleteApp}
          />
        )}
      </Suspense>
    </div>
  );
}
