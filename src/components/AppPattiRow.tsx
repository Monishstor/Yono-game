import React, { useState } from 'react';
import { YonoApp } from '../types';
import { 
  Download, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check, 
  Coins,
  Crown,
  Flame,
  Award,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface AppPattiRowProps {
  app: YonoApp;
  rank: number;
  onDownload: (app: YonoApp) => void;
  onViewDetails?: (app: YonoApp) => void;
  onEdit?: (app: YonoApp) => void;
}

export const AppPattiRow: React.FC<AppPattiRowProps> = React.memo(({
  app,
  rank,
  onDownload,
  onViewDetails,
  onEdit
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyRefer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (app.referCode) {
      navigator.clipboard.writeText(app.referCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRowClick = () => {
    if (onViewDetails) {
      onViewDetails(app);
    } else {
      onDownload(app);
    }
  };

  // Rank badge styling
  const isTop1 = rank === 1;
  const isTop2 = rank === 2;
  const isTop3 = rank === 3;

  return (
    <div
      id={`app-patti-${app.id}`}
      onClick={handleRowClick}
      className={`group relative w-full rounded-2xl bg-white dark:bg-slate-900 shadow-sm border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 ${
        isTop1
          ? 'border-amber-500/60 shadow-amber-500/10 ring-1 ring-amber-500/30'
          : isTop2
          ? 'border-slate-300 dark:border-slate-400/50'
          : isTop3
          ? 'border-orange-300 dark:border-orange-500/40'
          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/60'
      }`}
    >
      {/* Left Column: Rank + App Icon + Main Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        
        {/* Rank Badge */}
        <div className="shrink-0 flex items-center justify-center">
          {isTop1 ? (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-500/30">
              <Crown className="w-4 h-4" />
            </div>
          ) : isTop2 ? (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-400 dark:to-slate-200 text-slate-900 flex items-center justify-center font-black text-xs shadow-sm border border-slate-300 dark:border-slate-500">
              <Award className="w-4 h-4" />
            </div>
          ) : isTop3 ? (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-md">
              <Flame className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-xs">
              #{rank}
            </div>
          )}
        </div>

        {/* App Icon */}
        <div className="shrink-0">
          <AppIcon app={app} sizeClassName="w-12 h-12 sm:w-14 sm:h-14" textClassName="text-sm sm:text-base font-black" priority={rank <= 2} />
        </div>

        {/* App Title, Bonus & Tags */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <a
              href={`/?app=${app.slug || app.id}`}
              onClick={(e) => {
                if (onViewDetails) {
                  e.preventDefault();
                  e.stopPropagation();
                  onViewDetails(app);
                }
              }}
              className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate font-['Outfit',sans-serif] group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors"
            >
              {app.name}
            </a>

            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />

            {app.badge && (
              <span className="shrink-0 text-xs font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                {app.badge}
              </span>
            )}
          </div>

          {/* Key Metrics Pills Row (Bonus, Min Withdrawal, Safe) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mt-1 text-xs">
            
            {/* Free Bonus Pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
              <Coins className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>₹{app.signupBonus} Bonus</span>
              {app.maxSignupBonus && (
                <span className="text-xs text-amber-700/80 dark:text-amber-200/80 font-normal">
                  - ₹{app.maxSignupBonus}
                </span>
              )}
            </span>

            {/* Min Withdrawal */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <Zap className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span>Min ₹{app.minWithdrawal}</span>
            </span>

            {/* Rating / Downloads on bigger screens */}
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{app.rating}</span>
              <span>•</span>
              <span>{app.downloads}</span>
            </span>

            {/* Refer Code Pill */}
            {app.referCode && (
              <button
                onClick={handleCopyRefer}
                aria-label={`Copy referral code ${app.referCode} for ${app.name}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold transition-colors cursor-pointer"
                title="Copy Referral Code"
              >
                <span>Code: {app.referCode}</span>
                {copiedCode ? (
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Instant Download CTA Button */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
        
        {/* Safe badge on mobile */}
        <div className="md:hidden flex items-center gap-1 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>100% Safe APK</span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Admin Edit Button */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(app);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title="Edit App Details & Download Link"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {/* Primary Download / Referral Button */}
          <a
            id={`patti-download-btn-${app.id}`}
            href={`/?app=${app.slug || app.id}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onViewDetails) {
                onViewDetails(app);
              } else {
                onDownload(app);
              }
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-5 sm:px-6 rounded-xl font-black text-xs sm:text-sm btn-gold-action transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>DOWNLOAD</span>
          </a>
        </div>
      </div>
    </div>
  );
});
