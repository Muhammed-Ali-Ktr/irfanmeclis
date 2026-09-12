-- =========================================================
-- TİMAV İrfan Genç Meclisi 2026 - Supabase Veritabanı Şeması
-- Tarih: 23-24-25 Ekim 2026
-- =========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. COMMISSIONS TABLE (8 Ana Komisyon)
CREATE TABLE IF NOT EXISTS commissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    topics JSONB DEFAULT '[]'::jsonb,
    objectives JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. APPLICATIONS TABLE (Delege Başvuruları)
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    identity_no TEXT NOT NULL,
    school TEXT NOT NULL,
    department TEXT NOT NULL,
    commission_id TEXT REFERENCES commissions(id) ON DELETE SET NULL,
    second_choice_id TEXT REFERENCES commissions(id) ON DELETE SET NULL,
    motivation TEXT,
    status application_status DEFAULT 'pending' NOT NULL,
    qr_code_id TEXT NOT NULL UNIQUE,
    secure_qr_token TEXT,
    attendance_days JSONB DEFAULT '[]'::jsonb,
    attendance_logs JSONB DEFAULT '[]'::jsonb,
    city TEXT DEFAULT 'Konya',
    birth_year INT,
    password TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by TEXT,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Halihazırda oluşturulmuş tablolar için eksik sütunları güvenle ekle
ALTER TABLE applications ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secure_qr_token TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS attendance_logs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS approved_by TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

DO $$ BEGIN
    ALTER TABLE applications ALTER COLUMN id TYPE TEXT;
EXCEPTION
    WHEN others THEN null;
END $$;

-- 5. TEAM MEMBERS TABLE (100 Kişilik Organizasyon Ekibi)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    category TEXT NOT NULL, -- 'genel_koordinasyon', 'basin_medya', 'lojistik', 'komisyon_baskani', 'delege_iliskileri'
    commission_id TEXT REFERENCES commissions(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. GALLERY PHOTOS TABLE (Galeri ve Delege Yüklemeleri)
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    uploader_name TEXT,
    title TEXT NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    media_type media_type DEFAULT 'image' NOT NULL,
    category TEXT DEFAULT 'etkinlik', -- 'etkinlik', 'komisyon', 'kulis', 'video'
    is_approved BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ANNOUNCEMENTS TABLE (Duyurular & Bildirimler)
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal', -- 'high', 'normal', 'low'
    target_group TEXT DEFAULT 'all', -- 'all', 'approved_delegates', 'team'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_applications_commission ON applications(commission_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_qr ON applications(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_gallery_approved ON gallery_photos(is_approved);
CREATE INDEX IF NOT EXISTS idx_team_category ON team_members(category);

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Commissions: Public can read
DROP POLICY IF EXISTS "Public commissions read" ON commissions;
CREATE POLICY "Public commissions read" ON commissions FOR SELECT USING (true);

-- Team members: Public can read
DROP POLICY IF EXISTS "Public team read" ON team_members;
CREATE POLICY "Public team read" ON team_members FOR SELECT USING (true);

-- Applications: Anyone can insert, select and update (admin / user management)
DROP POLICY IF EXISTS "Public applications insert" ON applications;
CREATE POLICY "Public applications insert" ON applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin applications select" ON applications;
CREATE POLICY "Admin applications select" ON applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public applications select" ON applications;
CREATE POLICY "Public applications select" ON applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin applications update" ON applications;
CREATE POLICY "Admin applications update" ON applications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public applications update" ON applications;
CREATE POLICY "Public applications update" ON applications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public applications delete" ON applications;
CREATE POLICY "Public applications delete" ON applications FOR DELETE USING (true);

-- Gallery: Public can view approved, anyone can insert pending, admin can manage
DROP POLICY IF EXISTS "Public gallery read approved" ON gallery_photos;
CREATE POLICY "Public gallery read approved" ON gallery_photos FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public gallery insert" ON gallery_photos;
CREATE POLICY "Public gallery insert" ON gallery_photos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin gallery update" ON gallery_photos;
CREATE POLICY "Admin gallery update" ON gallery_photos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin gallery delete" ON gallery_photos;
CREATE POLICY "Admin gallery delete" ON gallery_photos FOR DELETE USING (true);

-- Announcements: Public can read, anyone can manage
DROP POLICY IF EXISTS "Public announcements read" ON announcements;
CREATE POLICY "Public announcements read" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public announcements insert" ON announcements;
CREATE POLICY "Public announcements insert" ON announcements FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public announcements update" ON announcements;
CREATE POLICY "Public announcements update" ON announcements FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public announcements delete" ON announcements;
CREATE POLICY "Public announcements delete" ON announcements FOR DELETE USING (true);

-- 9.1 STORAGE BUCKETS & POLICIES (Profil Avatarları & Galeri)
DO $$ BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    INSERT INTO storage.buckets (id, name, public)
    VALUES ('gallery', 'gallery', true)
    ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
    CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

    DROP POLICY IF EXISTS "Public can upload avatars" ON storage.objects;
    CREATE POLICY "Public can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

    DROP POLICY IF EXISTS "Public can update avatars" ON storage.objects;
    CREATE POLICY "Public can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

    DROP POLICY IF EXISTS "Public can delete avatars" ON storage.objects;
    CREATE POLICY "Public can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');

    DROP POLICY IF EXISTS "Public can view gallery" ON storage.objects;
    CREATE POLICY "Public can view gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

    DROP POLICY IF EXISTS "Public can upload gallery" ON storage.objects;
    CREATE POLICY "Public can upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
EXCEPTION
    WHEN others THEN null;
END $$;

-- 10. SEED DATA (8 Ana Komisyon)
INSERT INTO commissions (id, name, short_name, description, cover_image_url, icon_name, topics, objectives)
VALUES
(
    'adalet',
    'Adalet Komisyonu',
    'Adalet',
    'Hukukun üstünlüğü, adil yargılanma hakkı, dijital çağda bilişim hukuku ve temel hak ve özgürlüklerin korunmasına yönelik yasa tasarıları hazırlar.',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    'Scale',
    '["Yapay Zeka ve Yargı Süreçleri", "Bilişim Suçları ile Mücadele", "Gençlik Hakları ve Sosyal Adalet", "Alternatif Uyuşmazlık Çözüm Yolları"]',
    '["Adil yargılanma süreçlerinin hızlandırılması", "Gençlerin hukuki okuryazarlığının artırılması", "Yasa tasarısı hazırlama metodolojisi"]'
),
(
    'anayasa',
    'Anayasa Komisyonu',
    'Anayasa',
    'Demokratik devlet mekanizmaları, sivil anayasa perspektifleri, kuvvetler ayrılığı dengesi ve gençliğin karar mekanizmalarına katılımını ele alır.',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    'BookOpenCheck',
    '["Sivil ve Katılımcı Anayasa Dinamikleri", "Temsilde Adalet ve Gençlik Temsili", "Kuvvetler Ayrılığı İlkesi", "Temel Hak ve Hürriyetlerin Güvencesi"]',
    '["Kapsayıcı meclis simülasyonu yönergeleri", "Genç delegelerin anayasal çerçeveyi kavraması", "Özgürlükçü taslak metin üretimi"]'
),
(
    'disisleri',
    'Dışişleri Komisyonu',
    'Dışişleri',
    'Küresel krizler, çok kutuplu dünyada Türkiye''nin dış politikası, kültürel diplomasi ve insani yardım koridorlarını masaya yatırır.',
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=80',
    'Globe',
    '["Balkanlar, Kafkaslar ve Orta Doğu Barışı", "Kültürel Diplomasi ve İnsani Yardımlar", "Küresel İklim ve Göç Politikaları", "Uluslararası Gençlik Zirveleri"]',
    '["Çok taraflı müzakere yeteneklerinin geliştirilmesi", "Diplomatik dil ve protokol kuralları", "Bölgesel barış bildirileri yayımlamak"]'
),
(
    'icisleri',
    'İçişleri Komisyonu',
    'İçişleri',
    'Kamu düzeni, afet yönetimi ve koordinasyonu, gençlik güvenliği, yerel yönetimler ve sivil toplum dayanışmasını şekillendirir.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'Shield',
    '["Deprem ve Doğal Afet Kriz Yönetimi", "Akıllı Şehirler ve Gençlik Mekanları", "Siber Güvenlik ve Birey Güvenliği", "Yerel Yönetimlerde Genç Katılımı"]',
    '["Etkin kriz yönetim modelleri geliştirmek", "Şehir güvenliği ve afete hazırlık eylem planı", "Gönüllülük sisteminin kurumsallaştırılması"]'
),
(
    'saglik',
    'Sağlık Komisyonu',
    'Sağlık',
    'Halk sağlığı, biyoteknoloji ve aşı araştırmaları, gençliğin zihinsel & fiziksel sağlığı ile sürdürülebilir tıp etiğini inceler.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'HeartPulse',
    '["Gelişen Biyomedikal ve Sağlık Teknolojileri", "Dijital Bağımlılık ve Genç Ruh Sağlığı", "Önleyici Hekimlik ve Spor Bilinci", "Acil Sağlık Hizmetleri Standartları"]',
    '["Gençler için koruyucu sağlık stratejileri", "Yerli ve milli sağlık inovasyonları vizyonu", "Kapsamlı sağlık politikası taslağı"]'
),
(
    'milli-savunma',
    'Milli Savunma Komisyonu',
    'Milli Savunma',
    'Milli teknoloji hamlesi, İHA/SİHA ve uzay teknolojileri, sınır güvenliği, savunma sanayii ekosistemi ve stratejik caydırıcılığı müzakere eder.',
    'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
    'Crosshair',
    '["Savunma Sanayiinde Yerlilik ve Otonom Sistemler", "Uzay ve Uydu Teknolojileri", "Mavi Vatan ve Jeostratejik Güvenlik", "Yapay Zeka Destekli Savunma Donanımları"]',
    '["Stratejik analiz yetkinliği kazandırmak", "Savunma teknolojilerinde genç mühendis vizyonu", "Kritik altyapı koruma önerileri hazırlamak"]'
),
(
    'milli-egitim',
    'Milli Eğitim Komisyonu',
    'Milli Eğitim',
    'Maarif modeli, dijital eğitim araçları, mesleki eğitimin dönüştürülmesi, değerler eğitimi ve fırsat eşitliği konularını odağa alır.',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    'GraduationCap',
    '["Türkiye Yüzyılı Maarif Modeli ve Gençlik", "Yapay Zeka ile Bireyselleştirilmiş Öğrenme", "Mesleki ve Teknik Eğitimin İtibarı", "Sosyo-Kültürel Fırsat Eşitliği"]',
    '["Geleceğin eğitim ekosistemini modellemek", "Öğrenci odaklı pedagojik reform önerileri", "Kütüphane ve etüt ekosisteminin zenginleştirilmesi"]'
),
(
    'din-isleri',
    'Din İşleri Komisyonu',
    'Din İşleri',
    'İrfan ve hikmet geleneği, gençliğin ahlaki ve manevi gelişimi, din istismarı ile mücadele ve çağdaş fıkhi meseleleri müzakere eder.',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    'Compass',
    '["Kadim İrfan Mirası ve Modern Gençlik", "Dijitalleşme Çağında Dini Bilgi Güvenilirliği", "Ahlak, Adalet ve İnsan Onuru", "Gençlerin Manevi Rehberlik İhtiyaçları"]',
    '["Doğru dini bilginin yaygınlaştırılması", "Kültürel ve manevi değerlerin ihyası", "Toplumsal hoşgörü ve diyalog ilkeleri"]'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    description = EXCLUDED.description,
    cover_image_url = EXCLUDED.cover_image_url,
    icon_name = EXCLUDED.icon_name,
    topics = EXCLUDED.topics,
    objectives = EXCLUDED.objectives;
