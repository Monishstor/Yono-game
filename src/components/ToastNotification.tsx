import React from 'react';
import { Copy, CheckCircle2, Gift } from 'lucide-react';

interface ToastNotificationProps {
  show: boolean;
  message: string;
  code?: string;
  appName?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  show,
  message,
  code,
  appName
}) => {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 z-50 max-w-sm w-auto animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none"
    >
      <div className="bg-slate-900/95 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 backdrop-blur-md flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shrink-0 shadow-md">
          <Gift className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Referral Code Auto-Copied!</span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">
            {message}
          </p>
          {code && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-amber-300">
              <Copy className="w-3 h-3 text-slate-400" />
              <span>CODE: {code}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
