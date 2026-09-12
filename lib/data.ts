import { Commission, TeamMember, ProgramDay, GalleryItem, Application, Announcement } from './types';

export const COMMISSIONS: Commission[] = [
  {
    id: 'adalet',
    name: 'Adalet Komisyonu',
    shortName: 'Adalet',
    description: 'Hukukun üstünlüğü, adil yargılanma hakkı, dijital çağda bilişim hukuku ve temel hak ve özgürlüklerin korunmasına yönelik yasa tasarıları hazırlar.',
    coverImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Scale',
    badgeColor: 'blue',
    topics: [
      'Yapay Zeka ve Yargı Süreçlerinde Hakkaniyet',
      'Bilişim Hukuku ve Dijital Ayak İzi Güvenliği',
      'Gençlik Hakları ve Sosyal Adalet Mekanizmaları',
      'Alternatif Uyuşmazlık Çözüm Yolları ve Arabuluculuk'
    ],
    objectives: [
      'Adil ve hızlı yargılama süreçlerine yönelik gençlik bakış açısıyla yasa taslağı oluşturmak',
      'Hukuki okuryazarlığı ve kanun yapma metodolojisini genç delegelere kazandırmak',
      'Dijital dünyada hak arama özgürlüğünün çerçevesini çizmek'
    ]
  },
  {
    id: 'anayasa',
    name: 'Anayasa Komisyonu',
    shortName: 'Anayasa',
    description: 'Demokratik devlet mekanizmaları, sivil anayasa perspektifleri, kuvvetler ayrılığı dengesi ve gençliğin karar mekanizmalarına katılımını ele alır.',
    coverImageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    iconName: 'BookOpenCheck',
    badgeColor: 'amber',
    topics: [
      'Sivil, Özgürlükçü ve Katılımcı Anayasa Vizyonu',
      'Temsilde Adalet ve Parlamenter Gençlik Temsili',
      'Kuvvetler Ayrılığı ve Denetim Mekanizmaları',
      'Temel Hak ve Hürriyetlerin Güvenceye Alınması'
    ],
    objectives: [
      'Kapsayıcı ve uzlaşmacı yeni meclis simülasyonu yönergelerini tartışmak',
      'Anayasal ilkeleri gençlik dinamizmiyle yeniden yorumlamak',
      'Meclis Genel Kurulu için bağlayıcı taslak anayasa maddeleri hazırlamak'
    ]
  },
  {
    id: 'disisleri',
    name: 'Dışişleri Komisyonu',
    shortName: 'Dışişleri',
    description: 'Küresel krizler, çok kutuplu dünyada Türkiye\'nin dış politikası, kültürel diplomasi ve insani yardım koridorlarını masaya yatırır.',
    coverImageUrl: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Globe',
    badgeColor: 'sky',
    topics: [
      'Balkanlar, Kafkaslar ve Orta Doğu Barış Dinamikleri',
      'Kültürel Diplomasi, Kamu Diplomasisi ve İnsani Yardımlar',
      'Küresel İklim Krizi ve Uluslararası Göç Politikaları',
      'Türk Dünyası Entegrasyonu ve Gençlik Zirveleri'
    ],
    objectives: [
      'Çok taraflı müzakere ve kriz çözme becerisi kazandırmak',
      'Diplomatik nezaket, protokol ve uluslararası anlaşma dili geliştirmek',
      'Bölgesel barış ve istikrar için gençlik bildirgesi yayımlamak'
    ]
  },
  {
    id: 'icisleri',
    name: 'İçişleri Komisyonu',
    shortName: 'İçişleri',
    description: 'Kamu düzeni, afet yönetimi ve koordinasyonu, gençlik güvenliği, yerel yönetimler ve sivil toplum dayanışmasını şekillendirir.',
    coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Shield',
    badgeColor: 'indigo',
    topics: [
      'Deprem ve Doğal Afetlerde Entegre Kriz Yönetimi',
      'Akıllı Şehirler, Gençlik Merkezleri ve Sosyal Mekanlar',
      'Siber Güvenlik, Kamusal Güven ve Birey Güvenliği',
      'Yerel Yönetimlerde Gençlerin Karar Süreçlerine Katılımı'
    ],
    objectives: [
      'Afet durumlarında gençlik gönüllü seferberlik modelleri kurgulamak',
      'Şehir güvenliği ve kamusal huzurun güçlendirilmesine katkı sağlamak',
      'Sivil toplum ve kamu kurumları arasındaki entegrasyonu hızlandırmak'
    ]
  },
  {
    id: 'saglik',
    name: 'Sağlık Komisyonu',
    shortName: 'Sağlık',
    description: 'Halk sağlığı, biyoteknoloji ve aşı araştırmaları, gençliğin zihinsel & fiziksel sağlığı ile sürdürülebilir tıp etiğini inceler.',
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    iconName: 'HeartPulse',
    badgeColor: 'rose',
    topics: [
      'Gelişen Biyomedikal Cihazlar ve Genomik Sağlık Teknolojileri',
      'Dijital Bağımlılık, Sosyal Medya ve Genç Ruh Sağlığı',
      'Önleyici Hekimlik, Spor Bilinci ve Beslenme Standartları',
      'Acil Sağlık Hizmetleri ve Nadir Hastalıklar Eylem Planı'
    ],
    objectives: [
      'Gençlerin zihinsel dayanıklılığı ve beden sağlığı için stratejiler üretmek',
      'Milli ilaç ve tıbbi cihaz Ar-Ge çalışmalarını destekleyici teşvikler önermek',
      'Etik ilkeler ışığında modern sağlık politikaları taslağı hazırlamak'
    ]
  },
  {
    id: 'milli-savunma',
    name: 'Milli Savunma Komisyonu',
    shortName: 'Milli Savunma',
    description: 'Milli teknoloji hamlesi, İHA/SİHA ve uzay teknolojileri, sınır güvenliği, savunma sanayii ekosistemi ve stratejik caydırıcılığı müzakere eder.',
    coverImageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Crosshair',
    badgeColor: 'emerald',
    topics: [
      'Savunma Sanayiinde Yerlilik ve Otonom Muharip Sistemler',
      'Milli Uzay Programı ve Uydu Savunma Mimarileri',
      'Mavi Vatan Jeostratejisi ve Siber Caydırıcılık',
      'Yapay Zeka Destekli Erken Uyarı ve Komuta Kontrol Sistemleri'
    ],
    objectives: [
      'Milli teknoloji vizyonunu genç mühendis ve liderlerle derinleştirmek',
      'Kritik altyapıların siber ve fiziki güvenliği için politika önerileri geliştirmek',
      'Jeopolitik tehdit analizleri hazırlamak'
    ]
  },
  {
    id: 'milli-egitim',
    name: 'Milli Eğitim Komisyonu',
    shortName: 'Milli Eğitim',
    description: 'Maarif modeli, dijital eğitim araçları, mesleki eğitimin dönüştürülmesi, değerler eğitimi ve fırsat eşitliği konularını odağa alır.',
    coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    iconName: 'GraduationCap',
    badgeColor: 'cyan',
    topics: [
      'Türkiye Yüzyılı Maarif Modeli ve Değerler Odaklı Müfredat',
      'Yapay Zeka Destekli Bireyselleştirilmiş Öğrenme Araçları',
      'Mesleki ve Teknik Eğitimin Sanayi ile Entegrasyonu',
      'Sosyo-Kültürel Fırsat Eşitliği ve Kütüphane Medeniyeti'
    ],
    objectives: [
      'Geleceğin okul modellerini ve pedagojik ihtiyaçlarını tanımlamak',
      'Öğretmen ve öğrenci gelişimini destekleyecek dijital dönüşüm tasarısı yazmak',
      'Gençlerin analitik ve eleştirel düşünme kabiliyetlerini artıran modeller geliştirmek'
    ]
  },
  {
    id: 'din-isleri',
    name: 'Din İşleri Komisyonu',
    shortName: 'Din İşleri',
    description: 'İrfan ve hikmet geleneği, gençliğin ahlaki ve manevi gelişimi, din istismarı ile mücadele ve çağdaş fıkhi meseleleri müzakere eder.',
    coverImageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Compass',
    badgeColor: 'purple',
    topics: [
      'Kadim İrfan Mirası ve Çağdaş Gençlik Sorunları',
      'Dijitalleşme Çağında Dini Bilginin Kaynak Güvenilirliği',
      'Ahlak, Adalet ve İnsan Onurunu Merkeze Alan Toplum Modeli',
      'Manevi Rehberlik, Gönül Coğrafyası ve Hoşgörü Kültürü'
    ],
    objectives: [
      'Genç nesillere sahih dini bilgi ve irfan perspektifi kazandırmak',
      'Manevi değerlerin toplumsal huzur ve dayanışmaya katkısını somutlaştırmak',
      'Gençlik meclisinde ahlaki rehberlik ilkelerini formüle etmek'
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    fullName: 'Dr. Ahmet Özdemir',
    role: 'Genel Koordinatör & TİMAV Yönetim Temsilcisi',
    category: 'genel_koordinasyon',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    university: 'Selçuk Üniversitesi',
    bio: 'Gençlik çalışmaları, sivil toplum projeleri ve meclis simülasyonları danışmanı.'
  },
  {
    id: '2',
    fullName: 'Zeynep Sare Yılmaz',
    role: 'Genel Sekreter & Organizasyon Başkanı',
    category: 'genel_koordinasyon',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    university: 'Necmettin Erbakan Üniversitesi Hukuk Fak.',
    bio: 'Meclis mevzuatı ve genel kurul oturumlarının koordinasyonundan sorumlu.'
  },
  {
    id: '3',
    fullName: 'Muhammed Enes Çelik',
    role: 'Adalet Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'adalet',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    university: 'Selçuk Üniversitesi Hukuk Fakültesi',
    bio: 'Yargı reformları ve dijital hukuk alanında akademik araştırmalar yürütüyor.'
  },
  {
    id: '4',
    fullName: 'Elif Sena Karataş',
    role: 'Anayasa Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'anayasa',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    university: 'Ankara Üniversitesi Hukuk',
    bio: 'Anayasa hukuku ve parlamenter süreçler çalışma grubu lideri.'
  },
  {
    id: '5',
    fullName: 'Kerem Aksoy',
    role: 'Dışişleri Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'disisleri',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    university: 'ODTÜ Uluslararası İlişkiler',
    bio: 'Model Birleşmiş Milletler ve diplomasi simülasyonları tecrübelisi.'
  },
  {
    id: '6',
    fullName: 'Saliha Nur Güler',
    role: 'İçişleri Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'icisleri',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    university: 'NEÜ Siyaset Bilimi ve Kamu Yönetimi',
    bio: 'Yerel yönetimler ve afet kriz koordinasyonu odaklı çalışmalar yapıyor.'
  },
  {
    id: '7',
    fullName: 'Burak Demirtaş',
    role: 'Sağlık Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'saglik',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    university: 'Meram Tıp Fakültesi',
    bio: 'Koruyucu hekimlik ve gençlik ruh sağlığı projeleri koordinatörü.'
  },
  {
    id: '8',
    fullName: 'Mert Kayra Koç',
    role: 'Milli Savunma Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'milli-savunma',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    university: 'Konya Teknik Üni. Havacılık & Uzay Müh.',
    bio: 'İHA sistemleri ve milli teknoloji hamlesi gençlik kulüpleri temsilcisi.'
  },
  {
    id: '9',
    fullName: 'Hatice Betül Aslan',
    role: 'Milli Eğitim Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'milli-egitim',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    university: 'NEÜ Ahmet Keleşoğlu Eğitim Fakültesi',
    bio: 'Maarif modeli ve eğitimde yenilikçi teknolojiler araştırmacısı.'
  },
  {
    id: '10',
    fullName: 'Yusuf Taha Şen',
    role: 'Din İşleri Komisyonu Başkanı',
    category: 'komisyon_baskani',
    commissionId: 'din-isleri',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    university: 'Selçuk Üniversitesi İlahiyat Fakültesi',
    bio: 'İslam düşüncesi ve medeniyet tarihi alanlarında gençlik seminerleri yürütücüsü.'
  },
  {
    id: '11',
    fullName: 'Beyza Nur Kılıç',
    role: 'Medya & Prodüksiyon Koordinatörü',
    category: 'basin_medya',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    university: 'Selçuk İletişim Fakültesi',
    bio: 'Sosyal medya stratejileri, canlı yayın yönetimi ve video kurgu uzmanı.'
  },
  {
    id: '12',
    fullName: 'Emre Yıldırım',
    role: 'Lojistik & Operasyon Sorumlusu',
    category: 'lojistik',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    university: 'Karatay Üniversitesi Endüstri Mühendisliği',
    bio: 'Salon düzeni, akreditasyon ve delege transfer operasyonları yöneticisi.'
  },
  {
    id: '13',
    fullName: 'Ayşe Sena Doğan',
    role: 'Delege İlişkileri Koordinatörü',
    category: 'delege_iliskileri',
    imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    university: 'Selçuk Üniversitesi Psikoloji',
    bio: '250 delegenin başvuru kabulü, oryantasyonu ve rehberlik süreçleri sorumlusu.'
  }
];

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    dayNumber: 1,
    date: '23 Ekim 2026 Cuma',
    title: 'Açılış & Komisyon Çalıştayları I',
    theme: 'İrfan Meşalesinin Yanışı ve İlk Müzakereler',
    sessions: [
      {
        id: 's1-1',
        time: '08:30 - 09:30',
        title: 'Akreditasyon, Yaka Kartı Dağıtımı & Karşılama İkramı',
        description: 'Tüm delegeler ve davetliler dijital QR biletleri ile giriş yapar, delege çantalarını ve meclis dosyalarını teslim alır.',
        location: 'SKM Fuaye Alanı & Giriş Holü',
        type: 'ceremony'
      },
      {
        id: 's1-2',
        time: '09:30 - 10:45',
        title: 'Büyük Açılış Töreni & Protokol Hitapları',
        description: 'TİMAV Genel Başkanı, Konya Protokolü ve Meclis Başkanlık Divanı açılış konuşmalarıyla meclis oturumunu resmen başlatır.',
        speaker: 'Dr. Ecevit Öksüz (TİMAV Genel Başkanı) & Onur Konukları',
        location: 'Sultan Selim Ana Genel Kurul Salonu',
        type: 'ceremony'
      },
      {
        id: 's1-3',
        time: '10:45 - 11:15',
        title: 'Networking & Çay/Kahve Molası',
        description: 'Delegeler arası tanışma, fotoğraf çekimleri ve fuaye buluşması.',
        location: 'Ana Fuaye',
        type: 'break'
      },
      {
        id: 's1-4',
        time: '11:15 - 12:45',
        title: 'İlham Oturumu: "Medeniyet Kurucu Akıl ve İrfanlı Gençlik"',
        description: 'Türkiye\'nin saygın akademisyen ve düşünürlerinden geleceğin liderlerine yönelik ufuk açıcı konferans.',
        speaker: 'Prof. Dr. İhsan Fazlıoğlu',
        speakerRole: 'Felsefe & Bilim Tarihçisi',
        location: 'Sultan Selim Ana Salonu',
        type: 'session'
      },
      {
        id: 's1-5',
        time: '12:45 - 14:00',
        title: 'Cuma Namazı Arası & Öğle Yemeği',
        description: 'Geleneksel Konya Pilavı ikramı ve öğle istirahati.',
        location: 'Etkinlik Yemek Salonu',
        type: 'break'
      },
      {
        id: 's1-6',
        time: '14:00 - 16:00',
        title: '1. Oturum: Komisyon Çalıştayları Başlangıcı',
        description: '8 Komisyon eş zamanlı olarak kendi özel salonlarında toplanır. Komisyon başkanları yönergeyi tanıtır, yasa taslağı gündem maddeleri belirlenir.',
        location: 'Komisyon Çalışma Salonları (101 - 108)',
        type: 'workshop'
      },
      {
        id: 's1-7',
        time: '16:00 - 16:30',
        title: 'Ara & İkram Servisi',
        description: 'Tatlı ikramları ve komisyonlar arası kulis sohbetleri.',
        location: 'Çalışma Katı Fuayesi',
        type: 'break'
      },
      {
        id: 's1-8',
        time: '16:30 - 18:30',
        title: '2. Oturum: Madde Metinlerinin Tartışılması ve Çapraz Görüşmeler',
        description: 'Delegeler önerge taslaklarını kaleme alır, lehte ve aleyhte müzakereler gerçekleştirilir.',
        location: 'Komisyon Çalışma Salonları',
        type: 'workshop'
      }
    ]
  },
  {
    dayNumber: 2,
    date: '24 Ekim 2026 Cumartesi',
    title: 'Yoğun Müzakereler & Genel Kurul I',
    theme: 'Müzakere Kültürü ve Yasa Tasarısı Üretimi',
    sessions: [
      {
        id: 's2-1',
        time: '09:00 - 09:30',
        title: 'Sabah Yoklaması & Günlük Brifing',
        description: 'Divan Kurulu günün gündemini özetler ve komisyon başkanlarıyla koordinasyon toplantısı yapılır.',
        location: 'Divan Odası & Salon Girişleri',
        type: 'ceremony'
      },
      {
        id: 's2-2',
        time: '09:30 - 12:30',
        title: '3. Oturum: Komisyon Raporlarının Son Haline Getirilmesi',
        description: 'Her komisyon Genel Kurul\'a sunacağı nihai yasa tasarısı metnini ve gerekçeli raporunu oylayarak onaylar.',
        location: 'Komisyon Çalışma Salonları',
        type: 'workshop'
      },
      {
        id: 's2-3',
        time: '12:30 - 13:45',
        title: 'Öğle Yemeği & Serbest Zaman',
        description: 'Öğle yemeği ve SKM sanat galerisi ziyareti.',
        location: 'Etkinlik Yemek Alanı',
        type: 'break'
      },
      {
        id: 's2-4',
        time: '13:45 - 16:00',
        title: 'Genel Kurul 1. Birleşimi: İlk 4 Komisyonun Sunumu ve Tartışması',
        description: 'Adalet, Anayasa, Dışişleri ve İçişleri komisyon sözcüleri kürsüden tasarılarını sunar, tüm meclis delegeleri sorular yöneltir.',
        location: 'Sultan Selim Ana Meclis Salonu',
        type: 'session'
      },
      {
        id: 's2-5',
        time: '16:00 - 16:30',
        title: 'İkram Arası & Kulis Müzakereleri',
        description: 'Gruplar arası uzlaşma görüşmeleri ve delege kulisleri.',
        location: 'Ana Fuaye',
        type: 'break'
      },
      {
        id: 's2-6',
        time: '16:30 - 18:30',
        title: 'Genel Kurul 2. Birleşimi: Kalan 4 Komisyon Sunumu',
        description: 'Sağlık, Milli Savunma, Milli Eğitim ve Din İşleri komisyonları yasa tekliflerini genel kurul huzurunda savunur.',
        location: 'Sultan Selim Ana Meclis Salonu',
        type: 'session'
      },
      {
        id: 's2-7',
        time: '19:30 - 21:30',
        title: 'TİMAV Gençlik Gala Yemeği & Kültür Dinletisi',
        description: 'Geleneksel Türk Tasavvuf ve Sanat Musikisi eşliğinde delegelere özel akşam gala yemeği.',
        location: 'Mevlana Kültür Merkezi Balo Salonu',
        type: 'gala'
      }
    ]
  },
  {
    dayNumber: 3,
    date: '25 Ekim 2026 Pazar',
    title: 'Büyük Oylama, Sonuç Bildirgesi & Kapanış',
    theme: 'Ortak Akıl, Yasa Tasarılarının Kabulü ve Geleceğe Mühür',
    sessions: [
      {
        id: 's3-1',
        time: '09:30 - 11:30',
        title: 'Tüm Yasa Tasarılarının Elektronik Genel Kurul Oylaması',
        description: '8 komisyonun tasarıları madde madde oylanır, kabul edilen maddeler İrfan Meclisi Kanunlar Külliyatına girer.',
        location: 'Sultan Selim Ana Meclis Salonu',
        type: 'session'
      },
      {
        id: 's3-2',
        time: '11:30 - 12:00',
        title: 'Çay/Kahve & Sonuç Bildirgesi Hazırlık Arası',
        description: 'Sonuç deklarasyon metninin redaksiyonu.',
        location: 'Ana Fuaye',
        type: 'break'
      },
      {
        id: 's3-3',
        time: '12:00 - 13:30',
        title: 'İrfan Meclisi 2026 Sonuç Bildirgesinin İlanı',
        description: 'Türkiye ve dünya kamuoyuna seslenen 12 maddelik tarihi sonuç bildirgesi tüm delegelerin ayakta alkışlarıyla okunur.',
        location: 'Sultan Selim Ana Meclis Salonu',
        type: 'ceremony'
      },
      {
        id: 's3-4',
        time: '13:30 - 14:30',
        title: 'Kapanış Yemeği',
        description: 'Veda yemeği ve hatıra köşesi ziyaretleri.',
        location: 'Yemek Salonu',
        type: 'break'
      },
      {
        id: 's3-5',
        time: '14:30 - 16:30',
        title: 'Sertifika Töreni, Ödüller & Aile Fotoğrafı',
        description: 'Tüm delegelere resmi katılım sertifikalarının takdimi, en başarılı delege ve komisyon plaketleri, kapanış marşı.',
        location: 'Sultan Selim Ana Meclis Salonu',
        type: 'ceremony'
      }
    ]
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [];

export const MOCK_APPLICATIONS: Application[] = [];

export const TIMELINE_MILESTONES = [
  {
    phase: '1. Aşama',
    date: '15 Haziran - 30 Ağustos 2026',
    title: 'Hazırlık, Komisyon Masaları & Şartname İlanı',
    description: 'TİMAV Akademik Heyeti ve Gençlik Divanı tarafından 8 ana komisyonun yönergeleri ve yasa yazım rehberleri hazırlandı.'
  },
  {
    phase: '2. Aşama',
    date: '1 Eylül - 5 Ekim 2026',
    title: 'Genel Delege Başvuru Süreci & Online Mülakatlar',
    description: 'Türkiye genelinden yüzlerce üniversite ve lise gençliği online başvuru yaptı. Değerlendirme kurulu 250 asil delegeyi belirledi.'
  },
  {
    phase: '3. Aşama',
    date: '10 - 20 Ekim 2026',
    title: 'Dijital Oryantasyon & Yasa Taslakları Ön Müzakeresi',
    description: 'Delegeler komisyon başkanlarıyla online çalıştaylarda buluşarak ön araştırma raporlarını ve kaynak taramalarını tamamladı.'
  },
  {
    phase: '4. Aşama (Zirve)',
    date: '23-24-25 Ekim 2026',
    title: 'Büyük Meclis Oturumu & Konya Zirvesi',
    description: 'Selçuklu Kongre Merkezi\'nde 3 gün boyunca 250 delege, komisyon oturumları ve Genel Kurul ile tarihi yasa tasarılarını oyluyor.'
  },
  {
    phase: '5. Aşama',
    date: 'Kasım 2026',
    title: 'Kanun Külliyatı Baskısı & TBMM Ziyareti',
    description: 'Kabul edilen meclis kararları ve yasa teklifleri ciltlenerek TBMM Başkanlığına ve ilgili bakanlıklara resmi rapor olarak sunulacak.'
  }
];

export const SPONSORS = [
  { name: 'TİMAV', role: 'Önder Kurum', logo: 'TİMAV' },
  { name: 'T.C. Gençlik ve Spor Bakanlığı', role: 'Destekleyen Kurum', logo: 'GSB' },
  { name: 'Konya Büyükşehir Belediyesi', role: 'Ana Sponsor', logo: 'KONYA BŞB' },
  { name: 'Karatay Belediyesi', role: 'Kurumsal Paydaş', logo: 'KARATAY' },
  { name: 'Selçuklu Belediyesi', role: 'Mekan Paydaşı', logo: 'SELÇUKLU' },
  { name: 'Meram Belediyesi', role: 'Kültür Paydaşı', logo: 'MERAM' },
  { name: 'Necmettin Erbakan Üniversitesi', role: 'Akademik Destekçi', logo: 'NEÜ' },
  { name: 'Selçuk Üniversitesi', role: 'Akademik Destekçi', logo: 'SELÇUK ÜNİ' },
  { name: 'KTO Karatay Üniversitesi', role: 'Akademik Destekçi', logo: 'KTO KARATAY' }
];

export const FAQ_ITEMS = [
  {
    question: 'İrfan Meclisi nedir ve kimler başvurabilir?',
    answer: 'İrfan Meclisi, ilim ve hikmet ekseninde yetişen genç nesillerin Türkiye ve dünya meselelerine çözüm ürettiği 3 günlük bir parlamento simülasyonudur. Türkiye genelindeki tüm lise ve lisans/lisansüstü öğrencileri delege olmak için başvurabilir.'
  },
  {
    question: 'Programa katılım ücretli midir?',
    answer: 'Hayır, İrfan Meclisi programına katılım tamamen ücretsizdir. 250 asil delege, yapılan değerlendirme ve mülakatlar neticesinde kontenjan dahilinde kabul edilir.'
  },
  {
    question: 'Konaklama, yeme-içme ve materyaller nasıl temin ediliyor?',
    answer: 'Konya dışından seçilerek gelen 250 delegemizin 3 günlük konaklama, tüm öğün ikramları, delege çantası, yaka kartı ve basılı yasa çalışma kılavuzları TİMAV ve paydaş kurumlarımız tarafından eksiksiz karşılanmaktadır.'
  },
  {
    question: 'Komisyonlarda üretilen kanun teklifleri ne olacak?',
    answer: '8 ana ihtisas komisyonunda müzakere edilip Genel Kurul\'da salt çoğunlukla kabul edilen yasa teklifleri, TİMAV İrfan Meclisi Kanun Külliyatı haline getirilerek TBMM Başkanlığına, ilgili bakanlıklara ve sivil toplum kuruluşlarına resmi rapor olarak sunulacaktır.'
  },
  {
    question: 'Katılımcılara resmi sertifika verilecek mi?',
    answer: '3 gün boyunca komisyon oturumlarının en az %80\'ine katılan ve Genel Kurul oylamalarında hazır bulunan tüm delegelere TİMAV onaylı Resmi Delege Başarı ve Katılım Sertifikası takdim edilecektir.'
  }
];

