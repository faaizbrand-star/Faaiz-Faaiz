import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, Lock, X } from 'lucide-react';
import { SiteContent } from '../types';

interface FooterProps {
  footerData: SiteContent['footer'];
  ctaData: SiteContent['ctaSection'];
  brandName: string;
  onOpenApplication: () => void;
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  footerData,
  ctaData,
  brandName,
  onOpenApplication,
  onNavigateAdmin
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      {/* Final Pre-Footer Call to Action */}
      <section className="py-24 bg-gradient-to-b from-[#123D32] to-[#0D2B23] border-t border-[#1E5747] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F2D231]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194C3D] border border-[#F2D231]/30 text-[#D4B22A] text-xs font-spacemono uppercase tracking-widest font-bold">
            <span className="edot" />
            <span>EXCELLENCE IN SPOT EXECUTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif-italic font-bold text-white tracking-tight leading-tight">
            {ctaData.headline || 'Stop Guessing. Start Trading With A Real Process.'}
          </h2>

          <p className="text-base sm:text-lg text-[#D6F0E5] leading-relaxed max-w-2xl mx-auto font-sans">
            {ctaData.subheadline}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="final-cta-btn"
              onClick={onOpenApplication}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#123D32] bg-[#F2D231] hover:bg-[#FFE873] active:bg-[#D4B22A] rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(242,210,49,0.35)] hover:shadow-[0_0_40px_rgba(242,210,49,0.5)] cursor-pointer"
            >
              <span>{ctaData.buttonText || 'Get Membership Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-xs font-spacemono text-[#BFE5D5]">
            {ctaData.secondaryNote}
          </div>
        </div>
      </section>

      {/* Main Global Footer */}
      <footer className="bg-[#0D2B23] border-t border-[#1E5747] text-xs font-mono text-[#BFE5D5] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <a href="#hero" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1E5747] border border-[#F2D231]/40 flex items-center justify-center">
                  <span className="font-serif-italic text-[#F2D231] text-lg font-bold">F</span>
                </div>
                <span className="text-xl font-serif-italic font-bold text-white">
                  Faaiz<span className="text-[#F2D231]">Durrani</span>
                </span>
              </a>

              <p className="text-xs text-[#D6F0E5] font-sans max-w-sm leading-relaxed">
                Real crypto trading education, live spot signals, and honest market analysis. No fake promises, no overnight millionaire talk — learn to trade smart, not blind.
              </p>

              <div className="flex items-center gap-3 pt-2">
                {footerData.socialLinks?.map((soc) => (
                  <a
                    key={soc.platform}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#123D32] border border-[#1E5747] text-xs text-[#D6F0E5] hover:text-[#F2D231] hover:border-[#F2D231] transition-colors"
                  >
                    {soc.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <div className="text-[11px] font-spacemono uppercase tracking-wider text-[#D4B22A] font-bold mb-3">
                NAVIGATION
              </div>
              <ul className="space-y-2 text-xs font-sans text-[#D6F0E5]">
                <li><a href="#hero" className="hover:text-[#F2D231] transition-colors">Home</a></li>
                <li><a href="#results" className="hover:text-[#F2D231] transition-colors">Spot Results (30D)</a></li>
                <li><a href="#membership" className="hover:text-[#F2D231] transition-colors">Membership Plans</a></li>
                <li><a href="#why-us" className="hover:text-[#F2D231] transition-colors">The Difference</a></li>
                <li><a href="#live-chart" className="hover:text-[#F2D231] transition-colors">Live Market Terminal</a></li>
                <li><a href="#founder" className="hover:text-[#F2D231] transition-colors">About Faaiz</a></li>
                <li><a href="#faq" className="hover:text-[#F2D231] transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Legal & Administration */}
            <div>
              <div className="text-[11px] font-spacemono uppercase tracking-wider text-[#D4B22A] font-bold mb-3">
                OPERATIONS & TRUST
              </div>
              <ul className="space-y-2 text-xs font-sans text-[#D6F0E5]">
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="hover:text-[#F2D231] transition-colors cursor-pointer text-left"
                  >
                    Terms of Educational Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="hover:text-[#F2D231] transition-colors cursor-pointer text-left"
                  >
                    Privacy & Data Policy
                  </button>
                </li>
                <li className="pt-3">
                  <button
                    onClick={onNavigateAdmin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123D32] border border-[#F2D231]/30 text-[#F2D231] hover:bg-[#1E5747] transition-all font-spacemono text-[11px]"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Portal Administrator</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Risk Disclaimer Box */}
          <div className="p-5 rounded-2xl bg-[#123D32]/80 border border-[#1E5747] text-[11px] text-[#BFE5D5] space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-[#F2D231] font-bold font-spacemono">
              <ShieldAlert className="w-4 h-4" />
              <span>HIGH RISK WARNING & EDUCATIONAL MANDATE</span>
            </div>
            <p>{footerData.riskDisclaimer}</p>
            <p>{footerData.educationalNotice}</p>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-[#1E5747] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#BFE5D5]">
            <div>{footerData.copyrightText}</div>
            <div className="mt-2 sm:mt-0 font-spacemono text-[#D4B22A]">
              Pakistan's Real Crypto Educator &bull; Spot Trading Only
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Policy Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#123D32] border border-[#F2D231]/40 rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto text-[#D6F0E5] shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#1E5747] text-white hover:text-[#F2D231]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif-italic font-bold text-white mb-4">
              {modalType === 'terms' ? 'Terms of Educational Service' : 'Privacy & Data Protection Policy'}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans">
              <p>
                FaaizDurrani operates strictly as a specialized crypto and financial market educational institution and private analysis community.
              </p>
              <p>
                <strong>No Financial Advice:</strong> Under no circumstances does any material, video, signal, or community interaction constitute individual investment advice or an invitation to trade.
              </p>
              <p>
                <strong>Spot Discipline:</strong> We emphasize capital preservation through spot positions. Trading financial assets carries high market volatility and risk of capital loss.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
