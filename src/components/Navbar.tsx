import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { MarketTickerData } from '../types';

interface NavbarProps {
  brandName: string;
  logoText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  links: Array<{ label: string; href: string }>;
  activeSection: string;
  tickerData?: MarketTickerData | null;
  onOpenApplication: (planTier?: string) => void;
  onNavigateAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  logoText,
  primaryCtaText,
  primaryCtaLink,
  links,
  activeSection,
  tickerData,
  onOpenApplication,
  onNavigateAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const btcPrice = tickerData?.price ? `$${tickerData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$67,482.50';
  const btcChange = tickerData?.change24h ?? 3.42;

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#123D32]/95 backdrop-blur-md border-b border-[#F2D231]/20 shadow-[0_4px_30px_rgba(0,0,0,0.4)] py-2.5'
            : 'bg-[#123D32]/85 backdrop-blur-sm border-b border-[#F2D231]/10 py-3.5'
        }`}
      >
        {/* Top Mini Ticker Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 mb-1 border-b border-[#1E5747] hidden md:flex items-center justify-between text-[11px] font-mono text-[#BFE5D5]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-[#F2D231] font-bold">
              <span className="edot" />
              SPOT ORACLE:
            </span>
            <span className="flex items-center gap-1">
              <span className="text-white font-semibold">BTC/USDT</span>
              <span>{btcPrice}</span>
              <span className={btcChange >= 0 ? 'text-[#5FC98A]' : 'text-[#E08888]'}>
                ({btcChange >= 0 ? '+' : ''}{btcChange.toFixed(2)}%)
              </span>
            </span>
            <span className="hidden lg:inline text-[#BFE5D5]/60">&bull;</span>
            <span className="hidden lg:flex items-center gap-1">
              <span className="text-white font-semibold">ETH/USDT</span>
              <span>$3,480.20</span>
              <span className="text-[#5FC98A]">(+4.15%)</span>
            </span>
            <span className="hidden xl:inline text-[#BFE5D5]/60">&bull;</span>
            <span className="hidden xl:flex items-center gap-1">
              <span className="text-white font-semibold">SOL/USDT</span>
              <span>$184.60</span>
              <span className="text-[#5FC98A]">(+6.80%)</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-[#BFE5D5]">
            <span className="text-[#F2D231]">ZERO LEVERAGE DISCIPLINE</span>
            <button
              onClick={onNavigateAdmin}
              className="text-[#BFE5D5]/70 hover:text-[#F2D231] transition-colors cursor-pointer"
            >
              PORTAL LOGIN
            </button>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E5747] border border-[#F2D231]/40 flex items-center justify-center shadow-[0_0_12px_rgba(242,210,49,0.2)] group-hover:border-[#F2D231] transition-colors">
              <span className="font-serif-italic text-[#F2D231] text-lg font-bold">F</span>
            </div>
            <span className="text-xl sm:text-2xl font-serif-italic font-bold tracking-tight text-white group-hover:text-[#F2D231] transition-colors">
              Faaiz<span className="text-[#F2D231]">Durrani</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#194C3D]/80 border border-[#F2D231]/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            {links.map((link) => {
              const sectionKey = link.href.replace('#', '');
              const isActive = activeSection === sectionKey;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E5747] text-[#F2D231] font-semibold shadow-[0_0_12px_rgba(242,210,49,0.2)] border border-[#F2D231]/30'
                      : 'text-[#D6F0E5] hover:text-[#F2D231]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              id="nav-get-membership-btn"
              onClick={() => onOpenApplication('Yearly VIP')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#123D32] bg-[#F2D231] hover:bg-[#FFE873] active:bg-[#D4B22A] rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(242,210,49,0.3)] hover:shadow-[0_0_25px_rgba(242,210,49,0.45)] cursor-pointer"
            >
              <span>{primaryCtaText || 'Get Membership'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#194C3D] border border-[#F2D231]/30 text-[#D6F0E5] hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#123D32]/98 backdrop-blur-xl flex flex-col justify-between p-6 lg:hidden animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#1E5747]">
              <span className="text-xl font-serif-italic font-bold text-white">
                Faaiz<span className="text-[#F2D231]">Durrani</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-[#194C3D] text-slate-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col space-y-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="px-4 py-3 rounded-xl text-base font-medium text-[#D6F0E5] hover:text-[#F2D231] hover:bg-[#194C3D] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#1E5747]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApplication('Yearly VIP');
              }}
              className="w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider text-[#123D32] bg-[#F2D231] hover:bg-[#FFE873] rounded-xl shadow-[0_0_20px_rgba(242,210,49,0.3)]"
            >
              Get Membership Now
            </button>

            <div className="text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateAdmin();
                }}
                className="text-xs font-mono text-[#BFE5D5]/80 hover:text-[#F2D231]"
              >
                Portal Administrator Login &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
