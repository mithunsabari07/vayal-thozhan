'use client';

import React from 'react';
import { Language, FieldData, WeatherData } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface StatCardsProps {
  lang: Language;
  fields: {
    fieldA: FieldData;
    fieldB: FieldData;
  };
  weather: WeatherData;
}

export default function StatCards({ lang, fields, weather }: StatCardsProps) {
  const avgMoisture = Math.round((fields.fieldA.moisture + fields.fieldB.moisture) / 2);

  const fieldsNeedingWaterCount = [
    fields.fieldA.moisture < fields.fieldA.targetStart,
    fields.fieldB.moisture < fields.fieldB.targetStart,
  ].filter(Boolean).length;

  const runningValvesCount = [
    fields.fieldA.valveStatus === 'open',
    fields.fieldB.valveStatus === 'open',
  ].filter(Boolean).length;

  const isRaining = weather.condition === 'rainy' || fields.fieldA.rainSensor === 'wet' || fields.fieldB.rainSensor === 'wet';

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* CARD 1: AVERAGE MOISTURE */}
      <div className="vayal-card rounded-2xl p-4 flex items-center gap-3.5 transition-transform hover:-translate-y-0.5 border-2 border-slate-300 dark:border-[#213828]">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 text-2xl shadow-sm">
          💧
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider block">
            {getTranslation(lang, 'stat_avg_moisture')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {avgMoisture}%
          </span>
          <span className="text-xs text-slate-600 dark:text-stone-300 truncate block font-bold">
            A: {fields.fieldA.moisture}% · B: {fields.fieldB.moisture}%
          </span>
        </div>
      </div>

      {/* CARD 2: FIELDS NEEDING WATER */}
      <div className="vayal-card rounded-2xl p-4 flex items-center gap-3.5 border-2 border-orange-500 dark:border-orange-500 transition-transform hover:-translate-y-0.5">
        <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 text-2xl shadow-sm">
          🥀
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider block">
            {getTranslation(lang, 'stat_needs_water')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-orange-700 dark:text-orange-400 tracking-tight font-mono">
            {fieldsNeedingWaterCount} / 2
          </span>
          <span className="text-xs text-orange-700 dark:text-orange-300 truncate block font-extrabold">
            {fieldsNeedingWaterCount > 0 ? (lang === 'ta' ? 'வயல் B (தக்காளி 🍅)' : 'Field B (Tomato 🍅)') : (lang === 'ta' ? 'அனைத்தும் நன்று' : 'None')}
          </span>
        </div>
      </div>

      {/* CARD 3: VALVES RUNNING */}
      <div className="vayal-card rounded-2xl p-4 flex items-center gap-3.5 border-2 border-emerald-500 dark:border-emerald-500 transition-transform hover:-translate-y-0.5">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-2xl shadow-sm">
          🚿
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider block">
            {getTranslation(lang, 'stat_valves')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 tracking-tight font-mono">
            {runningValvesCount} / 2
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 truncate block font-bold">
            {fields.fieldB.valveStatus === 'open'
              ? (lang === 'ta' ? 'வால்வு B இயங்குகிறது' : 'Valve B active')
              : fields.fieldA.valveStatus === 'open'
              ? (lang === 'ta' ? 'வால்வு A இயங்குகிறது' : 'Valve A active')
              : (lang === 'ta' ? 'மூடியுள்ளது (Standby)' : 'All closed')}
          </span>
        </div>
      </div>

      {/* CARD 4: RAIN STATUS */}
      <div className="vayal-card rounded-2xl p-4 flex items-center gap-3.5 border-2 border-slate-300 dark:border-[#213828] transition-transform hover:-translate-y-0.5">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-2xl shadow-sm">
          {isRaining ? '🌧️' : '☀️'}
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider block">
            {getTranslation(lang, 'stat_rain')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isRaining ? getTranslation(lang, 'rain_detected') : getTranslation(lang, 'no_rain')}
          </span>
          <span className="text-xs text-slate-600 dark:text-stone-300 truncate block font-bold">
            {isRaining ? getTranslation(lang, 'sensors_wet') : getTranslation(lang, 'sensors_dry')}
          </span>
        </div>
      </div>
    </section>
  );
}
