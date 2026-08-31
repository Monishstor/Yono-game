import React, { useState } from 'react';
import { resolveAssetUrl } from '../lib/assetHelper';
import { 
  Sparkles, 
  Search, 
  Send, 
  Crown, 
  TableProperties, 
  Gift, 
  HelpCircle, 
  Download, 
  Menu, 
  X,
  Flame,
  ShieldCheck,
  Plus,
  SlidersHorizontal,
  Edit3
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              id="header-brand-logo"
              className="flex items-center gap-3 group text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-amber-500/20 ring-2 ring-amber-400/50 transform group-hover:scale-105 transition-all overflow-hidden p-0.5">
                <img 
                  src={resolveAssetUrl('main-site-logo.svg')} 
                  alt="All New Yono Apps Official Logo" 
                  className="w-full h-full object-cover rounded-lg"
                  width="48"
                  height="48"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                    ALL NEW <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500">YONO APPS</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                    2026 OFFICIAL
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Verified APKs • Instant Bonus ₹51-₹1500 • Safe & Fast UPI
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                aria-label="Search Yono Apps"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Yono 777, Arcade, Custom apps..."
                className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Nav Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            
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

            {/* View Toggle */}
            <button
              id="header-toggle-table-btn"
              onClick={onToggleTableView}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                isTableView 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Toggle Comparison Table"
            >
              <TableProperties className="w-4 h-4" />
              <span>{isTableView ? 'Card View' : 'Bonus Table'}</span>
            </button>

            {/* Daily Promo Codes */}
            <button
              id="header-promo-vault-btn"
              onClick={onOpenPromoCodes}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Promo Codes</span>
            </button>

            {/* Daily Streak Check-in */}
            <button
              id="header-daily-checkin-btn"
              onClick={onOpenDailyCheckin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-slate-950 shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Daily Check-in & Claim Free Coins"
            >
              <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Daily Check-in</span>
            </button>

            {/* Contact & Helpdesk */}
            {onOpenContact && (
              <button
                id="header-contact-btn"
                onClick={onOpenContact}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Contact Support & Helpdesk"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Help / Contact</span>
              </button>
            )}
          </div>

          {/* Mobile Menu & Quick Actions */}
          <div className="flex md:hidden items-center gap-1.5">
            {isAdminLoggedIn && (
              <button
                id="mobile-admin-panel-btn"
                onClick={onOpenAdminPanel}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md"
                title="Open Admin Panel"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span className="text-[11px]">Admin</span>
              </button>
            )}

            <button
              id="mobile-daily-checkin-btn"
              onClick={onOpenDailyCheckin}
              className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md flex items-center justify-center"
              title="Daily Check-in"
            >
              <Flame className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-1"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-400" />
              ) : (
                <Menu className="w-5 h-5 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search in Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              aria-label="Search Yono Apps Mobile"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 45+ Yono Apps (777, Arcade, VIP...)"
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-nav-dropdown" className="md:hidden py-4 border-t border-slate-800 space-y-3 bg-slate-950/95 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
              {isAdminLoggedIn && (
                <>
                  <button
                    onClick={() => {
                      onOpenAdminPanel();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>👑 Admin Panel</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleAdminMode();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
                  >
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    <span>{isAdminMode ? 'Edit Mode: ON' : 'Card Edit Mode'}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  onToggleTableView();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
              >
                <TableProperties className="w-4 h-4 text-amber-400" />
                <span>{isTableView ? 'Cards View' : 'Bonus Table'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenPromoCodes();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-amber-300 text-xs font-semibold border border-amber-500/20"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Daily Promo Codes</span>
              </button>

              <button
                onClick={() => {
                  onOpenDailyCheckin();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-500/30"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Daily Check-in</span>
              </button>

              <button
                onClick={() => {
                  onScrollToSection('calculator-section');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Referral Calc</span>
              </button>

              {onOpenContact && (
                <button
                  onClick={() => {
                    onOpenContact();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-amber-300 text-xs font-semibold border border-amber-500/20"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Contact & Help</span>
                </button>
              )}
            </div>

            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Join Official Telegram (88,000+ Members)</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

