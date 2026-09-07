import React from 'react';
import { YonoApp } from '../types';
import { Gamepad2 } from 'lucide-react';

interface GamesIndexBoardProps {
  apps: YonoApp[];
  onSelectApp?: (app: YonoApp) => void;
}

export const GamesIndexBoard: React.FC<GamesIndexBoardProps> = ({ apps, onSelectApp }) => {
  if (!apps || apps.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-7 sm:pt-9 pb-2">
      {/* Centered Heading Directly Above Notice Board */}
      <div className="text-center mb-2.5">
        <h2 className="text-base sm:text-lg md:text-xl font-black tracking-wide uppercase text-white">
          <span className="text-amber-400">Yono Games</span>{' '}
          <span className="text-emerald-400">2026</span>
        </h2>
      </div>

      {/* Sleek, Chhota & Compact 4-Corner Rounded Dark Notice Board */}
      <div 
        id="yono-games-index-board"
        className="rounded-xl sm:rounded-2xl bg-[#080e1c]/85 dark:bg-slate-900/85 border border-slate-800/80 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-md shadow-black/20"
      >
        {/* Chhoti Header Heading with Icon */}
        <div className="flex items-center gap-1.5 mb-1">
          <Gamepad2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
            All Yono Games Index ({apps.length}):
          </span>
        </div>

        {/* Chhote-Chhote Shabdon Mein (10px / 11px Micro Font) */}
        <div className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
          {apps.map((app, index) => {
            const isLast = index === apps.length - 1;
            return (
              <React.Fragment key={app.id || app.slug || index}>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectApp?.(app)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectApp?.(app);
                    }
                  }}
                  className="hover:text-amber-300 hover:underline cursor-pointer transition-colors text-slate-300 inline"
                  title={`Open ${app.name}`}
                >
                  {app.name}
                </span>
                {!isLast && (
                  <span className="text-slate-600 mx-1 select-none">
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

