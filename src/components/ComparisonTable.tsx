import React from 'react';
import { YonoApp } from '../types';
import { Download, Star, CheckCircle2, Zap, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { AppIcon } from './AppIcon';

interface ComparisonTableProps {
  apps: YonoApp[];
  onDownload: (app: YonoApp) => void;
  onViewDetails: (app: YonoApp) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  apps,
  onDownload,
  onViewDetails
}) => {
  return (
    <div id="yono-comparison-table-wrapper" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-950/60">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
            All Yono Games Bonus & Withdrawal Comparison Table 2026
          </h3>
          <p className="text-xs text-slate-400">
            Compare sign-up bonuses, minimum cashout limits, and APK sizes across {apps.length} verified apps.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Instant Payout Tested</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">App Name</th>
              <th className="py-3.5 px-4">Sign Up Bonus</th>
              <th className="py-3.5 px-4">Min Withdrawal</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Referral Bonus</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Rating & Size</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Payout Speed</th>
              <th className="py-3.5 px-4 text-right">Download Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {apps.map((app, index) => (
              <tr 
                key={app.id}
                id={`table-row-${app.id}`}
                className="hover:bg-slate-800/50 transition-colors group"
              >
                {/* App Name & Icon */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <AppIcon app={app} sizeClassName="w-10 h-10" textClassName="text-sm" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewDetails(app)}
                          className="font-bold text-white group-hover:text-amber-400 transition-colors text-left cursor-pointer"
                        >
                          {app.name}
                        </button>
                        {app.badge && (
                          <span className="hidden xl:inline-flex text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {app.version}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Sign up Bonus */}
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                  <span>₹{app.signupBonus}</span>
                  {app.maxSignupBonus && (
                    <span className="text-[11px] text-slate-400 font-normal block sm:inline sm:ml-1">
                      (Up to ₹{app.maxSignupBonus})
                    </span>
                  )}
                </td>

                {/* Min Withdrawal */}
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  <span>₹{app.minWithdrawal}</span>
                  <span className="text-[10px] text-slate-400 font-normal block">UPI / Bank</span>
                </td>

                {/* Refer Bonus */}
                <td className="py-3.5 px-4 text-slate-300 hidden md:table-cell text-xs">
                  <span className="font-bold text-amber-300">₹{app.referBonus}</span> + {app.referCommission}
                </td>

                {/* Rating & Size */}
                <td className="py-3.5 px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{app.rating}</span>
                    <span className="text-slate-500 font-normal ml-1 font-mono text-[11px]">({app.apkSize})</span>
                  </div>
                </td>

                {/* Payout Speed */}
                <td className="py-3.5 px-4 hidden sm:table-cell">
                  <div className="flex items-center gap-1 text-slate-300 text-xs font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{app.withdrawalSpeed}</span>
                  </div>
                </td>

                {/* Download Button */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      id={`table-download-btn-${app.id}`}
                      onClick={() => onDownload(app)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onViewDetails(app)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                      title="View Details"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
