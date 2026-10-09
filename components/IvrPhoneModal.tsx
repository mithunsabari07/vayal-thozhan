'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, X, Volume2 } from 'lucide-react';
import { Language, FieldData, TankData } from '@/lib/types';
import { playKeypadBeep, speakText, stopSpeaking } from '@/lib/soundEffects';

interface IvrPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  fieldA: FieldData;
  fieldB: FieldData;
  tank: TankData;
  initialDigit?: string;
  onStartValve: (id: 'field_a' | 'field_b') => void;
  onStopValves: () => void;
}

export default function IvrPhoneModal({
  isOpen,
  onClose,
  lang,
  fieldA,
  fieldB,
  tank,
  initialDigit,
  onStartValve,
  onStopValves,
}: IvrPhoneModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [activeSpeechText, setActiveSpeechText] = useState('');
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Initial welcome message
      const welcomeTa = `வணக்கம் முருகன் அண்ணா! இது வயல் தோழன் தானியங்கி உழவர் உதவி மையம். வயல் B தக்காளிக்கு தண்ணீர் தேவை. பாசன விசை வழிகாட்டி: முழு நிலவரத்திற்கு ஒன்று, பாசனம் தொடங்க இரண்டு, நிறுத்த மூன்று அழுத்தவும்.`;
      const welcomeEn = `Welcome Murugan Anna! This is Vayal Thozhan Automated Farmer Helpline. Field B tomato needs water. Press 1 for full report, 2 to start irrigation, 3 to stop irrigation.`;

      const welcomeText = lang === 'ta' ? welcomeTa : welcomeEn;
      setActiveSpeechText(welcomeText);
      setIsSpeakingVoice(true);
      speakText(welcomeText, lang, () => setIsSpeakingVoice(false));
    } else {
      stopSpeaking();
      setIsSpeakingVoice(false);
    }
    return () => {
      clearInterval(timer);
      stopSpeaking();
    };
  }, [isOpen, lang]);

  // Handle initial digit if provided
  useEffect(() => {
    if (isOpen && initialDigit) {
      handleKeyPress(initialDigit);
    }
  }, [isOpen, initialDigit]);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    playKeypadBeep(digit);
    setDialedDigits((prev) => (prev + digit).slice(-6));

    let responseText = '';
    if (digit === '1') {
      responseText =
        lang === 'ta'
          ? `வயல் நிலவரம்: வயல் A சம்பா நெல் ஈரப்பதம் ${fieldA.moisture} சதவீதம், நன்று. வயல் B தக்காளி ஈரப்பதம் ${fieldB.moisture} சதவீதம். மேல்நிலை தொட்டி நீர் ${tank.currentLiters} லிட்டர்.`
          : `Field report: Field A paddy moisture is ${fieldA.moisture} percent, optimal. Field B tomato moisture is ${fieldB.moisture} percent, needs water. Water tank has ${tank.currentLiters} litres.`;
    } else if (digit === '2') {
      onStartValve('field_a');
      responseText =
        lang === 'ta'
          ? `கட்டளை ஏற்கப்பட்டது! வயல் A பாசனம் தொடங்கப்பட்டது. வால்வு A திறக்கப்பட்டுள்ளது.`
          : `Command accepted! Starting irrigation for Field A. Valve A opened.`;
    } else if (digit === '3') {
      onStopValves();
      responseText =
        lang === 'ta'
          ? `கட்டளை ஏற்கப்பட்டது! அனைத்து பாசன வால்வுகளும் நிறுத்தப்பட்டன.`
          : `Command accepted! All irrigation valves have been closed.`;
    } else if (digit === '4') {
      responseText =
        lang === 'ta'
          ? `மீண்டும் ஒலிக்கிறது: வயல் A ஈரம் ${fieldA.moisture} சதவீதம், வயல் B ஈரம் ${fieldB.moisture} சதவீதம்.`
          : `Repeating report: Field A moisture ${fieldA.moisture} percent, Field B moisture ${fieldB.moisture} percent.`;
    } else {
      responseText =
        lang === 'ta'
          ? `விசை ${digit} அழுத்தப்பட்டது. செல்லுபடியாகும் விசை: 1, 2, 3 அல்லது 4.`
          : `Key ${digit} pressed. Valid keys: 1, 2, 3 or 4.`;
    }

    setActiveSpeechText(responseText);
    setIsSpeakingVoice(true);
    speakText(responseText, lang, () => setIsSpeakingVoice(false));
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-[32px] bg-[#0c120e] border-4 border-emerald-600 shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Phone Notch & Close button */}
        <div className="p-4 bg-[#070b08] flex items-center justify-between border-b-2 border-[#1c2e21]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-black text-emerald-400">
              HD Voice Call (VoLTE)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-[#1a2b1f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call In-Progress Screen */}
        <div className="p-6 text-center space-y-3 bg-[#0c120e] flex-1">
          <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-500/40">
            <Phone className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-black text-xl tracking-tight">
              1800 425 1555
            </h3>
            <p className="text-xs text-stone-300 font-semibold">
              {lang === 'ta' ? 'வயல் தோழன் உழவர் உதவி மையம்' : 'Vayal Thozhan Automated IVR'}
            </p>
            <span className="text-xs font-mono text-emerald-400 font-black block mt-1">
              {formatTimer(callDuration)}
            </span>
          </div>

          {/* Interactive Speech Transcript Box (100% Solid) */}
          <div className="min-h-[70px] p-3 rounded-2xl bg-[#16231a] border-2 border-[#243c2b] text-xs text-stone-200 leading-relaxed text-left flex items-start gap-2.5 shadow-inner">
            <div className="mt-0.5 shrink-0">
              {isSpeakingVoice ? (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Mic className="w-4 h-4 text-stone-400" />
              )}
            </div>
            <p className="flex-1 font-medium italic">
              &quot;{activeSpeechText || (lang === 'ta' ? 'இணைக்கப்பட்டுள்ளது...' : 'Connected...')}&quot;
            </p>
          </div>

          {/* Dialed Display */}
          {dialedDigits && (
            <div className="text-xs font-mono text-stone-300">
              Keypad Input: <span className="text-emerald-400 font-black tracking-widest">{dialedDigits}</span>
            </div>
          )}

          {/* Realistic 3x4 Touch Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {keypadKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="h-12 rounded-2xl bg-[#18261d] hover:bg-[#203628] active:bg-emerald-700 active:text-white border-2 border-[#2d4634] hover:border-emerald-500 font-mono font-black text-base transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer shadow-xs"
              >
                <span>{key}</span>
                {key === '1' && <span className="text-[8px] text-stone-300 font-sans font-bold">Report</span>}
                {key === '2' && <span className="text-[8px] text-emerald-300 font-sans font-bold">Water ON</span>}
                {key === '3' && <span className="text-[8px] text-orange-300 font-sans font-bold">Water OFF</span>}
                {key === '4' && <span className="text-[8px] text-stone-300 font-sans font-bold">Repeat</span>}
              </button>
            ))}
          </div>

          {/* End Call Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>{lang === 'ta' ? 'அழைப்பை துண்டி' : 'Hang Up Call'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
