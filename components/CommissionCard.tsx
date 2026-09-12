'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Scale, 
  BookOpenCheck, 
  Globe, 
  Shield, 
  HeartPulse, 
  Crosshair, 
  GraduationCap, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  X
} from 'lucide-react';
import { Commission } from '@/lib/types';

const iconMap: Record<string, any> = {
  Scale,
  BookOpenCheck,
  Globe,
  Shield,
  HeartPulse,
  Crosshair,
  GraduationCap,
  Compass
};

export function CommissionModal({
  commission,
  isOpen,
  onClose
}: {
  commission: Commission | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !commission) return null;

  const IconComponent = iconMap[commission.iconName] || Compass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#061A33] border border-[#4DA3FF]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#030D1A] z-10 max-h-[90vh] flex flex-col">
        
        {/* Cover Header */}
        <div className="relative h-48 sm:h-56 w-full">
          <Image
            src={commission.coverImageUrl}
            alt={commission.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061A33] via-[#061A33]/70 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#092746]/80 text-slate-300 hover:text-white hover:bg-[#0D3156] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0D3156] border border-[#4DA3FF]/40 flex items-center justify-center text-[#4DA3FF] shadow-lg">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#4DA3FF] uppercase tracking-wider">İhtisas Masası</span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{commission.name}</h3>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          <div>
            <h4 className="text-white font-semibold mb-1 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4DA3FF]" />
              Komisyonun Misyonu ve Tanımı
            </h4>
            <p className="leading-relaxed text-slate-300">
              {commission.description}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4DA3FF]"></span>
              Tartışılacak Temel Gündem Maddeleri
            </h4>
            <div className="space-y-2">
              {commission.topics.map((topic, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#092746] border border-blue-900/30">
                  <span className="text-xs font-mono font-bold text-[#4DA3FF] mt-0.5">0{idx + 1}.</span>
                  <span className="text-slate-200">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Komisyonun Nihai Hedefleri & Çıktıları
            </h4>
            <ul className="space-y-2 list-none">
              {commission.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#092746] border-t border-blue-900/40 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Kontenjan: 30-35 Delege
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-semibold"
            >
              Kapat
            </button>
            <Link
              href={`/basvuru?commission=${commission.id}`}
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#258BF5] hover:bg-[#1f77d3] text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <span>Bu Komisyona Başvur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CommissionCard({ commission, number }: { commission: Commission; number?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const IconComponent = iconMap[commission.iconName] || Compass;

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden bg-[#092746] border border-[#4DA3FF]/15 hover:border-[#4DA3FF]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#030D1A] flex flex-col h-full">
        
        {/* Cover Image Container */}
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={commission.coverImageUrl}
            alt={commission.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092746] via-[#092746]/50 to-transparent" />
          
          {/* Number / Short Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {number && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#061A33]/90 text-[#4DA3FF] border border-[#4DA3FF]/30">
                {number}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#061A33]/90 backdrop-blur border border-white/10 text-slate-200">
              {commission.shortName}
            </span>
          </div>

          {/* Icon in corner */}
          <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-[#0D3156] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] shadow-md">
            <IconComponent className="w-4 h-4" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#4DA3FF] transition-colors">
              {commission.name}
            </h3>
            <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {commission.description}
            </p>
          </div>

          {/* Topics Preview */}
          <div className="space-y-1.5 pt-3 border-t border-slate-700/40">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Öne Çıkan Başlıklar
            </span>
            {commission.topics.slice(0, 2).map((topic, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF] shrink-0"></span>
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-[#4DA3FF] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Detaylı İncele</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link
              href={`/basvuru?commission=${commission.id}`}
              className="px-3.5 py-1.5 rounded-full bg-[#0D3156] hover:bg-[#258BF5] border border-[#4DA3FF]/30 text-white text-xs font-semibold transition-colors"
            >
              Başvur
            </Link>
          </div>
        </div>

      </div>

      <CommissionModal
        commission={commission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
