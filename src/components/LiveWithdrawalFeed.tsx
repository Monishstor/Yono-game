import React, { useState, useEffect } from 'react';
import { LIVE_WITHDRAWALS } from '../data/promoCodes';
import { WithdrawalRecord } from '../types';
import { ShieldCheck, CheckCircle2, TrendingUp, X } from 'lucide-react';

interface LiveWithdrawalFeedProps {
  records?: WithdrawalRecord[];
}

export const LiveWithdrawalFeed: React.FC<LiveWithdrawalFeedProps> = ({ records }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const activeRecords = records && records.length > 0 ? records : LIVE_WITHDRAWALS;

  useEffect(() => {
    if (isDismissed || activeRecords.length === 0) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeRecords.length);
        setVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [isDismissed, activeRecords.length]);

  if (isDismissed || activeRecords.length === 0) return null;

  const current = activeRecords[currentIndex] || activeRecords[0];

  return (
    <div className={`fixed bottom-20 left-3 sm:bottom-4 sm:left-4 z-30 max-w-xs sm:max-w-sm hidden sm:block transition-all duration-500 transform ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl text-slate-100 text-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white truncate">{current.user}</span>
            <span className="text-[10px] text-slate-400 font-mono">{current.timeAgo}</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Withdrew <strong className="text-emerald-400 font-extrabold font-mono">₹{current.amount.toLocaleString()}</strong> from {current.appName}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" />
            <span>Transferred to {current.method}</span>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-1"
          title="Dismiss alerts"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
