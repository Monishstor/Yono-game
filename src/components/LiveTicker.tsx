import React from 'react';
import { Volume2, Sparkles, Zap, ShieldCheck, Flame, Gift } from 'lucide-react';
import { TickerNotice } from '../types';

interface LiveTickerProps {
  onOpenPromo: () => void;
  notices?: TickerNotice[];
  showTicker?: boolean;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ onOpenPromo, notices, showTicker = true }) => {
  if (!showTicker) return null;

  const defaultNotices: TickerNotice[] = [
    { id: '1', type: 'sparkles', text: 'New 2026 Release: Yono 777 & Yono Arcade v4.8 APKs updated! Claim ₹51 - ₹1500 sign-up bonus today.' },
    { id: '2', type: 'zap', text: 'Fastest Payouts: Minimum withdrawal is ₹100 via instant UPI / IMPS Bank Transfer.' },
    { id: '3', type: 'shield', text: '100% Safe APKs: All packages verified virus-free & tested on Android 14/15.' }
  ];

  const activeNotices = notices && notices.length > 0 ? notices : defaultNotices;

  const getIcon = (type: string) => {
    switch (type) {
      case 'sparkles': return <Sparkles className="w-4 h-4 text-amber-200 inline" />;
      case 'zap': return <Zap className="w-4 h-4 text-amber-100 inline" />;
      case 'shield': return <ShieldCheck className="w-4 h-4 text-emerald-950 inline" />;
      case 'flame': return <Flame className="w-4 h-4 text-orange-200 inline" />;
      case 'gift': return <Gift className="w-4 h-4 text-yellow-200 inline" />;
      default: return <Sparkles className="w-4 h-4 text-amber-200 inline" />;
    }
  };

  return (
    <div id="live-news-ticker" className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-slate-950 text-xs sm:text-sm font-semibold py-1.5 px-4 shadow-md overflow-hidden relative border-b border-amber-400/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0 bg-slate-950/20 px-2 py-0.5 rounded-full text-white text-xs backdrop-blur-xs font-bold uppercase tracking-wider">
          <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Notice</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1 relative">
          <div className="inline-block animate-marquee pl-4">
            {activeNotices.map((n) => (
              <span key={n.id} className="inline-flex items-center gap-2 mr-8">
                {getIcon(n.type)}
                <span>{n.text}</span>
              </span>
            ))}
          </div>
        </div>

        <button
          id="ticker-promo-btn"
          onClick={onOpenPromo}
          className="shrink-0 hidden md:flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full transition-all border border-amber-400/40 cursor-pointer shadow-xs hover:scale-105 active:scale-95"
        >
          <span>🎁 Daily Gift Codes</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>
      </div>
    </div>
  );
};

