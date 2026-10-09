'use client';

import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Language, FieldData } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface TelemetryChartsProps {
  lang: Language;
  fieldA: FieldData;
  fieldB: FieldData;
}

type TimeRange = '1h' | '6h' | '24h' | '7d';

export default function TelemetryCharts({ lang, fieldA, fieldB }: TelemetryChartsProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');

  // Dynamic path coordinates
  const chartData: Record<
    TimeRange,
    {
      moistPathA: string;
      moistPathB: string;
      tempPathA: string;
      tempPathB: string;
      humidPathA: string;
      humidPathB: string;
      labels: string[];
    }
  > = {
    '1h': {
      moistPathA: 'M 60 80 C 140 78, 260 82, 380 79 C 500 81, 580 80, 670 78',
      moistPathB: 'M 60 138 C 150 142, 280 140, 420 144 C 540 142, 600 145, 670 144',
      tempPathA: 'M 40 94 C 120 93, 240 92, 360 91 C 420 90, 460 90, 480 89',
      tempPathB: 'M 40 74 C 120 73, 240 72, 360 71 C 420 70, 460 70, 480 69',
      humidPathA: 'M 40 70 C 120 69, 240 68, 360 67 C 420 66, 460 65, 480 64',
      humidPathB: 'M 40 86 C 120 85, 240 84, 360 83 C 420 82, 460 81, 480 80',
      labels: ['15m ago', '30m ago', '45m ago', 'Now'],
    },
    '6h': {
      moistPathA: 'M 60 83 C 140 81, 260 84, 380 80 C 500 82, 600 79, 670 78',
      moistPathB: 'M 60 112 C 160 120, 300 130, 440 138 C 550 142, 610 146, 670 144',
      tempPathA: 'M 40 108 C 140 102, 260 96, 380 91 C 440 90, 465 89, 480 89',
      tempPathB: 'M 40 92 C 140 84, 260 76, 380 71 C 440 70, 465 69, 480 69',
      humidPathA: 'M 40 48 C 140 54, 260 60, 380 63 C 440 64, 465 64, 480 64',
      humidPathB: 'M 40 60 C 140 68, 260 75, 380 79 C 440 80, 465 80, 480 80',
      labels: ['6h ago', '4h ago', '2h ago', 'Now'],
    },
    '24h': {
      moistPathA: 'M 60 82 C 140 80, 200 84, 280 82 C 360 79, 440 85, 520 80 C 600 82, 640 81, 670 78',
      moistPathB: 'M 60 95 C 140 102, 200 110, 280 120 C 360 128, 440 135, 520 142 C 580 148, 620 146, 670 144',
      tempPathA: 'M 40 118 C 120 120, 200 104, 300 90 C 380 88, 440 89, 480 89',
      tempPathB: 'M 40 106 C 120 108, 200 88, 300 70 C 380 68, 440 69, 480 69',
      humidPathA: 'M 40 34 C 120 36, 200 50, 300 68 C 380 66, 440 64, 480 64',
      humidPathB: 'M 40 44 C 120 48, 200 64, 300 82 C 380 81, 440 80, 480 80',
      labels: ['06:00 AM', '09:00 AM', '12:00 PM', '01:30 PM', 'Now'],
    },
    '7d': {
      moistPathA: 'M 60 78 C 160 84, 280 76, 400 82 C 520 78, 600 80, 670 78',
      moistPathB: 'M 60 88 C 160 98, 280 115, 420 130 C 540 140, 620 142, 670 144',
      tempPathA: 'M 40 98 C 140 105, 260 92, 380 95 C 440 90, 465 89, 480 89',
      tempPathB: 'M 40 80 C 140 88, 260 74, 380 78 C 440 71, 465 70, 480 69',
      humidPathA: 'M 40 52 C 140 60, 260 55, 380 62 C 440 65, 465 64, 480 64',
      humidPathB: 'M 40 68 C 140 76, 260 72, 380 78 C 440 81, 465 80, 480 80',
      labels: ['Day 1', 'Day 3', 'Day 5', 'Today'],
    },
  };

  const current = chartData[selectedRange];

  return (
    <section className="vayal-card rounded-2xl p-5 sm:p-6 space-y-6" id="telemetry">
      {/* Section Header with Time Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 dark:border-[#213828] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
              {getTranslation(lang, 'trends_title')}
            </h2>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {getTranslation(lang, 'trends_sub')}
            </p>
          </div>
        </div>

        {/* Solid Time Tabs */}
        <div className="flex items-center bg-slate-200 dark:bg-[#070e0a] rounded-xl p-1 border-2 border-slate-300 dark:border-[#213828] text-xs font-mono">
          {(['1h', '6h', '24h', '7d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3.5 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                selectedRange === range
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* GRAPH 1: Soil Moisture History SVG */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>💧 {getTranslation(lang, 'moisture_trend_title')}</span>
          </span>

          {/* Solid Legend Badges */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-[#142e1b] text-emerald-900 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700">
              <span className="w-3.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              Field A ({fieldA.cropEmoji} {fieldA.moisture}%)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-100 dark:bg-[#351a0d] text-orange-900 dark:text-orange-200 border-2 border-orange-300 dark:border-orange-700">
              <span className="w-3.5 h-1.5 bg-orange-600 dark:bg-orange-400 rounded-full" />
              Field B ({fieldB.cropEmoji} {fieldB.moisture}%)
            </span>
          </div>
        </div>

        {/* Moisture Canvas (100% Solid Background, No washed-out transparency) */}
        <div className="w-full bg-[#f8fafc] dark:bg-[#070d09] rounded-2xl p-4 border-2 border-slate-300 dark:border-[#213828] shadow-md">
          <svg className="w-full h-52 sm:h-60" fill="none" viewBox="0 0 700 200">
            {/* Grid lines */}
            <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.4" x1="50" x2="680" y1="20" y2="20" />
            <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.4" x1="50" x2="680" y1="65" y2="65" />
            <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.4" x1="50" x2="680" y1="120" y2="120" />
            <line stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.6" x1="50" x2="680" y1="170" y2="170" />

            {/* Y-Axis labels */}
            <text fill="#64748b" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" x="12" y="24">100%</text>
            <text fill="#0284c7" className="dark:fill-sky-400" fontFamily="Space Grotesk" fontSize="11" fontWeight="800" x="5" y="69">70% Stop</text>
            <text fill="#dc2626" className="dark:fill-rose-400" fontFamily="Space Grotesk" fontSize="11" fontWeight="800" x="5" y="124">40% Start</text>
            <text fill="#64748b" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" x="22" y="174">0%</text>

            {/* Critical Threshold 70% Blue Line (Thick) */}
            <line opacity="0.9" stroke="#0284c7" className="dark:stroke-sky-400" strokeDasharray="6 4" strokeWidth="2" x1="50" x2="680" y1="65" y2="65" />
            {/* Critical Threshold 40% Red Line (Thick) */}
            <line opacity="0.9" stroke="#dc2626" className="dark:stroke-rose-400" strokeDasharray="6 4" strokeWidth="2" x1="50" x2="680" y1="120" y2="120" />

            {/* FIELD A Line (Green - Thick & Solid) */}
            <path
              d={current.moistPathA}
              fill="none"
              stroke="#15803d"
              className="dark:stroke-[#22c55e]"
              strokeLinecap="round"
              strokeWidth="4.5"
            />
            <circle cx="670" cy="78" fill="#15803d" className="dark:fill-[#22c55e]" r="6" stroke="#fff" strokeWidth="2.5" />

            {/* FIELD B Line (Orange - Thick & Solid) */}
            <path
              d={current.moistPathB}
              fill="none"
              stroke="#c2410c"
              className="dark:stroke-[#fb923c]"
              strokeLinecap="round"
              strokeWidth="4.5"
            />
            <circle cx="670" cy="144" fill="#c2410c" className="dark:fill-[#fb923c]" r="6" stroke="#fff" strokeWidth="2.5" />

            {/* X-Axis Timestamps */}
            {current.labels.map((label, idx) => {
              const xPos = 60 + idx * (580 / Math.max(1, current.labels.length - 1));
              return (
                <text
                  key={idx}
                  fill="#475569"
                  className="dark:fill-stone-300"
                  fontFamily="Space Grotesk"
                  fontSize="11"
                  fontWeight="700"
                  x={xPos}
                  y="190"
                  textAnchor="middle"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* DUAL HIGH-PRECISION CHARTS: TEMPERATURE & HUMIDITY (Solid Backgrounds & Thick Strokes) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        {/* ============================================================== */}
        {/* GRAPH 2: TEMPERATURE TELEMETRY GRAPH (°C)                     */}
        {/* ============================================================== */}
        <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#0c1610] border-2 border-slate-300 dark:border-[#213828] space-y-4 shadow-md">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-200 dark:border-[#213828] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">
                  {lang === 'ta' ? 'நுண்ணிய வெப்பநிலை (°C)' : 'Micro-Climate Temperature (°C)'}
                </h3>
                <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                  Field A: {fieldA.temperature}°C · Field B: {fieldB.temperature}°C
                </span>
              </div>
            </div>

            {/* High/Low Badges (Solid) */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-[#38200b] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                34.8°C Peak
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-slate-300 dark:border-stone-700">
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                26.4°C Low
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs px-1 font-bold">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                <span className="w-4 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full" />
                Field B ({fieldB.temperature}°C Tomato)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <span className="w-4 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                Field A ({fieldA.temperature}°C Paddy)
              </span>
            </div>
            <span className="font-mono text-stone-700 dark:text-stone-300">
              Δ 3.0°C Diff
            </span>
          </div>

          {/* Solid Canvas (100% Opaque, No Translucent Gray) */}
          <div className="w-full bg-[#ffffff] dark:bg-[#060c08] rounded-xl p-3 sm:p-4 border-2 border-slate-300 dark:border-[#1e3224] shadow-inner">
            <svg className="w-full h-44 sm:h-48" fill="none" viewBox="0 0 500 150">
              <defs>
                {/* Thick Radiant Warm Amber Area Fill */}
                <linearGradient id="solidTempGradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.35" x1="38" x2="485" y1="20" y2="20" />
              <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.35" x1="38" x2="485" y1="55" y2="55" />
              <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.35" x1="38" x2="485" y1="90" y2="90" />
              <line stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.5" x1="38" x2="485" y1="125" y2="125" />

              {/* Y-Axis Value Labels */}
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="24">40°</text>
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="59">35°</text>
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="94">30°</text>
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="129">25°</text>

              {/* Thick Tinted Area Under Field B */}
              <path
                d={`${current.tempPathB} L 480 125 L 40 125 Z`}
                fill="url(#solidTempGradB)"
              />

              {/* Field A Temperature Line (Thick Emerald Green) */}
              <path
                d={current.tempPathA}
                fill="none"
                stroke="#15803d"
                className="dark:stroke-[#22c55e]"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <circle cx="480" cy="89" fill="#15803d" className="dark:fill-[#22c55e]" r="5" stroke="#fff" strokeWidth="2" />

              {/* Field B Temperature Line (Thick Solar Amber) */}
              <path
                d={current.tempPathB}
                fill="none"
                stroke="#d97706"
                className="dark:stroke-[#f59e0b]"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
              <circle cx="480" cy="69" fill="#d97706" className="dark:fill-[#f59e0b]" r="5.5" stroke="#fff" strokeWidth="2" />

              {/* Solid Value Tooltip Tag */}
              <g transform="translate(430, 42)">
                <rect fill="#d97706" className="dark:fill-[#f59e0b]" height="20" rx="6" width="52" x="0" y="0" />
                <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="bold" textAnchor="middle" x="26" y="14">
                  34.0°C
                </text>
              </g>

              {/* X-Axis Dynamic Labels */}
              {current.labels.map((label, idx) => {
                const xPos = 40 + idx * (440 / Math.max(1, current.labels.length - 1));
                return (
                  <text
                    key={idx}
                    fill="#475569"
                    className="dark:fill-stone-300"
                    fontFamily="Space Grotesk"
                    fontSize="10"
                    fontWeight="700"
                    x={xPos}
                    y="142"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* ============================================================== */}
        {/* GRAPH 3: VIBRANT AMBIENT HUMIDITY GRAPH (%)                    */}
        {/* ============================================================== */}
        <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#0c1610] border-2 border-slate-300 dark:border-[#213828] space-y-4 shadow-md">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-200 dark:border-[#213828] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">
                  {lang === 'ta' ? 'வளிமண்டல காற்று ஈரப்பதம் (%)' : 'Ambient Relative Humidity (%)'}
                </h3>
                <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                  Field A: {fieldA.humidity}% · Field B: {fieldB.humidity}%
                </span>
              </div>
            </div>

            {/* High/Low Badges (Solid) */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-[#0c2e42] text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                <ArrowUpRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                82% Dew
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-slate-300 dark:border-stone-700">
                <ArrowDownRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                52% Noon
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs px-1 font-bold">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
                <span className="w-4 h-1.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                Field A ({fieldA.humidity}% Paddy)
              </span>
              <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                <span className="w-4 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                Field B ({fieldB.humidity}% Tomato)
              </span>
            </div>
            <span className="font-mono text-stone-700 dark:text-stone-300">
              Avg: 60%
            </span>
          </div>

          {/* Solid Canvas (100% Opaque, High Contrast Thick Blue Line) */}
          <div className="w-full bg-[#ffffff] dark:bg-[#060c08] rounded-xl p-3 sm:p-4 border-2 border-slate-300 dark:border-[#1e3224] shadow-inner">
            <svg className="w-full h-44 sm:h-48" fill="none" viewBox="0 0 500 150">
              <defs>
                {/* Thick Glowing Blue Area Fill */}
                <linearGradient id="solidHumidGradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" className="dark:stop-color-[#38bdf8]" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0284c7" className="dark:stop-color-[#38bdf8]" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.35" x1="38" x2="485" y1="20" y2="20" />
              <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.35" x1="38" x2="485" y1="55" y2="55" />
              <line stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.35" x1="38" x2="485" y1="90" y2="90" />
              <line stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.5" x1="38" x2="485" y1="125" y2="125" />

              {/* Y-Axis Value Labels */}
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="24">90%</text>
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="59">70%</text>
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="94">50%</text>
              <text fill="#475569" className="dark:fill-stone-300" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="8" y="129">30%</text>

              {/* Solid Rich Blue Shaded Area Under Curve */}
              <path
                d={`${current.humidPathA} L 480 125 L 40 125 Z`}
                fill="url(#solidHumidGradBlue)"
              />

              {/* Field B Humidity Line (Thick Violet/Indigo Dashed) */}
              <path
                d={current.humidPathB}
                fill="none"
                stroke="#6366f1"
                className="dark:stroke-[#818cf8]"
                strokeLinecap="round"
                strokeWidth="3.5"
                strokeDasharray="6 3"
              />
              <circle cx="480" cy="80" fill="#6366f1" className="dark:fill-[#818cf8]" r="4.5" stroke="#fff" strokeWidth="2" />

              {/* Field A Humidity Line (THICK, VIBRANT, HIGH-CONTRAST SOLID BLUE) */}
              <path
                d={current.humidPathA}
                fill="none"
                stroke="#0284c7"
                className="dark:stroke-[#38bdf8]"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <circle cx="480" cy="64" fill="#0284c7" className="dark:fill-[#38bdf8]" r="6" stroke="#fff" strokeWidth="2.5" />

              {/* Solid Value Tooltip Tag */}
              <g transform="translate(430, 38)">
                <rect fill="#0284c7" className="dark:fill-[#38bdf8]" height="20" rx="6" width="52" x="0" y="0" />
                <text fill="#ffffff" className="dark:fill-[#08110b]" fontFamily="Space Grotesk" fontSize="11" fontWeight="bold" textAnchor="middle" x="26" y="14">
                  64%
                </text>
              </g>

              {/* X-Axis Dynamic Labels */}
              {current.labels.map((label, idx) => {
                const xPos = 40 + idx * (440 / Math.max(1, current.labels.length - 1));
                return (
                  <text
                    key={idx}
                    fill="#475569"
                    className="dark:fill-stone-300"
                    fontFamily="Space Grotesk"
                    fontSize="10"
                    fontWeight="700"
                    x={xPos}
                    y="142"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
