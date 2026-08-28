import React from 'react';
import { Download, ShieldCheck, Smartphone, Gift, ArrowRight } from 'lucide-react';

export const InstallGuide: React.FC = () => {
  const steps = [
    {
      num: '1',
      icon: Download,
      title: 'Download APK',
      desc: 'Click Download button',
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    },
    {
      num: '2',
      icon: ShieldCheck,
      title: 'Install & Allow',
      desc: 'Allow unknown sources',
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    },
    {
      num: '3',
      icon: Smartphone,
      title: 'Bind Mobile OTP',
      desc: 'Register mobile number',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    },
    {
      num: '4',
      icon: Gift,
      title: 'Claim ₹51-₹1500',
      desc: 'Instant bonus & withdraw',
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30'
    }
  ];

  return (
    <section id="guide-section" className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Compact Horizontal Patti / Strip Container */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Strip Top Mini Title */}
        <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>How to Install & Earn (4 Simple Steps):</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline">
            ✓ 100% Virus-Free & Fast 2-Min UPI Payout
          </span>
        </div>

        {/* 4 Compact Horizontal Boxes in a Single Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 flex items-center gap-2.5 hover:border-amber-400 dark:hover:border-slate-700 transition-colors"
              >
                {/* Step Number + Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs border ${step.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text Content (Short & Punchy) */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400/90 font-mono">
                      #{step.num}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-400 truncate leading-tight">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow connector between boxes on desktop */}
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
