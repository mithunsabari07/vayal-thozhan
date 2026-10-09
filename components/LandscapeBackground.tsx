'use client';

import React from 'react';

interface LandscapeBackgroundProps {
  isDark: boolean;
}

export default function LandscapeBackground({ isDark }: LandscapeBackgroundProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
      style={{ opacity: isDark ? 0.55 : 0.75 }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SKY CELESTIAL ELEMENTS */}
        {!isDark ? (
          <g id="sky-sun" className="transition-all duration-700">
            {/* Bright golden sun with ambient glow */}
            <circle cx="1260" cy="110" fill="#fef08a" opacity="0.45" r="72" />
            <circle cx="1260" cy="110" fill="#fde047" opacity="0.7" r="44" />
            <circle cx="1260" cy="110" fill="#eab308" opacity="0.9" r="28" />
            {/* Drifting Clouds */}
            <path
              d="M 180 80 Q 200 60, 230 65 Q 260 55, 290 75 Q 310 80, 310 95 L 180 95 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <path
              d="M 820 120 Q 840 100, 870 105 Q 900 95, 930 115 Q 950 120, 950 135 L 820 135 Z"
              fill="#ffffff"
              opacity="0.75"
            />
          </g>
        ) : (
          <g id="sky-stars" className="transition-all duration-700">
            {/* Crescent Moon */}
            <path
              d="M 1250 80 A 28 28 0 1 0 1285 125 A 35 35 0 0 1 1250 80 Z"
              fill="#e8ecff"
              opacity="0.9"
            />
            {/* Twinkling stars */}
            <circle cx="150" cy="80" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="280" cy="130" r="2" fill="#ffffff" opacity="0.9" />
            <circle cx="420" cy="70" r="1.5" fill="#ffffff" opacity="0.7" />
            <circle cx="680" cy="110" r="2.5" fill="#ffffff" opacity="0.8" />
            <circle cx="920" cy="65" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="1100" cy="140" r="2" fill="#ffffff" opacity="0.6" />
          </g>
        )}

        {/* LAYER 1: DISTANT HILLS */}
        <path
          d="M0 650 C 320 600, 680 620, 1020 580 C 1220 560, 1380 580, 1440 600 L 1440 900 L 0 900 Z"
          fill={isDark ? '#122216' : '#c3e8be'}
          opacity={isDark ? '0.85' : '0.7'}
        />

        {/* LAYER 2: MIDGROUND HILLS & RED BARN */}
        <path
          d="M0 720 C 260 670, 580 730, 900 680 C 1180 640, 1360 690, 1440 710 L 1440 900 L 0 900 Z"
          fill={isDark ? '#172d1c' : '#9cd699'}
          opacity={isDark ? '0.9' : '0.8'}
        />

        {/* Small Tamil Nadu village Red Barn on hill */}
        <g transform="translate(860, 640)">
          <polygon fill="#b91c1c" points="0,25 22,5 44,25" />
          <rect fill="#dc2626" height="24" width="34" x="5" y="25" />
          <rect fill="#fef2f2" height="15" width="8" x="18" y="34" />
          <rect fill="#fef2f2" height="6" width="6" x="10" y="27" />
          <rect fill="#fef2f2" height="6" width="6" x="28" y="27" />
        </g>

        {/* Tamil Nadu Coconut Palm tree on left */}
        <g transform="translate(90, 520)">
          {/* Trunk */}
          <path
            d="M50 240 Q 55 130, 80 50"
            fill="none"
            stroke="#78350f"
            strokeLinecap="round"
            strokeWidth="10"
          />
          <path
            d="M51 240 Q 56 130, 81 50"
            fill="none"
            stroke="#92400e"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {/* Fronds */}
          <path d="M80 50 Q 30 30, 10 50" fill="none" stroke="#15803d" strokeLinecap="round" strokeWidth="5" />
          <path d="M80 50 Q 40 10, 30 -20" fill="none" stroke="#16a34a" strokeLinecap="round" strokeWidth="5" />
          <path d="M80 50 Q 80 0, 90 -25" fill="none" stroke="#15803d" strokeLinecap="round" strokeWidth="5" />
          <path d="M80 50 Q 120 15, 140 0" fill="none" stroke="#22c55e" strokeLinecap="round" strokeWidth="5" />
          <path d="M80 50 Q 130 45, 150 70" fill="none" stroke="#16a34a" strokeLinecap="round" strokeWidth="5" />
        </g>

        {/* LAYER 3: FOREGROUND PADDY CONTOUR LINES */}
        <path
          d="M0 800 C 350 780, 720 830, 1440 790 L 1440 900 L 0 900 Z"
          fill={isDark ? '#1e3c25' : '#71bf6f'}
        />
        <path
          d="M 120 820 Q 150 790, 180 825 M 340 830 Q 370 800, 400 835 M 680 815 Q 710 785, 740 820 M 1020 825 Q 1050 795, 1080 830"
          opacity="0.6"
          stroke={isDark ? '#4ade80' : '#2e7d32'}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
