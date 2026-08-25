import React, { useState } from 'react';
import { FAQ_DATA } from '../data/faqData';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-12 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
            All You Need to Know About Yono Apps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear answers regarding bonuses, OTP verification, withdrawals, and APK safety.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                id={`faq-item-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-white hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-mono shrink-0">
                      Q{index + 1}
                    </span>
                    <span>{item.question}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-amber-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    <div className="pt-3">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
