'use client';

import React from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  label,
  size = 110,
  strokeWidth = 9,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 85) return { stroke: '#2f5b45', text: 'text-[#2f5b45]', badge: 'bg-[#2f5b45] text-white' };
    if (val >= 70) return { stroke: '#16a34a', text: 'text-emerald-700', badge: 'bg-emerald-700 text-white' };
    if (val >= 50) return { stroke: '#d97706', text: 'text-amber-700', badge: 'bg-amber-700 text-white' };
    return { stroke: '#dc2626', text: 'text-rose-700', badge: 'bg-rose-700 text-white' };
  };

  const theme = getColor(score);

  return (
    <div className="flex flex-col items-center py-5 px-3 transition-transform duration-300 hover:-translate-y-1">
      {/* Animated SVG Ring Widget */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-sm">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(47, 91, 69, 0.15)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out animate-pulse"
            style={{ animationDuration: '4s' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-black font-mono tracking-tighter ${theme.text}`}>
            {score}
          </span>
          <span className="text-[9px] text-[#1a2520]/60 uppercase font-mono font-bold tracking-widest">/ 100</span>
        </div>
      </div>
      <span className="mt-3 text-xs font-mono font-extrabold uppercase tracking-widest text-[#1a2520]">
        {label}
      </span>
    </div>
  );
};
