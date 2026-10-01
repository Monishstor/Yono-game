import React, { useState } from 'react';
import { Check, X, Scale } from 'lucide-react';

interface ResponsibleGamingBannerProps {
  showAgeDisclaimer?: boolean;
}

export const ResponsibleGamingBanner: React.FC<ResponsibleGamingBannerProps> = ({
  showAgeDisclaimer = true
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (!showAgeDisclaimer || dismissed) return null;

  return (
    <aside
      aria-label="18+ Disclaimer"
      className="bg-slate-950/95 border-b border-amber-500/20 text-amber-300/90 text-xs py-1 px-3 sm:px-6 relative z-30 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase leading-none">
            18+ ONLY
          </span>
          <span className="truncate text-xs text-slate-300 font-normal">
            <strong className="text-amber-400 font-semibold">जिम्मेदारी से खेलें:</strong> यह खेल वित्तीय जोखिम का हिस्सा है। 18 वर्ष से कम आयु के लिए वर्जित है। कृपया अपनी जिम्मेदारी पर खेलें।
          </span>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-0.5 rounded text-slate-400 hover:text-white shrink-0 transition-colors cursor-pointer"
          title="Dismiss"
          aria-label="Dismiss Disclaimer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
