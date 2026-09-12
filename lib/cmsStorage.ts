import { 
  COMMISSIONS, 
  TEAM_MEMBERS, 
  PROGRAM_DAYS, 
  GALLERY_ITEMS, 
  TIMELINE_MILESTONES, 
  SPONSORS, 
  FAQ_ITEMS 
} from './data';

export interface SliderItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export interface CMSData {
  siteSettings: {
    siteName: string;
    organizationName: string;
    slogan: string;
    countdownText: string;
    targetDate: string;
    status: 'online' | 'maintenance';
  };
  homepage: {
    badge: string;
    heroPrefix: string;
    heroTitle: string;
    heroDesc: string;
    heroBgImage: string;
    editorialQuote: string;
    aboutSummary: {
      tag: string;
      heading: string;
      paragraph: string;
      quote: string;
      imageUrl?: string;
    };
    features: {
      title: string;
      iconName: string;
    }[];
    atmosphere: {
      tag: string;
      heading: string;
      description: string;
      photos: {
        url: string;
        title: string;
        subtitle: string;
      }[];
    };
    stats: {
      value: string;
      suffix: string;
      label: string;
      description: string;
    }[];
    commissionsSection: {
      tag: string;
      heading: string;
      description: string;
    };
    programSection: {
      tag: string;
      heading: string;
      description: string;
    };
    sponsors: { name: string; role: string }[];
    faq: typeof FAQ_ITEMS;
    finalCta: {
      heading: string;
      description: string;
      buttonText: string;
    };
  };
  aboutPage: {
    heroBadge: string;
    heroTitle: string;
    heroDesc: string;
    vizyon: {
      badge?: string;
      title: string;
      subtitle: string;
      content: string;
      footerTag?: string;
    };
    irfanMeclisi: {
      badge?: string;
      title: string;
      subtitle: string;
      content: string;
      footerTag?: string;
    };
    misyon: {
      badge?: string;
      title: string;
      subtitle: string;
      content: string;
      footerTag?: string;
    };
    timav: {
      heading: string;
      tag: string;
      p1: string;
      p2: string;
      stat1Number: string;
      stat1Label: string;
      stat2Number: string;
      stat2Label: string;
      videoUrl: string;
    };
    mediaGallery: {
      url: string;
      title: string;
      subtitle: string;
      type: 'image' | 'video';
      videoEmbedUrl?: string;
    }[];
    bottomCta: {
      heading: string;
      description: string;
      buttonText: string;
    };
  };
  commissions: typeof COMMISSIONS;
  team: typeof TEAM_MEMBERS;
  program: typeof PROGRAM_DAYS;
  gallery: typeof GALLERY_ITEMS;
  basvuruPage: {
    heroBadge: string;
    heroTitle: string;
    heroDesc: string;
    quotaNotice: string;
  };
  galeriPage: {
    heroBadge: string;
    heroTitle: string;
    heroDesc: string;
  };
  contact: {
    address: string;
    phoneTimav: string;
    phoneCoord: string;
    email: string;
    hours: string;
    mapUrl?: string;
    transport: {
      yht: string;
      airport: string;
      tram: string;
      car: string;
    };
  };
}

export const INITIAL_CMS_DATA: CMSData = {
  siteSettings: {
    siteName: 'İrfan Meclisi',
    organizationName: 'TİMAV Önderliğinde',
    slogan: 'KÖKÜMÜZ İRFAN, SÖZÜMÜZ İSTİKBAL',
    countdownText: 'Yeni fikirler, güçlü sesler ve kararlı adımlar için geri sayım başladı.',
    targetDate: '2026-10-23T09:00:00+03:00',
    status: 'online'
  },
  homepage: {
    badge: 'KÖKÜMÜZ İRFAN • SÖZÜMÜZ İSTİKBAL',
    heroPrefix: 'TİMAV ÖNDERLİĞİNDE',
    heroTitle: 'İRFAN MECLİSİ',
    heroDesc: '“Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; gençlerin fikir gücüyle, daha adil, daha güçlü ve daha yaşanabilir bir gelecek için buluşuyoruz.',
    heroBgImage: '/images/anasayfa-arkaplan.png',
    editorialQuote: 'Fikir\nÜreten\nGençlik\nMeclisi',
    aboutSummary: {
      tag: '— Neden İrfan Meclisi?',
      heading: 'Sadece Dinleyen Değil, Geleceği Şekillendiren Gençlik',
      paragraph: 'TİMAV öncülüğünde gerçekleştirilen İrfan Meclisi; gençlerin Türkiye\'nin temel meseleleri üzerinde derinlemesine düşünmelerini, analitik argüman geliştirmelerini ve uzlaşma kültürüyle kanun teklifleri hazırlamalarını sağlayan öncü bir meclis simülasyonudur.',
      quote: '“Daha iyi bir gelecek, gençlerin fikirleriyle mümkün.”',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
    },
    features: [
      {
        title: '8 İhtisas Masasında Profesyonel Moderasyon & Yasa Teklifi Üretimi',
        iconName: 'Users'
      },
      {
        title: 'Gerçek Meclis Prosedürleriyle Genel Kurul Müzakereleri ve Oylamaları',
        iconName: 'Landmark'
      },
      {
        title: 'Alanında Yetkin Akademisyen, Hukukçu ve Bürokrat Mentorluğu',
        iconName: 'GraduationCap'
      },
      {
        title: 'Tüm Delegelere Özel QR Kodlu Giriş Kartı & Prestijli Katılım Beratı',
        iconName: 'QrCode'
      }
    ],
    atmosphere: {
      tag: '— ETKİNLİKTE YAŞAMAK İÇİN',
      heading: 'Geleceğin Liderleri Burada Buluşuyor',
      description: 'İrfan Meclisi, fikirlerin gerçeğe dönüştüğü, gençliğin gücünün hissedildiği bir platformdur.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
          title: 'Genel Kurul Oturumu',
          subtitle: 'Sultan Selim Ana Salonu'
        },
        {
          url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
          title: 'TİMAV Delege Yaka Kartı',
          subtitle: 'Akreditasyon & QR Kimlik'
        },
        {
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          title: 'Komisyon Müzakeresi',
          subtitle: 'Gençler yasa tasarıları üzerinde çalışırken'
        },
        {
          url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
          title: 'Kulis ve Uzlaşma',
          subtitle: 'Partiler arası çapraz müzakereler'
        }
      ]
    },
    stats: [
      {
        value: '250',
        suffix: '+',
        label: 'Asil Delege',
        description: 'Türkiye genelinden mülakatla seçilen lise ve üniversite delegesi'
      },
      {
        value: '8',
        suffix: '',
        label: 'İhtisas Komisyonu',
        description: 'Adaletten Dışişlerine, Savunmadan Eğitime stratejik masalar'
      },
      {
        value: '100',
        suffix: '+',
        label: 'Organizasyon Ekibi',
        description: 'Akademik danışmanlar, divan heyeti ve koordinatörler'
      },
      {
        value: '3',
        suffix: ' Gün',
        label: 'Meclis Zirvesi',
        description: '23-24-25 Ekim 2026 Selçuklu Kongre Merkezi (SKM) Konya'
      }
    ],
    commissionsSection: {
      tag: '— GELECEĞE YÖN VEREN MASALAR',
      heading: '8 İhtisas Komisyonu',
      description: 'Her komisyon, alanında uzman mentörler ve raportörler eşliğinde Türkiye\'nin ve dünyanın stratejik meselelerini masaya yatırır.'
    },
    programSection: {
      tag: 'Meclis Takvimi',
      heading: 'Üç Günlük Zirve Akışı',
      description: '23-24-25 Ekim 2026 Selçuklu Kongre Merkezi\'nde adım adım meclis heyecanı.'
    },
    sponsors: SPONSORS,
    faq: FAQ_ITEMS,
    finalCta: {
      heading: 'Geleceğin Meclisinde Yerinizi Alın',
      description: '250 asil delege kontenjanı için başvurular devam etmektedir. Kişisel QR kodlu biletiniz başvuru sonrası anında oluşturulur.',
      buttonText: 'Delege Başvuru Formuna Git'
    }
  },
  aboutPage: {
    heroBadge: 'TİMAV KURUMSAL VİZYONU',
    heroTitle: 'Köklü Miras, Çağdaş Müzakere: İrfan Meclisi',
    heroDesc: '“Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; ilim, irfan ve hikmet ekseninde yetişen genç nesillerin, Türkiye\'nin ve dünyanın temel meselelerine meclis simülasyonu disipliniyle çözüm ürettiği vizyoner bir platformdur.',
    vizyon: {
      badge: 'Gelecek Tasavvuru',
      title: 'VİZYONUMUZ',
      subtitle: 'Şuurlu Gençlik & Kök Miras',
      content: 'İrfan asırlık milli ve manevi medeniyet birikimimizin değerlerinden güç alan, tarihinden aldığı ilhamı istikbaline taşıyan, şuurlu bir gençlik yetiştirmektir. “Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; milletimizin sahip olduğu ilim, irfan, adalet, ahlak, istişare ve kardeşlik mirasını genç nesillerle buluşturmayı hedefliyoruz. Geçmişinin emanetine sahip çıkan, bugünün meselelerini idrak eden ve yarının Türkiye’sine yön verecek fikir, ahlak ve sorumluluk bilincine sahip gençlerin yetişmesinde öncülük ederek; güçlü bir millet idaresinin, ancak kökleri sağlam bir gençlikle mümkün olduğuna inanıyoruz.',
      footerTag: 'Kadim Değerler & Yeni Perspektifler'
    },
    irfanMeclisi: {
      badge: 'Merkezi Model',
      title: 'İRFAN MECLİSİ',
      subtitle: 'İstişare Kültürü & Gençlik Zemini',
      content: 'İrfan Meclisi; gençlerin milli ve manevi değerlerimizden, tarihi ve medeniyet birikimimizden beslenerek ülke ve dünya meseleleri üzerine fikir ürettiği, istişare kültürünü tecrübe ettiği bir gençlik meclisi simülasyonudur. “Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; şuurlu, sorumluluk sahibi ve dava sahibi gençlerin yetişmesine katkı sunmayı, fikir ve irfanı buluşturarak istikbale yön verecek bir gençlik zemini oluşturmayı amaçlar.',
      footerTag: 'TBMM Disiplini & Karar Alma Süreçleri'
    },
    misyon: {
      badge: 'Tarihî Sorumluluk',
      title: 'MİSYONUMUZ',
      subtitle: 'Ortak Akıl & Geleceğin Karar Alıcıları',
      content: 'İrfan Meclis Simülasyonu\'nun misyonu; gençlerimizi milletimizin tarihî ve medenî değerleriyle buluşturmak, onlara söz söyleme, fikir üretme, istişare etme ve sorumluluk alma imkânı sunarak geleceğin karar alıcıları olmaya hazırlamaktır. Meclis kültürünü yalnızca bir simülasyon olarak değil, istişare ve ortak akıl geleneğimizin gençler nezdinde yeniden ihyası olarak ele alıyoruz. Bu doğrultuda; vatanına, milletine ve medeniyetine bağlı, millî ve manevî değerlerine sahip çıkan, adalet ve ahlakı rehber edinen, şuurlu ve dava sahibi gençlerin yetişmesine katkı sağlamayı; gençlerimizin sesini fikirle, fikrini irfanla, ve irfanını istikballe buluşturmayı kendimize görev addediyoruz.',
      footerTag: 'Fikir • Ahlak • Adalet • Aksiyon'
    },
    timav: {
      heading: 'TİMAV\'ın Gençlik ve Gelecek Vizyonu',
      tag: 'Önder Kurumumuz',
      p1: 'Türkiye İmam Hatipliler Vakfı (TİMAV); 30 yılı aşkın süredir eğitim, kültür, sanat ve akademi sahasında nesillerin yetişmesine öncülük eden, Türkiye\'nin saygın ve köklü sivil toplum kuruluşlarındandır.',
      p2: 'İrfan Meclisi; TİMAV\'ın gençlik vizyonunun en somut ve dinamik tezahürlerinden biri olarak, gençleri sadece teorik bilgiyle değil; meclis başkanı, komisyon raportörü, müzakereci ve kanun yapıcı kimlikleriyle geleceğe hazırlar.',
      stat1Number: '30+ Yıl',
      stat1Label: 'Eğitim ve Gençlik Tecrübesi',
      stat2Number: '10.000+',
      stat2Label: 'Gencimize Ulaşan Projeler',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curved-lines-of-an-auditorium-hall-with-warm-lights-42971-large.mp4'
    },
    mediaGallery: [
      {
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        title: 'Selçuklu Kongre Merkezi Sultan Selim Salonu',
        subtitle: '2.200 Delege Kapasiteli Ana Genel Kurul Salonu',
        type: 'image'
      },
      {
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        title: 'İrfan Meclisi Tanıtım Filmi & Belgeseli',
        subtitle: 'Meclis Simülasyonunun Doğuşu ve Hedefleri',
        type: 'video',
        videoEmbedUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curved-lines-of-an-auditorium-hall-with-warm-lights-42971-large.mp4'
      },
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        title: 'İhtisas Komisyonları Çalıştay Masası',
        subtitle: '8 Stratejik Masada 250 Genç Delegenin Müzakeresi',
        type: 'image'
      },
      {
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        title: 'Akreditasyon & Protokol Karşılama',
        subtitle: 'Giriş Kartları ve Delege Beratı Dağıtım Noktası',
        type: 'image'
      }
    ],
    bottomCta: {
      heading: 'Tarihe Not Düşecek 250 Delegeden Biri Olun',
      description: 'Başvurular kontenjanlarla sınırlıdır. Erken başvuru değerlendirmede önceliklidir.',
      buttonText: 'Delege Başvuru Formuna Git'
    }
  },
  commissions: COMMISSIONS,
  team: TEAM_MEMBERS,
  program: PROGRAM_DAYS,
  gallery: GALLERY_ITEMS,
  basvuruPage: {
    heroBadge: 'MECLİS DELEGE SEÇİMLERİ',
    heroTitle: '2026 Delege Başvuru Formu',
    heroDesc: '“Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla; Türkiye\'nin ve dünyanın geleceğine yön verecek 250 asil delegeden biri olmak için 8 adımlı başvuru formunu doldurunuz.',
    quotaNotice: 'Toplam 8 komisyonda 250 asil delege kabul edilecektir. Başvuru ücretsizdir.'
  },
  galeriPage: {
    heroBadge: 'MEDYA & ETKİNLİK ALANI',
    heroTitle: 'Fotoğraf ve Video Galerisi',
    heroDesc: '“Kökümüz İrfan, Sözümüz İstikbal” — İrfan Meclisi\'nin genel kurul oturumları, komisyon müzakereleri ve kulis anlarından yüksek çözünürlüklü kareler.'
  },
  contact: {
    address: 'Selçuklu Kongre Merkezi (SKM), Yazır Mah. Doç. Dr. Halil Ürün Cad. No: 28 Selçuklu / KONYA',
    phoneTimav: '+90 (332) 350 20 40',
    phoneCoord: '+90 (532) 111 20 26',
    email: 'bilgi@timav.org.tr / irfanmeclisi@timav.org.tr',
    hours: '23 Ekim 2026 Cuma günü 08:30 - 09:30 arası akreditasyon ve kayıt',
    transport: {
      yht: 'Konya YHT Garı\'ndan taksi ile 10 dakika veya Gar önünden kalkan tramvay/otobüs hatlarıyla doğrudan Selçuklu Kongre Merkezi\'ne ulaşım sağlanmaktadır.',
      airport: 'Havalimanından kalkan HAVAŞ servisleri ile şehir merkezine ve SKM kavşağına yaklaşık 20 dakikada rahatça varabilirsiniz.',
      tram: 'Alaaddin - Selçuk Üniversitesi tramvay hattında seyreden tramvaylarla doğrudan Kongre Merkezi durağında inebilirsiniz.',
      car: 'Ankara, İstanbul ve Antalya çevre yollarından Selçuklu / SKM tabelalarını takip ederek 950 araç kapasiteli kapalı otoparka ulaşabilirsiniz.'
    }
  }
};

const CMS_STORAGE_KEY = 'igm_cms_content_v3';

export function getStoredCMSData(): CMSData {
  if (typeof window === 'undefined') return INITIAL_CMS_DATA;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
      return INITIAL_CMS_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CMS_DATA,
      ...parsed,
      siteSettings: { ...INITIAL_CMS_DATA.siteSettings, ...(parsed.siteSettings || {}) },
      homepage: { ...INITIAL_CMS_DATA.homepage, ...(parsed.homepage || {}) },
      aboutPage: { ...INITIAL_CMS_DATA.aboutPage, ...(parsed.aboutPage || {}) },
      commissions: Array.isArray(parsed.commissions) ? parsed.commissions : INITIAL_CMS_DATA.commissions,
      team: Array.isArray(parsed.team) ? parsed.team : INITIAL_CMS_DATA.team,
      program: Array.isArray(parsed.program) ? parsed.program : INITIAL_CMS_DATA.program,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : INITIAL_CMS_DATA.gallery,
      basvuruPage: { ...INITIAL_CMS_DATA.basvuruPage, ...(parsed.basvuruPage || {}) },
      galeriPage: { ...INITIAL_CMS_DATA.galeriPage, ...(parsed.galeriPage || {}) },
      contact: { ...INITIAL_CMS_DATA.contact, ...(parsed.contact || {}) }
    };
  } catch {
    return INITIAL_CMS_DATA;
  }
}

export function saveStoredCMSData(data: CMSData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('igm_cms_updated'));
  } catch (err) {
    console.error('Failed to save CMS data:', err);
  }
}

export function resetCMSData(): CMSData {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
    window.dispatchEvent(new Event('igm_cms_updated'));
  }
  return INITIAL_CMS_DATA;
}

// -------------------------------------------------------------
// CMS CRUD HELPERS (Direct mutations with event trigger)
// -------------------------------------------------------------

export function addCommissionItem(commission: any): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    commissions: [...current.commissions, commission]
  };
  saveStoredCMSData(updated);
  return updated;
}

export function updateCommissionItem(id: string, updates: any): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    commissions: current.commissions.map((c: any) => (c.id === id ? { ...c, ...updates } : c))
  };
  saveStoredCMSData(updated);
  return updated;
}

export function deleteCommissionItem(id: string): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    commissions: current.commissions.filter((c: any) => c.id !== id)
  };
  saveStoredCMSData(updated);
  return updated;
}

export function addTeamMemberItem(member: any): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    team: [...current.team, member]
  };
  saveStoredCMSData(updated);
  return updated;
}

export function updateTeamMemberItem(id: string, updates: any): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    team: current.team.map((m: any) => (m.id === id ? { ...m, ...updates } : m))
  };
  saveStoredCMSData(updated);
  return updated;
}

export function deleteTeamMemberItem(id: string): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    team: current.team.filter((m: any) => m.id !== id)
  };
  saveStoredCMSData(updated);
  return updated;
}

export function addProgramSessionItem(dayNumber: number, session: any): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    program: current.program.map((day: any) => {
      if (day.dayNumber === dayNumber) {
        return { ...day, sessions: [...day.sessions, session] };
      }
      return day;
    })
  };
  saveStoredCMSData(updated);
  return updated;
}

export function updateProgramSessionItem(dayNumber: number, sessionId: string, updates: any): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    program: current.program.map((day: any) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          sessions: day.sessions.map((s: any) => (s.id === sessionId ? { ...s, ...updates } : s))
        };
      }
      return day;
    })
  };
  saveStoredCMSData(updated);
  return updated;
}

export function deleteProgramSessionItem(dayNumber: number, sessionId: string): CMSData {
  const current = getStoredCMSData();
  const updated = {
    ...current,
    program: current.program.map((day: any) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          sessions: day.sessions.filter((s: any) => s.id !== sessionId)
        };
      }
      return day;
    })
  };
  saveStoredCMSData(updated);
  return updated;
}

