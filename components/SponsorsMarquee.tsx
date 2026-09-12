'use client';

import React from 'react';

const SPONSORS_LIST = [
  { name: 'NECMETTİN ERBAKAN ÜNİVERSİTESİ', role: 'Akademik Destek' },
  { name: 'KONYA TEKNİK ÜNİVERSİTESİ', role: 'Teknoloji Ortağı' },
  { name: 'KARATAY BELEDİYESİ', role: 'Kültür Sponsoru' },
  { name: 'MERAM BELEDİYESİ', role: 'Sosyal Destek' },
  { name: 'SELÇUKLU BELEDİYESİ', role: 'Hizmet Ortağı' },
  { name: 'KONYA BÜYÜKŞEHİR BELEDİYESİ', role: 'Ana Destekçi' },
  { name: 'TİMAV', role: 'Önder Kurum' },
  { name: 'SELÇUK ÜNİVERSİTESİ', role: 'Akademik Destek' },
  { name: 'KTO KARATAY ÜNİVERSİTESİ', role: 'Eğitim & Sanat Ortağı' },
  { name: 'T.C. GENÇLİK VE SPOR BAKANLIĞI', role: 'Kurumsal Destek' }
];

export default function SponsorsMarquee() {
  return (
    <section className="py-12 bg-[#041224] border-y border-[#4DA3FF]/15 overflow-hidden relative select-none">
      {/* Title matching reference screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h3 className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#4DA3FF] font-semibold font-sans">
          DESTEKÇİ VE PAYDAŞ KURUMLAR
        </h3>
      </div>

      {/* Marquee Carousel Container with Gradient Edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#041224] to-transparent z-10" />
        
        {/* Right Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#041224] to-transparent z-10" />

        {/* Scrolling Strip */}
        <div className="animate-marquee py-2 flex items-center gap-4 sm:gap-6">
          {/* Render twice for continuous loop */}
          {[...SPONSORS_LIST, ...SPONSORS_LIST].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#081e3a]/90 border border-[#4DA3FF]/30 hover:border-[#4DA3FF] hover:bg-[#0c2f57] shadow-lg shadow-black/30 transition-all duration-300 group shrink-0"
            >
              <span className="text-xs sm:text-sm font-serif font-black tracking-wide text-white group-hover:text-[#4DA3FF] transition-colors whitespace-nowrap">
                {item.name}
              </span>
              <span className="w-px h-3.5 bg-[#4DA3FF]/40 shrink-0" />
              <span className="text-[11px] sm:text-xs text-slate-300 font-sans tracking-normal whitespace-nowrap">
                {item.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
