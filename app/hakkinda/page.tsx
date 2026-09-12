'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Building2,
  Landmark,
  Scale,
  BookOpen,
  Award,
  CheckCircle2,
  Maximize2,
  Layers,
  Users
} from 'lucide-react';
import { getStoredCMSData, CMSData, INITIAL_CMS_DATA } from '@/lib/cmsStorage';
import VideoModal from '@/components/VideoModal';
import InnerPageHero from '@/components/InnerPageHero';
import Lightbox from '@/components/Lightbox';

export default function AboutPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string>('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cmsData, setCmsData] = useState<CMSData>(INITIAL_CMS_DATA);

  useEffect(() => {
    setCmsData(getStoredCMSData());
    const handleUpdate = () => {
      setCmsData(getStoredCMSData());
    };
    window.addEventListener('igm_cms_updated', handleUpdate);
    return () => window.removeEventListener('igm_cms_updated', handleUpdate);
  }, []);

  const about = cmsData.aboutPage || INITIAL_CMS_DATA.aboutPage;
  const settings = cmsData.siteSettings || INITIAL_CMS_DATA.siteSettings;

  const mediaList = about.mediaGallery && about.mediaGallery.length > 0 
    ? about.mediaGallery 
    : INITIAL_CMS_DATA.aboutPage.mediaGallery;

  // Convert media items to format needed by Lightbox
  const lightboxItems = mediaList.map((m, idx) => ({
    id: `about-m-${idx}`,
    title: m.title,
    mediaUrl: m.url,
    mediaType: m.type,
    category: 'etkinlik' as const,
    isApproved: true,
    createdAt: '2026-10-23'
  }));

  const openVideo = (url?: string) => {
    if (url) setActiveMediaUrl(url);
    setIsVideoOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge={about.heroBadge || (settings.organizationName ? `${settings.organizationName.toUpperCase()} VİZYONU` : "TİMAV KURUMSAL VİZYONU")}
        title={about.heroTitle || "Köklü Miras, Çağdaş Müzakere: İrfan Meclisi"}
        description={about.heroDesc || "“Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; ilim, irfan ve hikmet ekseninde yetişen genç nesillerin, Türkiye'nin ve dünyanın temel meselelerine meclis simülasyonu disipliniyle çözüm ürettiği vizyoner bir platformdur."}
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Hakkında' }
        ]}
      />

      {/* HIGHLIGHT CALLOUT: Geri Sayım & Slogan Metni */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#092746] via-[#0D3156] to-[#092746] border border-[#4DA3FF]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 rounded-full bg-[#4DA3FF]/20 border border-[#4DA3FF]/40 flex items-center justify-center text-[#4DA3FF] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4DA3FF] font-bold block mb-0.5">
                {settings.slogan || "KÖKÜMÜZ İRFAN, SÖZÜMÜZ İSTİKBAL"}
              </span>
              <p className="text-sm sm:text-base font-semibold text-white">
                {settings.countdownText || "Yeni fikirler, güçlü sesler ve kararlı adımlar için geri sayım başladı."}
              </p>
            </div>
          </div>
          <Link
            href="/basvuru"
            className="px-6 py-2.5 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Hemen Başvur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VİZYON – İRFAN MECLİSİ – MİSYON (PROFESYONEL, ASİMETRİK EDİTÖRYAL DÜZEN) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0D3156] border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
            Kurumsal Felsefe
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Köklerimizden Geleceğe Uzanan Düşünce Çatısı
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            İrfan Meclisi; ilim, irfan ve hikmet geleneğimizi çağdaş parlamenter müzakere tekniğiyle buluşturan öncü bir harekettir.
          </p>
        </div>

        {/* Bespoke Editorial Asymmetric Grid */}
        <div className="space-y-8">
          
          {/* PRIMARY CENTERPIECE: 2. İRFAN MECLİSİ (ÖNE ÇIKAN MERKEZİ PLATFORM) */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A2244] via-[#092746] to-[#061A33] border-2 border-[#4DA3FF]/40 shadow-2xl p-8 sm:p-12">
            
            {/* Architectural subtle watermark background decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DA3FF]/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-white">
              <Landmark className="w-96 h-96" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Crest & Title */}
              <div className="lg:col-span-4 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#4DA3FF]/20 border border-[#4DA3FF]/40 text-[#4DA3FF] uppercase tracking-widest">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{about.irfanMeclisi?.badge || "Merkezi Model"}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight leading-tight">
                  {about.irfanMeclisi?.title || "İRFAN MECLİSİ"}
                </h3>

                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#4DA3FF]">
                  {about.irfanMeclisi?.subtitle || "İstişare Kültürü & Gençlik Zemini"}
                </p>

                <div className="w-16 h-1 bg-[#4DA3FF] rounded-full" />
              </div>

              {/* Right Column: Narrative content with callouts */}
              <div className="lg:col-span-8 space-y-6">
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans text-justify border-l-2 border-[#4DA3FF]/50 pl-6">
                  {about.irfanMeclisi?.content || "İrfan Meclisi; gençlerin milli ve manevi değerlerimizden, tarihi ve medeniyet birikimimizden beslenerek ülke ve dünya meseleleri üzerine fikir ürettiği, istişare kültürünü tecrübe ettiği bir gençlik meclisi simülasyonudur. “Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; şuurlu, sorumluluk sahibi ve dava sahibi gençlerin yetişmesine katkı sunmayı, fikir ve irfanı buluşturarak istikbale yön verecek bir gençlik zemini oluşturmayı amaçlar."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#061A33]/80 border border-white/10 text-xs text-slate-300">
                    <span className="font-bold text-[#4DA3FF] block mb-0.5">8 Masada Müzakere</span>
                    <span>Stratejik yasa tasarısı ve kanun yazımı</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#061A33]/80 border border-white/10 text-xs text-slate-300">
                    <span className="font-bold text-[#4DA3FF] block mb-0.5">Genel Kurul Oylaması</span>
                    <span>TBMM usulleriyle demokratik karar alma</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#061A33]/80 border border-white/10 text-xs text-slate-300">
                    <span className="font-bold text-[#4DA3FF] block mb-0.5">Resmi Bildiri Külliyatı</span>
                    <span>Karar alıcılara sunulacak sonuç raporu</span>
                  </div>
                </div>

                <div className="pt-2 text-xs font-semibold text-slate-400">
                  <span>{about.irfanMeclisi?.footerTag || "TBMM Disiplini & Karar Alma Süreçleri"}</span>
                </div>
              </div>

            </div>

          </div>

          {/* TWO SIDE-BY-SIDE COMPLEMENTARY MANIFESTOS: VİZYONUMUZ & MİSYONUMUZ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* MANIFESTO 1: VİZYONUMUZ (ÖZGÜN DOKU VE ZARİF TİPOGRAFİ) */}
            <div className="relative rounded-3xl bg-[#08203E] border border-[#4DA3FF]/25 p-8 sm:p-10 shadow-xl flex flex-col justify-between hover:border-[#4DA3FF]/50 transition-all duration-300 group">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] shadow-inner group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#4DA3FF] px-3 py-1 rounded-full bg-[#061A33] border border-[#4DA3FF]/30 uppercase tracking-wider">
                    {about.vizyon?.badge || "Gelecek Tasavvuru"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                    {about.vizyon?.title || "VİZYONUMUZ"}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF] mt-1">
                    {about.vizyon?.subtitle || "Şuurlu Gençlik & Kök Miras"}
                  </p>
                </div>

                <div className="w-12 h-0.5 bg-[#4DA3FF]" />

                <p className="text-sm text-slate-300 leading-relaxed font-sans text-justify">
                  {about.vizyon?.content || "İrfan asırlık milli ve manevi medeniyet birikimimizin değerlerinden güç alan, tarihinden aldığı ilhamı istikbaline taşıyan, şuurlu bir gençlik yetiştirmektir. “Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; milletimizin sahip olduğu ilim, irfan, adalet, ahlak, istişare ve kardeşlik mirasını genç nesillerle buluşturmayı hedefliyoruz. Geçmişinin emanetine sahip çıkan, bugünün meselelerini idrak eden ve yarının Türkiye’sine yön verecek fikir, ahlak ve sorumluluk bilincine sahip gençlerin yetişmesinde öncülük ederek; güçlü bir millet idaresinin, ancak kökleri sağlam bir gençlikle mümkün olduğuna inanıyoruz."}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[#4DA3FF]">
                  {about.vizyon?.footerTag || "Kadim Değerler & Yeni Perspektifler"}
                </span>
                <span className="font-mono text-slate-500">I. ESAS</span>
              </div>

            </div>

            {/* MANIFESTO 2: MİSYONUMUZ (ÖZGÜN DOKU VE ZARİF TİPOGRAFİ) */}
            <div className="relative rounded-3xl bg-[#08203E] border border-[#4DA3FF]/25 p-8 sm:p-10 shadow-xl flex flex-col justify-between hover:border-[#4DA3FF]/50 transition-all duration-300 group">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF] shadow-inner group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#4DA3FF] px-3 py-1 rounded-full bg-[#061A33] border border-[#4DA3FF]/30 uppercase tracking-wider">
                    {about.misyon?.badge || "Tarihî Sorumluluk"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                    {about.misyon?.title || "MİSYONUMUZ"}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF] mt-1">
                    {about.misyon?.subtitle || "Ortak Akıl & Geleceğin Karar Alıcıları"}
                  </p>
                </div>

                <div className="w-12 h-0.5 bg-[#4DA3FF]" />

                <p className="text-sm text-slate-300 leading-relaxed font-sans text-justify">
                  {about.misyon?.content || "İrfan Meclis Simülasyonu'nun misyonu; gençlerimizi milletimizin tarihî ve medenî değerleriyle buluşturmak, onlara söz söyleme, fikir üretme, istişare etme ve sorumluluk alma imkânı sunarak geleceğin karar alıcıları olmaya hazırlamaktır. Meclis kültürünü yalnızca bir simülasyon olarak değil, istişare ve ortak akıl geleneğimizin gençler nezdinde yeniden ihyası olarak ele alıyoruz. Bu doğrultuda; vatanına, milletine ve medeniyetine bağlı, millî ve manevî değerlerine sahip çıkan, adalet ve ahlakı rehber edinen, şuurlu ve dava sahibi gençlerin yetişmesine katkı sağlamayı; gençlerimizin sesini fikirle, fikrini irfanla, ve irfanını istikballe buluşturmayı kendimize görev addediyoruz."}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[#4DA3FF]">
                  {about.misyon?.footerTag || "Fikir • Ahlak • Adalet • Aksiyon"}
                </span>
                <span className="font-mono text-slate-500">II. ESAS</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. ZENGİNLEŞTİRİLMİŞ ETKİNLİK GÖRSEL & VİDEO VİTRİNİ                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#030D1A] border-y border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#4DA3FF] uppercase mb-2 block">
                — MECLİS ATMOSFERİ VE MEDYA
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Tarihi Buluşmanın Mekan ve Oturum Kareleri
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Selçuklu Kongre Merkezi'nin görkemli atmosferinde gerçekleşecek oturumlar, çalıştay odaları ve meclis heyecanı.
              </p>
            </div>

            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#092746] hover:bg-[#0D3156] border border-[#4DA3FF]/30 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
            >
              <span>Tüm Medya Galerisini Aç</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#4DA3FF]" />
            </Link>
          </div>

          {/* Multimedia Cards Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaList.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#092746] border border-white/10 shadow-xl transition-all duration-300 hover:border-[#4DA3FF]/60 hover:shadow-2xl hover:shadow-[#4DA3FF]/10 flex flex-col justify-end p-5"
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A33] via-[#061A33]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {item.type === 'video' ? (
                  <button
                    onClick={() => openVideo(item.videoEmbedUrl || item.url)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                    aria-label="Videoyu İzle"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] flex items-center justify-center text-[#061A33] shadow-2xl transition-transform duration-300 group-hover:scale-115">
                      <Play className="w-6 h-6 fill-[#061A33] ml-0.5 text-[#061A33]" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setLightboxIndex(idx)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#061A33]/80 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
                    aria-label="Tam Ekran İncele"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="relative z-10 space-y-1">
                  <span className="text-[11px] text-[#4DA3FF] font-semibold block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TİMAV KURUMSAL TANITIM BLOĞU                                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#092746]/60 border-b border-[#4DA3FF]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Card / Video trigger */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-[#4DA3FF]/30 shadow-2xl group bg-[#061A33]">
                <Image
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
                  alt="TİMAV Gençlik Çalışmaları"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A33] via-[#061A33]/40 to-transparent" />
                
                <button
                  onClick={() => openVideo(about.timav?.videoUrl)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                  aria-label="TİMAV Tanıtımını İzle"
                >
                  <div className="w-18 h-18 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] flex items-center justify-center text-[#061A33] shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 fill-[#061A33] ml-1 text-[#061A33]" />
                  </div>
                </button>

                <div className="absolute bottom-5 left-6 right-6 p-4 rounded-xl bg-[#061A33]/90 backdrop-blur-md border border-[#4DA3FF]/20 text-xs text-slate-300">
                  <span className="text-[#4DA3FF] font-bold block mb-1 font-serif text-sm">TİMAV (Türkiye İmam Hatipliler Vakfı)</span>
                  <span>1994 yılından bu yana gençlik, kültür ve eğitim alanında öncü vakıf teşkilatı.</span>
                </div>
              </div>
            </div>

            {/* Narrative text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>{about.timav?.tag || "Önder Kurumumuz"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {about.timav?.heading || "TİMAV'ın Gençlik ve Gelecek Vizyonu"}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {about.timav?.p1 || "Türkiye İmam Hatipliler Vakfı (TİMAV); 30 yılı aşkın süredir eğitim, kültür, sanat ve akademi sahasında nesillerin yetişmesine öncülük eden, Türkiye'nin saygın ve köklü sivil toplum kuruluşlarındandır."}
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {about.timav?.p2 || "İrfan Meclisi; TİMAV'ın gençlik vizyonunun en somut ve dinamik tezahürlerinden biri olarak, gençleri sadece teorik bilgiyle değil; meclis başkanı, komisyon raportörü, müzakereci ve kanun yapıcı kimlikleriyle geleceğe hazırlar."}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 shadow-md">
                  <span className="text-3xl font-serif font-bold text-[#4DA3FF]">{about.timav?.stat1Number || "30+ Yıl"}</span>
                  <p className="text-xs text-slate-400 mt-1 font-sans">{about.timav?.stat1Label || "Eğitim ve Gençlik Tecrübesi"}</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#061A33] border border-[#4DA3FF]/20 shadow-md">
                  <span className="text-3xl font-serif font-bold text-[#4DA3FF]">{about.timav?.stat2Number || "10.000+"}</span>
                  <p className="text-xs text-slate-400 mt-1 font-sans">{about.timav?.stat2Label || "Gencimize Ulaşan Projeler"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CTA                                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#092746] to-[#0D3156] border border-[#4DA3FF]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {about.bottomCta?.heading || "Tarihe Not Düşecek 250 Delegeden Biri Olun"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {about.bottomCta?.description || "Başvurular kontenjanlarla sınırlıdır. Erken başvuru değerlendirmede önceliklidir."}
            </p>
          </div>
          <Link
            href="/basvuru"
            className="px-8 py-4 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#061A33]" />
            <span>{about.bottomCta?.buttonText || "Delege Başvuru Formuna Git"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="TİMAV Gençlik Vizyonu ve İrfan Meclisi"
      />

      {/* Photo Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

    </div>
  );
}
