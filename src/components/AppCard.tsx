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

export const AppCard: React.FC<AppCardProps> = ({ app, onDownload, onViewDetails, onEdit }) => {
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
      className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 hover:border-amber-500/50 p-4 sm:p-5 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Top Badges */}
      <div className="absolute -top-2.5 right-4 z-10 flex items-center gap-1.5">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(app);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 shadow-md border border-slate-700 transition-colors cursor-pointer"
            title="Edit app name, image & bonus"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}
        {app.badge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md">
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
              <h3 className="text-base font-bold text-white truncate font-['Outfit',sans-serif] group-hover:text-amber-300 transition-colors">
                {app.name}
              </h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">{app.version}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px]">{app.apkSize}</span>
            </div>

            {/* Rating & Downloads */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-400 text-xs font-bold bg-amber-400/10 px-1.5 py-0.2 rounded">
                <Star className="w-3 h-3 fill-amber-400 mr-1" />
                <span>{app.rating}</span>
              </div>
              <span className="text-slate-400 text-[11px]">{app.downloads}</span>
            </div>
          </div>
        </div>

        {/* Bonus & Min Withdrawal Highlights Strip */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold tracking-wider">Free Bonus</span>
            <span className="font-extrabold text-amber-400 text-sm flex items-center gap-1">
              <span>₹{app.signupBonus}</span>
              {app.maxSignupBonus && (
                <span className="text-[10px] text-amber-300/80 font-normal">
                  - ₹{app.maxSignupBonus}
                </span>
              )}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold tracking-wider">Min Cashout</span>
            <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-1">
              <span>₹{app.minWithdrawal}</span>
              <span className="text-[10px] text-emerald-300/80 font-normal">UPI/Bank</span>
            </span>
          </div>
        </div>

        {/* Included Game Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {app.gamesList.slice(0, 3).map((game) => (
            <span key={game} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
              {game}
            </span>
          ))}
          {app.gamesList.length > 3 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-400 font-mono">
              +{app.gamesList.length - 3}
            </span>
          )}
        </div>

        {/* Refer Code Pill & Safety Seal */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 mb-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Safe APK</span>
          </div>
          <button
            onClick={handleCopyRefer}
            className="flex items-center gap-1 font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors text-[11px] cursor-pointer"
            title="Click to copy refer code"
          >
            <span>{app.referCode}</span>
            {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
        <button
          id={`card-download-btn-${app.id}`}
          onClick={() => onDownload(app)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/15 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download APK</span>
        </button>

        <button
          id={`card-details-btn-${app.id}`}
          onClick={() => onViewDetails(app)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          title="Full App Details & Proof"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
