'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  MapPin, 
  Layers, 
  QrCode, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Printer, 
  LogOut, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Plus, 
  X,
  FileText,
  Bell,
  Megaphone,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { 
  getCurrentUser, 
  logoutParticipant, 
  updateParticipantAvatar, 
  updateUserProfile,
  getUserGalleryItems, 
  submitUserMedia, 
  getUserAnnouncements,
  compressImageFile
} from '@/lib/storage';
import { isSupabaseConfigured, uploadImageToSupabaseStorage } from '@/lib/supabase';
import { Application, GalleryItem, Announcement } from '@/lib/types';
import { COMMISSIONS } from '@/lib/data';
import InnerPageHero from '@/components/InnerPageHero';


const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Announcement State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    phone: '',
    school: '',
    department: '',
    city: '',
    password: ''
  });
  const [editSuccess, setEditSuccess] = useState(false);

  // User Gallery State
  const [userGallery, setUserGallery] = useState<GalleryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<'etkinlik' | 'komisyon' | 'kulis'>('etkinlik');
  const [newImageBase64, setNewImageBase64] = useState<string>('');
  const [uploadSubmitting, setUploadSubmitting] = useState(false);

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      router.push('/giris');
      return;
    }
    setUser(active);
    setUserGallery(getUserGalleryItems(active.fullName, active.email));
    setAnnouncements(getUserAnnouncements(active.status));
    setEditFormData({
      phone: active.phone || '',
      school: active.school || '',
      department: active.department || '',
      city: active.city || 'Konya',
      password: active.password || ''
    });

    // Generate QR Code from secureQrToken or qrCodeId
    const qrCodeValue = active.secureQrToken || active.qrCodeId;
    if (qrCodeValue) {
      QRCode.toDataURL(
        qrCodeValue,
        {
          width: 320,
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

    setLoading(false);
  }, [router]);

  // Listen for real-time announcements from admin
  useEffect(() => {
    const handleAnnouncementsUpdate = () => {
      const active = getCurrentUser();
      if (active) {
        setAnnouncements(getUserAnnouncements(active.status));
        setUser(active);
      }
    };
    window.addEventListener('igm_announcements_updated', handleAnnouncementsUpdate);
    window.addEventListener('igm_auth_change', handleAnnouncementsUpdate);
    window.addEventListener('storage', handleAnnouncementsUpdate);
    return () => {
      window.removeEventListener('igm_announcements_updated', handleAnnouncementsUpdate);
      window.removeEventListener('igm_auth_change', handleAnnouncementsUpdate);
      window.removeEventListener('storage', handleAnnouncementsUpdate);
    };
  }, []);

  const handleLogout = () => {
    logoutParticipant();
    router.push('/giris');
  };

  const handleAvatarSelect = (url: string) => {
    if (!user) return;
    const updated = updateParticipantAvatar(user.id, url);
    if (updated) {
      setUser(updated);
      setIsAvatarModalOpen(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Reset input value so re-selecting the same file fires onChange
    e.target.value = '';

    // Mobile / Gallery MIME check: standard images, camera capture
    if (file.type && !file.type.startsWith('image/')) {
      setAvatarError('Lütfen sadece fotoğraf dosyası seçiniz (JPG, PNG veya WEBP).');
      return;
    }

    setAvatarUploadLoading(true);

    try {
      // 1. İstemci tarafında optimize et (800x800 px, ~60-80KB)
      // Telefon kamerasından gelen büyük (örn. 10MB) fotoğraflar dahi anında işlenir
      const { blob, dataUrl } = await compressImageFile(file, 800, 0.85);

      let finalAvatarUrl = dataUrl;

      // 2. Supabase Storage kovanına yükle
      if (isSupabaseConfigured) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const sanitizedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt.toLowerCase()) ? fileExt.toLowerCase() : 'jpg';
        const fileName = `${user.id}-${Date.now()}.${sanitizedExt}`;

        const uploadResult = await uploadImageToSupabaseStorage('avatars', fileName, blob);
        if (uploadResult.url) {
          finalAvatarUrl = uploadResult.url;
        } else {
          console.warn('Supabase storage upload fallback to compressed dataUrl:', uploadResult.error);
        }
      }

      // 3. Kullanıcı profilini ve oturumunu güncelle
      const updated = updateParticipantAvatar(user.id, finalAvatarUrl);
      if (updated) {
        setUser(updated);
      }
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      console.error('Avatar upload processing error:', err);
      setAvatarError(err?.message || 'Fotoğraf işlenirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setAvatarUploadLoading(false);
    }
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updated = updateUserProfile(user.id, editFormData);
    if (updated) {
      setUser(updated);
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setIsEditModalOpen(false);
      }, 1500);
    }
  };

  const handleGalleryMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl } = await compressImageFile(file, 1200, 0.85);
      setNewImageBase64(dataUrl);
    } catch (err) {
      console.error('Gallery image compression failed:', err);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImageBase64(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newImageBase64 || !newImageTitle.trim()) return;

    setUploadSubmitting(true);
    try {
      submitUserMedia({
        title: newImageTitle.trim(),
        mediaUrl: newImageBase64,
        mediaType: 'image',
        category: newImageCategory as any,
        uploaderName: user.fullName,
        uploaderEmail: user.email
      });

      setUserGallery(getUserGalleryItems(user.fullName, user.email));
      setIsUploadModalOpen(false);
      setNewImageTitle('');
      setNewImageBase64('');
    } catch (err) {
      console.error(err);
    } finally {
      setUploadSubmitting(false);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#061A33] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#4DA3FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const commission = COMMISSIONS.find((c) => c.id === user.commissionId);
  const secondCommission = COMMISSIONS.find((c) => c.id === user.secondChoiceId);

  return (
    <div className="min-h-screen bg-[#061A33] text-white pb-24">
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="DELEGE RESMİ PROFİLİ"
        title={`Sayın ${user.fullName}`}
        description="İrfan Meclisi 2026 Simülasyonu onaylı delege kaydınız, yoklama QR biletiniz ve paylaştığınız medya kayıtları."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Profilim' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        
        {/* TOP PROFILE HEADER CARD */}
        <div className="rounded-3xl bg-[#092746] border border-[#4DA3FF]/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Avatar with Edit Button */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[#4DA3FF] shadow-xl bg-[#061A33] flex items-center justify-center text-3xl font-serif font-bold text-[#4DA3FF]">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.fullName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  title="Profil Fotoğrafını Değiştir"
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Onaylı Meclis Delegesi</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {user.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span>{user.school}</span>
                  <span>•</span>
                  <span>{user.department || 'Öğrenci'}</span>
                  <span>•</span>
                  <span className="text-[#4DA3FF] font-medium">{user.city || 'Konya'}</span>
                </p>
              </div>
            </div>

            {/* Logout and Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#4DA3FF]/15 border border-[#4DA3FF]/40 hover:bg-[#4DA3FF]/25 text-[#4DA3FF] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <KeyRound className="w-4 h-4" />
                <span>Bilgilerimi Düzenle</span>
              </button>
              <button
                onClick={handlePrintCard}
                className="px-4 py-2.5 rounded-xl bg-[#061A33] border border-[#4DA3FF]/40 hover:border-[#4DA3FF] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-[#4DA3FF]" />
                <span className="hidden sm:inline">Kartı Yazdır</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-red-950/50 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN 2-COLUMN GRID: LEFT INFO & RIGHT QR PASS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: FULL APPLICATION DETAILS (2 Cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 0. DUYURULAR VE BİLDİRİM MERKEZİ (MODÜL 2) */}
            <div className="rounded-3xl bg-[#092746] border border-[#4DA3FF]/30 p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2.5">
                      <span>Duyurular & Bildirimler</span>
                      {announcements.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-[#4DA3FF] text-[11px] font-mono font-bold border border-[#4DA3FF]/30">
                          {announcements.length}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-400">Divan heyeti ve koordinasyon tarafından yayınlanan resmi bildirimler</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-400 font-medium hidden sm:inline">Canlı Akış</span>
                </div>
              </div>

              {announcements.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-[#061A33]/50 rounded-2xl border border-dashed border-[#4DA3FF]/20">
                  Şu anda size yönelik yeni bir duyuru bulunmamaktadır.
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      onClick={() => setSelectedAnnouncement(ann)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                        ann.priority === 'urgent'
                          ? 'bg-red-950/40 border-red-500/50 hover:border-red-400 shadow-lg shadow-red-950/40'
                          : ann.priority === 'important'
                          ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-950/40'
                          : 'bg-[#061A33] border-[#4DA3FF]/25 hover:border-[#4DA3FF]/60 shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ann.priority === 'urgent'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : ann.priority === 'important'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-blue-500/20 text-[#4DA3FF] border border-blue-500/40'
                            }`}
                          >
                            {ann.priority === 'urgent' ? 'Acil Duyuru' : ann.priority === 'important' ? 'Önemli' : 'Duyuru'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(ann.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <span className="text-[11px] text-[#4DA3FF] font-medium hover:underline shrink-0">
                          Detayı Oku &rarr;
                        </span>
                      </div>

                      <h3 className="text-sm font-serif font-bold text-white mb-1">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {ann.content}
                      </p>
                      {ann.authorName && (
                        <span className="text-[10px] text-slate-400 block mt-2 font-mono">
                          Gönderen: {ann.authorName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 1. Başvuru Bilgileri Kartı */}
            <div className="rounded-3xl bg-[#092746] border border-[#4DA3FF]/25 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Başvuru Bilgileriniz</h2>
                    <p className="text-xs text-slate-400">Kayıt esnasında ibraz ettiğiniz resmi bilgiler</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#4DA3FF] bg-[#061A33] px-3 py-1 rounded-lg border border-[#4DA3FF]/20">
                  {user.qrCodeId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Ad Soyad
                  </span>
                  <p className="font-semibold text-white">{user.fullName}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    T.C. Kimlik / Öğrenci No
                  </span>
                  <p className="font-semibold text-white font-mono">{user.identityNo}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    E-Posta Adresi
                  </span>
                  <p className="font-semibold text-white break-all">{user.email}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Telefon Numarası
                  </span>
                  <p className="font-semibold text-white">{user.phone}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Üniversite & Şehir
                  </span>
                  <p className="font-semibold text-white">{user.school} ({user.city || 'Konya'})</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Bölüm & Sınıf
                  </span>
                  <p className="font-semibold text-white">{user.department || 'Genel'}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Atandığı / Tercih Komisyonu
                  </span>
                  <p className="font-bold text-[#4DA3FF]">{commission?.name || user.commissionId}</p>
                </div>

                {secondCommission && (
                  <div className="p-3.5 rounded-2xl bg-[#061A33]/70 border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      2. Tercih Komisyonu
                    </span>
                    <p className="font-medium text-slate-300">{secondCommission.name}</p>
                  </div>
                )}
              </div>

              {/* 6 Haneli Şifre Alanı */}
              <div className="p-4 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#4DA3FF]/15 text-[#4DA3FF] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">6 Haneli Giriş Şifreniz</h4>
                    <p className="text-[11px] text-slate-400">Giriş yaparken ve delege yoklamalarında kullanılan şifre</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="font-mono text-base tracking-[0.25em] text-[#4DA3FF] font-bold bg-[#092746] px-3 py-1 rounded-lg border border-[#4DA3FF]/30">
                    {showPassword ? (user.password || '123456') : '••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded-lg bg-[#092746] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Gizle' : 'Göster'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Motivasyon / Yasa Tasarısı Teklifi */}
              <div className="p-5 rounded-2xl bg-[#061A33]/90 border border-[#4DA3FF]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-white uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#4DA3FF]" />
                  <span>Motivasyon & Yasa Tasarısı / Fikir Önerisi</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic whitespace-pre-line">
                  "{user.motivation || 'Katılım motivasyonu belirtilmedi.'}"
                </p>
              </div>
            </div>

            {/* 2. Kullanıcının Yüklediği Görseller Bölümü */}
            <div className="rounded-3xl bg-[#092746] border border-[#4DA3FF]/25 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Yüklediğiniz Görseller & Anılar</h2>
                    <p className="text-xs text-slate-400">Meclis galerisine katkıda bulunduğunuz fotoğraflar</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Fotoğraf Paylaş</span>
                </button>
              </div>

              {userGallery.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#061A33]/50 border border-dashed border-[#4DA3FF]/30 space-y-3">
                  <ImageIcon className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="text-sm font-serif font-bold text-white">Henüz bir fotoğraf yüklemediniz</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Komisyon çalışmalarından veya etkinlik alanından fotoğraflar yükleyerek İrfan Meclisi dijital arşivinde yer alabilirsiniz.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#061A33] border border-[#4DA3FF]/40 text-[#4DA3FF] text-xs font-semibold hover:bg-[#4DA3FF]/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>İlk Fotoğrafınızı Yükleyin</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {userGallery.map((item) => (
                    <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-[#061A33] border border-[#4DA3FF]/20 shadow-md">
                      <div className="aspect-square relative overflow-hidden bg-slate-900">
                        <img 
                          src={item.mediaUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-2.5">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <div className="flex items-center justify-between mt-1 text-[10px]">
                          <span className="text-[#4DA3FF] uppercase font-mono">{item.category}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            item.isApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {item.isApproved ? 'Yayında' : 'İnceleniyor'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* COLUMN 3: QR CODE ATTENDANCE TICKET (PRINTABLE ID BADGE) */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-b from-[#0c2e55] to-[#092746] border-2 border-[#4DA3FF]/40 p-6 shadow-2xl space-y-6 text-center relative overflow-hidden">
              
              {/* Badge Top Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#4DA3FF] uppercase font-bold">
                  RESMİ YOKLAMA & GİRİŞ BİLETİ
                </span>
                <h3 className="text-lg font-serif font-bold text-white">İrfan Meclisi 2026</h3>
                <p className="text-[11px] text-slate-300">Selçuklu Kongre Merkezi • Konya</p>
              </div>

              {/* QR Code Canvas */}
              <div className="p-4 rounded-2xl bg-white shadow-2xl inline-block mx-auto border-4 border-[#061A33]">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Yoklama QR Kodu" className="w-48 h-48 sm:w-56 sm:h-56 mx-auto" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-500 text-xs">
                    QR Üretiliyor...
                  </div>
                )}
              </div>

              {/* QR Code ID & Instructions */}
              <div className="space-y-2">
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#061A33] text-[#4DA3FF] border border-[#4DA3FF]/30 inline-block font-semibold">
                  {user.qrCodeId}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Etkinlik girişinde ve komisyon oturumlarında bu QR kodu görevli divan heyetine okutarak yoklamanızı onaylatınız.
                </p>
              </div>

              {/* Daily Attendance Status Pillars */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-left">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  3 Günlük Yoklama Durumu:
                </span>
                <div className="space-y-1.5">
                  {['23 Ekim', '24 Ekim', '25 Ekim'].map((day) => {
                    const attended = (user.attendanceDays || []).includes(day);
                    return (
                      <div key={day} className="flex items-center justify-between p-2 rounded-xl bg-[#061A33] text-xs">
                        <span className="text-slate-300 font-medium">{day} 2026 Oturumu</span>
                        {attended ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Katıldı
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                            <Clock className="w-3.5 h-3.5" /> Bekleniyor
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePrintCard}
                className="w-full py-3 rounded-xl bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Yaka Kartı & Bilet Çıktısı Al</span>
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* AVATAR CHANGE MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-[#092746] border border-[#4DA3FF]/40 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#4DA3FF]" />
                <span>Profil Fotoğrafını Değiştir</span>
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {avatarError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{avatarError}</span>
              </div>
            )}

            {/* Custom Image Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Cihazınızdan Yeni Fotoğraf Seçin (Galeri veya Kamera)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploadLoading}
                className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#4DA3FF]/40 hover:border-[#4DA3FF] bg-[#061A33] text-sm font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-[#4DA3FF]" />
                <span>{avatarUploadLoading ? 'Yükleniyor ve Doğrulanıyor...' : 'Fotoğraf Dosyası Yükle'}</span>
              </button>
            </div>

            {/* Ready Presets */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Veya Hazır Delege Avatarlarından Seçin
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAvatarSelect(presetUrl)}
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#4DA3FF] transition-all cursor-pointer group"
                  >
                    <img src={presetUrl} alt="Avatar Preset" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#061A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-[#092746] border border-[#4DA3FF]/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#4DA3FF]" />
                <span>Profil Bilgilerini Düzenle</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Bilgileriniz başarıyla güncellendi!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfileEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Telefon Numarası</label>
                <input
                  type="text"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl text-white focus:outline-none focus:border-[#4DA3FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Üniversite / Kurum</label>
                <input
                  type="text"
                  required
                  value={editFormData.school}
                  onChange={(e) => setEditFormData({ ...editFormData, school: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl text-white focus:outline-none focus:border-[#4DA3FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bölüm / Program</label>
                <input
                  type="text"
                  required
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl text-white focus:outline-none focus:border-[#4DA3FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">İkamet Şehri</label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl text-white focus:outline-none focus:border-[#4DA3FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">6 Haneli Giriş PIN</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#4DA3FF]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-[#061A33] text-slate-300 hover:text-white rounded-xl font-semibold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold rounded-xl shadow-md transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* NEW GALLERY MEDIA MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-[#092746] border border-[#4DA3FF]/40 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#4DA3FF]" />
                <span>Meclis Galerisine Fotoğraf Ekle</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Fotoğraf Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Adalet Komisyonu Açılış Oturumu"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value as any)}
                  className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DA3FF] cursor-pointer"
                >
                  <option value="etkinlik">Genel Etkinlik</option>
                  <option value="komisyon">Komisyon Masası</option>
                  <option value="kulis">Kulis & İstişare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Görsel Dosyası *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleGalleryMediaUpload}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#4DA3FF] file:text-[#061A33] file:cursor-pointer hover:file:bg-[#258BF5]"
                />
                {newImageBase64 && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-[#4DA3FF]/30">
                    <img src={newImageBase64} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#061A33] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploadSubmitting || !newImageBase64}
                  className="px-6 py-2.5 rounded-xl bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploadSubmitting ? 'Kaydediliyor...' : 'Galeriye Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT DETAIL MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-lg w-full rounded-3xl bg-[#092746] border border-[#4DA3FF]/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                  selectedAnnouncement.priority === 'urgent'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : selectedAnnouncement.priority === 'important'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-blue-500/20 text-[#4DA3FF] border border-blue-500/40'
                }`}>
                  {selectedAnnouncement.priority === 'urgent' ? 'Acil Duyuru' : selectedAnnouncement.priority === 'important' ? 'Önemli Bilgilendirme' : 'Resmi Duyuru'}
                </span>
                <h3 className="text-lg font-serif font-bold text-white pt-1">
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-lg bg-[#061A33] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#061A33]/80 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {selectedAnnouncement.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
              <span>Gönderen: {selectedAnnouncement.authorName || 'Divan Heyeti'}</span>
              <span>{new Date(selectedAnnouncement.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-3 rounded-xl bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

