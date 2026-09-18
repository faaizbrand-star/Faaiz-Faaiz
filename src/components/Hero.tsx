import React from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, CheckCircle, Flame, ExternalLink, Sparkles } from 'lucide-react';
import { SiteContent, MarketTickerData } from '../types';
import { HeroTerminal } from './HeroTerminal';

interface HeroProps {
  heroData: SiteContent['hero'];
  tickerData?: MarketTickerData | null;
  onOpenApplication: (planTier?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroData,
  tickerData,
  onOpenApplication
}) => {
  return (
    <section id="hero" className="relative pt-32 sm:pt-40 pb-20 lg:pb-28 overflow-hidden bg-slate-50 dark:bg-[#123D32] transition-colors duration-200">
      {/* Top Gold Accent Line */}
      <div className="hero-accent-line" />

      {/* Subtle Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/10 dark:bg-[#F2D231]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-[#1E5747]/60 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 dark:bg-[#194C3D] dark:border-[#F2D231]/30 dark:text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold shadow-sm dark:shadow-[0_0_15px_rgba(242,210,49,0.15)]">
              <span className="edot" />
              <span>{heroData.eyebrow || "Pakistan's Real Crypto Educator"}</span>
            </div>

            {/* Cormorant Garamond Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-italic font-bold tracking-tight text-slate-900 dark:text-[#EFFAF5] leading-[1.08]">
              {heroData.headlinePart1 || 'Learn To Trade '}
              <br className="hidden sm:inline" />
              <span className="text-amber-600 dark:text-[#F2D231] italic">
                {heroData.headlinePart2 || 'Smart. Not Blind.'}
              </span>
            </h1>

            {/* Subheadline with high readability */}
            <p className="text-base sm:text-lg text-slate-700 dark:text-[#D6F0E5] leading-relaxed max-w-2xl font-sans font-normal">
              {heroData.subheadline}
            </p>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero-primary-cta"
                onClick={() => onOpenApplication('Yearly VIP')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-[#123D32] bg-amber-400 hover:bg-amber-300 active:bg-amber-500 dark:bg-[#F2D231] dark:hover:bg-[#FFE873] dark:active:bg-[#D4B22A] rounded-xl transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-[0_0_30px_rgba(242,210,49,0.35)] dark:hover:shadow-[0_0_40px_rgba(242,210,49,0.5)] cursor-pointer"
              >
                <span>{heroData.ctaPrimaryText || 'Get Membership'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#ai-analyst"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-xs sm:text-sm font-medium tracking-wide text-amber-800 dark:text-[#F2D231] bg-amber-50/80 hover:bg-amber-100/90 dark:bg-[#194C3D]/80 dark:hover:bg-[#1E5747] border border-amber-300 hover:border-amber-400 dark:border-[#F2D231]/40 dark:hover:border-[#F2D231] rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#F2D231]" />
                <span>Ask AI Analyst</span>
              </a>

              <a
                href="#results"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 text-xs sm:text-sm font-medium tracking-wide text-slate-700 hover:text-slate-900 dark:text-[#EFFAF5] bg-white hover:bg-slate-100 dark:bg-[#194C3D]/40 dark:hover:bg-[#1E5747] border border-slate-300 hover:border-slate-400 dark:border-white/10 dark:hover:border-[#F2D231]/40 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                <span>Spot Results</span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-700 dark:text-[#BFE5D5] font-spacemono">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#5FC98A]" />
                Spot Accumulation Only
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#5FC98A]" />
                Zero Leverage Gambling
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#5FC98A]" />
                Reasoning With Every Call
              </span>
            </div>
          </div>

          {/* Right Column: Hero Live Signal Terminal */}
          <div className="lg:col-span-5 relative">
            <HeroTerminal tickerData={tickerData} />
          </div>
        </div>

        {/* 4 Credibility Metric Counters */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-slate-200 dark:border-[#1E5747]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {heroData.stats.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#194C3D]/60 border border-slate-200 dark:border-[#F2D231]/20 hover:border-amber-400 dark:hover:border-[#F2D231]/50 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(242,210,49,0.12)] group"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif-italic font-bold text-amber-600 dark:text-[#F2D231] tracking-tight group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-[#EFFAF5] mt-2">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#BFE5D5] font-spacemono mt-0.5">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
