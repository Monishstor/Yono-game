import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Coins, 
  Award, 
  X,
  Zap,
  ArrowRight
} from 'lucide-react';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKIN_DAYS = [
  { day: 1, reward: '₹5 Bonus Chips', coins: 50, claimed: true },
  { day: 2, reward: '₹10 Bonus Chips', coins: 100, claimed: true },
  { day: 3, reward: '₹20 Bonus Chips', coins: 200, claimed: false },
  { day: 4, reward: '₹50 Bonus Chips', coins: 500, claimed: false },
  { day: 5, reward: '₹75 VIP Bonus Chips', coins: 1000, isSpecial: true, claimed: false },
  { day: 6, reward: '₹100 Bonus Chips', coins: 1500, claimed: false },
  { day: 7, reward: '₹250 Mega Jackpot Token', coins: 3000, isMega: true, claimed: false },
];

const STORAGE_STREAK_KEY = 'yono_daily_streak_v1';
const STORAGE_LAST_CHECKIN = 'yono_last_checkin_date_v1';

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentStreak, setCurrentStreak] = useState(3);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem(STORAGE_STREAK_KEY);
      if (savedStreak) setCurrentStreak(parseInt(savedStreak, 10));

      const lastDate = localStorage.getItem(STORAGE_LAST_CHECKIN);
      const today = new Date().toDateString();
      if (lastDate === today) {
        setHasClaimedToday(true);
      }
    } catch (e) {}
  }, []);

  if (!isOpen) return null;

  const handleClaim = () => {
    const nextStreak = currentStreak >= 7 ? 1 : currentStreak + 1;
    setCurrentStreak(nextStreak);
    setHasClaimedToday(true);
    setClaimedNotice(`🎉 Claimed Day ${currentStreak} Reward: ${CHECKIN_DAYS[currentStreak - 1]?.reward || '₹20 Bonus'}!`);

    try {
      localStorage.setItem(STORAGE_STREAK_KEY, nextStreak.toString());
      localStorage.setItem(STORAGE_LAST_CHECKIN, new Date().toDateString());
    } catch (e) {}

    setTimeout(() => {
      setClaimedNotice(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Flame className="w-6 h-6 stroke-[2.5] fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif]">
                Daily Check-in Streak
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 fill-orange-400" />
                <span>{currentStreak} Days Streak</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Check in 7 consecutive days to claim up to ₹250 free cash and mega jackpot spins!
            </p>
          </div>
        </div>

        {/* Claim Notice */}
        {claimedNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{claimedNotice}</span>
          </div>
        )}

        {/* 7-Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {CHECKIN_DAYS.map((item, idx) => {
            const isToday = item.day === currentStreak;
            const isCompleted = item.day < currentStreak;
            const isLocked = item.day > currentStreak;

            return (
              <div
                key={item.day}
                className={`relative rounded-2xl p-3 text-center border transition-all ${
                  item.isMega ? 'col-span-2 sm:col-span-2' : ''
                } ${
                  isToday
                    ? 'bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30 scale-105'
                    : isCompleted
                    ? 'bg-slate-950/60 border-emerald-500/40 text-slate-400'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                {/* Status Badge */}
                <div className="text-[10px] font-black uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  {isCompleted ? (
                    <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Day {item.day}
                    </span>
                  ) : isToday ? (
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Today (Day {item.day})
                    </span>
                  ) : (
                    <span>Day {item.day}</span>
                  )}
                </div>

                <div className="my-1.5 flex justify-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isToday ? 'bg-amber-500 text-slate-950' : isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.isMega ? <Award className="w-5 h-5" /> : <Coins className="w-4 h-4" />}
                  </div>
                </div>

                <div className="font-extrabold text-xs text-white truncate">
                  {item.reward}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  +{item.coins} Coins
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleClaim}
            disabled={hasClaimedToday}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              hasClaimedToday
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-98'
            }`}
          >
            {hasClaimedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Today's Reward Claimed (कल फिर आएं)</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 stroke-[2.5]" />
                <span>Claim Day {currentStreak} Reward Now (रिवॉर्ड प्राप्त करें)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
