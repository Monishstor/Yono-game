import React, { useState } from 'react';
import { Crown, Send, ShieldAlert, Share2, MessageCircle, Copy, Check } from 'lucide-react';

interface FooterProps {
  onOpenPromo: () => void;
  onScrollTo: (id: string) => void;
  telegramLink?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPromo, 
  onScrollTo,
  telegramLink = 'https://t.me/yonojiunauxcom'
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://yonoji.netlify.app';
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
              <h4 className="text-sm font-black text-white font-['Outfit',sans-serif]">
                Share With Friends & Earn (दोस्तों के साथ शेयर करें)
              </h4>
              <p className="text-[11px] text-slate-400">
                Share this website on WhatsApp or Telegram so your friends get ₹51–₹1500 free sign-up bonus!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5] fill-slate-950" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Telegram Share */}
            <button
              onClick={handleTelegramShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Crown className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-black text-lg text-white font-['Outfit',sans-serif]">
                ALL NEW <span className="text-amber-400">YONO APPS</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              YonoJi (yonoji.netlify.app) is India's leading information and download portal for all verified Yono gaming APKs, free sign-up bonuses, daily promo codes, and fast UPI withdrawal guides.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Official Telegram Channel</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Quick Navigation
            </h4>
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
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Top Yono Games
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Yono 777 APK Download</li>
              <li>Yono Arcade Official</li>
              <li>Spin Winner ₹55 Bonus</li>
              <li>Yono VIP Games 2026</li>
              <li>Jaiho Rummy & Teen Patti</li>
              <li>MBM Bet & 101z Games</li>
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
            This game involves an element of financial risk and may be addictive. Please play responsibly and at your own risk. This portal only provides information, download links, and guides for entertainment purposes. We do not operate or host real-money gambling servers. Players must be 18 years of age or older. Prohibited in Assam, Odisha, Andhra Pradesh, Telangana, and states where skill-based gaming is restricted.
          </p>
        </div>

        {/* Copyright & Disclaimer Bar (Cleaned, no visible admin link) */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 AllNewYonoApps.com — All Rights Reserved. Not affiliated with SBI YONO.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">DMCA Notice</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
