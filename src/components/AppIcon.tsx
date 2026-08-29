import React, { useState } from 'react';
import { YonoApp } from '../types';
import { resolveAssetUrl } from '../lib/assetHelper';

interface AppIconProps {
  app: YonoApp;
  className?: string;
  sizeClassName?: string;
  textClassName?: string;
  priority?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  app,
  className = '',
  sizeClassName = 'w-13 h-13 sm:w-14 sm:h-14',
  textClassName = 'text-xl sm:text-2xl',
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);

  const resolvedUrl = app.imageUrl ? resolveAssetUrl(app.imageUrl) : '';

  if (resolvedUrl && !imageError) {
    return (
      <div 
        className={`${sizeClassName} rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/15 bg-slate-900 flex items-center justify-center shrink-0 ${className}`}
      >
        <img
          src={resolvedUrl}
          alt={`${app.name} icon`}
          width="56"
          height="56"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
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
