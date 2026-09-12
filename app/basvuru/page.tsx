'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Send, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  MapPin, 
  Layers, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { COMMISSIONS } from '@/lib/data';
import { createApplication } from '@/lib/storage';
import { Application } from '@/lib/types';
import QrTicketModal from '@/components/QrTicketModal';
import InnerPageHero from '@/components/InnerPageHero';

const TOTAL_STEPS = 8;

function ApplicationFormContent() {
  const searchParams = useSearchParams();
  const preSelectedCommission = searchParams.get('commission') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    identityNo: '',
    email: '',
    phone: '',
    password: '',
    school: '',
    department: '',
    city: 'Konya',
    commissionId: preSelectedCommission || 'adalet',
    secondChoiceId: '',
    motivation: '',
    kvkkAccepted: false
  });

  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preSelectedCommission) {
      setFormData((prev) => ({ ...prev, commissionId: preSelectedCommission }));
    }
  }, [preSelectedCommission]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setError(null);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'password') {
      // Only permit numbers and max 6 digits
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, password: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateCurrentStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Lütfen adınızı ve soyadınızı giriniz.');
        return false;
      }
      if (formData.fullName.trim().length < 3) {
        setError('Lütfen geçerli bir ad ve soyad giriniz.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.identityNo.trim()) {
        setError('Lütfen T.C. Kimlik veya Öğrenci Numaranızı giriniz.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Lütfen geçerli bir e-posta adresi giriniz.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 10) {
        setError('Lütfen geçerli bir telefon numarası giriniz (örn: 05XX XXX XX XX).');
        return false;
      }
    } else if (step === 4) {
      if (!formData.password || formData.password.length !== 6) {
        setError('Lütfen sisteme giriş yapacağınız 6 haneli (rakamlardan oluşan) bir şifre belirleyiniz.');
        return false;
      }
      if (!/^\d{6}$/.test(formData.password)) {
        setError('Şifreniz yalnızca 6 haneli rakamlardan oluşmalıdır.');
        return false;
      }
    } else if (step === 5) {
      if (!formData.school.trim()) {
        setError('Lütfen okul veya üniversitenizi belirtiniz.');
        return false;
      }
    } else if (step === 6) {
      if (!formData.commissionId) {
        setError('Lütfen 1. tercih komisyonunuzu seçiniz.');
        return false;
      }
    } else if (step === 7) {
      // Motivation is optional but recommended
      return true;
    } else if (step === 8) {
      if (!formData.kvkkAccepted) {
        setError('Lütfen Aydınlatma Metni ve KVKK onayını işaretleyiniz.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      setError(null);
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < TOTAL_STEPS && currentStep !== 7) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep(8)) return;

    setLoading(true);

    try {
      const app = await createApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        identityNo: formData.identityNo.trim(),
        password: formData.password.trim(),
        school: formData.school.trim(),
        department: formData.department.trim() || 'Genel',
        city: formData.city.trim(),
        commissionId: formData.commissionId,
        secondChoiceId: formData.secondChoiceId || undefined,
        motivation: formData.motivation.trim() || 'İrfan Meclisi hedefleri doğrultusunda katkı sunmak istiyorum.'
      });

      setSubmittedApp(app);
      setIsModalOpen(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Başvuru kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
      setLoading(false);
    }
  };

  const selectedCommission = COMMISSIONS.find(c => c.id === formData.commissionId);
  const selectedSecondCommission = COMMISSIONS.find(c => c.id === formData.secondChoiceId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* THREE-STEP PROCESS BANNER */}
      <div className="mb-10 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#061A33] text-[#4DA3FF] border border-[#4DA3FF]/30 flex items-center justify-center font-serif font-bold text-base shrink-0">
              01
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-white">Adım Adım Başvur</h4>
              <p className="text-[11px] text-slate-300 font-sans">
                Soruları sırayla yanıtlayın ve komisyonunuzu seçin.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#061A33] text-[#4DA3FF] border border-[#4DA3FF]/30 flex items-center justify-center font-serif font-bold text-base shrink-0">
              02
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-white">Kurul Değerlendirmesi</h4>
              <p className="text-[11px] text-slate-300 font-sans">
                Başvurunuz 48 saat içinde divan heyetince incelenir.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#061A33] text-[#4DA3FF] border border-[#4DA3FF]/30 flex items-center justify-center font-serif font-bold text-base shrink-0">
              03
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-white">QR Delege Biletiniz</h4>
              <p className="text-[11px] text-slate-300 font-sans">
                Oluşan dijital QR biletinizle doğrudan giriş yapın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-STEP WIZARD CONTAINER */}
      <div className="rounded-3xl bg-[#092746] border border-[#4DA3FF]/30 p-6 sm:p-10 shadow-2xl mb-20 relative overflow-hidden">
        
        {/* Header with Step Counter & Progress Bar */}
        <div className="border-b border-white/10 pb-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>İrfan Meclisi Delege Kayıt Portalı</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#4DA3FF]">
              <span className="bg-[#061A33] px-3 py-1 rounded-full border border-[#4DA3FF]/20">
                Adım {currentStep} / {TOTAL_STEPS}
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-[#061A33] rounded-full h-2.5 overflow-hidden border border-[#4DA3FF]/20">
            <div 
              className="bg-gradient-to-r from-[#258BF5] to-[#4DA3FF] h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          
          {/* STEP 1: AD SOYAD */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">1. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Adınız ve Soyadınız nedir?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Resmi kimlik belgenizde ve delege yaka kartınızda yer alacak tam adınızı yazınız.
                </p>
              </div>

              <div className="relative pt-2">
                <User className="w-5 h-5 text-[#4DA3FF] absolute left-4 top-[2.2rem] -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  autoFocus
                  placeholder="Örn: Muhammed Bilal Yılmaz"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#061A33] border-2 border-[#4DA3FF]/30 rounded-2xl pl-12 pr-4 py-4 text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all shadow-inner"
                />
              </div>
            </div>
          )}

          {/* STEP 2: TC / ÖĞRENCİ NO */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">2. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  T.C. Kimlik No veya Öğrenci Numaranız
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Etkinlik alanı güvenliği, akreditasyon ve katılım sertifikanızın doğrulaması için gereklidir.
                </p>
              </div>

              <div className="relative pt-2">
                <QrCode className="w-5 h-5 text-[#4DA3FF] absolute left-4 top-[2.2rem] -translate-y-1/2" />
                <input
                  type="text"
                  name="identityNo"
                  autoFocus
                  placeholder="11 haneli T.C. veya Öğrenci Numaranız"
                  value={formData.identityNo}
                  onChange={handleChange}
                  className="w-full bg-[#061A33] border-2 border-[#4DA3FF]/30 rounded-2xl pl-12 pr-4 py-4 text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all shadow-inner"
                />
              </div>
            </div>
          )}

          {/* STEP 3: İLETİŞİM BİLGİLERİ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">3. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  İletişim Bilgileriniz
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Kabul durumunuz, komisyon çalışma kılavuzları ve QR biletiniz bu kanallardan iletilecektir.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    E-Posta Adresiniz *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      autoFocus
                      placeholder="ornek@universite.edu.tr"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Telefon Numarası (WhatsApp Uyumlu) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="05XX XXX XX XX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 6 HANELİ ŞİFRE */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">4. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  6 Haneli Giriş Şifrenizi Belirleyiniz
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Başvurunuz onaylandığında sisteme ve Profilim alanınıza e-posta adresiniz ve burada belirlediğiniz 6 haneli rakamlı şifreniz ile giriş yapacaksınız.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="max-w-md">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    6 Haneli Sayısal Şifre *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-[#4DA3FF] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      placeholder="Örn: 123456"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#061A33] border-2 border-[#4DA3FF]/30 rounded-2xl pl-12 pr-12 py-4 text-xl tracking-[0.3em] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#4DA3FF] transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4DA3FF] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span>Sadece rakam (0-9)</span>
                    <span className={formData.password.length === 6 ? 'text-[#4DA3FF] font-bold' : 'text-slate-500'}>
                      {formData.password.length} / 6 Hane
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#061A33]/80 border border-[#4DA3FF]/20 text-xs text-slate-300 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                  <span>
                    Bu şifreyi lütfen unutmayınız. Divan heyeti başvurunuzu onayladığında yoklama QR kodunuz ve dijital yaka kartınız bu şifreyle açılacaktır.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: EĞİTİM & ŞEHİR */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">5. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Eğitim ve Şehir Bilgileriniz
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Hangi kurumda öğrenim gördüğünüzü ve ikamet şehrinizi belirtiniz.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Okul / Üniversite *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="school"
                      autoFocus
                      placeholder="Örn: Selçuk Üniversitesi"
                      value={formData.school}
                      onChange={handleChange}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Bölüm / Sınıf
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="department"
                        placeholder="Örn: Hukuk (3. Sınıf)"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      İkamet Ettiğiniz Şehir
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="city"
                        placeholder="Örn: Konya"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: KOMİSYON TERCİHİ */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">6. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Hangi Komisyonda Yer Almak İstiyorsunuz?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  8 ana ihtisas komisyonu arasından birincil ve opsiyonel ikincil tercihinizi yapınız.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Tercih Edilen 1. Komisyon (Öncelikli) *
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="commissionId"
                      value={formData.commissionId}
                      onChange={handleChange}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#4DA3FF] transition-all cursor-pointer"
                    >
                      {COMMISSIONS.map((com) => (
                        <option key={com.id} value={com.id}>
                          {com.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Tercih Edilen 2. Komisyon (Opsiyonel)
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="secondChoiceId"
                      value={formData.secondChoiceId}
                      onChange={handleChange}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#4DA3FF] transition-all cursor-pointer"
                    >
                      <option value="">Seçiniz (İkinci tercih opsiyonel)</option>
                      {COMMISSIONS.map((com) => (
                        <option key={com.id} value={com.id}>
                          {com.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: MOTİVASYON */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">7. Soru</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Motivasyonunuz & Yasa Tasarısı / Fikir Öneriniz
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Neden bu komisyonda yer almak istiyorsunuz? Hangi konuda bir yasa teklifi hazırlamayı planlıyorsunuz?
                </p>
              </div>

              <div className="pt-2">
                <textarea
                  name="motivation"
                  autoFocus
                  rows={5}
                  placeholder="Kısaca bahseder misiniz? Örn: Hukukun üstünlüğü ve dijital çağda bilişim haklarının korunması hususunda gençlik odaklı somut bir yasa önerisi sunmak istiyorum..."
                  value={formData.motivation}
                  onChange={handleChange}
                  className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-2xl p-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 8: İNCELEME & ONAY */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-semibold">Son Adım</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Bilgilerinizi Onaylayın ve Başvuruyu Tamamlayın
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Girdiğiniz bilgileri kontrol edip onay kutusunu işaretleyerek dijital delege biletinizi alabilirsiniz.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/25 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Ad Soyad:</span>
                  <span className="text-white font-semibold text-right">{formData.fullName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Kimlik / Öğrenci No:</span>
                  <span className="text-white font-semibold text-right">{formData.identityNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-3">
                  <span className="text-slate-400">E-Posta & Tel:</span>
                  <span className="text-white font-semibold text-right">{formData.email} • {formData.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Giriş Şifresi:</span>
                  <span className="text-[#4DA3FF] font-mono font-semibold text-right">•••••• (6 haneli şifre belirlendi)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Okul & Şehir:</span>
                  <span className="text-white font-semibold text-right">{formData.school} ({formData.city})</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-400">1. Tercih Komisyon:</span>
                  <span className="text-[#4DA3FF] font-semibold text-right">{selectedCommission?.name || formData.commissionId}</span>
                </div>
              </div>

              {/* KVKK & Onay */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="kvkkAccepted"
                    checked={formData.kvkkAccepted}
                    onChange={handleChange}
                    className="mt-1 rounded bg-[#061A33] border-[#4DA3FF]/40 text-[#4DA3FF] focus:ring-[#4DA3FF] cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed font-sans">
                    TİMAV İrfan Meclisi 2026 Delege Başvuru Şartnamesini ve Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metnini okudum, kabul ediyorum.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons (Geri / İlerle / Tamamla) */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 rounded-full bg-[#061A33] hover:bg-[#0c2847] border border-[#4DA3FF]/30 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs sm:text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>İlerle</span>
                <ArrowRight className="w-4 h-4 text-[#061A33]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs sm:text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#061A33]" />
                <span>{loading ? 'Kaydediliyor...' : 'Başvuruyu Tamamla & QR Biletini Oluştur'}</span>
              </button>
            )}
          </div>

        </form>

      </div>

      {/* QR Code Ticket Modal */}
      <QrTicketModal
        application={submittedApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isNew={true}
      />

    </div>
  );
}

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="RESMİ KAYIT MASASI"
        title="İrfan Meclisi Delege Başvurusu"
        description="“Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; 23-24-25 Ekim 2026 tarihlerinde Selçuklu Kongre Merkezi'nde 250 asil delege arasında yerinizi almak için adım adım başvuru formunu tamamlayınız."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Delege Başvurusu' }
        ]}
      />

      <Suspense fallback={<div className="text-center text-slate-400 py-16">Yükleniyor...</div>}>
        <ApplicationFormContent />
      </Suspense>

    </div>
  );
}
