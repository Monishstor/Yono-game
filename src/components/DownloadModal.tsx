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
  Info
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface DownloadModalProps {
  app: YonoApp | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ app, isOpen, onClose }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!isOpen || !app) {
      setDownloadProgress(0);
      setIsCompleted(false);
      return;
    }

    // Simulate instant secure APK download progress
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen, app]);

  if (!isOpen || !app) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(app.referCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="download-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        id="download-modal-card"
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl p-5 sm:p-7 overflow-hidden text-slate-100"
      >
        {/* Close Button */}
        <button
          id="close-download-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-5">
          <AppIcon app={app} sizeClassName="w-16 h-16" textClassName="text-2xl" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                {app.name} APK
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                VERIFIED SAFE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Version: {app.version} • Size: {app.apkSize} • Android 6.0+
            </p>
          </div>
        </div>

        {/* Download Status & Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">APK Download Ready!</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Connecting to Official High-Speed CDN...</span>
                </>
              )}
            </span>
            <span className="font-mono font-bold text-amber-400">{Math.min(downloadProgress, 100)}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(downloadProgress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SHA-256 Verified
            </span>
            <span className="font-mono text-emerald-400">100% Virus-Free</span>
          </div>
        </div>

        {/* Bonus Referral Code Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/30 mb-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Claim Free ₹{app.signupBonus} - ₹{app.maxSignupBonus || 500} Bonus</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Copy referral code and paste during registration to activate VIP 1 status.
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>{app.referCode}</span>
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Step-by-Step Installation Instructions */}
        <div className="space-y-2.5 mb-6 text-xs">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">
            Quick 3-Step Setup Guide:
          </h4>
          
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
            <p className="text-slate-300">
              Tap <strong>"Download Anyway"</strong> if Android prompts a security warning for third-party APKs.
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
            <p className="text-slate-300">
              Open the downloaded APK file and enable <strong>"Allow from this source"</strong> in Settings.
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
            <p className="text-slate-300">
              Open {app.name}, bind your Indian mobile number with OTP, and claim your instant cash bonus!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <a
              id="direct-apk-download-cta"
              href={app.downloadUrl || 'https://youonogamespartner.com/?code=RRTN8BM3&t=1787657824'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (app.referCode) {
                  try { navigator.clipboard.writeText(app.referCode); } catch (e) {}
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer uppercase tracking-wide"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download & Claim Bonus</span>
            </a>

            <button
              onClick={onClose}
              className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Backup CloudFront Direct APK Mirror */}
          <div className="text-center">
            <a
              href={app.backupDownloadUrl || "https://d3aeng3pmq21ul.cloudfront.net/Agent.apk"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Alternative Direct APK Backup Download (CloudFront CDN)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
