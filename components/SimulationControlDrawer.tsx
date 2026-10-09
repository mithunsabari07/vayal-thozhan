'use client';

import React from 'react';
import { Play, Pause, Flame, CloudRain, RotateCcw, X, SlidersHorizontal, Droplet, ShieldAlert } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface SimulationControlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isSimulating: boolean;
  onToggleSimulating: () => void;
  simSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onTriggerHeatwave: () => void;
  onTriggerRain: () => void;
  onTriggerLowTank: () => void;
  onRefillTank: () => void;
  onResetDefaults: () => void;
  onOpenHardware?: () => void;
  isHardwareMode?: boolean;
}

export default function SimulationControlDrawer({
  isOpen,
  onClose,
  lang,
  isSimulating,
  onToggleSimulating,
  simSpeed,
  onChangeSpeed,
  onTriggerHeatwave,
  onTriggerRain,
  onTriggerLowTank,
  onRefillTank,
  onResetDefaults,
  onOpenHardware,
  isHardwareMode = false,
}: SimulationControlDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto rounded-2xl bg-[#0e1611] text-white border-2 border-emerald-500 p-4 sm:p-5 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b-2 border-[#203726] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-sm sm:text-base">
              {getTranslation(lang, 'sim_title')}
            </h3>
            <span className="text-[10px] bg-[#16331d] text-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-600">
              Dev &amp; Testing Playground
            </span>
            {onOpenHardware && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHardware();
                }}
                className="text-[10px] bg-amber-950 text-amber-300 hover:bg-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-600 cursor-pointer transition-colors"
              >
                {isHardwareMode ? '⚡ ESP32 Active' : '⚡ Connect ESP32 Hardware'}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1a2b20] text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Control toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Play / Pause & Speed */}
          <div className="p-3 rounded-xl bg-[#16241a] border-2 border-[#263e2d] space-y-2">
            <span className="text-xs text-stone-300 font-bold block">
              Simulation Clock:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleSimulating}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isSimulating
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </>
                )}
              </button>

              <div className="flex items-center bg-[#0d1610] rounded-lg p-0.5 border border-[#2b4433] text-xs font-mono">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onChangeSpeed(spd)}
                    className={`px-2 py-1 rounded font-black cursor-pointer transition-colors ${
                      simSpeed === spd
                        ? 'bg-emerald-600 text-white'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Drought / Heatwave */}
          <div className="p-3 rounded-xl bg-[#16241a] border-2 border-[#263e2d] space-y-2">
            <span className="text-xs text-stone-300 font-bold block">
              Soil Stress Scenario:
            </span>
            <button
              onClick={onTriggerHeatwave}
              className="w-full py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Flame className="w-3.5 h-3.5 text-amber-200" />
              <span>{getTranslation(lang, 'sim_heatwave')}</span>
            </button>
          </div>

          {/* 3. Rain Storm & Tank Cutoff */}
          <div className="p-3 rounded-xl bg-[#16241a] border-2 border-[#263e2d] space-y-2">
            <span className="text-xs text-stone-300 font-bold block">
              Weather &amp; Safety:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={onTriggerRain}
                className="py-1.5 px-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all truncate"
                title="Trigger simulated rainfall"
              >
                <CloudRain className="w-3 h-3 text-sky-200" />
                <span>Rain Test</span>
              </button>

              <button
                onClick={onTriggerLowTank}
                className="py-1.5 px-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all truncate"
                title="Trigger low tank level"
              >
                <ShieldAlert className="w-3 h-3 text-rose-200" />
                <span>Low Tank</span>
              </button>
            </div>
          </div>

          {/* 4. Refill Tank & Reset */}
          <div className="p-3 rounded-xl bg-[#16241a] border-2 border-[#263e2d] space-y-2">
            <span className="text-xs text-stone-300 font-bold block">
              System State:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={onRefillTank}
                className="py-1.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all truncate"
              >
                <Droplet className="w-3 h-3" />
                <span>{getTranslation(lang, 'sim_refill_well')}</span>
              </button>

              <button
                onClick={onResetDefaults}
                className="py-1.5 px-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all truncate"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{getTranslation(lang, 'sim_reset')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
