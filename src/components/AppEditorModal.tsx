import React, { useState, useEffect } from 'react';
import { YonoApp, AppCategory } from '../types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Palette, 
  Save, 
  Trash2, 
  Sparkles, 
  Check, 
  AlertCircle,
  Plus,
  Crown,
  Gamepad2,
  Download,
  Pin
} from 'lucide-react';
import { AppIcon } from './AppIcon';
import { openGoogleFilePicker } from '../lib/googlePicker';

interface AppEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  appToEdit: YonoApp | null;
  onSaveApp: (app: YonoApp) => void;
  onDeleteApp?: (appId: string) => void;
}

const CATEGORY_OPTIONS: { id: AppCategory; label: string }[] = [
  { id: 'yono_games', label: '👑 Yono Games' },
  { id: 'diwa_games', label: '🔥 DIWA GAME' },
  { id: 'color_trading', label: '🎨 Color Trading' },
  { id: 'trending', label: '⚡ Trending' },
  { id: 'new', label: '✨ New 2026' },
  { id: 'high_bonus', label: '💰 High Bonus ₹500+' },
  { id: 'low_withdrawal', label: '⚡ Min ₹100 W/D' },
  { id: 'rummy_teenpatti', label: '🃏 Rummy & Teen Patti' },
  { id: 'slots_casino', label: '🎰 Slots & Casino' },
  { id: 'aviator_mines', label: '🚀 Aviator & Mines' },
];

const PRESET_GRADIENTS = [
  'from-amber-400 to-orange-600',
  'from-purple-600 to-indigo-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-blue-600 to-cyan-600',
  'from-yellow-400 to-amber-600',
  'from-red-600 to-orange-700',
  'from-slate-800 to-slate-950',
];

const PRESET_BADGES = [
  'NEW 2026',
  'HOT 🔥',
  '₹1500 BONUS',
  'TOP CHOICE ⭐',
  'FAST PAY ⚡',
  'VIP EXCLUSIVE 👑',
  'BEST RUMMY 🃏',
  'VIRAL 🚀'
];

export const AppEditorModal: React.FC<AppEditorModalProps> = ({
  isOpen,
  onClose,
  appToEdit,
  onSaveApp,
  onDeleteApp
}) => {
  const isEditing = !!appToEdit;

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'gradient'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [iconGradient, setIconGradient] = useState('from-amber-400 to-orange-600');
  const [iconSymbol, setIconSymbol] = useState('Y8');
  const [categories, setCategories] = useState<AppCategory[]>(['trending', 'new']);
  const [signupBonus, setSignupBonus] = useState(150);
  const [maxSignupBonus, setMaxSignupBonus] = useState(500);
  const [minWithdrawal, setMinWithdrawal] = useState(100);
  const [referBonus, setReferBonus] = useState(50);
  const [referCommission, setReferCommission] = useState('30% Comm');
  const [referCode, setReferCode] = useState('YONO2026');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [apkSize, setApkSize] = useState('46.5 MB');
  const [version, setVersion] = useState('v6.1.0');
  const [rating, setRating] = useState(4.8);
  const [downloads, setDownloads] = useState('500K+');
  const [badge, setBadge] = useState('NEW 2026');
  const [withdrawalSpeed, setWithdrawalSpeed] = useState('Instant 2 Min');
  const [gamesInput, setGamesInput] = useState('Dragon vs Tiger, Aviator, Rummy, Teen Patti, Mines, Roulette');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('Instant 2-Minute UPI Payouts\nOTP Registration ₹150 Bonus\nDaily Free Spin Wheel & VIP Cashback\n100% Virus-Safe & Certified APK');
  const [pinToTop, setPinToTop] = useState(false);
  const [pinToBottom, setPinToBottom] = useState(false);

  // Load app data if editing
  useEffect(() => {
    if (appToEdit) {
      setName(appToEdit.name || '');
      setTagline(appToEdit.tagline || '');
      if (appToEdit.imageUrl) {
        setImageUrl(appToEdit.imageUrl);
        setImageMode(appToEdit.imageUrl.startsWith('data:') ? 'upload' : 'url');
      } else {
        setImageUrl('');
        setImageMode('gradient');
      }
      setIconGradient(appToEdit.iconGradient || 'from-amber-400 to-orange-600');
      setIconSymbol(appToEdit.iconSymbol || 'YO');
      setCategories(appToEdit.category || ['trending']);
      setSignupBonus(appToEdit.signupBonus || 100);
      setMaxSignupBonus(appToEdit.maxSignupBonus || 500);
      setMinWithdrawal(appToEdit.minWithdrawal || 100);
      setReferBonus(appToEdit.referBonus || 50);
      setReferCommission(appToEdit.referCommission || '30% Comm');
      setReferCode(appToEdit.referCode || 'YONO2026');
      setDownloadUrl(appToEdit.downloadUrl || '');
      setApkSize(appToEdit.apkSize || '45.0 MB');
      setVersion(appToEdit.version || 'v5.0.0');
      setRating(appToEdit.rating || 4.8);
      setDownloads(appToEdit.downloads || '500K+');
      setBadge(appToEdit.badge || 'NEW 2026');
      setWithdrawalSpeed(appToEdit.withdrawalSpeed || 'Instant 2 Min');
      setGamesInput(appToEdit.gamesList ? appToEdit.gamesList.join(', ') : 'Dragon vs Tiger, Aviator, Rummy, Teen Patti');
      setDescription(appToEdit.description || '');
      setFeaturesInput(appToEdit.features ? appToEdit.features.join('\n') : '');
      setPinToTop(appToEdit.pinToTop ?? false);
      setPinToBottom(appToEdit.pinToBottom ?? false);
    } else {
      // Defaults for brand new app
      const randomCode = 'YONO' + Math.floor(1000 + Math.random() * 9000);
      setName('');
      setTagline('Exclusive New Yono Game with Instant OTP Signup Bonus');
      setImageUrl('');
      setImageMode('upload');
      setPinToTop(false);
      setPinToBottom(false);
      setIconGradient('from-amber-400 to-orange-600');
      setIconSymbol('NEW');
      setCategories(['trending', 'new']);
      setSignupBonus(150);
      setMaxSignupBonus(1000);
      setMinWithdrawal(100);
      setReferBonus(50);
      setReferCommission('30% Comm');
      setReferCode(randomCode);
      setDownloadUrl('');
      setApkSize('48.2 MB');
      setVersion('v6.2.0');
      setRating(4.9);
      setDownloads('100K+');
      setBadge('NEW 2026');
      setWithdrawalSpeed('Instant 2 Min');
      setGamesInput('Dragon vs Tiger, Aviator, Rummy, Teen Patti, Mines, Roulette, Andar Bahar');
      setDescription('Brand new verified Yono gaming APK for 2026. Claim free bonus immediately upon mobile registration with instant 2-minute UPI cashout.');
      setFeaturesInput('Instant 2-Minute UPI Payouts\nOTP Registration Bonus\nDaily Free Spin Wheel & VIP Cashback\n100% Virus-Safe & Certified APK');
      setPinToBottom(false);
    }
  }, [appToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large! Please choose an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        setImageMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (catId: AppCategory) => {
    if (categories.includes(catId)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== catId));
      }
    } else {
      setCategories([...categories, catId]);
    }
  };

  // Construct draft app object for live preview and save
  const draftApp: YonoApp = {
    id: appToEdit ? appToEdit.id : `custom-app-${Date.now()}`,
    name: name.trim() || 'Custom Yono App',
    tagline: tagline.trim() || 'New Yono Game APK',
    imageUrl: (imageMode === 'upload' || imageMode === 'url') && imageUrl.trim() ? imageUrl.trim() : undefined,
    downloadUrl: downloadUrl.trim() || undefined,
    category: categories.length > 0 ? categories : ['trending'],
    signupBonus: Number(signupBonus) || 51,
    maxSignupBonus: Number(maxSignupBonus) > Number(signupBonus) ? Number(maxSignupBonus) : undefined,
    minWithdrawal: Number(minWithdrawal) || 100,
    referBonus: Number(referBonus) || 50,
    referCommission: referCommission || '30% Comm',
    rating: Number(rating) || 4.8,
    reviewsCount: appToEdit ? appToEdit.reviewsCount : 12450,
    downloads: downloads || '250K+',
    apkSize: apkSize || '45 MB',
    version: version || 'v6.0.0',
    releaseDate: appToEdit ? appToEdit.releaseDate : '2026-02-24',
    badge: badge.trim() || undefined,
    colorTheme: 'amber',
    iconGradient: iconGradient,
    iconSymbol: iconSymbol.trim() || (name.trim() ? name.trim().slice(0, 2).toUpperCase() : 'YO'),
    gamesList: gamesInput
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean),
    paymentMethods: ['UPI', 'Paytm', 'PhonePe', 'IMPS Bank'],
    instantWithdrawal: true,
    vipLevels: 10,
    dailyBonusEligible: true,
    referCode: referCode.trim() || 'YONO2026',
    description: description.trim() || `${name} is an official Yono APK featuring instant sign-up bonuses and fast UPI cashouts.`,
    features: featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean),
    withdrawalSpeed: withdrawalSpeed || 'Instant 2 Min',
    safetyScore: 99,
    isCustom: true,
    pinToTop: pinToTop,
    pinToBottom: pinToBottom
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an App Name (ऐप का नाम लिखें)');
      return;
    }
    onSaveApp(draftApp);
    onClose();
  };

  return (
    <div id="app-editor-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="app-editor-modal-card"
        className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-7 text-slate-100 my-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            {isEditing ? <Sparkles className="w-6 h-6 stroke-[2.5]" /> : <Plus className="w-6 h-6 stroke-[2.5]" />}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              {isEditing ? `Edit "${appToEdit.name}" (ऐप में बदलाव करें)` : 'Add New Yono App (नया ऐप जोड़ें)'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize the exact app name, upload your custom logo/image, set bonus rewards, and add download links.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left & Middle 2 Columns: Form Fields */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* 1. APP LOGO / IMAGE PICKER */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>App Icon / Image (ऐप का लोगो या इमेज)</span>
                  </label>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        imageMode === 'upload' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        imageMode === 'url' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🔗 Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('gradient')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        imageMode === 'gradient' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🎨 Gradient & Icon
                    </button>
                  </div>
                </div>

                {/* Upload File Mode */}
                {imageMode === 'upload' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/70 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all text-center">
                        <Upload className="w-6 h-6 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-200">
                          Upload from Device
                        </span>
                        <span className="text-[11px] text-slate-400">
                          PNG, JPG, SVG (Max 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const picked = await openGoogleFilePicker({
                              title: 'Select Game Logo Image from Google Drive'
                            });
                            if (picked) {
                              setImageUrl(picked.url);
                            }
                          } catch (err: any) {
                            alert('Google Drive Picker: ' + (err?.message || 'Unauthorized or failed to connect'));
                          }
                        }}
                        className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-amber-500/5 hover:bg-amber-500/10 transition-all text-center"
                      >
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-300">
                          Pick Logo from Google Drive
                        </span>
                        <span className="text-[11px] text-amber-400/70">
                          Google Picker Integration
                        </span>
                      </button>
                    </div>

                    {imageUrl && (
                      <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Image Loaded Successfully!
                        </span>
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="ml-auto text-rose-400 hover:underline text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Image URL Mode */}
                {imageMode === 'url' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image web address (e.g. https://example.com/logo.png)..."
                        className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 pl-8"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>
                )}

                {/* Stylized Gradient Mode */}
                {imageMode === 'gradient' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Symbol / 2-Letter Logo (e.g. 777, Y8, SP):</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={iconSymbol}
                          onChange={(e) => setIconSymbol(e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 uppercase font-mono font-bold focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Select Theme Gradient:</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_GRADIENTS.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setIconGradient(g)}
                              className={`w-6 h-6 rounded-lg bg-gradient-to-br ${g} ring-1 ring-white/20 transition-transform ${
                                iconGradient === g ? 'scale-125 ring-2 ring-amber-400' : 'hover:scale-110'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. APP NAME & TAGLINE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    App Name (ऐप का नाम) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yono 888 Gold, Rummy Master"
                    className="w-full bg-slate-950 text-slate-100 font-bold text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Play Rummy & Slots with ₹150 Free"
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* 3. SIGN-UP BONUS & MIN WITHDRAWAL */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-amber-400 block mb-1">Sign-up Bonus (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={signupBonus}
                    onChange={(e) => setSignupBonus(Number(e.target.value))}
                    className="w-full bg-slate-900 text-amber-400 font-mono font-black text-sm px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-300 block mb-1">Max Bonus (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxSignupBonus}
                    onChange={(e) => setMaxSignupBonus(Number(e.target.value))}
                    className="w-full bg-slate-900 text-amber-300 font-mono font-black text-sm px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-400 block mb-1">Min Cashout (₹)</label>
                  <input
                    type="number"
                    min="50"
                    value={minWithdrawal}
                    onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                    className="w-full bg-slate-900 text-emerald-400 font-mono font-black text-sm px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-sky-400 block mb-1">Payout Speed</label>
                  <input
                    type="text"
                    value={withdrawalSpeed}
                    onChange={(e) => setWithdrawalSpeed(e.target.value)}
                    placeholder="Instant 2 Min"
                    className="w-full bg-slate-900 text-sky-400 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* 4. REFER CODE & DIRECT APK LINK */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Referral Code</label>
                  <input
                    type="text"
                    value={referCode}
                    onChange={(e) => setReferCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 text-amber-400 font-mono font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 uppercase focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Refer Bonus & Comm</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={referBonus}
                      onChange={(e) => setReferBonus(Number(e.target.value))}
                      placeholder="₹50"
                      className="w-20 bg-slate-950 text-slate-100 font-mono text-xs px-2.5 py-2 rounded-xl border border-slate-700"
                    />
                    <input
                      type="text"
                      value={referCommission}
                      onChange={(e) => setReferCommission(e.target.value)}
                      placeholder="30% Comm"
                      className="flex-1 bg-slate-950 text-slate-100 text-xs px-2.5 py-2 rounded-xl border border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Custom Download URL (APK)</label>
                  <input
                    type="text"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="https://... or direct APK link"
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const picked = await openGoogleFilePicker({
                          title: 'Select Game APK File from Google Drive'
                        });
                        if (picked) {
                          setDownloadUrl(picked.url);
                        }
                      } catch (err: any) {
                        alert('Google Drive Picker: ' + (err?.message || 'Unauthorized or failed to connect'));
                      }
                    }}
                    className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Pick APK from Google Drive</span>
                  </button>
                </div>
              </div>

              {/* 5. BADGE & CATEGORIES */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Category Tags (Where should this app show up?):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. BADGE PRESET */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Top Highlight Badge (Pill Tag):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_BADGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBadge(b)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                        badge === b
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 ring-2 ring-amber-300 font-extrabold'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Custom badge text..."
                    className="bg-slate-950 text-slate-100 text-xs px-2.5 py-1 rounded-lg border border-slate-700 w-36"
                  />
                </div>
              </div>

              {/* 7. GAMES INCLUDED */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Games Included (Comma-separated list):
                </label>
                <input
                  type="text"
                  value={gamesInput}
                  onChange={(e) => setGamesInput(e.target.value)}
                  placeholder="Dragon vs Tiger, Aviator, Rummy, Teen Patti, Mines, Slots"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* 8. SIZE, VERSION & RATING */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">APK Size</label>
                  <input
                    type="text"
                    value={apkSize}
                    onChange={(e) => setApkSize(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="5.0"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-950 text-amber-400 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">Downloads</label>
                  <input
                    type="text"
                    value={downloads}
                    onChange={(e) => setDownloads(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* 9. PIN TO TOP FEATURE */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                    <Pin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>Pin to Top (वेबसाइट में हमेशा सबसे ऊपर रखें)</span>
                      {pinToTop && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950">
                          ACTIVE PINNED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      इस ऐप को मुख्य वेबसाइट और सभी कैटेगरीज में हमेशा सबसे ऊपर (Top Position) पर लॉक रखें।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPinToTop(!pinToTop)}
                  className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden cursor-pointer ${
                    pinToTop ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  aria-pressed={pinToTop}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                      pinToTop ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 10. PIN TO BOTTOM FEATURE (SEO / Priority Management) */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
                    <Pin className="w-4 h-4 rotate-45" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>Pin to Bottom (वेबसाइट में हमेशा सबसे नीचे रखें)</span>
                      {pinToBottom && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      इस ऐप को मुख्य लिस्ट में सबसे नीचे (Last Position) पर लॉक रखें। यह फीचर SEO आर्टिकल्स या बैकलिंक गेम्स के लिए उपयुक्त है ताकि नए और मुख्य गेम्स हमेशा ऊपर रहें।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPinToBottom(!pinToBottom)}
                  className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden cursor-pointer ${
                    pinToBottom ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                  aria-pressed={pinToBottom}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                      pinToBottom ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Right Column: Real-time Live Card Preview */}
            <div className="space-y-4">
              <div className="sticky top-2 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Live App Card Preview:</span>
                </div>

                {/* Render the AppCard exactly as it will appear */}
                <div className="p-1 rounded-3xl bg-gradient-to-b from-amber-500/30 via-slate-800 to-slate-900">
                  <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col justify-between">
                    
                    {/* Badge */}
                    {draftApp.badge && (
                      <div className="absolute -top-2.5 right-4 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md">
                          {draftApp.badge}
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Icon + Title */}
                      <div className="flex items-start gap-3.5 mb-3.5">
                        <AppIcon app={draftApp} sizeClassName="w-14 h-14" />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-white truncate font-['Outfit',sans-serif]">
                            {draftApp.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="text-slate-400 font-mono text-[11px]">{draftApp.version}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 font-mono text-[11px]">{draftApp.apkSize}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-amber-400 text-xs font-bold bg-amber-400/10 px-1.5 py-0.2 rounded">
                              ★ {draftApp.rating}
                            </span>
                            <span className="text-slate-400 text-[11px]">{draftApp.downloads}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bonus Strip */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Free Bonus</span>
                          <span className="font-extrabold text-amber-400 text-sm">
                            ₹{draftApp.signupBonus}
                            {draftApp.maxSignupBonus && <span className="text-[10px] text-amber-300 font-normal"> - ₹{draftApp.maxSignupBonus}</span>}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Min Cashout</span>
                          <span className="font-extrabold text-emerald-400 text-sm">₹{draftApp.minWithdrawal}</span>
                        </div>
                      </div>

                      {/* Game Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {draftApp.gamesList.slice(0, 3).map((g) => (
                          <span key={g} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Button */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="w-full py-2.5 rounded-xl font-extrabold text-xs text-center bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center gap-1.5 shadow-md">
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Download {draftApp.name} APK</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  💡 <strong>Tip:</strong> All changes will be saved permanently in your browser and will appear instantly across the home catalog and search.
                </div>
              </div>
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-800">
            {isEditing && onDeleteApp && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${appToEdit.name}"?`)) {
                    onDeleteApp(appToEdit.id);
                    onClose();
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete App (ऐप हटाएं)</span>
              </button>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>{isEditing ? 'Save Changes (बदलाव सेव करें)' : 'Publish New App (नया ऐप पब्लिश करें)'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
