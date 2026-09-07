import React, { useState, useRef, useEffect } from 'react';
import { resolveAssetUrl } from '../lib/assetHelper';
import { AppCategory } from '../types';
import { MAIN_PRIMARY_CATEGORIES } from '../data/appsData';
import { 
  Sparkles, 
  Search, 
  Send, 
  Crown, 
  Download, 
  Flame,
  ShieldCheck,
  Plus,
  SlidersHorizontal,
  Edit3,
  Gamepad2,
  Zap,
  ArrowLeft,
  X
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory?: AppCategory;
  onSelectCategory?: (cat: AppCategory) => void;
  onOpenPromoCodes: () => void;
  onOpenDailyCheckin: () => void;
  onToggleTableView: () => void;
  isTableView: boolean;
  onScrollToSection: (sectionId: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminPanel: () => void;
  onOpenAdminLogin: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenContact?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenPromoCodes,
  onOpenDailyCheckin,
  onToggleTableView,
  isTableView,
  onScrollToSection,
  isAdminLoggedIn,
  onOpenAdminPanel,
  onOpenAdminLogin,
  isAdminMode,
  onToggleAdminMode,
  onOpenContact
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isMobileSearchOpen]);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* YouTube-Style Full Width Active Search Header for Mobile */}
        {isMobileSearchOpen ? (
          <div className="flex md:hidden items-center h-16 sm:h-20 gap-2.5 animate-in fade-in duration-200">
            <button
              id="mobile-close-search-btn"
              onClick={() => {
                setIsMobileSearchOpen(false);
              }}
              className="w-9 h-9 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Back to normal header"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-amber-400" />
            </button>

            <div className="relative flex-1">
              <input
                ref={mobileSearchInputRef}
                id="mobile-active-search-input"
                type="text"
                aria-label="Search Yono Apps Mobile"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onScrollToSection('all-apps-section');
                  }
                }}
                placeholder="Search games (BET 213, DIWA, Jaiho 91...)"
                className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-9 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery ? (
                <button 
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2.5 w-4.5 h-4.5 rounded-full bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </div>

            <button
              onClick={() => {
                onScrollToSection('all-apps-section');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md active:scale-95 shrink-0"
            >
              Go
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between min-h-[56px] sm:min-h-[64px] py-1.5 sm:py-2 gap-3 sm:gap-5">
            
            {/* Logo & Brand Lockup (YouTube Style: Icon + Inline Text) */}
            <div className="flex items-center min-w-0">
              <a 
                href="/" 
                id="header-brand-logo"
                className="flex items-center gap-2 sm:gap-2.5 group text-decoration-none select-none shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {/* Authentic Yono Games Royal Emerald & Gold Emblem */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shrink-0 shadow-md shadow-emerald-950/50 ring-1 ring-amber-400/70 transform group-hover:scale-105 transition-all">
                  <img 
                    src={resolveAssetUrl('yono-header-logo.svg')} 
                    alt="Yono Games" 
                    className="w-full h-full object-cover"
                    width="36"
                    height="36"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {/* YouTube-Style Inline Brand Name in Uppercase (Bade Akshar) */}
                <span className="font-['Outfit',sans-serif] font-black text-lg sm:text-xl md:text-2xl tracking-tight text-white leading-none flex items-center">
                  YONO GAMES
                </span>
              </a>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
              <div className="relative w-full">
                <input
                  id="header-search-input"
                  type="text"
                  aria-label="Search Yono Apps"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onScrollToSection('all-apps-section');
                    }
                  }}
                  placeholder="Search BET 213, Jaiho 91, Rummy, Aviator..."
                  className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm pl-10 pr-9 py-2.5 rounded-2xl border border-slate-700/80 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                />
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-3 w-4 h-4 rounded-full bg-slate-700 text-[10px] text-slate-300 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Nav Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              
              {/* Top Level Category Switchers: Yono Games, DIWA GAME, COLOR TRADING */}
              {onSelectCategory && (
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
                  {MAIN_PRIMARY_CATEGORIES.map((cat) => {
                    const isActive = (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all' || selectedCategory === 'yono_games')) || selectedCategory === cat.id;
                    const isDiwa = cat.id === 'diwa_games';
                    const isColorTrading = cat.id === 'color_trading';

                    return (
                      <button
                        key={cat.id}
                        id={`nav-category-${cat.id}-btn`}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                          isActive
                            ? isDiwa
                              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25 scale-[1.02]'
                              : isColorTrading
                              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                        title={`${cat.name} Collection`}
                      >
                        {cat.iconName === 'crown' ? (
                          <Crown className="w-3 h-3" />
                        ) : cat.iconName === 'flame' ? (
                          <Flame className="w-3 h-3 text-rose-400" />
                        ) : (
                          <Zap className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{cat.name}</span>
                        {cat.badge && (
                          <span className={`text-[8.5px] px-1 py-0.2 rounded font-extrabold ${
                            isActive
                              ? 'bg-black/30 text-white'
                              : isDiwa
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isColorTrading
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {cat.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* If Admin is Logged in, show Admin Dashboard & Edit Mode */}
              {isAdminLoggedIn && (
                <>
                  <button
                    id="header-admin-panel-btn"
                    onClick={onOpenAdminPanel}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="Open Full Master Admin Panel"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>👑 Admin Panel</span>
                  </button>

                  <button
                    id="header-admin-mode-btn"
                    onClick={onToggleAdminMode}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                      isAdminMode 
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400 font-bold' 
                        : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Toggle card-level edit buttons"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isAdminMode ? '✏️ Edit: ON' : 'Card Edit'}</span>
                  </button>
                </>
              )}

              {/* Telegram Button (Same as mobile) */}
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-white font-bold text-xs shadow-md shadow-sky-500/25 hover:scale-105 active:scale-95 transition-all"
                title="Join Official Telegram"
                aria-label="Join Official Telegram"
              >
                <Send className="w-3.5 h-3.5 -translate-x-0.5" />
                <span>Telegram</span>
              </a>
            </div>

            {/* Mobile Header Icons (YouTube style Search icon + Telegram + Admin) */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              {isAdminLoggedIn && (
                <button
                  id="mobile-admin-panel-btn"
                  onClick={onOpenAdminPanel}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md active:scale-95"
                  title="Open Admin Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-[10px]">Admin</span>
                </button>
              )}

              {/* YouTube-Style Search Icon Button */}
              <button
                id="mobile-youtube-search-btn"
                onClick={() => setIsMobileSearchOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md active:scale-90 transition-all cursor-pointer shrink-0"
                title="Search games (YouTube style)"
                aria-label="Open Search"
              >
                <Search className="w-4.5 h-4.5 text-amber-400 stroke-[2.2]" />
              </button>

              {/* Telegram Button */}
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/25 active:scale-90 transition-all shrink-0"
                title="Join Telegram"
                aria-label="Join Official Telegram"
              >
                <Send className="w-4 h-4 -translate-x-0.5 translate-y-0.5" />
              </a>
            </div>
          </div>
        )}

        {/* Front Main Category Switcher (Mobile - Cleanly framed with top divider line, 3 equal compact buttons with plenty of space, 100% visible with zero cut-off) */}
        {onSelectCategory && (
          <div className="md:hidden -mx-3 px-3 border-t border-slate-800/80 pt-2 pb-2.5 bg-slate-950/40">
            <div className="grid grid-cols-3 gap-2 px-1 max-w-md mx-auto">
              {MAIN_PRIMARY_CATEGORIES.map((cat) => {
                const isActive = (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all' || selectedCategory === 'yono_games')) || selectedCategory === cat.id;
                const isDiwa = cat.id === 'diwa_games';
                const isColorTrading = cat.id === 'color_trading';

                return (
                  <button
                    key={cat.id}
                    id={`mobile-front-cat-${cat.id}`}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onScrollToSection('all-apps-section');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer select-none active:scale-95 ${
                      isActive
                        ? isDiwa
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25 ring-1 ring-rose-400 font-extrabold'
                          : isColorTrading
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300 font-extrabold'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-300 font-extrabold'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
                    }`}
                  >
                    {cat.iconName === 'crown' ? (
                      <Crown className="w-3 h-3 shrink-0" />
                    ) : cat.iconName === 'flame' ? (
                      <Flame className="w-3 h-3 shrink-0 text-rose-400" />
                    ) : (
                      <Zap className="w-3 h-3 shrink-0 text-emerald-400" />
                    )}
                    <span className="truncate">{cat.shortName || cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

