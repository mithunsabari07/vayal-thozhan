'use client';

import React from 'react';
import { ShieldAlert, Zap, Waves, CheckCircle2 } from 'lucide-react';
import { Language, TankData, FieldData } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface WaterTankCardProps {
  lang: Language;
  tank: TankData;
  fieldA: FieldData;
  fieldB: FieldData;
  onRefillTank: () => void;
  isRefilling: boolean;
}

export default function WaterTankCard({
  lang,
  tank,
  fieldA,
  fieldB,
  onRefillTank,
  isRefilling,
}: WaterTankCardProps) {
  const fillPercent = Math.min(
    100,
    Math.max(0, Math.round((tank.currentLiters / tank.capacityLiters) * 100))
  );

  const isLowWater = tank.currentLiters <= tank.dryRunCutoffLiters;
  const isFeeding = fieldA.valveStatus === 'open' || fieldB.valveStatus === 'open';

  return (
    <section className="vayal-card rounded-2xl p-5 sm:p-6 space-y-4" id="irrigation">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 dark:border-[#213828] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-sky-700 text-white shadow-xs">
            <Waves className="w-5 h-5 text-sky-100" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
              {getTranslation(lang, 'tank_header')}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold">
              {getTranslation(lang, 'tank_sub')}
            </p>
          </div>
        </div>

        <span
          className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs border-2 ${
            isLowWater
              ? 'bg-rose-100 dark:bg-[#300d11] text-rose-900 dark:text-rose-200 border-rose-400 dark:border-rose-600 animate-pulse'
              : 'bg-emerald-100 dark:bg-[#0e2617] text-emerald-950 dark:text-emerald-200 border-emerald-400 dark:border-emerald-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLowWater ? 'bg-rose-600' : 'bg-emerald-600 animate-ping'
            }`}
          />
          <span>
            {isLowWater
              ? getTranslation(lang, 'low_water')
              : getTranslation(lang, 'sufficient')}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Illustrated Cylindrical Water Tank */}
        <div className="md:col-span-5 flex justify-center py-2">
          <div className="relative w-44 h-56 rounded-3xl border-4 border-[#00598f] bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-inner flex flex-col justify-end ring-4 ring-sky-500/10">
            {/* Tank Capacity Rungs / Markings */}
            <div className="absolute inset-y-0 right-2 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-500 pointer-events-none z-20 font-bold">
              <span>1000 L</span>
              <span>750 L</span>
              <span className="text-emerald-600">500 L</span>
              <span className="text-rose-500">200 L</span>
              <span>0 L</span>
            </div>

            {/* Threshold dashed lines */}
            <div className="absolute inset-x-0 top-[25%] border-b border-dashed border-slate-400/40 z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-[20%] border-b border-dashed border-rose-500/50 z-10 pointer-events-none" />

            {/* Animated Wave Liquid Fill */}
            <div
              className="w-full relative bg-gradient-to-t from-[#00598f] via-[#0072b6] to-[#0284c7] transition-all duration-700"
              style={{ height: `${fillPercent}%` }}
            >
              {/* Wave SVG Top Edge */}
              <div className="absolute -top-3 left-0 right-0 h-4 overflow-hidden pointer-events-none">
                <svg
                  className="tank-wave w-[200%] h-4"
                  preserveAspectRatio="none"
                  viewBox="0 0 200 20"
                >
                  <path
                    d="M 0 10 Q 25 0, 50 10 T 100 10 T 150 10 T 200 10 L 200 20 L 0 20 Z"
                    fill="#0284c7"
                  />
                </svg>
              </div>

              {/* Air Bubbles inside Tank */}
              <div className="absolute bottom-2 left-6 w-2 h-2 rounded-full bg-white/40 animate-bounce" />
              <div className="absolute bottom-6 left-16 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
              <div className="absolute bottom-10 left-24 w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" />
            </div>

            {/* Big Readout in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none text-white drop-shadow-md select-none">
              <span className="text-3xl font-black font-mono tracking-tight">
                {fillPercent}%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                {tank.currentLiters} Litres
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry & Control Actions */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            {/* Available Water */}
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#070e0a] border-2 border-slate-300 dark:border-[#213828]">
              <span className="text-xs text-slate-500 dark:text-stone-400 block font-bold">
                {getTranslation(lang, 'avail_water')}
              </span>
              <span className="text-2xl font-black font-mono text-sky-700 dark:text-sky-300">
                {tank.currentLiters} L
              </span>
              <span className="text-[11px] text-slate-500 dark:text-stone-400 block font-mono font-bold">
                {getTranslation(lang, 'total_cap')}
              </span>
            </div>

            {/* Pump Status */}
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#070e0a] border-2 border-slate-300 dark:border-[#213828]">
              <span className="text-xs text-slate-500 dark:text-stone-400 block font-bold">
                {getTranslation(lang, 'pump_status')}
              </span>
              <span
                className={`text-sm sm:text-base font-black font-mono flex items-center gap-1.5 mt-1 ${
                  isRefilling
                    ? 'text-sky-600 dark:text-sky-400 animate-pulse'
                    : isFeeding
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-stone-300'
                }`}
              >
                {isRefilling ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-500" />
                    <span>{getTranslation(lang, 'pump_refill')}</span>
                  </>
                ) : isFeeding ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{getTranslation(lang, 'pump_running')}</span>
                  </>
                ) : (
                  <span>{getTranslation(lang, 'pump_idle')}</span>
                )}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-stone-400 block mt-0.5 font-bold">
                {isRefilling
                  ? 'Inflow: +40 L/min'
                  : isFeeding
                  ? 'Outflow: 18 L/min'
                  : 'Zero discharge'}
              </span>
            </div>
          </div>

          {/* Safety Dry-Run Cutoff Card (Solid Opaque) */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#291708] border-2 border-amber-400 dark:border-amber-700 flex items-start gap-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-black text-amber-950 dark:text-amber-200 block">
                {getTranslation(lang, 'safety_title')}
              </span>
              <p className="text-amber-900 dark:text-amber-300/90 leading-relaxed font-medium">
                {getTranslation(lang, 'safety_desc')}
              </p>
            </div>
          </div>

          {/* Action: Force Well Refill */}
          <div className="pt-1">
            <button
              onClick={onRefillTank}
              disabled={isRefilling || tank.currentLiters >= tank.capacityLiters}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                isRefilling
                  ? 'bg-sky-700 text-white animate-pulse'
                  : tank.currentLiters >= tank.capacityLiters
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {isRefilling
                  ? lang === 'ta'
                    ? 'போர்வெல் மோட்டார் இயங்குகிறது (நிரப்புகிறது...)'
                    : 'Borehole motor running (Refilling...)'
                  : getTranslation(lang, 'btn_tank_refill')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
