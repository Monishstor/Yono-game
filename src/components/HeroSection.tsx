import React from 'react';
import { YonoApp } from '../types';
import { 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Star, 
  Crown, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface HeroSectionProps {
  topApps: YonoApp[];
  onDownloadClick: (app: YonoApp) => void;
  onViewDetails: (app: YonoApp) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  topApps,
  onDownloadClick,
  onViewDetails
}) => {
  return (
    <section id="hero-section" className="relative pt-6 pb-10 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Headline & Value Props */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="tracking-wide">ALL NEW YONO APPS STORE 2026</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-mono font-bold">UPDATED TODAY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-tight sm:leading-none">
            Download All <span className="gold-shimmer-text">New Yono Games</span> & Rummy APK
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Get instant <strong className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">₹51 to ₹1500 Sign-Up Bonus</strong> on OTP verification. Enjoy <strong className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/30">₹100 Minimum UPI Withdrawals</strong> within 2 minutes and daily VIP free cash rewards.
          </p>

          {/* Quick Psychological Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Virus-Free APKs</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-bold text-amber-300 shadow-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant 2-Min UPI Payout</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-950/40 border border-sky-500/40 text-xs font-bold text-sky-300 shadow-sm">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>30%-40% Lifetime Refer Comm</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-bold text-purple-300 shadow-sm">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>Direct Official APK Links</span>
            </div>
          </div>
        </div>

        {/* Global Live Statistics Strip with Color Psychology */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-amber-500/20 p-4 sm:p-5 shadow-xl shadow-black/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit',sans-serif]">Official</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">100% Virus-Free APKs</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit',sans-serif]">₹50 + ₹100</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Free Welcome & Login</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-sky-400 font-['Outfit',sans-serif]">₹100 Min</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Instant UPI Withdrawal</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-purple-400 font-['Outfit',sans-serif]">RRTN8BM3</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">VIP Code Auto-Applied</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
