import React, { useState, useEffect } from 'react';
import { initialSiteContent } from './data/initialContent';
import { SiteContent, MarketTickerData } from './types';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PerformanceSection } from './components/PerformanceSection';
import { MembershipPlans } from './components/MembershipPlans';
import { AiAnalystSection } from './components/AiAnalystSection';
import { WhyUsSection } from './components/WhyUsSection';
import { LiveMarketSection } from './components/LiveMarketSection';
import { FounderSection } from './components/FounderSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ApplicationModal } from './components/ApplicationModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Lock, Bot, Volume2, VolumeX } from 'lucide-react';
import { chatSound } from './utils/audio';

export default function App() {
  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [tickerData, setTickerData] = useState<MarketTickerData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadAnalysis, setHasUnreadAnalysis] = useState<boolean>(true);
  const [selectedPlanTier, setSelectedPlanTier] = useState('Core Foundation');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('faaiz_chat_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setHasUnreadAnalysis(false);
  };

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('faaiz_chat_sound_enabled', String(next));
      } catch (err) {
        console.warn('Could not persist sound preference:', err);
      }
      if (next) {
        chatSound.playPing('toggle');
      }
      return next;
    });
  };

  // Detect route on initial load and handle popstate
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path === '/admin' || hash === '#admin' || search.includes('view=admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('public');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Fetch initial content from backend API (with static hosting fallback)
  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json?.data) {
          setContent(json.data);
        }
      })
      .catch(() => {
        // Graceful fallback to initialSiteContent on static deployments (GitHub Pages)
      });
  }, []);

  // Check admin session status
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(json => {
        if (json?.authenticated) {
          setIsAdminAuthenticated(true);
        }
      })
      .catch(() => {});
  }, []);

  // Poll live market ticker every 8 seconds (with static simulation fallback)
  useEffect(() => {
    const fetchTicker = () => {
      fetch('/api/market/ticker')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.price) {
            setTickerData(data);
          }
        })
        .catch(() => {
          // Dynamic live ticker simulation for static hosts (GitHub Pages)
          setTickerData(prev => {
            const basePrice = prev?.price || 67482.50;
            const delta = (Math.random() - 0.48) * 14;
            const newPrice = parseFloat((basePrice + delta).toFixed(2));
            return {
              symbol: 'BTC/USDT',
              price: newPrice,
              change24h: 3.42,
              high24h: 68920.00,
              low24h: 65110.00,
              volume24h: '$2.84B',
              lastUpdated: new Date().toLocaleTimeString(),
              isLiveFeed: true
            };
          });
        });
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 8000);
    return () => clearInterval(interval);
  }, []);

  // Re-arm unread analysis update indicator periodically when chat is closed
  useEffect(() => {
    if (isChatOpen) return;
    const timer = setTimeout(() => {
      setHasUnreadAnalysis(true);
    }, 45000);
    return () => clearTimeout(timer);
  }, [isChatOpen]);

  // Active section scroll spy
  useEffect(() => {
    if (currentRoute !== 'public') return;

    const sections = ['hero', 'results', 'plans', 'why-us', 'live-chart', 'founder', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  // Route Navigation Handlers
  const navigateToAdmin = () => {
    setCurrentRoute('admin');
    window.history.pushState(null, '', '#admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    setCurrentRoute('public');
    const basePath = window.location.pathname.replace(/\/admin\/?$/, '') || window.location.pathname;
    window.history.pushState(null, '', basePath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApplication = (tier?: string) => {
    if (tier) setSelectedPlanTier(tier);
    setIsApplicationModalOpen(true);
  };

  // Render Admin View if on /admin
  if (currentRoute === 'admin') {
    if (isAdminAuthenticated) {
      return (
        <AdminDashboard
          initialContent={content}
          onContentUpdated={(updated) => setContent(updated)}
          onExitAdmin={navigateToPublic}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAdminAuthenticated(true)}
        onReturnToSite={navigateToPublic}
      />
    );
  }

  // Render Public Website
  return (
    <div className="min-h-screen bg-[#123D32] text-[#D6F0E5] selection:bg-[#F2D231]/30 selection:text-white relative font-sans">
      {/* 1. Preloader / Entry Experience */}
      {!preloaderDone && (
        <Preloader
          brandName={content.siteConfig.brandName}
          onComplete={() => setPreloaderDone(true)}
        />
      )}

      {/* 2. Sticky Navigation */}
      <Navbar
        brandName={content.siteConfig.brandName}
        logoText={content.siteConfig.logoText}
        primaryCtaText={content.navigation.primaryCtaText}
        primaryCtaLink={content.navigation.primaryCtaLink}
        links={content.navigation.links}
        activeSection={activeSection}
        tickerData={tickerData}
        onOpenApplication={handleOpenApplication}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* 3. Hero Section with Live Terminal Visual & Stats */}
      <Hero
        heroData={content.hero}
        tickerData={tickerData}
        onOpenApplication={handleOpenApplication}
      />

      {/* 4. Results / Performance Section with Top 3 Ranking & Table */}
      <PerformanceSection
        performanceData={content.performance}
      />

      {/* 5. Membership Plans with 3 Tiers (Monthly, Yearly, Lifetime) */}
      <MembershipPlans
        plansData={content.plans}
        onSelectPlan={(planName) => handleOpenApplication(planName)}
      />

      {/* 6. Interactive Gemini AI Analyst Terminal */}
      <AiAnalystSection
        brandName={content.siteConfig.brandName}
        onOpenApplication={handleOpenApplication}
      />

      {/* 7. Why Choose Us (The Difference) */}
      <WhyUsSection
        whyUsData={content.whyUs}
        onOpenApplication={handleOpenApplication}
      />

      {/* 8. Live Market Section (Candlestick / Line terminal) */}
      <LiveMarketSection
        liveChartData={content.liveChart}
        tickerData={tickerData}
        onRefreshTicker={() => {
          fetch('/api/market/ticker')
            .then(res => res.json())
            .then(data => data && setTickerData(data));
        }}
      />

      {/* 9. Founder & Trust Narrative (Faaiz Durrani) */}
      <FounderSection
        founderData={content.founder}
      />

      {/* 10. FAQ Section */}
      <FAQSection
        faqData={content.faq}
      />

      {/* 11. Final Call to Action & Global Footer */}
      <Footer
        footerData={content.footer}
        ctaData={content.ctaSection}
        brandName={content.siteConfig.brandName}
        onOpenApplication={() => handleOpenApplication('Yearly VIP')}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Multi-turn Gemini AI Chatbot Modal */}
      <GeminiChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        brandName={content.siteConfig.brandName}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Cohort Application / Contact Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        selectedTier={selectedPlanTier}
        brandName={content.siteConfig.brandName}
      />

      {/* Floating Gemini Chat Launcher & Audio Toggle Container */}
      <div 
        id="floating-chat-launcher-container"
        className="fixed bottom-4 right-16 sm:right-20 z-30 flex items-center gap-1.5"
      >
        <button
          id="floating-gemini-chat-btn"
          onClick={handleOpenChat}
          className={`relative group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F2D231] hover:bg-[#FFE873] active:bg-[#D4B22A] text-[#123D32] font-syne font-bold text-xs uppercase tracking-wider cursor-pointer border transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
            hasUnreadAnalysis && !isChatOpen
              ? 'animate-[pulse_2.2s_cubic-bezier(0.4,0,0.6,1)_infinite] ring-2 ring-[#F2D231]/60 ring-offset-2 ring-offset-[#071f19] shadow-[0_0_22px_rgba(242,210,49,0.55)] border-white/80 opacity-100 hover:border-white hover:opacity-100'
              : 'border-white/30 hover:border-white opacity-90 hover:opacity-100 shadow-[0_8px_25px_rgba(242,210,49,0.35)] hover:shadow-[0_10px_30px_rgba(242,210,49,0.55)]'
          }`}
          title={hasUnreadAnalysis && !isChatOpen ? "Ask Faaiz AI (New analysis update available)" : "Ask Faaiz AI Market Assistant"}
          aria-label={hasUnreadAnalysis && !isChatOpen ? "Ask Faaiz AI - New analysis update available" : "Open Gemini AI Assistant"}
        >
          {/* Subtle pulse radar badge when unread or pending analysis update exists */}
          {hasUnreadAnalysis && !isChatOpen && (
            <span 
              id="unread-analysis-pulse-badge"
              className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none"
              title="Pending analysis update"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2D231] opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F2D231] border border-[#0d2e26]" />
            </span>
          )}

          <Bot className="w-4 h-4 text-[#123D32] group-hover:scale-110 transition-transform duration-200" />
          <span className="hidden sm:inline">Ask Faaiz AI</span>
          <span 
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              hasUnreadAnalysis && !isChatOpen 
                ? 'bg-emerald-600 animate-ping' 
                : 'bg-emerald-700 animate-pulse'
            }`} 
          />
        </button>

        {/* Subtle Mute / Unmute Sound Effects Toggle */}
        <button
          id="chat-sound-toggle-btn"
          type="button"
          onClick={handleToggleSound}
          className={`p-2 rounded-full border backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.3)] cursor-pointer flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
            isSoundEnabled
              ? 'bg-[#123D32]/90 hover:bg-[#194C3D] text-[#F2D231] border-[#F2D231]/40 hover:border-[#F2D231] opacity-85 hover:opacity-100 shadow-[0_0_12px_rgba(242,210,49,0.15)]'
              : 'bg-[#0a231d]/90 hover:bg-[#123D32] text-gray-400 hover:text-gray-200 border-white/15 hover:border-[#F2D231]/60 opacity-75 hover:opacity-100'
          }`}
          title={isSoundEnabled ? "Mute chat notification pings" : "Unmute chat notification pings"}
          aria-label={isSoundEnabled ? "Mute chat sound effects" : "Unmute chat sound effects"}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Discreet floating admin key pill (bottom right edge) */}
      <aside aria-label="Portal administration access" className="fixed bottom-4 right-4 z-30">
        <button
          id="floating-admin-btn"
          onClick={navigateToAdmin}
          className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#194C3D]/90 hover:bg-[#1E5747] border border-[#F2D231]/30 hover:border-[#F2D231] text-[10px] font-spacemono text-[#BFE5D5] hover:text-[#F2D231] backdrop-blur-md transition-all duration-200 shadow-lg cursor-pointer"
          title="Open Admin Management Portal"
          aria-label="Admin login"
        >
          <Lock className="w-3 h-3 text-[#F2D231] group-hover:scale-110 transition-transform" />
          <span className="hidden group-hover:inline transition-opacity duration-200">
            Admin Portal
          </span>
        </button>
      </aside>
    </div>
  );
}
