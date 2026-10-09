'use client';

import React from 'react';
import { Volume2, VolumeX, Clock, MapPin, Droplets, CheckCircle2 } from 'lucide-react';
import { Language, FieldData } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface HeroBannerProps {
  lang: Language;
  fields: {
    fieldA: FieldData;
    fieldB: FieldData;
  };
  currentTimeString: string;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export default function HeroBanner({
  lang,
  fields,
  currentTimeString,
  isSpeaking,
  onToggleSpeech,
}: HeroBannerProps) {
  const isFieldBThirsty = fields.fieldB.moisture < fields.fieldB.targetStart;
  const isFieldAThirsty = fields.fieldA.moisture < fields.fieldA.targetStart;
  const isFieldBWatering = fields.fieldB.valveStatus === 'open';
  const isFieldAWatering = fields.fieldA.valveStatus === 'open';

  // Harmonized Speech Bubble Logic
  let speechText = getTranslation(lang, 'speech_satisfied');
  let speechEmoji = '🌾';
  let speechClass = 'border-emerald-500 text-emerald-800 dark:text-emerald-200 bg-white dark:bg-stone-900';

  if (isFieldBWatering) {
    speechText = getTranslation(lang, 'speech_watering');
    speechEmoji = '💦';
    speechClass = 'border-cyan-500 text-cyan-800 dark:text-cyan-200 bg-cyan-50/90 dark:bg-stone-900';
  } else if (isFieldAWatering) {
    speechText = getTranslation(lang, 'speech_watering_a');
    speechEmoji = '💦';
    speechClass = 'border-emerald-500 text-emerald-800 dark:text-emerald-200 bg-emerald-50/90 dark:bg-stone-900';
  } else if (isFieldBThirsty) {
    speechText = getTranslation(lang, 'speech_thirsty');
    speechEmoji = '🥀';
    speechClass = 'border-orange-500 text-orange-700 dark:text-orange-200 bg-orange-50/90 dark:bg-stone-900';
  } else if (isFieldAThirsty) {
    speechText = lang === 'ta' ? 'வயல் A சம்பா நெல்லுக்கு தண்ணீர் தேவை!' : 'Field A paddy needs water!';
    speechEmoji = '🥀';
    speechClass = 'border-orange-500 text-orange-700 dark:text-orange-200 bg-orange-50/90 dark:bg-stone-900';
  }

  // Harmonized Subtitle Status
  let subtitleText = getTranslation(lang, 'hero_subtitle_optimal');
  let subtitleIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
  let subtitleColor = 'text-emerald-700 dark:text-emerald-300';

  if (isFieldAWatering && isFieldBWatering) {
    subtitleText = getTranslation(lang, 'hero_subtitle_both_watering');
    subtitleIcon = <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-bounce shrink-0" />;
    subtitleColor = 'text-cyan-800 dark:text-cyan-200 font-bold';
  } else if (isFieldBWatering) {
    subtitleText = getTranslation(lang, 'hero_subtitle_watering');
    subtitleIcon = <Droplets className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-bounce shrink-0" />;
    subtitleColor = 'text-orange-700 dark:text-orange-200 font-bold';
  } else if (isFieldAWatering) {
    subtitleText = getTranslation(lang, 'hero_subtitle_field_a_watering');
    subtitleIcon = <Droplets className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-bounce shrink-0" />;
    subtitleColor = 'text-emerald-700 dark:text-emerald-200 font-bold';
  } else if (isFieldBThirsty) {
    subtitleText = getTranslation(lang, 'hero_subtitle_dry_ready');
    subtitleIcon = <Droplets className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0" />;
    subtitleColor = 'text-orange-700 dark:text-orange-200 font-bold';
  }

  return (
    <section className="vayal-card rounded-[22px] overflow-hidden p-5 sm:p-7 relative border-2 border-slate-300 dark:border-[#243c2c] bg-gradient-to-br from-[#cbe7ff] via-[#d5eedc] to-[#e6f4d9] dark:from-[#09150e] dark:via-[#0e1f15] dark:to-[#122419] shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Greeting & Telemetry Summary */}
        <div className="md:col-span-7 space-y-3.5 z-10">
          {/* Live Online Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#121c15] border-2 border-emerald-600 dark:border-emerald-500 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 tracking-wide">
              {getTranslation(lang, 'live_status')}
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {getTranslation(lang, 'hero_title')}
            </h1>
            <p className={`text-sm sm:text-base font-bold mt-1.5 flex items-center gap-2 ${subtitleColor}`}>
              {subtitleIcon}
              <span>{subtitleText}</span>
            </p>
          </div>

          {/* High-Contrast Crisp Meta Info: Time & Location Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Clock Badge (100% Solid Opaque) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121c15] border-2 border-slate-300 dark:border-[#213828] text-slate-900 dark:text-white shadow-sm transition-all">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-600 text-white shrink-0 shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
                {getTranslation(lang, 'updated_time')}{' '}
                <strong className="font-mono font-black text-slate-950 dark:text-emerald-300 text-sm">
                  {currentTimeString}
                </strong>{' '}
                <span className="text-[11px] text-slate-500 dark:text-stone-400 font-normal">
                  {getTranslation(lang, 'today')}
                </span>
              </span>
            </div>

            {/* Location Badge (100% Solid Opaque) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121c15] border-2 border-slate-300 dark:border-[#213828] text-slate-900 dark:text-white shadow-sm transition-all">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-600 text-white shrink-0 shadow-2xs">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {getTranslation(lang, 'location')}
              </span>
            </div>
          </div>

          {/* Voice Briefing Button */}
          <div className="pt-2">
            <button
              onClick={onToggleSpeech}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{getTranslation(lang, 'stop_audio')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{getTranslation(lang, 'btn_listen_report')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Flat Vector Illustration of Murugan Anna */}
        <div className="md:col-span-5 flex justify-center items-end relative min-h-[230px]">
          {/* Animated Speech Bubble (Solid Opaque, Bold Border) */}
          <div
            className={`absolute -top-1 sm:top-1 right-2 sm:right-6 border-2 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-xl z-20 flex items-center gap-2.5 transition-all duration-300 max-w-[220px] ${speechClass}`}
          >
            <span className="text-lg select-none shrink-0">{speechEmoji}</span>
            <span className="text-xs font-black leading-tight">
              {speechText}
            </span>
          </div>

          {/* Sun / Weather in Hero Background */}
          <div className="absolute -top-3 left-6 pointer-events-none opacity-85">
            <svg className="animate-spin-slow" height="74" viewBox="0 0 100 100" width="74">
              <circle cx="50" cy="50" fill="#f59e0b" r="22" />
              <g stroke="#f59e0b" strokeLinecap="round" strokeWidth="4">
                <line x1="50" x2="50" y1="12" y2="2" />
                <line x1="50" x2="50" y1="88" y2="98" />
                <line x1="12" x2="2" y1="50" y2="50" />
                <line x1="88" x2="98" y1="50" y2="50" />
                <line x1="23" x2="16" y1="23" y2="16" />
                <line x1="77" x2="84" y1="77" y2="84" />
                <line x1="23" x2="16" y1="77" y2="84" />
                <line x1="77" x2="84" y1="23" y2="16" />
              </g>
            </svg>
          </div>

          {/* Farmer Murugan Anna SVG Illustration */}
          <svg
            className="w-64 h-56 drop-shadow-md select-none relative z-10"
            fill="none"
            viewBox="0 0 240 220"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="120" cy="212" fill="#161e14" opacity="0.22" rx="64" ry="8" />

            {/* Dhoti / Veshti with Gold Border */}
            <path
              d="M96 150 L84 206 L114 206 L118 160 Z"
              fill="#ffffff"
              stroke="#e2ebdb"
              strokeWidth="1.5"
            />
            <path
              d="M122 160 L126 206 L156 206 L144 150 Z"
              fill="#ffffff"
              stroke="#e2ebdb"
              strokeWidth="1.5"
            />
            {/* Dhoti gold border */}
            <line stroke="#d97706" strokeWidth="3" x1="84" x2="114" y1="202" y2="202" />
            <line stroke="#d97706" strokeWidth="3" x1="126" x2="156" y1="202" y2="202" />

            {/* Brown Sandals */}
            <ellipse cx="98" cy="208" fill="#78350f" rx="14" ry="4" />
            <ellipse cx="142" cy="208" fill="#78350f" rx="14" ry="4" />

            {/* Kurta / Shirt */}
            <path
              d="M85 96 C85 85, 155 85, 155 96 L150 155 L90 155 Z"
              fill="#fbfdf9"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <line stroke="#94a3b8" strokeWidth="2" x1="120" x2="120" y1="92" y2="130" />
            <circle cx="120" cy="105" fill="#475569" r="1.5" />
            <circle cx="120" cy="118" fill="#475569" r="1.5" />

            {/* Left Arm */}
            <path
              d="M88 98 L75 140 L85 145"
              stroke="#c68a5a"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="12"
            />

            {/* Neck */}
            <rect fill="#c68a5a" height="15" rx="3" width="16" x="112" y="76" />

            {/* Face */}
            <circle cx="120" cy="65" fill="#c68a5a" r="22" />
            <circle cx="98" cy="65" fill="#b47849" r="4.5" />
            <circle cx="142" cy="65" fill="#b47849" r="4.5" />

            {/* Eyes & Eyebrows */}
            <path d="M109 56 Q113 54 116 56" stroke="#1f2937" strokeLinecap="round" strokeWidth="2" />
            <path d="M124 56 Q127 54 131 56" stroke="#1f2937" strokeLinecap="round" strokeWidth="2" />
            <circle cx="113" cy="62" fill="#0f172a" r="2" />
            <circle cx="127" cy="62" fill="#0f172a" r="2" />

            {/* Red Pottu / Tilak */}
            <circle cx="120" cy="55" fill="#dc2626" r="2.5" />

            {/* Tamil Farmer Moustache */}
            <path
              d="M107 72 C114 69, 120 74, 120 74 C120 74, 126 69, 133 72 C138 74, 140 70, 140 68 C135 76, 126 77, 120 75 C114 77, 105 76, 100 68 C100 70, 102 74, 107 72 Z"
              fill="#1e293b"
            />

            {/* Smile */}
            <path d="M115 80 Q120 84 125 80" fill="none" stroke="#7f1d1d" strokeLinecap="round" strokeWidth="2" />

            {/* Traditional Orange Thundu (Head Wrap) */}
            <path
              d="M96 52 C96 38, 144 38, 144 52 C146 45, 140 32, 120 32 C100 32, 94 45, 96 52 Z"
              fill="#ea580c"
            />
            <path d="M94 48 Q120 40 146 48 L142 56 Q120 47 98 56 Z" fill="#dc2626" />
            <path d="M142 46 C152 46, 155 60, 152 74 C148 72, 145 60, 142 56 Z" fill="#ea580c" />

            {/* Animated Right Arm holding Wooden Hoe */}
            <g className="animate-hoe">
              <path
                d="M152 98 L180 92 L192 105"
                stroke="#c68a5a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="12"
              />
              {/* Wooden Handle */}
              <line stroke="#78350f" strokeLinecap="round" strokeWidth="6" x1="175" x2="210" y1="40" y2="180" />
              {/* Steel Blade */}
              <polygon fill="#475569" points="172,35 186,30 180,50 166,55" stroke="#334155" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
