import React, { useState } from 'react';
import { Send, Sparkles, X, ChevronRight } from 'lucide-react';

interface FloatingTelegramBarProps {
  telegramLink?: string;
  channelName?: string;
  memberCount?: string;
}

export const FloatingTelegramBar: React.FC<FloatingTelegramBarProps> = ({
  telegramLink = 'https://t.me/yonojiunauxcom',
  channelName = 'Official YONO VIP Channel',
  memberCount = '54,200+'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Telegram Community Announcement"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-40 max-w-md w-auto"
    >
      <div className="relative group bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/40 rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-sky-950/80 backdrop-blur-xl flex items-center justify-between gap-3 animate-bounce-subtle">
        
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />

        <div className="relative flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-sky-500/30">
            <Send className="w-5 h-5 text-white stroke-[2.2] -translate-x-0.5 translate-y-0.5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                VIP Daily Codes
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-200 font-mono">
                {memberCount}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">
              {channelName}
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 shrink-0">
          <a
            id="floating-telegram-join-btn"
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>Join Free</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss Telegram announcement"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
