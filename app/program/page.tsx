'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Coffee,
  Award,
  Users,
  BookOpen,
  Printer,
  ChevronRight
} from 'lucide-react';
import { PROGRAM_DAYS } from '@/lib/data';
import { getStoredCMSData, CMSData } from '@/lib/cmsStorage';
import { ProgramSession } from '@/lib/types';
import InnerPageHero from '@/components/InnerPageHero';

export default function ProgramPage() {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [cmsData, setCmsData] = useState<CMSData>(getStoredCMSData());

  React.useEffect(() => {
    const handleUpdate = () => {
      setCmsData(getStoredCMSData());
    };
    window.addEventListener('igm_cms_updated', handleUpdate);
    return () => window.removeEventListener('igm_cms_updated', handleUpdate);
  }, []);

  const programDays = cmsData.program && cmsData.program.length > 0 ? cmsData.program : PROGRAM_DAYS;
  const currentDayData = programDays.find((d: any) => d.dayNumber === activeDay) || programDays[0];

  const getSessionBadge = (type: ProgramSession['type']) => {
    switch (type) {
      case 'ceremony':
        return { label: 'Tören & Protokol', bg: 'bg-[#4DA3FF]/15 text-[#4DA3FF] border-[#4DA3FF]/30', icon: Award };
      case 'workshop':
        return { label: 'Komisyon Çalıştayı', bg: 'bg-blue-600/20 text-blue-300 border-blue-500/30', icon: Users };
      case 'break':
        return { label: 'İkram / Mola', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Coffee };
      case 'gala':
        return { label: 'Gala & Kültür', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: Sparkles };
      default:
        return { label: 'Genel Kurul Oturumu', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: BookOpen };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#061A33] text-white">

      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="3 GÜNLÜK MECLİS TAKVİMİ"
        title="Etkinlik Programı & Akışı"
        description="23-24-25 Ekim 2026 tarihlerinde Selçuklu Kongre Merkezi'nde gerçekleşecek oturumların, çalıştayların ve törenlerin detaylı saatlik akışı."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Program' }
        ]}
      />

      {/* 2. PRINT / ACTION BAR & DAY SELECTOR TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Günü Seçin ve Akışı İnceleyin</h3>
            <p className="text-xs text-slate-300">Resmi oturumlar ve komisyon toplantı saatleri</p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#092746] hover:bg-[#0D3156] border border-[#4DA3FF]/30 text-[#4DA3FF] text-xs font-semibold transition-all shadow-md cursor-pointer self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-[#4DA3FF]" />
            <span>Programı Yazdır (PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {programDays.map((day: any) => {
            const active = activeDay === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${active
                    ? 'bg-[#092746] border-[#4DA3FF] shadow-xl shadow-[#4DA3FF]/10 ring-1 ring-[#4DA3FF]'
                    : 'bg-[#092746]/60 border-[#4DA3FF]/20 hover:border-[#4DA3FF]/50'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-sans font-bold px-3 py-1 rounded-full ${active ? 'bg-[#4DA3FF] text-[#061A33]' : 'bg-[#061A33] text-slate-300 border border-white/10'
                    }`}>
                    {day.dayNumber}. GÜN
                  </span>
                  <span className="text-xs text-[#4DA3FF] font-medium font-sans">
                    {day.date.split(' ')[0]} {day.date.split(' ')[1]}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  {day.title}
                </h3>
                <p className="text-xs text-slate-300 truncate font-sans">
                  {day.theme}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. DETAILED TIMELINE SESSIONS FOR ACTIVE DAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" id="printable-program">

        {/* Day Header Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-xs font-bold text-[#4DA3FF] uppercase tracking-wider">
              {currentDayData.date}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {currentDayData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
              Günün Teması: <span className="text-white font-medium">{currentDayData.theme}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#4DA3FF] bg-[#061A33] px-4 py-2 rounded-full border border-[#4DA3FF]/20">
            <Clock className="w-4 h-4 text-[#4DA3FF]" />
            <span>Toplam {currentDayData.sessions.length} Oturum / Mola</span>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {currentDayData.sessions.map((session) => {
            const badge = getSessionBadge(session.type);
            const IconComp = badge.icon;
            const isBreak = session.type === 'break';

            return (
              <div
                key={session.id}
                className={`group rounded-2xl border p-6 transition-all duration-300 ${isBreak
                    ? 'bg-[#092746]/40 border-[#4DA3FF]/15'
                    : 'bg-[#092746] border-[#4DA3FF]/20 hover:border-[#4DA3FF]/60 hover:shadow-xl'
                  }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  {/* Left: Time & Badge */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 bg-[#061A33] px-4 py-2 rounded-xl border border-[#4DA3FF]/30 text-[#4DA3FF] font-mono text-sm font-bold shadow-inner">
                      <Clock className="w-4 h-4 text-[#4DA3FF]" />
                      <span>{session.time}</span>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 space-y-1.5">
                    <h4 className="text-lg font-serif font-bold text-white group-hover:text-[#4DA3FF] transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {session.description}
                    </p>

                    {session.speaker && (
                      <div className="pt-1 flex items-center gap-2 text-xs text-[#4DA3FF]">
                        <span className="font-semibold">Konuşmacı:</span>
                        <span className="text-white font-medium">{session.speaker}</span>
                        {session.speakerRole && (
                          <span className="text-slate-400">({session.speakerRole})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Location Hall */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#061A33] px-3.5 py-2 rounded-xl border border-[#4DA3FF]/20 shrink-0 self-start lg:self-center">
                    <MapPin className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    <span>{session.location}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
