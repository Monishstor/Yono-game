import React, { useState } from 'react';
import { YonoApp, PromoCode, TickerNotice, SiteSettings, WithdrawalRecord } from '../types';
import { 
  LayoutDashboard, 
  Layers, 
  Gift, 
  Volume2, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Eye, 
  KeyRound, 
  Coins, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  FileJson,
  Save,
  DollarSign,
  Send,
  Phone,
  ArrowUpRight,
  Pin,
  Copy,
  Globe,
  Sliders,
  Tag,
  Code,
  FileText,
  RefreshCw,
  SearchCode,
  Users,
  Mail
} from 'lucide-react';
import { AppIcon } from './AppIcon';
import { WordPressIntegration } from './WordPressIntegration';
import { AiHealthMonitor } from './AiHealthMonitor';
import { openGoogleFilePicker } from '../lib/googlePicker';

interface AdminPanelProps {
  apps: YonoApp[];
  promoCodes: PromoCode[];
  siteSettings: SiteSettings;
  withdrawalRecords: WithdrawalRecord[];
  onAddNewApp: () => void;
  onEditApp: (app: YonoApp) => void;
  onDeleteApp: (appId: string) => void;
  onTogglePinToBottom?: (appId: string) => void;
  onUpdateApps?: (apps: YonoApp[]) => void;
  onSavePromoCodes: (promos: PromoCode[]) => void;
  onSaveSiteSettings: (settings: SiteSettings) => void;
  onSaveWithdrawals: (records: WithdrawalRecord[]) => void;
  onExportAllData: () => void;
  onImportAllData: (data: any) => void;
  onResetFactory: () => void;
  onCloseAdmin: () => void;
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'apps' | 'health' | 'promos' | 'ticker' | 'withdrawals' | 'seo' | 'settings' | 'wordpress';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  apps,
  promoCodes,
  siteSettings,
  withdrawalRecords,
  onAddNewApp,
  onEditApp,
  onDeleteApp,
  onTogglePinToBottom,
  onUpdateApps,
  onSavePromoCodes,
  onSaveSiteSettings,
  onSaveWithdrawals,
  onExportAllData,
  onImportAllData,
  onResetFactory,
  onCloseAdmin,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Settings Form state
  const [telegramUrl, setTelegramUrl] = useState(siteSettings.telegramLink || 'https://t.me/');
  const [telegramSubs, setTelegramSubs] = useState(siteSettings.telegramSubscribers || '88K');
  const [whatsappSupport, setWhatsappSupport] = useState(siteSettings.whatsappSupport || '+91 98765 43210');
  const [showTicker, setShowTicker] = useState(siteSettings.showTicker ?? true);
  const [showAgeDisclaimer, setShowAgeDisclaimer] = useState(siteSettings.showAgeDisclaimer ?? true);
  const [showPlayProtectBadge, setShowPlayProtectBadge] = useState(siteSettings.showPlayProtectBadge ?? true);
  const [noticesList, setNoticesList] = useState<TickerNotice[]>(siteSettings.notices || []);
  const [newNoticeText, setNewNoticeText] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // SEO Settings Form state
  const [seoTitle, setSeoTitle] = useState(siteSettings.siteTitle || 'ALL NEW YONO APPS (2026) - Real Cash Games & APK Downloads');
  const [seoDescription, setSeoDescription] = useState(siteSettings.siteDescription || 'Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal, daily promo codes and safe verified APK files.');
  const [seoKeywords, setSeoKeywords] = useState(siteSettings.metaKeywords || 'all yono apps, yono games apk download, all new yono app 2026, yono vip, yono rummy 500 bonus, yono slots 777, yono games list, yono referral code');
  const [seoCanonical, setSeoCanonical] = useState(siteSettings.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://yono-game.vercel.app'));
  const [seoAuthor, setSeoAuthor] = useState(siteSettings.authorName || 'YONO Official Community');
  const [googleVerificationCode, setGoogleVerificationCode] = useState(siteSettings.googleVerificationCode || '');
  const [ogImageUrl, setOgImageUrl] = useState(siteSettings.ogImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80');
  const [seoSaved, setSeoSaved] = useState(false);

  // SEO Presets Helper
  const applySeoPreset = (type: 'ranking_2026' | 'bonus_upi' | 'brand_authority') => {
    if (type === 'ranking_2026') {
      setSeoTitle('ALL NEW YONO APPS (2026) - 50+ Top APK Downloads List & Free Bonus');
      setSeoDescription('Download latest 2026 All New Yono Games APKs. Get daily promo codes, ₹51-₹1500 signup cash bonuses, ₹100 instant UPI withdrawals & virus-free verified apps.');
      setSeoKeywords('all new yono games 2026, all yono apps list, yono apk download, yono rummy bonus, yono 777 apk, yono games download 2026, all yono vip');
    } else if (type === 'bonus_upi') {
      setSeoTitle('All Yono Games 2026 - ₹1500 Signup Bonus & Instant ₹100 UPI Withdrawal');
      setSeoDescription('Claim highest signup bonus in All New Yono Apps. Instant ₹100 minimum bank/UPI transfer, 60% lifetime refer commission, and 100% verified real cash games.');
      setSeoKeywords('yono rummy 500 bonus, all yono games with ₹500 bonus, low withdrawal yono app, yono instant upi withdrawal, yono refer and earn');
    } else if (type === 'brand_authority') {
      setSeoTitle('Official All Yono Games APK Portal 2026 - Safe & Virus-Free Download');
      setSeoDescription('The authorized catalog of all legitimate Yono games. Compare reviews, download sizes, bonuses, and direct official APK download mirrors.');
      setSeoKeywords('official yono portal, original yono games, yono company app, yono 2026 official website, all yono apk direct download');
    }
  };

  const handleSaveSeoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...siteSettings,
      siteTitle: seoTitle.trim(),
      siteDescription: seoDescription.trim(),
      metaKeywords: seoKeywords.trim(),
      canonicalUrl: seoCanonical.trim(),
      authorName: seoAuthor.trim(),
      googleVerificationCode: googleVerificationCode.trim(),
      ogImage: ogImageUrl.trim()
    };
    onSaveSiteSettings(updated);
    setSeoSaved(true);
    setTimeout(() => setSeoSaved(false), 2500);
  };

  // Password Change state
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Promo Form state
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoReward, setNewPromoReward] = useState('₹100 Free Bonus');
  const [newPromoApp, setNewPromoApp] = useState('All Yono Apps');
  const [newPromoExpiry, setNewPromoExpiry] = useState('Valid for 7 Days');
  const [newPromoUses, setNewPromoUses] = useState(500);

  // Withdrawal Form state
  const [isAddingWithdrawal, setIsAddingWithdrawal] = useState(false);
  const [newWithUser, setNewWithUser] = useState('Rahul S.');
  const [newWithPhone, setNewWithPhone] = useState('+91 98****4120');
  const [newWithAmount, setNewWithAmount] = useState(3500);
  const [newWithApp, setNewWithApp] = useState('Yono 777');
  const [newWithMethod, setNewWithMethod] = useState<'UPI' | 'Paytm' | 'IMPS Bank' | 'PhonePe'>('UPI');

  // Filtered Apps
  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.referCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterCategory === 'all') return matchesSearch;
    if (filterCategory === 'pinned') return matchesSearch && !!app.pinToBottom;
    if (filterCategory === 'custom') return matchesSearch && !!app.isCustom;
    if (filterCategory === 'custom_img') return matchesSearch && !!app.imageUrl;
    return matchesSearch && app.category.includes(filterCategory as any);
  });

  // Custom added apps count
  const customAppsCount = apps.filter((a) => a.isCustom || a.imageUrl).length;

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...siteSettings,
      telegramLink: telegramUrl.trim(),
      telegramSubscribers: telegramSubs.trim(),
      whatsappSupport: whatsappSupport.trim(),
      showTicker: showTicker,
      showAgeDisclaimer: showAgeDisclaimer,
      showPlayProtectBadge: showPlayProtectBadge,
      notices: noticesList
    };
    onSaveSiteSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Change Admin Pin
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPin.trim() || newAdminPin.trim().length < 4) {
      setPinChangeMessage({ text: 'PIN / Password must be at least 4 characters.', type: 'error' });
      return;
    }
    if (newAdminPin !== confirmAdminPin) {
      setPinChangeMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    const updated: SiteSettings = {
      ...siteSettings,
      adminPin: newAdminPin.trim()
    };
    onSaveSiteSettings(updated);
    setNewAdminPin('');
    setConfirmAdminPin('');
    setPinChangeMessage({ text: '✅ Admin Password updated successfully!', type: 'success' });
    setTimeout(() => setPinChangeMessage(null), 3000);
  };

  // Add Notice to Ticker
  const handleAddNotice = () => {
    if (!newNoticeText.trim()) return;
    const newNotice: TickerNotice = {
      id: `notice-${Date.now()}`,
      type: 'sparkles',
      text: newNoticeText.trim()
    };
    const updated = [...noticesList, newNotice];
    setNoticesList(updated);
    setNewNoticeText('');
  };

  const handleDeleteNotice = (id: string) => {
    setNoticesList(noticesList.filter((n) => n.id !== id));
  };

  // Add Promo Code
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const newPromo: PromoCode = {
      code: newPromoCode.trim().toUpperCase(),
      title: newPromoTitle.trim() || `${newPromoCode} Special Bonus`,
      reward: newPromoReward.trim() || '₹100 Bonus',
      expiry: newPromoExpiry.trim() || 'Valid for 7 Days',
      appTarget: newPromoApp.trim() || 'All Yono Apps',
      usesLeft: Number(newPromoUses) || 500,
      status: 'Active'
    };
    onSavePromoCodes([newPromo, ...promoCodes]);
    setNewPromoCode('');
    setNewPromoTitle('');
    setIsAddingPromo(false);
  };

  const handleDeletePromo = (code: string) => {
    if (window.confirm(`Delete promo code "${code}"?`)) {
      onSavePromoCodes(promoCodes.filter((p) => p.code !== code));
    }
  };

  // Add Withdrawal Feed Record
  const handleCreateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: WithdrawalRecord = {
      id: `tx-${Date.now()}`,
      user: newWithUser.trim() || 'Player',
      phoneMasked: newWithPhone.trim() || '+91 98****0000',
      amount: Number(newWithAmount) || 1500,
      appName: newWithApp.trim() || 'Yono 777',
      method: newWithMethod,
      timeAgo: 'Just now',
      status: 'Success'
    };
    onSaveWithdrawals([newRecord, ...withdrawalRecords]);
    setIsAddingWithdrawal(false);
  };

  const handleDeleteWithdrawal = (id: string) => {
    onSaveWithdrawals(withdrawalRecords.filter((w) => w.id !== id));
  };

  return (
    <div id="admin-master-panel" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Brand & Admin Badge */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                    YONO ADMIN PORTAL
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-xs">
                    OWNER MODE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Master Control • {apps.length} Apps Active • Direct URL: <span className="text-amber-400 font-mono font-bold">#admin</span>
                </p>
              </div>
            </div>

            {/* Mobile quick exit */}
            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={onCloseAdmin}
                className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700"
                title="View Live Site"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                const url = window.location.origin + window.location.pathname + '#admin';
                navigator.clipboard.writeText(url);
                alert('✅ Admin URL Copied: ' + url);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title="Copy Direct Admin URL for Bookmarking"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Copy Admin Link (#admin)</span>
            </button>

            <button
              id="admin-quick-add-btn"
              onClick={onAddNewApp}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add App</span>
            </button>

            <button
              id="admin-view-live-site-btn"
              onClick={onCloseAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title="View Public Website"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-1.5">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'dashboard' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
              Stats
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'apps'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Apps Manager ({apps.length})</span>
            </div>
            {customAppsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'apps' ? 'bg-slate-950/30 text-slate-950' : 'bg-amber-500/20 text-amber-300'}`}>
                {customAppsCount} Custom
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'health'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-indigo-950/30 text-indigo-300 hover:bg-indigo-900/50 hover:text-white border border-indigo-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-extrabold">AI Health & Self-Healing</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${activeTab === 'health' ? 'bg-slate-950/40 text-white font-bold' : 'bg-emerald-500/20 text-emerald-300 font-bold'}`}>
              Auto-Fix
            </span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'promos'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4" />
              <span>Promo Codes ({promoCodes.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ticker')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'ticker'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4" />
              <span>Ticker & Social Links</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Coins className="w-4 h-4" />
              <span>Withdrawal Proofs</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'seo'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <SearchCode className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold">SEO & Google Meta</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${activeTab === 'seo' ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-emerald-500/20 text-emerald-300'}`}>
              Rank #1
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Security & Backup</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('wordpress')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'wordpress'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-1 ring-blue-400'
                : 'bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 hover:text-white border border-blue-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="font-extrabold">WordPress & Hosting</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${activeTab === 'wordpress' ? 'bg-slate-950/40 text-white font-bold' : 'bg-blue-500/20 text-blue-300'}`}>
              WP Guide
            </span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-500 px-3">
            💡 All modifications made in this admin panel take effect on the live website immediately.
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* ========================================================
              TAB 1: DASHBOARD OVERVIEW
          ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase">Total Live Apps</span>
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {apps.length}
                  </div>
                  <div className="text-[11px] text-amber-400/90 font-medium mt-1">
                    {customAppsCount} customized / user added
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase">Active Promo Codes</span>
                    <Gift className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {promoCodes.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Claimable by public visitors
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase">Live Ticker Alerts</span>
                    <Volume2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
                    {siteSettings.notices ? siteSettings.notices.length : 3}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {siteSettings.showTicker ? '🟢 Top Ticker ON' : '🔴 Ticker OFF'}
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase">Estimated Traffic</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {siteSettings.telegramSubscribers || '88K'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Telegram Community
                  </div>
                </div>

              </div>

              {/* Quick Actions Panel */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Admin Quick Actions</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={onAddNewApp}
                    className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 hover:border-amber-500 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-amber-400 mb-2 stroke-[2.5]" />
                    <div className="font-bold text-sm text-white">Add New Yono App</div>
                    <div className="text-xs text-slate-400 mt-0.5">Upload logo, set bonus & APK download URL</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('promos')}
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Gift className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-bold text-sm text-white">Create Promo Code</div>
                    <div className="text-xs text-slate-400 mt-0.5">Add bonus voucher codes for players</div>
                  </button>

                  <button
                    onClick={onExportAllData}
                    className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 hover:border-sky-500 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <FileJson className="w-5 h-5 text-sky-400 mb-2" />
                    <div className="font-bold text-sm text-white">Export JSON Backup</div>
                    <div className="text-xs text-slate-400 mt-0.5">Download full backup of apps and settings</div>
                  </button>
                </div>
              </div>

              {/* Recently Added / Top Highlight Apps */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Top Active Apps Catalog</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('apps')}
                    className="text-xs font-bold text-amber-400 hover:underline"
                  >
                    View All {apps.length} Apps →
                  </button>
                </div>

                <div className="space-y-2">
                  {apps.slice(0, 5).map((app, idx) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500 w-5 text-center">#{idx + 1}</span>
                        <AppIcon app={app} sizeClassName="w-10 h-10" textClassName="text-sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{app.name}</span>
                            {app.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                                {app.badge}
                              </span>
                            )}
                            {app.imageUrl && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                                Custom Logo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="text-amber-400 font-bold">Bonus ₹{app.signupBonus}</span>
                            <span>•</span>
                            <span>Min W/D ₹{app.minWithdrawal}</span>
                            <span>•</span>
                            <span>{app.downloads}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditApp(app)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 2: APPS CATALOG MANAGER
          ======================================================== */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              
              {/* Header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white font-['Outfit',sans-serif]">
                    Apps Catalog Management ({apps.length} Total)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click "Edit" on any app to change name, upload new image/logo, change bonus, or select assets from Google Drive.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const picked = await openGoogleFilePicker({
                          title: 'Select Game APK or Image Logo from Google Drive'
                        });
                        if (picked) {
                          alert(`✅ Google Drive Asset Selected:\nFile: ${picked.name}\nType: ${picked.mimeType}\nURL: ${picked.url}\n\nOpening App Editor with this asset.`);
                          onAddNewApp();
                        }
                      } catch (err: any) {
                        alert('Google Drive Picker: ' + (err?.message || 'Unauthorized or failed to connect'));
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
                    title="Select APK or Logo directly from Google Drive"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import from Drive</span>
                  </button>

                  <button
                    onClick={onAddNewApp}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add New App</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by app name, bonus, or code..."
                    className="w-full bg-slate-900 text-slate-100 text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>

                {/* Filter by Category */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 font-semibold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="all">All Categories ({apps.length})</option>
                    <option value="pinned">📌 Pinned to Bottom ({apps.filter(a => a.pinToBottom).length})</option>
                    <option value="custom">Custom Added Apps Only</option>
                    <option value="custom_img">With Custom Image Logo</option>
                    <option value="trending">🔥 Trending</option>
                    <option value="high_bonus">💰 High Bonus</option>
                    <option value="low_withdrawal">⚡ Min ₹100 W/D</option>
                    <option value="rummy_teenpatti">🃏 Rummy & Teen Patti</option>
                    <option value="slots_casino">🎰 Slots & Casino</option>
                    <option value="aviator_mines">🚀 Aviator & Mines</option>
                  </select>
                </div>
              </div>

              {/* Apps Table Container */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">#</th>
                        <th className="py-3 px-4">App & Details</th>
                        <th className="py-3 px-4">Bonus (₹)</th>
                        <th className="py-3 px-4">Min W/D</th>
                        <th className="py-3 px-4">Refer Code</th>
                        <th className="py-3 px-4">Download APK Link</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-16 px-4">
                            <div className="max-w-md mx-auto space-y-3">
                              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                                <Layers className="w-7 h-7" />
                              </div>
                              <h4 className="text-base font-bold text-white">No Apps in Catalog Yet</h4>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                You have a fresh slate! Click "+ Add New App" below to upload your first app photo/logo, specify details, signup bonus, and APK download link.
                              </p>
                              <button
                                onClick={onAddNewApp}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                              >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>+ Add Your First Yono App</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app, index) => (
                          <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-500">
                              {index + 1}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <AppIcon app={app} sizeClassName="w-11 h-11" textClassName="text-base" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-white font-['Outfit',sans-serif]">
                                      {app.name}
                                    </span>
                                    {app.badge && (
                                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        {app.badge}
                                      </span>
                                    )}
                                    {app.pinToBottom && (
                                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-0.5" title="Pinned to bottom of list">
                                        <Pin className="w-2.5 h-2.5 rotate-45" />
                                        <span>Pinned Bottom</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 truncate max-w-xs">{app.tagline}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                    <span>{app.apkSize}</span>
                                    <span>•</span>
                                    <span>{app.version}</span>
                                    <span>•</span>
                                    <span className="text-amber-400 font-bold">★ {app.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-black text-amber-400 font-mono text-sm">
                                ₹{app.signupBonus}
                              </span>
                              {app.maxSignupBonus && (
                                <div className="text-[10px] text-amber-300/80 font-mono">
                                  Up to ₹{app.maxSignupBonus}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-emerald-400 font-mono">
                                ₹{app.minWithdrawal}
                              </span>
                              <div className="text-[10px] text-slate-400">{app.withdrawalSpeed}</div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                {app.referCode}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {app.downloadUrl ? (
                                <a
                                  href={app.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sky-400 hover:underline max-w-[140px] truncate"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{app.downloadUrl}</span>
                                </a>
                              ) : (
                                <span className="text-slate-500 italic">Default Official Server</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {onTogglePinToBottom && (
                                  <button
                                    onClick={() => onTogglePinToBottom(app.id)}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                      app.pinToBottom
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                        : 'bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700'
                                    }`}
                                    title={app.pinToBottom ? 'Click to Unpin from Bottom' : 'Click to Pin to Bottom (SEO)'}
                                  >
                                    <Pin className={`w-3 h-3 ${app.pinToBottom ? 'rotate-45 fill-slate-950' : 'rotate-45'}`} />
                                    <span>{app.pinToBottom ? 'Pinned' : 'Pin Bottom'}</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => onEditApp(app)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold transition-all cursor-pointer"
                                  title="Edit app name, image & bonuses"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${app.name}"?`)) {
                                      onDeleteApp(app.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Delete App"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: PROMO CODES & VOUCHERS
          ======================================================== */}
          {activeTab === 'promos' && (
            <div className="space-y-5">
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white font-['Outfit',sans-serif]">
                    Promo Codes & Gift Vouchers Manager
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Create redeemable promo codes for players. Users can test and copy these in the Promo Vault.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingPromo(!isAddingPromo)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Create Promo Code</span>
                </button>
              </div>

              {/* Add Promo Code Form */}
              {isAddingPromo && (
                <form onSubmit={handleCreatePromo} className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-4 h-4" />
                    <span>New Promo Code Setup</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Coupon Code (e.g. VIP500)</label>
                      <input
                        type="text"
                        required
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                        placeholder="e.g. YONO1000"
                        className="w-full bg-slate-950 text-amber-400 font-mono font-bold text-sm px-3 py-2 rounded-xl border border-slate-700 uppercase focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Reward Description</label>
                      <input
                        type="text"
                        required
                        value={newPromoReward}
                        onChange={(e) => setNewPromoReward(e.target.value)}
                        placeholder="e.g. ₹200 Free Cash Bonus"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Target App</label>
                      <input
                        type="text"
                        value={newPromoApp}
                        onChange={(e) => setNewPromoApp(e.target.value)}
                        placeholder="e.g. All Yono Apps, Yono 777"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Coupon Title / Event Name</label>
                      <input
                        type="text"
                        value={newPromoTitle}
                        onChange={(e) => setNewPromoTitle(e.target.value)}
                        placeholder="e.g. Weekend Mega Tournament Voucher"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Uses Available</label>
                        <input
                          type="number"
                          value={newPromoUses}
                          onChange={(e) => setNewPromoUses(Number(e.target.value))}
                          className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Expiry Text</label>
                        <input
                          type="text"
                          value={newPromoExpiry}
                          onChange={(e) => setNewPromoExpiry(e.target.value)}
                          placeholder="Valid for 24 Hours"
                          className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingPromo(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                    >
                      Save Promo Code
                    </button>
                  </div>
                </form>
              )}

              {/* Promo Codes List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {promoCodes.map((promo) => (
                  <div
                    key={promo.code}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-400 text-sm px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                          {promo.code}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          {promo.status}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white truncate">{promo.title}</div>
                      <div className="text-xs text-emerald-400 font-semibold">{promo.reward}</div>
                      <div className="text-[11px] text-slate-400">
                        {promo.appTarget} • {promo.usesLeft} claims left • {promo.expiry}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePromo(promo.code)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Promo Code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 4: LIVE NOTICE TICKER & SOCIAL LINKS
          ======================================================== */}
          {activeTab === 'ticker' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <h2 className="text-lg font-black text-white font-['Outfit',sans-serif]">
                  Top Ticker Announcement & Channel Links
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update the marquee text that scrolls at the very top of the homepage and configure your official Telegram channel.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                
                {/* Ticker Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Enable Top Scrolling Notice Bar</span>
                    <span className="text-[11px] text-slate-400">Shows latest updates & jackpot notices across all pages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showTicker}
                    onChange={(e) => setShowTicker(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* 18+ Responsible Gaming & Hosting Safety Banner */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">18+ Responsible Gaming Notice (Legal & Hosting Safe)</span>
                    <span className="text-[11px] text-slate-400">Protects your website and hosting account with age verification compliance banner</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showAgeDisclaimer}
                    onChange={(e) => setShowAgeDisclaimer(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Virus Free Play Protect Badge */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Virus-Free & 100% Verified APK Badges</span>
                    <span className="text-[11px] text-slate-400">Shows green security trust badges on app download cards to boost conversions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showPlayProtectBadge}
                    onChange={(e) => setShowPlayProtectBadge(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Social & Support Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-sky-400" />
                      <span>Official Telegram Link</span>
                    </label>
                    <input
                      type="url"
                      value={telegramUrl}
                      onChange={(e) => setTelegramUrl(e.target.value)}
                      placeholder="https://t.me/your_channel"
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Telegram Subscribers Badge Text
                    </label>
                    <input
                      type="text"
                      value={telegramSubs}
                      onChange={(e) => setTelegramSubs(e.target.value)}
                      placeholder="88K, 120K Subscribers"
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Ticker Items List */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <label className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                    Scrolling Ticker Messages:
                  </label>

                  <div className="space-y-2">
                    {noticesList.map((notice, idx) => (
                      <div key={notice.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="font-mono text-slate-500 text-[11px]">{idx + 1}.</span>
                        <span className="flex-1 text-slate-200">{notice.text}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Notice Text */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoticeText}
                      onChange={(e) => setNewNoticeText(e.target.value)}
                      placeholder="Type a new scrolling announcement notice..."
                      className="flex-1 bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddNotice}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  {settingsSaved && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Settings updated successfully!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="ml-auto flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Ticker & Links</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ========================================================
              TAB 5: WITHDRAWAL PROOFS
          ======================================================== */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-5">
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white font-['Outfit',sans-serif]">
                    Live Withdrawal Social Proofs
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage the live payout ticker proofs that appear to build user trust and boost APK downloads.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingWithdrawal(!isAddingWithdrawal)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add Payout Record</span>
                </button>
              </div>

              {isAddingWithdrawal && (
                <form onSubmit={handleCreateWithdrawal} className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>New Withdrawal Record</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Player Name</label>
                      <input
                        type="text"
                        value={newWithUser}
                        onChange={(e) => setNewWithUser(e.target.value)}
                        placeholder="e.g. Suresh K."
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Masked Phone</label>
                      <input
                        type="text"
                        value={newWithPhone}
                        onChange={(e) => setNewWithPhone(e.target.value)}
                        placeholder="+91 98****1234"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-emerald-400 block mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={newWithAmount}
                        onChange={(e) => setNewWithAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 text-emerald-400 font-bold text-sm px-3 py-1.5 rounded-xl border border-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Payment Method</label>
                      <select
                        value={newWithMethod}
                        onChange={(e) => setNewWithMethod(e.target.value as any)}
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700"
                      >
                        <option value="UPI">UPI</option>
                        <option value="Paytm">Paytm</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="IMPS Bank">IMPS Bank</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingWithdrawal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                    >
                      Save Proof
                    </button>
                  </div>
                </form>
              )}

              {/* Withdrawals List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {withdrawalRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{record.user}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{record.phoneMasked}</span>
                      </div>
                      <div className="text-emerald-400 font-black font-mono text-sm mt-0.5">
                        ₹{record.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {record.appName} • {record.method} • {record.timeAgo}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteWithdrawal(record.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 6: SEO SETTINGS & GOOGLE RANKING HUB
          ======================================================== */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              
              {/* Header & Status Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg">
                    <SearchCode className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                        Google SEO & Meta Tags Manager
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-xs">
                        RANK #1 READY
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30">
                        Live Auto-Sync
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure dynamic title tags, meta keywords, rich schema and search engine snippets for maximum organic traffic.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const sitemapUrl = `${origin}/sitemap.xml`;
                      navigator.clipboard.writeText(sitemapUrl);
                      alert(`✅ Sitemap URL Copied:\n${sitemapUrl}\n\nSubmit this in Google Search Console!`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors cursor-pointer"
                    title="Copy sitemap.xml URL for Google Search Console"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Sitemap URL</span>
                  </button>
                </div>
              </div>

              {/* 1. Google SERP Live Simulator Box */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Google Search Result Live Preview (Mobile & Desktop)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Live SERP Simulation
                  </span>
                </div>

                {/* Google Search Card Simulator */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 select-none">
                  {/* Google search URL & Favicon */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-1 font-sans">
                    <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-black text-slate-950">
                      Y
                    </div>
                    <div className="truncate text-[11px] sm:text-xs">
                      <span className="font-semibold text-slate-800">
                        {seoCanonical.replace(/^https?:\/\//, '') || 'allnewyonoapps.com'}
                      </span>
                      <span className="text-slate-400 mx-1">›</span>
                      <span className="text-slate-500">games</span>
                      <span className="text-slate-400 mx-1">›</span>
                      <span className="text-slate-500">yono-apk-2026</span>
                    </div>
                  </div>

                  {/* Title (Blue Google Search Link) */}
                  <h4 className="text-sm sm:text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
                    {seoTitle || 'ALL NEW YONO APPS (2026) - APK Downloads & ₹1500 Bonus'}
                  </h4>

                  {/* Meta Description snippet */}
                  <p className="text-xs text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
                    <span className="text-emerald-700 font-bold mr-1">⭐ 4.9 (24,800+ Votes) - </span>
                    {seoDescription || 'Official portal for All New Yono Games & APK Downloads with ₹51 to ₹1500 sign-up bonus, ₹100 instant UPI withdrawals, and verified virus-free Android APK packages.'}
                  </p>

                  {/* Sitelinks simulation */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-3 text-[11px] text-[#1a0dab] font-medium overflow-x-auto">
                    <span className="hover:underline cursor-pointer shrink-0">₹500 Bonus Apps</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer shrink-0">Instant UPI Cashout</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer shrink-0">Daily VIP Codes</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer shrink-0">Download APKs</span>
                  </div>
                </div>

                {/* Character Count Helpers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Title Length:</span>
                    <span className={`font-mono font-bold ${seoTitle.length >= 40 && seoTitle.length <= 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {seoTitle.length} / 60 Chars {seoTitle.length >= 40 && seoTitle.length <= 65 ? '(Optimal ✅)' : '(Recommended: 50-60)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Description Length:</span>
                    <span className={`font-mono font-bold ${seoDescription.length >= 120 && seoDescription.length <= 165 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {seoDescription.length} / 160 Chars {seoDescription.length >= 120 && seoDescription.length <= 165 ? '(Optimal ✅)' : '(Recommended: 120-160)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. 1-Click High Ranking Preset Buttons */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    1-Click SEO Ranking Presets
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Select a tested keyword strategy tailored for Google search algorithm in the Indian gaming and real cash market:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => applySeoPreset('ranking_2026')}
                    className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                      <span>🚀 2026 Ranking Booster</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Fast Index</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Targets "all new yono games 2026" & "all yono apk download" high search volume terms.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => applySeoPreset('bonus_upi')}
                    className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                      <span>💰 High Bonus & ₹100 UPI</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">High CTR</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Focuses on ₹1500 signup bonus, ₹100 minimum instant withdrawal, and high CTR triggers.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => applySeoPreset('brand_authority')}
                    className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-sky-400 flex items-center justify-between">
                      <span>🛡️ Official Brand & Trust</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Safe E-E-A-T</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Emphasizes official APK verification, Play Protect security, and virus-free downloads.
                    </p>
                  </button>
                </div>
              </div>

              {/* 3. Main SEO Meta Tags Editor Form */}
              <form onSubmit={handleSaveSeoSettings} className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Meta Tags & Search Engine Configuration
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Saves to persistent WordPress & LocalStorage
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Site Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>Website Title Tag (`&lt;title&gt;` & `og:title`)</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {seoTitle.length} characters
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="e.g. ALL NEW YONO APPS (2026) - APK Downloads & ₹1500 Bonus"
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      This is the main headline displayed on Google Search and browser tabs. Keep it under 60 characters for best display.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>Meta Description Tag (`&lt;meta name="description"&gt;`)</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {seoDescription.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      required
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Enter engaging summary for Google Search snippet..."
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      This 2-line snippet appears directly below your link on Google. Include keywords like APK download, instant UPI, and signup bonus.
                    </p>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Meta Keywords (Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="all yono apps, yono games apk download, yono rummy bonus, all new yono app 2026..."
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      {seoKeywords.split(',').filter(Boolean).slice(0, 6).map((kw, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700">
                          #{kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Canonical URL & Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span>Canonical Website Domain / URL</span>
                      </label>
                      <input
                        type="url"
                        value={seoCanonical}
                        onChange={(e) => setSeoCanonical(e.target.value)}
                        placeholder="https://allnewyonoapps.com"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Prevents duplicate content penalty when running across multiple subdomains or mirrors.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Publisher / Author Name (Schema E-E-A-T)</span>
                      </label>
                      <input
                        type="text"
                        value={seoAuthor}
                        onChange={(e) => setSeoAuthor(e.target.value)}
                        placeholder="e.g. YONO Official Community"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Provides verified publisher credentials in Google Schema.org structured data.
                      </p>
                    </div>
                  </div>

                  {/* Google Verification & Social Preview Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                        <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                        <span>Google Search Console Verification Code</span>
                      </label>
                      <input
                        type="text"
                        value={googleVerificationCode}
                        onChange={(e) => setGoogleVerificationCode(e.target.value)}
                        placeholder="e.g. googlexxxxxxxxxxxxxxxxxx"
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Paste your verification code from search.google.com to verify ownership without touching code files.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Social Share Image URL (`og:image`)</span>
                      </label>
                      <input
                        type="url"
                        value={ogImageUrl}
                        onChange={(e) => setOgImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Banner image displayed when sharing link on WhatsApp, Telegram & Facebook.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Confirmation Toast */}
                {seoSaved && (
                  <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>SEO & Meta Tags Saved Successfully! Live site and schema updated instantly.</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="text-[11px] text-slate-500">
                    ⚡ Changes take effect on the public website and Google Schema JSON-LD in real time.
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>Save SEO Settings</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ========================================================
              TAB 7: SECURITY & BACKUP SETTINGS
          ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Master Password Change */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-['Outfit',sans-serif]">
                      Change Master Admin Password / PIN
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Set a new security password to prevent unauthorized changes to your website.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePin} className="space-y-4 max-w-md pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">New Password / PIN</label>
                    <input
                      type="password"
                      required
                      value={newAdminPin}
                      onChange={(e) => setNewAdminPin(e.target.value)}
                      placeholder="Enter new password (min 4 chars)..."
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmAdminPin}
                      onChange={(e) => setConfirmAdminPin(e.target.value)}
                      placeholder="Re-enter new password..."
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono"
                    />
                  </div>

                  {pinChangeMessage && (
                    <div className={`p-2.5 rounded-xl text-xs font-bold ${pinChangeMessage.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                      {pinChangeMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    Update Admin Password
                  </button>
                </form>
              </div>

              {/* Backup & Restore Center */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                    <FileJson className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-['Outfit',sans-serif]">
                      Portal Backup & Data Synchronization
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Export or import all 45+ apps, custom images, promo codes, and settings in a single JSON file.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Download JSON Backup</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Save a complete backup copy of your customized catalog to your computer or phone.
                    </p>
                    <button
                      onClick={onExportAllData}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      Export Full Backup
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-sky-400" />
                      <span>Restore from JSON File</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Upload a previously exported backup file to restore all your apps and settings.
                    </p>
                    <label className="block w-full text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs border border-slate-700 transition-colors cursor-pointer">
                      <span>Choose Backup File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const parsed = JSON.parse(event.target?.result as string);
                                onImportAllData(parsed);
                                alert('Backup restored successfully!');
                              } catch (err) {
                                alert('Failed to parse JSON backup file.');
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Factory Reset */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-400">Reset to Factory Default</div>
                    <div className="text-[11px] text-slate-500">Restore the initial verified 45+ Yono apps catalog</div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset all apps and settings to factory default? Any custom added apps will be reset.')) {
                        onResetFactory();
                        alert('Catalog reset to factory default.');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 cursor-pointer"
                  >
                    Reset Portal
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: AI AUTO-DIAGNOSTICS & SELF-HEALING ENGINE
          ======================================================== */}
          {activeTab === 'health' && (
            <AiHealthMonitor
              apps={apps}
              siteSettings={siteSettings}
              promoCodes={promoCodes}
              onUpdateApps={(updatedApps) => {
                if (onUpdateApps) onUpdateApps(updatedApps);
              }}
              onEditApp={onEditApp}
            />
          )}

          {/* ========================================================
              TAB 7: WORDPRESS & FREE HOSTING INTEGRATION
          ======================================================== */}
          {activeTab === 'wordpress' && (
            <WordPressIntegration currentAdminPin={siteSettings.adminPin} />
          )}

        </main>

      </div>

    </div>
  );
};
