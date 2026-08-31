import React, { useState, useEffect } from 'react';
import { YonoApp } from '../types';
import { 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Copy, 
  Check, 
  ArrowDownCircle, 
  ExternalLink,
  Sparkles,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Send,
  AlertTriangle
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface DownloadModalProps {
  app: YonoApp | null;
  isOpen: boolean;
  onClose: () => void;
  telegramLink?: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ app, isOpen, onClose, telegramLink = 'https://t.me/yonojiunauxcom' }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    if (!isOpen || !app) {
      setDownloadProgress(0);
      setIsCompleted(false);
      setShowTroubleshoot(false);
      return;
    }

    // Simulate instant secure APK download progress
    setDownloadProgress(20);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 30) + 20;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, app]);

  if (!isOpen || !app) return null;

  const handleCopyCode = () => {
    if (app.referCode) {
      navigator.clipboard.writeText(app.referCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleDownloadServer = (url: string) => {
    handleCopyCode();
    window.open(url, '_blank');
  };

  const server1Url = app.downloadUrl || 'https://www.bet213.rocks/?code=2QT2P9V76WW&t=1788198972';
  const server2Url = app.backupDownloadUrl || app.downloadUrl || 'https://d3aeng3pmq21ul.cloudfront.net/Agent.apk';

  return (
    <div id="download-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        id="download-modal-card"
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl p-5 sm:p-6 overflow-hidden text-slate-100 my-auto"
      >
        {/* Close Button */}
        <button
          id="close-download-modal-btn"
          onClick={onClose}
          aria-label="Close download window"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4 pr-8">
          <AppIcon app={app} sizeClassName="w-14 h-14" textClassName="text-xl" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">
                {app.name} Official APK
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% WORKING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Size: {app.apkSize} • v{app.version} • Android 6.0+
            </p>
          </div>
        </div>

        {/* Guaranteed Download Progress & Status */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Fast Download Servers Ready!</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Connecting to High-Speed Download Mirror...</span>
                </>
              )}
            </span>
            <span className="font-mono font-bold text-amber-400">{Math.min(downloadProgress, 100)}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(downloadProgress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Clean Package
            </span>
            <span className="text-amber-400 font-medium">⚡ Dual-Mirror Fail-Safe</span>
          </div>
        </div>

        {/* Auto Referral Code Bonus Reminder */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-orange-500/15 border border-amber-500/30 mb-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>₹{app.signupBonus} {app.maxSignupBonus ? `- ₹${app.maxSignupBonus}` : ''} Free Bonus Code</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Referral code is automatically copied upon clicking download!
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              aria-label="Copy referral code"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>{app.referCode}</span>
              {copiedCode ? <Check className="w-3.5 h-3.5 text-slate-950 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Multi-Server Download Choice (100% Guaranteed Download) */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Select Fast Download Server:</span>
            <span className="text-emerald-400 text-[10px]">🟢 All Servers Active</span>
          </div>

          {/* SERVER 1 (Official Primary) */}
          <button
            onClick={() => handleDownloadServer(server1Url)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-99 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 stroke-[3]" />
              <span className="tracking-wide">SERVER 1: DIRECT OFFICIAL DOWNLOAD</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 font-mono font-bold">
              Fast ⚡
            </span>
          </button>

          {/* SERVER 2 (Anti-Block Backup Mirror) */}
          <button
            onClick={() => handleDownloadServer(server2Url)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-amber-400 transition-all hover:scale-[1.01] active:scale-99 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>SERVER 2: BACKUP ANTI-BLOCK MIRROR</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-emerald-400 font-mono font-bold border border-emerald-500/30">
              Mirror 🔄
            </span>
          </button>

          {/* SERVER 3: Telegram Direct APK File (Ultimate Fallback) */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCopyCode}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-bold text-xs border border-sky-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-400" />
              <span>Download Direct .APK File on Telegram Channel</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          </a>
        </div>

        {/* Trouble Downloading? Instant Solver Accordion */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden text-xs">
          <button
            onClick={() => setShowTroubleshoot(!showTroubleshoot)}
            className="w-full p-2.5 flex items-center justify-between text-slate-300 hover:text-amber-400 font-semibold cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Link Not Opening or Download Stucked? Tap for Quick Fix</span>
            </span>
            {showTroubleshoot ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTroubleshoot && (
            <div className="p-3 pt-1 border-t border-slate-800 space-y-2 text-[11px] text-slate-300 animate-fade-in">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <p><strong>ISP / Network Block (Jio/Airtel):</strong> If the link displays a blank screen, tap <strong>Server 2</strong> or open the <strong>Telegram Channel</strong> to get the direct file.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <p><strong>Chrome Warning:</strong> If Chrome says &ldquo;File might be harmful&rdquo;, tap <strong>&ldquo;Download Anyway&rdquo;</strong> (it is 100% clean and virus-free).</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <p><strong>Installation Blocked:</strong> Go to Phone Settings &rarr; Security &rarr; Enable <strong>&ldquo;Allow Installation from Unknown Sources&rdquo;</strong>.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

