'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Search,
  Building2,
  Mail,
  Award
} from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/data';
import { getStoredCMSData, CMSData } from '@/lib/cmsStorage';
import InnerPageHero from '@/components/InnerPageHero';

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cmsData, setCmsData] = useState<CMSData>(getStoredCMSData());

  React.useEffect(() => {
    const handleUpdate = () => {
      setCmsData(getStoredCMSData());
    };
    window.addEventListener('igm_cms_updated', handleUpdate);
    return () => window.removeEventListener('igm_cms_updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', label: 'Tüm Kadro' },
    { id: 'divan', label: 'Genel Koordinasyon & Divan' },
    { id: 'komisyon_baskani', label: 'Komisyon Başkanları' },
    { id: 'yonetim', label: 'Yönetim Kurulu' },
    { id: 'akademik', label: 'Akademik Danışmanlar' },
    { id: 'koordinasyon', label: 'Gençlik Koordinasyonu' },
  ];

  const teamList = cmsData.team && cmsData.team.length > 0 ? cmsData.team : TEAM_MEMBERS;

  const filteredTeam = teamList.filter((member: any) => {
    const matchCat = selectedCategory === 'all' || member.category === selectedCategory;
    const name = member.name || member.fullName || '';
    const role = member.role || '';
    const university = member.university || '';
    const matchSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#061A33] text-white">
      {/* 1. HERO BANNER */}
      <InnerPageHero
        badge="GÖNÜLLÜ VE PROFESYONEL KADRO"
        title="100 Kişilik Organizasyon Ekibi"
        description="“Kökümüz İrfan, Sözümüz İstikbal” — İrfan Meclisi'nin planlanmasından oturumların yönetilmesine kadar 3 gün boyunca sahada görev yapan divan heyeti, komisyon başkanları ve koordinasyon birimlerimiz."
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Organizasyon Ekibi' }
        ]}
      />

      {/* 2. FILTER & SEARCH CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="p-6 rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Birimlere Göre İnceleyin</h3>
              <p className="text-xs text-slate-300">Ekip üyeleri ve koordinasyon sorumluları</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#4DA3FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İsim, görev veya üniversite ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#061A33] border border-[#4DA3FF]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4DA3FF]"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#4DA3FF] text-[#061A33] shadow-lg shadow-[#4DA3FF]/20 font-bold'
                    : 'bg-[#061A33] text-slate-300 hover:text-white border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TEAM MEMBERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl bg-[#092746] border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#4DA3FF]/10"
            >
              <div>
                {/* Profile Photo */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-5 bg-[#061A33] border border-[#4DA3FF]/20">
                  <Image
                    src={member.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={member.fullName || 'Ekip Üyesi'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A33]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#4DA3FF] transition-colors">
                  {member.fullName}
                </h3>
                <p className="text-xs font-semibold text-[#4DA3FF] mt-1 font-sans">
                  {member.role}
                </p>

                {member.university && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                    <GraduationCap className="w-4 h-4 text-[#4DA3FF] shrink-0" />
                    <span className="truncate">{member.university}</span>
                  </div>
                )}

                {member.bio && (
                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Tag / Footer of card */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4DA3FF] bg-[#061A33] px-2.5 py-1 rounded-full border border-[#4DA3FF]/20">
                  {member.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">TİMAV Ekibi</span>
              </div>
            </div>
          ))}
        </div>

        {filteredTeam.length === 0 && (
          <div className="p-16 text-center bg-[#092746] rounded-2xl border border-[#4DA3FF]/20">
            <p className="text-slate-300 text-sm">Aradığınız kriterlere uygun ekip üyesi bulunamadı.</p>
          </div>
        )}
      </section>

      {/* 4. BOTTOM JOIN CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#092746] to-[#0D3156] border border-[#4DA3FF]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Geleceği Birlikte İnşa Edelim
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Komisyon çalışmalarında delege olmak veya organizasyon ekibine katılmak için başvuru formunu doldurun.
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
