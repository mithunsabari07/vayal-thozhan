'use client';

import React from 'react';
import { PhoneCall } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/translations';
import { playKeypadBeep } from '@/lib/soundEffects';

interface PhoneHotlineCardProps {
  lang: Language;
  onOpenIvrCall: (initialDigit?: string) => void;
}

export default function PhoneHotlineCard({
  lang,
  onOpenIvrCall,
}: PhoneHotlineCardProps) {
  const handleKeypadClick = (digit: string) => {
    playKeypadBeep(digit);
    onOpenIvrCall(digit);
  };

  return (
    <section className="vayal-card rounded-2xl p-5 sm:p-6 border-2 border-emerald-600 dark:border-emerald-500 bg-white dark:bg-[#121c15] space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-stone-200 dark:border-[#213828] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300">
              {getTranslation(lang, 'phone_header')}
            </h2>
            <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
              {getTranslation(lang, 'phone_sub')}
            </span>
          </div>
        </div>

        {/* Toll-Free Badge */}
        <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-black shadow-xs tracking-wider">
          {getTranslation(lang, 'toll_free_badge')}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
        {getTranslation(lang, 'phone_explanation')}
      </p>

      {/* Giant Clickable Phone Dial Card (100% Solid) */}
      <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#070e09] border-2 border-emerald-600 dark:border-emerald-500 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📞</span>
          <div>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800 dark:text-emerald-300 tracking-tight">
              1800 425 1555
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-300 font-mono font-semibold block">
              {lang === 'ta'
                ? 'அல்லது +91 94421 88200 (24x7 உழவர் உதவி மையம்)'
                : 'or +91 94421 88200 (24x7 Farmer Helpline)'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onOpenIvrCall()}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{getTranslation(lang, 'call_now_btn')}</span>
        </button>
      </div>

      {/* 2x2 Grid Tactile IVR Keypad Guide */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
          {getTranslation(lang, 'keypad_guide')}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Key 1 */}
          <button
            onClick={() => handleKeypadClick('1')}
            className="p-3 rounded-xl bg-white dark:bg-[#152019] border-2 border-stone-300 dark:border-[#27402d] flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-[#1a2b21] transition-all text-left cursor-pointer group active:scale-98"
          >
            <span className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-black flex items-center justify-center text-sm shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              1
            </span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                {getTranslation(lang, 'ivr_1_en')}
              </span>
              <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                {getTranslation(lang, 'ivr_1')}
              </span>
            </div>
          </button>

          {/* Key 2 */}
          <button
            onClick={() => handleKeypadClick('2')}
            className="p-3 rounded-xl bg-emerald-50 dark:bg-[#0d2315] border-2 border-emerald-500 dark:border-emerald-500 flex items-center gap-3 hover:bg-emerald-100 dark:hover:bg-[#12311d] transition-all text-left cursor-pointer group active:scale-98"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-mono font-black flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
              2
            </span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 block">
                {getTranslation(lang, 'ivr_2_en')}
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                {getTranslation(lang, 'ivr_2')}
              </span>
            </div>
          </button>

          {/* Key 3 */}
          <button
            onClick={() => handleKeypadClick('3')}
            className="p-3 rounded-xl bg-orange-50 dark:bg-[#2b170c] border-2 border-orange-500 dark:border-orange-500 flex items-center gap-3 hover:bg-orange-100 dark:hover:bg-[#381e0f] transition-all text-left cursor-pointer group active:scale-98"
          >
            <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-mono font-black flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
              3
            </span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-orange-950 dark:text-orange-200 block">
                {getTranslation(lang, 'ivr_3_en')}
              </span>
              <span className="text-[11px] text-orange-800 dark:text-orange-300 font-semibold">
                {getTranslation(lang, 'ivr_3')}
              </span>
            </div>
          </button>

          {/* Key 4 */}
          <button
            onClick={() => handleKeypadClick('4')}
            className="p-3 rounded-xl bg-white dark:bg-[#152019] border-2 border-stone-300 dark:border-[#27402d] flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-[#1a2b21] transition-all text-left cursor-pointer group active:scale-98"
          >
            <span className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-black flex items-center justify-center text-sm shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              4
            </span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                {getTranslation(lang, 'ivr_4_en')}
              </span>
              <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                {getTranslation(lang, 'ivr_4')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
