'use client';

import React from 'react';
import { History } from 'lucide-react';
import { Language, ActivityLogItem } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface ActivityTimelineProps {
  lang: Language;
  logs: ActivityLogItem[];
}

export default function ActivityTimeline({ lang, logs }: ActivityTimelineProps) {
  return (
    <section className="vayal-card rounded-2xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 dark:border-[#213828] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-xs">
            <History className="w-5 h-5 text-emerald-100" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
            {getTranslation(lang, 'timeline_title')}
          </h2>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-[#142e1b] text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-400 dark:border-emerald-700 shadow-xs">
          {getTranslation(lang, 'live_sync')}
        </span>
      </div>

      {/* Timeline items list */}
      <div className="space-y-2.5">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#070e0a] border-2 border-slate-300 dark:border-[#213828] hover:bg-slate-100 dark:hover:bg-[#0e1b12] transition-colors shadow-xs"
            style={{ borderLeftWidth: '6px', borderLeftColor: log.color }}
          >
            <span
              className="font-mono text-xs font-black shrink-0 pt-0.5"
              style={{ color: log.color }}
            >
              {log.time}
            </span>

            <div className="flex-1 min-w-0">
              <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white block">
                {lang === 'ta' ? log.titleTa : log.titleEn}
              </span>
              <span className="text-slate-600 dark:text-stone-300 block text-xs mt-0.5 leading-relaxed font-medium">
                {lang === 'ta' ? log.descTa : log.descEn}
              </span>
            </div>

            <span className="text-lg shrink-0 select-none">{log.emoji}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
