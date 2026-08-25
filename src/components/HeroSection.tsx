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
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>ALL NEW YONO APPS STORE 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-mono">UPDATED TODAY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-tight sm:leading-none">
            Download All <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">New Yono Games</span> & Rummy APK
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Get instant <strong className="text-amber-400">₹51 to ₹1500 Sign-Up Bonus</strong> on OTP verification. Enjoy <strong className="text-emerald-400">₹100 Minimum UPI Withdrawals</strong> within 2 minutes and daily VIP free cash rewards.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Virus-Free APKs</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant 2-Min UPI Payout</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>30%-40% Lifetime Refer Comm</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Direct Working APK Links</span>
            </div>
          </div>
        </div>

        {/* Global Live Statistics Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 p-4 sm:p-5 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit',sans-serif]">Official</div>
              <div className="text-xs text-slate-400 font-medium">100% Virus-Free APKs</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit',sans-serif]">₹50 + ₹100</div>
              <div className="text-xs text-slate-400 font-medium">Free Welcome & Login</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-sky-400 font-['Outfit',sans-serif]">₹100</div>
              <div className="text-xs text-slate-400 font-medium">Instant UPI Withdrawal</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-black text-purple-400 font-['Outfit',sans-serif]">RRTN8BM3</div>
              <div className="text-xs text-slate-400 font-medium">VIP Code Auto-Applied</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
