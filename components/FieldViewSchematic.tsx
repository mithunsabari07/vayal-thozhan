'use client';

import React from 'react';
import { LayoutGrid, Droplets, RefreshCw } from 'lucide-react';
import { Language, FieldData, SystemMode } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface FieldViewSchematicProps {
  lang: Language;
  fields: {
    fieldA: FieldData;
    fieldB: FieldData;
  };
  systemMode: SystemMode;
  onToggleSystemMode: (mode: SystemMode) => void;
  onToggleValve: (fieldId: 'field_a' | 'field_b') => void;
}

export default function FieldViewSchematic({
  lang,
  fields,
  systemMode,
  onToggleSystemMode,
  onToggleValve,
}: FieldViewSchematicProps) {
  const isAnyValveOpen = fields.fieldA.valveStatus === 'open' || fields.fieldB.valveStatus === 'open';

  return (
    <section className="vayal-card rounded-2xl p-5 sm:p-6 space-y-4" id="fields">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-200 dark:border-[#213828] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-xs">
            <LayoutGrid className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
              {getTranslation(lang, 'field_view_title')}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold">
              {getTranslation(lang, 'schematic_sub')}
            </p>
          </div>
        </div>

        {/* Mode Toggle Switch (Auto vs Manual) */}
        <div className="flex items-center bg-stone-200 dark:bg-[#070e0a] rounded-xl p-1 border-2 border-stone-300 dark:border-[#213828] shadow-inner">
          <button
            onClick={() => onToggleSystemMode('auto')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              systemMode === 'auto'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {getTranslation(lang, 'mode_auto')}
          </button>
          <button
            onClick={() => onToggleSystemMode('manual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              systemMode === 'manual'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {getTranslation(lang, 'mode_manual')}
          </button>
        </div>
      </div>

      {/* Schematic Canvas */}
      <div className="rounded-xl p-4 sm:p-5 bg-[#efe5d3] dark:bg-[#16120b] border-2 border-[#d3be9e] dark:border-[#3d2e1c] relative overflow-hidden shadow-inner">
        {/* MAIN WATER PIPELINE (Thick Solid Blue) Across Top */}
        <div className="relative mb-6">
          <div
            className={`h-5 bg-[#1d4ed8] rounded-full shadow-md flex items-center justify-between px-3 relative z-10 border border-blue-400 ${
              isAnyValveOpen ? 'animate-pipe-flow' : ''
            }`}
          >
            <span className="text-[10px] font-mono text-white font-black tracking-wider uppercase">
              {getTranslation(lang, 'main_pipe_tag')}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-white font-mono font-bold">
              <Droplets className={`w-3.5 h-3.5 ${isAnyValveOpen ? 'animate-bounce text-cyan-300' : ''}`} />
              {isAnyValveOpen ? 'Flowing (18 L/min)' : 'Pressurized (Static)'}
            </span>
          </div>

          {/* Sub-branch Pipes dropping down into Plot A and Plot B */}
          <div
            className={`absolute left-1/4 top-4 w-2.5 h-7 bg-[#1d4ed8] transition-opacity ${
              fields.fieldA.valveStatus === 'open' ? 'ring-2 ring-emerald-400' : ''
            }`}
          />
          <div
            className={`absolute right-1/4 top-4 w-2.5 h-7 bg-[#1d4ed8] transition-opacity ${
              fields.fieldB.valveStatus === 'open' ? 'ring-2 ring-cyan-400' : ''
            }`}
          />
        </div>

        {/* Two Field Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {/* PLOT A (Field A - Samba Paddy - Solid Opaque) */}
          <div className="rounded-xl border-[3.5px] border-[#15803d] bg-white dark:bg-[#0c180e] p-4 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-sm">
            {/* Water Level Fill Simulation from bottom */}
            <div
              className="absolute bottom-0 inset-x-0 bg-emerald-500/25 dark:bg-emerald-400/20 pointer-events-none transition-all duration-700"
              style={{ height: `${fields.fieldA.moisture}%` }}
            />

            {/* Active Water Spray if Valve A is open */}
            {fields.fieldA.valveStatus === 'open' && (
              <div className="absolute inset-x-0 top-12 flex justify-around pointer-events-none z-20">
                <span className="spray-dot text-emerald-600 font-bold text-lg">💧</span>
                <span className="spray-dot text-emerald-500 font-bold text-sm">💧</span>
                <span className="spray-dot text-emerald-700 font-bold text-lg">💧</span>
                <span className="spray-dot text-emerald-400 font-bold text-sm">💧</span>
              </div>
            )}

            {/* Header: Status Pill & Valve Indicator */}
            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803d] text-white text-xs font-black shadow-xs">
                🌾 Field A · {fields.fieldA.moisture}%
              </span>

              {/* Valve A Indicator button */}
              <button
                onClick={() => onToggleValve('field_a')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer ${
                  fields.fieldA.valveStatus === 'open'
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-stone-800 text-slate-800 dark:text-stone-200'
                }`}
                title="Toggle Valve A"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    fields.fieldA.valveStatus === 'open' ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  Valve A: {fields.fieldA.valveStatus === 'open' ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Crop Visualization: Samba Paddy Stalks */}
            <div className="py-5 relative z-10">
              <div className="flex justify-around text-2xl sm:text-3xl filter drop-shadow">
                <span className="transform hover:scale-125 transition-transform select-none">🌾</span>
                <span className="transform hover:scale-125 transition-transform select-none">🌾</span>
                <span className="transform hover:scale-125 transition-transform select-none">🌾</span>
                <span className="transform hover:scale-125 transition-transform select-none">🌾</span>
                <span className="transform hover:scale-125 transition-transform select-none">🌾</span>
              </div>
              <div className="h-2 bg-[#86efac] dark:bg-[#1f5429] rounded-full mt-2 mx-2" />
              <div className="flex justify-between items-center text-xs font-mono font-bold text-[#15803d] dark:text-[#88d982] mt-2 px-1">
                <span>{getTranslation(lang, 'crop_paddy')}</span>
                <span>{getTranslation(lang, 'soil_clay')}</span>
              </div>
            </div>

            {/* Footnote Telemetry */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-700 dark:text-stone-300 pt-2 border-t-2 border-[#15803d]/20 font-bold">
              <span>
                {getTranslation(lang, 'soil_moisture')}: {fields.fieldA.moisture}%
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                ✓ {getTranslation(lang, 'satisfied')}
              </span>
            </div>
          </div>

          {/* PLOT B (Field B - Country Tomato - Solid Opaque) */}
          <div
            className={`rounded-xl border-[3.5px] border-[#c2410c] bg-white dark:bg-[#181109] p-4 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-sm ${
              fields.fieldB.moisture < fields.fieldB.targetStart
                ? 'ring-2 ring-orange-500/50'
                : ''
            }`}
          >
            {/* Water Level Fill Simulation */}
            <div
              className="absolute bottom-0 inset-x-0 bg-blue-500/20 dark:bg-blue-400/15 pointer-events-none transition-all duration-700"
              style={{ height: `${fields.fieldB.moisture}%` }}
            />

            {/* Active Water Spray if Valve B is open */}
            {fields.fieldB.valveStatus === 'open' && (
              <div className="absolute inset-x-0 top-12 flex justify-around pointer-events-none z-20">
                <span className="spray-dot text-blue-500 font-bold text-lg">💧</span>
                <span className="spray-dot text-blue-400 font-bold text-sm">💧</span>
                <span className="spray-dot text-blue-600 font-bold text-lg">💧</span>
                <span className="spray-dot text-blue-500 font-bold text-sm">💧</span>
              </div>
            )}

            {/* Header: Status Pill & Valve Indicator */}
            <div className="flex items-center justify-between relative z-10">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e65100] text-white text-xs font-bold shadow-xs ${
                  fields.fieldB.moisture < fields.fieldB.targetStart ? 'animate-pulse' : ''
                }`}
              >
                🍅 Field B · {fields.fieldB.moisture}%{' '}
                {fields.fieldB.moisture < fields.fieldB.targetStart
                  ? `(${lang === 'ta' ? 'வறண்டது' : 'Dry'})`
                  : ''}
              </span>

              {/* Valve B Indicator button */}
              <button
                onClick={() => onToggleValve('field_b')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  fields.fieldB.valveStatus === 'open'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
                title="Toggle Valve B"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    fields.fieldB.valveStatus === 'open' ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  Valve B: {fields.fieldB.valveStatus === 'open' ? 'ON (Watering)' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Crop Visualization: Tomato Plants */}
            <div className="py-5 relative z-10">
              <div className="flex justify-around text-2xl sm:text-3xl filter drop-shadow">
                <span className="transform -rotate-6 hover:scale-125 transition-transform select-none">
                  🍅
                </span>
                <span className="transform rotate-3 hover:scale-125 transition-transform select-none">
                  🍅
                </span>
                <span className="transform -rotate-3 hover:scale-125 transition-transform select-none">
                  🍅
                </span>
                <span className="transform rotate-6 hover:scale-125 transition-transform select-none">
                  🍅
                </span>
              </div>
              <div className="h-1.5 bg-[#f5b78a] dark:bg-[#522919] rounded-full mt-2 mx-2" />
              <div className="flex justify-between items-center text-xs font-mono text-orange-700 dark:text-orange-400 mt-2 px-1">
                <span>{getTranslation(lang, 'crop_tomato')}</span>
                <span className="font-bold">{getTranslation(lang, 'soil_red')}</span>
              </div>
            </div>

            {/* Footnote Telemetry */}
            <div className="relative z-10 flex items-center justify-between text-xs text-orange-800 dark:text-orange-300 pt-2 border-t border-[#e65100]/20 font-medium">
              <span>
                {getTranslation(lang, 'soil_moisture')}: {fields.fieldB.moisture}%
              </span>
              <span className="font-bold flex items-center gap-1">
                {fields.fieldB.valveStatus === 'open' ? (
                  <>
                    <Droplets className="w-3.5 h-3.5 animate-bounce text-cyan-600" />
                    <span>{getTranslation(lang, 'irrigating')}</span>
                  </>
                ) : fields.fieldB.moisture < fields.fieldB.targetStart ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    {getTranslation(lang, 'water_needed')}
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    ✓ {getTranslation(lang, 'satisfied')}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Logic Caption */}
        <div className="mt-3.5 text-center text-xs font-mono text-stone-600 dark:text-stone-300 bg-white/70 dark:bg-black/40 py-1.5 px-3 rounded-lg border border-stone-300/40 dark:border-stone-800">
          {getTranslation(lang, 'auto_caption')}
        </div>
      </div>
    </section>
  );
}
