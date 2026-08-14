'use client';

import React, { useState } from 'react';
import { voteReport } from '@/lib/supabase';
import { ThumbsUp, ThumbsDown, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VerificationBarProps {
  reportId: string;
  accurateCount?: number;
  inaccurateCount?: number;
  userVoted?: boolean | null;
}

export const VerificationBar: React.FC<VerificationBarProps> = ({
  reportId,
  accurateCount = 0,
  inaccurateCount = 0,
  userVoted = null,
}) => {
  const [accurateVotes, setAccurateVotes] = useState(accurateCount);
  const [inaccurateVotes, setInaccurateVotes] = useState(inaccurateCount);
  const [currentVote, setCurrentVote] = useState<boolean | null>(userVoted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (isAccurate: boolean) => {
    if (currentVote !== null || isSubmitting) return;

    setIsSubmitting(true);
    setCurrentVote(isAccurate);

    if (isAccurate) {
      setAccurateVotes((prev) => prev + 1);
    } else {
      setInaccurateVotes((prev) => prev + 1);
    }

    try {
      await voteReport(reportId, isAccurate);
    } catch (e) {
      console.error('Error al registrar voto', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          ¿Es preciso este reporte?
        </span>
        {currentVote !== null && (
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Voto registrado (+1 Karma)
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentVote !== null || isSubmitting}
          onClick={() => handleVote(true)}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            currentVote === true
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>✅ Preciso ({accurateVotes})</span>
        </button>

        <button
          type="button"
          disabled={currentVote !== null || isSubmitting}
          onClick={() => handleVote(false)}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            currentVote === false
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>❌ Inexacto ({inaccurateVotes})</span>
        </button>
      </div>
    </div>
  );
};
