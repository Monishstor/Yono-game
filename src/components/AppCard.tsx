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
  ExternalLink,
  Coins,
  ArrowUpRight,
  Edit3
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface AppCardProps {
  app: YonoApp;
  onDownload: (app: YonoApp) => void;
  onViewDetails: (app: YonoApp) => void;
  onEdit?: (app: YonoApp) => void;
}

export const AppCard: React.FC<AppCardProps> = React.memo(({ app, onDownload, onViewDetails, onEdit }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyRefer = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(app.referCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      id={`app-card-${app.id}`}
      onClick={() => onViewDetails(app)}
      className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-amber-500/60 p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges (Urgent & High Perceived Value) */}
      <div className="absolute -top-2.5 right-4 z-10 flex items-center gap-1.5">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(app);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 shadow-md border border-slate-700 transition-colors cursor-pointer"
            title="Edit app name, image & bonus"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}
        {app.badge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 shadow-md ring-1 ring-amber-400/50">
            {app.badge}
          </span>
        )}
      </div>

      <div>
        {/* Header: Icon + Titles */}
        <div className="flex items-start gap-3.5 mb-3.5">
          {/* App Icon using AppIcon component */}
          <AppIcon app={app} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <a
                href={`/?app=${app.slug || app.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onViewDetails(app);
                }}
                className="text-base font-black text-slate-900 dark:text-white truncate font-['Outfit',sans-serif] group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors"
              >
                {app.name}
              </a>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{app.version}</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{app.apkSize}</span>
            </div>

            {/* Rating & Downloads */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-800 dark:text-amber-400 text-xs font-black bg-amber-50 dark:bg-amber-400/15 border border-amber-200 dark:border-amber-400/30 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-1" />
                <span>{app.rating}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{app.downloads}</span>
            </div>
          </div>
        </div>

        {/* Bonus & Min Withdrawal Highlights Strip (Color Psychology: Amber Wealth + Emerald Cash) */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 mb-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-amber-800 dark:text-amber-400/90 block text-xs uppercase font-bold tracking-wider">Free Bonus</span>
            <span className="font-black text-amber-700 dark:text-amber-400 text-sm sm:text-base flex items-center gap-1">
              <span>₹{app.signupBonus}</span>
              {app.maxSignupBonus && (
                <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  - ₹{app.maxSignupBonus}
                </span>
              )}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-200 dark:border-slate-800 pl-2">
            <span className="text-emerald-800 dark:text-emerald-400/90 block text-xs uppercase font-bold tracking-wider">Min Cashout</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm sm:text-base flex items-center gap-1">
              <span>₹{app.minWithdrawal}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-300 font-normal">UPI/Bank</span>
            </span>
          </div>
        </div>

        {/* Included Game Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {app.gamesList.slice(0, 3).map((game) => (
            <span key={game} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700/50">
              {game}
            </span>
          ))}
          {app.gamesList.length > 3 && (
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono">
              +{app.gamesList.length - 3}
            </span>
          )}
        </div>

        {/* Refer Code Pill & Safety Seal */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 mb-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% Safe APK</span>
          </div>
          <button
            onClick={handleCopyRefer}
            aria-label={`Copy refer code ${app.referCode} for ${app.name}`}
            className="flex items-center gap-1 font-mono font-bold text-amber-800 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors text-xs cursor-pointer"
            title="Click to copy refer code"
          >
            <span>{app.referCode}</span>
            {copiedCode ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Action Footer with High-Conversion Gold Button */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
        <a
          id={`card-download-btn-${app.id}`}
          href={`/?app=${app.slug || app.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewDetails(app);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm btn-gold-action transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download APK</span>
        </a>

        <a
          id={`card-details-btn-${app.id}`}
          href={`/?app=${app.slug || app.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewDetails(app);
          }}
          aria-label={`View details and payment proof for ${app.name}`}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700/60"
          title="Full App Details & Proof"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
});
