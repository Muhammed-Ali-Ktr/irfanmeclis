'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Search 
} from 'lucide-react';
import { COMMISSIONS, TEAM_MEMBERS } from '@/lib/data';
import CommissionCard from '@/components/CommissionCard';
import InnerPageHero from '@/components/InnerPageHero';

export default function CommissionsAndTeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tüm Ekip (100 Kişi)' },
    { id: 'genel_koordinasyon', label: 'Genel Koordinasyon & Divan' },
    { id: 'komisyon_baskani', label: 'Komisyon Başkanları' },
    { id: 'basin_medya', label: 'Basın, Prodüksiyon & Medya' },
    { id: 'lojistik', label: 'Lojistik & Protokol' },
    { id: 'delege_iliskileri', label: 'Delege İlişkileri & Rehberlik' },
  ];

  const filteredTeam = TEAM_MEMBERS.filter((member) => {
    const matchCat = selectedCategory === 'all' || member.category === selectedCategory;
    const matchSearch = 
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.university && member.university.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="KOMİSYONLAR & ORGANİZASYON MASASI"
        title="8 İhtisas Masası & 100 Kişilik Güçlü Ekip"
        description="Her komisyon, ilgili alanda akademik ve sivil toplum deneyimine sahip başkanlar ile raportörler rehberliğinde çalışır. 100 kişilik organizasyon kadromuz ise 3 günlük zirvenin kusursuz işlemesini sağlar."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Komisyonlar & Ekip' }
        ]}
      />

      {/* 2. 8 KOMİSYON DETAYLI KARTLARI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20" id="komisyonlar">
        <div className="p-8 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-2xl mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#4DA3FF] font-bold text-xs uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Müzakere ve Kanun Yapma Masaları</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              8 Ana İhtisas Komisyonu
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              İlgilendiğiniz komisyonun detaylarına tıklayarak tartışılacak konuları, yasa hedeflerini inceleyebilir ve doğrudan başvuru yapabilirsiniz.
            </p>
          </div>
          <Link
            href="/komisyonlar"
            className="px-6 py-3 rounded-full bg-[#061A33] border border-[#4DA3FF]/30 hover:border-[#4DA3FF] text-white text-xs font-semibold shrink-0 flex items-center gap-2 transition-all"
          >
            <span>Ayrıntılı Komisyon Sayfası</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#4DA3FF]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMISSIONS.map((commission) => (
            <div key={commission.id} id={commission.id}>
              <CommissionCard commission={commission} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. ORGANİZASYON EKİBİ (100 KİŞİLİK YAPI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#4DA3FF]/15" id="ekip">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#4DA3FF] font-bold text-xs uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Gönüllü ve Profesyonel Kadro</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Organizasyon Ekibi (100 Kişilik Yapı)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Etkinliğin planlanmasından yürütülmesine kadar görev alan koordinasyon kurulu ve birim başkanlarımız.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ekip üyesi veya görev ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#092746] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#4DA3FF] text-[#061A33] font-bold shadow-lg shadow-[#4DA3FF]/20'
                  : 'bg-[#092746] text-slate-300 hover:text-white border border-[#4DA3FF]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/60 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
            >
              <div>
                {/* Profile Photo */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-[#061A33] border border-[#4DA3FF]/20">
                  <Image
                    src={member.imageUrl}
                    alt={member.fullName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A33]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <h3 className="text-base font-serif font-bold text-white group-hover:text-[#4DA3FF] transition-colors">
                  {member.fullName}
                </h3>
                <p className="text-xs font-semibold text-[#4DA3FF] mt-0.5 font-sans">
                  {member.role}
                </p>

                {member.university && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-[#4DA3FF] shrink-0" />
                    <span className="truncate">{member.university}</span>
                  </div>
                )}

                {member.bio && (
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Tag */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4DA3FF] bg-[#061A33] px-2 py-0.5 rounded-full border border-[#4DA3FF]/20">
                  {member.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">TİMAV Kadrosu</span>
              </div>
            </div>
          ))}
        </div>

        {filteredTeam.length === 0 && (
          <div className="p-12 text-center bg-[#092746] rounded-2xl border border-[#4DA3FF]/20 mt-6">
            <p className="text-slate-300 text-sm">Aradığınız kriterlere uygun ekip üyesi bulunamadı.</p>
          </div>
        )}
      </section>

      {/* 4. BOTTOM JOIN CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#092746] to-[#0D3156] border border-[#4DA3FF]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Gönüllü veya Delege Olarak Yerini Al
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Komisyon çalışmalarında delege olmak veya organizasyon ekibine katılmak için başvur.
            </p>
          </div>
          <Link
            href="/basvuru"
            className="px-8 py-4 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-sm shadow-xl hover:shadow-[#4DA3FF]/30 transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#061A33]" />
            <span>Hemen Başvuru Yap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
