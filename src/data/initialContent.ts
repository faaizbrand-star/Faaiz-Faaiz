import { SiteContent } from '../types';

export const initialSiteContent: SiteContent = {
  siteConfig: {
    brandName: "FaaizDurrani",
    logoText: "FaaizDurrani",
    brandTagline: "Crypto & Trading Education",
    accentColor: "#F2D231",
    isPublished: true,
    contactEmail: "support@faaizdurrani.net",
    lastUpdated: new Date().toISOString(),
    isLive: true,
  },
  navigation: {
    links: [
      { label: "Home", href: "#hero" },
      { label: "Results", href: "#results" },
      { label: "Plans", href: "#membership" },
      { label: "Why Us", href: "#why-us" },
      { label: "Live Chart", href: "#live-chart" },
      { label: "About", href: "#founder" },
      { label: "FAQ", href: "#faq" }
    ],
    primaryCtaText: "Get Membership",
    primaryCtaLink: "#membership"
  },
  hero: {
    eyebrow: "Pakistan's Real Crypto Educator",
    headlinePart1: "Learn To Trade ",
    headlinePart2: "Smart. Not Blind.",
    subheadline: "No fake promises. No overnight millionaire talk. Real crypto education, live signals, and honest market analysis — from someone who has been in the trenches.",
    ctaPrimaryText: "Get Membership",
    ctaPrimaryLink: "#membership",
    ctaSecondaryText: "Buy USDT (P2P)",
    ctaSecondaryLink: "#live-chart",
    stats: [
      { id: "stat-1", value: "3+", label: "Years Trading", subtext: "Live market experience" },
      { id: "stat-2", value: "500+", label: "Members", subtext: "Active in private room" },
      { id: "stat-3", value: "Daily", label: "Signals & Updates", subtext: "Actionable macro analysis" },
      { id: "stat-4", value: "Real", label: "No Fake Calls", subtext: "Zero hype or 100x scams" }
    ]
  },
  performance: {
    badge: "Real Results, No Leverage",
    headline: "Spot Performance & Closed Signals",
    subheadline: "Real verifiable spot trades with transparent entries and profit-taking targets.",
    summaryHeadline: "My Last 30 Days — Spot Returns",
    summaryDescription: "Spot returns only — no leverage used. Past performance doesn't guarantee future results.",
    winRateEstimate: "✓ 12/12 Assets Green",
    avgRiskReward: "1:3.6",
    avgRiskRewardRatio: "1:3.6",
    disclaimerText: "Past performance does not guarantee future results. Spot-only positions.",
    assets: [
      {
        id: "perf-1",
        symbol: "SNDK",
        name: "Spot Breakout Accumulation",
        entryPrice: 0.22,
        exitPrice: 0.40,
        returnPct: 81.82,
        holdingPeriod: "18 Days",
        timeframe: "Swing Spot",
        thesis: "High timeframe resistance break retest with parabolic volume profile expansion.",
        date: "2026-08-28",
        rank: 1,
        isRankedTop3: true,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-2",
        symbol: "AAVE",
        name: "DeFi Liquidity Surge",
        entryPrice: 148.00,
        exitPrice: 234.00,
        returnPct: 58.06,
        holdingPeriod: "26 Days",
        timeframe: "Macro Swing",
        thesis: "Supply contraction on centralized exchanges with institutional DeFi protocol fee yield expansion.",
        date: "2026-08-15",
        rank: 2,
        isRankedTop3: true,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-3",
        symbol: "ETH",
        name: "Spot Ethereum Momentum",
        entryPrice: 2420.00,
        exitPrice: 3674.00,
        returnPct: 51.82,
        holdingPeriod: "34 Days",
        timeframe: "High Timeframe",
        thesis: "Institutional ETF inflows with clean re-accumulation above $2,400 pivot zone.",
        date: "2026-08-01",
        rank: 3,
        isRankedTop3: true,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-4",
        symbol: "LINK",
        name: "Oracle Infrastructure Spot",
        entryPrice: 11.20,
        exitPrice: 16.00,
        returnPct: 42.86,
        holdingPeriod: "14 Days",
        timeframe: "Daily",
        thesis: "Cross-chain interoperability protocol adoption and accumulation zone defense.",
        date: "2026-08-20",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-5",
        symbol: "SOL",
        name: "Ecosystem Liquidity Flow",
        entryPrice: 132.00,
        exitPrice: 187.00,
        returnPct: 41.67,
        holdingPeriod: "16 Days",
        timeframe: "4H Swing",
        thesis: "Bullish divergence at $130 support followed by multi-day volume expansion.",
        date: "2026-08-10",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-6",
        symbol: "ENA",
        name: "Synthetic Dollar Spot Call",
        entryPrice: 0.30,
        exitPrice: 0.422,
        returnPct: 40.67,
        holdingPeriod: "12 Days",
        timeframe: "Daily",
        thesis: "Key liquidity grab and reclaim of value area low.",
        date: "2026-08-18",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-7",
        symbol: "HYPE",
        name: "Perp DEX Momentum",
        entryPrice: 13.00,
        exitPrice: 18.00,
        returnPct: 38.46,
        holdingPeriod: "9 Days",
        timeframe: "4H",
        thesis: "Record platform trading fees and token velocity surge.",
        date: "2026-08-22",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-8",
        symbol: "MSTR",
        name: "Treasury Proxy Spot",
        entryPrice: 226.00,
        exitPrice: 305.00,
        returnPct: 34.94,
        holdingPeriod: "21 Days",
        timeframe: "Macro Swing",
        thesis: "Bitcoin balance sheet accumulation and equity premium expansion.",
        date: "2026-08-05",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-9",
        symbol: "OIL",
        name: "Commodity Macro Swing",
        entryPrice: 68.00,
        exitPrice: 85.00,
        returnPct: 25.00,
        holdingPeriod: "28 Days",
        timeframe: "Weekly",
        thesis: "Geopolitical risk premium and global inventory drawdown.",
        date: "2026-08-02",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-10",
        symbol: "BTC",
        name: "Bitcoin Core Spot Hold",
        entryPrice: 56200.00,
        exitPrice: 69180.00,
        returnPct: 23.10,
        holdingPeriod: "40 Days",
        timeframe: "Macro Swing",
        thesis: "Halving cycle supply shock and long-term holder accumulation floor.",
        date: "2026-07-25",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-11",
        symbol: "XAG",
        name: "Silver Spot Accumulation",
        entryPrice: 28.00,
        exitPrice: 34.00,
        returnPct: 21.43,
        holdingPeriod: "32 Days",
        timeframe: "Weekly Swing",
        thesis: "Monetary debasement hedge and industrial green-energy demand surge.",
        date: "2026-07-28",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      },
      {
        id: "perf-12",
        symbol: "GOLD",
        name: "Gold All-Time High Run",
        entryPrice: 2380.00,
        exitPrice: 2691.00,
        returnPct: 13.07,
        holdingPeriod: "45 Days",
        timeframe: "Macro Trend",
        thesis: "Central bank sovereign reserve buying and structural de-dollarization.",
        date: "2026-07-15",
        isRankedTop3: false,
        isSamplePlaceholder: false,
        status: "closed"
      }
    ]
  },
  plans: {
    badge: "Choose Your Plan",
    headline: "Membership Plans",
    subheadline: "Three ways to join. Pick the level that fits your trading journey.",
    quarterlyDiscountPercent: 40,
    disclaimerText: "All payments are non-refundable. Education and analysis room access only.",
    disclaimer: "All payments are non-refundable. Education and analysis room access only.",
    items: [
      {
        id: "monthly",
        name: "Monthly VIP",
        monthlyPrice: 99,
        quarterlyPrice: 249,
        period: "per month",
        tag: "CORE",
        description: "Essential spot signals, weekly market updates, and access to private community.",
        features: [
          "Daily Spot Trading Signals",
          "Market Reasoning with Every Call",
          "VIP Telegram Group Access",
          "Weekly Macro Video Breakdown",
          "Beginner Onboarding Risk Guide"
        ],
        isFeatured: false,
        isPopular: false,
        bestFor: "Traders testing our disciplined spot methodology"
      },
      {
        id: "yearly",
        name: "Yearly VIP",
        monthlyPrice: 49,
        quarterlyPrice: 499,
        period: "per year",
        tag: "BEST VALUE",
        badge: "SAVE 40%",
        description: "Our most popular track. Complete education, quantum setups, and deep market psychology.",
        features: [
          "Everything in Monthly VIP",
          "Full Crypto Mastery Video Vault",
          "Calculus & Order Flow Strategy Pack",
          "Priority 1-on-1 Portfolio Reviews",
          "Exclusive Direct Weekly AMA with Faaiz",
          "Curated Trading Books & PDFs Library"
        ],
        isFeatured: true,
        isPopular: true,
        bestFor: "Serious traders looking to master independent market analysis"
      },
      {
        id: "lifetime",
        name: "Lifetime Access",
        monthlyPrice: 999,
        quarterlyPrice: 999,
        period: "one-time",
        tag: "ELITE",
        badge: "VIP ELITE",
        description: "Permanent brotherhood access. Never pay a subscription fee again.",
        features: [
          "Lifetime Access to All Future Updates",
          "Direct Private WhatsApp / Telegram with Faaiz",
          "Quantum Trading Masterclass Series",
          "Real-Time Live Trade Execution Screen Shares",
          "Private Inner-Circle Masterminds",
          "Free Access to All Future Tools & Indicators"
        ],
        isFeatured: false,
        isPopular: false,
        bestFor: "High-capital operators committed for the long haul"
      }
    ]
  },
  whyUs: {
    badge: "The Difference",
    headline: "Why Choose This?",
    subheadline: "Join hundreds of traders who choose real education over hype.",
    cards: [
      {
        id: "why-1",
        title: "No Fake Signals",
        description: "Every signal comes with reasoning. I teach you why — not just what.",
        iconName: "Ban",
        keyPillar: "REASONING FIRST"
      },
      {
        id: "why-2",
        title: "Brutal Honesty",
        description: "No hype. No '100x your money' nonsense. Just facts that matter.",
        iconName: "ShieldAlert",
        keyPillar: "ZERO ILLUSION"
      },
      {
        id: "why-3",
        title: "Spot-First Philosophy",
        description: "We focus on spot positions and real market structure before any leverage. Real capital preservation beats gambling liquidations.",
        iconName: "Layers",
        keyPillar: "ZERO LIQUIDATION"
      },
      {
        id: "why-4",
        title: "Calculus & Calculation Trading",
        description: "Mathematical setups, Fibonacci confluence, and liquidity dynamics rather than guessing or trusting Twitter moonboys.",
        iconName: "Compass",
        keyPillar: "DATA DRIVEN"
      }
    ]
  },
  liveChart: {
    badge: "QUANTITATIVE MARKET FEED",
    headline: "Live BTC/USDT Terminal",
    subheadline: "Real-time liquidity and high-timeframe order flow analysis directly from the market.",
    instrument: "BTC/USDT Perp",
    defaultTimeframe: "4H",
    disclaimer: "Live data streamed from Binance Public Oracle. Price updates automatically."
  },
  founder: {
    badge: "Pakistan's Real Crypto Educator",
    name: "Faaiz Durrani",
    title: "Lead Market Analyst & Strategist",
    headline: "Honest Market Analysis From The Trenches.",
    bioParagraph1: "I didn't get into crypto because of hype or overnight dreams. I spent years in the charts learning market psychology, order flow dynamics, and the brutal truth about retail liquidations.",
    bioParagraph2: "Most crypto channels sell illusions and take referral commissions while their followers get liquidated. My mission with FaaizDurrani is simple: teach you the exact math, spot accumulation tactics, and risk protocols to survive and profit consistently.",
    philosophyQuote: "If a signal doesn't teach you why the trade was taken, it's not education — it's gambling. I don't give you fish; I teach you to read the ocean.",
    avatarUrl: "/founder-avatar.png",
    experienceYears: "3+ Years Active",
    credentials: [
      "Top Verified Creator on Binance Square",
      "Over 50,000+ Followers Across Public Channels",
      "Specialist in High-Timeframe Spot Accumulation",
      "Author of Calculus-Based Trading Frameworks"
    ],
    socials: [
      { platform: "Binance Square", handle: "@Faaizdurranicrypto", url: "https://www.binance.com/en/square" },
      { platform: "Telegram", handle: "@faaizdurranicrypto", url: "https://t.me/faaizdurranicrypto" },
      { platform: "YouTube", handle: "@FaaizDurrani", url: "https://youtube.com/@FaaizDurrani" },
      { platform: "Instagram", handle: "@faaizdurrani", url: "https://instagram.com/faaizdurrani" }
    ]
  },
  faq: {
    badge: "TRANSPARENT CLARITY",
    headline: "Frequently Asked Questions",
    subheadline: "Straight answers to the questions we hear most from new traders.",
    items: [
      {
        id: "faq-1",
        category: "General",
        question: "Is this suitable for complete beginners?",
        answer: "Yes. Our core curriculum covers everything from chart basics, spot accumulation, and wallet security to advanced order flow. We explain the 'why' behind every concept in plain Urdu and English."
      },
      {
        id: "faq-2",
        category: "Risk & Philosophy",
        question: "Do you focus on high-leverage futures?",
        answer: "No. We prioritize spot trading and high-timeframe macro setups. Reckless 50x or 100x leverage is the number one reason 95% of retail traders lose their entire savings. We focus on spot returns with zero liquidation risk."
      },
      {
        id: "faq-3",
        category: "Risk & Philosophy",
        question: "Can you guarantee that I will become a millionaire?",
        answer: "No. Anyone promising guaranteed riches in crypto is lying to you. Trading involves financial risk. We teach disciplined risk management, statistical edge, and emotional mastery so you can manage your own capital professionally."
      },
      {
        id: "faq-4",
        category: "Membership",
        question: "How do I receive the daily signals and updates?",
        answer: "Immediately upon enrollment, you are added to our private VIP Telegram group where Faaiz posts daily charts, entry/exit levels, video breakdowns, and real-time market commentary."
      },
      {
        id: "faq-5",
        category: "Curriculum",
        question: "What is 'Calculus & Calculation-Based Trading'?",
        answer: "It is Faaiz's proprietary methodology that applies mathematical rate of change, volume profiling, and liquidity confluence to identify high-probability reversal points before they happen on retail indicators."
      },
      {
        id: "faq-6",
        category: "Membership",
        question: "What payment methods do you accept?",
        answer: "We accept USDT (TRC20, BEP20), Binance Pay, and standard local P2P transfer methods for members in Pakistan and worldwide."
      }
    ]
  },
  ctaSection: {
    headline: "Stop Guessing. Start Trading With A Real Process.",
    subheadline: "Join hundreds of traders who choose real education, honest spot analysis, and disciplined risk management over hype.",
    buttonText: "Get Membership Now",
    buttonLink: "#membership",
    secondaryNote: "Instant VIP Telegram Onboarding • Spot-First Capital Preservation"
  },
  footer: {
    copyrightText: "© 2026 FaaizDurrani. All rights reserved.",
    riskDisclaimer: "Trading cryptocurrencies, commodities, and financial instruments involves substantial risk of loss and is not suitable for every investor. You can lose all of your invested capital. Do not trade with money you cannot afford to lose.",
    educationalNotice: "All commentary, trade ideas, signals, and curriculum distributed through FaaizDurrani are for informational and educational purposes only and do not constitute financial, investment, legal, or tax advice.",
    socialLinks: [
      { platform: "Binance Square", url: "https://www.binance.com/en/square", handle: "@FaaizDurrani" },
      { platform: "Telegram", url: "https://t.me/faaizdurranicrypto", handle: "@faaizdurranicrypto" },
      { platform: "YouTube", url: "https://youtube.com", handle: "Faaiz Durrani" },
      { platform: "Instagram", url: "https://instagram.com", handle: "@faaizdurrani" }
    ]
  }
};
