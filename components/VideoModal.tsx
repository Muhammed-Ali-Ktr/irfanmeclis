'use client';

import React, { useEffect } from 'react';
import { X, Play, Volume2, Sparkles } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-curved-lines-of-an-auditorium-hall-with-warm-lights-42971-large.mp4',
  title = 'İrfan Meclisi 2026 Tanıtım Filmi'
}: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-slate-950 border border-blue-600/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/40 z-10">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          >
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
        </div>

        {/* Modal Footer note */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>TİMAV Medya & Gençlik Yapımı • 23-24-25 Ekim 2026 Selçuklu Kongre Merkezi</span>
          <span className="text-amber-400 font-medium">HD 1080p</span>
        </div>
      </div>
    </div>
  );
}
