'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Layers, 
  Sparkles, 
  Check, 
  X, 
  Printer, 
  User, 
  FileSpreadsheet,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/lib/types';
import { 
  updateApplicationStatus, 
  toggleAttendance, 
  exportApplicationsToExcel,
  getStoredApplications,
  syncApplicationsWithSupabase 
} from '@/lib/storage';
import QrTicketModal from '@/components/QrTicketModal';

interface DelegatesManagerProps {
  applications?: Application[];
  onApplicationsChange?: (updated: Application[]) => void;
}

export default function DelegatesManager({
  applications: propApps,
  onApplicationsChange
}: DelegatesManagerProps = {}) {
  const [internalApps, setInternalApps] = useState<Application[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshFromCloud = async () => {
    setIsSyncing(true);
    try {
      const synced = await syncApplicationsWithSupabase();
      setInternalApps(synced);
      if (onApplicationsChange) {
        onApplicationsChange(synced);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!propApps) {
      setInternalApps(getStoredApplications());
      refreshFromCloud();
      const handleAuth = () => setInternalApps(getStoredApplications());
      window.addEventListener('igm_auth_change', handleAuth);
      window.addEventListener('igm_applications_updated', handleAuth);
      return () => {
        window.removeEventListener('igm_auth_change', handleAuth);
        window.removeEventListener('igm_applications_updated', handleAuth);
      };
    }
  }, [propApps]);

  const applications = propApps || internalApps;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [commissionFilter, setCommissionFilter] = useState<string>('all');
  const [attendanceDayFilter, setAttendanceDayFilter] = useState<string>('all');

  // Modal States
  const [selectedDetailApp, setSelectedDetailApp] = useState<Application | null>(null);
  const [ticketModalApp, setTicketModalApp] = useState<Application | null>(null);
  const [detailQrDataUrl, setDetailQrDataUrl] = useState<string>('');
  const [showDetailPassword, setShowDetailPassword] = useState(false);

  // Generate QR Code for detail modal
  useEffect(() => {
    if (selectedDetailApp?.qrCodeId) {
      QRCode.toDataURL(
        selectedDetailApp.qrCodeId,
        {
          width: 240,
          margin: 2,
          color: { dark: '#061A33', light: '#ffffff' }
        },
        (err, url) => {
          if (!err && url) setDetailQrDataUrl(url);
        }
      );
    } else {
      setDetailQrDataUrl('');
    }
  }, [selectedDetailApp]);

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const updated = updateApplicationStatus(id, newStatus);
    if (onApplicationsChange) {
      onApplicationsChange(updated);
    } else {
      setInternalApps(updated);
    }
    if (selectedDetailApp && selectedDetailApp.id === id) {
      setSelectedDetailApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAttendanceToggle = (id: string, day: string) => {
    const updatedApp = toggleAttendance(id, day);
    const updated = getStoredApplications();
    if (onApplicationsChange) {
      onApplicationsChange(updated);
    } else {
      setInternalApps(updated);
    }
    if (selectedDetailApp && selectedDetailApp.id === id && updatedApp) {
      setSelectedDetailApp(updatedApp);
    }
  };

  // Filtered List
  const filteredApplications = applications.filter((app) => {
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchCommission = 
      commissionFilter === 'all' || 
      app.commissionId === commissionFilter || 
      app.secondChoiceId === commissionFilter;
    const matchAttendance = 
      attendanceDayFilter === 'all' || 
      (app.attendanceDays || []).includes(attendanceDayFilter);

    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      app.fullName.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.phone.includes(query) ||
      app.identityNo.includes(query) ||
      app.qrCodeId.toLowerCase().includes(query) ||
      app.school.toLowerCase().includes(query) ||
      (app.city && app.city.toLowerCase().includes(query));

    return matchStatus && matchCommission && matchAttendance && matchSearch;
  });

  const commissionsList = [
    { id: 'adalet', name: 'Adalet' },
    { id: 'anayasa', name: 'Anayasa' },
    { id: 'disisleri', name: 'Dışişleri' },
    { id: 'icisleri', name: 'İçişleri' },
    { id: 'saglik', name: 'Sağlık' },
    { id: 'milli-savunma', name: 'Milli Savunma' },
    { id: 'milli-egitim', name: 'Milli Eğitim' },
    { id: 'din-isleri', name: 'Din İşleri' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* FILTER & SEARCH CONTROLS BAR */}
      <div className="p-6 rounded-3xl bg-[#091e36] border border-[#143761] shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4DA3FF]" />
              <span>Delege & Başvuru Yönetim Merkezi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Katılımcı başvurularını inceleyin, durumlarını onaylayın ve QR biletlerini görüntüleyin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">
              Filtrelenen: {filteredApplications.length} / {applications.length}
            </span>
            <button
              onClick={refreshFromCloud}
              disabled={isSyncing}
              title="Supabase bulut veritabanından en güncel başvuruları çek"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e3158] hover:bg-[#144277] border border-[#4DA3FF]/30 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4DA3FF] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Yenileniyor...' : 'Buluttan Yenile'}</span>
            </button>
            <button
              onClick={() => exportApplicationsToExcel(applications)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel İndir</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İsim, okul, şehir, TC veya QR ID..."
              className="w-full bg-[#061527] border border-[#143761] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#061527] border border-[#143761] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DA3FF] cursor-pointer"
          >
            <option value="all">Tüm Başvuru Durumları</option>
            <option value="approved">Yalnızca Onaylananlar (Onaylı)</option>
            <option value="pending">İnceleme Bekleyenler (Beklemede)</option>
            <option value="rejected">Reddedilen Başvurular</option>
          </select>

          {/* Commission Filter */}
          <select
            value={commissionFilter}
            onChange={(e) => setCommissionFilter(e.target.value)}
            className="bg-[#061527] border border-[#143761] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DA3FF] cursor-pointer"
          >
            <option value="all">Tüm Komisyonlar (8 Masa)</option>
            {commissionsList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} Komisyonu
              </option>
            ))}
          </select>

          {/* Attendance Day Filter */}
          <select
            value={attendanceDayFilter}
            onChange={(e) => setAttendanceDayFilter(e.target.value)}
            className="bg-[#061527] border border-[#143761] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DA3FF] cursor-pointer"
          >
            <option value="all">Tüm Yoklama Durumları</option>
            <option value="23 Ekim">23 Ekim (1. Gün Katılanlar)</option>
            <option value="24 Ekim">24 Ekim (2. Gün Katılanlar)</option>
            <option value="25 Ekim">25 Ekim (3. Gün Katılanlar)</option>
          </select>
        </div>
      </div>

      {/* APPLICATIONS MAIN TABLE */}
      <div className="rounded-3xl bg-[#091e36] border border-[#143761] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#061527] text-slate-400 border-b border-white/10 font-semibold">
              <tr>
                <th className="p-3.5">İsim & QR ID</th>
                <th className="p-3.5">Komisyon</th>
                <th className="p-3.5">Okuduğu Şehir & Okul</th>
                <th className="p-3.5">İletişim Bilgileri</th>
                <th className="p-3.5 text-center">Onay Durumu</th>
                <th className="p-3.5 text-center">Yoklama Durumu</th>
                <th className="p-3.5 text-center">Başvuru Tarihi</th>
                <th className="p-3.5 text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    Arama kriterlerinize uygun delege başvurusu bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#0c284a] transition-colors">
                    {/* 1. İsim & Avatar */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#061527] border border-[#4DA3FF]/30 text-[#4DA3FF] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm">
                          {app.avatarUrl ? (
                            <img src={app.avatarUrl} alt={app.fullName} className="w-full h-full object-cover" />
                          ) : (
                            app.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white font-serif text-sm">{app.fullName}</div>
                          <span className="font-mono text-[10px] text-[#4DA3FF]">{app.qrCodeId}</span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Komisyon */}
                    <td className="p-3.5">
                      <span className="font-semibold text-white uppercase bg-[#061527] px-2.5 py-1 rounded-lg border border-[#143761] text-[11px] inline-block">
                        {app.commissionId}
                      </span>
                      {app.secondChoiceId && (
                        <span className="text-[10px] text-slate-400 block mt-0.5 uppercase">
                          2. {app.secondChoiceId}
                        </span>
                      )}
                    </td>

                    {/* 3. Okuduğu Şehir & Okul */}
                    <td className="p-3.5">
                      <div className="text-white font-medium truncate max-w-xs">{app.school}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-xs">
                        {app.department} • <span className="text-[#4DA3FF] font-semibold">{app.city || 'Konya'}</span>
                      </div>
                    </td>

                    {/* 4. İletişim */}
                    <td className="p-3.5">
                      <div className="text-white font-mono">{app.phone}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-[150px]">{app.email}</div>
                    </td>

                    {/* 5. Onay Durumu */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            app.status === 'approved'
                              ? 'bg-emerald-400'
                              : app.status === 'pending'
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                        />
                        <span>
                          {app.status === 'approved'
                            ? 'ONAYLANDI'
                            : app.status === 'pending'
                            ? 'BEKLEMEDE'
                            : 'REDDEDİLDİ'}
                        </span>
                      </span>
                    </td>

                    {/* 6. 3 Günlük Yoklama Durumu */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-1 bg-[#061527] p-1 rounded-xl border border-[#143761]">
                        {['23 Ekim', '24 Ekim', '25 Ekim'].map((d) => {
                          const has = (app.attendanceDays || []).includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => handleAttendanceToggle(app.id, d)}
                              className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                                has
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                              }`}
                              title={`${d} yoklamasını aç/kapat`}
                            >
                              {d.split(' ')[0]}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* 7. Başvuru Tarihi */}
                    <td className="p-3.5 text-center text-slate-400 text-[11px]">
                      {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                    </td>

                    {/* 8. Aksiyon Butonları */}
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Tüm Bilgileri Göster Button */}
                        <button
                          onClick={() => setSelectedDetailApp(app)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#061527] hover:bg-[#103b6d] border border-[#4DA3FF]/40 text-[#4DA3FF] text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                          title="Tüm başvuru detaylarını ve QR kodu aç"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tüm Bilgileri Göster</span>
                        </button>

                        {/* QR Kodumu Göster Hızlı Butonu */}
                        <button
                          onClick={() => setTicketModalApp(app)}
                          className="p-1.5 rounded-lg bg-[#061527] hover:bg-[#103b6d] text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                          title="QR Kodumu Göster (Hızlı Bilet)"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* Onayla / Reddet Inline Hızlı Aksiyonlar */}
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'approved')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Başvuruyu Onayla"
                          >
                            Onayla
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Başvuruyu Reddet"
                          >
                            Reddet
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAY MODALI: TÜM BİLGİLERİ GÖSTER */}
      {selectedDetailApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#092746] border border-[#4DA3FF]/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/40 text-[#4DA3FF] flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden shadow-md">
                  {selectedDetailApp.avatarUrl ? (
                    <img src={selectedDetailApp.avatarUrl} alt={selectedDetailApp.fullName} className="w-full h-full object-cover" />
                  ) : (
                    selectedDetailApp.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-serif font-bold text-white">{selectedDetailApp.fullName}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedDetailApp.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : selectedDetailApp.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {selectedDetailApp.status === 'approved' ? 'ONAYLANDI' : selectedDetailApp.status === 'pending' ? 'BEKLEMEDE' : 'REDDEDİLDİ'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Delege Kodu: <span className="font-mono text-[#4DA3FF] font-semibold">{selectedDetailApp.qrCodeId}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetailApp(null)}
                className="p-2 rounded-xl bg-[#061A33] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">Başvuru Değerlendirmesi:</span>
                {selectedDetailApp.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedDetailApp.id, 'approved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    Başvuruyu Onayla
                  </button>
                )}
                {selectedDetailApp.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedDetailApp.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    Başvuruyu Reddet
                  </button>
                )}
                {selectedDetailApp.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange(selectedDetailApp.id, 'pending')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    Beklemeye Al
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setTicketModalApp(selectedDetailApp);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c2b4c] border border-[#4DA3FF]/30 text-[#4DA3FF] text-xs font-bold hover:bg-[#103a66] cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Bileti Yazdır & QR İndir</span>
              </button>
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Personal */}
              <div className="p-4 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-2.5">
                <h4 className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Kişisel & İletişim Bilgileri
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Adı Soyadı:</span>
                    <span className="font-semibold text-white">{selectedDetailApp.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">T.C. / Öğrenci No:</span>
                    <span className="font-mono text-white">{selectedDetailApp.identityNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">E-Posta:</span>
                    <span className="font-medium text-white">{selectedDetailApp.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Telefon:</span>
                    <span className="font-medium text-white">{selectedDetailApp.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Okuduğu Şehir:</span>
                    <span className="font-medium text-[#4DA3FF]">{selectedDetailApp.city || 'Konya'}</span>
                  </div>
                </div>
              </div>

              {/* Education & Commission */}
              <div className="p-4 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-2.5">
                <h4 className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Eğitim & Komisyon Tercihleri
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Üniversite / Okul:</span>
                    <span className="font-semibold text-white">{selectedDetailApp.school}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Bölüm / Sınıf:</span>
                    <span className="font-medium text-white">{selectedDetailApp.department || 'Genel'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">1. Tercih Komisyon:</span>
                    <span className="font-bold text-[#4DA3FF] uppercase">{selectedDetailApp.commissionId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">2. Tercih Komisyon:</span>
                    <span className="font-medium text-slate-300 uppercase">{selectedDetailApp.secondChoiceId || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Başvuru Tarihi:</span>
                    <span className="font-medium text-slate-300">
                      {new Date(selectedDetailApp.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password & Security Card */}
            <div className="p-4 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/25 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">6 Haneli Giriş Şifresi</h4>
                  <p className="text-[11px] text-slate-400">Katılımcının sisteme ve oturumlara giriş şifresi</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-base tracking-[0.25em] text-[#4DA3FF] font-bold bg-[#092746] px-3 py-1 rounded-xl border border-[#4DA3FF]/30">
                  {showDetailPassword ? selectedDetailApp.password || '123456' : '••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowDetailPassword(!showDetailPassword)}
                  className="p-1.5 rounded-lg bg-[#092746] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showDetailPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                >
                  {showDetailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Attendance & QR Canvas Box */}
            <div className="p-5 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-8 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>3 Günlük Oturum Yoklama Takibi</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aşağıdaki gün butonlarına tıklayarak delegenin yoklamasını el ile ekleyebilir veya kaldırabilirsiniz.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['23 Ekim', '24 Ekim', '25 Ekim'].map((day) => {
                    const attended = (selectedDetailApp.attendanceDays || []).includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleAttendanceToggle(selectedDetailApp.id, day)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          attended
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                            : 'bg-[#091e36] text-slate-400 hover:text-white border border-[#143761]'
                        }`}
                      >
                        <CheckCircle className={`w-3.5 h-3.5 ${attended ? 'text-white' : 'text-slate-500'}`} />
                        <span>{day} {attended ? '(Katıldı ✓)' : '(Yok)'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#092746] border border-[#143761]">
                {detailQrDataUrl ? (
                  <img src={detailQrDataUrl} alt="QR Bilet" className="w-28 h-28 rounded-xl bg-white p-1" />
                ) : (
                  <div className="w-28 h-28 bg-white/10 rounded-xl flex items-center justify-center text-[10px] text-slate-400">
                    QR Bekleniyor
                  </div>
                )}
                <span className="font-mono text-[10px] text-[#4DA3FF] mt-2 font-bold">{selectedDetailApp.qrCodeId}</span>
              </div>
            </div>

            {/* Motivation / Bill Proposal Full Text */}
            <div className="p-5 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#4DA3FF]" />
                <span>Motivasyon & Yasa Tasarısı / Fikir Önerisi (Tam Metin)</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic whitespace-pre-line bg-[#092746]/70 p-4 rounded-xl border border-white/5">
                "{selectedDetailApp.motivation || 'Katılım motivasyonu belirtilmedi.'}"
              </p>
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDetailApp(null)}
                className="px-6 py-2.5 rounded-xl bg-[#061A33] hover:bg-[#0c2b4c] text-white text-xs font-bold border border-[#4DA3FF]/30 transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Ticket Modal */}
      <QrTicketModal
        application={ticketModalApp}
        isOpen={Boolean(ticketModalApp)}
        onClose={() => setTicketModalApp(null)}
      />

    </div>
  );
}
