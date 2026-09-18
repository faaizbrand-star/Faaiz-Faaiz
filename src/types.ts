export interface StatItem {
  id: string;
  value: string;
  label: string;
  subtext?: string;
}

export interface PerformanceAsset {
  id: string;
  symbol: string;
  name: string;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
  holdingPeriod: string;
  timeframe: string;
  thesis: string;
  date: string;
  isRankedTop3: boolean;
  rank?: number;
  isSamplePlaceholder: boolean;
  status: 'closed' | 'open' | 'invalidated';
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  tag?: string;
  tagline?: string;
  description?: string;
  period?: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  billingPeriodText?: string;
  features: string[];
  bestFor: string;
  ctaText?: string;
  ctaLink?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export type PlanItem = PricingPlan;

export interface WhyUsCard {
  id: string;
  iconName: string;
  title: string;
  description: string;
  keyPillar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Curriculum' | 'Risk & Philosophy' | 'Membership';
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface MarketTickerData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  lastUpdated: string;
  isLiveFeed: boolean;
}

export interface SiteContent {
  siteConfig: {
    brandName: string;
    brandTagline: string;
    logoText: string;
    accentColor: string;
    isPublished: boolean;
    isLive?: boolean;
    lastUpdated: string;
    contactEmail?: string;
  };
  navigation: {
    primaryCtaText: string;
    primaryCtaLink: string;
    links: Array<{ label: string; href: string }>;
  };
  hero: {
    eyebrow: string;
    headlinePart1: string;
    headlinePart2: string;
    subheadline: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    terminalAsset?: string;
    stats: StatItem[];
  };
  performance: {
    badge: string;
    headline: string;
    subheadline: string;
    summaryHeadline: string;
    summaryDescription: string;
    winRateEstimate: string;
    avgRiskReward: string;
    avgRiskRewardRatio?: string;
    disclaimerText: string;
    assets: PerformanceAsset[];
  };
  plans: {
    badge: string;
    headline: string;
    subheadline: string;
    quarterlyDiscountPercent: number;
    disclaimerText: string;
    disclaimer?: string;
    items: PricingPlan[];
  };
  whyUs: {
    badge: string;
    headline: string;
    subheadline: string;
    cards: WhyUsCard[];
  };
  liveChart: {
    badge: string;
    headline: string;
    subheadline: string;
    instrument: string;
    enableLiveFeed?: boolean;
    defaultTimeframe: string;
    disclaimer: string;
  };
  founder: {
    badge: string;
    headline: string;
    name: string;
    title: string;
    bioParagraph1: string;
    bioParagraph2: string;
    philosophyQuote: string;
    avatarUrl: string;
    avatarAlt?: string;
    experienceYears: string;
    credentials: string[];
    socials: SocialLink[];
  };
  faq: {
    badge: string;
    headline: string;
    subheadline: string;
    items: FAQItem[];
  };
  ctaSection: {
    headline: string;
    subheadline: string;
    buttonText: string;
    buttonLink?: string;
    secondaryNote: string;
  };
  footer: {
    riskDisclaimer: string;
    educationalNotice: string;
    copyrightText: string;
    socialLinks: SocialLink[];
  };
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  experience: string;
  tier: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'contacted';
}

export type ChatRoleType = 'mentor' | 'quant' | 'explainer';
export type TaskComplexity = 'fast' | 'general' | 'complex';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  roleId?: string;
  isError?: boolean;
  isFallback?: boolean;
}

export type TradeOutcome = 'win' | 'loss' | 'breakeven' | 'open';
export type EmotionalState = 'disciplined' | 'hesitant' | 'fomo' | 'anxious' | 'confident';

export interface TradeJournalEntry {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  setupType: string;
  emotionalState: EmotionalState;
  outcome: TradeOutcome;
  entryPrice?: number;
  exitPrice?: number;
  pnl?: number;
  notes?: string;
  timestamp: string;
}

export type VipPostType = 'spot_signal' | 'alpha_alert' | 'market_update' | 'risk_warning';
export type VipPostStatus = 'active' | 'hit_target' | 'closed' | 'invalidated';
export type VipTradeDirection = 'SPOT ACCUMULATION' | 'LONG' | 'SHORT';

export interface VipPost {
  id: string;
  title: string;
  symbol: string;
  type: VipPostType;
  status: VipPostStatus;
  direction?: VipTradeDirection;
  timeframe?: string;
  entryRange?: string;
  target1?: string;
  target2?: string;
  stopLoss?: string;
  riskReward?: string;
  content: string;
  chartUrl?: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt?: string;
  author: string;
  isLocked?: boolean;
}

