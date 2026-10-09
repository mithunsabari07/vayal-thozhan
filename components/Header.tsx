'use client';

import React from 'react';
import { Sprout, Globe, Moon, Sun, SlidersHorizontal, PhoneCall, Cpu } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSimDrawer: () => void;
  onOpenIvrCall: () => void;
  isSimulating: boolean;
  isHardwareMode?: boolean;
  hardwareConnectionStatus?: 'connected' | 'connecting' | 'disconnected' | 'demo';
  onOpenHardwareModal?: () => void;
}

export default function Header({
  lang,
  onToggleLang,
  isDark,
  onToggleTheme,
  activeTab,
  onTabChange,
  onOpenSimDrawer,
  onOpenIvrCall,
  isSimulating,
  isHardwareMode = false,
  hardwareConnectionStatus = 'demo',
  onOpenHardwareModal,
}: HeaderProps) {
  const navItems = [
    { id: 'overview', label: getTranslation(lang, 'nav_overview') },
    { id: 'fields', label: getTranslation(lang, 'nav_fields') },
    { id: 'irrigation', label: getTranslation(lang, 'nav_irrigation') },
    { id: 'telemetry', label: getTranslation(lang, 'nav_telemetry') },
  ];

  return (
    <header className="vayal-card rounded-2xl mb-4 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md sticky top-2 z-40 transition-all border-2 border-stone-300 dark:border-[#27402d] bg-white dark:bg-[#111c14]">
      {/* Brand & Farm Identifier */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onTabChange('overview')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-emerald-500/40 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-emerald-900 dark:text-emerald-300">
                {getTranslation(lang, 'brand_title')}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-[#183420] text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-400 dark:border-emerald-700">
                farm01
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 font-semibold leading-none">
              {lang === 'ta' ? 'நுண்ணறிவு நீர்ப்பாசனம்' : 'Smart Irrigation System'}
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-stone-200 dark:bg-[#08100a] p-1.5 rounded-xl border-2 border-stone-300 dark:border-[#213828]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#16331d] text-emerald-950 dark:text-emerald-100 border-2 border-emerald-600 dark:border-emerald-500 shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Action Controls: Hotline, Simulator, Lang, Theme */}
      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        {/* IVR Quick Launcher */}
        <button
          onClick={onOpenIvrCall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
          title="Interactive IVR Phone Simulator"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono">1800 425 1555</span>
          <span className="sm:hidden">IVR</span>
        </button>

        {/* ESP32 Hardware & Firebase Integration Button */}
        <button
          onClick={onOpenHardwareModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-xs ${
            isHardwareMode
              ? hardwareConnectionStatus === 'connected'
                ? 'bg-emerald-100 dark:bg-[#142e1b] border-emerald-500 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-100 dark:bg-[#271808] border-amber-500 text-amber-950 dark:text-amber-200'
              : 'bg-white dark:bg-[#121c15] border-stone-300 dark:border-[#27402d] text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#18261d]'
          }`}
          title="ESP32 Hardware & Firebase Realtime Database"
        >
          <Cpu className={`w-3.5 h-3.5 ${isHardwareMode && hardwareConnectionStatus === 'connected' ? 'text-emerald-600 animate-pulse' : 'text-stone-600 dark:text-stone-300'}`} />
          <span className="hidden sm:inline">
            {isHardwareMode
              ? hardwareConnectionStatus === 'connected'
                ? 'ESP32 Live'
                : 'Connecting...'
              : 'IoT Setup'}
          </span>
          <span className="sm:hidden">
            {isHardwareMode ? 'ESP32' : 'IoT'}
          </span>
        </button>

        {/* Live Simulation Test Bench Trigger */}
        <button
          onClick={onOpenSimDrawer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-xs ${
            isSimulating
              ? 'bg-amber-100 dark:bg-[#271808] border-amber-500 text-amber-950 dark:text-amber-200'
              : 'bg-white dark:bg-[#121c15] border-stone-300 dark:border-[#27402d] text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#18261d]'
          }`}
          title="Open Simulation Test Bench"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden md:inline">{getTranslation(lang, 'simulation_panel')}</span>
        </button>

        {/* Bilingual Language Switcher */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-300 dark:border-[#27402d] bg-white dark:bg-[#121c15] text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#18261d] text-xs font-black transition-all active:scale-95 shadow-xs cursor-pointer"
          aria-label="Toggle language"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-300 dark:border-[#27402d] bg-white dark:bg-[#121c15] text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#18261d] text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
