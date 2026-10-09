'use client';

import React from 'react';
import { Play, Square, Sun, CloudRain, Thermometer, Droplet, RefreshCw } from 'lucide-react';
import { Language, FieldData } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface FieldCardsProps {
  lang: Language;
  fieldA: FieldData;
  fieldB: FieldData;
  onToggleValve: (fieldId: 'field_a' | 'field_b') => void;
  onChangeDuration: (fieldId: 'field_a' | 'field_b', minutes: number) => void;
}

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function FieldCards({
  lang,
  fieldA,
  fieldB,
  onToggleValve,
  onChangeDuration,
}: FieldCardsProps) {
  const renderFieldCard = (
    field: FieldData,
    borderTopColor: string,
    badgeBg: string,
    badgeText: string,
    isTomato: boolean
  ) => {
    const isWatering = field.valveStatus === 'open';
    const isDry = field.moisture < field.targetStart;

    return (
      <div
        className="vayal-card rounded-2xl p-5 space-y-4 shadow-md transition-all border-2 border-slate-300 dark:border-[#213828]"
        style={{ borderTop: `8px solid ${borderTopColor}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full font-black text-lg flex items-center justify-center shadow-xs border-2 border-white/40"
              style={{ backgroundColor: borderTopColor, color: '#ffffff' }}
            >
              {field.letter}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {lang === 'ta' ? field.nameTa : field.nameEn}
              </h3>
              <span className="text-xs text-slate-600 dark:text-stone-300 font-bold">
                {field.cropEmoji} {lang === 'ta' ? field.cropTa : field.cropEn}
              </span>
            </div>
          </div>

          {/* Status Chip (Solid) */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs border-2 ${
              isDry
                ? 'bg-rose-100 dark:bg-[#381010] text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700 animate-pulse'
                : 'bg-emerald-100 dark:bg-[#102e1b] text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDry ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            />
            <span>
              {isDry
                ? lang === 'ta'
                  ? 'ஈரம் குறைவு (Dry)'
                  : 'Moisture Low (Dry)'
                : lang === 'ta'
                ? 'நன்று (Optimal)'
                : 'Optimal (Good)'}
            </span>
          </span>
        </div>

        {/* Soil Moisture Giant Metric & Thick Gauge Bar */}
        <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#070e0a] space-y-2 border-2 border-slate-300 dark:border-[#213828]">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-extrabold text-slate-600 dark:text-stone-300 uppercase tracking-wider">
              {getTranslation(lang, 'soil_moisture')}
            </span>
            <span
              className={`font-black ${
                isDry ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {isDry
                ? getTranslation(lang, 'water_needed')
                : getTranslation(lang, 'adequate')}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl font-black font-mono tracking-tight"
              style={{ color: borderTopColor }}
            >
              {field.moisture}%
            </span>
            <span className="text-xs text-slate-600 dark:text-stone-300 font-bold">
              {isDry ? `/ below ${field.targetStart}% limit` : `/ target ${field.targetStart}-${field.targetStop}%`}
            </span>
          </div>

          {/* Thick Segmented Gauge Bar with Markers */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-4.5 bg-slate-200 dark:bg-stone-800 rounded-full overflow-hidden relative shadow-inner border border-slate-300 dark:border-stone-700">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, Math.max(0, field.moisture))}%`,
                  backgroundColor: borderTopColor,
                }}
              />
              {/* 40% Start notch */}
              <div
                className="absolute top-0 bottom-0 left-[40%] w-1 bg-rose-600 z-10"
                title="Start threshold (40%)"
              />
              {/* 70% Stop notch */}
              <div
                className="absolute top-0 bottom-0 left-[70%] w-1 bg-blue-600 z-10"
                title="Stop threshold (70%)"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 dark:text-stone-400">
              <span>0% Dry</span>
              <span className="text-rose-600 font-black">40% [Start]</span>
              <span className="text-blue-600 font-black">70% [Stop]</span>
              <span>100% Sat</span>
            </div>
          </div>
        </div>

        {/* Telemetry Sensor Grid (2x2) - Solid Opaque Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Valve Tile */}
          <div
            className={`p-3 rounded-xl border-2 flex items-center justify-between transition-colors ${
              isWatering
                ? 'bg-emerald-100 dark:bg-[#142e1b] border-emerald-500 text-emerald-950 dark:text-emerald-100'
                : 'bg-[#ffffff] dark:bg-[#070e0a] border-slate-300 dark:border-[#213828] text-slate-900 dark:text-white'
            }`}
          >
            <div>
              <span className="text-[11px] text-slate-500 dark:text-stone-400 block font-bold">
                {getTranslation(lang, 'valve_label')}
              </span>
              <span className="font-mono font-black text-xs flex items-center gap-1">
                {isWatering ? (
                  <>
                    <span className="text-emerald-700 dark:text-emerald-300">💦 ON</span>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
                      ({formatCountdown(field.valveTimeRemainingSeconds)})
                    </span>
                  </>
                ) : (
                  <span className="text-slate-600 dark:text-stone-400">OFF</span>
                )}
              </span>
            </div>
            {isWatering ? (
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {/* Rain Sensor Tile */}
          <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#070e0a] border-2 border-slate-300 dark:border-[#213828] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-stone-400 block font-bold">
                {getTranslation(lang, 'rain_sensor')}
              </span>
              <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400">
                {field.rainSensor === 'dry' ? '☀️ Dry' : '🌧️ Rain'}
              </span>
            </div>
            {field.rainSensor === 'dry' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <CloudRain className="w-4 h-4 text-sky-500 animate-bounce" />
            )}
          </div>

          {/* Temperature Tile */}
          <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#070e0a] border-2 border-slate-300 dark:border-[#213828] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-stone-400 block font-bold">
                {getTranslation(lang, 'temp_label')}
              </span>
              <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                {field.temperature} °C
              </span>
            </div>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>

          {/* Humidity Tile */}
          <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#070e0a] border-2 border-slate-300 dark:border-[#213828] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-stone-400 block font-bold">
                {getTranslation(lang, 'humid_label')}
              </span>
              <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                {field.humidity}%
              </span>
            </div>
            <Droplet className="w-4 h-4 text-sky-500" />
          </div>
        </div>

        {/* Manual Controls Toolbar (Solid Thick Buttons) */}
        <div className="pt-2 flex items-center gap-2">
          {!isWatering ? (
            <>
              <select
                value={field.durationMinutes}
                onChange={(e) =>
                  onChangeDuration(field.id, parseInt(e.target.value, 10))
                }
                className="rounded-xl border-2 border-slate-300 dark:border-[#213828] bg-white dark:bg-[#070e0a] text-slate-900 dark:text-white text-xs font-black px-3 py-2.5 shadow-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value={10}>10 {getTranslation(lang, 'min_duration')}</option>
                <option value={20}>20 {getTranslation(lang, 'min_duration')}</option>
                <option value={30}>30 {getTranslation(lang, 'min_duration')}</option>
              </select>

              <button
                onClick={() => onToggleValve(field.id)}
                className="flex-1 py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
                style={{ backgroundColor: borderTopColor }}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {field.id === 'field_a'
                    ? getTranslation(lang, 'btn_start_a')
                    : lang === 'ta'
                    ? 'வால்வு B தொடங்கு'
                    : 'Start Valve B'}
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggleValve(field.id)}
              className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-white"
              style={{
                backgroundColor: borderTopColor,
              }}
            >
              <Square className="w-4 h-4 fill-current" />
              <span>
                {field.id === 'field_b'
                  ? `${getTranslation(lang, 'btn_stop_b')} (${formatCountdown(
                      field.valveTimeRemainingSeconds
                    )} ${getTranslation(lang, 'left')})`
                  : lang === 'ta'
                  ? `வால்வு A நிறுத்து (${formatCountdown(
                      field.valveTimeRemainingSeconds
                    )})`
                  : `Stop Valve A now (${formatCountdown(
                      field.valveTimeRemainingSeconds
                    )})`}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderFieldCard(fieldA, '#15803d', '#dcfce7', '#15803d', false)}
      {renderFieldCard(fieldB, '#c2410c', '#ffedd5', '#c2410c', true)}
    </section>
  );
}
