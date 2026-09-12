'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Download, 
  Printer, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Mail, 
  Phone, 
  Sparkles, 
  X, 
  Check, 
  AlertTriangle,
  QrCode,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Lock
} from 'lucide-react';
import { Application, ApplicationStatus, GalleryItem } from '@/lib/types';
import { 
  getStoredApplications, 
  saveStoredApplications, 
  updateApplication, 
  updateApplicationStatus, 
  toggleUserStatus, 
  safeDeleteApplication,
  getStoredGallery,
  syncApplicationsWithSupabase
} from '@/lib/storage';
import { COMMISSIONS } from '@/lib/data';

export default function UsersManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionFilter, setCommissionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'passive'>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'fullName' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState<Application | null>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [userQrDataUrl, setUserQrDataUrl] = useState('');

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<Application | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    department: '',
    commissionId: '',
    city: '',
    password: ''
  });

  // Delete Confirmation Modal State
  const [userToDelete, setUserToDelete] = useState<Application | null>(null);

  const loadAll = () => {
    setApplications(getStoredApplications());
    setGallery(getStoredGallery());
    syncApplicationsWithSupabase().then((synced) => {
      if (synced) setApplications(synced);
    });
  };

  useEffect(() => {
    loadAll();
    const handleAuth = () => loadAll();
    window.addEventListener('igm_auth_change', handleAuth);
    window.addEventListener('igm_applications_updated', handleAuth);
    return () => {
      window.removeEventListener('igm_auth_change', handleAuth);
      window.removeEventListener('igm_applications_updated', handleAuth);
    };
  }, []);

  // Generate QR for detail modal
  useEffect(() => {
    if (selectedUser?.qrCodeId) {
      const qrValue = selectedUser.secureQrToken || selectedUser.qrCodeId;
      QRCode.toDataURL(
        qrValue,
        {
          width: 300,
          margin: 2,
          color: { dark: '#0A1628', light: '#ffffff' }
        },
        (err, url) => {
          if (!err && url) setUserQrDataUrl(url);
          else setUserQrDataUrl('');
        }
      );
    } else {
      setUserQrDataUrl('');
    }
  }, [selectedUser]);

  // Filtering & Sorting
  const filteredUsers = applications.filter((app) => {
    if (commissionFilter !== 'all' && app.commissionId !== commissionFilter) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (activeFilter === 'active' && app.isActive === false) return false;
    if (activeFilter === 'passive' && app.isActive !== false) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.fullName.toLowerCase().includes(q);
      const matchEmail = app.email.toLowerCase().includes(q);
      const matchPhone = app.phone.toLowerCase().includes(q);
      const matchSchool = (app.school || '').toLowerCase().includes(q);
      const matchQr = (app.qrCodeId || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchSchool && !matchQr) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortField === 'createdAt') {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? tB - tA : tA - tB;
    }
    if (sortField === 'fullName') {
      return sortOrder === 'desc' 
        ? b.fullName.localeCompare(a.fullName, 'tr') 
        : a.fullName.localeCompare(b.fullName, 'tr');
    }
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Actions
  const handleToggleActive = (user: Application) => {
    const updated = toggleUserStatus(user.id);
    if (updated) {
      loadAll();
      if (selectedUser?.id === user.id) setSelectedUser(updated);
    }
  };

  const handleStatusUpdate = (user: Application, newStatus: ApplicationStatus) => {
    updateApplicationStatus(user.id, newStatus, 'Admin Panel');
    loadAll();
    if (selectedUser?.id === user.id) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const openEditModal = (user: Application) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      school: user.school || '',
      department: user.department || '',
      commissionId: user.commissionId || '',
      city: user.city || '',
      password: user.password || ''
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateApplication(editingUser.id, editFormData);
    loadAll();
    if (selectedUser?.id === editingUser.id) {
      setSelectedUser((prev) => (prev ? { ...prev, ...editFormData } : null));
    }
    setEditingUser(null);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    safeDeleteApplication(userToDelete.id);
    loadAll();
    if (selectedUser?.id === userToDelete.id) {
      setSelectedUser(null);
    }
    setUserToDelete(null);
  };

  // Find user media in gallery
  const getUserMedia = (user: Application) => {
    const cleanName = user.fullName.toLowerCase();
    const cleanEmail = user.email.toLowerCase();
    return gallery.filter(
      (g) =>
        (g.uploaderName && g.uploaderName.toLowerCase().includes(cleanName)) ||
        (g.uploaderEmail && g.uploaderEmail.toLowerCase() === cleanEmail)
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              Sistem Yönetimi
            </span>
            <span className="text-xs text-slate-400">Merkezi Kullanıcı & Delege Havuzu</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1E6FFB]" />
            Kullanıcı Yönetim Merkezi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sisteme kayıtlı tüm kullanıcı ve delege başvurularını listeleyin, onaylayın, profillerini inceleyin ve QR erişimlerini yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Toplam Kayıt</span>
            <span className="text-lg font-bold text-slate-900">{applications.length} Kullanıcı</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ad Soyad, e-posta, telefon, QR kodu veya üniversite ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E6FFB]"
            />
          </div>

          {/* Commission Filter */}
          <div>
            <select
              value={commissionFilter}
              onChange={(e) => {
                setCommissionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1E6FFB]"
            >
              <option value="all">Tüm Komisyonlar</option>
              {COMMISSIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Application Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1E6FFB]"
            >
              <option value="all">Tüm Başvuru Durumları</option>
              <option value="approved">Onaylananlar</option>
              <option value="pending">Onay Bekleyenler</option>
              <option value="rejected">Reddedilenler</option>
            </select>
          </div>

          {/* User Account Status */}
          <div>
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1E6FFB]"
            >
              <option value="all">Hesap Durumu: Tümü</option>
              <option value="active">Yalnızca Aktif</option>
              <option value="passive">Yalnızca Pasif / Dondurulmuş</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PROFESSIONAL USERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                <th className="py-3 px-4">Kullanıcı</th>
                <th className="py-3 px-4">İletişim</th>
                <th className="py-3 px-4">Komisyon</th>
                <th className="py-3 px-4">Şehir / Üniversite</th>
                <th className="py-3 px-4 text-center">Başvuru</th>
                <th className="py-3 px-4 text-center">Hesap</th>
                <th className="py-3 px-4">Kayıt Tarihi</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    Aranan kriterlere uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isApproved = user.status === 'approved';
                  const isPending = user.status === 'pending';
                  const isRejected = user.status === 'rejected';
                  const isActive = user.isActive !== false;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Avatar & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs bg-slate-200">
                                {user.fullName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {user.fullName}
                            </span>
                            <span className="text-[11px] font-mono text-blue-600 block mt-0.5">
                              {user.qrCodeId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3 px-4">
                        <span className="text-slate-700 block">{user.email}</span>
                        <span className="text-slate-400 text-[11px] block">{user.phone}</span>
                      </td>

                      {/* Commission */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px]">
                          {user.commissionId.toUpperCase()}
                        </span>
                      </td>

                      {/* School / City */}
                      <td className="py-3 px-4 text-slate-600">
                        <span className="block font-medium truncate max-w-[160px]" title={user.school}>
                          {user.school}
                        </span>
                        <span className="text-slate-400 text-[11px] block">{user.city || 'Konya'}</span>
                      </td>

                      {/* Application Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <Clock className="w-3 h-3" />}
                          {isRejected && <XCircle className="w-3 h-3" />}
                          {isApproved ? 'Onaylandı' : isPending ? 'Beklemede' : 'Reddedildi'}
                        </span>
                      </td>

                      {/* User Account Status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(user)}
                          title={isActive ? 'Hesabı dondur / pasifleştir' : 'Hesabı aktifleştir'}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {isActive ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowMoreDetails(false);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Kullanıcı Detayları"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Bilgileri Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Kullanıcıyı Güvenli Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Toplam <strong>{filteredUsers.length}</strong> kullanıcıdan{' '}
            <strong>{Math.min(filteredUsers.length, (currentPage - 1) * pageSize + 1)}</strong> -{' '}
            <strong>{Math.min(filteredUsers.length, currentPage * pageSize)}</strong> arası gösteriliyor
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. USER DETAIL MODAL (WITH "DAHA FAZLASINI GÖSTER" ACCORDION)               */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0A1628] to-[#132338] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden border-2 border-white/20 shrink-0">
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg bg-blue-600">
                      {selectedUser.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedUser.fullName}
                    {selectedUser.isActive === false && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Pasif Hesap
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedUser.email} • {selectedUser.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* PRIMARY ESSENTIAL INFO (SADE GÖRÜNÜM) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Komisyon</span>
                  <span className="font-bold text-slate-900 block mt-1">
                    {selectedUser.commissionId.toUpperCase()}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Başvuru Durumu</span>
                  <span className={`font-bold block mt-1 ${
                    selectedUser.status === 'approved'
                      ? 'text-emerald-600'
                      : selectedUser.status === 'pending'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {selectedUser.status === 'approved'
                      ? 'Onaylandı'
                      : selectedUser.status === 'pending'
                      ? 'Beklemede'
                      : 'Reddedildi'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Şehir / Kurum</span>
                  <span className="font-bold text-slate-900 block mt-1 truncate">
                    {selectedUser.city || 'Konya'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Yoklama Katılımı</span>
                  <span className="font-bold text-blue-600 block mt-1">
                    {(selectedUser.attendanceDays || []).length} / 3 Gün
                  </span>
                </div>
              </div>

              {/* Status Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-slate-700">
                  <span className="font-semibold block">Başvuru Değerlendirmesi:</span>
                  <span className="text-[11px] text-slate-500">
                    Başvuru durumunu buradan anında değiştirebilirsiniz.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedUser, 'approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedUser.status === 'approved'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedUser, 'rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedUser.status === 'rejected'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    Reddet
                  </button>
                </div>
              </div>

              {/* TOGGLE: DAHA FAZLASINI GÖSTER / DAHA AZ GÖSTER */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowMoreDetails(!showMoreDetails)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                >
                  {showMoreDetails ? (
                    <>
                      <span>Daha Az Göster</span>
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#1E6FFB]" />
                      <span>Daha Fazlasını Göster (Başvuru, QR, Yoklama, Medya & Sistem Kayıtları)</span>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </>
                  )}
                </button>
              </div>

              {/* EXPANDED ACCORDION CONTENT */}
              {showMoreDetails && (
                <div className="space-y-6 pt-2 border-t border-slate-200">
                  {/* SECTION 1: BAŞVURU BİLGİLERİ */}
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Başvuru Formu Bilgileri
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">T.C. Kimlik / Delege No</span>
                        <span className="font-mono text-slate-800 font-semibold">{selectedUser.identityNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">2. Komisyon Tercihi</span>
                        <span className="text-slate-800 font-semibold">
                          {selectedUser.secondChoiceId ? selectedUser.secondChoiceId.toUpperCase() : 'Belirtilmedi'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Üniversite / Okul</span>
                        <span className="text-slate-800 font-semibold">{selectedUser.school}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Bölüm / Sınıf</span>
                        <span className="text-slate-800 font-semibold">{selectedUser.department}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Motivasyon / Başvuru Notu</span>
                        <p className="text-slate-700 mt-1 italic bg-white p-3 rounded-lg border border-slate-200">
                          “{selectedUser.motivation || 'Motivasyon mektubu girilmemiş.'}”
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: ETKİNLİK, ONUR BELGESİ & YOKLAMA DETAYLARI */}
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Etkinlik & Yoklama Geçmişi
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {['23 Ekim', '24 Ekim', '25 Ekim'].map((day) => {
                          const attended = (selectedUser.attendanceDays || []).includes(day);
                          return (
                            <div
                              key={day}
                              className={`p-3 rounded-xl border text-center ${
                                attended
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                  : 'bg-slate-100 border-slate-200 text-slate-400'
                              }`}
                            >
                              <span className="block font-bold text-xs">{day}</span>
                              <span className="text-[10px] block mt-0.5">
                                {attended ? '✓ Katıldı' : '✗ Katılmadı'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed attendance logs */}
                      {selectedUser.attendanceLogs && selectedUser.attendanceLogs.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Zaman Damgalı Yoklama Kayıtları
                          </span>
                          <div className="space-y-1">
                            {selectedUser.attendanceLogs.map((log, i) => (
                              <div key={i} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-200">
                                <span className="font-semibold text-slate-800">{log.day} - {log.session || 'Genel Oturum'}</span>
                                <span className="text-slate-500 font-mono">
                                  {new Date(log.scannedAt).toLocaleString('tr-TR')} ({log.adminName || 'Admin'})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 3: KULLANICIYA ÖZEL GÜVENLİ QR KOD */}
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      Delegeye Özel QR Giriş Kartı
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                        {userQrDataUrl ? (
                          <img src={userQrDataUrl} alt="QR" className="w-36 h-36 object-contain" />
                        ) : (
                          <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                            QR Üretiliyor...
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 text-slate-700 w-full">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Resmi QR ID</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">{selectedUser.qrCodeId}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Güvenli Kriptografik Token</span>
                          <span className="font-mono text-xs text-indigo-600 break-all">
                            {selectedUser.secureQrToken || 'Sistem tarafından üretilmedi'}
                          </span>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2">
                          {userQrDataUrl && (
                            <a
                              href={userQrDataUrl}
                              download={`QR_${selectedUser.fullName.replace(/\s+/g, '_')}.png`}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              QR İndir
                            </a>
                          )}
                          <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Yazdır
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: KULLANICININ YÜKLEDİĞİ MEDYALAR */}
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-600" />
                      Kullanıcı Medya & Galeri Gönderileri
                    </h4>
                    {getUserMedia(selectedUser).length === 0 ? (
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center text-slate-400">
                        Bu kullanıcı tarafından henüz galeriye görsel yüklenmemiştir.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {getUserMedia(selectedUser).map((item) => (
                          <div key={item.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                            <div className="h-24 bg-slate-200 relative">
                              <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2">
                              <span className="font-bold text-slate-900 truncate block text-[11px]">
                                {item.title}
                              </span>
                              <div className="flex items-center justify-between mt-1 text-[10px]">
                                <span className="text-slate-400">{item.createdAt}</span>
                                <span className={`font-bold ${item.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {item.isApproved ? 'Onaylandı' : 'Bekliyor'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 5: SİSTEM DEĞİŞİKLİK & HESAP GÜNLÜĞÜ */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                    <p><strong>Hesap Oluşturulma:</strong> {new Date(selectedUser.createdAt).toLocaleString('tr-TR')}</p>
                    <p><strong>Son Giriş:</strong> {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString('tr-TR') : 'Henüz giriş yapılmadı'}</p>
                    <p><strong>Son Güncelleme:</strong> {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString('tr-TR') : 'Değişiklik yok'}</p>
                    {selectedUser.approvedAt && (
                      <p><strong>Onay Bilgisi:</strong> {new Date(selectedUser.approvedAt).toLocaleString('tr-TR')} ({selectedUser.approvedBy || 'Admin'})</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EDIT USER MODAL                                                        */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Kullanıcı Bilgilerini Düzenle
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">E-Posta</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Telefon</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Komisyon</label>
                  <select
                    value={editFormData.commissionId}
                    onChange={(e) => setEditFormData({ ...editFormData, commissionId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    {COMMISSIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Şehir</label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Üniversite / Kurum</label>
                <input
                  type="text"
                  value={editFormData.school}
                  onChange={(e) => setEditFormData({ ...editFormData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bölüm</label>
                  <input
                    type="text"
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">6 Haneli Şifre / PIN</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SAFE DELETE CONFIRMATION MODAL                                         */}
      {/* ========================================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-center font-bold text-base text-slate-900 mb-2">
              Kullanıcıyı Silmek İstediğinize Emin misiniz?
            </h3>
            <p className="text-center text-xs text-slate-500 mb-6">
              <strong>{userToDelete.fullName}</strong> ({userToDelete.email}) adlı kullanıcının kaydı sistemden kalıcı olarak kaldırılacaktır.
              Varsa ilişkili yoklama ve galeri verileri sistem bütünlüğü için güvenle ayrıştırılacaktır.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
              >
                Evet, Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
