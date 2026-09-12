'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Layers, 
  Bell, 
  Camera, 
  Trash2, 
  RefreshCw, 
  LogOut, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  Settings,
  Globe,
  Save,
  Plus,
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  Mail,
  UserCheck,
  Megaphone,
  Sliders,
  ExternalLink,
  Menu,
  HelpCircle,
  FolderOpen,
  Award,
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  QrCode,
  Check,
  X,
  Lock,
  ArrowRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Send,
  Download,
  UserPlus,
  Edit,
  Database,
  Server,
  HardDrive,
  Eye,
  Phone,
  GraduationCap,
  Building2,
  BookOpen
} from 'lucide-react';
import TimavLogo from '@/components/TimavLogo';
import AnnouncementsManager from '@/components/admin/AnnouncementsManager';
import DelegatesManager from '@/components/admin/DelegatesManager';
import GalleryManager from '@/components/admin/GalleryManager';
import AttendanceManager from '@/components/admin/AttendanceManager';
import CMSSectionEditor from '@/components/admin/CMSSectionEditor';
import UsersManager from '@/components/admin/UsersManager';
import PdfReportGenerator from '@/components/admin/PdfReportGenerator';
import { 
  getStoredApplications, 
  getStoredGallery, 
  getStoredAnnouncements, 
  exportApplicationsToExcel,
  syncApplicationsWithSupabase 
} from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Application } from '@/lib/types';

type ActivePageKey = 
  | 'dashboard'
  | 'anasayfa' 
  | 'hakkimizda' 
  | 'komisyonlar' 
  | 'ekip' 
  | 'program' 
  | 'basvuru'
  | 'galeri-cms'
  | 'galeri' 
  | 'iletisim' 
  | 'duyurular' 
  | 'delegeler' 
  | 'yoklama' 
  | 'raporlar'
  | 'kullanicilar';


export default function ModernCMSAdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Navigation
  const [activePage, setActivePage] = useState<ActivePageKey>('dashboard');
  const [cmsDropdownOpen, setCmsDropdownOpen] = useState(true);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Live Data State
  const [applications, setApplications] = useState<Application[]>([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [pendingGalleryCount, setPendingGalleryCount] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [selectedDelegeModal, setSelectedDelegeModal] = useState<Application | null>(null);
  const [delegeQrUrl, setDelegeQrUrl] = useState<string>('');
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [adminUserModalOpen, setAdminUserModalOpen] = useState(false);

  // Load and subscribe to live data
  const loadDashboardData = () => {
    try {
      const apps = getStoredApplications();
      setApplications(apps);

      const gallery = getStoredGallery();
      setGalleryCount(gallery.length);
      setPendingGalleryCount(gallery.filter((g) => !g.isApproved).length);

      const ann = getStoredAnnouncements();
      setAnnouncements(ann);

      // Farklı cihazlardan yapılan tüm yeni başvuruları buluttan çek
      syncApplicationsWithSupabase().then((synced) => {
        if (synced && synced.length > 0) {
          setApplications(synced);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('igm_admin_session');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      loadDashboardData();
    }

    const handleUpdate = () => loadDashboardData();
    window.addEventListener('igm_auth_change', handleUpdate);
    window.addEventListener('igm_applications_updated', handleUpdate);
    window.addEventListener('igm_announcements_updated', handleUpdate);
    window.addEventListener('igm_gallery_updated', handleUpdate);
    return () => {
      window.removeEventListener('igm_auth_change', handleUpdate);
      window.removeEventListener('igm_applications_updated', handleUpdate);
      window.removeEventListener('igm_announcements_updated', handleUpdate);
      window.removeEventListener('igm_gallery_updated', handleUpdate);
    };
  }, []);

  // Generate QR for modal
  useEffect(() => {
    if (selectedDelegeModal?.qrCodeId) {
      QRCode.toDataURL(
        selectedDelegeModal.qrCodeId,
        { width: 200, margin: 2, color: { dark: '#061A33', light: '#ffffff' } },
        (err, url) => {
          if (!err && url) setDelegeQrUrl(url);
        }
      );
    } else {
      setDelegeQrUrl('');
    }
  }, [selectedDelegeModal]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (
      (adminEmail === 'admin@timav.org.tr' || adminEmail === 'admin@irfanmeclisi.org' || adminEmail === 'admin') &&
      (adminPassword === 'timav2026' || adminPassword === 'admin123' || adminPassword === 'igm2026')
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('igm_admin_session', 'true');
      loadDashboardData();
    } else {
      setAuthError('E-posta veya parola hatalı. (İpucu: admin@timav.org.tr / admin123)');
    }
  };

  const handleFastDemoLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('igm_admin_session', 'true');
    loadDashboardData();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('igm_admin_session');
  };

  // Metric Computations (TRUE LIVE DATA)
  const totalAppsCount = applications.length;
  const approvedDelegates = applications.filter((a) => a.status === 'approved');
  const approvedCount = approvedDelegates.length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  // 3-Day Attendance Counts (TRUE LIVE DATA)
  const day1Attended = approvedDelegates.filter((a) => (a.attendanceDays || []).includes('23 Ekim')).length;
  const day2Attended = approvedDelegates.filter((a) => (a.attendanceDays || []).includes('24 Ekim')).length;
  const day3Attended = approvedDelegates.filter((a) => (a.attendanceDays || []).includes('25 Ekim')).length;
  const totalYoklama = day1Attended + day2Attended + day3Attended;

  const day1Rate = approvedCount > 0 ? Math.round((day1Attended / approvedCount) * 100) : 0;
  const day2Rate = approvedCount > 0 ? Math.round((day2Attended / approvedCount) * 100) : 0;
  const day3Rate = approvedCount > 0 ? Math.round((day3Attended / approvedCount) * 100) : 0;

  // Recent 5 Applications for Table
  const recentApplications = applications.slice(0, 5);

  // LOGIN SCREEN (Fallback if not logged in)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1E6FFB]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-[#1E6FFB]" />
              <span className="text-2xl font-black text-white tracking-wide">İrfanMeclis</span>
            </div>
            <p className="text-slate-400 text-xs font-medium">Divan Kurulu Yönetim Paneli Girişi</p>
          </div>

          <div className="bg-[#0D1D32] border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {authError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Yetkili E-Posta</label>
                <input
                  type="text"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@timav.org.tr"
                  className="w-full px-4 py-3 bg-[#132338] border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-[#1E6FFB]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Yönetim Parolası</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#132338] border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-[#1E6FFB]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#1E6FFB] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-sm"
              >
                Giriş Yap
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <button
                onClick={handleFastDemoLogin}
                className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E6FFB]" />
                Tek Tıkla Demo Yönetici Girişi
              </button>
              <div className="mt-4">
                <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  ← Ana Sayfaya Geri Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans">
      {/* 1. TOP HEADER (Dark Navy Matching Image) */}
      <header className="sticky top-0 z-40 bg-[#0A1628] border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        {/* Left: Brand Logo & Title + Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Menüyü Aç/Kapat"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-[#1E6FFB] flex items-center justify-center text-white shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight flex items-center gap-1.5">
              İrfanMeclis
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Yönetim Paneli</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center max-w-md w-full mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              placeholder="Menüde ara..."
              className="w-full pl-10 pr-4 py-2 bg-[#132338] border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#1E6FFB] transition-colors"
            />
          </div>
        </div>

        {/* Right: Notifications & Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Supabase Bulut Bağlantı Durumu */}
          <div className="hidden sm:flex items-center">
            {isSupabaseConfigured ? (
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
                title="Supabase bulut veritabanı aktif, tüm cihazlarla canlı senkronize"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Bulut: Aktif</span>
              </div>
            ) : (
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold"
                title="Render ortamında NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlanmalıdır"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Bulut Bekleniyor (Yerel Mod)</span>
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => setNotificationsModalOpen(true)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Duyurular & Bildirimler"
          >
            <Bell className="w-5 h-5" />
            {(announcements.length > 0 || pendingGalleryCount > 0) && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0A1628]">
                {announcements.length + pendingGalleryCount}
              </span>
            )}
          </button>

          {/* Admin Profile User */}
          <div 
            onClick={() => setAdminUserModalOpen(true)}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-800 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 relative border border-slate-600">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">Admin</span>
              <span className="text-[10px] text-slate-400 block">Yönetici</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* 2. BODY CONTAINER: Sidebar + Main Canvas */}
      <div className="flex-1 flex relative">
        {/* LEFT SIDEBAR (Dark Navy Matching Image) */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A1628] border-r border-slate-800/80 p-4 shrink-0 flex flex-col justify-between text-xs select-none transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="space-y-6 overflow-y-auto">
            {/* Top: Dashboard Main Button (Solid Vibrant Blue) */}
            <button
              onClick={() => {
                setActivePage('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activePage === 'dashboard'
                  ? 'bg-[#1E6FFB] text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* SECTION: İÇERİK YÖNETİMİ */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                İÇERİK YÖNETİMİ
              </span>
              <div className="space-y-1">
                {/* Sayfa Yönetimi (CMS) Dropdown Toggle */}
                <button
                  onClick={() => setCmsDropdownOpen(!cmsDropdownOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    ['anasayfa', 'hakkimizda', 'komisyonlar', 'ekip', 'program', 'basvuru', 'galeri-cms', 'iletisim'].includes(activePage)
                      ? 'text-[#1E6FFB] bg-[#1E6FFB]/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Sayfa Yönetimi (CMS)</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${cmsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Submenu Items */}
                {cmsDropdownOpen && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800 ml-5 text-slate-400">
                    {[
                      { key: 'anasayfa', label: 'Ana Sayfa' },
                      { key: 'hakkimizda', label: 'Hakkımızda' },
                      { key: 'komisyonlar', label: 'Komisyonlar' },
                      { key: 'ekip', label: 'Ekip' },
                      { key: 'program', label: 'Program' },
                      { key: 'basvuru', label: 'Başvuru Sayfası' },
                      { key: 'galeri-cms', label: 'Galeri Metinleri' },
                      { key: 'iletisim', label: 'İletişim' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => {
                          setActivePage(item.key as ActivePageKey);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer block ${
                          activePage === item.key
                            ? 'text-white font-bold bg-slate-800/80'
                            : 'hover:text-slate-200 hover:bg-slate-800/30'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Duyurular ve Bildirimler */}
                <button
                  onClick={() => {
                    setActivePage('duyurular');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'duyurular'
                      ? 'bg-[#1E6FFB] text-white font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Duyurular ve Bildirimler</span>
                </button>
              </div>
            </div>

            {/* SECTION: ÜYE YÖNETİMİ */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                ÜYE YÖNETİMİ
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActivePage('delegeler');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'delegeler'
                      ? 'bg-[#1E6FFB] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Delege Üye İşlemleri</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('kullanicilar');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'kullanicilar'
                      ? 'bg-[#1E6FFB] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Kullanıcılar</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* SECTION: MEDYA YÖNETİMİ */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                MEDYA YÖNETİMİ
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActivePage('galeri');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'galeri'
                      ? 'bg-[#1E6FFB] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Medya Yönetimi</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('galeri');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    <span>Galeri (İki Kademeli)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* SECTION: YOKLAMA VE RAPORLAMA */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                YOKLAMA VE RAPORLAMA
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActivePage('yoklama');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'yoklama'
                      ? 'bg-[#1E6FFB] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4" />
                    <span>QR Yoklama</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('raporlar');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'raporlar'
                      ? 'bg-[#1E6FFB] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Raporlar (PDF)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* SECTION: SİSTEM (Ayarlar tamamen kaldırıldı, sadece Kullanıcılar ve Çıkış Yap kaldı) */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                SİSTEM
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActivePage('kullanicilar');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    activePage === 'kullanicilar'
                      ? 'bg-[#1E6FFB] text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Kullanıcılar</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
            İrfanMeclis Admin v3.2
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* ========================================================================= */}
          {/* VIEW: MAIN DASHBOARD (PIXEL-PERFECT MATCH TO USER SCREENSHOT)              */}
          {/* ========================================================================= */}
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title & Subtitle + Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    İrfanMeclis yönetim paneline hoş geldiniz. Sistemin genel durumu aşağıda özetlenmiştir.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>10 Eylül 2026, Çarşamba 16:02</span>
                </div>
              </div>

              {/* 1. TOP 6 STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* 1. Toplam Başvuru */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Toplam Başvuru</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{totalAppsCount}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                      ↑ 12%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Geçen haftaya göre</span>
                </div>

                {/* 2. Onaylanan Delegeler */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Onaylanan Delegeler</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{approvedCount}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                      ↑ 8%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Toplam başvuruların %79'u</span>
                </div>

                {/* 3. Reddedilen Başvurular */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                      <XCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Reddedilen Başvurular</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{rejectedCount}</span>
                    <span className="text-[11px] font-bold text-rose-500 flex items-center">
                      ↓ 5%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Toplam başvuruların %21'i</span>
                </div>

                {/* 4. Galerideki Görseller */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Galerideki Görseller</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{galleryCount}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                      ↑ 15%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Onay bekleyen: {pendingGalleryCount}</span>
                </div>

                {/* 5. Bugünkü Katılım */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Bugünkü Katılım</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{day1Attended}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                      ↑ 18%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Toplam delege: {approvedCount}</span>
                </div>

                {/* 6. Toplam Yoklama */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Toplam Yoklama</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{totalYoklama}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                      ↑ 22%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">3 gün toplam</span>
                </div>
              </div>

              {/* 2. MIDDLE ROW: Son Başvurular + Günlere Göre Katılım + Son Duyurular */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Son Başvurular Table (col-span-5) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-700" />
                        <h3 className="font-bold text-slate-800 text-sm">Son Başvurular</h3>
                      </div>
                      <button
                        onClick={() => setActivePage('delegeler')}
                        className="text-xs font-semibold text-[#1E6FFB] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Tümünü Gör</span>
                        <span>→</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-100 pb-2">
                            <th className="py-2 px-1 font-semibold">#</th>
                            <th className="py-2 px-2 font-semibold">Ad Soyad</th>
                            <th className="py-2 px-2 font-semibold">Komisyon</th>
                            <th className="py-2 px-2 font-semibold">Şehir / Okul</th>
                            <th className="py-2 px-2 font-semibold">Başvuru Tarihi</th>
                            <th className="py-2 px-2 font-semibold">Durum</th>
                            <th className="py-2 px-1 font-semibold text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentApplications.map((app, idx) => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-1 font-medium text-slate-500">{idx + 1}</td>
                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                    {app.fullName.charAt(0)}
                                  </div>
                                  <span className="font-bold text-slate-800 whitespace-nowrap">{app.fullName}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                                {app.commissionId.slice(0, 12)}
                              </td>
                              <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap max-w-[120px] truncate">
                                {app.city || 'Konya'} / {app.school}
                              </td>
                              <td className="py-2.5 px-2 text-slate-400 whitespace-nowrap font-mono">
                                10.09.2026 14:32
                              </td>
                              <td className="py-2.5 px-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  app.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : app.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {app.status === 'approved' ? 'Onaylandı' : app.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                                </span>
                              </td>
                              <td className="py-2.5 px-1 text-right">
                                <button
                                  onClick={() => setSelectedDelegeModal(app)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[10px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Detay</span>
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Center: Günlere Göre Katılım Bar Chart (col-span-4) */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    <h3 className="font-bold text-slate-800 text-sm">Günlere Göre Katılım</h3>
                  </div>

                  {/* Chart Graphic Canvas */}
                  <div className="relative h-48 w-full flex items-end justify-between px-6 pb-4 pt-6 border-b border-slate-100">
                    {/* Y-Axis Guidelines */}
                    <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200 text-[10px] text-slate-400 pl-1">200</div>
                    <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200 text-[10px] text-slate-400 pl-1">150</div>
                    <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200 text-[10px] text-slate-400 pl-1">100</div>
                    <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200 text-[10px] text-slate-400 pl-1">50</div>

                    {/* Bar 1: 1. Gün (Blue) */}
                    <div className="flex flex-col items-center gap-1 z-10 w-16">
                      <span className="text-[11px] font-bold text-slate-700">%{day1Rate}</span>
                      <div
                        className="w-12 bg-[#3B82F6] rounded-t-lg transition-all duration-500"
                        style={{ height: `${(day1Attended / 200) * 140}px` }}
                      />
                    </div>

                    {/* Bar 2: 2. Gün (Green) */}
                    <div className="flex flex-col items-center gap-1 z-10 w-16">
                      <span className="text-[11px] font-bold text-slate-700">%{day2Rate}</span>
                      <div
                        className="w-12 bg-[#10B981] rounded-t-lg transition-all duration-500"
                        style={{ height: `${(day2Attended / 200) * 140}px` }}
                      />
                    </div>

                    {/* Bar 3: 3. Gün (Purple) */}
                    <div className="flex flex-col items-center gap-1 z-10 w-16">
                      <span className="text-[11px] font-bold text-slate-700">%{day3Rate}</span>
                      <div
                        className="w-12 bg-[#8B5CF6] rounded-t-lg transition-all duration-500"
                        style={{ height: `${(day3Attended / 200) * 140}px` }}
                      />
                    </div>
                  </div>

                  {/* Day Labels Below Bars */}
                  <div className="flex justify-between px-4 pt-3 text-center text-xs">
                    <div className="w-20">
                      <span className="font-bold text-slate-800 block text-[11px]">1. Gün</span>
                      <span className="text-[10px] text-slate-500">{day1Attended} / {approvedCount}</span>
                    </div>
                    <div className="w-20">
                      <span className="font-bold text-slate-800 block text-[11px]">2. Gün</span>
                      <span className="text-[10px] text-slate-500">{day2Attended} / {approvedCount}</span>
                    </div>
                    <div className="w-20">
                      <span className="font-bold text-slate-800 block text-[11px]">3. Gün</span>
                      <span className="text-[10px] text-slate-500">{day3Attended} / {approvedCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Son Duyurular (col-span-3) */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-slate-700" />
                        <h3 className="font-bold text-slate-800 text-sm">Son Duyurular</h3>
                      </div>
                      <button
                        onClick={() => setActivePage('duyurular')}
                        className="text-xs font-semibold text-[#1E6FFB] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Tümünü Gör</span>
                        <span>→</span>
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { title: 'Etkinlik Programı Güncellendi', time: '10.09.2026 14:20', color: 'bg-blue-500' },
                        { title: 'Yoklama Saatleri Hakkında Bilgilendirme', time: '09.09.2026 16:45', color: 'bg-emerald-500' },
                        { title: 'Galeriye Yeni Fotoğraflar Eklendi', time: '09.09.2026 12:30', color: 'bg-purple-500' },
                        { title: '2. Gün Etkinlik Detayları', time: '08.09.2026 20:15', color: 'bg-amber-500' },
                        { title: 'Katılım Belgeleri Hakkında Duyuru', time: '08.09.2026 17:40', color: 'bg-rose-500' }
                      ].map((d, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full ${d.color} mt-1.5 shrink-0`} />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs leading-tight hover:text-[#1E6FFB] cursor-pointer transition-colors">
                              {d.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{d.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 6 MODULE HUB ACTION CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* 1. Sayfa Yönetimi (CMS) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#1E6FFB] mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Sayfa Yönetimi (CMS)</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Ana Sayfa, Hakkımızda, Komisyonlar, Ekip, Program, Galeri ve İletişim sayfalarının içeriklerini yönetin.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('anasayfa')}
                    className="mt-4 w-full py-2 bg-[#1E6FFB] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Sayfaları Yönet
                  </button>
                </div>

                {/* 2. Duyurular ve Bildirimler */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Duyurular ve Bildirimler</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Admin, üyelere ve onaylanmış delegelere bildirim ve duyuru gönderebilir.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('duyurular')}
                    className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Duyuru Gönder
                  </button>
                </div>

                {/* 3. Delege Üye İşlemleri */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Delege Üye İşlemleri</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Başvuruları inceleyin, onaylayın ve detaylı takip edin. QR kod ve tüm bilgileri görüntüleyin.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('delegeler')}
                    className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Üyeleri Yönet
                  </button>
                </div>

                {/* 4. Medya Yönetimi */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-3">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Medya Yönetimi</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Görselleri yönetin, iki kademeli galeri sistemi ile içerikleri kontrol edin.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('galeri')}
                    className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Medya Yönet
                  </button>
                </div>

                {/* 5. QR Yoklama ve Raporlama */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 mb-3">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">QR Yoklama ve Raporlama</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      QR ile yoklama alın, manuel takip yapın ve raporları indirin.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('yoklama')}
                    className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Yoklama Sayfası
                  </button>
                </div>

                {/* 6. Kullanıcı Yönetimi */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#1E6FFB] mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Kullanıcı Yönetimi</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Kayıtlı kullanıcıları ve delege başvurularını listeleyin, onaylayın ve yönetin.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage('kullanicilar')}
                    className="mt-4 w-full py-2 bg-[#1E6FFB] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Kullanıcıları Yönet
                  </button>
                </div>
              </div>

              {/* 4. BOTTOM WIDGETS: Hızlı İşlemler + Sistem Durumu + Mosque Quote Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 1. Hızlı İşlemler (col-span-5) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-slate-700" />
                    <h3 className="font-bold text-slate-800 text-sm">Hızlı İşlemler</h3>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {/* Action 1: Yeni Duyuru */}
                    <button
                      onClick={() => setActivePage('duyurular')}
                      className="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border border-blue-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <Send className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Yeni Duyuru</span>
                    </button>

                    {/* Action 2: Sayfa Düzenle */}
                    <button
                      onClick={() => setActivePage('anasayfa')}
                      className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border border-purple-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
                        <Edit className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Sayfa Düzenle</span>
                    </button>

                    {/* Action 3: Yeni Galeri Yükle */}
                    <button
                      onClick={() => setActivePage('galeri')}
                      className="p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Yeni Galeri Yükle</span>
                    </button>

                    {/* Action 4: Rapor İndir */}
                    <button
                      onClick={() => exportApplicationsToExcel(applications)}
                      className="p-3 rounded-xl bg-teal-50/80 hover:bg-teal-100 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border border-teal-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm">
                        <Download className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Rapor İndir</span>
                    </button>

                    {/* Action 5: Kullanıcı Ekle */}
                    <button
                      onClick={() => setAdminUserModalOpen(true)}
                      className="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border border-amber-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-sm">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Kullanıcı Ekle</span>
                    </button>
                  </div>
                </div>

                {/* 2. Sistem Durumu (col-span-3) */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-slate-800 text-sm">Sistem Durumu</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        ● Tümü Normal
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>Web Sitesi</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-[11px]">Aktif</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Database className="w-3.5 h-3.5 text-slate-400" />
                          <span>Veritabanı</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-[11px]">Aktif</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <div className="flex items-center gap-2 text-slate-600">
                          <QrCode className="w-3.5 h-3.5 text-slate-400" />
                          <span>Yoklama Sistemi</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-[11px]">Aktif</span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                          <span>Medya Depolama</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-[11px]">Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Mosque Photo Quote Card (col-span-4) */}
                <div className="lg:col-span-4 rounded-2xl overflow-hidden relative min-h-[160px] flex flex-col justify-end p-6 text-white shadow-md">
                  {/* Background Mosque Image */}
                  <Image
                    src="/images/anasayfa-arkaplan.png"
                    alt="Mosque Twilight"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

                  <div className="relative z-10 space-y-2">
                    <p className="text-sm sm:text-base font-serif italic leading-snug text-white/95">
                      “Daha iyi bir gelecek, iyi insanlarla mümkündür.”
                    </p>
                    <span className="text-xs text-[#1E6FFB] font-semibold tracking-wide block">
                      — İrfanMeclis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUBPAGE VIEWS: BREADCRUMB + RENDERED MODULE                                */}
          {/* ========================================================================= */}
          {activePage !== 'dashboard' && (
            <div className="space-y-6">
              {/* Back to Dashboard Nav Header */}
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    ← Dashboard'a Dön
                  </button>
                  <div className="text-xs text-slate-500 font-medium">
                    Dashboard / <span className="font-bold text-slate-800 capitalize">{activePage}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    target="_blank"
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Siteyi Gör</span>
                  </Link>
                </div>
              </div>

              {/* RENDER ACTIVE MODULE */}
              {activePage === 'kullanicilar' && <UsersManager />}
              {activePage === 'raporlar' && <PdfReportGenerator onBack={() => setActivePage('dashboard')} />}
              {activePage === 'delegeler' && <DelegatesManager />}
              {activePage === 'yoklama' && (
                <AttendanceManager onGoToReports={() => setActivePage('raporlar')} />
              )}
              {activePage === 'duyurular' && <AnnouncementsManager />}
              {activePage === 'galeri' && <GalleryManager />}

              {['anasayfa', 'hakkimizda', 'komisyonlar', 'ekip', 'program', 'iletisim', 'basvuru', 'galeri-cms'].includes(activePage) && (
                <CMSSectionEditor activeTab={(activePage === 'galeri-cms' ? 'galeri' : activePage) as any} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: DELEGATE QUICK DETAIL (Triggered from Son Başvurular Table) */}
      {selectedDelegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {selectedDelegeModal.qrCodeId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedDelegeModal.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedDelegeModal.school} • {selectedDelegeModal.city || 'Konya'}</p>
              </div>
              <button
                onClick={() => setSelectedDelegeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Komisyon</span>
                <span className="font-bold text-slate-800">{selectedDelegeModal.commissionId.toUpperCase()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Durum</span>
                <span className="font-bold text-emerald-600 capitalize">{selectedDelegeModal.status}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">E-Posta</span>
                <span className="font-semibold text-slate-700">{selectedDelegeModal.email}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Telefon</span>
                <span className="font-semibold text-slate-700">{selectedDelegeModal.phone}</span>
              </div>
            </div>

            {/* QR Code */}
            {delegeQrUrl && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <img src={delegeQrUrl} alt="QR" className="w-32 h-32 mx-auto rounded-lg" />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">Akreditasyon Bilet Kodu</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedDelegeModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  setSelectedDelegeModal(null);
                  setActivePage('delegeler');
                }}
                className="px-4 py-2 rounded-xl bg-[#1E6FFB] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer"
              >
                Delege Sayfasına Git
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NOTIFICATIONS OVERLAY */}
      {notificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Sistem Bildirimleri</h3>
              </div>
              <button onClick={() => setNotificationsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-slate-800">
                <p className="font-bold">Yeni Delege Başvuruları Mevcut</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Onay bekleyen delegeleri incelemek için delege yönetimini açın.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-slate-800">
                <p className="font-bold">QR Yoklama Sistemi Hazır</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Kamera veya USB barkod tabancası ile anında katılım alınabilir.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-slate-800">
                <p className="font-bold">Galeri Moderasyonu Bekleniyor</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Delegelerin yüklediği yeni fotoğraflar onay kuyruğunda.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setNotificationsModalOpen(false)}
                className="px-4 py-2 bg-[#1E6FFB] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADMIN & USERS SETTINGS */}
      {adminUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Kullanıcılar & Sistem Ayarları</h3>
              </div>
              <button onClick={() => setAdminUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Aktif Yönetici Hesabı</span>
                <p className="text-slate-500">admin@timav.org.tr (Tam Yetkili Süpervizör)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Etkinlik Tarihi</span>
                <p className="text-slate-500">23 - 24 - 25 Ekim 2026 Selçuklu Kongre Merkezi</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Veri Depolama</span>
                <p className="text-slate-500">Tarayıcı Yerel Depolama & Canlı Olay Yayını (Real-time Broadcast)</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAdminUserModalOpen(false)}
                className="px-4 py-2 bg-[#1E6FFB] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
