import React, { useState } from 'react';
import {
  Terminal, Save, RotateCcw, LogOut, Eye, CheckCircle2, AlertCircle,
  BarChart2, Users, Layers, ShieldCheck, HelpCircle, FileText, Globe,
  Plus, Trash2, Edit3, ArrowLeft, Activity, Radio
} from 'lucide-react';
import { SiteContent, PerformanceAsset, PricingPlan, FAQItem } from '../../types';

interface AdminDashboardProps {
  initialContent: SiteContent;
  onContentUpdated: (updated: SiteContent) => void;
  onExitAdmin: () => void;
}

type TabType =
  | 'overview'
  | 'hero'
  | 'stats'
  | 'performance'
  | 'plans'
  | 'whyUs'
  | 'liveChart'
  | 'founder'
  | 'faq'
  | 'footer';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialContent,
  onContentUpdated,
  onExitAdmin
}) => {
  const [content, setContent] = useState<SiteContent>(JSON.parse(JSON.stringify(initialContent)));
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Performance modal / new asset state
  const [editingAsset, setEditingAsset] = useState<PerformanceAsset | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // FAQ modal / new item state
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Save to Server
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        onContentUpdated(data.data);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to save updates.');
      }
    } catch (err: any) {
      setErrorMessage('Network error while persisting updates.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset all content back to original sample data? Any custom edits will be replaced.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent(data.data);
        onContentUpdated(data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to reset content.');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      onExitAdmin();
    }
  };

  // Tab definitions
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'hero', label: 'Hero & Branding', icon: Terminal },
    { id: 'stats', label: 'Statistics', icon: BarChart2 },
    { id: 'performance', label: 'Performance / Results', icon: Activity },
    { id: 'plans', label: 'Membership Plans', icon: Users },
    { id: 'whyUs', label: 'Four Pillars (Why Us)', icon: Layers },
    { id: 'liveChart', label: 'Live Market Terminal', icon: Radio },
    { id: 'founder', label: 'Founder Narrative', icon: ShieldCheck },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'footer', label: 'Footer & Disclaimer', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#040711] text-slate-200 flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060b18] border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onExitAdmin}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Return to public site"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white font-mono uppercase tracking-wider">
                PORTAL ADMIN CONSOLE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ROLE: ADMINISTRATOR
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Editing: <span className="text-slate-200 font-semibold">{content.siteConfig.brandName}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400 hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            id="admin-save-button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Save feedback banner */}
      {saveSuccess && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Changes persisted and deployed to public storefront.
          </span>
          <span>Last Updated: {new Date(content.siteConfig.lastUpdated).toLocaleTimeString()}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-2.5 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Admin Layout: Sidebar Tabs + Content Canvas */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-20 rounded-2xl bg-[#060b18] border border-slate-800 p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              Site Modules
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Tab Content Panel */}
        <main className="flex-1 rounded-2xl bg-[#060b18] border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  System Overview & Publication
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage core metadata, site visibility, and quick actions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">PUBLISH STATUS</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Live & Public
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">ACTIVE RESULTS</div>
                  <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                    {content.performance.assets.length} Case Studies
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">MEMBERSHIP PLANS</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">
                    {content.plans.items.length} Tiers Configured
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  Site Identity Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={content.siteConfig.brandName}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteConfig: { ...content.siteConfig, brandName: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Short Brand Tagline</label>
                    <input
                      type="text"
                      value={content.siteConfig.brandTagline}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteConfig: { ...content.siteConfig, brandTagline: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Hero Section & CTAs
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the above-the-fold headline, supporting copy, and action buttons.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Eyebrow Badge Text</label>
                  <input
                    type="text"
                    value={content.hero.eyebrow}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Headline Part 1</label>
                    <input
                      type="text"
                      value={content.hero.headlinePart1}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, headlinePart1: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Headline Part 2 (Glow text)</label>
                    <input
                      type="text"
                      value={content.hero.headlinePart2}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, headlinePart2: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Subheadline / Supporting Copy</label>
                  <textarea
                    rows={3}
                    value={content.hero.subheadline}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={content.hero.ctaPrimaryText}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, ctaPrimaryText: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      value={content.hero.ctaSecondaryText}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, ctaSecondaryText: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Credibility Statistics
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Edit the 4 highlighted metrics displayed under the hero section.
                </p>
              </div>

              <div className="space-y-4">
                {content.hero.stats.map((stat, idx) => (
                  <div key={stat.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <label className="block text-slate-400 uppercase mb-1">Stat Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...content.hero.stats];
                          newStats[idx].value = e.target.value;
                          setContent({ ...content, hero: { ...content.hero, stats: newStats } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.hero.stats];
                          newStats[idx].label = e.target.value;
                          setContent({ ...content, hero: { ...content.hero, stats: newStats } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase mb-1">Subtext / Context</label>
                      <input
                        type="text"
                        value={stat.subtext || ''}
                        onChange={(e) => {
                          const newStats = [...content.hero.stats];
                          newStats[idx].subtext = e.target.value;
                          setContent({ ...content, hero: { ...content.hero, stats: newStats } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PERFORMANCE / RESULTS */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white font-mono uppercase">
                    Performance & Results Manager
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage the 8–12 spot market case studies, rankings, and sample badges.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAsset({
                      id: 'perf-' + Date.now(),
                      symbol: 'BTC/USDT',
                      name: 'Spot Accumulation',
                      entryPrice: 62000,
                      exitPrice: 68500,
                      returnPct: 10.5,
                      holdingPeriod: '14 Days',
                      timeframe: 'Daily Swing',
                      thesis: 'High timeframe support bounce with volume profile expansion.',
                      date: new Date().toISOString().split('T')[0],
                      isRankedTop3: false,
                      isSamplePlaceholder: true,
                      status: 'closed'
                    });
                    setIsAssetModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Case Study</span>
                </button>
              </div>

              {/* Performance Summary Text Fields */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Summary Headline</label>
                    <input
                      type="text"
                      value={content.performance.summaryHeadline}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          performance: { ...content.performance, summaryHeadline: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Win Rate Label</label>
                    <input
                      type="text"
                      value={content.performance.winRateEstimate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          performance: { ...content.performance, winRateEstimate: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Assets List */}
              <div className="space-y-2">
                {content.performance.assets.map((asset, idx) => (
                  <div
                    key={asset.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center font-bold ${
                        asset.isRankedTop3 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{asset.rank || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{asset.symbol}</span>
                          <span className={asset.returnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {asset.returnPct >= 0 ? '+' : ''}{asset.returnPct}%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{asset.name} &bull; {asset.holdingPeriod}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newAssets = [...content.performance.assets];
                          newAssets[idx].isRankedTop3 = !newAssets[idx].isRankedTop3;
                          setContent({ ...content, performance: { ...content.performance, assets: newAssets } });
                        }}
                        className={`px-2 py-1 rounded text-[10px] ${
                          asset.isRankedTop3 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {asset.isRankedTop3 ? '★ Top 3' : 'Standard'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingAsset(asset);
                          setIsAssetModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          const newAssets = content.performance.assets.filter(a => a.id !== asset.id);
                          setContent({ ...content, performance: { ...content.performance, assets: newAssets } });
                        }}
                        className="p-1.5 rounded bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MEMBERSHIP PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Membership Plans & Pricing
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust plan pricing, features checklist, and quarterly savings discount.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono">
                <label className="block text-slate-400 uppercase mb-1">Quarterly Discount Percentage</label>
                <input
                  type="number"
                  value={content.plans.quarterlyDiscountPercent}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      plans: { ...content.plans, quarterlyDiscountPercent: parseInt(e.target.value) || 0 }
                    })
                  }
                  className="w-32 px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-6">
                {content.plans.items.map((plan, pIdx) => (
                  <div key={plan.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs font-mono">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="font-bold text-white text-sm">{plan.name}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.isFeatured || plan.isPopular}
                          onChange={(e) => {
                            const newItems = [...content.plans.items];
                            newItems[pIdx].isFeatured = e.target.checked;
                            newItems[pIdx].isPopular = e.target.checked;
                            setContent({ ...content, plans: { ...content.plans, items: newItems } });
                          }}
                        />
                        <span className="text-cyan-400">Featured / Popular Badge</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 uppercase mb-1">Tier Name</label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => {
                            const newItems = [...content.plans.items];
                            newItems[pIdx].name = e.target.value;
                            setContent({ ...content, plans: { ...content.plans, items: newItems } });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 uppercase mb-1">Monthly Price ($)</label>
                        <input
                          type="number"
                          value={plan.monthlyPrice}
                          onChange={(e) => {
                            const newItems = [...content.plans.items];
                            newItems[pIdx].monthlyPrice = parseFloat(e.target.value) || 0;
                            setContent({ ...content, plans: { ...content.plans, items: newItems } });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 uppercase mb-1">Quarterly Price ($)</label>
                        <input
                          type="number"
                          value={plan.quarterlyPrice}
                          onChange={(e) => {
                            const newItems = [...content.plans.items];
                            newItems[pIdx].quarterlyPrice = parseFloat(e.target.value) || 0;
                            setContent({ ...content, plans: { ...content.plans, items: newItems } });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase mb-1">Best For Target</label>
                      <input
                        type="text"
                        value={plan.bestFor}
                        onChange={(e) => {
                          const newItems = [...content.plans.items];
                          newItems[pIdx].bestFor = e.target.value;
                          setContent({ ...content, plans: { ...content.plans, items: newItems } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WHY CHOOSE US */}
          {activeTab === 'whyUs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Four Pillars (Why Choose Us)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the core philosophical tenets displayed in the editorial cards.
                </p>
              </div>

              <div className="space-y-4">
                {content.whyUs.cards.map((card, cIdx) => (
                  <div key={card.id || cIdx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 uppercase mb-1">Card Title</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const newCards = [...content.whyUs.cards];
                            newCards[cIdx].title = e.target.value;
                            setContent({ ...content, whyUs: { ...content.whyUs, cards: newCards } });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 uppercase mb-1">Pillar Tag</label>
                        <input
                          type="text"
                          value={card.keyPillar}
                          onChange={(e) => {
                            const newCards = [...content.whyUs.cards];
                            newCards[cIdx].keyPillar = e.target.value;
                            setContent({ ...content, whyUs: { ...content.whyUs, cards: newCards } });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-cyan-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => {
                          const newCards = [...content.whyUs.cards];
                          newCards[cIdx].description = e.target.value;
                          setContent({ ...content, whyUs: { ...content.whyUs, cards: newCards } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LIVE CHART */}
          {activeTab === 'liveChart' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Live Market Terminal Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure ticker instrument symbols and live oracle feed status.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Instrument Display Label</label>
                    <input
                      type="text"
                      value={content.liveChart.instrument}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          liveChart: { ...content.liveChart, instrument: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Default Timeframe</label>
                    <input
                      type="text"
                      value={content.liveChart.defaultTimeframe}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          liveChart: { ...content.liveChart, defaultTimeframe: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Feed Status / Disclaimer Note</label>
                  <input
                    type="text"
                    value={content.liveChart.disclaimer}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        liveChart: { ...content.liveChart, disclaimer: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOUNDER */}
          {activeTab === 'founder' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Founder Profile & Narrative
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the strategist bio, credentials, philosophy quote, and avatar.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Founder Name</label>
                    <input
                      type="text"
                      value={content.founder.name}
                      onChange={(e) =>
                        setContent({ ...content, founder: { ...content.founder, name: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Title / Designation</label>
                    <input
                      type="text"
                      value={content.founder.title}
                      onChange={(e) =>
                        setContent({ ...content, founder: { ...content.founder, title: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Bio Paragraph 1</label>
                  <textarea
                    rows={3}
                    value={content.founder.bioParagraph1}
                    onChange={(e) =>
                      setContent({ ...content, founder: { ...content.founder, bioParagraph1: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Bio Paragraph 2</label>
                  <textarea
                    rows={3}
                    value={content.founder.bioParagraph2}
                    onChange={(e) =>
                      setContent({ ...content, founder: { ...content.founder, bioParagraph2: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Direct Philosophy Quote</label>
                  <textarea
                    rows={2}
                    value={content.founder.philosophyQuote}
                    onChange={(e) =>
                      setContent({ ...content, founder: { ...content.founder, philosophyQuote: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-cyan-300 italic"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white font-mono uppercase">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage the accordion questions, answers, and category tags.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq({
                      id: 'faq-' + Date.now(),
                      category: 'General',
                      question: 'New Question Title',
                      answer: 'Detailed explanation text goes here...'
                    });
                    setIsFaqModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {content.faq.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{item.question}</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed text-xs">{item.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingFaq(item);
                          setIsFaqModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const newItems = content.faq.items.filter((_, i) => i !== idx);
                          setContent({ ...content, faq: { ...content.faq, items: newItems } });
                        }}
                        className="p-1.5 rounded bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FOOTER */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-mono uppercase">
                  Footer & Legal Disclaimers
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the statutory risk warnings and educational disclosures.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Copyright Notice</label>
                  <input
                    type="text"
                    value={content.footer.copyrightText}
                    onChange={(e) =>
                      setContent({ ...content, footer: { ...content.footer, copyrightText: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Risk Disclaimer Text</label>
                  <textarea
                    rows={4}
                    value={content.footer.riskDisclaimer}
                    onChange={(e) =>
                      setContent({ ...content, footer: { ...content.footer, riskDisclaimer: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Educational Scope Notice</label>
                  <textarea
                    rows={3}
                    value={content.footer.educationalNotice}
                    onChange={(e) =>
                      setContent({ ...content, footer: { ...content.footer, educationalNotice: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Edit/Add Performance Asset */}
      {isAssetModalOpen && editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#060b18] border border-slate-800 p-6 shadow-2xl text-slate-200 text-xs font-mono">
            <h3 className="text-base font-bold text-white mb-4 uppercase">
              {content.performance.assets.some(a => a.id === editingAsset.id) ? 'Edit Case Study' : 'New Spot Case Study'}
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pair / Symbol</label>
                  <input
                    type="text"
                    value={editingAsset.symbol}
                    onChange={(e) => setEditingAsset({ ...editingAsset, symbol: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Return %</label>
                  <input
                    type="number"
                    value={editingAsset.returnPct}
                    onChange={(e) => setEditingAsset({ ...editingAsset, returnPct: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descriptive Setup Name</label>
                <input
                  type="text"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Entry ($)</label>
                  <input
                    type="number"
                    value={editingAsset.entryPrice}
                    onChange={(e) => setEditingAsset({ ...editingAsset, entryPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Exit ($)</label>
                  <input
                    type="number"
                    value={editingAsset.exitPrice}
                    onChange={(e) => setEditingAsset({ ...editingAsset, exitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hold Time</label>
                  <input
                    type="text"
                    value={editingAsset.holdingPeriod}
                    onChange={(e) => setEditingAsset({ ...editingAsset, holdingPeriod: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Market Thesis / Notes</label>
                <textarea
                  rows={2}
                  value={editingAsset.thesis}
                  onChange={(e) => setEditingAsset({ ...editingAsset, thesis: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAsset.isRankedTop3}
                    onChange={(e) => setEditingAsset({ ...editingAsset, isRankedTop3: e.target.checked })}
                  />
                  <span>Rank in Top 3 Cards</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAsset.isSamplePlaceholder}
                    onChange={(e) => setEditingAsset({ ...editingAsset, isSamplePlaceholder: e.target.checked })}
                  />
                  <span>Mark as Sample/Demo</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsAssetModalOpen(false)}
                className="px-4 py-2 bg-slate-800 rounded text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const existingIdx = content.performance.assets.findIndex(a => a.id === editingAsset.id);
                  let newAssets = [...content.performance.assets];
                  if (existingIdx >= 0) {
                    newAssets[existingIdx] = editingAsset;
                  } else {
                    newAssets.unshift(editingAsset);
                  }
                  setContent({ ...content, performance: { ...content.performance, assets: newAssets } });
                  setIsAssetModalOpen(false);
                }}
                className="px-4 py-2 bg-cyan-400 text-slate-950 font-bold rounded"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit/Add FAQ */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#060b18] border border-slate-800 p-6 shadow-2xl text-slate-200 text-xs font-mono">
            <h3 className="text-base font-bold text-white mb-4 uppercase">
              FAQ Item Editor
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                >
                  <option value="General">General</option>
                  <option value="Curriculum">Curriculum</option>
                  <option value="Risk & Philosophy">Risk & Philosophy</option>
                  <option value="Membership">Membership</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#030611] border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 bg-slate-800 rounded text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const existingIdx = content.faq.items.findIndex(f => f.id === editingFaq.id);
                  let newItems = [...content.faq.items];
                  if (existingIdx >= 0) {
                    newItems[existingIdx] = editingFaq;
                  } else {
                    newItems.push(editingFaq);
                  }
                  setContent({ ...content, faq: { ...content.faq, items: newItems } });
                  setIsFaqModalOpen(false);
                }}
                className="px-4 py-2 bg-cyan-400 text-slate-950 font-bold rounded"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
