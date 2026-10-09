'use client';

import React from 'react';
import { X, CloudSun, AlertTriangle, Droplets, ShieldAlert, Cpu, Radio, WifiOff } from 'lucide-react';
import { Language, FieldData, TankData, WeatherData } from '@/lib/types';
import { getTranslation } from '@/lib/translations';

interface AlertBannersProps {
  lang: Language;
  fields: {
    fieldA: FieldData;
    fieldB: FieldData;
  };
  tank: TankData;
  weather: WeatherData;
  isDryAlertDismissed: boolean;
  onDismissDryAlert: () => void;
  onQuickRefill: () => void;
  isHardwareMode?: boolean;
  hardwareConnectionStatus?: 'connected' | 'connecting' | 'disconnected' | 'demo';
  onSwitchToDemo?: () => void;
  onOpenHardwareModal?: () => void;
}

export default function AlertBanners({
  lang,
  fields,
  tank,
  weather,
  isDryAlertDismissed,
  onDismissDryAlert,
  onQuickRefill,
  isHardwareMode = false,
  hardwareConnectionStatus = 'demo',
  onSwitchToDemo,
  onOpenHardwareModal,
}: AlertBannersProps) {
  const isFieldBDry = fields.fieldB.moisture < fields.fieldB.targetStart;
  const isTankLow = tank.currentLiters <= tank.dryRunCutoffLiters;
  const isRaining = weather.condition === 'rainy' || fields.fieldA.rainSensor === 'wet' || fields.fieldB.rainSensor === 'wet';

  return (
    <section className="space-y-2.5">
      {/* HARDWARE STATUS NOTIFICATION BANNER */}
      {isHardwareMode && (
        <div
          className={`rounded-2xl p-3.5 border-2 flex items-center justify-between text-xs sm:text-sm shadow-md transition-all ${
            hardwareConnectionStatus === 'connected'
              ? 'bg-[#edf7ed] dark:bg-[#0d2214] border-emerald-500 text-emerald-950 dark:text-emerald-100'
              : hardwareConnectionStatus === 'connecting'
              ? 'bg-amber-50 dark:bg-[#251808] border-amber-500 text-amber-950 dark:text-amber-100'
              : 'bg-rose-50 dark:bg-[#280a0e] border-rose-500 text-rose-950 dark:text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {hardwareConnectionStatus === 'connected' ? (
              <Radio className="w-5 h-5 text-emerald-600 animate-pulse shrink-0" />
            ) : hardwareConnectionStatus === 'connecting' ? (
              <Cpu className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
            ) : (
              <WifiOff className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="font-black">
                {hardwareConnectionStatus === 'connected'
                  ? lang === 'ta'
                    ? '⚡ ESP32 ஹார்டுவேர் நேரலை (Firebase RTDB இணைக்கப்பட்டுள்ளது)'
                    : '⚡ ESP32 Hardware Active (Firebase Realtime Database Linked)'
                  : hardwareConnectionStatus === 'connecting'
                  ? lang === 'ta'
                    ? '🔄 ஃபயர்பேஸ் இணைப்பை சோதிக்கிறது...'
                    : '🔄 Connecting to Firebase Realtime Database endpoint...'
                  : lang === 'ta'
                    ? '⚠️ ESP32 பலகை ஆஃப்லைனில் உள்ளது / ஃபயர்பேஸ் URL அடைய முடியவில்லை'
                    : '⚠️ ESP32 Board Offline or Firebase URL Unreachable'}
              </span>
              <p className="text-[11px] font-medium opacity-90">
                {hardwareConnectionStatus === 'connected'
                  ? 'GPIO 34 (Field A) · GPIO 35 (Field B) · GPIO 32 (Rain) · Relays Active LOW'
                  : lang === 'ta'
                  ? 'ஹார்டுவேர் கிடைக்காதபோது டெமோ சிமுலேஷனை பயன்படுத்தலாம்.'
                  : 'Prototype not connected? You can use Demo Simulation anytime.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {onOpenHardwareModal && (
              <button
                onClick={onOpenHardwareModal}
                className="px-3 py-1.5 rounded-xl border-2 border-current font-black text-xs cursor-pointer hover:opacity-80 transition-opacity"
              >
                {lang === 'ta' ? 'அமைப்பு' : 'Pins & Setup'}
              </button>
            )}
            {onSwitchToDemo && (
              <button
                onClick={onSwitchToDemo}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
              >
                {lang === 'ta' ? 'டெமோவுக்கு மாறு' : 'Switch to Demo'}
              </button>
            )}
          </div>
        </div>
      )}
      {/* DRY ALERT (Field B) */}
      {isFieldBDry && !isDryAlertDismissed && (
        <div className="pulse-dry rounded-2xl p-4 border-2 border-rose-600 dark:border-rose-500 bg-rose-100 dark:bg-[#20080c] text-rose-950 dark:text-rose-100 flex items-center justify-between transition-all shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-200 dark:bg-rose-900 border-2 border-rose-400 dark:border-rose-700 flex items-center justify-center text-xl shrink-0 shadow-xs">
              🥀
            </div>
            <div>
              <div className="font-extrabold flex items-center gap-2 text-sm sm:text-base">
                <span>
                  {getTranslation(lang, 'dry_alert_title')} ({fields.fieldB.moisture}%)
                </span>
                <span className="text-[11px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse shadow-xs">
                  {getTranslation(lang, 'dry_alert_badge')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-semibold mt-0.5">
                {getTranslation(lang, 'dry_alert_desc')}
              </p>
            </div>
          </div>
          <button
            onClick={onDismissDryAlert}
            className="text-rose-800 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-900 p-2 rounded-xl transition-colors cursor-pointer"
            title={getTranslation(lang, 'dismiss')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RAIN DETECTION ALERT (If Rain triggers) */}
      {isRaining ? (
        <div className="rounded-2xl p-3.5 border-2 border-sky-600 dark:border-sky-500 bg-sky-100 dark:bg-[#071b2b] text-sky-950 dark:text-sky-100 flex items-center justify-between text-xs sm:text-sm shadow-md animate-pulse">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-5 h-5 text-sky-700 dark:text-sky-300 shrink-0" />
            <span className="font-bold">
              {lang === 'ta'
                ? '🌧️ மழை கண்டறியப்பட்டது! வயல்களில் நீர் விரயமாவதை தடுக்க வால்வுகள் தானாக நிறுத்தப்பட்டன.'
                : '🌧️ Rain detected by sensors! Automated irrigation has been paused to conserve water.'}
            </span>
          </div>
          <span className="font-black text-sky-900 dark:text-sky-200 text-xs uppercase tracking-wider shrink-0 ml-2 px-2.5 py-1 rounded-lg bg-sky-200 dark:bg-sky-800 border-2 border-sky-400 dark:border-sky-600">
            Rain Sensor ON
          </span>
        </div>
      ) : (
        /* STANDARD WEATHER RADAR (Clear) - 100% Solid Crisp Canvas */
        <div className="rounded-2xl p-3.5 border-2 border-sky-300 dark:border-sky-800 bg-[#eef7fd] dark:bg-[#071520] text-sky-950 dark:text-sky-100 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-xs">
          <div className="flex items-center gap-2.5">
            <CloudSun className="w-5 h-5 text-sky-700 dark:text-sky-400 shrink-0" />
            <span>{getTranslation(lang, 'rain_alert_msg')}</span>
          </div>
          <span className="font-black text-sky-900 dark:text-sky-200 text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-sky-200 dark:bg-sky-900 border border-sky-400 dark:border-sky-700">
            {getTranslation(lang, 'radar_ok')}
          </span>
        </div>
      )}

      {/* LOW WATER TANK CRITICAL ALERT */}
      {isTankLow && (
        <div className="rounded-2xl p-3.5 border-2 border-amber-600 dark:border-amber-500 bg-amber-100 dark:bg-[#241606] text-amber-950 dark:text-amber-100 flex items-center justify-between text-xs sm:text-sm shadow-md">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-black">
                {lang === 'ta'
                  ? 'தொட்டி நீர்மட்டம் ஆபத்து (200L கீழ்) - மோட்டார் பாதுகாப்பு இயங்குகிறது'
                  : 'Water Tank Low (< 200L) - Dry-run cutoff activated'}
              </span>
              <p className="text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                {lang === 'ta'
                  ? 'போர்வெல் பம்ப் மோட்டாரை இயக்கி மேல்நிலை தொட்டியை நிரப்பவும்.'
                  : 'Start borehole refill to prevent irrigation pipeline air-lock.'}
              </p>
            </div>
          </div>
          <button
            onClick={onQuickRefill}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer shrink-0 ml-2"
          >
            {lang === 'ta' ? 'உடனே நிரப்பு' : 'Refill Now'}
          </button>
        </div>
      )}
    </section>
  );
}
