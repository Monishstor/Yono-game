import React, { useState } from 'react';
import { YonoApp } from '../types';

interface AppIconProps {
  app: YonoApp;
  className?: string;
  sizeClassName?: string;
  textClassName?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  app,
  className = '',
  sizeClassName = 'w-13 h-13 sm:w-14 sm:h-14',
  textClassName = 'text-xl sm:text-2xl'
}) => {
  const [imageError, setImageError] = useState(false);

  if (app.imageUrl && !imageError) {
    return (
      <div 
        className={`${sizeClassName} rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/15 bg-slate-900 flex items-center justify-center shrink-0 ${className}`}
      >
        <img
          src={app.imageUrl}
          alt={`${app.name} icon`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClassName} rounded-2xl bg-gradient-to-br ${app.iconGradient || 'from-amber-400 to-orange-600'} flex items-center justify-center text-white ${textClassName} font-black shadow-lg shadow-amber-500/15 ring-2 ring-white/10 shrink-0 ${className}`}
    >
      {app.iconSymbol || app.name.slice(0, 2).toUpperCase()}
    </div>
  );
};
