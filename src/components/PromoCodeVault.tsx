import React, { useState } from 'react';
import { PROMO_CODES } from '../data/promoCodes';
import { PromoCode } from '../types';
import { 
  Gift, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Flame, 
  Tag, 
  X,
  CheckCircle2
} from 'lucide-react';

interface PromoCodeVaultProps {
  isOpen: boolean;
  onClose: () => void;
  promoCodes?: PromoCode[];
}

export const PromoCodeVault: React.FC<PromoCodeVaultProps> = ({ isOpen, onClose, promoCodes }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [testCodeInput, setTestCodeInput] = useState('');
  const [testResult, setTestResult] = useState<{ status: 'valid' | 'invalid'; message: string } | null>(null);

  const activeCodes = promoCodes && promoCodes.length > 0 ? promoCodes : PROMO_CODES;

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCodeInput.trim()) return;

    const matched = activeCodes.find(
      (p) => p.code.toLowerCase() === testCodeInput.trim().toLowerCase()
    );

    if (matched) {
      setTestResult({
        status: 'valid',
        message: `✅ Code "${matched.code}" is ACTIVE! Rewards: ${matched.reward} on ${matched.appTarget}.`
      });
    } else if (testCodeInput.toUpperCase() === 'BONUS500' || testCodeInput.toUpperCase() === 'VIP777') {
      setTestResult({
        status: 'valid',
        message: `✅ Exclusive VIP Secret Code Activated! ₹500 Match Bonus ready in Yono 777.`
      });
    } else {
      setTestResult({
        status: 'invalid',
        message: `❌ Promo code "${testCodeInput}" not recognized or expired. Try one of the verified codes below!`
      });
    }
  };

  return (
    <div id="promo-code-vault-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              Daily Yono Promo Codes & Vouchers
            </h3>
            <p className="text-xs text-slate-400">
              Active redeem codes for free chips, deposit cash match & bonus spins.
            </p>
          </div>
        </div>

        {/* Code Tester Form */}
        <form onSubmit={handleTestCode} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={testCodeInput}
              onChange={(e) => setTestCodeInput(e.target.value)}
              placeholder="Enter or paste your promo code (e.g. YONO2026)..."
              aria-label="Promo code to verify"
              className="flex-1 bg-slate-900 text-slate-100 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={!testCodeInput.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Code
            </button>
          </div>

          {testResult && (
            <div className={`mt-2 p-2.5 rounded-xl text-xs font-semibold ${
              testResult.status === 'valid' 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}>
              {testResult.message}
            </div>
          )}
        </form>

        {/* Code List */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Verified Active Codes for Today</span>
            <span>{activeCodes.length} Available</span>
          </div>

          {activeCodes.map((promo) => (
            <div
              key={promo.code}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-400 text-sm tracking-wider">
                    {promo.code}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    promo.status === 'Hot' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {promo.status}
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-bold mt-0.5">{promo.reward}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  App: {promo.appTarget} • {promo.usesLeft} redemptions left
                </div>
              </div>

              <button
                onClick={() => handleCopy(promo.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors w-full sm:w-auto justify-center cursor-pointer"
              >
                {copiedCode === promo.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info */}
        <p className="text-[11px] text-slate-500 text-center">
          * Promo codes must be redeemed inside the specific Yono App wallet section after binding your mobile number.
        </p>
      </div>
    </div>
  );
};
