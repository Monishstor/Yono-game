import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Crown, 
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero-section" className="relative pt-6 pb-10 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Headline & Value Props */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white font-['Outfit',sans-serif] tracking-tight leading-tight sm:leading-none">
            Download All <span className="gold-shimmer-text">New Yono Games 2026</span> & Instant Withdrawal Apps
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover verified New Yono Games 2026 and fast instant withdrawal apps. Compare sign-up bonuses (₹51 to ₹1500), ₹100 instant UPI payout speeds, and claim official promo codes with zero risk.
          </p>

          {/* Quick Psychological Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Review app details</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-xs">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Check withdrawal terms</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-500/40 text-xs font-bold text-sky-800 dark:text-sky-300 shadow-xs">
              <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Compare current offers</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/40 text-xs font-bold text-purple-800 dark:text-purple-300 shadow-xs">
              <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Browse app listings</span>
            </div>
          </div>
        </div>

        {/* Global Live Statistics Strip with Color Psychology */}
        <div className="rounded-2xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 border border-slate-200 dark:border-amber-500/20 p-4 sm:p-5 shadow-lg dark:shadow-xl dark:shadow-black/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-['Outfit',sans-serif]">Compare</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">App details and offers</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit',sans-serif]">Offers</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Subject to app terms</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 font-['Outfit',sans-serif]">18+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Play responsibly</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-['Outfit',sans-serif]">India</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Check local eligibility</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
