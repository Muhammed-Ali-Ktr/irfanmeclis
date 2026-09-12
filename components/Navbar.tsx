'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  LogIn,
  Home,
  Info,
  Layers,
  Users,
  Calendar,
  Image as ImageIcon,
  Mail,
  QrCode,
  ArrowRight,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { getCurrentUser, logoutParticipant } from '@/lib/storage';
import { Application } from '@/lib/types';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commissionDropdown, setCommissionDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<Application | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Initial check
    setCurrentUser(getCurrentUser());

    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('igm_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('igm_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Desktop navigation links
  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımızda', href: '/hakkinda' },
    { 
      name: 'Komisyonlar', 
      href: '/komisyonlar',
      hasDropdown: true,
      subLinks: [
        { name: '8 İhtisas Masası', href: '/komisyonlar', desc: 'Adalet, Savunma, Dışişleri ve diğerleri' },
        { name: 'Komisyonlar & 100 Kişilik Ekip', href: '/komisyonlar-ve-ekip', desc: 'Detaylı birleşik çalışma tablosu' },
      ]
    },
    { name: 'Ekip', href: '/ekip' },
    { name: 'Program', href: '/program' },
    { name: 'Başvuru', href: '/basvuru' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  // Mobile drawer links matching reference design
  const mobileNavLinks = [
    { name: 'Ana Sayfa', href: '/', icon: Home },
    { name: 'Hakkında', href: '/hakkinda', icon: Info },
    { name: 'Komisyonlar', href: '/komisyonlar', icon: Layers },
    { name: 'Organizasyon Ekibi', href: '/ekip', icon: Users },
    { name: 'Program & Akış', href: '/program', icon: Calendar },
    { name: 'Medya Galerisi', href: '/galeri', icon: ImageIcon },
    { name: 'İletişim & Ulaşım', href: '/iletisim', icon: Mail },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header 
      className={`sticky top-0 z-40 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-[#061A33]/95 backdrop-blur-md border-b border-[#4DA3FF]/20 shadow-xl shadow-[#030D1A]/50 py-3' 
          : 'bg-[#061A33]/90 backdrop-blur-sm border-b border-white/5 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        
        {/* Left: Official Circular Logo + "ÖNDERLİĞİNDE / İRFAN GENÇ MECLİSİ" */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[#4DA3FF]/40 shadow-lg shadow-[#061A33] bg-[#061A33] group-hover:scale-105 group-hover:border-[#4DA3FF] transition-all">
            <Image
              src="/logo.png"
              alt="İrfan Meclis Simülasyonu"
              fill
              sizes="(max-width: 640px) 36px, 44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#4DA3FF] font-medium leading-none mb-1">
              ÖNDERLİĞİNDE
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-serif font-black tracking-tight text-white leading-tight truncate">
              İRFAN MECLİSİ
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            
            if (link.hasDropdown) {
              return (
                <div 
                  key={link.name} 
                  className="relative"
                  onMouseEnter={() => setCommissionDropdown(true)}
                  onMouseLeave={() => setCommissionDropdown(false)}
                >
                  <Link
                    href={link.href}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-all inline-flex items-center gap-1 ${
                      active
                        ? 'text-white font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#4DA3FF] rounded-full" />
                    )}
                  </Link>

                  {commissionDropdown && (
                    <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-2 rounded-xl bg-[#092746] border border-[#4DA3FF]/25 shadow-2xl backdrop-blur-xl space-y-1">
                        {link.subLinks?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block p-2.5 rounded-lg hover:bg-[#0D3156] transition-colors group/sub"
                          >
                            <span className="text-xs font-semibold text-white block group-hover/sub:text-[#4DA3FF] transition-colors">
                              {sub.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#4DA3FF] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop "Giriş Yap" / "Profilim" Button */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4DA3FF]/50 bg-[#092746] hover:bg-[#0c3159] text-white text-xs font-semibold transition-all shadow-md group"
              >
                <div className="w-6 h-6 rounded-full bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/40 flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="max-w-[110px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#4DA3FF]/20 text-[#4DA3FF] font-sans">Profilim</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logoutParticipant();
                  setCurrentUser(null);
                }}
                title="Çıkış Yap"
                className="p-2 rounded-full border border-slate-700/60 bg-[#061A33] hover:bg-red-950/60 hover:border-red-500/50 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/giris"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-500/50 hover:border-[#4DA3FF] bg-[#092746]/60 hover:bg-[#092746] text-white text-xs font-semibold transition-all duration-200 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#4DA3FF]" />
              <span>Giriş Yap</span>
            </Link>
          )}
        </div>

        {/* Mobile Action & Menu Trigger */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {currentUser ? (
            <Link
              href="/profil"
              className="text-[11px] sm:text-xs border border-[#4DA3FF]/60 px-2.5 sm:px-3 py-1.5 rounded-full text-[#4DA3FF] font-semibold bg-[#092746] whitespace-nowrap flex items-center gap-1.5"
            >
              <UserIcon className="w-3 h-3" />
              <span>Profilim</span>
            </Link>
          ) : (
            <Link
              href="/giris"
              className="text-[11px] sm:text-xs border border-slate-600 px-2.5 sm:px-3 py-1.5 rounded-full text-white font-semibold bg-[#092746] whitespace-nowrap"
            >
              Giriş
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-[#092746] border border-slate-700/60 text-slate-300 hover:text-white shrink-0 cursor-pointer transition-colors active:scale-95"
            aria-label={mobileOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            {mobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>
    </header>

    {/* ========================================================================= */}
    {/* MOBILE RIGHT-TO-LEFT SLIDE-OVER DRAWER (RENDERED AT ROOT LEVEL)           */}
    {/* ========================================================================= */}
    
    {/* Backdrop Overlay */}
    <div 
      onClick={() => setMobileOpen(false)}
      className={`fixed inset-0 z-[999] bg-[#030D1A]/80 backdrop-blur-sm transition-all duration-300 lg:hidden ${
        mobileOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
      }`}
      aria-hidden="true"
    />

    {/* Slide-over Drawer Panel */}
    <div 
      className={`fixed top-0 right-0 bottom-0 z-[1000] h-full h-[100dvh] w-[85vw] max-w-sm bg-[#061A33] border-l border-[#4DA3FF]/25 shadow-2xl shadow-[#030D1A] flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 ease-out transform lg:hidden ${
        mobileOpen ? 'translate-x-0 opacity-100 visible pointer-events-auto' : 'translate-x-full opacity-0 invisible pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobil Gezinme Menüsü"
    >
      {/* 1. Drawer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#4DA3FF]/40 bg-[#061A33] shadow-md">
            <Image
              src="/logo.png"
              alt="İrfan Meclis Logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-serif font-black tracking-tight text-white leading-tight truncate">
              İRFAN MECLİSİ
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#4DA3FF] font-semibold mt-0.5 truncate">
              TİMAV SİMÜLASYONU 2026
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(false)}
          className="w-9 h-9 rounded-xl bg-[#092746] border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
          aria-label="Menüyü Kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Drawer Navigation Items (Matching exact screenshot design) */}
      <div className="flex-1 py-4 overflow-y-auto space-y-1.5 no-scrollbar">
        {mobileNavLinks.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#0c2b4c]/85 border border-[#4DA3FF]/45 text-[#4DA3FF] shadow-md shadow-[#0c2b4c]/50 font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-[#092746]/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#4DA3FF]' : 'text-slate-400'}`} />
                <span className={`truncate ${active ? 'text-white font-semibold' : 'text-slate-200'}`}>
                  {link.name}
                </span>
              </div>
              {active ? (
                <span className="w-2 h-2 rounded-full bg-[#4DA3FF] shadow-[0_0_8px_#4DA3FF] shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Drawer Bottom Action Buttons & Subtitle */}
      <div className="pt-3 border-t border-white/10 shrink-0 space-y-2.5">
        {/* Bilet Sorgula / Giriş or Profilim */}
        {currentUser ? (
          <div className="space-y-2">
            <Link
              href="/profil"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0c2b4c] border border-[#4DA3FF]/50 text-white font-semibold text-xs sm:text-sm shadow-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/40 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-white text-xs font-bold truncate">{currentUser.fullName}</span>
                  <span className="text-[10px] text-[#4DA3FF]">Profilim & QR Kartım</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4DA3FF]" />
            </Link>
            <button
              type="button"
              onClick={() => {
                logoutParticipant();
                setCurrentUser(null);
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Oturumu Kapat</span>
            </button>
          </div>
        ) : (
          <Link
            href="/giris"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#0c243f] border border-[#2a5078] hover:border-[#4DA3FF]/60 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99]"
          >
            <QrCode className="w-4 h-4 text-[#4DA3FF]" />
            <span>Bilet Sorgula / Giriş</span>
          </Link>
        )}

        {/* Delege Başvurusu Yap Button */}
        <Link
          href="/basvuru"
          onClick={() => setMobileOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#4DA3FF] hover:bg-[#3b8ee6] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99]"
        >
          <span>Delege Başvurusu Yap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Location & Date Footer */}
        <p className="text-center text-[11px] text-slate-400 font-sans tracking-wide pt-2 pb-0.5">
          23-24-25 Ekim 2026 • SKM Konya
        </p>
      </div>
    </div>
  </>
  );
}

