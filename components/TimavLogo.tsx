import React from 'react';
import Image from 'next/image';

interface TimavLogoProps {
  className?: string;
  variant?: 'emblem' | 'full';
  color?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export default function TimavLogo({ 
  className = "w-10 h-10", 
  variant = 'emblem',
  color = "currentColor",
  width = 40,
  height = 40,
  showText = false
}: TimavLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div 
        className={`relative rounded-full overflow-hidden shrink-0 border border-[#4DA3FF]/40 shadow-lg shadow-[#061A33] bg-[#061A33] ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src="/logo.png"
          alt="İrfan Meclis Simülasyonu"
          fill
          sizes={`${width}px`}
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <span className="font-serif font-black tracking-wider text-xl text-white leading-none">
          İRFAN MECLİSİ
        </span>
      )}
    </div>
  );
}
