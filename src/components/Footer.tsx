import React, { useState } from 'react';
import { Crown, Send, ShieldAlert, Share2, MessageCircle, Copy, Check } from 'lucide-react';

interface FooterProps {
  onOpenPromo: () => void;
  onScrollTo: (id: string) => void;
  telegramLink?: string;
  onOpenLegal?: (tab: 'contact' | 'about' | 'privacy' | 'terms' | 'dmca' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPromo, 
  onScrollTo,
  telegramLink = 'https://t.me/yonojiunauxcom',
  onOpenLegal
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://yono-game.vercel.app';
  };

  const shareText = `🔥 *ALL NEW YONO APPS 2026 - FREE ₹51 TO ₹1500 BONUS!* 🎁\n\nDirect working APK Download links with 2-Minute Instant UPI Cashout ⚡\n\n✅ 100% Virus-Free & Safe\n✅ Daily Free Spin & Free Promo Codes\n✅ Lowest Minimum Withdrawal ₹100\n\n👇 *Download Now & Claim Free Bonus:* \n${getShareUrl()}`;

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`🔥 ALL NEW YONO APPS (2026) - Claim ₹51-₹1500 Free Bonus & Instant UPI Payout! 💰`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Share With Friends Section (Replaced Admin Panel) */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white font-['Outfit',sans-serif]">
                Share With Friends & Earn (दोस्तों के साथ शेयर करें)
              </h3>
              <p className="text-[11px] text-slate-300">
                Share this website on WhatsApp or Telegram so your friends get ₹51–₹1500 free sign-up bonus!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5] fill-slate-950" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Telegram Share */}
            <button
              onClick={handleTelegramShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer min-h-[44px]"
              title="Copy Share Message"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-950 font-black shadow-lg ring-2 ring-amber-500/40 overflow-hidden p-0.5">
                <img 
                  src="/main-site-logo.svg" 
                  alt="All New Yono Apps Official" 
                  className="w-full h-full object-cover rounded-lg"
                  width="40"
                  height="40"
                  loading="lazy"
                />
              </div>
              <span className="font-black text-lg text-white font-['Outfit',sans-serif]">
                ALL NEW <span className="text-amber-400">YONO APPS</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              Yono Portal (yono-game.vercel.app) is India's leading information and download portal for all verified Yono gaming APKs, free sign-up bonuses, daily promo codes, and fast UPI withdrawal guides.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-colors min-h-[44px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Official Telegram Channel</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Quick Navigation
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Home & Top Apps
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('all-apps-section')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  All Working Yono Apps List
                </button>
              </li>
              <li>
                <button onClick={onOpenPromo} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Promo Codes & Vouchers
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('guide-section')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  APK Installation Guide
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal?.('contact')} className="hover:text-amber-400 transition-colors text-left cursor-pointer text-amber-400 font-bold">
                  Contact Support & Helpdesk
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Legal & Support
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onOpenLegal?.('about')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  About Yono Games Hub
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal?.('privacy')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Privacy Policy & Data
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal?.('terms')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Terms of Service (18+ Only)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal?.('dmca')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  DMCA Copyright Notice
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal?.('disclaimer')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Responsible Gaming
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Responsible Gaming & Statutory Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Statutory Risk Disclaimer & 18+ Only Notice:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Skill-based cash games involve an element of financial risk and may be habit-forming. Please play responsibly and at your own risk. This portal is an independent real-money gaming APK catalog and reviews directory. We do not host or operate betting servers. Restricted in Assam, Odisha, Andhra Pradesh, Telangana, and states where skill-based gaming is legally barred.
          </p>
        </div>

        {/* Copyright & Disclaimer Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 All New Yono Games — Independent APK & Skill Gaming Portal.
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <button onClick={() => onOpenLegal?.('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">Contact Us</button>
            <span>•</span>
            <button onClick={() => onOpenLegal?.('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onOpenLegal?.('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">Terms of Service</button>
            <span>•</span>
            <button onClick={() => onOpenLegal?.('dmca')} className="hover:text-amber-400 transition-colors cursor-pointer">DMCA</button>
            <span>•</span>
            <button onClick={() => onOpenLegal?.('disclaimer')} className="hover:text-amber-400 transition-colors cursor-pointer">Disclaimer</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
