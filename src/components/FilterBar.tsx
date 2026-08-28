import React from 'react';
import { AppCategory } from '../types';
import { CATEGORY_TABS } from '../data/appsData';
import { 
  Search, 
  ArrowUpDown, 
  LayoutGrid, 
  TableProperties, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export type SortOption = 'popular' | 'bonus_high' | 'withdrawal_low' | 'rating' | 'newest';

interface FilterBarProps {
  selectedCategory: AppCategory;
  onSelectCategory: (cat: AppCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount
}) => {
  return (
    <div id="filter-control-panel" className="mb-6 space-y-4">
      
      {/* Category Tabs Scrollable Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              id={`category-tab-${tab.id}`}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Search, Sort & View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Results Counter & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <input
              id="filter-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by app name or game (e.g. Aviator, Rummy)..."
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700/70 focus:outline-hidden focus:border-amber-500"
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

        {/* Sort & Layout Toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap hidden md:inline">
            Showing <strong className="text-amber-600 dark:text-amber-400 font-bold">{totalCount}</strong> Yono Apps
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <select
              id="sort-select-dropdown"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="popular" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🔥 Most Popular</option>
              <option value="bonus_high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">💰 Highest Bonus</option>
              <option value="withdrawal_low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">⚡ Lowest Min W/D</option>
              <option value="rating" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">⭐ Highest Rating</option>
              <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">🆕 Latest 2026</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              id="view-mode-grid-btn"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-table-btn"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Comparison Table View"
            >
              <TableProperties className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
