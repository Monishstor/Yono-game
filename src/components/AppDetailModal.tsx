import React, { useState } from 'react';
import { YonoApp } from '../types';
import { 
  X, 
  Download, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check, 
  CreditCard, 
  Award,
  Gamepad2,
  Lock,
  ArrowRight,
  TrendingUp,
  Edit3
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface AppDetailModalProps {
  app: YonoApp | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (app: YonoApp) => void;
  onEdit?: (app: YonoApp) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  isOpen,
  onClose,
  onDownload,
  onEdit
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'withdrawal' | 'referral'>('overview');

  if (!isOpen || !app) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(app.referCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="app-detail-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="app-detail-modal-card"
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-7 text-slate-100 my-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <AppIcon app={app} sizeClassName="w-18 h-18" textClassName="text-3xl" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                {app.name}
              </h2>
              {app.badge && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {app.badge}
                </span>
              )}
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(app);
                  }}
                  className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit App</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-1">{app.tagline}</p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <div className="flex items-center text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span>{app.rating} ({app.reviewsCount.toLocaleString()} reviews)</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono">{app.apkSize}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">{app.downloads} Active Downloads</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Bonus' },
            { id: 'games', label: 'Supported Games (8+)' },
            { id: 'withdrawal', label: 'Withdrawal Proof' },
            { id: 'referral', label: 'Refer & Earn (₹50k)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 mb-6 text-xs sm:text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                {app.description}
              </p>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[11px] block">Sign-up Reward</span>
                  <span className="font-extrabold text-amber-400 text-sm">₹{app.signupBonus} Free</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Min Cashout</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₹{app.minWithdrawal}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Payout Time</span>
                  <span className="font-extrabold text-sky-400 text-sm">{app.withdrawalSpeed}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Safety Rating</span>
                  <span className="font-extrabold text-purple-400 text-sm">{app.safetyScore}% Safe</span>
                </div>
              </div>

              {/* Key Features Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider text-slate-400">
                  Key App Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {app.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 text-xs">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Payment Channels */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">Supported Payment Channels:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {app.paymentMethods.map((pm) => (
                      <span key={pm} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-bold">
                        {pm}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-emerald-400 font-bold text-xs">24/7 Fast Processing</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                Popular Games Included Inside {app.name}:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {app.gamesList.map((game, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <Gamepad2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-200">{game}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-xs pt-2">
                * All games are RNG certified for 100% fair dealing and zero bots.
              </p>
            </div>
          )}

          {activeTab === 'withdrawal' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Withdrawal Verified: Fast IMPS and UPI payouts processed in under 3 minutes.</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase">
                    <tr>
                      <th className="p-2.5">User</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Method</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-2.5 font-mono text-slate-300">+91 98****3210</td>
                      <td className="p-2.5 font-bold text-emerald-400">₹3,500.00</td>
                      <td className="p-2.5 text-slate-300">UPI (Google Pay)</td>
                      <td className="p-2.5 text-emerald-400 font-bold">Success ✅</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-300">+91 87****9841</td>
                      <td className="p-2.5 font-bold text-emerald-400">₹1,200.00</td>
                      <td className="p-2.5 text-slate-300">Paytm Wallet</td>
                      <td className="p-2.5 text-emerald-400 font-bold">Success ✅</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-300">+91 91****5520</td>
                      <td className="p-2.5 font-bold text-emerald-400">₹8,000.00</td>
                      <td className="p-2.5 text-slate-300">IMPS Bank Transfer</td>
                      <td className="p-2.5 text-emerald-400 font-bold">Success ✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'referral' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30">
                <h4 className="font-bold text-amber-400 text-sm mb-1">
                  Yono VIP Agent Referral Program
                </h4>
                <p className="text-xs text-slate-300">
                  Share your referral link with friends on WhatsApp & Telegram. Earn ₹50 to ₹100 instant bonus per install plus lifetime 30% commission!
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-slate-400">Your Invitation Code:</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold text-xs"
                  >
                    <span>{app.referCode}</span>
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onDownload(app);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download {app.name} APK ({app.apkSize})</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
