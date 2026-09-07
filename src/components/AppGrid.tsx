import React from 'react';
import { YonoApp } from '../types';
import { AppPattiRow } from './AppPattiRow';
import { RefreshCw, AlertCircle, Flame } from 'lucide-react';

interface AppGridProps {
  apps: YonoApp[];
  searchQuery?: string;
  onDownload: (app: YonoApp) => void;
  onViewDetails?: (app: YonoApp) => void;
  onResetFilters: () => void;
  onEdit?: (app: YonoApp) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({
  apps,
  searchQuery,
  onDownload,
  onViewDetails,
  onResetFilters,
  onEdit
}) => {
  return (
    <div id="all-yono-apps-list-container" className="space-y-4">
      
      {/* Header Info Bar - Right above the game download cards */}
      {searchQuery ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="flex items-center gap-2">
              <span>Showing <strong>{apps.length}</strong> results for &ldquo;<span className="text-amber-400">{searchQuery}</span>&rdquo;</span>
              <button 
                onClick={onResetFilters}
                className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
              >
                Clear ✕
              </button>
            </span>
          </div>
        </div>
      ) : (
        /* Yono Games Download Header right above cards - Centered (Bich Mein) */
        <div className="flex items-center justify-center gap-3 px-2 pt-1 pb-1 text-center">
          <div className="h-[1.5px] w-6 sm:w-14 bg-gradient-to-r from-transparent to-amber-400/70" />
          <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase">
            <span className="text-amber-400">Yono Games</span>{' '}
            <span className="text-white">Download</span>
          </h2>
          <div className="h-[1.5px] w-6 sm:w-14 bg-gradient-to-l from-transparent to-amber-400/70" />
        </div>
      )}

      {apps.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500 dark:text-amber-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {searchQuery ? `No Games Found for "${searchQuery}"` : 'No Yono Games Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {searchQuery
              ? 'Try searching by game name (e.g., BET 213, Jaiho 91, Club INR), game type (Rummy, Aviator, Slots), or bonus amount.'
              : 'No games matched your search or category filter. Try resetting your search.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        </div>
      ) : (
        /* Full Continuous Patti List - Every App in a Single Strip */
        <div className="space-y-3">
          {apps.map((app, index) => (
            <AppPattiRow
              key={app.id}
              app={app}
              rank={index + 1}
              onDownload={onDownload}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
