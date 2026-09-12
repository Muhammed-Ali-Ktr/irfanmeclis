'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ 
  targetDate = '2026-10-23T09:00:00+03:00',
  countdownText = 'Yeni fikirler, güçlü sesler ve kararlı adımlar için geri sayım başladı.'
}: { 
  targetDate?: string;
  countdownText?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 45,
    hours: 12,
    minutes: 34,
    seconds: 27
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="w-full max-w-lg">
        <div className="mb-2">
          <p className="text-xs sm:text-sm font-semibold text-[#4DA3FF] tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4DA3FF] shrink-0" />
            <span>{countdownText}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3">
          <Clock className="w-3.5 h-3.5 text-[#4DA3FF]" />
          <span>Etkinliğe Kalan Süre</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {['Gün', 'Saat', 'Dakika', 'Saniye'].map((label, idx) => (
            <div key={idx} className="bg-[#092746]/90 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">--</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = [
    { label: 'Gün', value: timeLeft.days },
    { label: 'Saat', value: timeLeft.hours },
    { label: 'Dakika', value: timeLeft.minutes },
    { label: 'Saniye', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Announcement text requested by user */}
      <div className="mb-2.5">
        <p className="text-xs sm:text-sm font-semibold text-[#4DA3FF] tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4DA3FF] shrink-0" />
          <span>{countdownText}</span>
        </p>
      </div>

      {/* Title with clock icon */}
      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3">
        <Clock className="w-3.5 h-3.5 text-[#4DA3FF]" />
        <span>Etkinliğe Kalan Süre</span>
      </div>

      {/* 4 Navy Cards (matching screenshot) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 w-full">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#092746]/85 backdrop-blur-md border border-[#4DA3FF]/20 rounded-xl p-2 sm:p-3 text-center shadow-lg shadow-[#030D1A]/50 min-w-0"
          >
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white font-mono tracking-tight leading-none">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-sans mt-1 truncate">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
