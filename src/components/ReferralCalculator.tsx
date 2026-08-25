import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const ReferralCalculator: React.FC = () => {
  const [friendsCount, setFriendsCount] = useState(25);
  const [avgDailyTurnover, setAvgDailyTurnover] = useState(1000);

  // Calculation:
  // Instant referral bonus: ₹50 per user
  // Commission: 30% of average house tax (approx 3% of turnover) = ~0.9% of total turnover daily per friend
  const instantBonus = friendsCount * 50;
  const estimatedDailyCommission = Math.round(friendsCount * avgDailyTurnover * 0.03 * 0.30);
  const estimatedMonthlyIncome = instantBonus + (estimatedDailyCommission * 30);

  return (
    <section id="calculator-section" className="py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Column: Sliders & Controls */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>YONO VIP AGENT EARNING ENGINE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                  Refer & Earn Calculator
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Estimate your instant cash rewards + lifetime 30% VIP commission by inviting friends.
                </p>
              </div>

              {/* Slider 1: Friends Count */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Number of Friends Invited:</span>
                  <span className="font-black text-amber-400 font-mono text-base">{friendsCount} Friends</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={friendsCount}
                  onChange={(e) => setFriendsCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 User</span>
                  <span>100 Users</span>
                  <span>500+ Users</span>
                </div>
              </div>

              {/* Slider 2: Average Daily Turnover */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Average Daily Gameplay per Friend:</span>
                  <span className="font-black text-emerald-400 font-mono text-base">₹{avgDailyTurnover.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={avgDailyTurnover}
                  onChange={(e) => setAvgDailyTurnover(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>₹200</span>
                  <span>₹5,000</span>
                  <span>₹10,000+</span>
                </div>
              </div>
            </div>

            {/* Right Column: Earnings Summary Box */}
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-slate-950 border border-amber-500/30 p-6 sm:p-8 text-center space-y-5">
                
                <div className="text-xs text-amber-300 font-extrabold uppercase tracking-wider">
                  Estimated 30-Day Total Agent Payout
                </div>

                <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 font-['Outfit',sans-serif]">
                  ₹{estimatedMonthlyIncome.toLocaleString()}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-slate-800">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Instant Registration Cash</span>
                    <span className="font-extrabold text-amber-400 text-sm">₹{instantBonus.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Estimated Daily Payout</span>
                    <span className="font-extrabold text-emerald-400 text-sm">₹{estimatedDailyCommission.toLocaleString()} / day</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited Daily Withdrawals directly to UPI & Bank</span>
                </div>

                <a
                  href="#all-apps-section"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Download Top Yono App & Start Earning</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
