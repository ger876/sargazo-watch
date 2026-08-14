import React from 'react';
import { SargazoLevel } from '@/lib/types';
import { SARGAZO_LEVELS } from '@/lib/constants';
import { ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

interface SargazoLevelBadgeProps {
  level?: SargazoLevel | 'NO_DATA';
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const SargazoLevelBadge: React.FC<SargazoLevelBadgeProps> = ({
  level = 'NO_DATA',
  size = 'md',
  showDescription = false,
}) => {
  if (level === 'NO_DATA') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm'
      }`}>
        <HelpCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        <span>Sin datos recientes</span>
      </span>
    );
  }

  const meta = SARGAZO_LEVELS[level];

  const getIcon = () => {
    const iconClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    switch (level) {
      case 'NONE':
        return <CheckCircle2 className={iconClass} />;
      case 'LOW':
      case 'MEDIUM':
        return <AlertTriangle className={iconClass} />;
      case 'HIGH':
      case 'EXTREME':
        return <ShieldAlert className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full shadow-xs transition-all ${meta.badgeTailwind} ${
          size === 'sm'
            ? 'px-2.5 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-4 py-2 text-base font-bold'
            : 'px-3 py-1 text-sm'
        }`}
      >
        {getIcon()}
        <span>{meta.label}</span>
      </span>
      {showDescription && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-xs">
          {meta.description}
        </p>
      )}
    </div>
  );
};
