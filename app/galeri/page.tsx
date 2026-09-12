'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  X,
  Eye,
  Lock,
  ShieldCheck,
  Users
} from 'lucide-react';
import { GalleryItem, Application } from '@/lib/types';
import { getStoredGallery, submitUserMedia, getCurrentUser } from '@/lib/storage';
import Lightbox from '@/components/Lightbox';
import InnerPageHero from '@/components/InnerPageHero';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTier, setActiveTier] = useState<'public' | 'members'>('public');
  const [currentUser, setCurrentUser] = useState<Application | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [uploadData, setUploadData] = useState({
    title: '',
    uploaderName: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    category: 'etkinlik' as 'etkinlik' | 'komisyon' | 'kulis' | 'video'
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const all = getStoredGallery();
    // Only approved items with status !== 'rejected' are shown in gallery
    setItems(all.filter((item) => item.isApproved && item.status !== 'rejected'));

    const handleAuth = () => {
      setCurrentUser(getCurrentUser());
      const updatedAll = getStoredGallery();
      setItems(updatedAll.filter((item) => item.isApproved && item.status !== 'rejected'));
    };
    window.addEventListener('igm_auth_change', handleAuth);
    window.addEventListener('igm_gallery_updated', handleAuth);
    return () => {
      window.removeEventListener('igm_auth_change', handleAuth);
      window.removeEventListener('igm_gallery_updated', handleAuth);
    };
  }, []);

  const isApprovedMember = currentUser?.status === 'approved';

  const filters = [
    { id: 'all', label: 'Tüm Medya' },
    { id: 'image', label: 'Fotoğraflar' },
    { id: 'video', label: 'Videolar & Tanıtımlar' },
    { id: 'komisyon', label: 'Komisyon Çalışmaları' },
    { id: 'kulis', label: 'Kulis & Mola Anları' },
  ];

  const tierItems = items.filter((item) => {
    if (activeTier === 'public') {
      return item.visibility === 'public' || !item.visibility;
    } else {
      return item.visibility === 'members' || item.visibility === 'public' || !item.visibility;
    }
  });

  const filteredItems = tierItems.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'image') return item.mediaType === 'image';
    if (selectedFilter === 'video') return item.mediaType === 'video';
    return item.category === selectedFilter;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    if (!uploadData.title.trim() || !uploadData.mediaUrl.trim()) {
      setUploadError('Lütfen başlık ve görsel/video dosyasını eksiksiz giriniz.');
      return;
    }

    submitUserMedia({
      title: uploadData.title.trim(),
      uploaderName: uploadData.uploaderName.trim() || currentUser?.fullName || 'Delege',
      uploaderEmail: currentUser?.email,
      mediaUrl: uploadData.mediaUrl.trim(),
      mediaType: uploadData.mediaType,
      category: uploadData.category
    });

    setUploadSuccess(true);
    setUploadData({
      title: '',
      uploaderName: '',
      mediaUrl: '',
      mediaType: 'image',
      category: 'etkinlik'
    });

    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="MEDYA & ETKİNLİK ALANI"
        title="Fotoğraf ve Video Galerisi"
        description="“Kökümüz İrfan, Sözümüz İstikbal” — İrfan Meclisi'nin genel kurul oturumları, komisyon müzakereleri ve kulis anlarından yüksek çözünürlüklü kareler."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Galeri' }
        ]}
      />

      {/* 2. TWO-TIER GALLERY SWITCHER & FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-10 space-y-4">
        
        {/* Tier Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 p-1.5 rounded-3xl bg-[#081f38] border border-[#4DA3FF]/30 shadow-2xl gap-2">
          <button
            onClick={() => setActiveTier('public')}
            className={`py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTier === 'public'
                ? 'bg-[#4DA3FF] text-[#061A33] shadow-lg shadow-[#4DA3FF]/25'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2b4e]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Genel Ziyaretçi Galerisi (Herkese Açık)</span>
          </button>

          <button
            onClick={() => setActiveTier('members')}
            className={`py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTier === 'members'
                ? 'bg-gradient-to-r from-[#1a68d1] to-[#258BF5] text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2b4e]'
            }`}
          >
            {isApprovedMember ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400" />
            )}
            <span>Etkinlik İçi Üye Galerisi {!isApprovedMember && '(Özel Alan 🔒)'}</span>
            {isApprovedMember && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                Erişim Açık
              </span>
            )}
          </button>
        </div>

        {/* Filter & Upload Bar (Visible if public OR if approved member) */}
        {(activeTier === 'public' || isApprovedMember) && (
          <div className="p-6 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {filters.map((flt) => (
                <button
                  key={flt.id}
                  onClick={() => setSelectedFilter(flt.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilter === flt.id
                      ? 'bg-[#4DA3FF] text-[#061A33] font-bold shadow-lg shadow-[#4DA3FF]/20'
                      : 'bg-[#061A33] text-slate-300 hover:text-white border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/40'
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (currentUser) {
                  setUploadData((prev) => ({ ...prev, uploaderName: currentUser.fullName }));
                }
                setIsUploadOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-xl hover:shadow-[#4DA3FF]/30 transition-all shrink-0 cursor-pointer w-full md:w-auto justify-center"
            >
              <Upload className="w-4 h-4 text-[#061A33]" />
              <span>Fotoğraf / Video Yükle</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. MEDIA GRID OR LOCKED TEASER STATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {activeTier === 'members' && !isApprovedMember ? (
          /* LOCKED TEASER STATE FOR UNAPPROVED / GUEST VISITORS */
          <div className="p-10 sm:p-16 text-center rounded-3xl bg-[#092746]/90 border border-[#4DA3FF]/30 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto my-8 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#061A33] border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 uppercase tracking-wider inline-block">
                Yalnızca Onaylı Delegelere Özel Alan
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">Etkinlik İçi Delege Galerisi</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                Komisyon içi anlar, kulis hatıraları ve delegelerimizin yüklediği özel fotoğraflara yalnızca divan heyeti tarafından onaylanmış resmi meclis delegelerimiz erişebilir.
              </p>
            </div>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/giris"
                className="px-6 py-3 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Delege Girişi Yap</span>
              </Link>
              <Link
                href="/basvuru"
                className="px-6 py-3 rounded-full bg-[#061A33] border border-[#4DA3FF]/30 hover:border-[#4DA3FF] text-white text-xs font-semibold transition-all w-full sm:w-auto cursor-pointer"
              >
                <span>Yeni Delege Başvurusu</span>
              </Link>
            </div>
          </div>
        ) : (
          /* REGULAR UNLOCKED MEDIA GRID */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#092746] border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/60 cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#4DA3FF]/15"
                >
                  <Image
                    src={item.mediaUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A33] via-[#061A33]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Member Badge indicator */}
                  {item.visibility === 'members' && (
                    <div className="absolute top-3 left-3 p-1.5 rounded-lg bg-[#061A33]/90 text-amber-300 backdrop-blur border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 z-10">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>Üye Albümü</span>
                    </div>
                  )}

                  {item.mediaType === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#4DA3FF] text-[#061A33] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-[#061A33] ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-[#061A33]/80 text-[#4DA3FF] backdrop-blur border border-[#4DA3FF]/30">
                      <Eye className="w-4 h-4" />
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-bold text-[#4DA3FF] uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-white line-clamp-1 group-hover:text-[#4DA3FF] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-slate-300 block mt-0.5 font-sans">
                      {item.uploaderName || 'TİMAV Medya'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-16 text-center bg-[#092746] rounded-3xl border border-[#4DA3FF]/20 space-y-2">
                <ImageIcon className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-slate-300 text-sm font-medium">Bu kategoride henüz yayınlanmış bir medya bulunamadı.</p>
                <p className="text-xs text-slate-400">Yukarıdaki "Fotoğraf / Video Yükle" butonuna tıklayarak ilk medyayı gönderebilirsiniz.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredItems.length)}
          onPrev={() => setLightboxIndex((prev) => ((prev ?? 0) - 1 + filteredItems.length) % filteredItems.length)}
        />
      )}

      {/* 5. DELEGATE MEDIA UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A33]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsUploadOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-[#092746] border border-[#4DA3FF]/40 rounded-3xl overflow-hidden shadow-2xl shadow-[#061A33]/90 z-10 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#4DA3FF]" />
                <h3 className="text-lg font-serif font-bold text-white">Etkinlik Medyası Gönder</h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 rounded-lg bg-[#061A33] text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-serif font-bold text-white">Medyayı Başarıyla Gönderdiniz!</h4>
                <p className="text-xs text-slate-300">
                  Fotoğrafınız / videonuz moderasyon kuruluna iletilmiştir. Admin onayının ardından galeride yayınlanacaktır.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                    Görsel / Video Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Adalet Komisyonu 2. Oturum Müzakeresi"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                      Adınız Soyadınız / Komisyon
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ali Yılmaz (Adalet)"
                      value={uploadData.uploaderName}
                      onChange={(e) => setUploadData({ ...uploadData, uploaderName: e.target.value })}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                      Medya Türü
                    </label>
                    <select
                      value={uploadData.mediaType}
                      onChange={(e) => setUploadData({ ...uploadData, mediaType: e.target.value as any })}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4DA3FF]"
                    >
                      <option value="image">Fotoğraf</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value as any })}
                    className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4DA3FF]"
                  >
                    <option value="etkinlik">Genel Etkinlik</option>
                    <option value="komisyon">Komisyon Çalışması</option>
                    <option value="kulis">Kulis & Mola</option>
                    <option value="video">Özel Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                    Görsel / Video URL Adresi *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... veya dosya linki"
                    value={uploadData.mediaUrl}
                    onChange={(e) => setUploadData({ ...uploadData, mediaUrl: e.target.value })}
                    className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Hızlı deneme için herhangi bir doğrudan görsel/video linki yapıştırabilirsiniz.
                  </span>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Moderasyona Gönder
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
