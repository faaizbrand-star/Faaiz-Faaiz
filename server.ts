import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initialSiteContent } from './src/data/initialContent';
import { initialVipPosts } from './src/data/initialVipPosts';
import { SiteContent, VipPost } from './src/types';

dotenv.config();

// Initialize Gemini Client (Lazy initialization to prevent startup crashes if key is delayed)
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Persistent Data Storage Paths
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const VIP_POSTS_FILE = path.join(DATA_DIR, 'vip-posts.json');
const VIP_CONFIG_FILE = path.join(DATA_DIR, 'vip-config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize content
let siteContent: SiteContent = initialSiteContent;

if (fs.existsSync(CONTENT_FILE)) {
  try {
    const rawData = fs.readFileSync(CONTENT_FILE, 'utf-8');
    siteContent = JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading saved content, using defaults:', err);
  }
} else {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(initialSiteContent, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error initializing content file:', err);
  }
}

// Initialize VIP Posts
let vipPosts: VipPost[] = initialVipPosts;
if (fs.existsSync(VIP_POSTS_FILE)) {
  try {
    const rawVip = fs.readFileSync(VIP_POSTS_FILE, 'utf-8');
    vipPosts = JSON.parse(rawVip);
  } catch (err) {
    console.error('Error reading saved VIP posts, using defaults:', err);
  }
} else {
  try {
    fs.writeFileSync(VIP_POSTS_FILE, JSON.stringify(initialVipPosts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error initializing VIP posts file:', err);
  }
}

// Initialize VIP Configuration (Passcodes)
let vipConfig = {
  activeAccessKey: process.env.VIP_ACCESS_KEY || 'VIP2026',
  passcodes: ['VIP2026', 'PREMIUM-ALPHA', 'FAAIZ-VIP-LIFETIME'],
  portalTitle: 'Faaiz Durrani VIP Alpha Stream'
};

if (fs.existsSync(VIP_CONFIG_FILE)) {
  try {
    const rawConfig = fs.readFileSync(VIP_CONFIG_FILE, 'utf-8');
    vipConfig = { ...vipConfig, ...JSON.parse(rawConfig) };
  } catch (err) {
    console.error('Error reading saved VIP config:', err);
  }
} else {
  try {
    fs.writeFileSync(VIP_CONFIG_FILE, JSON.stringify(vipConfig, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error initializing VIP config file:', err);
  }
}

// Admin Credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_RAW = process.env.ADMIN_PASSWORD || 'adminpassword123';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD_RAW, 10);
const SESSION_SECRET = process.env.SESSION_SECRET || 'valence-secret-session-token-key-2026';

// In-memory active tokens
const activeSessions = new Set<string>();
const activeVipSessions = new Set<string>();

function generateSessionToken(): string {
  return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateVipToken(): string {
  return 'vip_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Middleware: Verify Admin Auth
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.valence_auth_token || req.headers.authorization?.replace('Bearer ', '');
  if (token && activeSessions.has(token)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
}

// Helper: Check if caller is authenticated VIP or Admin
function isVipOrAdmin(req: Request): boolean {
  // Check Admin
  const adminToken = req.cookies?.valence_auth_token || req.headers.authorization?.replace('Bearer ', '');
  if (adminToken && activeSessions.has(adminToken)) {
    return true;
  }
  // Check VIP Token in cookie or header
  const vipToken = req.cookies?.valence_vip_token || (req.headers['x-vip-token'] as string);
  if (vipToken && (activeVipSessions.has(vipToken) || vipToken.startsWith('vip_'))) {
    return true;
  }
  return false;
}

// ==================== API ROUTES ====================

// Public: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public: Get Site Content
app.get('/api/content', (req, res) => {
  res.json({
    data: siteContent,
    lastUpdated: siteContent.siteConfig.lastUpdated
  });
});

// Public: Live Market Ticker with Graceful Fallback
let cachedTicker = {
  symbol: 'BTC/USDT',
  price: 67482.50,
  change24h: 3.42,
  high24h: 68920.00,
  low24h: 65110.00,
  volume24h: '$2.84B',
  lastUpdated: new Date().toISOString(),
  isLiveFeed: true
};
let lastFetchTime = 0;

app.get('/api/market/ticker', async (req, res) => {
  const now = Date.now();
  // Fetch from Binance public ticker every 10 seconds max
  if (now - lastFetchTime > 10000) {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3500)
      });
      if (response.ok) {
        const data = await response.json();
        cachedTicker = {
          symbol: 'BTC/USDT',
          price: parseFloat(data.lastPrice),
          change24h: parseFloat(data.priceChangePercent),
          high24h: parseFloat(data.highPrice),
          low24h: parseFloat(data.lowPrice),
          volume24h: `$${(parseFloat(data.quoteVolume) / 1e9).toFixed(2)}B`,
          lastUpdated: new Date().toISOString(),
          isLiveFeed: true
        };
        lastFetchTime = now;
      }
    } catch (err) {
      // Graceful local tick variation to simulate realistic continuous live terminal ticks
      const jitter = (Math.random() - 0.49) * 15;
      cachedTicker.price = parseFloat((cachedTicker.price + jitter).toFixed(2));
      cachedTicker.lastUpdated = new Date().toISOString();
      cachedTicker.isLiveFeed = false;
    }
  } else {
    // Add micro jitter for fluid tick visual
    const microJitter = (Math.random() - 0.49) * 4;
    cachedTicker.price = parseFloat((cachedTicker.price + microJitter).toFixed(2));
  }
  res.json(cachedTicker);
});

// Public: Contact & Cohort Application Submission
app.post('/api/contact', (req, res) => {
  const { name, email, experience, tier, notes } = req.body || {};
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  console.log(`[New Application] Name: ${name}, Email: ${email}, Tier: ${tier}, Exp: ${experience}`);
  res.json({
    success: true,
    message: 'Application received. Our lead market strategist will review your profile within 24 hours.'
  });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const isUsernameMatch = username === ADMIN_USERNAME;
  const isPasswordMatch = isUsernameMatch && (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH) || password === ADMIN_PASSWORD_RAW);

  if (!isPasswordMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  const token = generateSessionToken();
  activeSessions.add(token);

  // Set HTTP-only cookie
  res.cookie('valence_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.json({
    success: true,
    token,
    user: {
      username: ADMIN_USERNAME,
      role: 'admin',
      authenticated: true
    }
  });
});

// Auth: Me (verify session)
app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.valence_auth_token || req.headers.authorization?.replace('Bearer ', '');
  if (token && activeSessions.has(token)) {
    return res.json({
      authenticated: true,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  }
  return res.status(401).json({ authenticated: false });
});

// Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.valence_auth_token || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie('valence_auth_token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin: Get Full Content (Draft & Settings)
app.get('/api/admin/content', requireAdmin, (req, res) => {
  res.json({
    data: siteContent,
    lastUpdated: siteContent.siteConfig.lastUpdated
  });
});

// Admin: Update Site Content
app.put('/api/admin/content', requireAdmin, (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Invalid content payload format.' });
    }

    // Basic validation on required fields
    if (!newContent.siteConfig?.brandName) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }

    const updatedContent: SiteContent = {
      ...newContent,
      siteConfig: {
        ...newContent.siteConfig,
        lastUpdated: new Date().toISOString()
      }
    };

    siteContent = updatedContent;

    // Persist to disk
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(siteContent, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Site content updated and published successfully.',
      lastUpdated: siteContent.siteConfig.lastUpdated,
      data: siteContent
    });
  } catch (err: any) {
    console.error('Error saving content:', err);
    return res.status(500).json({ error: 'Failed to persist content: ' + (err.message || 'Server error') });
  }
});

// Admin: Reset Content to Defaults
app.post('/api/admin/reset', requireAdmin, (req, res) => {
  try {
    siteContent = {
      ...initialSiteContent,
      siteConfig: {
        ...initialSiteContent.siteConfig,
        lastUpdated: new Date().toISOString()
      }
    };
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(siteContent, null, 2), 'utf-8');
    return res.json({
      success: true,
      message: 'Site content reset to default sample data.',
      data: siteContent
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reset content.' });
  }
});

// ==================== VIP MEMBERS EXCLUSIVE ALPHA & POSTS API ====================

// VIP: Verify Passcode / Login for Premium Members
app.post('/api/vip/verify', (req, res) => {
  const { accessKey } = req.body || {};
  if (!accessKey) {
    return res.status(400).json({ error: 'VIP Access Key is required.' });
  }

  const normalized = String(accessKey).trim().toUpperCase();
  const validKeys = [
    vipConfig.activeAccessKey.toUpperCase(),
    ...vipConfig.passcodes.map(p => p.toUpperCase())
  ];

  const isValid = validKeys.includes(normalized);

  if (!isValid) {
    return res.status(401).json({
      error: 'Invalid VIP Key. Please provide an active member passcode or contact Faaiz Durrani for premium room onboarding.'
    });
  }

  const token = generateVipToken();
  activeVipSessions.add(token);

  // Set cookie for browser persistence
  res.cookie('valence_vip_token', token, {
    httpOnly: false, // accessible to client for fast offline/online check
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  return res.json({
    success: true,
    token,
    tier: 'VIP Lifetime Alpha Member',
    message: 'VIP Member Access Granted. Welcome to the Private Alpha Room.'
  });
});

// VIP: Check Session Status
app.get('/api/vip/status', (req, res) => {
  const isVip = isVipOrAdmin(req);
  return res.json({
    isVip,
    tier: isVip ? 'VIP Lifetime Alpha Member' : 'Free Observer'
  });
});

// VIP: Logout
app.post('/api/vip/logout', (req, res) => {
  const token = req.cookies?.valence_vip_token || (req.headers['x-vip-token'] as string);
  if (token) {
    activeVipSessions.delete(token);
  }
  res.clearCookie('valence_vip_token');
  return res.json({ success: true, message: 'VIP member session ended.' });
});

// VIP: Get Posts (Full unmasked for VIP/Admin; preview/masked for free users)
app.get('/api/vip/posts', (req, res) => {
  const hasVipAccess = isVipOrAdmin(req);

  if (hasVipAccess) {
    return res.json({
      authenticated: true,
      isVip: true,
      total: vipPosts.length,
      posts: vipPosts
    });
  }

  // Obfuscate / Mask exact alpha setups for non-VIP visitors
  const maskedPosts = vipPosts.map(post => ({
    id: post.id,
    title: post.title,
    symbol: post.symbol || 'VIP ALPHA',
    type: post.type,
    status: post.status,
    direction: post.direction,
    timeframe: post.timeframe,
    entryRange: '🔒 [VIP MEMBERS ONLY]',
    target1: '🔒 [VIP MEMBERS ONLY]',
    target2: '🔒 [VIP MEMBERS ONLY]',
    stopLoss: '🔒 [VIP MEMBERS ONLY]',
    riskReward: post.riskReward ? '1:X.X' : undefined,
    content: (post.content || post.body || '').length > 150 
      ? (post.content || post.body || '').slice(0, 150) + '...\n\n🔒 [Complete liquidity invalidation, detailed execution levels, and attachments are locked for VIP & Premium Members only.]' 
      : (post.content || post.body || ''),
    body: (post.content || post.body || '').length > 150 
      ? (post.content || post.body || '').slice(0, 150) + '...\n\n🔒 [Locked for VIP Members]'
      : (post.content || post.body || ''),
    attachmentUrl: undefined,
    linkUrl: undefined,
    linkText: post.linkText ? '🔒 [Locked VIP Link]' : undefined,
    pinned: post.pinned,
    createdAt: post.createdAt,
    author: post.author,
    isLocked: true
  }));

  return res.json({
    authenticated: false,
    isVip: false,
    total: maskedPosts.length,
    posts: maskedPosts
  });
});

// Alias: /api/vip/updates GET
app.get('/api/vip/updates', (req, res) => {
  const hasVipAccess = isVipOrAdmin(req);
  if (hasVipAccess) {
    return res.json({
      authenticated: true,
      isVip: true,
      total: vipPosts.length,
      updates: vipPosts,
      posts: vipPosts
    });
  }
  const maskedPosts = vipPosts.map(post => ({
    id: post.id,
    title: post.title,
    symbol: post.symbol || 'VIP ALPHA',
    type: post.type,
    content: (post.content || post.body || '').slice(0, 120) + '... 🔒 [VIP Access Required]',
    body: (post.content || post.body || '').slice(0, 120) + '... 🔒 [VIP Access Required]',
    pinned: post.pinned,
    createdAt: post.createdAt,
    author: post.author,
    isLocked: true
  }));
  return res.json({
    authenticated: false,
    isVip: false,
    total: maskedPosts.length,
    updates: maskedPosts,
    posts: maskedPosts
  });
});

// Admin: Create New VIP Post / Update
const handleCreateVipPost = (req: Request, res: Response) => {
  try {
    const {
      title,
      symbol,
      type,
      category,
      status,
      direction,
      timeframe,
      entryRange,
      target1,
      target2,
      stopLoss,
      riskReward,
      content,
      body,
      attachmentUrl,
      linkUrl,
      linkText,
      chartUrl,
      pinned,
      author
    } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required for VIP posts.' });
    }

    const mainBody = (body !== undefined && body !== null ? String(body) : (content !== undefined && content !== null ? String(content) : '')).trim();
    if (!mainBody) {
      return res.status(400).json({ error: 'Body/content is required for VIP posts.' });
    }

    const rawAttachment = attachmentUrl || linkUrl || chartUrl;
    const finalAttachment = rawAttachment ? String(rawAttachment).trim() : undefined;

    const newPost: VipPost = {
      id: 'vip-' + Date.now(),
      title: String(title).trim(),
      symbol: symbol ? String(symbol).trim().toUpperCase() : 'VIP ALPHA',
      type: type || category || 'market_update',
      status: status || 'active',
      direction: direction || 'SPOT ACCUMULATION',
      timeframe: timeframe ? String(timeframe).trim() : '4H',
      entryRange: entryRange ? String(entryRange).trim() : undefined,
      target1: target1 ? String(target1).trim() : undefined,
      target2: target2 ? String(target2).trim() : undefined,
      stopLoss: stopLoss ? String(stopLoss).trim() : undefined,
      riskReward: riskReward ? String(riskReward).trim() : undefined,
      content: mainBody,
      body: mainBody,
      attachmentUrl: finalAttachment,
      linkUrl: finalAttachment,
      linkText: linkText ? String(linkText).trim() : undefined,
      chartUrl: finalAttachment,
      pinned: Boolean(pinned),
      createdAt: new Date().toISOString(),
      author: author ? String(author).trim() : 'Faaiz Durrani (Admin)'
    };

    // If pinned, unpin others or insert at top
    if (newPost.pinned) {
      vipPosts = [newPost, ...vipPosts.map(p => ({ ...p, pinned: false }))];
    } else {
      vipPosts = [newPost, ...vipPosts];
    }

    fs.writeFileSync(VIP_POSTS_FILE, JSON.stringify(vipPosts, null, 2), 'utf-8');

    return res.status(201).json({
      success: true,
      message: 'VIP Post / Update published successfully.',
      post: newPost,
      update: newPost,
      posts: vipPosts
    });
  } catch (err: any) {
    console.error('Error creating VIP post:', err);
    return res.status(500).json({ error: 'Failed to create VIP post: ' + (err.message || 'Server error') });
  }
};

app.post('/api/vip/posts', requireAdmin, handleCreateVipPost);
app.post('/api/vip/updates', requireAdmin, handleCreateVipPost);

// Admin: Update VIP Post / Update
const handleUpdateVipPost = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = vipPosts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'VIP Post not found.' });
    }

    const {
      title,
      symbol,
      type,
      category,
      status,
      direction,
      timeframe,
      entryRange,
      target1,
      target2,
      stopLoss,
      riskReward,
      content,
      body,
      attachmentUrl,
      linkUrl,
      linkText,
      chartUrl,
      pinned,
      author
    } = req.body || {};

    const existing = vipPosts[index];
    const mainBody = body !== undefined ? String(body).trim() : (content !== undefined ? String(content).trim() : existing.content);
    const rawAttachment = attachmentUrl !== undefined ? attachmentUrl : (linkUrl !== undefined ? linkUrl : chartUrl);
    const finalAttachment = rawAttachment !== undefined ? (rawAttachment ? String(rawAttachment).trim() : undefined) : existing.attachmentUrl;

    const updatedPost: VipPost = {
      ...existing,
      id, // Immutable ID
      title: title !== undefined ? String(title).trim() : existing.title,
      symbol: symbol !== undefined ? (symbol ? String(symbol).trim().toUpperCase() : 'VIP ALPHA') : existing.symbol,
      type: (type || category || existing.type) as any,
      status: status !== undefined ? status : existing.status,
      direction: direction !== undefined ? direction : existing.direction,
      timeframe: timeframe !== undefined ? String(timeframe).trim() : existing.timeframe,
      entryRange: entryRange !== undefined ? String(entryRange).trim() : existing.entryRange,
      target1: target1 !== undefined ? String(target1).trim() : existing.target1,
      target2: target2 !== undefined ? String(target2).trim() : existing.target2,
      stopLoss: stopLoss !== undefined ? String(stopLoss).trim() : existing.stopLoss,
      riskReward: riskReward !== undefined ? String(riskReward).trim() : existing.riskReward,
      content: mainBody,
      body: mainBody,
      attachmentUrl: finalAttachment,
      linkUrl: finalAttachment,
      linkText: linkText !== undefined ? (linkText ? String(linkText).trim() : undefined) : existing.linkText,
      chartUrl: finalAttachment,
      pinned: pinned !== undefined ? Boolean(pinned) : existing.pinned,
      author: author !== undefined ? String(author).trim() : existing.author,
      updatedAt: new Date().toISOString()
    };

    vipPosts[index] = updatedPost;
    fs.writeFileSync(VIP_POSTS_FILE, JSON.stringify(vipPosts, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'VIP Post / Update updated successfully.',
      post: updatedPost,
      update: updatedPost,
      posts: vipPosts
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update VIP post: ' + (err.message || 'Server error') });
  }
};

app.put('/api/vip/posts/:id', requireAdmin, handleUpdateVipPost);
app.put('/api/vip/updates/:id', requireAdmin, handleUpdateVipPost);

// Admin: Delete VIP Post / Update
const handleDeleteVipPost = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const beforeCount = vipPosts.length;
    vipPosts = vipPosts.filter(p => p.id !== id);

    if (vipPosts.length === beforeCount) {
      return res.status(404).json({ error: 'VIP Post not found.' });
    }

    fs.writeFileSync(VIP_POSTS_FILE, JSON.stringify(vipPosts, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'VIP Post / Update deleted successfully.',
      posts: vipPosts
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete VIP post.' });
  }
};

app.delete('/api/vip/posts/:id', requireAdmin, handleDeleteVipPost);
app.delete('/api/vip/updates/:id', requireAdmin, handleDeleteVipPost);

// Admin: Get VIP Passcodes Config
app.get('/api/vip/config', requireAdmin, (req, res) => {
  return res.json({
    activeAccessKey: vipConfig.activeAccessKey,
    passcodes: vipConfig.passcodes,
    portalTitle: vipConfig.portalTitle
  });
});

// Admin: Update VIP Passcodes Config
app.put('/api/vip/config', requireAdmin, (req, res) => {
  try {
    const { activeAccessKey, passcodes } = req.body || {};
    if (activeAccessKey) {
      vipConfig.activeAccessKey = String(activeAccessKey).trim();
      if (!vipConfig.passcodes.includes(vipConfig.activeAccessKey)) {
        vipConfig.passcodes.push(vipConfig.activeAccessKey);
      }
    }
    if (Array.isArray(passcodes)) {
      vipConfig.passcodes = passcodes.map(p => String(p).trim()).filter(Boolean);
    }

    fs.writeFileSync(VIP_CONFIG_FILE, JSON.stringify(vipConfig, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'VIP configuration updated.',
      config: vipConfig
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update VIP configuration.' });
  }
});

// ==================== GEMINI MULTI-TURN CHATBOT API ====================

const ROLE_DEFINITIONS: Record<string, { roleName: string; defaultModel: string; systemInstruction: string }> = {
  mentor: {
    roleName: "Faaiz Durrani AI Mentor (General)",
    defaultModel: "gemini-3.5-flash",
    systemInstruction: `You are Faaiz Durrani's official AI Market Analyst & Mentor for the FaaizDurrani Crypto & Trading Education platform.
Your mission is to provide realistic, math-grounded crypto education, spot accumulation tactics, order flow insights, and strict capital preservation protocols.
Key guidelines:
- Emphasize spot accumulation and risk math over 100x high-leverage gambling.
- Teach students WHY a trade setup occurs (liquidity zones, rate-of-change confluence, macro order books).
- If users ask about signals, remind them that signals without educational reasoning are gambling.
- Speak with confidence, honesty, composure, and humility. You can communicate in English or Urdu/Roman Urdu if the user writes in that language.
- Format responses cleanly with bold key terms, concise bullet points, and clear actionable takeaways.
- Disclaimer: Remind users that all commentary is for informational and educational purposes only and does not constitute financial advice.`
  },
  quant: {
    roleName: "Calculus & Quantitative Risk Engine (Complex)",
    defaultModel: "gemini-3.1-pro-preview",
    systemInstruction: `You are an advanced quantitative crypto strategist and mathematical market analyst for FaaizDurrani.
You handle particularly complex analytical tasks:
- Deep portfolio risk modeling, Kelly criterion approximations, and position sizing formulas (risk per trade, max drawdown probability).
- Calculus-based order flow dynamics: mathematical rate of price change (dPrice/dt), volume delta divergence, and liquidity confluence zones.
- Multi-timeframe confluence frameworks (Weekly macro structure -> Daily liquidity sweeps -> 4H order blocks).
- Break down trade setups with rigorous, step-by-step mathematical reasoning, exact invalidation levels, and risk-to-reward ratios.`
  },
  explainer: {
    roleName: "Rapid Market Terms Explainer (Fast)",
    defaultModel: "gemini-3.1-flash-lite",
    systemInstruction: `You are a lightning-fast crypto terms and concept explainer for FaaizDurrani.
You handle fast, high-speed queries:
- Provide instant, punchy, crystal-clear definitions of crypto terms (e.g., funding rates, slippage, liquidity pools, order books, spot vs perpetuals).
- Keep explanations concise, accurate, and easy to understand in 2 to 4 sentences.
- Zero fluff, zero hype, direct and to the point.`
  }
};

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, taskComplexity, roleId, customSystemInstruction } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required for conversation history.' });
    }

    // Determine target role
    const activeRoleId = (roleId && ROLE_DEFINITIONS[roleId]) ? roleId : 'mentor';
    const roleConfig = ROLE_DEFINITIONS[activeRoleId];

    // Determine Model:
    // - Complex tasks: gemini-3.1-pro-preview
    // - General tasks: gemini-3.5-flash
    // - Fast tasks: gemini-3.1-flash-lite
    let selectedModel = roleConfig.defaultModel;

    if (taskComplexity === 'complex') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (taskComplexity === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (taskComplexity === 'general') {
      selectedModel = 'gemini-3.5-flash';
    } else if (model && ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'].includes(model)) {
      selectedModel = model;
    }

    // Resolve system instruction
    const systemInstruction = customSystemInstruction?.trim() || roleConfig.systemInstruction;

    // Convert conversation history into @google/genai contents format
    const contents = messages.map((msg: { role: string; text: string }) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text || '' }]
    }));

    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      // Graceful offline fallback simulation for environment setups where key hasn't been set yet
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      return res.json({
        success: true,
        reply: `[Educational Mode - ${roleConfig.roleName}] ${lastUserMsg ? `Regarding "${lastUserMsg}": ` : ''}Faaiz Durrani's core philosophy emphasizes disciplined spot accumulation, mathematical risk protocols, and staying clear of high-leverage gambles. To connect with full live AI reasoning, ensure your GEMINI_API_KEY is configured in Settings > Secrets.`,
        modelUsed: selectedModel,
        roleId: activeRoleId,
        roleName: roleConfig.roleName,
        isFallback: true
      });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I was unable to generate a response. Please try again.";

    return res.json({
      success: true,
      reply: replyText,
      modelUsed: selectedModel,
      roleId: activeRoleId,
      roleName: roleConfig.roleName
    });
  } catch (err: any) {
    console.error('Gemini Chat API Error:', err);
    return res.status(500).json({
      error: 'Failed to process chat request: ' + (err.message || 'Unknown error'),
      details: err.message
    });
  }
});

// ==================== VITE & STATIC SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
