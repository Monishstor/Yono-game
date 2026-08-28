import React, { useState } from 'react';
import { YonoApp, SiteSettings } from '../types';
import { AppIcon } from './AppIcon';
import { 
  Download, 
  Star, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ExternalLink,
  Smartphone,
  Gift,
  Trophy,
  Wallet,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';

interface GameLandingPageProps {
  app: YonoApp;
  allApps: YonoApp[];
  siteSettings: SiteSettings;
  onBackToHome: () => void;
  onSelectApp: (app: YonoApp) => void;
  onDownload: (app: YonoApp) => void;
}

export const GameLandingPage: React.FC<GameLandingPageProps> = ({
  app,
  allApps,
  siteSettings,
  onBackToHome,
  onSelectApp,
  onDownload
}) => {
  const [copiedReferCode, setCopiedReferCode] = useState(false);
  const [copiedPageUrl, setCopiedPageUrl] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyReferCode = () => {
    navigator.clipboard.writeText(app.referCode);
    setCopiedReferCode(true);
    setTimeout(() => setCopiedReferCode(false), 2500);
  };

  const handleCopyShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopiedPageUrl(true);
    setTimeout(() => setCopiedPageUrl(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🔥 Download ${app.name} APK and get ₹${app.signupBonus} FREE Sign-up Bonus + ₹100 Min Fast UPI Cashout!\n\nDownload Link: ${typeof window !== 'undefined' ? window.location.href : ''}\nReferral Code: ${app.referCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `🔥 Download ${app.name} APK - Claim ₹${app.signupBonus} FREE Welcome Bonus!\nRefer Code: ${app.referCode}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Related / Similar Yono Apps
  const relatedApps = allApps
    .filter((a) => a.id !== app.id)
    .slice(0, 4);

  // Game-Specific Programmatic FAQs
  const gameFaqs = [
    {
      q: `How to download and install ${app.name} APK on Android?`,
      a: `To download ${app.name} APK safely, click the golden "Download Official APK" button on this page. Once the APK file (approx ${app.apkSize}) finishes downloading, tap on it to install. If your phone asks for permission, enable "Install from Unknown Sources" in Settings. The installation completes within seconds.`
    },
    {
      q: `How much Sign-up Bonus do I get in ${app.name}?`,
      a: `New players receive an instant ₹${app.signupBonus}${app.maxSignupBonus ? ` to ₹${app.maxSignupBonus}` : ''} Free Bonus as soon as they open the app and bind their mobile number via OTP. Use referral code "${app.referCode}" to claim maximum VIP welcome cash.`
    },
    {
      q: `What is the minimum withdrawal limit and payout speed in ${app.name}?`,
      a: `The minimum withdrawal in ${app.name} is only ₹${app.minWithdrawal}. Payouts are processed 24/7 directly to your Bank Account, Google Pay, PhonePe, or Paytm UPI within ${app.withdrawalSpeed || '1 to 3 minutes'}.`
    },
    {
      q: `Is ${app.name} APK safe and virus-free?`,
      a: `Yes, 100%! All APK download links provided on this portal are tested, clean, official packages verified against Google Play Protect standards with a 100% safety score.`
    },
    {
      q: `How to earn daily lifetime commission with ${app.name} referral program?`,
      a: `Share your personal ${app.name} refer link or referral code "${app.referCode}" with your friends on WhatsApp & Telegram. You will earn up to ${app.referCommission || '30% lifetime commission'} on all their gameplay and deposits, withdrawable instantly to UPI.`
    }
  ];

  return (
    <div id="game-seo-landing-page" className="min-h-screen pb-20 font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 dark:bg-transparent">
      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="bg-white/95 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 sticky top-16 sm:top-20 z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          <button
            id="landing-back-to-home-btn"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-bold transition-all border border-slate-300 dark:border-slate-700 cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>All Yono Games List</span>
          </button>

          {/* Clean Breadcrumb Hierarchy for SEO & User Navigation */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <button onClick={onBackToHome} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</button>
            <span>/</span>
            <button onClick={onBackToHome} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">All Yono Games</button>
            <span>/</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold truncate max-w-[180px]">{app.name} APK</span>
          </nav>

          {/* Quick Share Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyShareLink}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Copy Page URL"
            >
              {copiedPageUrl ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedPageUrl ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">

        {/* HERO CARD (SEO H1 & Primary Download Card) */}
        <section id="game-hero-card" className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-amber-500/30 p-5 sm:p-8 shadow-lg dark:shadow-2xl dark:shadow-black/50 relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
            
            {/* Left: App Identity, H1 Title, Ratings, Specs */}
            <div className="flex-1 space-y-4">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Virus-Free & Verified Official APK (2026)</span>
              </div>

              {/* H1 Primary Heading */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <AppIcon app={app} sizeClassName="w-20 h-20 sm:w-24 sm:h-24" textClassName="text-4xl" />
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Outfit',sans-serif] tracking-tight leading-tight">
                      {app.name} <span className="gold-shimmer-text">APK Download</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium leading-snug">
                      {app.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Star Rating, Downloads, File Size, Updated */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 px-3 py-1 rounded-xl text-amber-800 dark:text-amber-300 font-extrabold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{app.rating} / 5.0</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300/80 font-normal">({app.reviewsCount.toLocaleString()} Votes)</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 px-3 py-1 rounded-xl font-medium text-slate-800 dark:text-slate-200">
                  <Download className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{app.downloads} Installs</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 px-3 py-1 rounded-xl font-mono text-slate-800 dark:text-slate-300">
                  <span>Size: <strong>{app.apkSize}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700/80 px-3 py-1 rounded-xl text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>v{app.version}</span>
                </div>
              </div>
            </div>

            {/* Right: High-Converting Download Action Box */}
            <div className="w-full lg:w-96 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-md dark:shadow-xl">
              
              {/* Free Bonus Callout */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/20 dark:via-amber-400/10 dark:to-orange-500/20 border border-amber-200 dark:border-amber-500/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Instant Sign-up Bonus</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-['Outfit',sans-serif]">
                    ₹{app.signupBonus} {app.maxSignupBonus && <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">- ₹{app.maxSignupBonus}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">Min UPI Cashout</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit',sans-serif]">
                    ₹{app.minWithdrawal}
                  </div>
                </div>
              </div>

              {/* Main Download CTA Button */}
              <button
                id="landing-hero-download-btn"
                onClick={() => onDownload(app)}
                className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg btn-gold-action flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-98 shadow-xl cursor-pointer uppercase tracking-wider"
              >
                <Download className="w-6 h-6 stroke-[3] animate-bounce" />
                <span>DOWNLOAD {app.name.toUpperCase()} APK</span>
              </button>

              {/* Referral Code 1-Click Copy Box */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold flex items-center justify-between">
                  <span>VIP Referral Code:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Bonus Guaranteed</span>
                </div>
                <div 
                  onClick={handleCopyReferCode}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:border-amber-500 flex items-center justify-between cursor-pointer transition-colors group shadow-xs"
                >
                  <span className="font-mono font-black text-slate-900 dark:text-amber-300 text-sm tracking-wider">
                    {app.referCode}
                  </span>
                  <button className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-white">
                    {copiedReferCode ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Micro Payout Assurance */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> {app.withdrawalSpeed}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 100% Virus-Free
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* KEY HIGHLIGHTS & COMPARISON METRICS */}
        <section id="game-specs-grid" className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Sign-Up Bonus</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">₹{app.signupBonus} Free</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Min Withdrawal</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{app.minWithdrawal} (UPI)</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/20 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Payout Speed</div>
              <div className="text-lg font-black text-sky-600 dark:text-sky-400">{app.withdrawalSpeed}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Referral Bonus</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400">{app.referCommission || '30% Comm'}</div>
            </div>
          </div>
        </section>

        {/* GAMES LIST & KEY FEATURES */}
        <section id="game-features-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Included Games in this App */}
          <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                Games Inside {app.name}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Play 30+ real cash card and multiplayer games with real players across India:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {app.gamesList.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-amber-400 transition-colors"
                >
                  🎮 {g}
                </span>
              ))}
            </div>
          </div>

          {/* Official Features & Description */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                {app.name} Highlights & Rewards
              </h2>
            </div>

            <div className="space-y-2.5">
              {app.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* STEP BY STEP HOW TO DOWNLOAD & CLAIM BONUS GUIDE */}
        <section id="game-how-to-guide" className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 space-y-6 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit',sans-serif]">
              How to Download {app.name} & Claim ₹{app.signupBonus} Bonus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Follow these 4 simple steps to install the APK and get instant welcome cash:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Click Download APK</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click the golden Download button on this page to download the latest {app.apkSize} official package.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Allow Unknown Apps</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Open phone Settings & enable "Install Unknown Apps" for Chrome/Browser to proceed with safe installation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register with Mobile OTP</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Open {app.name}, click on Profile, enter your Mobile Number, and verify OTP with referral code <strong>{app.referCode}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-purple-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Play & Instant Withdraw</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant ₹{app.signupBonus} free cash is credited! Play games and withdraw winnings to UPI (Min ₹100).
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onDownload(app)}
              className="inline-flex items-center gap-2 py-3 px-8 rounded-xl font-black text-sm btn-gold-action shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>DOWNLOAD {app.name.toUpperCase()} NOW</span>
            </button>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ SCHEMA COMPATIBLE) */}
        <section id="game-faq-section" className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                Frequently Asked Questions ({app.name} FAQ)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Everything you need to know about bonuses, downloads & withdrawals</p>
            </div>
          </div>

          <div className="space-y-3">
            {gameFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-amber-500 dark:text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RELATED / SIMILAR YONO GAMES (CROSS-CONVERSION GRID) */}
        {relatedApps.length > 0 && (
          <section id="related-apps-section" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                  Similar Top Yono Games (2026)
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Players who downloaded {app.name} also loved these:</p>
              </div>
              <button
                onClick={onBackToHome}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 underline"
              >
                View All {allApps.length}+ Games →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedApps.map((relApp) => (
                <div
                  key={relApp.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon app={relApp} sizeClassName="w-12 h-12" textClassName="text-xl" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        {relApp.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{relApp.rating}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({relApp.downloads})</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Free Bonus</span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">₹{relApp.signupBonus}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectApp(relApp)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Read Details
                    </button>
                    <button
                      onClick={() => onDownload(relApp)}
                      className="py-2 px-3.5 rounded-xl btn-gold-action text-xs font-black transition-all hover:scale-105 cursor-pointer"
                      title="Download APK"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
