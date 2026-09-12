'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  Printer, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Application } from '@/lib/types';
import { COMMISSIONS } from '@/lib/data';
import TimavLogo from './TimavLogo';

export default function QrTicketModal({
  application,
  isOpen,
  onClose,
  isNew = false
}: {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  isNew?: boolean;
  }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && isNew) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // safe
      }
    }

    if (application?.qrCodeId) {
      QRCode.toDataURL(
        application.qrCodeId,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#061A33',
            light: '#ffffff'
          }
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen, application, isNew]);

  if (!isOpen || !application) return null;

  const commission = COMMISSIONS.find((c) => c.id === application.commissionId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#061A33]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#092746] border border-[#4DA3FF]/40 rounded-3xl overflow-hidden shadow-2xl shadow-[#061A33]/90 z-10">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#061A33] border-b border-[#4DA3FF]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-[#4DA3FF]" />
            <span className="text-sm font-serif font-bold text-white">
              {isNew ? 'Başvurunuz Başarıyla Alındı!' : 'Delege Giriş Biletiniz'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#092746] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 text-slate-100">
          
          <div className="rounded-2xl border-2 border-dashed border-[#4DA3FF]/40 bg-gradient-to-br from-[#061A33] via-[#092746] to-[#061A33] p-6 relative overflow-hidden shadow-2xl">
            
            {/* Ticket Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <TimavLogo width={32} height={32} showText={false} />
                <div>
                  <h4 className="text-sm font-serif font-bold tracking-wide text-white">
                    İRFAN MECLİSİ
                  </h4>
                  <p className="text-[10px] text-[#4DA3FF] font-semibold tracking-wider uppercase">
                    TİMAV Önderliğinde • Konya 2026
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-sans font-bold px-2.5 py-1 rounded-full bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/40">
                DELEGE KARTI
              </span>
            </div>

            {/* Delegate Info */}
            <div className="mt-5 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Delege Adı Soyadı
                </span>
                <h3 className="text-xl font-serif font-bold text-white">{application.fullName}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Komisyon
                  </span>
                  <p className="font-semibold text-[#4DA3FF] font-serif">{commission?.name || application.commissionId}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Kurum / Üniversite
                  </span>
                  <p className="font-semibold text-slate-200 truncate">{application.school}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-[#4DA3FF]" />
                  <span>23-24-25 Ekim 2026</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#4DA3FF]" />
                  <span>Selçuklu KM (SKM)</span>
                </div>
              </div>
            </div>

            {/* QR Code Block */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt={application.qrCodeId}
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-200 animate-pulse rounded-xl" />
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs font-mono font-bold tracking-wider text-[#4DA3FF] bg-[#061A33] px-3 py-1 rounded-full border border-[#4DA3FF]/20">
                  {application.qrCodeId}
                </span>
                <p className="text-[10px] text-slate-300 mt-2">
                  Etkinlik girişinde bu QR kodu okutunuz.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-[#061A33] border-t border-[#4DA3FF]/20 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-300">
            {application.status === 'approved' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Onaylı Delege
              </span>
            ) : (
              <span className="text-[#4DA3FF] font-semibold">Ön Başvuru Alındı</span>
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#092746] hover:bg-[#0D3156] text-white text-xs font-semibold transition-all border border-[#4DA3FF]/30 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#4DA3FF]" />
              <span>Yazdır / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Tamam
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
