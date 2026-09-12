'use client';

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Users, 
  Calendar,
  Clock,
  Radio,
  Filter
} from 'lucide-react';
import { Announcement, AnnouncementPriority, AnnouncementTarget } from '@/lib/types';
import { getStoredAnnouncements, createAnnouncement, deleteAnnouncement, getStoredApplications } from '@/lib/storage';

interface AnnouncementsManagerProps {
  totalDelegatesCount?: number;
  approvedDelegatesCount?: number;
}

export default function AnnouncementsManager({ 
  totalDelegatesCount, 
  approvedDelegatesCount 
}: AnnouncementsManagerProps = {}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [counts, setCounts] = useState({ total: totalDelegatesCount || 0, approved: approvedDelegatesCount || 0 });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetGroup, setTargetGroup] = useState<AnnouncementTarget>('all');
  const [authorName, setAuthorName] = useState('Divan Heyeti Başkanlığı');
  const [sentToast, setSentToast] = useState(false);
  const [filterPriority, setFilterPriority] = useState<'all' | AnnouncementPriority>('all');

  useEffect(() => {
    const apps = getStoredApplications();
    const total = totalDelegatesCount ?? apps.length;
    const approved = approvedDelegatesCount ?? apps.filter((a) => a.status === 'approved').length;
    setCounts({ total, approved });
    setAnnouncements(getStoredAnnouncements());

    const handleUpdate = () => {
      setAnnouncements(getStoredAnnouncements());
      const updatedApps = getStoredApplications();
      setCounts({
        total: totalDelegatesCount ?? updatedApps.length,
        approved: approvedDelegatesCount ?? updatedApps.filter((a) => a.status === 'approved').length
      });
    };
    window.addEventListener('igm_announcements_updated', handleUpdate);
    window.addEventListener('igm_auth_change', handleUpdate);
    return () => {
      window.removeEventListener('igm_announcements_updated', handleUpdate);
      window.removeEventListener('igm_auth_change', handleUpdate);
    };
  }, [totalDelegatesCount, approvedDelegatesCount]);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      priority,
      targetGroup,
      authorName: authorName.trim() || 'Divan Heyeti'
    });

    setTitle('');
    setContent('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
      const updated = deleteAnnouncement(id);
      setAnnouncements(updated);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (filterPriority === 'all') return true;
    return a.priority === filterPriority;
  });

  const estimatedReach = 
    targetGroup === 'all' 
      ? counts.total 
      : targetGroup === 'approved_delegates' 
      ? counts.approved 
      : Math.max(0, counts.total - counts.approved);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* TOP HEADER & STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#091e36] border border-[#143761] flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Toplam Yayınlanan Duyuru</span>
            <span className="text-2xl font-serif font-bold text-white leading-tight">{announcements.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sistem geneli bildirim</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091e36] border border-[#143761] flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Onaylı Delege Erişimi</span>
            <span className="text-2xl font-serif font-bold text-white leading-tight">{approvedDelegatesCount} Delege</span>
            <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">Doğrudan paneline iletilir</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091e36] border border-[#143761] flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Anlık Senkronizasyon</span>
            <span className="text-sm font-bold text-white leading-tight">Aktif & Canlı</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sayfa yenileme gerektirmez</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID: FORM + SENT LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: BROADCAST FORM (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#091e36] border border-[#143761] shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">Yeni Duyuru / Bildirim Yayınla</h3>
              <p className="text-xs text-slate-400">Delegelere anında iletilecek resmi duyuru oluşturun.</p>
            </div>
          </div>

          {sentToast && (
            <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">Duyuru başarıyla yayınlandı ve delege panellerine anlık iletildi!</span>
            </div>
          )}

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duyuru Başlığı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: 23 Ekim Oturumu Yaka Kartı Dağıtımı Hakkında"
                className="w-full bg-[#061527] border border-[#143761] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Öncelik Derecesi
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                  className="w-full bg-[#061527] border border-[#143761] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#4DA3FF] cursor-pointer"
                >
                  <option value="normal">Normal Duyuru (Mavi)</option>
                  <option value="important">Önemli Bilgilendirme (Amber)</option>
                  <option value="urgent">Acil / Kritik Duyuru (Kırmızı)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hedef Kitle
                </label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value as AnnouncementTarget)}
                  className="w-full bg-[#061527] border border-[#143761] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#4DA3FF] cursor-pointer"
                >
                  <option value="all">Tüm Katılımcılar ({totalDelegatesCount})</option>
                  <option value="approved_delegates">Yalnızca Onaylı Delegeler ({approvedDelegatesCount})</option>
                  <option value="pending">Beklemede Olan Başvurular</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gönderen Birim / Yetkili
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Örn: Divan Heyeti Başkanlığı"
                className="w-full bg-[#061527] border border-[#143761] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duyuru / Mesaj Metni *
              </label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Sayın Delegelerimiz, İrfan Meclisi 2026 oturumları için..."
                className="w-full bg-[#061527] border border-[#143761] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] leading-relaxed"
              />
            </div>

            {/* Audience estimate banner */}
            <div className="p-3 rounded-xl bg-[#061527] border border-[#143761] flex items-center justify-between text-xs">
              <span className="text-slate-400">Tahmini Bildirim Ulaşımı:</span>
              <span className="font-mono font-bold text-[#4DA3FF]">{estimatedReach} Kişi</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1a68d1] hover:bg-[#1554a9] text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>Duyuruyu Yayınla ve Bildirim Gönder</span>
            </button>
          </form>
        </div>

        {/* RIGHT: BROADCAST HISTORY LIST (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#091e36] border border-[#143761] shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Yayınlanmış Duyurular</h3>
              <p className="text-xs text-slate-400">Sistemde aktif ve delege panellerinde görünen bildirimler.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-[#061527] p-1 rounded-xl border border-[#143761]">
              {(['all', 'urgent', 'important', 'normal'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    filterPriority === p ? 'bg-[#1a68d1] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p === 'all' ? 'Tümü' : p === 'urgent' ? 'Acil' : p === 'important' ? 'Önemli' : 'Normal'}
                </button>
              ))}
            </div>
          </div>

          {filteredAnnouncements.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#061527]/50 border border-dashed border-[#143761] space-y-2">
              <Bell className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">Bu filtrede gösterilecek bir duyuru bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ann.priority === 'urgent'
                      ? 'bg-red-950/30 border-red-500/40'
                      : ann.priority === 'important'
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-[#061527] border-[#143761]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ann.priority === 'urgent'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : ann.priority === 'important'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-[#4DA3FF] border border-blue-500/40'
                        }`}
                      >
                        {ann.priority === 'urgent' ? 'Acil' : ann.priority === 'important' ? 'Önemli' : 'Normal'}
                      </span>

                      <span className="px-2 py-0.5 rounded-full bg-[#081e38] text-slate-300 text-[10px] font-medium border border-white/5">
                        {ann.targetGroup === 'all'
                          ? 'Tüm Katılımcılar'
                          : ann.targetGroup === 'approved_delegates'
                          ? 'Onaylı Delegeler'
                          : 'Bekleyenler'}
                      </span>

                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(ann.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 rounded-lg bg-[#081e38] hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Duyuruyu Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs sm:text-sm font-serif font-bold text-white mb-1">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Yetkili: {ann.authorName || 'Divan Heyeti'}</span>
                    <span className="text-emerald-400 font-medium">✓ Yayında</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
