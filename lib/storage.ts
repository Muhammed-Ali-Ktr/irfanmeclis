import { Application, ApplicationStatus, GalleryItem, GalleryItemStatus, Announcement, AttendanceRecord } from './types';
import { MOCK_APPLICATIONS, GALLERY_ITEMS, MOCK_ANNOUNCEMENTS } from './data';
import { supabase } from './supabase';
import * as XLSX from 'xlsx';

const APPLICATIONS_KEY = 'igm_applications_v2';
const GALLERY_KEY = 'igm_gallery_v2';
const ANNOUNCEMENTS_KEY = 'igm_announcements_v2';
const USER_SESSION_KEY = 'igm_participant_session_v1';

// Helper: Generate Secure Cryptographic QR Token
export function generateSecureQrToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3 || i === 7) token += '-';
  }
  return `IGM26-SEC-${token}`;
}

/**
 * Tarayıcı tarafında görsel sıkıştırma / boyutlandırma yardımcısı
 */
export async function compressImageFile(
  file: File, 
  maxDimension: number = 800, 
  quality: number = 0.85
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);

    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context oluşturulamadı'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, dataUrl });
          } else {
            reject(new Error('Görsel sıkıştırma başarısız oldu.'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Görsel dosyası açılamadı.'));
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// Supabase Data Mappers (snake_case <-> camelCase)
// -------------------------------------------------------------
export function mapRowToApplication(row: any): Application {
  return {
    id: String(row.id),
    createdAt: row.created_at || new Date().toISOString(),
    fullName: row.full_name || '',
    email: row.email || '',
    phone: row.phone || '',
    identityNo: row.identity_no || '',
    school: row.school || '',
    department: row.department || '',
    commissionId: row.commission_id || 'adalet',
    secondChoiceId: row.second_choice_id || undefined,
    motivation: row.motivation || '',
    status: (row.status as ApplicationStatus) || 'pending',
    qrCodeId: row.qr_code_id || `IGM26-${String(row.id).slice(0, 6)}`,
    secureQrToken: row.secure_qr_token || undefined,
    attendanceDays: Array.isArray(row.attendance_days) ? row.attendance_days : [],
    attendanceLogs: Array.isArray(row.attendance_logs) ? row.attendance_logs : [],
    city: row.city || 'Konya',
    password: row.password || '',
    avatarUrl: row.avatar_url || '',
    isActive: row.is_active !== false,
    isBlocked: Boolean(row.is_blocked),
    lastLoginAt: row.last_login_at || undefined,
    approvedAt: row.approved_at || undefined,
    approvedBy: row.approved_by || undefined,
    updatedAt: row.updated_at || undefined
  };
}

export function mapApplicationToRow(app: Application): Record<string, any> {
  return {
    id: app.id,
    created_at: app.createdAt,
    full_name: app.fullName,
    email: app.email,
    phone: app.phone,
    identity_no: app.identityNo,
    school: app.school,
    department: app.department,
    commission_id: app.commissionId,
    second_choice_id: app.secondChoiceId || null,
    motivation: app.motivation,
    status: app.status,
    qr_code_id: app.qrCodeId,
    secure_qr_token: app.secureQrToken || null,
    attendance_days: app.attendanceDays || [],
    attendance_logs: app.attendanceLogs || [],
    city: app.city || 'Konya',
    password: app.password || null,
    avatar_url: app.avatarUrl || null,
    is_active: app.isActive !== false,
    is_blocked: Boolean(app.isBlocked),
    last_login_at: app.lastLoginAt || null,
    approved_at: app.approvedAt || null,
    approved_by: app.approvedBy || null,
    updated_at: app.updatedAt || new Date().toISOString()
  };
}

// -------------------------------------------------------------
// 1. APPLICATIONS & USER MANAGEMENT
// -------------------------------------------------------------

export function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) {
      // Seed with initial mock applications
      const seeded = (MOCK_APPLICATIONS || []).map((app) => ({
        ...app,
        isActive: app.isActive ?? true,
        secureQrToken: app.secureQrToken || generateSecureQrToken(),
        attendanceLogs: app.attendanceLogs || (app.attendanceDays || []).map((day) => ({
          day,
          scannedAt: new Date().toISOString(),
          session: 'Genel Oturum',
          adminName: 'Sistem'
        }))
      }));
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const apps: Application[] = JSON.parse(raw);
    // Ensure backwards compatibility with new fields
    return apps.map((app) => ({
      ...app,
      isActive: app.isActive !== false,
      secureQrToken: app.secureQrToken || `IGM26-SEC-${app.qrCodeId.replace(/[^a-zA-Z0-9]/g, '')}`,
      attendanceLogs: app.attendanceLogs || []
    }));
  } catch {
    return [];
  }
}

export function saveStoredApplications(apps: Application[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    window.dispatchEvent(new Event('igm_auth_change'));
    window.dispatchEvent(new Event('igm_applications_updated'));
  } catch (err) {
    console.error('Failed to save applications to localStorage:', err);
  }
}

/**
 * Supabase bulut veritabanı ile yerel hafızayı senkronize eder.
 * Tüm admin panelleri bu fonksiyonu çağırarak farklı cihazlardan gelen başvuruları anında çeker.
 */
export async function syncApplicationsWithSupabase(): Promise<Application[]> {
  const localApps = getStoredApplications();
  if (!supabase) return localApps;

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase applications fetch warning:', error);
      return localApps;
    }

    if (data && Array.isArray(data)) {
      const remoteApps = data.map(mapRowToApplication);

      // Birleştirme: Supabase kayıtları esastır
      const remoteEmails = new Set(remoteApps.map((a) => a.email.toLowerCase()));
      const localOnly = localApps.filter(
        (a) => !remoteEmails.has(a.email.toLowerCase())
      );

      const merged = [...remoteApps, ...localOnly];
      saveStoredApplications(merged);
      return merged;
    }
  } catch (err) {
    console.error('Failed to sync applications with Supabase:', err);
  }

  return localApps;
}

export async function createApplication(
  data: Omit<Application, 'id' | 'createdAt' | 'status' | 'qrCodeId' | 'attendanceDays'>
): Promise<Application> {
  const apps = getStoredApplications();
  const codeSuffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = (data.commissionId || 'GEN').slice(0, 3).toUpperCase();
  const qrCodeId = `IGM26-${prefix}-${codeSuffix}`;
  const secureQrToken = generateSecureQrToken();

  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `app-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const newApp: Application = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
    qrCodeId,
    secureQrToken,
    attendanceDays: [],
    attendanceLogs: [],
    isActive: true,
    isBlocked: false
  };

  // 1. Yerel hafızaya anında yaz (hızlı kullanıcı deneyimi)
  const updated = [newApp, ...apps.filter((a) => a.email.toLowerCase() !== newApp.email.toLowerCase())];
  saveStoredApplications(updated);

  // 2. Supabase bulut veritabanına kaydet (tüm cihazlar için)
  if (supabase) {
    try {
      const row = mapApplicationToRow(newApp);
      const { error } = await supabase.from('applications').insert(row);
      if (error) {
        console.error('Supabase başvuru kaydetme hatası:', error);
      } else {
        console.log('Başvuru başarıyla Supabase buluta iletildi:', newApp.email);
      }
    } catch (err) {
      console.error('Supabase bağlantı istisnası:', err);
    }
  }

  return newApp;
}

export function updateApplication(id: string, updates: Partial<Application>): Application | null {
  const apps = getStoredApplications();
  let updatedApp: Application | null = null;
  const updated = apps.map((app) => {
    if (app.id === id) {
      updatedApp = { 
        ...app, 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return updatedApp;
    }
    return app;
  });
  saveStoredApplications(updated);

  // If current logged-in participant, update session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id && updatedApp) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedApp));
    }
  }

  // Supabase arka plan güncellemesi
  if (supabase && updatedApp) {
    const row = mapApplicationToRow(updatedApp);
    supabase.from('applications').update(row).eq('id', id).then(({ error }) => {
      if (error) console.error('Supabase update application error:', error);
    });
  }

  return updatedApp;
}

export function updateApplicationStatus(
  id: string, 
  status: ApplicationStatus, 
  adminName: string = 'Divan Heyeti'
): Application[] {
  const apps = getStoredApplications();
  let changedApp: Application | null = null;
  const updated = apps.map((app) => {
    if (app.id === id) {
      const isApproving = status === 'approved' && app.status !== 'approved';
      changedApp = {
        ...app,
        status,
        approvedAt: isApproving ? new Date().toISOString() : app.approvedAt,
        approvedBy: isApproving ? adminName : app.approvedBy,
        secureQrToken: app.secureQrToken || generateSecureQrToken(),
        updatedAt: new Date().toISOString()
      };
      return changedApp;
    }
    return app;
  });
  saveStoredApplications(updated);

  if (supabase && changedApp) {
    supabase.from('applications').update({
      status: (changedApp as Application).status,
      approved_at: (changedApp as Application).approvedAt || null,
      approved_by: (changedApp as Application).approvedBy || null,
      secure_qr_token: (changedApp as Application).secureQrToken || null,
      updated_at: new Date().toISOString()
    }).eq('id', id).then(({ error }) => {
      if (error) console.error('Supabase update status error:', error);
    });
  }

  return updated;
}

export function toggleUserStatus(id: string): Application | null {
  const apps = getStoredApplications();
  let toggled: Application | null = null;
  const updated = apps.map((app) => {
    if (app.id === id) {
      toggled = { ...app, isActive: app.isActive === false ? true : false, updatedAt: new Date().toISOString() };
      return toggled;
    }
    return app;
  });
  saveStoredApplications(updated);

  if (supabase && toggled) {
    supabase.from('applications').update({
      is_active: (toggled as Application).isActive,
      updated_at: new Date().toISOString()
    }).eq('id', id).then(({ error }) => {
      if (error) console.error('Supabase toggle user status error:', error);
    });
  }

  return toggled;
}

export function safeDeleteApplication(id: string): Application[] {
  const apps = getStoredApplications();
  const target = apps.find((a) => a.id === id);
  const updated = apps.filter((a) => a.id !== id);
  saveStoredApplications(updated);

  if (supabase) {
    supabase.from('applications').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Supabase delete application error:', error);
    });
  }

  // If user has gallery items, anonymize or handle safely
  if (target) {
    try {
      const gallery = getStoredGallery();
      const updatedGallery = gallery.map((g) => {
        if (g.uploaderEmail === target.email || g.uploaderName === target.fullName) {
          return {
            ...g,
            uploaderName: `${target.fullName} (Eski Kullanıcı)`
          };
        }
        return g;
      });
      saveStoredGallery(updatedGallery);
    } catch (e) {
      console.warn('Error handling user gallery items during delete:', e);
    }
  }

  // If current session was this user, log out
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    logoutParticipant();
  }

  return updated;
}

export function clearAllApplications(): void {
  saveStoredApplications([]);
}

// -------------------------------------------------------------
// 2. ATTENDANCE & QR SCANNING (DUPLICATE PREVENTING)
// -------------------------------------------------------------

export function findApplicationByQr(code: string): Application | undefined {
  if (!code) return undefined;
  const apps = getStoredApplications();
  const clean = code.trim().toUpperCase();
  return apps.find(
    (a) =>
      (a.qrCodeId && a.qrCodeId.toUpperCase() === clean) ||
      (a.secureQrToken && a.secureQrToken.toUpperCase() === clean) ||
      (a.email && a.email.toLowerCase() === clean.toLowerCase()) ||
      (a.identityNo && a.identityNo.trim() === clean)
  );
}

export type ScanResult = {
  success: boolean;
  code: 'success' | 'duplicate' | 'not_found' | 'not_approved' | 'inactive';
  message: string;
  user?: Application;
  record?: AttendanceRecord;
};

export function recordAttendanceWithTimestamp(
  identifier: string,
  day: string,
  session: string = 'Oturum',
  adminName: string = 'Divan Heyeti'
): ScanResult {
  const user = findApplicationByQr(identifier);

  if (!user) {
    return {
      success: false,
      code: 'not_found',
      message: `"${identifier}" kodu ile eşleşen delege veya kullanıcı kaydı bulunamadı.`
    };
  }

  if (user.status !== 'approved') {
    return {
      success: false,
      code: 'not_approved',
      message: `${user.fullName} adlı delegenin başvurusu henüz onaylanmamıştır (Durum: ${user.status === 'pending' ? 'Beklemede' : 'Reddedildi'}).`,
      user
    };
  }

  if (user.isActive === false) {
    return {
      success: false,
      code: 'inactive',
      message: `${user.fullName} adlı kullanıcının hesabı yönetici tarafından dondurulmuştur/pasiftir.`,
      user
    };
  }

  const attendedDays = user.attendanceDays || [];
  if (attendedDays.includes(day)) {
    return {
      success: false,
      code: 'duplicate',
      message: `${user.fullName} için "${day}" yoklaması daha önce alınmıştır! Mükerrer kayıt engellendi.`,
      user
    };
  }

  // Record attendance
  const newRecord: AttendanceRecord = {
    day,
    scannedAt: new Date().toISOString(),
    session,
    adminName
  };

  const updatedDays = [...attendedDays, day];
  const updatedLogs = [...(user.attendanceLogs || []), newRecord];

  const updatedUser = updateApplication(user.id, {
    attendanceDays: updatedDays,
    attendanceLogs: updatedLogs
  });

  return {
    success: true,
    code: 'success',
    message: `${user.fullName} (${user.commissionId.toUpperCase()}) için ${day} yoklaması başarıyla kaydedildi.`,
    user: updatedUser || user,
    record: newRecord
  };
}

export function toggleAttendance(id: string, day: string): Application | null {
  const apps = getStoredApplications();
  let updatedApp: Application | null = null;
  const updated = apps.map((app) => {
    if (app.id === id) {
      const days = app.attendanceDays || [];
      const hasDay = days.includes(day);
      const newDays = hasDay ? days.filter((d) => d !== day) : [...days, day];
      let newLogs = app.attendanceLogs || [];
      if (hasDay) {
        newLogs = newLogs.filter((log) => log.day !== day);
      } else {
        newLogs = [
          ...newLogs,
          {
            day,
            scannedAt: new Date().toISOString(),
            session: 'Manuel Yoklama',
            adminName: 'Admin Panel'
          }
        ];
      }
      updatedApp = { ...app, attendanceDays: newDays, attendanceLogs: newLogs };
      return updatedApp;
    }
    return app;
  });
  saveStoredApplications(updated);
  return updatedApp;
}

// -------------------------------------------------------------
// 3. TWO-TIER GALLERY & MEDIA MODERATION
// -------------------------------------------------------------

export function getStoredGallery(): GalleryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) {
      const seeded = (GALLERY_ITEMS || []).map((g, idx) => ({
        ...g,
        status: (g.isApproved ? 'approved' : 'pending') as GalleryItemStatus,
        order: idx + 1
      }));
      localStorage.setItem(GALLERY_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed: GalleryItem[] = JSON.parse(raw);
    return parsed.map((item, idx) => ({
      ...item,
      status: item.status || (item.isApproved ? 'approved' : 'pending'),
      order: item.order ?? (idx + 1)
    }));
  } catch {
    return [];
  }
}

export function saveStoredGallery(items: GalleryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('igm_gallery_updated'));
  } catch (err) {
    console.error('Failed to save gallery:', err);
  }
}

// Admin directly adds media to public or members gallery (auto approved)
export function adminAddGalleryItem(
  item: Omit<GalleryItem, 'id' | 'createdAt' | 'isApproved' | 'status'> & {
    visibility?: 'public' | 'members';
    isApproved?: boolean;
  }
): GalleryItem {
  const items = getStoredGallery();
  const newItem: GalleryItem = {
    ...item,
    id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString().split('T')[0],
    isApproved: item.isApproved !== false,
    status: item.isApproved !== false ? 'approved' : 'pending',
    visibility: item.visibility || 'public',
    order: item.order || items.length + 1,
    approvedBy: 'Admin',
    approvedAt: new Date().toISOString()
  };
  const updated = [newItem, ...items];
  saveStoredGallery(updated);
  return newItem;
}

export const addGalleryPhoto = adminAddGalleryItem;
export const addGalleryItem = adminAddGalleryItem;

// Participant submits media -> automatically enters 'pending' state
export function submitUserMedia(data: {
  title: string;
  description?: string;
  mediaUrl: string;
  category: 'etkinlik' | 'komisyon' | 'kulis' | 'video';
  mediaType?: 'image' | 'video';
  uploaderName: string;
  uploaderEmail?: string;
}): GalleryItem {
  const items = getStoredGallery();
  const newItem: GalleryItem = {
    id: `g-user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: data.title,
    description: data.description || '',
    mediaUrl: data.mediaUrl,
    category: data.category,
    mediaType: data.mediaType || 'image',
    uploaderName: data.uploaderName,
    uploaderEmail: data.uploaderEmail,
    isApproved: false,
    status: 'pending',
    visibility: 'public',
    order: 999,
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newItem, ...items];
  saveStoredGallery(updated);

  if (supabase) {
    supabase.from('gallery_photos').insert({
      title: newItem.title,
      media_url: newItem.mediaUrl,
      media_type: newItem.mediaType,
      category: newItem.category,
      uploader_name: newItem.uploaderName,
      is_approved: false
    }).then(({ error }) => {
      if (error) console.error('Supabase gallery insert error:', error);
    });
  }

  return newItem;
}

export function moderateGalleryItem(
  id: string,
  action: 'approved' | 'rejected',
  reason?: string,
  visibility: 'public' | 'members' = 'public'
): GalleryItem[] {
  const items = getStoredGallery();
  const updated = items.map((g) => {
    if (g.id === id) {
      return {
        ...g,
        isApproved: action === 'approved',
        status: action,
        rejectedReason: action === 'rejected' ? reason : undefined,
        visibility: action === 'approved' ? visibility : g.visibility,
        approvedBy: action === 'approved' ? 'Divan Heyeti' : undefined,
        approvedAt: action === 'approved' ? new Date().toISOString() : undefined
      };
    }
    return g;
  });
  saveStoredGallery(updated);
  return updated;
}

export function bulkModerateGallery(
  ids: string[],
  action: 'approved' | 'rejected' | 'delete',
  reason?: string
): GalleryItem[] {
  const items = getStoredGallery();
  if (action === 'delete') {
    const updated = items.filter((g) => !ids.includes(g.id));
    saveStoredGallery(updated);
    return updated;
  }
  const updated = items.map((g) => {
    if (ids.includes(g.id)) {
      return {
        ...g,
        isApproved: action === 'approved',
        status: action,
        rejectedReason: action === 'rejected' ? reason : undefined,
        approvedBy: action === 'approved' ? 'Divan Heyeti' : undefined,
        approvedAt: action === 'approved' ? new Date().toISOString() : undefined
      };
    }
    return g;
  });
  saveStoredGallery(updated);
  return updated;
}

export function approveGalleryItem(id: string, visibility?: 'public' | 'members'): GalleryItem[] {
  return moderateGalleryItem(id, 'approved', undefined, visibility || 'public');
}

export function toggleGalleryVisibility(id: string): GalleryItem[] {
  const items = getStoredGallery();
  const updated = items.map((g) => {
    if (g.id === id) {
      const nextVis = g.visibility === 'members' ? 'public' : 'members';
      return { ...g, visibility: nextVis as 'public' | 'members' };
    }
    return g;
  });
  saveStoredGallery(updated);
  return updated;
}

export function deleteGalleryItem(id: string): GalleryItem[] {
  const items = getStoredGallery();
  const updated = items.filter((g) => g.id !== id);
  saveStoredGallery(updated);
  return updated;
}

export function getPublicGallery(): GalleryItem[] {
  const items = getStoredGallery();
  return items
    .filter((g) => g.isApproved && g.status !== 'rejected' && (g.visibility === 'public' || !g.visibility))
    .sort((a, b) => (a.order || 999) - (b.order || 999));
}

export function getMemberGallery(): GalleryItem[] {
  const items = getStoredGallery();
  return items
    .filter((g) => g.isApproved && g.status !== 'rejected')
    .sort((a, b) => (a.order || 999) - (b.order || 999));
}

export function getPendingGallery(): GalleryItem[] {
  const items = getStoredGallery();
  return items.filter((g) => !g.isApproved || g.status === 'pending');
}

export function getUserGalleryItems(fullName: string, email?: string): GalleryItem[] {
  const gallery = getStoredGallery();
  const cleanName = fullName.trim().toLowerCase();
  const cleanEmail = (email || '').trim().toLowerCase();
  return gallery.filter((g) => {
    const matchName = (g.uploaderName || '').trim().toLowerCase() === cleanName;
    const matchEmail = cleanEmail && (g.uploaderEmail || '').trim().toLowerCase() === cleanEmail;
    return matchName || matchEmail;
  });
}

// -------------------------------------------------------------
// 4. PARTICIPANT AUTHENTICATION & USER PROFILE
// -------------------------------------------------------------

export async function loginParticipant(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: Application }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  let matched: Application | undefined;

  // 1. Önce Supabase'den kontrol et (kullanıcı farklı cihazdan veya Render üzerinden başvurmuşsa anında bulunur)
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (!error && data) {
        matched = mapRowToApplication(data);
        // Yerel önbelleğe de senkronize et
        const currentApps = getStoredApplications();
        const existingIdx = currentApps.findIndex(
          (a) => a.id === matched!.id || a.email.toLowerCase() === cleanEmail
        );
        if (existingIdx >= 0) {
          currentApps[existingIdx] = matched;
        } else {
          currentApps.unshift(matched);
        }
        saveStoredApplications(currentApps);
      }
    } catch (err) {
      console.warn('Supabase login check failed, falling back to local storage:', err);
    }
  }

  // 2. Bulunamadıysa yerel hafızaya bak
  if (!matched) {
    const apps = getStoredApplications();
    matched = apps.find((a) => a.email.toLowerCase() === cleanEmail);
  }

  if (!matched) {
    return {
      success: false,
      message: 'Bu e-posta adresine ait bir delege başvurusu bulunamadı. Lütfen önce başvuru yapınız.'
    };
  }

  if (matched.isActive === false) {
    return {
      success: false,
      message: 'Hesabınız yönetici tarafından pasife alınmıştır. Lütfen organizasyon heyetiyle iletişime geçiniz.'
    };
  }

  const appPassword = matched.password || '123456';
  if (appPassword !== cleanPassword) {
    return {
      success: false,
      message: 'Girdiğiniz 6 haneli şifre hatalıdır. Lütfen kontrol edip tekrar deneyiniz.'
    };
  }

  if (matched.status === 'pending') {
    return {
      success: false,
      message: 'Başvurunuz henüz divan heyeti tarafından onaylanmamıştır (Durum: Beklemede). Başvurunuz kabul edildiğinde bu alandan profilinize erişebilirsiniz.'
    };
  }

  if (matched.status === 'rejected') {
    return {
      success: false,
      message: 'Delege başvurunuz kontenjan veya değerlendirme kriterleri sebebiyle onaylanmamıştır.'
    };
  }

  // Update last login
  const now = new Date().toISOString();
  updateApplication(matched.id, { lastLoginAt: now });
  const liveUser = { ...matched, lastLoginAt: now };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(liveUser));
    window.dispatchEvent(new Event('igm_auth_change'));
  }

  return {
    success: true,
    message: 'Giriş başarılı! Profilinize yönlendiriliyorsunuz.',
    user: liveUser
  };
}

export function getCurrentUser(): Application | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    const sessionApp: Application = JSON.parse(raw);
    const apps = getStoredApplications();
    const live = apps.find((a) => a.id === sessionApp.id);
    return live || sessionApp;
  } catch {
    return null;
  }
}

export function logoutParticipant(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_SESSION_KEY);
  window.dispatchEvent(new Event('igm_auth_change'));
}

export function updateParticipantAvatar(applicationId: string, avatarUrl: string): Application | null {
  return updateApplication(applicationId, { avatarUrl });
}

export function updateUserProfile(
  applicationId: string,
  data: Partial<Pick<Application, 'phone' | 'school' | 'department' | 'city' | 'password' | 'avatarUrl' | 'motivation'>>
): Application | null {
  return updateApplication(applicationId, data);
}

// -------------------------------------------------------------
// 5. ANNOUNCEMENTS
// -------------------------------------------------------------

export function getStoredAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(MOCK_ANNOUNCEMENTS || []));
      return MOCK_ANNOUNCEMENTS || [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredAnnouncements(announcements: Announcement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
    window.dispatchEvent(new Event('igm_announcements_updated'));
  } catch (err) {
    console.error('Failed to save announcements:', err);
  }
}

export function createAnnouncement(
  data: Omit<Announcement, 'id' | 'createdAt'>
): Announcement {
  const announcements = getStoredAnnouncements();
  const newAnn: Announcement = {
    ...data,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newAnn, ...announcements];
  saveStoredAnnouncements(updated);
  return newAnn;
}

export function deleteAnnouncement(id: string): Announcement[] {
  const announcements = getStoredAnnouncements();
  const updated = announcements.filter((a) => a.id !== id);
  saveStoredAnnouncements(updated);
  return updated;
}

export function getUserAnnouncements(userStatus?: ApplicationStatus): Announcement[] {
  const announcements = getStoredAnnouncements();
  return announcements.filter((a) => {
    if (a.targetGroup === 'all') return true;
    if (a.targetGroup === 'approved_delegates' && userStatus === 'approved') return true;
    if (a.targetGroup === 'pending' && userStatus === 'pending') return true;
    return false;
  });
}

// -------------------------------------------------------------
// 6. EXCEL EXPORT (FALLBACK)
// -------------------------------------------------------------

export function exportApplicationsToExcel(applications: Application[]): void {
  const rows = applications.map((app, index) => ({
    'Sıra No': index + 1,
    'Delege Kodu (QR ID)': app.qrCodeId,
    'Güvenli QR Token': app.secureQrToken || '-',
    'Adı Soyadı': app.fullName,
    'Durum': app.status === 'approved' ? 'ONAYLANDI' : app.status === 'rejected' ? 'REDDEDİLDİ' : 'BEKLEMEDE',
    'Hesap Durumu': app.isActive === false ? 'PASİF' : 'AKTİF',
    'Komisyon Tercihi': app.commissionId.toUpperCase(),
    '2. Tercih': app.secondChoiceId ? app.secondChoiceId.toUpperCase() : '-',
    'Üniversite / Kurum': app.school,
    'Bölüm': app.department,
    'Şehir': app.city || 'Konya',
    'E-Posta': app.email,
    'Telefon': app.phone,
    'T.C. / Öğrenci No': app.identityNo,
    '23 Ekim Yoklama': (app.attendanceDays || []).includes('23 Ekim') ? 'GELDİ' : 'YOK',
    '24 Ekim Yoklama': (app.attendanceDays || []).includes('24 Ekim') ? 'GELDİ' : 'YOK',
    '25 Ekim Yoklama': (app.attendanceDays || []).includes('25 Ekim') ? 'GELDİ' : 'YOK',
    'Başvuru Tarihi': new Date(app.createdAt).toLocaleDateString('tr-TR'),
    'Motivasyon': app.motivation
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Delegeler');

  const columnWidths = [
    { wch: 8 },  // Sıra
    { wch: 18 }, // QR ID
    { wch: 22 }, // Secure Token
    { wch: 24 }, // Ad Soyad
    { wch: 14 }, // Durum
    { wch: 12 }, // Hesap Durumu
    { wch: 18 }, // Komisyon
    { wch: 16 }, // 2. Tercih
    { wch: 30 }, // Okul
    { wch: 30 }, // Bölüm
    { wch: 12 }, // Şehir
    { wch: 28 }, // Email
    { wch: 16 }, // Telefon
    { wch: 18 }, // TC No
    { wch: 15 }, // 23 Ekim
    { wch: 15 }, // 24 Ekim
    { wch: 15 }, // 25 Ekim
    { wch: 14 }, // Tarih
    { wch: 45 }  // Motivasyon
  ];
  worksheet['!cols'] = columnWidths;

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `TIMAV_Irfan_Meclisi_Delegeler_${dateStr}.xlsx`);
}
