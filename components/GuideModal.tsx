'use client';

import React from 'react';
import { X, BookOpen, CheckCircle2, Shield, Droplets, Phone } from 'lucide-react';
import { Language } from '@/lib/types';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export default function GuideModal({ isOpen, onClose, lang }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111c14] border-2 border-stone-300 dark:border-[#27402d] shadow-2xl p-6 text-stone-900 dark:text-stone-100 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-stone-200 dark:border-[#203726] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-black text-base sm:text-lg">
              {lang === 'ta' ? 'விவசாயி பயன்பாட்டு வழிகாட்டி' : 'Farmer Operating Guide'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-[#1b2b20] text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#0c2214] border-2 border-emerald-500 space-y-1">
            <div className="font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === 'ta'
                  ? 'தானியங்கி பாசன விதிமுறைகள் (40% - 70%)'
                  : 'Automated Irrigation Thresholds (40% - 70%)'}
              </span>
            </div>
            <p className="leading-relaxed">
              {lang === 'ta'
                ? 'மண் ஈரப்பதம் 40% க்குக் கீழே குறைந்தால் கணினி உடனடியாக வால்வைத் திறந்து பாசனம் தொடங்கும். 70% அடைந்தவுடன் நீர் விரயத்தைத் தடுக்க தானாக மூடும்.'
                : 'When soil moisture drops below 40%, the system opens the field valve automatically. When it reaches 70% saturation, it turns off to prevent waterlogging and root rot.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#251707] border-2 border-amber-500 space-y-1">
            <div className="font-black text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>
                {lang === 'ta'
                  ? 'மோட்டார் வறட்சி தடுப்பு பாதுகாப்பு (Dry-Run Protection)'
                  : 'Motor Dry-Run Protection (Cutoff 200L)'}
              </span>
            </div>
            <p className="leading-relaxed">
              {lang === 'ta'
                ? 'மேல்நிலை தொட்டியில் நீர் 200 லிட்டருக்கு கீழே குறைந்தால், பைப்லைன்களில் காற்று அடைக்காமல் இருக்கவும் போர்வெல் மோட்டார் சூடாவதை தடுக்கவும் பாசனம் தானாக நிற்கும்.'
                : 'If water level drops below 200 Litres (20%), irrigation halts immediately to protect the pump and pipes from air-locking.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-[#091b2c] border-2 border-sky-500 space-y-1">
            <div className="font-black text-sky-950 dark:text-sky-300 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>
                {lang === 'ta'
                  ? 'போன் விசை வழிகாட்டி (IVR Hotline)'
                  : 'Phone Hotline Guide (1800 425 1555)'}
              </span>
            </div>
            <ul className="space-y-1.5 pl-4 list-disc font-semibold">
              <li>1 - {lang === 'ta' ? 'முழு நிலவரம் கேட்க' : 'Hear full moisture report'}</li>
              <li>2 - {lang === 'ta' ? 'வால்வு திறந்து பாசனம் தொடங்க' : 'Start irrigation manually'}</li>
              <li>3 - {lang === 'ta' ? 'பாசனம் உடனடியாக நிறுத்த' : 'Stop all valves immediately'}</li>
              <li>4 - {lang === 'ta' ? 'அறிக்கையை மீண்டும் கேட்க' : 'Repeat report'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t-2 border-stone-200 dark:border-[#203726] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs cursor-pointer shadow-xs"
          >
            {lang === 'ta' ? 'புரிந்தது' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}
