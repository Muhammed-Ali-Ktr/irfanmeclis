import React from 'react';
import Image from 'next/image';

interface SiteLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function SiteLogo({
  className = '',
  size = 44,
  showText = false
}: SiteLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative rounded-full overflow-hidden shrink-0 border border-[#4DA3FF]/40 shadow-lg shadow-[#061A33] bg-[#061A33]"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src="/logo.png"
          alt="İrfan Meclis Simülasyonu"
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#4DA3FF] font-medium leading-none mb-1">
            TİMAV ÖNDERLİĞİNDE
          </span>
          <span className="text-base sm:text-lg font-serif font-black tracking-tight text-white leading-tight">
            İRFAN MECLİSİ
          </span>
        </div>
      )}
    </div>
  );
}
