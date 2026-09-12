'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Lock, 
  QrCode, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  FileText,
  KeyRound,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import { getStoredApplications, loginParticipant, getCurrentUser, syncApplicationsWithSupabase } from '@/lib/storage';
import { Application } from '@/lib/types';
import QrTicketModal from '@/components/QrTicketModal';
import InnerPageHero from '@/components/InnerPageHero';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'uye' | 'sorgula' | 'admin'>('uye');

  // Participant Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Delege quick query state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Admin login state
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Check if already logged in as participant
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      router.push('/profil');
    }
  }, [router]);

  const handleParticipantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const email = loginEmail.trim();
    const pass = loginPassword.trim();

    if (!email || !pass) {
      setLoginError('Lütfen e-posta adresinizi ve 6 haneli şifrenizi giriniz.');
      setLoginLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(pass)) {
      setLoginError('Giriş şifreniz başvuru esnasında belirlediğiniz 6 haneli rakamlardan oluşmalıdır.');
      setLoginLoading(false);
      return;
    }

    const res = await loginParticipant(email, pass);
    if (!res.success) {
      setLoginError(res.message);
      setLoginLoading(false);
      return;
    }

    // Success -> redirect to profile
    router.push('/profil');
  };

  const handleDelegeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setFoundApp(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError('Lütfen T.C. Kimlik No, E-posta veya Telefon numaranızı giriniz.');
      return;
    }

    // Önce yerelde ara, bulunamazsa Supabase'den senkronize edip tekrar bak
    let apps = getStoredApplications();
    let match = apps.find((app) => 
      app.identityNo.toLowerCase() === query ||
      app.email.toLowerCase() === query ||
      app.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
      app.qrCodeId.toLowerCase() === query
    );

    if (!match) {
      apps = await syncApplicationsWithSupabase();
      match = apps.find((app) => 
        app.identityNo.toLowerCase() === query ||
        app.email.toLowerCase() === query ||
        app.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        app.qrCodeId.toLowerCase() === query
      );
    }

    if (match) {
      setFoundApp(match);
      setIsModalOpen(true);
    } else {
      setSearchError('Belirtilen bilgilerle eşleşen bir delege kaydı bulunamadı. Lütfen bilgilerinizi kontrol ediniz veya yeni başvuru yapınız.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    // Pre-set pass or simple pass for testing
    if (adminPassword.trim() === 'admin123' || adminPassword.trim() === 'igm2026' || adminPassword.trim() === 'timav' || adminPassword.trim() === 'timav2026') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('igm_admin_session', 'true');
      }
      router.push('/admin-igm-secret-dashboard');
    } else {
      setAdminError('Geçersiz yönetici parolası. (İpucu: admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="MECLİS GİRİŞ PORTALI"
        title="Delege Sorgulama & Yönetici Girişi"
        description="Başvuru durumunuzu kontrol edin, QR biletinizi yeniden görüntüleyin veya yönetim masasına erişim sağlayın."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Giriş Yap' }
        ]}
      />

      {/* 2. PORTAL CONTAINER */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-24">
        <div className="rounded-3xl bg-[#092746] border border-[#4DA3FF]/30 p-6 sm:p-10 shadow-2xl">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 mb-8 gap-1">
            <button
              onClick={() => setActiveTab('uye')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                activeTab === 'uye'
                  ? 'bg-[#4DA3FF] text-[#061A33] shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Delege Girişi
            </button>
            <button
              onClick={() => setActiveTab('sorgula')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                activeTab === 'sorgula'
                  ? 'bg-[#4DA3FF] text-[#061A33] shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Bilet Sorgula
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#4DA3FF] text-[#061A33] shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Divan Masası
            </button>
          </div>

          {activeTab === 'uye' ? (
            /* Tab 1: Participant Approved Member Login */
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] mx-auto mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">Delege & Üye Girişi</h3>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Başvurunuz onaylandıysa e-posta adresiniz ve 6 haneli şifrenizle giriş yaparak Profilim alanınıza erişebilirsiniz.
                </p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span>{loginError}</span>
                    <div className="pt-1 flex items-center gap-3">
                      <Link href="/basvuru" className="text-[#4DA3FF] underline font-semibold">
                        Yeni Başvuru Yap &rarr;
                      </Link>
                      <button
                        type="button"
                        onClick={() => setActiveTab('sorgula')}
                        className="text-[#4DA3FF] underline font-semibold cursor-pointer"
                      >
                        Biletini Sorgula
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleParticipantLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-wider font-sans">
                    E-Posta Adresiniz
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="ornek@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-wider font-sans">
                    6 Haneli Rakamlı Şifreniz
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="•••••• (6 Rakam)"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-12 py-3 text-base tracking-[0.2em] font-mono text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4DA3FF] p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1.5 font-sans">
                    Başvuru formunda belirlediğiniz 6 rakamlı giriş şifresidir.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <User className="w-4 h-4 text-[#061A33]" />
                  <span>{loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap & Profilime Git'}</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-2">
                <p className="text-xs text-slate-300">
                  Henüz başvuru yapmadınız mı?{' '}
                  <Link href="/basvuru" className="text-[#4DA3FF] font-bold hover:underline">
                    Hemen Delege Başvurusu Yapın
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400">
                  Not: Sadece divan heyeti tarafından <strong>onaylanmış</strong> başvurular ile profil sistemine giriş yapılabilir.
                </p>
              </div>
            </div>
          ) : activeTab === 'sorgula' ? (
            /* Tab 2: Delege Query */
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] mx-auto mb-3">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">Delege Kayıt & Bilet Sorgulama</h3>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Başvururken kullandığınız T.C. No, E-posta veya Telefon numaranızı girerek QR biletinizi görüntüleyin.
                </p>
              </div>

              {searchError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span>{searchError}</span>
                    <div className="pt-1">
                      <Link href="/basvuru" className="text-[#4DA3FF] underline font-semibold">
                        Yeni Başvuru Yap &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleDelegeSearch} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-wider font-sans">
                    T.C. Kimlik No / E-posta / Telefon
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Örn: 12345678901 veya ornek@email.com"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#061A33]" />
                  <span>Biletimi & Durumumu Bul</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-slate-300">
                  Henüz başvuru yapmadınız mı?{' '}
                  <Link href="/basvuru" className="text-[#4DA3FF] font-bold hover:underline">
                    Hemen Delege Başvurusu Yapın
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Tab 2: Admin Login */
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">Yönetici Masası Girişi</h3>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Divan heyeti ve koordinasyon kurulu yetkili erişim ekranı.
                </p>
              </div>

              {adminError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-wider font-sans">
                    Yönetici Parolası
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1.5 font-sans">
                    Demo şifresi: <code className="text-[#4DA3FF]">admin123</code>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#061A33]" />
                  <span>Yönetici Paneline Giriş Yap</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <Link
                  href="/admin-igm-secret-dashboard"
                  className="text-xs text-[#4DA3FF] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Doğrudan Gizli Yönetim Paneline Geç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* QR Code Ticket Modal for retrieved application */}
      <QrTicketModal
        application={foundApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isNew={false}
      />
    </div>
  );
}
