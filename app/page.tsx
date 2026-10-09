'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import AlertBanners from '@/components/AlertBanners';
import StatCards from '@/components/StatCards';
import FieldViewSchematic from '@/components/FieldViewSchematic';
import FieldCards from '@/components/FieldCards';
import WaterTankCard from '@/components/WaterTankCard';
import TelemetryCharts from '@/components/TelemetryCharts';
import ActivityTimeline from '@/components/ActivityTimeline';
import PhoneHotlineCard from '@/components/PhoneHotlineCard';
import Footer from '@/components/Footer';
import IvrPhoneModal from '@/components/IvrPhoneModal';
import SimulationControlDrawer from '@/components/SimulationControlDrawer';
import GuideModal from '@/components/GuideModal';
import WeatherModal from '@/components/WeatherModal';
import HardwareConfigModal from '@/components/HardwareConfigModal';

import {
  HardwareState,
  getStoredFirebaseUrl,
  saveFirebaseUrl,
  fetchHardwareData,
  subscribeToHardwareData,
  updateFirebaseRelay,
  mapSoilReadingToPercent,
  mapRainReading,
} from '@/lib/firebaseService';

import {
  Language,
  SystemMode,
  FieldData,
  TankData,
  WeatherData,
  ActivityLogItem,
} from '@/lib/types';
import { playWaterValveSound, speakText, stopSpeaking } from '@/lib/soundEffects';

export default function VayalThozhanDashboard() {
  // Theme & Language
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<Language>('ta');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Interactive Modals & Drawers
  const [isIvrModalOpen, setIsIvrModalOpen] = useState(false);
  const [ivrInitialDigit, setIvrInitialDigit] = useState<string | undefined>(undefined);
  const [isSimDrawerOpen, setIsSimDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // ESP32 Hardware Integration & Firebase State
  const [isHardwareMode, setIsHardwareMode] = useState(false);
  const [firebaseUrl, setFirebaseUrl] = useState('https://vayal-thozhan-default-rtdb.firebaseio.com');
  const [hardwareState, setHardwareState] = useState<HardwareState | null>(null);
  const [hardwareConnectionStatus, setHardwareConnectionStatus] = useState<
    'connected' | 'connecting' | 'disconnected' | 'demo'
  >('demo');
  const [isTestingHardware, setIsTestingHardware] = useState(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dry Alert Dismissal State
  const [isDryAlertDismissed, setIsDryAlertDismissed] = useState(false);

  // System Automation Mode
  const [systemMode, setSystemMode] = useState<SystemMode>('auto');

  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [isTankRefilling, setIsTankRefilling] = useState(false);

  // Timestamp format
  const [currentTimeString, setCurrentTimeString] = useState('02:30 PM');

  // Field Data
  const [fieldA, setFieldA] = useState<FieldData>({
    id: 'field_a',
    letter: 'A',
    nameEn: 'Field A',
    nameTa: 'வயல் A',
    cropEn: 'Samba Paddy',
    cropTa: 'சம்பா நெல்',
    cropEmoji: '🌾',
    soilTypeEn: 'Clay Loam Soil',
    soilTypeTa: 'வண்டல் மண்',
    moisture: 62,
    targetStart: 40,
    targetStop: 70,
    valveStatus: 'closed',
    valveTimeRemainingSeconds: 0,
    durationMinutes: 10,
    temperature: 31,
    humidity: 64,
    rainSensor: 'dry',
    flowRateLpm: 0,
    primaryColor: '#2e7d32',
    accentBg: '#e6f3e7',
    status: 'good',
  });

  const [fieldB, setFieldB] = useState<FieldData>({
    id: 'field_b',
    letter: 'B',
    nameEn: 'Field B',
    nameTa: 'வயல் B',
    cropEn: 'Native Tomato',
    cropTa: 'நாட்டு தக்காளி',
    cropEmoji: '🍅',
    soilTypeEn: 'Red Sand Soil',
    soilTypeTa: 'செம்மண்',
    moisture: 28,
    targetStart: 40,
    targetStop: 70,
    valveStatus: 'open',
    valveTimeRemainingSeconds: 480, // 8 minutes left
    durationMinutes: 10,
    temperature: 34,
    humidity: 55,
    rainSensor: 'dry',
    flowRateLpm: 18,
    primaryColor: '#e65100',
    accentBg: '#fdebdc',
    status: 'dry',
  });

  // Water Tank
  const [tank, setTank] = useState<TankData>({
    currentLiters: 720,
    capacityLiters: 1000,
    pumpStatus: 'running_feed',
    dryRunCutoffLiters: 200,
    boreholeWaterLevelPercent: 88,
    voltage: 415,
  });

  // Weather state
  const [weather, setWeather] = useState<WeatherData>({
    condition: 'sunny',
    tempCelsius: 34,
    humidityPercent: 58,
    radarStatusEn: 'Radar OK: Clear skies',
    radarStatusTa: 'வானிலை ரேடார்: தெளிவான வானம்',
    locationEn: 'Thanjavur District',
    locationTa: 'தஞ்சாவூர் மாவட்டம்',
    forecast6hEn: 'No rain forecast in Thanjavur district for next 6 hours',
    forecast6hTa: 'அடுத்த 6 மணி நேரத்திற்கு தஞ்சாவூரில் மழை இல்லை',
  });

  // Recent Activity Timeline logs
  const [logs, setLogs] = useState<ActivityLogItem[]>([
    {
      id: 'log-1',
      time: '02:28 PM',
      timestamp: 1728484080000,
      category: 'valve',
      color: '#e65100',
      emoji: '🟠',
      titleEn: 'Field B soil reached 28% (Dry)',
      titleTa: 'வயல் B மண் 28% (வறட்சி) எட்டியது',
      descEn: 'Valve B auto-started. Water flow: 18 Litres/min.',
      descTa: 'தானியங்கி வால்வு B இயக்கப்பட்டது. நீர் ஓட்டம்: 18 லி/நிமி.',
    },
    {
      id: 'log-2',
      time: '01:55 PM',
      timestamp: 1728482100000,
      category: 'weather',
      color: '#0284c7',
      emoji: '🔵',
      titleEn: 'Weather sensor check: Rain cleared',
      titleTa: 'வானிலை சென்சார் ஆய்வு: மழை நின்றது',
      descEn: 'Atmospheric pressure steady at 1012 hPa. Irrigation cycle resumed.',
      descTa: 'வளிமண்டல அழுத்தம் 1012 hPa சீரானது. பாசன சுழற்சி தொடர்ந்தது.',
    },
    {
      id: 'log-3',
      time: '01:40 PM',
      timestamp: 1728481200000,
      category: 'valve',
      color: '#2e7d32',
      emoji: '🟢',
      titleEn: 'Field A reached target 62%',
      titleTa: 'வயல் A இலக்கு 62% எட்டியது',
      descEn: 'Valve A closed automatically after delivering 450 Litres.',
      descTa: '450 லிட்டர் நீர் பாய்ச்சிய பின் வால்வு A தானாக மூடப்பட்டது.',
    },
    {
      id: 'log-4',
      time: '11:15 AM',
      timestamp: 1728472500000,
      category: 'tank',
      color: '#71717a',
      emoji: '💧',
      titleEn: 'Overhead tank auto-filled to 750 L',
      titleTa: 'மேல்நிலை தொட்டி 750 லிட்டராக நிரம்பியது',
      descEn: 'Solar borehole pump shut off on full float switch.',
      descTa: 'சோலார் போர்வெல் பம்ப் மிதவை சுவிட்ச் மூலம் தானாக நின்றது.',
    },
  ]);

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  // Keep live clock updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTimeString(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load saved Firebase URL from localStorage on mount
  useEffect(() => {
    setFirebaseUrl(getStoredFirebaseUrl());
  }, []);

  // Live ESP32 Hardware Polling Effect (Firebase Realtime Database)
  useEffect(() => {
    if (!isHardwareMode) {
      setHardwareConnectionStatus('demo');
      return;
    }

    setHardwareConnectionStatus('connecting');
    let isCancelled = false;

    const pollHardware = async () => {
      const data = await fetchHardwareData(firebaseUrl);
      if (isCancelled) return;

      if (data) {
        setHardwareState(data);
        setHardwareConnectionStatus('connected');

        // Map soil1 (GPIO 34) -> Field A
        if (data.soil1 !== undefined) {
          const moistA = mapSoilReadingToPercent(data.soil1);
          setFieldA((prev) => ({
            ...prev,
            moisture: moistA,
            status: moistA < prev.targetStart ? 'dry' : 'good',
          }));
        }

        // Map soil2 (GPIO 35) -> Field B
        if (data.soil2 !== undefined) {
          const moistB = mapSoilReadingToPercent(data.soil2);
          setFieldB((prev) => ({
            ...prev,
            moisture: moistB,
            status: moistB < prev.targetStart ? 'dry' : 'good',
          }));
          if (moistB < fieldB.targetStart) {
            setIsDryAlertDismissed(false);
          }
        }

        // Map rain (GPIO 32) -> Rain sensor
        if (data.rain !== undefined) {
          const raining = mapRainReading(data.rain);
          setWeather((prev) => ({
            ...prev,
            condition: raining ? 'rainy' : 'sunny',
          }));
          setFieldA((prev) => ({ ...prev, rainSensor: raining ? 'wet' : 'dry' }));
          setFieldB((prev) => ({ ...prev, rainSensor: raining ? 'wet' : 'dry' }));
        }

        // Map relay1 (GPIO 25 - Active LOW) -> Field A Valve
        if (data.relay1 !== undefined) {
          setFieldA((prev) => ({
            ...prev,
            valveStatus: data.relay1 ? 'open' : 'closed',
            flowRateLpm: data.relay1 ? 18 : 0,
          }));
        }

        // Map relay2 (GPIO 26 - Active LOW) -> Field B Valve
        if (data.relay2 !== undefined) {
          setFieldB((prev) => ({
            ...prev,
            valveStatus: data.relay2 ? 'open' : 'closed',
            flowRateLpm: data.relay2 ? 18 : 0,
          }));
        }

        // Map relay3 (GPIO 27 - Active LOW) -> Tank Refill Pump
        if (data.relay3 !== undefined) {
          setIsTankRefilling(data.relay3);
          setTank((prev) => ({
            ...prev,
            pumpStatus: data.relay3 ? 'refilling' : 'idle',
          }));
        }
      } else {
        setHardwareConnectionStatus('disconnected');
      }
    };

    pollHardware();
    const interval = setInterval(pollHardware, 2000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [isHardwareMode, firebaseUrl, fieldB.targetStart]);

  // Test Firebase Connection Handler
  const handleTestConnection = async () => {
    setIsTestingHardware(true);
    const data = await fetchHardwareData(firebaseUrl);
    setIsTestingHardware(false);
    if (data) {
      setHardwareState(data);
      setHardwareConnectionStatus('connected');
      addLog(
        'ESP32 Node Connected',
        'ESP32 ஹார்டுவேர் இணைக்கப்பட்டது',
        `Firebase RTDB link verified. Sensor reading: SOIL1: ${data.soil1}, SOIL2: ${data.soil2}, RAIN: ${data.rain}.`,
        `ஃபயர்பேஸ் இணைப்பு சரிபார்க்கப்பட்டது. சென்சார் தரவுகள் வெற்றிகரமாக பெறப்படுகின்றன.`,
        '#15803d',
        '⚡',
        'valve'
      );
    } else {
      setHardwareConnectionStatus('disconnected');
    }
  };

  // Helper to add activity log
  const addLog = (
    titleEn: string,
    titleTa: string,
    descEn: string,
    descTa: string,
    color: string,
    emoji: string,
    category: ActivityLogItem['category'] = 'valve'
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}-${Math.random()}`,
      time: timeStr,
      timestamp: Date.now(),
      category,
      color,
      emoji,
      titleEn,
      titleTa,
      descEn,
      descTa,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // Toggle Valve logic
  const handleToggleValve = (fieldId: 'field_a' | 'field_b') => {
    if (fieldId === 'field_a') {
      const willOpen = fieldA.valveStatus === 'closed';
      playWaterValveSound(willOpen);
      setFieldA((prev) => ({
        ...prev,
        valveStatus: willOpen ? 'open' : 'closed',
        valveTimeRemainingSeconds: willOpen ? prev.durationMinutes * 60 : 0,
        flowRateLpm: willOpen ? 18 : 0,
      }));

      // In Hardware Mode: Send Relay 1 command to Firebase (ESP32 GPIO 25)
      if (isHardwareMode) {
        updateFirebaseRelay(firebaseUrl, { relay1: willOpen });
      }

      if (willOpen) {
        addLog(
          'Valve A opened' + (isHardwareMode ? ' (Relay 1 ON)' : ' manually'),
          'வால்வு A திறக்கப்பட்டது' + (isHardwareMode ? ' (ரிலே 1 இயங்கியது)' : ''),
          `Irrigation running for Field A (duration: ${fieldA.durationMinutes} min).`,
          `வயல் A சம்பா நெல்லுக்கு நீர் பாய்ச்சப்படுகிறது (${fieldA.durationMinutes} நிமிடம்).`,
          '#2e7d32',
          '🟢'
        );
      } else {
        addLog(
          'Valve A stopped' + (isHardwareMode ? ' (Relay 1 OFF)' : ' manually'),
          'வால்வு A நிறுத்தப்பட்டது' + (isHardwareMode ? ' (ரிலே 1 நின்றது)' : ''),
          'Field A irrigation paused.',
          'வயல் A பாசனம் நிறுத்தப்பட்டது.',
          '#71717a',
          '⏹️'
        );
      }
    } else {
      const willOpen = fieldB.valveStatus === 'closed';
      playWaterValveSound(willOpen);
      setFieldB((prev) => ({
        ...prev,
        valveStatus: willOpen ? 'open' : 'closed',
        valveTimeRemainingSeconds: willOpen ? prev.durationMinutes * 60 : 0,
        flowRateLpm: willOpen ? 18 : 0,
      }));

      // In Hardware Mode: Send Relay 2 command to Firebase (ESP32 GPIO 26)
      if (isHardwareMode) {
        updateFirebaseRelay(firebaseUrl, { relay2: willOpen });
      }

      if (willOpen) {
        addLog(
          'Valve B opened' + (isHardwareMode ? ' (Relay 2 ON)' : ''),
          'வால்வு B இயக்கப்பட்டது' + (isHardwareMode ? ' (ரிலே 2 இயங்கியது)' : ''),
          `Irrigation active for Field B Tomato (${fieldB.durationMinutes} min).`,
          `வயல் B தக்காளிக்கு நீர் பாய்கிறது (${fieldB.durationMinutes} நிமி).`,
          '#e65100',
          '🟠'
        );
      } else {
        addLog(
          'Valve B stopped' + (isHardwareMode ? ' (Relay 2 OFF)' : ''),
          'வால்வு B நிறுத்தப்பட்டது' + (isHardwareMode ? ' (ரிலே 2 நின்றது)' : ''),
          'Irrigation for Field B paused.',
          'வயல் B பாசனம் நிறுத்தப்பட்டது.',
          '#71717a',
          '⏹️'
        );
      }
    }
  };

  // Duration select
  const handleChangeDuration = (fieldId: 'field_a' | 'field_b', minutes: number) => {
    if (fieldId === 'field_a') {
      setFieldA((prev) => ({
        ...prev,
        durationMinutes: minutes,
        valveTimeRemainingSeconds: prev.valveStatus === 'open' ? minutes * 60 : 0,
      }));
    } else {
      setFieldB((prev) => ({
        ...prev,
        durationMinutes: minutes,
        valveTimeRemainingSeconds: prev.valveStatus === 'open' ? minutes * 60 : 0,
      }));
    }
  };

  // Refill Overhead Tank
  const handleRefillTank = () => {
    if (isTankRefilling) return;
    setIsTankRefilling(true);

    // In Hardware Mode: Send Relay 3 command to Firebase (ESP32 GPIO 27)
    if (isHardwareMode) {
      updateFirebaseRelay(firebaseUrl, { relay3: true });
    }

    addLog(
      'Borehole motor refill started' + (isHardwareMode ? ' (Relay 3 ON)' : ''),
      'போர்வெல் பம்ப் மோட்டார் இயக்கப்பட்டது' + (isHardwareMode ? ' (ரிலே 3 இயங்கியது)' : ''),
      'Water pumping from borehole to overhead reservoir tank at 40 L/min.',
      'போர்வெல்லிலிருந்து மேல்நிலை தொட்டிக்கு 40 லி/நிமி வேகத்தில் நீர் நிறைகிறது.',
      '#0284c7',
      '⚡',
      'tank'
    );
  };

  // Stop All Valves (Emergency or IVR command)
  const handleStopAllValves = () => {
    playWaterValveSound(false);
    setFieldA((prev) => ({ ...prev, valveStatus: 'closed', valveTimeRemainingSeconds: 0 }));
    setFieldB((prev) => ({ ...prev, valveStatus: 'closed', valveTimeRemainingSeconds: 0 }));

    // In Hardware Mode: Shut off all relays in Firebase
    if (isHardwareMode) {
      updateFirebaseRelay(firebaseUrl, { relay1: false, relay2: false, relay3: false });
    }

    addLog(
      'All valves halted' + (isHardwareMode ? ' (All Relays OFF)' : ' via hotline'),
      'அனைத்து வால்வுகளும் நிறுத்தப்பட்டன' + (isHardwareMode ? ' (அனைத்து ரிலேக்களும் நின்றன)' : ''),
      'Emergency stop signal processed.',
      'பாசனம் உடனடியாக நிறுத்தப்பட்டது.',
      '#ef4444',
      '🛑'
    );
  };

  // Simulation Loop Engine (Runs in Demo Mode)
  useEffect(() => {
    if (!isSimulating || isHardwareMode) return;

    const intervalMs = Math.max(200, Math.floor(1000 / simSpeed));
    const timer = setInterval(() => {
      // 1. Tank Refill Simulation
      if (isTankRefilling) {
        setTank((prev) => {
          const next = prev.currentLiters + 15;
          if (next >= prev.capacityLiters) {
            setIsTankRefilling(false);
            addLog(
              'Overhead tank reached full 1000 L',
              'மேல்நிலை தொட்டி முழு கொள்ளளவை (1000L) எட்டியது',
              'Borehole pump shut off automatically via float sensor.',
              'மிதவை சென்சார் மூலம் போர்வெல் மோட்டார் தானாக நின்றது.',
              '#0284c7',
              '💧',
              'tank'
            );
            return { ...prev, currentLiters: prev.capacityLiters, pumpStatus: 'idle' };
          }
          return { ...prev, currentLiters: next, pumpStatus: 'refilling' };
        });
      }

      // Check Low Water Tank Protection
      if (tank.currentLiters <= tank.dryRunCutoffLiters) {
        if (fieldA.valveStatus === 'open' || fieldB.valveStatus === 'open') {
          handleStopAllValves();
          addLog(
            'Dry-run protection activated: Tank below 200 L',
            'மோட்டார் வறட்சி தடுப்பு: தொட்டியில் 200L கீழ் நீர் குறைந்தது',
            'Irrigation auto-stopped to prevent pipe cavitation.',
            'குழாய்களில் காற்று அடைப்பதைத் தடுக்க பாசனம் தானாக நிறுத்தப்பட்டது.',
            '#ef4444',
            '⚠️',
            'tank'
          );
        }
      }

      // 2. Field A Simulation
      if (fieldA.valveStatus === 'open') {
        setFieldA((prev) => {
          const nextMoist = Math.min(100, prev.moisture + 1);
          const nextSeconds = Math.max(0, prev.valveTimeRemainingSeconds - 2 * simSpeed);

          // Auto stop at target 70% in auto mode or when timer expires
          if ((systemMode === 'auto' && nextMoist >= prev.targetStop) || nextSeconds <= 0) {
            playWaterValveSound(false);
            addLog(
              `Field A reached target ${nextMoist}%`,
              `வயல் A இலக்கு ${nextMoist}% எட்டியது`,
              'Valve A closed automatically.',
              'வால்வு A தானாக மூடப்பட்டது.',
              '#2e7d32',
              '🟢'
            );
            return {
              ...prev,
              moisture: nextMoist,
              valveStatus: 'closed',
              valveTimeRemainingSeconds: 0,
              flowRateLpm: 0,
            };
          }

          // Consume tank water
          setTank((t) => ({ ...t, currentLiters: Math.max(0, t.currentLiters - 2) }));
          return { ...prev, moisture: nextMoist, valveTimeRemainingSeconds: nextSeconds };
        });
      } else {
        // Natural gradual drying if dry weather
        if (weather.condition !== 'rainy' && Math.random() < 0.2) {
          setFieldA((prev) => {
            const nextMoist = Math.max(15, prev.moisture - 1);
            if (systemMode === 'auto' && nextMoist < prev.targetStart && prev.valveStatus === 'closed') {
              playWaterValveSound(true);
              addLog(
                `Field A soil dropped to ${nextMoist}%`,
                `வயல் A மண் ${nextMoist}% ஆக குறைந்தது`,
                'Auto irrigation triggered for Field A Paddy.',
                'வயல் A சம்பா நெல்லுக்கு தானியங்கி பாசனம் தொடங்கியது.',
                '#2e7d32',
                '🌾'
              );
              return {
                ...prev,
                moisture: nextMoist,
                valveStatus: 'open',
                valveTimeRemainingSeconds: prev.durationMinutes * 60,
              };
            }
            return { ...prev, moisture: nextMoist };
          });
        }
      }

      // 3. Field B Simulation
      if (fieldB.valveStatus === 'open') {
        setFieldB((prev) => {
          const nextMoist = Math.min(100, prev.moisture + 1);
          const nextSeconds = Math.max(0, prev.valveTimeRemainingSeconds - 2 * simSpeed);

          // Auto stop at target 70% in auto mode or when timer finishes
          if ((systemMode === 'auto' && nextMoist >= prev.targetStop) || nextSeconds <= 0) {
            playWaterValveSound(false);
            addLog(
              `Field B Tomato satisfied (${nextMoist}%)`,
              `வயல் B தக்காளி போதுமான ஈரப்பதம் (${nextMoist}%) பெற்றது`,
              'Valve B closed automatically. Irrigation cycle complete.',
              'வால்வு B தானாக மூடப்பட்டது. பாசன சுழற்சி நிறைவடைந்தது.',
              '#2e7d32',
              '🍅'
            );
            return {
              ...prev,
              moisture: nextMoist,
              valveStatus: 'closed',
              valveTimeRemainingSeconds: 0,
              flowRateLpm: 0,
            };
          }

          // Consume tank water
          setTank((t) => ({ ...t, currentLiters: Math.max(0, t.currentLiters - 2) }));
          return { ...prev, moisture: nextMoist, valveTimeRemainingSeconds: nextSeconds };
        });
      } else {
        // Natural gradual drying
        if (weather.condition !== 'rainy' && Math.random() < 0.25) {
          setFieldB((prev) => {
            const nextMoist = Math.max(12, prev.moisture - 1);
            if (systemMode === 'auto' && nextMoist < prev.targetStart && prev.valveStatus === 'closed') {
              playWaterValveSound(true);
              setIsDryAlertDismissed(false);
              addLog(
                `Field B dropped below 40% threshold (${nextMoist}%)`,
                `வயல் B 40% க்குக் கீழே வறண்டது (${nextMoist}%)`,
                'Auto irrigation started via Valve B.',
                'வால்வு B மூலம் தானியங்கி பாசனம் தொடங்கியது.',
                '#e65100',
                '🥀'
              );
              return {
                ...prev,
                moisture: nextMoist,
                valveStatus: 'open',
                valveTimeRemainingSeconds: prev.durationMinutes * 60,
              };
            }
            return { ...prev, moisture: nextMoist };
          });
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    isSimulating,
    simSpeed,
    systemMode,
    isTankRefilling,
    fieldA.valveStatus,
    fieldB.valveStatus,
    tank.currentLiters,
    weather.condition,
  ]);

  // Audio briefing handler
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const speechTa = `வணக்கம் முருகன் அண்ணா! பண்ணை நிலவரம்: வயல் A சம்பா நெல் ஈரப்பதம் ${fieldA.moisture} சதவீதம். வயல் B தக்காளி ஈரப்பதம் ${fieldB.moisture} சதவீதம். ${
        fieldB.valveStatus === 'open'
          ? 'தக்காளிக்கு வால்வு B மூலம் தண்ணீர் பாய்கிறது.'
          : 'பாசனம் காத்திருப்பில் உள்ளது.'
      } மேல்நிலை தொட்டியில் ${tank.currentLiters} லிட்டர் நீர் உள்ளது. வானிலை தெளிவான வெயில்.`;

      const speechEn = `Vanakkam Murugan Anna! Farm report: Field A paddy moisture is ${fieldA.moisture} percent. Field B tomato moisture is ${fieldB.moisture} percent. ${
        fieldB.valveStatus === 'open'
          ? 'Irrigation is actively running on Field B.'
          : 'Irrigation is standing by.'
      } Overhead tank has ${tank.currentLiters} litres. Weather is clear.`;

      const text = lang === 'ta' ? speechTa : speechEn;
      speakText(text, lang, () => setIsSpeaking(false));
    }
  };

  // Scenario Triggers for Testing Bench
  const triggerHeatwaveScenario = () => {
    setFieldA((prev) => ({ ...prev, moisture: 45, temperature: 36 }));
    setFieldB((prev) => ({ ...prev, moisture: 24, temperature: 38 }));
    setIsDryAlertDismissed(false);
    addLog(
      'Simulated Heatwave Scenario',
      'வெப்ப அலை சோதனை இயக்கப்பட்டது',
      'Ambient temperature rose to 38°C. Soil moisture dropped rapidly.',
      'வெப்பநிலை 38°C ஆக உயர்ந்தது. மண் ஈரப்பதம் வேகமாக வறண்டது.',
      '#e65100',
      '🔥'
    );
  };

  const triggerRainScenario = () => {
    const nextCond = weather.condition === 'rainy' ? 'sunny' : 'rainy';
    setWeather((prev) => ({ ...prev, condition: nextCond }));
    setFieldA((prev) => ({
      ...prev,
      rainSensor: nextCond === 'rainy' ? 'wet' : 'dry',
      valveStatus: nextCond === 'rainy' ? 'closed' : prev.valveStatus,
    }));
    setFieldB((prev) => ({
      ...prev,
      rainSensor: nextCond === 'rainy' ? 'wet' : 'dry',
      valveStatus: nextCond === 'rainy' ? 'closed' : prev.valveStatus,
    }));
    addLog(
      nextCond === 'rainy' ? 'Simulated Heavy Rain detected' : 'Rain cleared',
      nextCond === 'rainy' ? 'மழை சென்சார் இயக்கப்பட்டது' : 'மழை நின்றது',
      nextCond === 'rainy'
        ? 'Rain sensors triggered wet state. All irrigation paused automatically.'
        : 'Rain cleared. Sensor back to dry state.',
      nextCond === 'rainy'
        ? 'மழை சென்சார் ஈரத்தை கண்டறிந்தது. பாசனம் தானாக நிறுத்தப்பட்டது.'
        : 'மழை நின்றது. சென்சார் மீண்டும் உலர் நிலைக்கு மாறியது.',
      '#0284c7',
      nextCond === 'rainy' ? '🌧️' : '☀️',
      'weather'
    );
  };

  const triggerLowTankScenario = () => {
    setTank((prev) => ({ ...prev, currentLiters: 180 }));
    handleStopAllValves();
  };

  const resetDefaults = () => {
    setFieldA({
      id: 'field_a',
      letter: 'A',
      nameEn: 'Field A',
      nameTa: 'வயல் A',
      cropEn: 'Samba Paddy',
      cropTa: 'சம்பா நெல்',
      cropEmoji: '🌾',
      soilTypeEn: 'Clay Loam Soil',
      soilTypeTa: 'வண்டல் மண்',
      moisture: 62,
      targetStart: 40,
      targetStop: 70,
      valveStatus: 'closed',
      valveTimeRemainingSeconds: 0,
      durationMinutes: 10,
      temperature: 31,
      humidity: 64,
      rainSensor: 'dry',
      flowRateLpm: 0,
      primaryColor: '#2e7d32',
      accentBg: '#e6f3e7',
      status: 'good',
    });
    setFieldB({
      id: 'field_b',
      letter: 'B',
      nameEn: 'Field B',
      nameTa: 'வயல் B',
      cropEn: 'Native Tomato',
      cropTa: 'நாட்டு தக்காளி',
      cropEmoji: '🍅',
      soilTypeEn: 'Red Sand Soil',
      soilTypeTa: 'செம்மண்',
      moisture: 28,
      targetStart: 40,
      targetStop: 70,
      valveStatus: 'open',
      valveTimeRemainingSeconds: 480,
      durationMinutes: 10,
      temperature: 34,
      humidity: 55,
      rainSensor: 'dry',
      flowRateLpm: 18,
      primaryColor: '#e65100',
      accentBg: '#fdebdc',
      status: 'dry',
    });
    setTank({
      currentLiters: 720,
      capacityLiters: 1000,
      pumpStatus: 'running_feed',
      dryRunCutoffLiters: 200,
      boreholeWaterLevelPercent: 88,
      voltage: 415,
    });
    setWeather({
      condition: 'sunny',
      tempCelsius: 34,
      humidityPercent: 58,
      radarStatusEn: 'Radar OK: Clear skies',
      radarStatusTa: 'வானிலை ரேடார்: தெளிவான வானம்',
      locationEn: 'Thanjavur District',
      locationTa: 'தஞ்சாவூர் மாவட்டம்',
      forecast6hEn: 'No rain forecast in Thanjavur district for next 6 hours',
      forecast6hTa: 'அடுத்த 6 மணி நேரத்திற்கு தஞ்சாவூரில் மழை இல்லை',
    });
    setIsDryAlertDismissed(false);
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-page)]">
      {/* Main Responsive Dashboard Container (Max 980px, Centred, 14px outer padding) */}
      <div className="relative z-10 max-w-[980px] mx-auto px-[14px] py-4 min-h-screen flex flex-col justify-between">
        {/* Top Header */}
        <Header
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'ta' ? 'en' : 'ta'))}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            const el = document.getElementById(tab);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenSimDrawer={() => setIsSimDrawerOpen(true)}
          onOpenIvrCall={() => {
            setIvrInitialDigit(undefined);
            setIsIvrModalOpen(true);
          }}
          isSimulating={isSimulating}
          isHardwareMode={isHardwareMode}
          hardwareConnectionStatus={hardwareConnectionStatus}
          onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="space-y-4" id="overview">
          {/* Section 3: Hero Greeting & Murugan Anna Vector Illustration */}
          <HeroBanner
            lang={lang}
            fields={{ fieldA, fieldB }}
            currentTimeString={currentTimeString}
            isSpeaking={isSpeaking}
            onToggleSpeech={handleToggleSpeech}
          />

          {/* Section 4: Interactive Alert Banners */}
          <AlertBanners
            lang={lang}
            fields={{ fieldA, fieldB }}
            tank={tank}
            weather={weather}
            isDryAlertDismissed={isDryAlertDismissed}
            onDismissDryAlert={() => setIsDryAlertDismissed(true)}
            onQuickRefill={handleRefillTank}
            isHardwareMode={isHardwareMode}
            hardwareConnectionStatus={hardwareConnectionStatus}
            onSwitchToDemo={() => {
              setIsHardwareMode(false);
              setHardwareConnectionStatus('demo');
            }}
            onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
          />

          {/* Section 5: Summary Stat Cards */}
          <StatCards lang={lang} fields={{ fieldA, fieldB }} weather={weather} />

          {/* Section 6: Top-Down Visual Field View Schematic */}
          <FieldViewSchematic
            lang={lang}
            fields={{ fieldA, fieldB }}
            systemMode={systemMode}
            onToggleSystemMode={setSystemMode}
            onToggleValve={handleToggleValve}
          />

          {/* Section 7: Detailed Field A vs Field B Cards */}
          <FieldCards
            lang={lang}
            fieldA={fieldA}
            fieldB={fieldB}
            onToggleValve={handleToggleValve}
            onChangeDuration={handleChangeDuration}
          />

          {/* Section 8: Overhead Water Tank Telemetry & Wave Animation */}
          <WaterTankCard
            lang={lang}
            tank={tank}
            fieldA={fieldA}
            fieldB={fieldB}
            onRefillTank={handleRefillTank}
            isRefilling={isTankRefilling}
          />

          {/* Section 9: Telemetry Trend Graphs (Moisture, Temp, Humidity) */}
          <TelemetryCharts lang={lang} fieldA={fieldA} fieldB={fieldB} />

          {/* Section 10: Live Activity Timeline */}
          <ActivityTimeline lang={lang} logs={logs} />

          {/* Section 11: Basic Phone Voice Hotline IVR Accessibility */}
          <PhoneHotlineCard
            lang={lang}
            onOpenIvrCall={(digit) => {
              setIvrInitialDigit(digit);
              setIsIvrModalOpen(true);
            }}
          />
        </main>

        {/* Section 12: Footer */}
        <Footer
          lang={lang}
          onOpenIvr={() => {
            setIvrInitialDigit(undefined);
            setIsIvrModalOpen(true);
          }}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenWeather={() => setIsWeatherOpen(true)}
        />
      </div>

      {/* Interactive IVR Phone Simulator Modal */}
      <IvrPhoneModal
        isOpen={isIvrModalOpen}
        onClose={() => setIsIvrModalOpen(false)}
        lang={lang}
        fieldA={fieldA}
        fieldB={fieldB}
        tank={tank}
        initialDigit={ivrInitialDigit}
        onStartValve={handleToggleValve}
        onStopValves={handleStopAllValves}
      />

      {/* Floating Simulation Control Drawer */}
      <SimulationControlDrawer
        isOpen={isSimDrawerOpen}
        onClose={() => setIsSimDrawerOpen(false)}
        lang={lang}
        isSimulating={isSimulating}
        onToggleSimulating={() => setIsSimulating((prev) => !prev)}
        simSpeed={simSpeed}
        onChangeSpeed={setSimSpeed}
        onTriggerHeatwave={triggerHeatwaveScenario}
        onTriggerRain={triggerRainScenario}
        onTriggerLowTank={triggerLowTankScenario}
        onRefillTank={handleRefillTank}
        onResetDefaults={resetDefaults}
        onOpenHardware={() => setIsHardwareModalOpen(true)}
        isHardwareMode={isHardwareMode}
      />

      {/* Farmer Operating Manual Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />

      {/* Weather Radar Modal */}
      <WeatherModal
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
        lang={lang}
        weather={weather}
      />

      {/* ESP32 Hardware Integration & Firebase Configuration Modal */}
      <HardwareConfigModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        lang={lang}
        firebaseUrl={firebaseUrl}
        onSaveFirebaseUrl={(newUrl) => {
          setFirebaseUrl(newUrl);
          saveFirebaseUrl(newUrl);
        }}
        isHardwareMode={isHardwareMode}
        onToggleHardwareMode={(enabled) => {
          setIsHardwareMode(enabled);
          if (!enabled) setHardwareConnectionStatus('demo');
        }}
        hardwareState={hardwareState}
        connectionStatus={hardwareConnectionStatus}
        onTestConnection={handleTestConnection}
        isTesting={isTestingHardware}
      />
    </div>
  );
}
