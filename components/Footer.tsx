'use client';

import React from 'react';
import { Phone, BookOpen, Cloud, Shield } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface FooterProps {
  lang: Language;
  onOpenIvr: () => void;
  onOpenGuide: () => void;
  onOpenWeather: () => void;
}

export default function Footer({
  lang,
  onOpenIvr,
  onOpenGuide,
  onOpenWeather,
}: FooterProps) {
  return (
    <footer className="mt-8 border-t-2 border-stone-300 dark:border-[#27402d] pt-6 pb-8 text-center md:text-left text-xs text-stone-700 dark:text-stone-300 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <p className="max-w-xl leading-relaxed font-medium">
          {getTranslation(lang, 'footer_text')}
        </p>

        {/* Footer Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
          <button
            onClick={onOpenIvr}
            className="text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'footer_ivr')}</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'footer_guide')}</span>
          </button>

          <button
            onClick={onOpenWeather}
            className="text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'footer_weather')}</span>
          </button>

          <span className="text-stone-600 dark:text-stone-400 flex items-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'footer_privacy')}</span>
          </span>
        </div>
      </div>

      <div className="text-[11px] text-stone-500 dark:text-stone-400 text-center font-medium">
        {getTranslation(lang, 'footer_footnote')}
      </div>
    </footer>
  );
}
