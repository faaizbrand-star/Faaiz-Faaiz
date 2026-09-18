import React from 'react';
import { ShieldCheck, Award, ExternalLink, Quote, UserCheck, Sparkles } from 'lucide-react';
import { SiteContent } from '../types';

interface FounderSectionProps {
  founderData: SiteContent['founder'];
}

export const FounderSection: React.FC<FounderSectionProps> = ({ founderData }) => {
  return (
    <section id="founder" className="py-24 bg-[#123D32] relative overflow-hidden border-t border-[#1E5747]">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#F2D231]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Founder Profile Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F2D231]/30 via-[#1E5747] to-[#F2D231]/30 rounded-3xl blur-xl opacity-60" />

              <div className="relative rounded-2xl bg-[#194C3D] border border-[#F2D231]/40 p-6 overflow-hidden shadow-2xl">
                {/* Visual Avatar Banner */}
                <div className="relative w-full h-72 rounded-xl bg-gradient-to-b from-[#1E5747] to-[#123D32] border border-[#F2D231]/30 flex flex-col items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-30" />

                  {/* Monogram emblem */}
                  <div className="relative z-10 w-28 h-28 rounded-full bg-[#123D32] border-2 border-[#F2D231] p-2 shadow-[0_0_30px_rgba(242,210,49,0.3)] flex items-center justify-center">
                    <span className="font-serif-italic text-[#F2D231] text-4xl font-bold">
                      FD
                    </span>
                  </div>

                  <div className="relative z-10 mt-5 text-center">
                    <div className="text-xl font-serif-italic font-bold text-white tracking-wide">
                      {founderData.name}
                    </div>
                    <div className="text-[11px] font-spacemono text-[#F2D231] uppercase tracking-wider mt-0.5 font-bold">
                      {founderData.title}
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#BFE5D5] bg-[#123D32]/90 px-3 py-1.5 rounded-lg border border-[#1E5747]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5FC98A]" />
                      VERIFIED ANALYST
                    </span>
                    <span className="text-[#F2D231]">{founderData.experienceYears}</span>
                  </div>
                </div>

                {/* Verified Credentials */}
                <div className="mt-5 space-y-2">
                  {founderData.credentials?.map((cred, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#123D32]/60 border border-[#1E5747] text-xs text-[#D6F0E5]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#F2D231] flex-shrink-0" />
                      <span className="leading-tight">{cred}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold">
              <span className="edot" />
              <span>{founderData.badge || "Pakistan's Real Crypto Educator"}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold text-[#EFFAF5] tracking-tight">
              {founderData.headline || 'Honest Market Analysis From The Trenches.'}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#D6F0E5] leading-relaxed font-sans">
              <p>{founderData.bioParagraph1}</p>
              <p>{founderData.bioParagraph2}</p>
            </div>

            {/* Philosophy Pull-Quote */}
            <div className="relative p-6 rounded-2xl bg-[#194C3D]/80 border-l-4 border-[#F2D231] border border-[#F2D231]/20 my-6">
              <Quote className="w-8 h-8 text-[#F2D231]/40 absolute top-4 right-4" />
              <p className="text-sm sm:text-base font-serif-italic italic text-white leading-relaxed relative z-10">
                "{founderData.philosophyQuote}"
              </p>
              <div className="mt-3 text-xs font-spacemono text-[#D4B22A] font-bold">
                &mdash; {founderData.name}, Founder
              </div>
            </div>

            {/* Public Channels Grid */}
            <div className="pt-2">
              <div className="text-xs font-spacemono uppercase tracking-wider text-[#D4B22A] font-bold mb-3">
                OFFICIAL VERIFIED BROADCAST CHANNELS
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {founderData.socials?.map((soc) => (
                  <a
                    key={soc.platform}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[#194C3D] border border-[#F2D231]/20 hover:border-[#F2D231] text-center transition-all duration-200 group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-[#F2D231] transition-colors">
                      {soc.platform}
                    </div>
                    <div className="text-[10px] text-[#BFE5D5] font-spacemono truncate mt-0.5">
                      {soc.handle}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
