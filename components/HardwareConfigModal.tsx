'use client';

import React, { useState } from 'react';
import { X, Cpu, Wifi, Check, Copy, AlertCircle, RefreshCw, Power, Radio } from 'lucide-react';
import { Language } from '@/lib/types';
import { HardwareState, mapSoilReadingToPercent, mapRainReading } from '@/lib/firebaseService';
import { generateEsp32Code } from '@/lib/arduinoCodeTemplate';

interface HardwareConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  firebaseUrl: string;
  onSaveFirebaseUrl: (url: string) => void;
  isHardwareMode: boolean;
  onToggleHardwareMode: (enabled: boolean) => void;
  hardwareState: HardwareState | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'demo';
  onTestConnection: () => Promise<void>;
  isTesting: boolean;
}

export default function HardwareConfigModal({
  isOpen,
  onClose,
  lang,
  firebaseUrl,
  onSaveFirebaseUrl,
  isHardwareMode,
  onToggleHardwareMode,
  hardwareState,
  connectionStatus,
  onTestConnection,
  isTesting,
}: HardwareConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'pins' | 'code'>('config');
  const [inputUrl, setInputUrl] = useState(firebaseUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const rulesCode = `{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}`;

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveFirebaseUrl(inputUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const arduinoSketch = generateEsp32Code(inputUrl);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(arduinoSketch);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#111c14] border-2 border-stone-300 dark:border-[#27402d] shadow-2xl p-5 sm:p-6 text-stone-900 dark:text-stone-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-200 dark:border-[#203726] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-xs">
              <Cpu className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl tracking-tight text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                <span>{lang === 'ta' ? 'ESP32 ஹார்டுவேர் & ஃபயர்பேஸ் அமைப்பு' : 'ESP32 Hardware & Firebase Setup'}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isHardwareMode
                      ? connectionStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                        : 'bg-amber-100 text-amber-800 border border-amber-400'
                      : 'bg-slate-200 text-slate-800 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {isHardwareMode
                    ? connectionStatus === 'connected'
                      ? 'Live Hardware'
                      : 'Connecting...'
                    : 'Demo Simulation'}
                </span>
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold">
                {lang === 'ta'
                  ? 'நேரலை IoT சென்சார்கள் (GPIO 34, 35, 32) மற்றும் ரிலேக்கள் (GPIO 25, 26, 27)'
                  : 'Live IoT Sensors (GPIO 34, 35, 32) & Actuators (GPIO 25, 26, 27)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-[#1b2b20] text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-stone-200 dark:bg-[#070e0a] p-1.5 rounded-xl border-2 border-stone-300 dark:border-[#213828] mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-white dark:bg-[#16331d] text-emerald-950 dark:text-emerald-100 border-2 border-emerald-600 dark:border-emerald-500 shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ta' ? 'இணைப்பு & ஃபயர்பேஸ் URL' : 'Connection & Firebase URL'}
          </button>

          <button
            onClick={() => setActiveTab('pins')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'pins'
                ? 'bg-white dark:bg-[#16331d] text-emerald-950 dark:text-emerald-100 border-2 border-emerald-600 dark:border-emerald-500 shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ta' ? 'நேரலை GPIO பின் மானிட்டர்' : 'Live GPIO Pin Monitor'}
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white dark:bg-[#16331d] text-emerald-950 dark:text-emerald-100 border-2 border-emerald-600 dark:border-emerald-500 shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ta' ? 'ESP32 ஆர்ச்சுயினோ குறியீடு' : 'ESP32 Arduino Code'}
          </button>
        </div>

        {/* Tab 1: Configuration & Mode Switch */}
        {activeTab === 'config' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Mode Switch Card */}
            <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#08100a] border-2 border-stone-300 dark:border-[#213828] flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="font-black text-sm text-stone-900 dark:text-white block">
                  {lang === 'ta' ? 'இயக்க முறைமை (System Operating Mode)' : 'System Operating Mode'}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-300 font-semibold block mt-0.5">
                  {isHardwareMode
                    ? lang === 'ta'
                      ? '⚡ நேரலை ESP32 ஹார்டுவேர் மூலம் சென்சார்கள் இயங்குகின்றன'
                      : '⚡ Reading from live ESP32 Firebase database'
                    : lang === 'ta'
                      ? '🎮 செயல்முறை மாதிரி (Demo Simulation) இயங்குகிறது'
                      : '🎮 Running with local interactive farm simulation'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleHardwareMode(false)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                    !isHardwareMode
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white dark:bg-[#121c15] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-[#213828]'
                  }`}
                >
                  Demo Mode
                </button>
                <button
                  onClick={() => onToggleHardwareMode(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                    isHardwareMode
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white dark:bg-[#121c15] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-[#213828]'
                  }`}
                >
                  Live ESP32
                </button>
              </div>
            </div>

            {/* Firebase Database URL Input */}
            <div className="space-y-2 p-4 rounded-xl bg-white dark:bg-[#0e1711] border-2 border-stone-300 dark:border-[#213828]">
              <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                {lang === 'ta' ? 'ஃபயர்பேஸ் ரியல்டைம் டேட்டாபேஸ் URL' : 'Firebase Realtime Database URL'}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://your-project-default-rtdb.firebaseio.com"
                  className="flex-1 px-3.5 py-2 rounded-xl border-2 border-stone-300 dark:border-[#213828] bg-[#f8fafc] dark:bg-[#070e0a] text-stone-900 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  {saveSuccess ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  ) : (
                    'Save URL'
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
                {lang === 'ta'
                  ? 'உங்கள் Firebase Console-ல் Realtime Database உருவாக்கி, அதன் முகவரியை இங்கே உள்ளிடவும். Firebase Rules-ல் read/write: true அமைக்கவும்.'
                  : 'Enter your Firebase Realtime Database URL. Ensure your test rules allow read/write or use the public node.'}
              </p>
            </div>

            {/* Test Connection Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-sky-50 dark:bg-[#071929] border-2 border-sky-400 dark:border-sky-700">
              <div className="flex items-center gap-2.5">
                <Wifi className={`w-5 h-5 ${isHardwareMode && connectionStatus === 'connected' ? 'text-emerald-600 animate-pulse' : 'text-sky-600'}`} />
                <div>
                  <span className="text-xs font-black text-sky-950 dark:text-sky-200 block">
                    {lang === 'ta' ? 'இணைப்பு நிலை ஆய்வு' : 'Hardware Connection Status'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-sky-800 dark:text-sky-300 block">
                    {connectionStatus === 'connected'
                      ? '🟢 Connected & Receiving Telemetry'
                      : connectionStatus === 'connecting'
                      ? '🟡 Checking Firebase endpoint...'
                      : connectionStatus === 'demo'
                      ? '🎮 Running in Demo Mode'
                      : '🔴 Disconnected or Firebase URL unreachable'}
                  </span>
                </div>
              </div>

              <button
                onClick={onTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-black shadow-xs cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testing...' : 'Test Now'}</span>
              </button>
            </div>

            {/* Firebase Security Rules Quick Setup */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-[#1a1508] border-2 border-amber-400 dark:border-amber-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  {lang === 'ta' ? 'Firebase விதிகள் (Security Rules) - அவசியம்' : 'Firebase Rules Setup (Crucial Step)'}
                </span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(rulesCode);
                    setCopiedRules(true);
                    setTimeout(() => setCopiedRules(false), 2500);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1 transition-transform active:scale-95"
                >
                  {copiedRules ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRules ? 'Copied Rules' : 'Copy Rules'}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-900 dark:text-amber-300 font-medium leading-relaxed">
                {lang === 'ta'
                  ? 'உங்கள் Firebase Console -> Realtime Database -> Rules தாவலில் கீழே உள்ள குறியீட்டை இட்டு "Publish" செய்யவும். இல்லையெனில் "Permission denied" பிழை ஏற்படும்.'
                  : 'In Firebase Console -> Realtime Database -> Rules tab, change rules to allow test read/write and click Publish (prevents "Permission denied"): '}
              </p>
              <pre className="p-2.5 rounded-lg bg-amber-100/80 dark:bg-black/50 text-amber-950 dark:text-amber-200 font-mono text-[11px] font-bold border border-amber-300 dark:border-amber-800">
                {rulesCode}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Live GPIO Pin Monitor */}
        {activeTab === 'pins' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#070e0a] border-2 border-stone-300 dark:border-[#213828]">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                {lang === 'ta' ? 'ESP32 அனலாக் சென்சார் உள்ளீடுகள் (Inputs)' : 'ESP32 Analog Inputs (Sensors)'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* SOIL 1 */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#121c15] border-2 border-emerald-500">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 block">
                    GPIO 34 (SOIL1)
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-900 dark:text-white block mt-0.5">
                    {hardwareState?.soil1 !== undefined
                      ? `${mapSoilReadingToPercent(hardwareState.soil1)}%`
                      : '62% (Demo)'}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block">
                    Raw ADC: {hardwareState?.soil1 ?? '1840'}
                  </span>
                </div>

                {/* SOIL 2 */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#121c15] border-2 border-orange-500">
                  <span className="text-[11px] font-mono font-bold text-orange-800 dark:text-orange-400 block">
                    GPIO 35 (SOIL2)
                  </span>
                  <span className="text-xl font-black font-mono text-orange-950 dark:text-white block mt-0.5">
                    {hardwareState?.soil2 !== undefined
                      ? `${mapSoilReadingToPercent(hardwareState.soil2)}%`
                      : '28% (Demo)'}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block">
                    Raw ADC: {hardwareState?.soil2 ?? '3420'}
                  </span>
                </div>

                {/* RAIN */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#121c15] border-2 border-sky-500">
                  <span className="text-[11px] font-mono font-bold text-sky-800 dark:text-sky-400 block">
                    GPIO 32 (RAIN)
                  </span>
                  <span className="text-xl font-black font-mono text-sky-950 dark:text-white block mt-0.5">
                    {hardwareState?.rain !== undefined
                      ? mapRainReading(hardwareState.rain)
                        ? '🌧️ Rain'
                        : '☀️ Dry'
                      : '☀️ Dry'}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block">
                    Raw ADC: {hardwareState?.rain ?? '4095'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actuators / Relays (Active LOW) */}
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#070e0a] border-2 border-stone-300 dark:border-[#213828]">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                {lang === 'ta' ? 'ESP32 ரிலே வெளியீடுகள் (Outputs - Active LOW)' : 'ESP32 Relay Outputs (Active LOW)'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* RELAY 1 */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#121c15] border-2 border-stone-300 dark:border-[#213828]">
                  <span className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 block">
                    GPIO 25 (RELAY1 - Valve A)
                  </span>
                  <span className={`text-base font-black font-mono block mt-1 ${hardwareState?.relay1 ? 'text-emerald-600' : 'text-stone-500'}`}>
                    {hardwareState?.relay1 ? '⚡ LOW (ON / OPEN)' : '⏹️ HIGH (OFF / CLOSED)'}
                  </span>
                </div>

                {/* RELAY 2 */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#121c15] border-2 border-stone-300 dark:border-[#213828]">
                  <span className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 block">
                    GPIO 26 (RELAY2 - Valve B)
                  </span>
                  <span className={`text-base font-black font-mono block mt-1 ${hardwareState?.relay2 ? 'text-emerald-600' : 'text-stone-500'}`}>
                    {hardwareState?.relay2 ? '⚡ LOW (ON / OPEN)' : '⏹️ HIGH (OFF / CLOSED)'}
                  </span>
                </div>

                {/* RELAY 3 */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#121c15] border-2 border-stone-300 dark:border-[#213828]">
                  <span className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 block">
                    GPIO 27 (RELAY3 - Pump)
                  </span>
                  <span className={`text-base font-black font-mono block mt-1 ${hardwareState?.relay3 ? 'text-blue-600' : 'text-stone-500'}`}>
                    {hardwareState?.relay3 ? '⚡ LOW (ON / PUMPING)' : '⏹️ HIGH (OFF / IDLE)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Complete ESP32 Arduino Sketch */}
        {activeTab === 'code' && (
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs text-stone-600 dark:text-stone-300 font-bold">
                {lang === 'ta'
                  ? 'இந்த குறியீட்டை Arduino IDE-ல் ஒட்டி ESP32 பலகையில் பதிவேற்றவும்:'
                  : 'Paste this code into Arduino IDE and flash to your ESP32 board:'}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Sketch'}</span>
              </button>
            </div>

            <div className="flex-1 bg-[#090d0b] text-emerald-400 rounded-xl p-3.5 border-2 border-[#1c2e21] overflow-y-auto font-mono text-xs leading-relaxed select-all">
              <pre>{arduinoSketch}</pre>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t-2 border-stone-200 dark:border-[#203726] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            {isHardwareMode ? 'Hardware Mode Enabled' : 'Demo Simulation Active'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs cursor-pointer shadow-xs"
          >
            {lang === 'ta' ? 'முடிந்தது' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
