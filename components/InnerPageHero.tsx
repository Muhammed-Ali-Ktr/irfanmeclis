import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface InnerPageHeroProps {
  badge: string;
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  actionButton?: { label: string; href: string };
}

export default function InnerPageHero({
  badge,
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  actionButton
}: InnerPageHeroProps) {
  const displayDesc = description || subtitle;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#030D1A] via-[#061A33] to-[#061A33] pt-14 pb-16 border-b border-blue-900/20">
      {/* Ambient background glow and grid line accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,163,255,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb if provided */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#4DA3FF] font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            
            {/* Category Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#0D3156] border border-[#4DA3FF]/30 text-[#4DA3FF] uppercase tracking-wider">
              <span>{badge}</span>
            </div>

            {/* Main Serif Heading */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle / Description */}
            {displayDesc && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
                {displayDesc}
              </p>
            )}
          </div>

          {/* Optional Action Buttons */}
          {(actions || actionButton) && (
            <div className="shrink-0 flex items-center gap-3">
              {actions}
              {actionButton && (
                <Link
                  href={actionButton.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4DA3FF] hover:bg-[#258BF5] text-[#061A33] font-bold text-xs shadow-xl hover:shadow-[#4DA3FF]/30 transition-all cursor-pointer"
                >
                  {actionButton.label}
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
