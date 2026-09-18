import React, { useState, useEffect } from 'react';
import {
  Crown, Key, Plus, Trash2, Edit3, CheckCircle2, AlertTriangle,
  Clock, ShieldAlert, Sparkles, X, Save, RefreshCw, Eye
} from 'lucide-react';
import { VipPost, VipPostType, VipPostStatus, VipTradeDirection } from '../../types';

export const AdminVipTab: React.FC = () => {
  const [posts, setPosts] = useState<VipPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState('VIP2026');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [keySuccessMsg, setKeySuccessMsg] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [postError, setPostError] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSymbol, setFormSymbol] = useState('BTC/USDT');
  const [formType, setFormType] = useState<VipPostType>('spot_signal');
  const [formStatus, setFormStatus] = useState<VipPostStatus>('active');
  const [formDirection, setFormDirection] = useState<VipTradeDirection>('SPOT ACCUMULATION');
  const [formTimeframe, setFormTimeframe] = useState('4H');
  const [formEntryRange, setFormEntryRange] = useState('');
  const [formTarget1, setFormTarget1] = useState('');
  const [formTarget2, setFormTarget2] = useState('');
  const [formStopLoss, setFormStopLoss] = useState('');
  const [formRiskReward, setFormRiskReward] = useState('1:3.2');
  const [formContent, setFormContent] = useState('');
  const [formPinned, setFormPinned] = useState(false);
  const [formAuthor, setFormAuthor] = useState('Faaiz Durrani (Admin)');

  // Fetch posts and VIP configuration
  const fetchVipData = async () => {
    try {
      setLoading(true);
      const [postsRes, configRes] = await Promise.all([
        fetch('/api/vip/posts'),
        fetch('/api/vip/config')
      ]);

      if (postsRes.ok) {
        const pData = await postsRes.json();
        if (pData?.posts) setPosts(pData.posts);
      }

      if (configRes.ok) {
        const cData = await configRes.json();
        if (cData?.activeAccessKey) {
          setActiveKey(cData.activeAccessKey);
          setNewKeyInput(cData.activeAccessKey);
        }
      }
    } catch (err) {
      console.warn('Error fetching VIP admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVipData();
  }, []);

  // Update VIP Member Access Passcode
  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = newKeyInput.trim();
    if (!key) return;

    try {
      setIsUpdatingKey(true);
      const res = await fetch('/api/vip/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeAccessKey: key })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveKey(key);
        setKeySuccessMsg('Active VIP passcode updated successfully!');
        setTimeout(() => setKeySuccessMsg(''), 3500);
      } else {
        alert(data.error || 'Failed to update VIP passcode.');
      }
    } catch (err) {
      alert('Network error while updating passcode.');
    } finally {
      setIsUpdatingKey(false);
    }
  };

  // Open modal for new post
  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormSymbol('BTC/USDT');
    setFormType('spot_signal');
    setFormStatus('active');
    setFormDirection('SPOT ACCUMULATION');
    setFormTimeframe('4H');
    setFormEntryRange('');
    setFormTarget1('');
    setFormTarget2('');
    setFormStopLoss('');
    setFormRiskReward('1:3.0');
    setFormContent('');
    setFormPinned(false);
    setFormAuthor('Faaiz Durrani (Admin)');
    setPostError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (post: VipPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormSymbol(post.symbol);
    setFormType(post.type);
    setFormStatus(post.status);
    setFormDirection(post.direction || 'SPOT ACCUMULATION');
    setFormTimeframe(post.timeframe || '4H');
    setFormEntryRange(post.entryRange || '');
    setFormTarget1(post.target1 || '');
    setFormTarget2(post.target2 || '');
    setFormStopLoss(post.stopLoss || '');
    setFormRiskReward(post.riskReward || '1:3.0');
    setFormContent(post.content || '');
    setFormPinned(Boolean(post.pinned));
    setFormAuthor(post.author || 'Faaiz Durrani (Admin)');
    setPostError('');
    setIsModalOpen(true);
  };

  // Save post (Create or Update)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSymbol.trim()) {
      setPostError('Title and Symbol are required.');
      return;
    }

    try {
      setIsSavingPost(true);
      setPostError('');

      const payload = {
        title: formTitle.trim(),
        symbol: formSymbol.trim().toUpperCase(),
        type: formType,
        status: formStatus,
        direction: formDirection,
        timeframe: formTimeframe.trim(),
        entryRange: formEntryRange.trim(),
        target1: formTarget1.trim(),
        target2: formTarget2.trim(),
        stopLoss: formStopLoss.trim(),
        riskReward: formRiskReward.trim(),
        content: formContent.trim(),
        pinned: formPinned,
        author: formAuthor.trim()
      };

      const url = editingPostId ? `/api/vip/posts/${editingPostId}` : '/api/vip/posts';
      const method = editingPostId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.posts) setPosts(data.posts);
        setIsModalOpen(false);
        setActionFeedback(editingPostId ? 'VIP Post updated.' : 'New VIP Signal published!');
        setTimeout(() => setActionFeedback(''), 3500);
      } else {
        setPostError(data.error || 'Failed to save VIP post.');
      }
    } catch (err) {
      setPostError('Network error while saving post.');
    } finally {
      setIsSavingPost(false);
    }
  };

  // Delete post
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/vip/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.posts) setPosts(data.posts);
        setActionFeedback('VIP Post deleted.');
        setTimeout(() => setActionFeedback(''), 3000);
      } else {
        alert(data.error || 'Failed to delete VIP post.');
      }
    } catch (err) {
      alert('Network error while deleting post.');
    }
  };

  // Quick Status Toggle
  const handleQuickStatusChange = async (id: string, newStatus: VipPostStatus) => {
    try {
      const res = await fetch(`/api/vip/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success && data.posts) {
        setPosts(data.posts);
        setActionFeedback(`Status updated to ${newStatus.toUpperCase()}`);
        setTimeout(() => setActionFeedback(''), 2500);
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
            <Crown className="w-4 h-4 text-[#F2D231]" />
            <span>VIP Members Portal Manager &bull; وی آئی پی پوسٹس</span>
          </div>
          <h2 className="text-2xl font-black text-white font-mono uppercase tracking-tight">
            VIP Alpha Posts & Signals
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Post exclusive spot trade setups, invalidation parameters, and educational market warnings visible only to verified VIP cohort members.
          </p>
        </div>

        <button
          id="admin-create-vip-post-btn"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2D231] hover:bg-[#FFE873] text-slate-950 font-bold uppercase tracking-wider text-xs shadow-lg cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post VIP Signal</span>
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* VIP Access Passcode Manager Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F2D231]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                VIP Member Access Passcode
              </h3>
              <p className="text-xs text-slate-400">
                The key premium members enter to unlock the unredacted VIP signals feed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Active Key:</span>
            <span className="px-3 py-1 rounded-lg bg-black/60 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs tracking-wider">
              {activeKey}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdatePasscode} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="flex-1">
            <input
              type="text"
              value={newKeyInput}
              onChange={(e) => setNewKeyInput(e.target.value)}
              placeholder="e.g. VIP2026 or ALPHA-PRO"
              className="w-full px-3.5 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white font-mono text-xs uppercase tracking-wider focus:border-cyan-400 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isUpdatingKey}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors disabled:opacity-50"
          >
            {isUpdatingKey ? 'Updating...' : 'Update VIP Key'}
          </button>
        </form>

        {keySuccessMsg && (
          <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{keySuccessMsg}</span>
          </p>
        )}
      </div>

      {/* VIP Posts Feed / Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <span>Published VIP Posts ({posts.length})</span>
            <button
              onClick={fetchVipData}
              title="Refresh posts"
              className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            Loading VIP signals...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs font-mono">
            No VIP posts published yet. Click &quot;Post VIP Signal&quot; above to create the first dispatch!
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div
                key={post.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  post.pinned
                    ? 'bg-[#0f172a]/80 border-amber-500/40'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-mono font-bold text-white">
                        {post.symbol}
                      </span>
                      {post.pinned && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-[#F2D231] border border-amber-500/40 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> PINNED
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {post.type.replace('_', ' ')}
                      </span>
                      {post.direction && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {post.direction}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        post.status === 'hit_target'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : post.status === 'active'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      {post.title}
                    </h4>

                    {/* Trade Levels Preview */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                      {post.entryRange && <span>Entry: <strong className="text-slate-200">{post.entryRange}</strong></span>}
                      {post.target1 && <span>T1: <strong className="text-emerald-400">{post.target1}</strong></span>}
                      {post.target2 && <span>T2: <strong className="text-emerald-400">{post.target2}</strong></span>}
                      {post.stopLoss && <span>SL: <strong className="text-rose-400">{post.stopLoss}</strong></span>}
                      {post.timeframe && <span>TF: {post.timeframe}</span>}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    {/* Quick status dropdown / toggles */}
                    <button
                      onClick={() => handleQuickStatusChange(post.id, post.status === 'hit_target' ? 'active' : 'hit_target')}
                      title="Toggle Target Hit / Active"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                        post.status === 'hit_target'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {post.status === 'hit_target' ? '✓ Hit Target' : 'Mark Hit Target'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(post)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Edit VIP Post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-rose-400 cursor-pointer"
                      title="Delete VIP Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#080e20] border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-white font-mono font-bold">
                <Crown className="w-5 h-5 text-[#F2D231]" />
                <span>{editingPostId ? 'Edit VIP Signal / Post' : 'Publish New VIP Alpha Setup'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {postError}
              </div>
            )}

            <form onSubmit={handleSavePost} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 uppercase mb-1">Post Title / Setup Headline *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. BTC Macro Liquidity Sweep & Spot Accumulation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Symbol *</label>
                  <input
                    type="text"
                    required
                    value={formSymbol}
                    onChange={(e) => setFormSymbol(e.target.value)}
                    placeholder="BTC/USDT"
                    className="w-full px-3 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white uppercase focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Post Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as VipPostType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="spot_signal">Spot Signal</option>
                    <option value="alpha_alert">Alpha Alert</option>
                    <option value="market_update">Market Update</option>
                    <option value="risk_warning">Risk Warning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VipPostStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="active">Active Setup</option>
                    <option value="hit_target">Hit Target</option>
                    <option value="closed">Closed / Completed</option>
                    <option value="invalidated">Invalidated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Direction</label>
                  <select
                    value={formDirection}
                    onChange={(e) => setFormDirection(e.target.value as VipTradeDirection)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="SPOT ACCUMULATION">Spot Accumulation</option>
                    <option value="LONG">Long</option>
                    <option value="SHORT">Short</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Timeframe</label>
                  <input
                    type="text"
                    value={formTimeframe}
                    onChange={(e) => setFormTimeframe(e.target.value)}
                    placeholder="4H / Daily"
                    className="w-full px-3 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Risk / Reward</label>
                  <input
                    type="text"
                    value={formRiskReward}
                    onChange={(e) => setFormRiskReward(e.target.value)}
                    placeholder="1:3.4"
                    className="w-full px-3 py-2 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-black/40 border border-slate-800">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Entry Range</label>
                  <input
                    type="text"
                    value={formEntryRange}
                    onChange={(e) => setFormEntryRange(e.target.value)}
                    placeholder="$64,200 - $65,500"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Target 1</label>
                  <input
                    type="text"
                    value={formTarget1}
                    onChange={(e) => setFormTarget1(e.target.value)}
                    placeholder="$68,800 (+6.5%)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Target 2</label>
                  <input
                    type="text"
                    value={formTarget2}
                    onChange={(e) => setFormTarget2(e.target.value)}
                    placeholder="$72,400 (+12%)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Stop Loss</label>
                  <input
                    type="text"
                    value={formStopLoss}
                    onChange={(e) => setFormStopLoss(e.target.value)}
                    placeholder="$62,400"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">
                  Analysis & Educational Thesis (Markdown Supported)
                </label>
                <textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Explain why this setup is valid, order flow confluence, liquidation clusters, and risk protocols..."
                  className="w-full p-3 rounded-xl bg-[#030611] border border-slate-800 text-white focus:border-cyan-400 outline-none font-sans text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="rounded border-slate-800 bg-[#030611] text-[#F2D231]"
                  />
                  <span className="text-slate-300">Pin this post to top of VIP stream</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-vip-post-submit-btn"
                    type="submit"
                    disabled={isSavingPost}
                    className="px-5 py-2 rounded-xl bg-[#F2D231] hover:bg-[#FFE873] text-slate-950 font-bold uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSavingPost ? 'Saving...' : (editingPostId ? 'Save Changes' : 'Publish VIP Post')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
