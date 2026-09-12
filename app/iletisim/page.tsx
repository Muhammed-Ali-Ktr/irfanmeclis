'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Train, 
  Plane, 
  Bus, 
  Car, 
  Sparkles, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

import InnerPageHero from '@/components/InnerPageHero';
import { getStoredCMSData, CMSData, INITIAL_CMS_DATA } from '@/lib/cmsStorage';

export default function ContactPage() {
  const [cmsData, setCmsData] = useState<CMSData>(INITIAL_CMS_DATA);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setCmsData(getStoredCMSData());
    const handleUpdate = () => setCmsData(getStoredCMSData());
    window.addEventListener('igm_cms_updated', handleUpdate);
    return () => window.removeEventListener('igm_cms_updated', handleUpdate);
  }, []);

  const contact = cmsData.contact || INITIAL_CMS_DATA.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const transportOptions = [
    {
      title: 'Yüksek Hızlı Tren (YHT)',
      icon: Train,
      color: 'text-[#4DA3FF] bg-[#061A33] border-[#4DA3FF]/30',
      description: contact.transport?.yht || INITIAL_CMS_DATA.contact.transport.yht
    },
    {
      title: 'Konya Havalimanı (KYA)',
      icon: Plane,
      color: 'text-[#4DA3FF] bg-[#061A33] border-[#4DA3FF]/30',
      description: contact.transport?.airport || INITIAL_CMS_DATA.contact.transport.airport
    },
    {
      title: 'Tramvay & Toplu Taşıma',
      icon: Bus,
      color: 'text-[#4DA3FF] bg-[#061A33] border-[#4DA3FF]/30',
      description: contact.transport?.tram || INITIAL_CMS_DATA.contact.transport.tram
    },
    {
      title: 'Özel Araç & Otopark',
      icon: Car,
      color: 'text-[#4DA3FF] bg-[#061A33] border-[#4DA3FF]/30',
      description: contact.transport?.car || INITIAL_CMS_DATA.contact.transport.car
    }
  ];


  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="KONUM & ULAŞIM MASASI"
        title="Etkinlik Lokasyonu & İletişim"
        description="23-24-25 Ekim 2026 tarihlerinde Selçuklu Kongre Merkezi'nde buluşuyoruz. Ulaşım detayları, salon bilgileri ve irtibat kanalları aşağıda yer almaktadır."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'İletişim' }
        ]}
      />

      {/* 2. VENUE VISUALS & ADDRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] border border-[#4DA3FF]/30 shadow-2xl group bg-[#061A33]">
            <Image
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
              alt="Selçuklu Kongre Merkezi (SKM)"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061A33] via-[#061A33]/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#061A33]/90 backdrop-blur-md border border-[#4DA3FF]/20 text-xs">
              <span className="text-[#4DA3FF] font-serif font-bold text-sm block mb-1">
                Selçuklu Kongre Merkezi (SKM) • Konya
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                Türkiye'nin en modern ve prestijli kongre merkezlerinden biri; 2.200 kişilik Sultan Selim Ana Salonu ve 8 ihtisas çalıştayı odası.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-7 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl space-y-3">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#4DA3FF]" />
                <span>Etkinlik Adresi</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {contact.address || 'Selçuklu Kongre Merkezi (SKM)\nYazır Mah. Doç. Dr. Halil Ürün Cad. No: 28 Selçuklu / KONYA'}
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl space-y-3">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-[#4DA3FF]" />
                <span>Doğrudan İrtibat Bilgileri</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-300 font-sans">
                <p><strong className="text-white">TİMAV Genel Merkezi:</strong> {contact.phoneTimav || '+90 (332) 350 20 40'}</p>
                <p><strong className="text-white">Meclis Koordinasyon Masası:</strong> {contact.phoneCoord || '+90 (532) 111 20 26'}</p>
                <p><strong className="text-white">Resmi E-Posta:</strong> {contact.email || 'bilgi@timav.org.tr / irfanmeclisi@timav.org.tr'}</p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-xl space-y-2">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#4DA3FF]" />
                <span>Akreditasyon Saatleri</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {contact.hours || '23 Ekim 2026 Cuma günü 08:30 - 09:30 saatleri arasında giriş holünde delege yaka kartları ve QR bilet kontrolü yapılacaktır.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TRANSPORTATION GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#4DA3FF]/15">
        <div className="mb-10">
          <span className="text-xs font-bold text-[#4DA3FF] uppercase tracking-wider">
            Şehre Geliş Rehberi
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Konya'ya ve Kongre Merkezine Ulaşım
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {transportOptions.map((opt, idx) => {
            const IconComp = opt.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/60 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform ${opt.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white mb-2">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {opt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MAP & CONTACT FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#4DA3FF]/20 bg-[#092746] min-h-[420px] shadow-2xl">
            <iframe
              title="Selçuklu Kongre Merkezi Konumu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.8821045939223!2d32.49397667634407!3d37.914282504353455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d08f7514a6e545%3A0xe5a3c051a823e595!2sSel%C3%A7uklu%20Kongre%20Merkezi!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-5 rounded-3xl bg-[#092746] border border-[#4DA3FF]/20 p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-1">
                Bize Mesaj Gönderin
              </h3>
              <p className="text-xs text-slate-300 mb-6 font-sans">
                Delege kayıtları, konaklama veya sponsorluk ile ilgili sorularınız için yazabilirsiniz.
              </p>

              {sent ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-serif font-bold text-white">Mesajınız Alındı!</h4>
                  <p className="text-xs text-slate-300">
                    Koordinasyon ekibimiz en kısa sürede e-posta adresiniz üzerinden geri dönüş sağlayacaktır.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1 font-sans">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ad Soyad"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1 font-sans">E-Posta Adresiniz *</label>
                    <input
                      type="email"
                      required
                      placeholder="adiniz@ornek.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1 font-sans">Konu</label>
                    <input
                      type="text"
                      placeholder="Delege Başvurusu / Ulaşım / vb."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1 font-sans">Mesajınız *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Sorunuzu veya talebinizi iletiniz..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-xl hover:shadow-[#4DA3FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#061A33]" />
                    <span>Mesajı İlet</span>
                  </button>
                </form>
              )}
            </div>

            <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400 font-sans">
              Ortalama yanıt süremiz 2-4 saattir.
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
