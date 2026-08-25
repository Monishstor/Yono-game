import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { 
  Search, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Monitor, 
  Check, 
  Copy, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Tag, 
  FileText, 
  Share2, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SeoSettingsPanelProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

export const SeoSettingsPanel: React.FC<SeoSettingsPanelProps> = ({
  siteSettings,
  onSaveSiteSettings
}) => {
  // Form State initialized with existing settings or high-converting defaults
  const [siteTitle, setSiteTitle] = useState(
    siteSettings.siteTitle || 'ALL NEW YONO APPS (2026) - Real Cash Games & APK Downloads'
  );
  const [siteDescription, setSiteDescription] = useState(
    siteSettings.siteDescription ||
      'Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal, daily promo codes and safe verified APK files.'
  );
  const [metaKeywords, setMetaKeywords] = useState(
    siteSettings.metaKeywords ||
      'all yono apps, yono games apk download, all new yono app 2026, yono vip, yono rummy 500 bonus, yono slots 777, yono games list, yono referral code'
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    siteSettings.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://allnewyonoapps.com')
  );
  const [authorName, setAuthorName] = useState(
    siteSettings.authorName || 'YONO Official Community'
  );
  const [googleVerification, setGoogleVerification] = useState(
    siteSettings.googleVerificationCode || ''
  );
  const [ogImage, setOgImage] = useState(
    siteSettings.ogImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80'
  );

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keyword Quick-Add Chips
  const keywordSuggestions = [
    'all yono games 2026',
    'yono apk download',
    '₹500 sign-up bonus',
    'instant UPI withdrawal',
    'yono 777 official',
    'yono rummy vip',
    'new teen patti app',
    'daily promo codes',
    'real cash earning app'
  ];

  const handleAddKeyword = (kw: string) => {
    const list = metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (!list.includes(kw)) {
      list.push(kw);
      setMetaKeywords(list.join(', '));
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: SiteSettings = {
      ...siteSettings,
      siteTitle: siteTitle.trim(),
      siteDescription: siteDescription.trim(),
      metaKeywords: metaKeywords.trim(),
      canonicalUrl: canonicalUrl.trim(),
      authorName: authorName.trim(),
      googleVerificationCode: googleVerification.trim(),
      ogImage: ogImage.trim()
    };
    onSaveSiteSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToOptimal = () => {
    if (window.confirm('Reset SEO settings to top-ranked Google recommended defaults?')) {
      setSiteTitle('ALL NEW YONO APPS (2026) - Real Cash Games & APK Downloads');
      setSiteDescription('Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal, daily promo codes and safe verified APK files.');
      setMetaKeywords('all yono apps, yono games apk download, all new yono app 2026, yono vip, yono rummy 500 bonus, yono slots 777, yono games list, yono referral code');
      setCanonicalUrl(typeof window !== 'undefined' ? window.location.origin : 'https://allnewyonoapps.com');
      setAuthorName('YONO Official Community');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Generate HTML Meta tags for WordPress / Custom Head
  const generatedMetaTags = `<!-- YONO Dynamic SEO & Search Meta Tags -->
<title>${siteTitle}</title>
<meta name="description" content="${siteDescription}" />
<meta name="keywords" content="${metaKeywords}" />
<meta name="author" content="${authorName}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<link rel="canonical" href="${canonicalUrl}" />
${googleVerification ? `<meta name="google-site-verification" content="${googleVerification}" />\n` : ''}<meta property="og:type" content="website" />
<meta property="og:title" content="${siteTitle}" />
<meta property="og:description" content="${siteDescription}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:site_name" content="${siteTitle}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${siteTitle}" />
<meta name="twitter:description" content="${siteDescription}" />
<meta name="twitter:image" content="${ogImage}" />`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif]">
                SEO & Google Search Meta Settings
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Customize title, description, and keywords for #1 Google ranking. Changes update your live website instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToOptimal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            title="Reset to Top-Ranked Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✅ SEO Settings saved successfully! Site title, meta tags, and Google schema have been updated live.</span>
          </div>
          <span className="text-[10px] font-mono opacity-80">Saved in storage</span>
        </div>
      )}

      {/* ========================================================
          SECTION 1: REAL-TIME GOOGLE SEARCH PREVIEW SIMULATOR
      ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Live Google Search Preview (SERP Simulator)
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
          </div>
        </div>

        {/* The Google Card Mockup */}
        <div className={`p-4 sm:p-5 rounded-2xl bg-[#202124] border border-[#303134] text-left transition-all ${
          previewDevice === 'mobile' ? 'max-w-md mx-auto shadow-xl' : 'w-full shadow-lg'
        }`}>
          {/* Breadcrumb / URL Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[11px] font-black text-slate-950 shrink-0">
              Y
            </div>
            <div className="min-w-0">
              <p className="text-[13px] text-[#dadce0] font-medium leading-none truncate">
                {authorName || 'All New Yono Apps'}
              </p>
              <p className="text-[11px] text-[#bdc1c6] font-mono leading-tight truncate mt-0.5">
                {canonicalUrl.replace(/^https?:\/\//, '')} › all-apps-section
              </p>
            </div>
          </div>

          {/* Title in Google Blue */}
          <h4 className="text-[#8ab4f8] hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer line-clamp-2">
            {siteTitle || 'ALL NEW YONO APPS (2026) - APK Downloads'}
          </h4>

          {/* Star Rating Rich Snippet */}
          <div className="flex items-center gap-2 my-1.5 text-xs text-[#bdc1c6]">
            <div className="flex items-center text-amber-400 text-xs">
              ★★★★★
            </div>
            <span className="font-bold text-[#e8eaed]">Rating: 4.9</span>
            <span>·</span>
            <span>24,800 votes</span>
            <span>·</span>
            <span className="text-[#81c995] font-semibold">Free APK</span>
          </div>

          {/* Snippet Description */}
          <p className="text-[13px] text-[#bdc1c6] leading-relaxed line-clamp-3">
            {siteDescription || 'Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal, daily promo codes and safe verified APK files.'}
          </p>

          {/* Mobile Sitelinks */}
          <div className="mt-3 pt-3 border-t border-[#3c4043] flex flex-wrap gap-2">
            <span className="text-[11px] text-[#8ab4f8] bg-[#303134] px-2.5 py-1 rounded-lg">
              🔥 ₹500 Signup Bonus
            </span>
            <span className="text-[11px] text-[#8ab4f8] bg-[#303134] px-2.5 py-1 rounded-lg">
              ⚡ ₹100 UPI Withdrawal
            </span>
            <span className="text-[11px] text-[#8ab4f8] bg-[#303134] px-2.5 py-1 rounded-lg">
              🎁 Daily VIP Promo Codes
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================
          SECTION 2: EDITABLE SEO FORM FIELDS
      ======================================================== */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card: Primary Meta Data */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Primary Meta Information
            </h3>
          </div>

          {/* 1. Site Title Tag */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Page Title (Meta Title Tag)</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`font-mono font-bold ${
                  siteTitle.length >= 40 && siteTitle.length <= 65
                    ? 'text-emerald-400'
                    : siteTitle.length > 65
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}>
                  {siteTitle.length} / 60 chars
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  siteTitle.length >= 40 && siteTitle.length <= 65
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {siteTitle.length >= 40 && siteTitle.length <= 65 ? 'Optimal' : siteTitle.length > 65 ? 'Truncates on Mobile' : 'Add More Keywords'}
                </span>
              </div>
            </div>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="e.g. ALL NEW YONO APPS (2026) - Real Cash Games & APK Downloads"
              className="w-full bg-slate-950 text-white text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <p className="text-[11px] text-slate-400">
              💡 <strong>Pro Tip:</strong> Keep your title between 50-60 characters. Always include <em>"YONO APPS"</em>, <em>"2026"</em>, and <em>"APK Download"</em> for high CTR.
            </p>
          </div>

          {/* 2. Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Meta Description</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`font-mono font-bold ${
                  siteDescription.length >= 120 && siteDescription.length <= 165
                    ? 'text-emerald-400'
                    : siteDescription.length > 165
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}>
                  {siteDescription.length} / 160 chars
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  siteDescription.length >= 120 && siteDescription.length <= 165
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {siteDescription.length >= 120 && siteDescription.length <= 165 ? 'Optimal Length' : 'Adjust Length'}
                </span>
              </div>
            </div>
            <textarea
              rows={3}
              required
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="e.g. Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal..."
              className="w-full bg-slate-950 text-white text-xs sm:text-sm p-4 rounded-2xl border border-slate-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
            <p className="text-[11px] text-slate-400">
              💡 <strong>Pro Tip:</strong> Mention clear user benefits like <em>"₹500 Free Bonus"</em>, <em>"₹100 UPI Cashout"</em>, and <em>"100% Virus-Free APK"</em>.
            </p>
          </div>

          {/* 3. Meta Keywords & Search Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Meta Keywords & Ranking Tags (Comma-separated)</span>
            </label>
            <textarea
              rows={2}
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="all yono apps, yono games apk download, all new yono app 2026, yono vip, yono 777..."
              className="w-full bg-slate-950 text-amber-300 font-mono text-xs p-3.5 rounded-2xl border border-slate-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />

            {/* Quick 1-Click Keyword Injectors */}
            <div className="pt-1">
              <div className="text-[11px] text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Click to quickly inject high-ranking keyword tags:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywordSuggestions.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleAddKeyword(kw)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>+</span>
                    <span>{kw}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Card: Canonical URL, Google Search Console & Brand */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Canonical URL, Verification & Social Sharing
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Canonical URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Canonical Website URL</span>
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://allnewyonoapps.com"
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                Your primary live domain (or WordPress domain) to prevent duplicate content penalties.
              </p>
            </div>

            {/* Author / Brand Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Author / Publisher Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="YONO Official Community"
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                Displayed in Google Knowledge Graph and Search Snippets.
              </p>
            </div>

            {/* Google Search Console Verification Tag */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Search Console Verification Tag (HTML Tag)</span>
              </label>
              <input
                type="text"
                value={googleVerification}
                onChange={(e) => {
                  let val = e.target.value;
                  // If user pasted entire meta tag, extract the content value
                  const match = val.match(/content=["']([^"']+)["']/i);
                  if (match && match[1]) {
                    val = match[1];
                  }
                  setGoogleVerification(val);
                }}
                placeholder="Paste code e.g. google1234567890abcdef OR full meta tag"
                className="w-full bg-slate-950 text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Paste your Google Search Console verification code here. We will automatically inject <code>&lt;meta name="google-site-verification" content="..."&gt;</code> into the website head.
              </p>
            </div>

            {/* OG Social Share Image URL */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Social Share Banner (Open Graph Image URL)</span>
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-none"
                />
                {ogImage && (
                  <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                    <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                The preview image shown when your website is shared on WhatsApp, Facebook, or Telegram.
              </p>
            </div>

          </div>
        </div>

        {/* Save Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">
            💾 Settings are saved to WordPress-compatible browser state and applied live across visitor pages.
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save SEO Settings</span>
          </button>
        </div>

      </form>

      {/* ========================================================
          SECTION 3: WORDPRESS & HTML META CODE EXPORT
      ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              WordPress & HTML &lt;head&gt; SEO Export
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(generatedMetaTags, 'meta-tags-code')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedCode === 'meta-tags-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode === 'meta-tags-code' ? 'Copied Meta Code!' : 'Copy HTML Meta Code'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          If you are using WordPress SEO plugins (like <strong>Rank Math</strong>, <strong>Yoast SEO</strong>, or <strong>All in One SEO</strong>), you can copy these meta tags or paste the title and description into the plugin fields.
        </p>

        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
          <pre>{generatedMetaTags}</pre>
        </div>
      </div>

    </div>
  );
};
