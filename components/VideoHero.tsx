'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Compass, 
  Calendar, 
  MapPin, 
  Users, 
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import VideoModal from './VideoModal';

export default function VideoHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      
      {/* Background Video with Dark Navy Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover object-center scale-105 filter brightness-60 contrast-110"
        >
          {/* High-quality conference & modern assembly hall loop */}
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-curved-lines-of-an-auditorium-hall-with-warm-lights-42971-large.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Multi-layered cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-blue-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-slate-950/90" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-blue-500/30 text-xs sm:text-sm text-slate-300 mb-6 shadow-xl shadow-blue-950/50">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="font-semibold text-amber-300">TİMAV Önderliğinde</span>
          <span className="text-slate-500">•</span>
          <span className="text-blue-300 font-medium">Ulusal Gençlik Meclisi Simülasyonu</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase font-sans drop-shadow-2xl">
          İRFAN MECLİSİ
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-blue-300 to-amber-200">
            2026 KONYA
          </span>
        </h1>

        {/* Subtitle / Slogan */}
        <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow">
          “Kökümüz İrfan, Sözümüz İstikbal”
        </p>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
          Türkiye genelinden 250 seçkin delege, 8 ihtisas komisyonunda bir araya gelerek ülkemizin ve dünyanın geleceğine yön verecek yasa tasarılarını müzakere ediyor.
        </p>

        {/* Event Quick Meta Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-700/60">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">23-24-25 Ekim 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-700/60">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Selçuklu Kongre Merkezi (SKM), Konya</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-700/60">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">250 Asil Delege</span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="mt-8">
          <CountdownTimer />
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/basvuru"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Hemen Delege Başvurusu Yap</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsVideoOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold text-base border border-blue-500/30 backdrop-blur-md transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center transition-colors shadow-md">
              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            </div>
            <span>Tanıtım Videosunu İzle</span>
          </button>
        </div>

      </div>

      {/* Video Modal Trigger */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="İrfan Meclisi 2026 Tanıtım Filmi"
      />
    </section>
  );
}
