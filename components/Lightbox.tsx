'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Download, Eye, Sparkles } from 'lucide-react';
import { GalleryItem } from '@/lib/types';

export default function Lightbox({
  items,
  currentIndex: controlledIndex,
  initialIndex = 0,
  isOpen = true,
  onClose,
  onNext: controlledNext,
  onPrev: controlledPrev
}: {
  items: GalleryItem[];
  currentIndex?: number;
  initialIndex?: number;
  isOpen?: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [internalIndex, setInternalIndex] = React.useState(initialIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const handleNext = React.useCallback(() => {
    if (controlledNext) {
      controlledNext();
    } else {
      setInternalIndex((prev) => (prev + 1) % items.length);
    }
  }, [controlledNext, items.length]);

  const handlePrev = React.useCallback(() => {
    if (controlledPrev) {
      controlledPrev();
    } else {
      setInternalIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  }, [controlledPrev, items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[activeIndex] || items[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Top action bar */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-blue-300">
            {activeIndex + 1} / {items.length}
          </span>
          <h4 className="text-sm font-semibold text-slate-200 truncate max-w-md hidden sm:block">
            {currentItem.title}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-blue-600 transition-all border border-slate-700"
        aria-label="Önceki"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-blue-600 transition-all border border-slate-700"
        aria-label="Sonraki"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image or Video Display */}
      <div className="relative w-full max-w-5xl h-[75vh] p-4 flex items-center justify-center">
        {currentItem.mediaType === 'video' ? (
          <div className="w-full h-full max-h-[70vh] flex items-center justify-center">
            <video
              src={currentItem.mediaUrl}
              controls
              autoPlay
              className="max-h-full max-w-full rounded-xl border border-slate-800 shadow-2xl"
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={currentItem.mediaUrl}
              alt={currentItem.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 text-center">
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
          {currentItem.title}
        </h3>
        <p className="text-xs text-slate-400">
          Yükleyen: {currentItem.uploaderName || 'TİMAV Medya'} • {currentItem.createdAt}
        </p>
      </div>

    </div>
  );
}
