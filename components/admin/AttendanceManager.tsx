'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Users, 
  Calendar, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  FileText,
  Building2,
  Printer,
  ChevronDown
} from 'lucide-react';
import jsQR from 'jsqr';
import { Application } from '@/lib/types';
import { 
  getStoredApplications, 
  recordAttendanceWithTimestamp, 
  toggleAttendance, 
  findApplicationByQr,
  syncApplicationsWithSupabase 
} from '@/lib/storage';
import { COMMISSIONS } from '@/lib/data';

interface ScanHistoryItem {
  id: string;
  name: string;
  commission: string;
  qrId: string;
  time: string;
  status: 'success' | 'duplicate' | 'not_found' | 'not_approved' | 'inactive';
  message: string;
}

const EVENT_DAYS = ['23 Ekim', '24 Ekim', '25 Ekim'] as const;
type EventDay = typeof EVENT_DAYS[number];

export default function AttendanceManager({ onGoToReports }: { onGoToReports?: () => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedDay, setSelectedDay] = useState<EventDay>('23 Ekim');
  const [selectedSession, setSelectedSession] = useState<string>('Genel Oturum');
  const [viewMode, setViewMode] = useState<'qr_station' | 'manual_table'>('qr_station');

  // Sound Feedback
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Manual List Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionFilter, setCommissionFilter] = useState('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'ATTENDED' | 'ABSENT'>('ALL');

  // Scanner State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [lastScannedResult, setLastScannedResult] = useState<{
    delegate?: Application;
    type: 'success' | 'duplicate' | 'not_found' | 'not_approved' | 'inactive';
    message: string;
    scannedCode: string;
  } | null>(null);

  // Scan History Logs
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  // Video & Canvas Refs for live scanning
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastScannedCodeRef = useRef<{ code: string; time: number } | null>(null);

  const loadData = () => {
    setApplications(getStoredApplications());
    syncApplicationsWithSupabase().then((synced) => {
      if (synced) setApplications(synced);
    });
  };

  useEffect(() => {
    loadData();
    const handleAuth = () => loadData();
    window.addEventListener('igm_auth_change', handleAuth);
    window.addEventListener('igm_applications_updated', handleAuth);
    return () => {
      window.removeEventListener('igm_auth_change', handleAuth);
      window.removeEventListener('igm_applications_updated', handleAuth);
      stopCamera();
    };
  }, []);

  // Web Audio Synthesizer Tone Feedback
  const playTone = (type: 'success' | 'duplicate' | 'error') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'duplicate') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Audio not supported or blocked
    }
  };

  // Process a Scanned QR Code or Token
  const handleProcessCode = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    const res = recordAttendanceWithTimestamp(cleanCode, selectedDay, selectedSession, 'Divan Admin');

    const historyItem: ScanHistoryItem = {
      id: `scan-${Date.now()}`,
      name: res.user?.fullName || 'Bilinmeyen Kullanıcı',
      commission: res.user?.commissionId ? res.user.commissionId.toUpperCase() : '-',
      qrId: res.user?.qrCodeId || cleanCode,
      time: new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()),
      status: res.code,
      message: res.message
    };

    setScanHistory((prev) => [historyItem, ...prev.slice(0, 19)]);

    if (res.success) {
      playTone('success');
      setLastScannedResult({
        delegate: res.user,
        type: 'success',
        message: res.message,
        scannedCode: cleanCode
      });
      loadData();
    } else if (res.code === 'duplicate') {
      playTone('duplicate');
      setLastScannedResult({
        delegate: res.user,
        type: 'duplicate',
        message: res.message,
        scannedCode: cleanCode
      });
    } else {
      playTone('error');
      setLastScannedResult({
        delegate: res.user,
        type: res.code,
        message: res.message,
        scannedCode: cleanCode
      });
    }

    setManualCodeInput('');
  };

  // Camera Scanning Logic using jsQR
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      setCameraError('Kameraya erişilemedi. Lütfen tarayıcı izinlerini kontrol ediniz veya manuel kod giriniz.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (qrCode && qrCode.data) {
            const now = Date.now();
            const last = lastScannedCodeRef.current;
            // Debounce: don't process same code within 3 seconds
            if (!last || last.code !== qrCode.data || now - last.time > 3000) {
              lastScannedCodeRef.current = { code: qrCode.data, time: now };
              handleProcessCode(qrCode.data);
            }
          }
        }
      }
    }
    if (isCameraActive) {
      animFrameIdRef.current = requestAnimationFrame(tickScan);
    }
  };

  // Stats Calculation
  const approvedDelegates = applications.filter((a) => a.status === 'approved');
  const totalApproved = approvedDelegates.length;

  const dayStats = EVENT_DAYS.map((day) => {
    const attended = approvedDelegates.filter((a) => (a.attendanceDays || []).includes(day)).length;
    const rate = totalApproved > 0 ? Math.round((attended / totalApproved) * 100) : 0;
    return { day, attended, absent: totalApproved - attended, rate };
  });

  // Manual List Filtering
  const filteredDelegates = approvedDelegates.filter((app) => {
    if (commissionFilter !== 'ALL' && app.commissionId !== commissionFilter) return false;
    const hasAttended = (app.attendanceDays || []).includes(selectedDay);
    if (attendanceFilter === 'ATTENDED' && !hasAttended) return false;
    if (attendanceFilter === 'ABSENT' && hasAttended) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.fullName.toLowerCase().includes(q);
      const matchEmail = app.email.toLowerCase().includes(q);
      const matchQr = (app.qrCodeId || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchQr) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              Yoklama İstasyonu
            </span>
            <span className="text-xs text-slate-400">Canlı QR Okutma & Katılım Takibi</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <QrCode className="w-6 h-6 text-[#1E6FFB]" />
            QR Yoklama ve Akreditasyon
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Delege QR kodunu kamera veya barkod okuyucu ile taratın. Mükerrer yoklamalar sistem tarafından otomatik engellenir.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Ses Açık' : 'Sessiz'}</span>
          </button>

          {/* Go to PDF Reports */}
          {onGoToReports && (
            <button
              onClick={onGoToReports}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              PDF Raporu Oluştur
            </button>
          )}
        </div>
      </div>

      {/* 2. 3-DAY SELECTION TABS WITH STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dayStats.map((stat, idx) => {
          const isSelected = selectedDay === stat.day;
          return (
            <div
              key={stat.day}
              onClick={() => setSelectedDay(stat.day)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#1E6FFB] shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-[#1E6FFB] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{stat.day}</h4>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    Aktif Gün
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mt-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Katılan</span>
                  <span className="text-lg font-bold text-emerald-600">{stat.attended}</span>
                  <span className="text-slate-400 text-[10px] ml-1">/ {totalApproved}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Katılım Oranı</span>
                  <span className="text-lg font-bold text-slate-900">%{stat.rate}</span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-[#1E6FFB] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${stat.rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MODE SWITCH: QR STATION vs MANUEL TABLE */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('qr_station')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'qr_station'
                ? 'bg-[#1E6FFB] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Canlı QR Tarayıcı İstasyonu
          </button>
          <button
            onClick={() => setViewMode('manual_table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'manual_table'
                ? 'bg-[#1E6FFB] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Manuel Yoklama Listesi ({filteredDelegates.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Seçili Gün: <strong className="text-slate-800">{selectedDay}</strong>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. VIEW MODE: QR STATION (SCANNER + INSTANT RESULT + SCAN HISTORY)        */}
      {/* ========================================================================= */}
      {viewMode === 'qr_station' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Top: Scanner Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  Kamera ile Canlı QR Okuma
                </h3>
                {isCameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Kamerayı Durdur
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-[#1E6FFB] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    Kamerayı Başlat
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Video Scanner Canvas */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-800">
                <video ref={videoRef} className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`} />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                  <div className="text-center p-6 text-slate-400">
                    <QrCode className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                    <p className="text-xs font-semibold">Kamera kapalı</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kamera ile okutmak için “Kamerayı Başlat” butonuna tıklayınız.
                    </p>
                  </div>
                )}

                {/* Target overlay guide */}
                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-blue-500/80 rounded-2xl ring-4 ring-black/40 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Manual Code / Barcode Scanner Input */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Veya Barkod Okuyucu / Manuel QR Kodu Girişi
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProcessCode(manualCodeInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Örn: IGM26-ADA-1234 veya T.C. No / E-Posta..."
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E6FFB]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Yoklama Al
                  </button>
                </form>
              </div>
            </div>

            {/* Instant Result Box */}
            {lastScannedResult && (
              <div className={`p-5 rounded-2xl border text-xs transition-all ${
                lastScannedResult.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : lastScannedResult.type === 'duplicate'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    lastScannedResult.type === 'success'
                      ? 'bg-emerald-200 text-emerald-800'
                      : lastScannedResult.type === 'duplicate'
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-rose-200 text-rose-800'
                  }`}>
                    {lastScannedResult.type === 'success' && <Check className="w-5 h-5" />}
                    {lastScannedResult.type === 'duplicate' && <Clock className="w-5 h-5" />}
                    {(lastScannedResult.type === 'not_found' || lastScannedResult.type === 'not_approved' || lastScannedResult.type === 'inactive') && (
                      <X className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      {lastScannedResult.type === 'success'
                        ? 'Yoklama Başarıyla Alındı!'
                        : lastScannedResult.type === 'duplicate'
                        ? 'Mükerrer Yoklama Bildirimi'
                        : 'Yoklama Kaydedilemedi'}
                    </h4>
                    <p className="mt-1 font-medium">{lastScannedResult.message}</p>
                    {lastScannedResult.delegate && (
                      <div className="mt-2 pt-2 border-t border-black/10 flex flex-wrap gap-4 text-[11px]">
                        <span><strong>Delege:</strong> {lastScannedResult.delegate.fullName}</span>
                        <span><strong>Komisyon:</strong> {lastScannedResult.delegate.commissionId.toUpperCase()}</span>
                        <span><strong>Okul:</strong> {lastScannedResult.delegate.school}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Scan Feed Log (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Anlık Okutma Akışı ({scanHistory.length})
              </h3>
              <button
                onClick={() => setScanHistory([])}
                className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Akışı Temizle
              </button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px]">
              {scanHistory.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-slate-400 text-xs italic">
                  Henüz QR okutma yapılmadı.
                </div>
              ) : (
                scanHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      item.status === 'success'
                        ? 'bg-emerald-50/50 border-emerald-100'
                        : item.status === 'duplicate'
                        ? 'bg-amber-50/50 border-amber-100'
                        : 'bg-rose-50/50 border-rose-100'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-blue-600">{item.commission}</span>
                        <span>•</span>
                        <span className="font-mono">{item.qrId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'duplicate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status === 'success' ? 'Katıldı' : item.status === 'duplicate' ? 'Mükerrer' : 'Hata'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">{item.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VIEW MODE: MANUAL ATTENDANCE TABLE                                     */}
      {/* ========================================================================= */}
      {viewMode === 'manual_table' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
              <input
                type="text"
                placeholder="İsim, e-posta veya QR ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1E6FFB] text-slate-800"
              />

              <select
                value={commissionFilter}
                onChange={(e) => setCommissionFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1E6FFB] text-slate-800"
              >
                <option value="ALL">Tüm Komisyonlar</option>
                {COMMISSIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1E6FFB] text-slate-800"
              >
                <option value="ALL">Tümü (Katılan & Gelmeyen)</option>
                <option value="ATTENDED">Yalnızca Katılanlar</option>
                <option value="ABSENT">Yalnızca Gelmeyenler</option>
              </select>
            </div>

            <div className="text-right text-slate-500">
              Bulunan: <strong className="text-slate-800">{filteredDelegates.length}</strong> Delege
            </div>
          </div>

          {/* Manual Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                    <th className="py-3 px-4">Delege Adı Soyadı</th>
                    <th className="py-3 px-4">QR Kod ID</th>
                    <th className="py-3 px-4">Komisyon</th>
                    <th className="py-3 px-4">Üniversite</th>
                    <th className="py-3 px-4 text-center">Yoklama Durumu ({selectedDay})</th>
                    <th className="py-3 px-4 text-right">Manuel İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDelegates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                        Kriterlere uygun onaylı delege bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredDelegates.map((app) => {
                      const hasAttended = (app.attendanceDays || []).includes(selectedDay);
                      return (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{app.fullName}</span>
                            <span className="text-[10px] text-slate-400">{app.email}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {app.qrCodeId}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-blue-600">{app.commissionId.toUpperCase()}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-[160px] truncate">
                            {app.school}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              hasAttended
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              {hasAttended ? '✓ Katıldı' : '✗ Gelmedi'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                toggleAttendance(app.id, selectedDay);
                                loadData();
                              }}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
                                hasAttended
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {hasAttended ? 'Katılımı İptal Et' : 'Katıldı Olarak İşaretle'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
