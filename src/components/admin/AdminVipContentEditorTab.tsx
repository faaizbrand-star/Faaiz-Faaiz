import React, { useState, useEffect } from 'react';
import {
  Crown, Plus, Edit3, Trash2, ExternalLink, Link2, FileText,
  Pin, CheckCircle2, AlertTriangle, Search, Filter, Sparkles,
  Eye, EyeOff, Lock, Unlock, Clock, Save, X, RefreshCw,
  Paperclip, Image, KeyRound, ArrowUpRight, BarChart2, ShieldAlert
} from 'lucide-react';
import { VipPost, VipPostType, VipPostStatus, VipTradeDirection } from '../../types';

export const AdminVipContentEditorTab: React.FC = () => {
  const [posts, setPosts] = useState<VipPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Passcode state
  const [activeKey, setActiveKey] = useState('VIP2026');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [keySuccessMsg, setKeySuccessMsg] = useState('');
  const [showKeyManager, setShowKeyManager] = useState(false);

  // Editor Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState<'write' | 'preview'>('write');

  // Preview as VIP member modal
  const [previewPost, setPreviewPost] = useState<VipPost | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formAttachmentUrl, setFormAttachmentUrl] = useState('');
  const [formLinkText, setFormLinkText] = useState('');
  const [formType, setFormType] = useState<VipPostType>('market_update');
  const [formStatus, setFormStatus] = useState<VipPostStatus>('active');
  const [formPinned, setFormPinned] = useState(false);
  const [formAuthor, setFormAuthor] = useState('Faaiz Durrani (Admin)');

  // Optional Trade Signal fields toggle
  const [includeTradeLevels, setIncludeTradeLevels] = useState(false);
  const [formSymbol, setFormSymbol] = useState('BTC/USDT');
  const [formDirection, setFormDirection] = useState<VipTradeDirection>('SPOT ACCUMULATION');
  const [formTimeframe, setFormTimeframe] = useState('4H');
  const [formEntryRange, setFormEntryRange] = useState('');
  const [formTarget1, setFormTarget1] = useState('');
  const [formTarget2, setFormTarget2] = useState('');
  const [formStopLoss, setFormStopLoss] = useState('');
  const [formRiskReward, setFormRiskReward] = useState('1:3.2');

  // Load VIP content and active configuration
  const loadData = async () => {
    try {
      setLoading(true);
      const [postsRes, configRes] = await Promise.all([
        fetch('/api/vip/posts'),
        fetch('/api/vip/config')
      ]);

      if (postsRes.ok) {
        const data = await postsRes.json();
        if (data?.posts) setPosts(data.posts);
      }

      if (configRes.ok) {
        const cData = await configRes.json();
        if (cData?.activeAccessKey) {
          setActiveKey(cData.activeAccessKey);
          setNewKeyInput(cData.activeAccessKey);
        }
      }
    } catch (err) {
      console.warn('Error loading VIP content editor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  // Open modal to create new post
  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormBody('');
    setFormAttachmentUrl('');
    setFormLinkText('');
    setFormType('market_update');
    setFormStatus('active');
    setFormPinned(false);
    setFormAuthor('Faaiz Durrani (Admin)');
    setIncludeTradeLevels(false);
    setFormSymbol('BTC/USDT');
    setFormDirection('SPOT ACCUMULATION');
    setFormTimeframe('4H');
    setFormEntryRange('');
    setFormTarget1('');
    setFormTarget2('');
    setFormStopLoss('');
    setFormRiskReward('1:3.0');
    setFormError('');
    setActiveEditorTab('write');
    setIsModalOpen(true);
  };

  // Open modal to edit existing post
  const handleOpenEditModal = (post: VipPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title || '');
    setFormBody(post.body || post.content || '');
    setFormAttachmentUrl(post.attachmentUrl || post.linkUrl || post.chartUrl || '');
    setFormLinkText(post.linkText || '');
    setFormType(post.type || 'market_update');
    setFormStatus(post.status || 'active');
    setFormPinned(Boolean(post.pinned));
    setFormAuthor(post.author || 'Faaiz Durrani (Admin)');
    
    // Trade levels detection
    const hasLevels = Boolean(post.entryRange || post.target1 || post.stopLoss);
    setIncludeTradeLevels(hasLevels);
    setFormSymbol(post.symbol || 'BTC/USDT');
    setFormDirection(post.direction || 'SPOT ACCUMULATION');
    setFormTimeframe(post.timeframe || '4H');
    setFormEntryRange(post.entryRange || '');
    setFormTarget1(post.target1 || '');
    setFormTarget2(post.target2 || '');
    setFormStopLoss(post.stopLoss || '');
    setFormRiskReward(post.riskReward || '1:3.0');

    setFormError('');
    setActiveEditorTab('write');
    setIsModalOpen(true);
  };

  // Save post (Create or Update)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please provide a title for the VIP post.');
      return;
    }
    if (!formBody.trim()) {
      setFormError('Please provide the body content for the VIP update.');
      return;
    }

    try {
      setIsSaving(true);
      setFormError('');

      const payload = {
        title: formTitle.trim(),
        body: formBody.trim(),
        content: formBody.trim(),
        attachmentUrl: formAttachmentUrl.trim() || undefined,
        linkUrl: formAttachmentUrl.trim() || undefined,
        linkText: formLinkText.trim() || undefined,
        chartUrl: formAttachmentUrl.trim() || undefined,
        type: formType,
        status: formStatus,
        pinned: formPinned,
        author: formAuthor.trim(),
        symbol: includeTradeLevels ? (formSymbol.trim().toUpperCase() || 'VIP ALPHA') : 'VIP ALPHA',
        direction: includeTradeLevels ? formDirection : undefined,
        timeframe: includeTradeLevels ? formTimeframe.trim() : undefined,
        entryRange: includeTradeLevels ? formEntryRange.trim() : undefined,
        target1: includeTradeLevels ? formTarget1.trim() : undefined,
        target2: includeTradeLevels ? formTarget2.trim() : undefined,
        stopLoss: includeTradeLevels ? formStopLoss.trim() : undefined,
        riskReward: includeTradeLevels ? formRiskReward.trim() : undefined,
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
        setActionFeedback(editingPostId ? 'VIP Post updated successfully.' : 'New VIP update published to private feed!');
        setTimeout(() => setActionFeedback(''), 3500);
      } else {
        setFormError(data.error || 'Failed to save VIP post.');
      }
    } catch (err) {
      setFormError('Network error while communicating with server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete post
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the VIP update:\n\n"${title}"?\n\nVIP members will immediately lose access to this post.`)) {
      return;
    }

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

  // Toggle Pinned status
  const handleTogglePin = async (post: VipPost) => {
    try {
      const res = await fetch(`/api/vip/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !post.pinned })
      });
      const data = await res.json();
      if (res.ok && data.success && data.posts) {
        setPosts(data.posts);
        setActionFeedback(!post.pinned ? 'Post pinned to top of VIP feed.' : 'Post unpinned.');
        setTimeout(() => setActionFeedback(''), 2500);
      }
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  // Filtered posts
  const filteredPosts = posts.filter(post => {
    if (filterType !== 'all' && post.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchBody = (post.body || post.content || '').toLowerCase().includes(q);
      const matchSymbol = post.symbol?.toLowerCase().includes(q);
      if (!matchTitle && !matchBody && !matchSymbol) return false;
    }
    return true;
  });

  const getCategoryColor = (type: VipPostType) => {
    switch (type) {
      case 'research_report':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'alpha_alert':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'spot_signal':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'risk_warning':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'announcement':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'market_update':
      default:
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    }
  };

  // Helper formatting for body
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('vip-body-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setFormBody(prev => prev + prefix + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formBody.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;
    const newBody = formBody.substring(0, start) + replacement + formBody.substring(end);
    setFormBody(newBody);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Control Station */}
      <div className="p-6 rounded-2xl bg-[#070e22] border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>VIP Content Editor &bull; وی آئی پی پوسٹس ایڈیٹر</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                SECURE ACCESS
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono uppercase tracking-tight">
              VIP Content & Updates Manager
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Create, edit, and curate exclusive briefings, technical reports, chart setups, and research dispatches strictly visible to authenticated VIP members.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowKeyManager(!showKeyManager)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-mono font-medium flex items-center gap-2 transition-all"
              title="Manage VIP Access Passcode"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Passcode: <strong className="text-white font-bold">{activeKey}</strong></span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New VIP Post / Update</span>
            </button>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Collapsible Passcode Quick Controller */}
        {showKeyManager && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <form onSubmit={handleUpdatePasscode} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-xs font-mono text-slate-300">
                Active VIP Key for Member Portal:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value.toUpperCase())}
                  className="px-3 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-amber-300 font-mono text-xs tracking-wider uppercase focus:border-amber-400 outline-none w-44"
                  placeholder="NEW PASSCODE"
                />
                <button
                  type="submit"
                  disabled={isUpdatingKey}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold text-xs hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  {isUpdatingKey ? 'Saving...' : 'Update Key'}
                </button>
              </div>
              {keySuccessMsg && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {keySuccessMsg}
                </span>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#060b18] border border-slate-800 text-xs font-mono">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, coin, or keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#030611] border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            All Updates ({posts.length})
          </button>
          <button
            onClick={() => setFilterType('market_update')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'market_update'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            Market Updates
          </button>
          <button
            onClick={() => setFilterType('research_report')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'research_report'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            Research Reports
          </button>
          <button
            onClick={() => setFilterType('alpha_alert')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'alpha_alert'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            Alpha Briefs
          </button>
          <button
            onClick={() => setFilterType('spot_signal')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'spot_signal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            Trade Setups
          </button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-500" />
          <span>Loading secure VIP posts repository...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#060b18] border border-slate-800 text-slate-400 font-mono space-y-3">
          <Crown className="w-8 h-8 text-amber-400/50 mx-auto" />
          <p className="text-sm font-semibold text-white">No VIP posts found matching your criteria</p>
          <p className="text-xs text-slate-500">
            Click &quot;New VIP Post / Update&quot; to draft and dispatch an exclusive report to VIP members.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Create First VIP Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const hasAttachment = Boolean(post.attachmentUrl || post.linkUrl || post.chartUrl);
            const attachmentLink = post.attachmentUrl || post.linkUrl || post.chartUrl;
            const isImage = attachmentLink && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentLink);

            return (
              <div
                key={post.id}
                className={`p-5 rounded-2xl transition-all ${
                  post.pinned
                    ? 'bg-[#081329] border-2 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-[#060b18] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.pinned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-amber-300" /> PINNED TO TOP
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${getCategoryColor(post.type)}`}>
                      {post.type.replace('_', ' ')}
                    </span>
                    {post.symbol && post.symbol !== 'VIP ALPHA' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-cyan-500/20">
                        {post.symbol}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">&bull; {post.author}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleTogglePin(post)}
                      className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                        post.pinned
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title={post.pinned ? 'Unpin from top' : 'Pin to top of VIP stream'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setPreviewPost(post)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Preview how VIP members see this post"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(post)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete post permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  {post.title}
                </h3>

                {/* Body Excerpt */}
                <div className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line line-clamp-3 mb-3">
                  {post.body || post.content}
                </div>

                {/* Link / Attachment Card (if present) */}
                {hasAttachment && (
                  <div className="mb-3 p-3 rounded-xl bg-[#030611] border border-cyan-500/20 flex items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isImage ? (
                        <Image className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-slate-400 font-medium">
                          {post.linkText || (isImage ? 'Attached Chart / Image Asset:' : 'VIP Resource / External Link:')}{' '}
                        </span>
                        <span className="text-cyan-300 underline truncate">{attachmentLink}</span>
                      </div>
                    </div>

                    <a
                      href={attachmentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[11px] flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Optional Trade Matrix if provided */}
                {(post.entryRange || post.target1 || post.stopLoss) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#030611] border border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">ENTRY</span>
                      <span className="font-bold text-white">{post.entryRange || 'Market'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">TARGET 1</span>
                      <span className="font-bold text-emerald-400">{post.target1 || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">TARGET 2</span>
                      <span className="font-bold text-emerald-400">{post.target2 || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">STOP LOSS</span>
                      <span className="font-bold text-rose-400">{post.stopLoss || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT VIP POST ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-[#070e22] border border-cyan-500/30 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#040816]">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                    {editingPostId ? 'Edit Secure VIP Update' : 'Publish New VIP Post / Update'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Content is cryptographically locked to active VIP passcode holders.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePost} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                    Post Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. BTC Macro Liquidity Sweep & Institutional Order Flow Report"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030611] border border-slate-700 text-white font-medium text-sm placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                    Category / Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as VipPostType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030611] border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                  >
                    <option value="market_update">Market Update</option>
                    <option value="research_report">Research Report</option>
                    <option value="alpha_brief">Alpha Brief</option>
                    <option value="spot_signal">Trade Setup / Signal</option>
                    <option value="risk_warning">Risk Warning</option>
                    <option value="announcement">VIP Announcement</option>
                  </select>
                </div>
              </div>

              {/* Body Content Editor with Formatting Helpers */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
                    Post Body / Briefing Content <span className="text-rose-400">*</span>
                  </label>

                  {/* Write vs Preview Toggle */}
                  <div className="flex items-center gap-1 bg-[#030611] p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('write')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        activeEditorTab === 'write' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('preview')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        activeEditorTab === 'preview' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {/* Formatting Quick Insert Toolbar (only visible in write mode) */}
                {activeEditorTab === 'write' && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 p-1.5 rounded-lg bg-[#030611] border border-slate-800 text-[11px] font-mono text-slate-300">
                    <span className="text-slate-500 text-[10px] uppercase mr-1">Insert:</span>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ', '\n')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700"
                    >
                      H3 Header
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold"
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ', '\n')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700"
                    >
                      Bullet
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> **Invalidation Protocol**: ')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300"
                    >
                      Protocol Note
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('1. ')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700"
                    >
                      1. Numbered
                    </button>
                  </div>
                )}

                {/* Editor or Preview Pane */}
                {activeEditorTab === 'write' ? (
                  <textarea
                    id="vip-body-textarea"
                    required
                    rows={8}
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder="Write your comprehensive technical analysis, market thoughts, liquidity review, or member announcement here... Supports markdown formatting."
                    className="w-full px-3.5 py-3 rounded-xl bg-[#030611] border border-slate-700 text-slate-200 font-sans text-sm placeholder-slate-500 focus:border-cyan-400 outline-none leading-relaxed"
                  />
                ) : (
                  <div className="w-full min-h-[200px] max-h-[300px] overflow-y-auto px-4 py-3 rounded-xl bg-[#030611] border border-cyan-500/20 text-slate-200 font-sans text-sm leading-relaxed whitespace-pre-line prose dark:prose-invert">
                    {formBody ? formBody : <span className="text-slate-500 italic">No content entered yet.</span>}
                  </div>
                )}
              </div>

              {/* Optional Link or Attachment URL */}
              <div className="p-4 rounded-xl bg-[#040816] border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase">
                  <Paperclip className="w-4 h-4 text-amber-400" />
                  <span>Optional Link or Attachment URL</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Attach a TradingView chart snapshot, external research PDF, Google Drive link, or image URL.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Link / Attachment URL
                    </label>
                    <div className="relative">
                      <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={formAttachmentUrl}
                        onChange={(e) => setFormAttachmentUrl(e.target.value)}
                        placeholder="https://tradingview.com/x/... or https://..."
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#030611] border border-slate-700 text-cyan-300 font-mono text-xs placeholder-slate-600 focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Custom Link Label / Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={formLinkText}
                      onChange={(e) => setFormLinkText(e.target.value)}
                      placeholder="e.g. View Live TradingView Chart"
                      className="w-full px-3 py-2 rounded-lg bg-[#030611] border border-slate-700 text-white font-mono text-xs placeholder-slate-600 focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                {/* Attachment Preview if URL provided */}
                {formAttachmentUrl && (
                  <div className="p-2.5 rounded-lg bg-[#02040a] border border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">Attachment URL configured:</span>
                    <a
                      href={formAttachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Optional Trade Setup Parameters Toggle */}
              <div className="p-4 rounded-xl bg-[#040816] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTradeLevels}
                      onChange={(e) => setIncludeTradeLevels(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                      Include Trade Execution Levels (Optional)
                    </span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {includeTradeLevels ? 'Active for this post' : 'Hidden for general report'}
                  </span>
                </div>

                {includeTradeLevels && (
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Symbol</label>
                      <input
                        type="text"
                        value={formSymbol}
                        onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
                        placeholder="BTC/USDT"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Direction</label>
                      <select
                        value={formDirection}
                        onChange={(e) => setFormDirection(e.target.value as VipTradeDirection)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                      >
                        <option value="SPOT ACCUMULATION">Spot Accumulation</option>
                        <option value="LONG">Long</option>
                        <option value="SHORT">Short</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Timeframe</label>
                      <input
                        type="text"
                        value={formTimeframe}
                        onChange={(e) => setFormTimeframe(e.target.value)}
                        placeholder="4H / Daily"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Risk / Reward</label>
                      <input
                        type="text"
                        value={formRiskReward}
                        onChange={(e) => setFormRiskReward(e.target.value)}
                        placeholder="1:3.2"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Entry Range</label>
                      <input
                        type="text"
                        value={formEntryRange}
                        onChange={(e) => setFormEntryRange(e.target.value)}
                        placeholder="$64,200 - $65,500"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Target 1</label>
                      <input
                        type="text"
                        value={formTarget1}
                        onChange={(e) => setFormTarget1(e.target.value)}
                        placeholder="$68,800 (+6.5%)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-emerald-400 text-xs outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Target 2</label>
                      <input
                        type="text"
                        value={formTarget2}
                        onChange={(e) => setFormTarget2(e.target.value)}
                        placeholder="$72,400 (+12%)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-emerald-400 text-xs outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Stop Loss</label>
                      <input
                        type="text"
                        value={formStopLoss}
                        onChange={(e) => setFormStopLoss(e.target.value)}
                        placeholder="$62,400 (Daily Close)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#030611] border border-slate-700 text-rose-400 text-xs outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Pin to Top & Author options */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Pin this post to the top of the VIP members feed</span>
                </label>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingPostId ? 'Update VIP Post' : 'Publish VIP Post'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIP MEMBER PREVIEW ================= */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-[#070e22] border border-cyan-500/40 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Crown className="w-4 h-4" />
                <span>Simulated VIP Member Feed Appearance</span>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#030611] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getCategoryColor(previewPost.type)}`}>
                  {previewPost.type.replace('_', ' ')}
                </span>
                <span className="text-slate-500">&bull; {previewPost.author}</span>
                <span className="text-slate-500">&bull; {new Date(previewPost.createdAt).toLocaleDateString()}</span>
              </div>

              <h4 className="text-lg font-bold text-white leading-snug">
                {previewPost.title}
              </h4>

              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans pt-1">
                {previewPost.body || previewPost.content}
              </div>

              {/* Attachment if present */}
              {(previewPost.attachmentUrl || previewPost.linkUrl) && (
                <div className="mt-4 p-3 rounded-lg bg-[#060b18] border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">
                    {previewPost.linkText || 'Attached Resource / Chart'}
                  </span>
                  <a
                    href={previewPost.attachmentUrl || previewPost.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1"
                  >
                    <span>Open Link</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewPost(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-mono text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
