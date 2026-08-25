import React, { useState, useMemo, useEffect } from 'react';
import { YONO_APPS } from './data/appsData';
import { PROMO_CODES, LIVE_WITHDRAWALS } from './data/promoCodes';
import { YonoApp, AppCategory, PromoCode, SiteSettings, WithdrawalRecord } from './types';
import { LiveTicker } from './components/LiveTicker';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar, SortOption } from './components/FilterBar';
import { AppGrid } from './components/AppGrid';
import { ComparisonTable } from './components/ComparisonTable';
import { DownloadModal } from './components/DownloadModal';
import { AppDetailModal } from './components/AppDetailModal';
import { PromoCodeVault } from './components/PromoCodeVault';
import { InstallGuide } from './components/InstallGuide';
import { LiveWithdrawalFeed } from './components/LiveWithdrawalFeed';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AppEditorModal } from './components/AppEditorModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminPanel } from './components/AdminPanel';
import { ResponsibleGamingBanner } from './components/ResponsibleGamingBanner';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { SeoSchema } from './components/SeoSchema';
import { FloatingTelegramBar } from './components/FloatingTelegramBar';

// Storage keys for persistent state
const APPS_STORAGE_KEY = 'yono_user_custom_apps_v3';
const PROMOS_STORAGE_KEY = 'yono_custom_promos_v3';
const SETTINGS_STORAGE_KEY = 'yono_site_settings_v3';
const WITHDRAWALS_STORAGE_KEY = 'yono_withdrawals_v3';
const AUTH_STORAGE_KEY = 'yono_admin_auth_session_v3';

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'ALL NEW YONO APPS (2026) - APK Downloads & ₹5000 Bonus',
  metaDescription: 'Official portal for All New Yono Games & APK Downloads with ₹50 Welcome Bonus, ₹100 7-Day Login, ₹100 instant UPI withdrawals, and verified virus-free Android APK packages.',
  metaKeywords: 'all yono games, yono app list 2026, yono games partner, yono apk download, yono rummy bonus, new yono games 2026, yono referral code RRTN8BM3, all yono vip',
  canonicalUrl: 'https://allnewyonoapps.com',
  siteAuthor: 'Yono VIP Official Network',
  googleSiteVerification: '',
  telegramLink: 'https://t.me/yonojiunauxcom',
  telegramSubscribers: '88K',
  whatsappSupport: '+91 98765 43210',
  showTicker: true,
  showAgeDisclaimer: true,
  showPlayProtectBadge: true,
  whatsappShareText: '🔥 Download Real Yono Games with Free ₹50 Welcome Bonus + ₹100 7-Day Login & Instant ₹100 UPI Cashout! Code: RRTN8BM3',
  adminPin: 'admin123',
  notices: [
    { id: '1', type: 'sparkles', text: '🎯 REAL YONO GAMES LIVE: Get Welcome Bonus up to ₹50 FREE + 7-Day Login Bonus ₹100 FREE!' },
    { id: '2', type: 'flame', text: '🔥 First Deposit Bonus: Claim up to 100% Extra Bonus instantly + ₹100 Instant UPI Cashout.' },
    { id: '3', type: 'gift', text: '🎁 Official Referral Code: RRTN8BM3 (Auto-applied on download for VIP 1 activation).' },
    { id: '4', type: 'shield', text: '🛡️ Safe & Tested: Direct APK download verified 100% virus-free on Android 13, 14 & 15.' }
  ]
};

export default function App() {
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

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. Apps Dataset (Hydrated with real Yono Games apps)
  const [apps, setApps] = useState<YonoApp[]>(() => {
    try {
      const saved = localStorage.getItem(APPS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out duplicate temporary bonus clone if present
          const cleaned = parsed.filter((a: YonoApp) => a.id !== 'yono-bonus-official');
          const hasOfficial = cleaned.some((a: YonoApp) => a.id === 'yono-games-official');
          if (!hasOfficial) {
            return [...YONO_APPS, ...cleaned];
          }
          return cleaned;
        }
      }
    } catch (e) {
      console.error('Failed to load apps from localStorage', e);
    }
    return YONO_APPS;
  });

  // 3. Promo Codes
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem(PROMOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load promos', e);
    }
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

  // Top spotlight apps
  const topFeaturedApps = useMemo(() => {
    return apps.slice(0, 3);
  }, [apps]);

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

  const handleViewDetails = (app: YonoApp) => {
    setSelectedDetailApp(app);
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

    if (selectedDetailApp && selectedDetailApp.id === savedApp.id) {
      setSelectedDetailApp(savedApp);
    }
  };

  const handleDeleteApp = (appId: string) => {
    const updated = apps.filter((a) => a.id !== appId);
    saveAppsToStorage(updated);
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
      <AdminPanel
        apps={apps}
        promoCodes={promoCodes}
        siteSettings={siteSettings}
        withdrawalRecords={withdrawalRecords}
        onAddNewApp={handleAddNewApp}
        onEditApp={handleOpenEditApp}
        onDeleteApp={handleDeleteApp}
        onSavePromoCodes={handleSavePromoCodes}
        onSaveSiteSettings={handleSaveSiteSettings}
        onSaveWithdrawals={handleSaveWithdrawals}
        onExportAllData={handleExportAllData}
        onImportAllData={handleImportAllData}
        onResetFactory={handleResetFactory}
        onCloseAdmin={handleGoToPublicSite}
        onLogout={handleAdminLogout}
      />
    );
  }

  // ========================================================
  // ROUTE 2: ADMIN LOGIN PAGE (WHEN URL IS #admin & NOT LOGGED IN)
  // ========================================================
  if (isAdminRoute && !isAdminLoggedIn) {
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToSite={handleGoToPublicSite}
        currentPin={siteSettings.adminPin}
      />
    );
  }

  // ========================================================
  // ROUTE 3: PUBLIC USER PANEL (VISITOR WEBSITE)
  // ========================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Automated Programmatic Google SEO & Schema.org JSON-LD Injector */}
      <SeoSchema apps={apps} siteTitle={siteSettings.siteTitle} />

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
        {/* Hero Section with Top Spotlight Cards */}
        <HeroSection
          topApps={topFeaturedApps}
          onDownloadClick={handleDownloadClick}
          onViewDetails={handleViewDetails}
        />

        {/* All Yono Apps Catalog Section */}
        <section id="all-apps-section" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                  All New Yono Games & APK List (2026)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {apps.length} APPS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse, compare sign-up bonus, and download 100% verified working APK files.
              </p>
            </div>

            {/* If Admin is logged in, show quick Add App button in catalog */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2">
                <button
                  id="catalog-admin-add-btn"
                  onClick={handleAddNewApp}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>+ Add App (नया ऐप जोड़ें)</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter & Sort Controls */}
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={filteredApps.length}
          />

          {/* Card Grid View OR Comparison Table View */}
          {viewMode === 'grid' ? (
            <AppGrid
              apps={filteredApps}
              onDownload={handleDownloadClick}
              onViewDetails={handleViewDetails}
              onResetFilters={handleResetFilters}
              onEdit={isAdminLoggedIn && isAdminMode ? handleOpenEditApp : undefined}
            />
          ) : (
            <ComparisonTable
              apps={filteredApps}
              onDownload={handleDownloadClick}
              onViewDetails={handleViewDetails}
            />
          )}
        </section>

        {/* 4-Step Installation & Troubleshooting Guide */}
        <InstallGuide />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Real-time Live Withdrawal Toasts */}
      <LiveWithdrawalFeed records={withdrawalRecords} />

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

      {/* Footer with built-in WhatsApp & Telegram Share */}
      <Footer
        onOpenPromo={() => setIsPromoCodesOpen(true)}
        onScrollTo={handleScrollToSection}
        telegramLink={siteSettings.telegramLink}
      />

      {/* High Converting Floating Telegram VIP Community Bar */}
      <FloatingTelegramBar
        telegramLink={siteSettings.telegramLink}
        memberCount={`${siteSettings.telegramSubscribers || '88K'} Members`}
      />

      {/* Interactive Modals */}
      <DownloadModal
        app={selectedDownloadApp}
        isOpen={!!selectedDownloadApp}
        onClose={() => setSelectedDownloadApp(null)}
      />

      <AppDetailModal
        app={selectedDetailApp}
        isOpen={!!selectedDetailApp}
        onClose={() => setSelectedDetailApp(null)}
        onDownload={handleDownloadClick}
        onEdit={isAdminLoggedIn ? handleOpenEditApp : undefined}
      />

      <DailyCheckinModal
        isOpen={isDailyCheckinOpen}
        onClose={() => setIsDailyCheckinOpen(false)}
      />

      <PromoCodeVault
        isOpen={isPromoCodesOpen}
        onClose={() => setIsPromoCodesOpen(false)}
        promoCodes={promoCodes}
      />

      {/* Admin Login Modal (Quick popup from visitor site) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        currentPin={siteSettings.adminPin}
      />

      {/* App Editor Modal (Add/Edit any app, upload photo, change bonus & APK download URL) */}
      <AppEditorModal
        isOpen={isAppEditorOpen}
        onClose={() => setIsAppEditorOpen(false)}
        appToEdit={appToEdit}
        onSaveApp={handleSaveApp}
        onDeleteApp={handleDeleteApp}
      />
    </div>
  );
}
