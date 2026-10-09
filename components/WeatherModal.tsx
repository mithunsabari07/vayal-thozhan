'use client';

import React from 'react';
import { X, CloudSun, Wind, Droplets, Sun, Compass } from 'lucide-react';
import { Language, WeatherData } from '@/lib/types';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  weather: WeatherData;
}

export default function WeatherModal({
  isOpen,
  onClose,
  lang,
  weather,
}: WeatherModalProps) {
  if (!isOpen) return null;

  const forecast = [
    { day: lang === 'ta' ? 'இன்று' : 'Today', temp: '34° / 24°', icon: '☀️', condition: lang === 'ta' ? 'தெளிவான வானம்' : 'Clear Sky', rain: '0%' },
    { day: lang === 'ta' ? 'நாளை' : 'Tomorrow', temp: '33° / 25°', icon: '⛅', condition: lang === 'ta' ? 'பகுதி மேகமூட்டம்' : 'Partly Cloudy', rain: '10%' },
    { day: lang === 'ta' ? 'வியாழன்' : 'Thursday', temp: '32° / 24°', icon: '🌦️', condition: lang === 'ta' ? 'லேசான தூறல்' : 'Light Drizzle', rain: '35%' },
    { day: lang === 'ta' ? 'வெள்ளி' : 'Friday', temp: '31° / 23°', icon: '🌧️', condition: lang === 'ta' ? 'மழை வாய்ப்பு' : 'Chance of Rain', rain: '65%' },
    { day: lang === 'ta' ? 'சனி' : 'Saturday', temp: '33° / 24°', icon: '☀️', condition: lang === 'ta' ? 'வெயில்' : 'Sunny', rain: '5%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111c14] border-2 border-stone-300 dark:border-[#27402d] shadow-2xl p-6 text-stone-900 dark:text-stone-100 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-stone-200 dark:border-[#203726] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-sky-700 dark:text-sky-400" />
            <h3 className="font-black text-base sm:text-lg">
              {lang === 'ta'
                ? 'தஞ்சாவூர் மாவட்ட வேளாண் வானிலை அறிக்கை'
                : 'Thanjavur Agro-Meteorological Radar'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-[#1b2b20] text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Conditions Card (100% Solid) */}
        <div className="p-4 rounded-xl bg-[#edf6fc] dark:bg-[#071929] border-2 border-sky-500 mb-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-sky-900 dark:text-sky-300 font-bold block">
              {lang === 'ta' ? 'தற்போதைய வெப்பநிலை' : 'Current Temperature'}
            </span>
            <span className="text-3xl font-black font-mono text-sky-950 dark:text-sky-100">
              34°C
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-300 font-medium block mt-0.5">
              {lang === 'ta' ? 'தெளிவான வெயில் · காற்று 14 கி.மீ/மணி' : 'Clear Sun · Wind 14 km/h SW'}
            </span>
          </div>

          <div className="text-right space-y-1.5 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>{lang === 'ta' ? 'காற்று ஈரம்: 58%' : 'Humidity: 58%'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>UV Index: 7 (High)</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>ET₀: 4.8 mm/day</span>
            </div>
          </div>
        </div>

        {/* 5-Day Agro Forecast Table */}
        <div className="space-y-2">
          <span className="text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
            {lang === 'ta' ? '5 நாள் முன்னறிவிப்பு' : '5-Day Agricultural Forecast'}
          </span>

          <div className="divide-y-2 divide-stone-200 dark:divide-[#1d3323] border-2 border-stone-300 dark:border-[#203726] rounded-xl overflow-hidden shadow-xs">
            {forecast.map((item, idx) => (
              <div
                key={idx}
                className="p-3 flex items-center justify-between text-xs sm:text-sm bg-white dark:bg-[#0e1711] hover:bg-stone-50 dark:hover:bg-[#132218]"
              >
                <div className="flex items-center gap-3 w-32">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{item.day}</span>
                </div>
                <span className="text-stone-600 dark:text-stone-300 flex-1 text-center font-medium">
                  {item.condition}
                </span>
                <div className="flex items-center gap-3 text-right">
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {item.temp}
                  </span>
                  <span className="font-mono text-sky-700 dark:text-sky-300 text-xs font-black w-10">
                    {item.rain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t-2 border-stone-200 dark:border-[#203726] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-black text-xs cursor-pointer shadow-xs"
          >
            {lang === 'ta' ? 'சரி' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
