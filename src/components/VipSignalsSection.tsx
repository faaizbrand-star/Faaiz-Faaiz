import React, { useState, useEffect } from 'react';
import {
  Crown, Lock, Unlock, CheckCircle2, AlertTriangle, TrendingUp,
  Share2, ArrowUpRight, Copy, Check, Filter, Sparkles, LogOut,
  Clock, ShieldAlert, KeyRound, ExternalLink, Zap
} from 'lucide-react';
import { VipPost, VipPostType, VipPostStatus } from '../types';
import { chatSound } from '../utils/audio';

interface VipSignalsSectionProps {
  onOpenMembership: (tier?: string) => void;
}

export const VipSignalsSection: React.FC<VipSignalsSectionProps> = ({ onOpenMembership }) => {
  const [posts, setPosts] = useState<VipPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVipUnlocked, setIsVipUnlocked] = useState(false);
  const [vipTierName, setVipTierName] = useState('VIP Lifetime Alpha Member');
  
  // Filtering states
  const [selectedType, setSelectedType] = useState<'all' | VipPostType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | VipPostStatus>('all');
  
  // Passcode modal state
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Fetch VIP posts and check VIP session
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/vip/posts');
      const data = await res.json();
      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
        setIsVipUnlocked(Boolean(data.isVip));
      }
    } catch (err) {
      console.warn('Could not fetch VIP posts from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle VIP Passcode Submission
  const handleVerifyAccessKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = accessKeyInput.trim();
    if (!key) {
      setKeyError('Please enter your VIP Access Passcode.');
      return;
    }

    try {
      setIsVerifying(true);
      setKeyError('');
      const res = await fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: key })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsVipUnlocked(true);
        if (data.tier) setVipTierName(data.tier);
        setIsPasscodeModalOpen(false);
        setAccessKeyInput('');
        setFeedbackMsg('👑 VIP Access Verified! Alpha feed unlocked.');
        chatSound.playPing('receive');
        setTimeout(() => setFeedbackMsg(''), 4000);
        // Refresh full posts
        await fetchPosts();
      } else {
        setKeyError(data.error || 'Invalid VIP Passcode. Please check and try again.');
      }
    } catch (err) {
      setKeyError('Network connection issue. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout / Lock VIP
  const handleLockVip = async () => {
    try {
      await fetch('/api/vip/logout', { method: 'POST' });
    } finally {
      setIsVipUnlocked(false);
      setFeedbackMsg('VIP session closed. Feed locked.');
      setTimeout(() => setFeedbackMsg(''), 3000);
      fetchPosts();
    }
  };

  // Copy Setup to Clipboard
  const handleCopySetup = (post: VipPost) => {
    const text = `🎯 [${post.symbol}] VIP SPOT ALPHA - FAAIZ DURRANI
Type: ${post.type.toUpperCase()} | Direction: ${post.direction || 'SPOT'}
Entry: ${post.entryRange || 'Market Zone'}
Target 1: ${post.target1 || 'N/A'}
Target 2: ${post.target2 || 'N/A'}
Stop Loss: ${post.stopLoss || 'N/A'}
Risk/Reward: ${post.riskReward || '1:3+'}
Timeframe: ${post.timeframe || '4H'}
Status: ${post.status.toUpperCase()}

Notes:
${post.content}

Official VIP Dispatch by Faaiz Durrani`;

    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    chatSound.playPing('toggle');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered list
  const filteredPosts = posts.filter(post => {
    if (selectedType !== 'all' && post.type !== selectedType) return false;
    if (selectedStatus !== 'all' && post.status !== selectedStatus) return false;
    return true;
  });

  const getTypeBadgeColor = (type: VipPostType) => {
    switch (type) {
      case 'spot_signal':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'alpha_alert':
        return 'bg-amber-500/15 text-amber-600 dark:text-[#F2D231] border-amber-500/30';
      case 'risk_warning':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'market_update':
      default:
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
    }
  };

  const getStatusBadge = (status: VipPostStatus) => {
    switch (status) {
      case 'hit_target':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> TARGET HIT
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> ACTIVE SETUP
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-500/20 text-slate-600 dark:text-slate-300 border border-slate-500/30">
            COMPLETED
          </span>
        );
      case 'invalidated':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> INVALIDATED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="vip-signals"
      className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0c2620] text-slate-900 dark:text-[#D6F0E5] transition-colors border-t border-b border-slate-200 dark:border-[#1E5747] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F2D231]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 dark:bg-[#1E5747] dark:text-[#F2D231] dark:border-[#F2D231]/30 mb-3 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-[#F2D231]" />
              <span>VIP Members Alpha Room &bull; وی آئی پی سگنلز</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
              Exclusive VIP Signals & Updates
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-[#BFE5D5] max-w-2xl">
              Strict spot accumulation ranges, exact invalidation levels, and macro order flow breakdowns published directly by Faaiz Durrani for premium cohort members.
            </p>
          </div>

          {/* VIP Status Controller Card */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#123D32] border border-slate-200 dark:border-[#1E5747] p-3 rounded-2xl shadow-sm">
            {isVipUnlocked ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50 text-xs font-semibold">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>VIP Access Unlocked</span>
                </div>
                <button
                  id="vip-lock-session-btn"
                  onClick={handleLockVip}
                  title="Lock VIP view"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="vip-enter-key-btn"
                  onClick={() => setIsPasscodeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold font-mono rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 dark:bg-[#F2D231] dark:hover:bg-[#FFE873] shadow-sm transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Enter VIP Passcode</span>
                </button>
                <button
                  id="vip-get-access-btn"
                  onClick={() => onOpenMembership('Yearly VIP')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-[#D6F0E5] hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  <span>Join VIP Room</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Notification Toast */}
        {feedbackMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Lock Banner if not Unlocked */}
        {!isVipUnlocked && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-[#F2D231]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#F2D231]/15 border border-amber-300 dark:border-[#F2D231]/30 flex items-center justify-center text-amber-600 dark:text-[#F2D231] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  VIP Alpha Feed is Locked for Free Observers
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#BFE5D5]">
                  Exact accumulation ranges, profit targets, and stop losses are encrypted. Enter your VIP Access Key or subscribe to the VIP room.
                  <span className="hidden sm:inline font-mono font-bold text-amber-700 dark:text-[#F2D231] ml-1.5">(Demo Key: VIP2026)</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPasscodeModalOpen(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#123D32] dark:bg-[#F2D231] text-white dark:text-[#123D32] hover:opacity-90 transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              Unlock Alpha Now &rarr;
            </button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#1E5747]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-mono text-slate-500 dark:text-[#BFE5D5]/60 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> TYPE:
            </span>
            {(['all', 'spot_signal', 'alpha_alert', 'market_update', 'risk_warning'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-slate-900 text-white dark:bg-[#F2D231] dark:text-[#123D32] font-bold shadow-sm'
                    : 'text-slate-600 dark:text-[#D6F0E5] hover:bg-slate-200 dark:hover:bg-[#1E5747]'
                }`}
              >
                {type === 'all' ? 'All Posts' : type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-[#BFE5D5]">
            <span>Showing {filteredPosts.length} post{filteredPosts.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Signals List / Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 dark:text-[#BFE5D5] font-mono text-sm">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading real-time VIP alpha stream...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#123D32]/50 border border-slate-200 dark:border-[#1E5747] rounded-2xl">
            <ShieldAlert className="w-8 h-8 mx-auto text-slate-400 dark:text-[#BFE5D5]/40 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-[#D6F0E5]">No signals found in this filter category.</p>
            <button
              onClick={() => { setSelectedType('all'); setSelectedStatus('all'); }}
              className="mt-3 text-xs text-amber-700 dark:text-[#F2D231] underline font-mono cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map(post => {
              const isPostLocked = !isVipUnlocked || post.isLocked;

              return (
                <article
                  key={post.id}
                  id={`vip-post-card-${post.id}`}
                  className={`rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                    post.pinned
                      ? 'bg-amber-500/5 dark:bg-[#F2D231]/5 border-amber-400/50 dark:border-[#F2D231]/40 shadow-[0_0_20px_rgba(242,210,49,0.08)]'
                      : 'bg-white dark:bg-[#123D32] border-slate-200 dark:border-[#1E5747] hover:border-amber-400/50 dark:hover:border-[#F2D231]/30 shadow-sm'
                  }`}
                >
                  {/* Pinned Tag */}
                  {post.pinned && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-slate-950 dark:bg-[#F2D231] dark:text-[#123D32] flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" /> PINNED ALPHA
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="p-5 sm:p-6 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono font-bold tracking-tight text-slate-900 dark:text-white">
                          {post.symbol}
                        </span>
                        {post.direction && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#194C3D] text-slate-700 dark:text-[#D6F0E5] border border-slate-300 dark:border-[#F2D231]/20">
                            {post.direction}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getTypeBadgeColor(post.type)}`}>
                          {post.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-[#BFE5D5]/70 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {post.timeframe && (
                        <span>&bull; TF: {post.timeframe}</span>
                      )}
                      <span>&bull; {post.author}</span>
                    </div>

                    {/* Trade Key Metrics Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-[#0c2620] border border-slate-200 dark:border-[#1E5747]">
                      <div>
                        <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#BFE5D5]/60">ENTRY ZONE</span>
                        <span className={`text-xs font-mono font-bold ${isPostLocked ? 'text-amber-600 dark:text-[#F2D231] blur-xs select-none' : 'text-slate-900 dark:text-white'}`}>
                          {isPostLocked ? '$64,200 - $65,500' : (post.entryRange || 'Market')}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#BFE5D5]/60">TARGET 1</span>
                        <span className={`text-xs font-mono font-bold ${isPostLocked ? 'text-emerald-600 dark:text-emerald-400 blur-xs select-none' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {isPostLocked ? '$68,800 (+6.5%)' : (post.target1 || 'N/A')}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#BFE5D5]/60">TARGET 2</span>
                        <span className={`text-xs font-mono font-bold ${isPostLocked ? 'text-emerald-600 dark:text-emerald-400 blur-xs select-none' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {isPostLocked ? '$72,400 (+12%)' : (post.target2 || 'N/A')}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#BFE5D5]/60">STOP LOSS</span>
                        <span className={`text-xs font-mono font-bold ${isPostLocked ? 'text-rose-600 dark:text-rose-400 blur-xs select-none' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isPostLocked ? '$62,400' : (post.stopLoss || 'N/A')}
                        </span>
                      </div>
                    </div>

                    {/* Educational Content / Thesis */}
                    <div className="relative text-xs sm:text-sm text-slate-700 dark:text-[#D6F0E5] leading-relaxed">
                      {isPostLocked ? (
                        <div className="relative">
                          <p className="blur-[3px] select-none text-slate-400 dark:text-slate-500 line-clamp-3">
                            {post.content}
                          </p>
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-[#123D32]/85 backdrop-blur-[2px] rounded-lg p-3 text-center border border-amber-300 dark:border-[#F2D231]/30">
                            <Lock className="w-5 h-5 text-amber-600 dark:text-[#F2D231] mb-1" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">VIP Invalidation & Analysis Encrypted</span>
                            <button
                              onClick={() => setIsPasscodeModalOpen(true)}
                              className="mt-2 px-3 py-1 text-[11px] font-mono font-bold rounded-lg bg-amber-500 text-slate-950 dark:bg-[#F2D231] dark:text-[#123D32] hover:opacity-90 cursor-pointer shadow-sm"
                            >
                              Unlock with VIP Key
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line font-sans prose dark:prose-invert max-w-none text-xs sm:text-sm">
                          {post.content}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 dark:border-[#1E5747] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#BFE5D5]/70">
                      <span>R:R Ratio:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isPostLocked ? '1:3.X' : (post.riskReward || '1:3+')}
                      </span>
                    </div>

                    {isVipUnlocked ? (
                      <button
                        id={`copy-setup-btn-${post.id}`}
                        onClick={() => handleCopySetup(post)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#194C3D] dark:hover:bg-[#1E5747] text-slate-800 dark:text-[#D6F0E5] transition-colors cursor-pointer text-xs"
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied Setup</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-[#F2D231]" />
                            <span>Copy Signal</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenMembership('Yearly VIP')}
                        className="text-amber-700 dark:text-[#F2D231] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>Upgrade for VIP Access</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* VIP Passcode Verification Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            id="vip-passcode-modal"
            className="w-full max-w-md bg-white dark:bg-[#123D32] border border-slate-300 dark:border-[#F2D231]/40 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-[#D6F0E5] relative animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-[#1E5747]">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600 dark:text-[#F2D231]" />
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">VIP Alpha Access Key</h3>
              </div>
              <button
                onClick={() => { setIsPasscodeModalOpen(false); setKeyError(''); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#BFE5D5] mb-4">
              Enter the exclusive access passcode provided by Faaiz Durrani upon joining the VIP Membership room.
            </p>

            <form onSubmit={handleVerifyAccessKey} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 dark:text-[#BFE5D5] mb-1.5">
                  VIP Passcode / ممبر پاس کوڈ
                </label>
                <div className="relative">
                  <input
                    id="vip-passcode-input"
                    type="password"
                    value={accessKeyInput}
                    onChange={(e) => { setAccessKeyInput(e.target.value); setKeyError(''); }}
                    placeholder="e.g. VIP2026"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c2620] border border-slate-300 dark:border-[#1E5747] focus:border-amber-500 dark:focus:border-[#F2D231] focus:ring-1 focus:ring-[#F2D231] outline-none font-mono text-sm uppercase tracking-wider"
                  />
                  <KeyRound className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                </div>
                {keyError && (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">{keyError}</p>
                )}
              </div>

              {/* Demo Key Helper Box */}
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 text-[11px] text-amber-900 dark:text-amber-200 font-mono">
                <span className="font-bold">Instant Evaluation Key: </span>
                <button
                  type="button"
                  onClick={() => setAccessKeyInput('VIP2026')}
                  className="underline hover:text-amber-600 font-bold ml-1 cursor-pointer"
                >
                  Use &quot;VIP2026&quot;
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsPasscodeModalOpen(false); setKeyError(''); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-vip-passcode-btn"
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F2D231] hover:bg-[#FFE873] text-[#123D32] disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#123D32] border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unlock VIP Feed</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
