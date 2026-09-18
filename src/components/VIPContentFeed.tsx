import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Crown, Lock, Unlock, CheckCircle2, AlertTriangle, TrendingUp,
  Share2, ArrowUpRight, Copy, Check, Filter, Sparkles, LogOut,
  Clock, KeyRound, ExternalLink, RefreshCw, Search, Pin,
  Paperclip, Image as ImageIcon, ShieldCheck, HelpCircle, Eye,
  BarChart2, Zap
} from 'lucide-react';
import { VipPost, VipPostType, VipPostStatus } from '../types';
import { chatSound } from '../utils/audio';

export interface VIPContentFeedProps {
  onOpenMembership?: (tier?: string) => void;
  className?: string;
  showTitleHeader?: boolean;
  compact?: boolean;
}

export const VIPContentFeed: React.FC<VIPContentFeedProps> = ({
  onOpenMembership,
  className = '',
  showTitleHeader = true,
  compact = false
}) => {
  const [posts, setPosts] = useState<VipPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVipUnlocked, setIsVipUnlocked] = useState<boolean>(false);
  const [vipTierName, setVipTierName] = useState<string>('VIP Lifetime Alpha Member');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | VipPostType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | VipPostStatus>('all');

  // Passcode Modal state
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);
  const [accessKeyInput, setAccessKeyInput] = useState<string>('');
  const [keyError, setKeyError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Copy feedback & UI messages
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Fetch VIP posts and check VIP authorization status
  const fetchPosts = useCallback(async (showIndicator = false) => {
    try {
      if (showIndicator) setRefreshing(true);
      else setIsLoading(true);

      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('valence_vip_token') : null;
      const headers: Record<string, string> = {};
      if (savedToken) {
        headers['x-vip-token'] = savedToken;
      }

      const res = await fetch('/api/vip/posts', {
        headers,
        credentials: 'include'
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
        setIsVipUnlocked(Boolean(data.isVip || data.authenticated));
      }
    } catch (err) {
      console.warn('VIPContentFeed: Error fetching secure VIP posts:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle VIP Passcode Verification
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessKeyInput.trim();
    if (!code) {
      setKeyError('Please enter your VIP Member Passcode.');
      return;
    }

    try {
      setIsVerifying(true);
      setKeyError('');

      const res = await fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ passcode: code, accessKey: code })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('valence_vip_token', data.token);
        }
        setIsVipUnlocked(true);
        if (data.tier) setVipTierName(data.tier);
        setIsPasscodeModalOpen(false);
        setAccessKeyInput('');
        setFeedbackMsg('👑 VIP Authorization Verified! All content bodies and links unlocked.');
        chatSound?.playPing?.('receive');
        setTimeout(() => setFeedbackMsg(''), 4000);
        await fetchPosts(true);
      } else {
        setKeyError(data.error || 'Invalid VIP Passcode. Please check your credentials.');
      }
    } catch (err) {
      setKeyError('Connection error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout / Lock VIP Access
  const handleLockVip = async () => {
    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('valence_vip_token') : null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('valence_vip_token');
      }
      await fetch('/api/vip/logout', {
        method: 'POST',
        headers: savedToken ? { 'x-vip-token': savedToken } : {},
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Error signing out of VIP session:', err);
    } finally {
      setIsVipUnlocked(false);
      setFeedbackMsg('VIP session closed. Private content bodies locked.');
      setTimeout(() => setFeedbackMsg(''), 3000);
      await fetchPosts(true);
    }
  };

  // Copy Post summary / link to clipboard
  const handleCopyPost = (post: VipPost) => {
    const text = `[VALENCE VIP BRIEFING]\n${post.title}\nCategory: ${post.type.toUpperCase()}\nAuthor: ${post.author}\nDate: ${new Date(post.createdAt).toLocaleDateString()}`;
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter and sort posts (Pinned posts float to top, followed by date)
  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        if (selectedCategory !== 'all' && post.type !== selectedCategory) return false;
        if (selectedStatus !== 'all' && post.status !== selectedStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = post.title?.toLowerCase().includes(q);
          const matchBody = (post.body || post.content || '').toLowerCase().includes(q);
          const matchSymbol = post.symbol?.toLowerCase().includes(q);
          if (!matchTitle && !matchBody && !matchSymbol) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [posts, selectedCategory, selectedStatus, searchQuery]);

  // Category badge styling helper
  const getCategoryBadgeClass = (type: VipPostType) => {
    switch (type) {
      case 'research_report':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/30';
      case 'alpha_alert':
        return 'bg-amber-500/15 text-amber-700 dark:text-[#F2D231] border-amber-400/30';
      case 'spot_signal':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30';
      case 'risk_warning':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/30';
      case 'announcement':
        return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-400/30';
      case 'market_update':
      default:
        return 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/30';
    }
  };

  return (
    <div id="vip-content-feed-container" className={`w-full font-sans ${className}`}>
      {/* Header Section (if enabled) */}
      {showTitleHeader && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1E5747]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-[#F2D231] border border-amber-500/30">
                  <Crown className="w-3.5 h-3.5 fill-amber-500/30 text-amber-600 dark:text-[#F2D231]" />
                  <span>Exclusive Alpha Stream</span>
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-[#BFE5D5]/60">
                  &bull; وی آئی پی پوسٹس و تجزیات
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-syne tracking-tight uppercase">
                VIP Content Feed
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#BFE5D5] mt-1.5 max-w-2xl">
                Real-time technical reports, macro briefings, institutional order-flow signals, and research authored directly by Faaiz Durrani.
              </p>
            </div>

            {/* Authentication Status & Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {isVipUnlocked ? (
                <div className="flex items-center gap-2 bg-emerald-500/15 dark:bg-[#123D32] border border-emerald-500/40 dark:border-emerald-400/40 rounded-xl px-3.5 py-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <span className="block text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-bold leading-none">
                      VIP Member Verified
                    </span>
                    <span className="text-xs font-mono text-slate-700 dark:text-white font-medium">
                      Full Content Bodies Unlocked
                    </span>
                  </div>
                  <button
                    id="vip-feed-lock-session-btn"
                    onClick={handleLockVip}
                    className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Lock session & logout"
                    aria-label="Lock VIP session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="vip-feed-unlock-passcode-btn"
                    onClick={() => setIsPasscodeModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Enter VIP Passcode</span>
                  </button>
                  {onOpenMembership && (
                    <button
                      id="vip-feed-apply-membership-btn"
                      onClick={() => onOpenMembership('Yearly VIP')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#194C3D] dark:hover:bg-[#1E5747] text-slate-800 dark:text-white font-syne font-semibold text-xs transition-colors border border-slate-300 dark:border-[#1E5747]"
                    >
                      Apply for Access
                    </button>
                  )}
                </div>
              )}

              {/* Refresh feed button */}
              <button
                id="vip-feed-refresh-btn"
                onClick={() => fetchPosts(true)}
                disabled={refreshing || isLoading}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#123D32] hover:bg-slate-200 dark:hover:bg-[#194C3D] border border-slate-200 dark:border-[#1E5747] text-slate-700 dark:text-[#D6F0E5] transition-colors disabled:opacity-50"
                title="Refresh feed"
                aria-label="Refresh VIP posts"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {feedbackMsg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{feedbackMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Control Station: Search & Category Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071914] border border-slate-200 dark:border-[#1E5747] text-xs font-mono">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="vip-feed-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search updates by coin (BTC, SOL), title, or keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#040c0a] border border-slate-200 dark:border-[#1E5747] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 dark:focus:border-[#F2D231] outline-none text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white dark:bg-[#0d2620] text-slate-600 dark:text-[#BFE5D5] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E5747]'
            }`}
          >
            All Updates ({posts.length})
          </button>
          <button
            onClick={() => setSelectedCategory('market_update')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'market_update'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white dark:bg-[#0d2620] text-slate-600 dark:text-[#BFE5D5] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E5747]'
            }`}
          >
            Market Updates
          </button>
          <button
            onClick={() => setSelectedCategory('research_report')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'research_report'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white dark:bg-[#0d2620] text-slate-600 dark:text-[#BFE5D5] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E5747]'
            }`}
          >
            Research Reports
          </button>
          <button
            onClick={() => setSelectedCategory('alpha_alert')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'alpha_alert'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white dark:bg-[#0d2620] text-slate-600 dark:text-[#BFE5D5] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E5747]'
            }`}
          >
            Alpha Briefs
          </button>
          <button
            onClick={() => setSelectedCategory('spot_signal')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'spot_signal'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white dark:bg-[#0d2620] text-slate-600 dark:text-[#BFE5D5] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E5747]'
            }`}
          >
            Trade Setups
          </button>
        </div>
      </div>

      {/* Main Feed Content */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-mono text-slate-500 dark:text-[#BFE5D5]">
            Decentralizing & authenticating secure VIP feed...
          </span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-[#0a231d] border border-slate-200 dark:border-[#1E5747] space-y-3">
          <Crown className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white font-syne">
            No VIP Posts Found
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#BFE5D5] max-w-md mx-auto">
            {searchQuery
              ? `No dispatches match the search query "${searchQuery}". Try a different keyword or reset filters.`
              : 'New VIP alpha updates and research dispatches will appear here once published from the VIP Content Editor.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#123D32] text-xs font-mono font-medium hover:bg-slate-300 dark:hover:bg-[#194C3D] transition-colors"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredPosts.map((post) => {
            const hasAttachment = Boolean(post.attachmentUrl || post.linkUrl || post.chartUrl);
            const attachmentLink = post.attachmentUrl || post.linkUrl || post.chartUrl;
            const isImage = attachmentLink && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentLink);
            const hasTradeLevels = Boolean(post.entryRange || post.target1 || post.stopLoss);
            const isLockedForUser = !isVipUnlocked || Boolean(post.isLocked);

            return (
              <article
                key={post.id}
                id={`vip-post-${post.id}`}
                className={`relative rounded-3xl p-6 sm:p-7 transition-all ${
                  post.pinned
                    ? 'bg-gradient-to-b from-amber-50/50 to-white dark:from-[#0d2a23] dark:to-[#071914] border-2 border-amber-500/50 shadow-xl shadow-amber-500/5'
                    : 'bg-white dark:bg-[#0a231d] border border-slate-200 dark:border-[#1E5747] hover:border-slate-300 dark:hover:border-[#256c58] shadow-sm'
                }`}
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-[#1E5747]/60">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.pinned && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-[#F2D231] border border-amber-500/40 flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-amber-500" />
                        <span>PINNED DISPATCH</span>
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider ${getCategoryBadgeClass(post.type)}`}>
                      {post.type.replace('_', ' ')}
                    </span>

                    {post.symbol && post.symbol !== 'VIP ALPHA' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#071914] text-slate-800 dark:text-white border border-slate-200 dark:border-[#1E5747]">
                        {post.symbol}
                      </span>
                    )}

                    <span className="text-xs font-mono text-slate-500 dark:text-[#BFE5D5]/70 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    <span className="text-xs font-mono text-slate-400 dark:text-[#BFE5D5]/50">
                      &bull; {post.author || 'Faaiz Durrani'}
                    </span>
                  </div>

                  {/* Top Right Utilities: Copy / Share */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyPost(post)}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-[#123D32] text-slate-500 dark:text-[#BFE5D5] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E5747] transition-colors"
                      title="Copy dispatch summary"
                      aria-label="Copy post"
                    >
                      {copiedId === post.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Post Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-syne mb-3 tracking-tight leading-snug">
                  {post.title}
                </h3>

                {/* Optional Trade Matrix (if signal parameters were configured) */}
                {hasTradeLevels && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-200 dark:border-[#1E5747] text-xs font-mono">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400 dark:text-[#BFE5D5]/60">ENTRY ZONE</span>
                      <span className={`font-bold ${isLockedForUser ? 'text-amber-600 dark:text-[#F2D231] blur-xs select-none' : 'text-slate-900 dark:text-white'}`}>
                        {isLockedForUser ? '$64,200 - $65,500' : (post.entryRange || 'Market')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase text-slate-400 dark:text-[#BFE5D5]/60">TARGET 1</span>
                      <span className={`font-bold ${isLockedForUser ? 'text-emerald-600 dark:text-emerald-400 blur-xs select-none' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isLockedForUser ? '$68,800 (+6.5%)' : (post.target1 || 'N/A')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase text-slate-400 dark:text-[#BFE5D5]/60">TARGET 2</span>
                      <span className={`font-bold ${isLockedForUser ? 'text-emerald-600 dark:text-emerald-400 blur-xs select-none' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isLockedForUser ? '$72,400 (+12%)' : (post.target2 || 'N/A')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase text-slate-400 dark:text-[#BFE5D5]/60">STOP LOSS</span>
                      <span className={`font-bold ${isLockedForUser ? 'text-rose-600 dark:text-rose-400 blur-xs select-none' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isLockedForUser ? '$62,400' : (post.stopLoss || 'N/A')}
                      </span>
                    </div>
                  </div>
                )}

                {/* ================= CONTENT BODY SECTION ================= */}
                {/* Strictly ensures only authenticated members can view the content body */}
                <div className="relative my-3">
                  {isLockedForUser ? (
                    <div className="relative rounded-2xl overflow-hidden p-4 sm:p-5 bg-slate-50/80 dark:bg-[#061410]/80 border border-amber-300/60 dark:border-amber-500/30">
                      {/* Masked Teaser */}
                      <p className="text-sm text-slate-600 dark:text-[#BFE5D5] line-clamp-3 filter blur-[3px] select-none pointer-events-none opacity-60">
                        {post.body || post.content || 'Institutional order flow review, detailed liquidity invalidations, market structural thesis, and specific execution parameters are exclusively published for private VIP members.'}
                      </p>

                      {/* Prominent Overlay Guard Card */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/80 dark:bg-[#071914]/85 backdrop-blur-[3px] text-center z-10">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-2">
                          <Lock className="w-5 h-5 text-amber-600 dark:text-[#F2D231]" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-syne mb-1">
                          VIP Content Body Encrypted
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-[#BFE5D5] max-w-sm mb-3">
                          The complete body, invalidation zones, and attachments are restricted to authenticated VIP members.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            onClick={() => setIsPasscodeModalOpen(true)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Enter VIP Passcode</span>
                          </button>
                          {onOpenMembership && (
                            <button
                              onClick={() => onOpenMembership('Yearly VIP')}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#123D32] dark:hover:bg-[#194C3D] text-slate-700 dark:text-white text-xs font-semibold border border-slate-200 dark:border-[#1E5747] transition-colors"
                            >
                              Join VIP Room
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* UNLOCKED: Full Content Body visible to authenticated VIPs */
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-200 dark:border-[#1E5747]">
                      <div className="whitespace-pre-line text-sm text-slate-800 dark:text-[#D6F0E5] leading-relaxed font-sans">
                        {post.body || post.content}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Attachment / External Resource Link */}
                {hasAttachment && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E5747]/60">
                    {isLockedForUser ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono">
                        <span className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-600 dark:text-[#F2D231]" />
                          <span>Attached VIP Chart / Research PDF Encrypted</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          VIP Members Only
                        </span>
                      </div>
                    ) : (
                      <a
                        href={attachmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#123D32] hover:bg-slate-100 dark:hover:bg-[#194C3D] border border-slate-200 dark:border-[#F2D231]/30 text-xs font-mono transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {isImage ? (
                            <ImageIcon className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-amber-500 dark:text-[#F2D231] shrink-0" />
                          )}
                          <span className="text-slate-800 dark:text-white font-semibold truncate">
                            {post.linkText || (isImage ? 'View Attached TradingView Chart' : 'Open Attached VIP Research Resource')}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#071914] text-slate-700 dark:text-[#F2D231] text-[11px] font-bold shrink-0 ml-2 group-hover:scale-105 transition-transform flex items-center gap-1 border border-slate-200 dark:border-[#1E5747]">
                          <span>Open Resource</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: VIP PASSCODE VERIFICATION ================= */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            id="vip-feed-passcode-modal"
            className="w-full max-w-md bg-white dark:bg-[#123D32] border border-slate-200 dark:border-[#F2D231]/40 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-[#D6F0E5] relative animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-[#1E5747]">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 dark:text-[#F2D231]" />
                <h3 className="text-lg font-bold font-syne text-slate-900 dark:text-white">
                  VIP Alpha Member Login
                </h3>
              </div>
              <button
                onClick={() => { setIsPasscodeModalOpen(false); setKeyError(''); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#BFE5D5] mb-5 leading-relaxed">
              Enter the access passcode provided by Faaiz Durrani to decrypt and unlock all VIP post bodies, chart setups, and private dispatches.
            </p>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 dark:text-[#BFE5D5] mb-1.5 font-bold">
                  VIP Member Passcode / ممبر پاس کوڈ
                </label>
                <div className="relative">
                  <input
                    id="vip-passcode-input-field"
                    type="password"
                    value={accessKeyInput}
                    onChange={(e) => { setAccessKeyInput(e.target.value); setKeyError(''); }}
                    placeholder="e.g. VIP2026"
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071914] border border-slate-300 dark:border-[#1E5747] focus:border-amber-500 dark:focus:border-[#F2D231] focus:ring-1 focus:ring-[#F2D231] outline-none font-mono text-sm uppercase tracking-wider text-slate-900 dark:text-white"
                  />
                  <KeyRound className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                {keyError && (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{keyError}</span>
                  </p>
                )}
              </div>

              {/* Instant Evaluation Key Helper */}
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 text-[11px] text-amber-900 dark:text-amber-200 font-mono">
                <span className="font-bold">Evaluation Passcode: </span>
                <button
                  type="button"
                  onClick={() => setAccessKeyInput('VIP2026')}
                  className="underline hover:text-amber-600 dark:hover:text-white font-bold ml-1 cursor-pointer"
                >
                  Use &quot;VIP2026&quot;
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1E5747]">
                <button
                  type="button"
                  onClick={() => { setIsPasscodeModalOpen(false); setKeyError(''); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071914] dark:hover:bg-[#123D32] text-xs font-mono text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-syne font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unlock Feed</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VIPContentFeed;
