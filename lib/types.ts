export type Commission = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  coverImageUrl: string;
  iconName: string;
  topics: string[];
  objectives: string[];
  badgeColor?: string;
};

export type TeamMember = {
  id: string;
  fullName: string;
  role: string;
  category: 'genel_koordinasyon' | 'komisyon_baskani' | 'basin_medya' | 'lojistik' | 'delege_iliskileri' | 'divan' | 'yonetim' | 'akademik' | 'koordinasyon' | string;
  commissionId?: string;
  imageUrl: string;
  university?: string;
  bio?: string;
};

export type ProgramSession = {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  speakerRole?: string;
  speakerImage?: string;
  location: string;
  type: 'session' | 'ceremony' | 'workshop' | 'break' | 'gala';
};

export type ProgramDay = {
  dayNumber: number;
  date: string; // e.g. "23 Ekim 2026 Cuma"
  title: string;
  theme: string;
  sessions: ProgramSession[];
};

export type AttendanceRecord = {
  day: string; // e.g. "23 Ekim"
  scannedAt: string; // ISO date-time string
  session?: string;
  adminName?: string;
};

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type Application = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  identityNo: string;
  school: string;
  department: string;
  commissionId: string;
  secondChoiceId?: string;
  motivation: string;
  status: ApplicationStatus;
  qrCodeId: string;
  secureQrToken?: string; // Tam benzersiz tahmin edilemez token
  attendanceDays: string[]; // ["23 Ekim", "24 Ekim", "25 Ekim"]
  attendanceLogs?: AttendanceRecord[]; // Detaylı zaman damgalı yoklama geçmişi
  city?: string;
  password?: string; // 6-digit PIN password
  avatarUrl?: string; // User profile picture
  isActive?: boolean; // Admin tarafından aktif/pasif yapılabilme
  isBlocked?: boolean;
  lastLoginAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  updatedAt?: string;
};

export type GalleryItemStatus = 'pending' | 'approved' | 'rejected';

export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: 'image' | 'video';
  category: 'etkinlik' | 'komisyon' | 'kulis' | 'video';
  uploaderName?: string;
  uploaderEmail?: string;
  isApproved: boolean;
  status?: GalleryItemStatus; // 'pending' | 'approved' | 'rejected'
  rejectedReason?: string;
  order?: number;
  visibility?: 'public' | 'members'; // 'public': Genel Ziyaretçi Galerisi, 'members': Etkinlik İçi Üye Galerisi
  createdAt: string;
  views?: number;
  approvedBy?: string;
  approvedAt?: string;
};

export type AnnouncementPriority = 'normal' | 'important' | 'urgent';
export type AnnouncementTarget = 'all' | 'approved_delegates' | 'pending';

export type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetGroup: AnnouncementTarget;
  createdAt: string;
  authorName?: string;
};


