# VALENCE TRADING LABS &bull; Quantitative Market Education Platform

A production-quality, responsive single-page web platform and content management architecture for modern crypto and trading education.

---

## ⚡ Key Highlights

- **Aesthetic & Visual Direction**: Deep navy/near-black theme (`#040711`), subtle blueprint grid background, electric cyan/teal accents, high-contrast monospace data displays, and refined sans-serif typography.
- **Interactive Terminal**: Real-time style market widget with orderbook depth simulation, interactive timeframe toggles (1H, 4H, 1D, 1W), and Candlestick/Area mode switching.
- **Spot Results Showcase**: Top 3 ranked spot market case studies with detailed metrics (Entry, Exit, Gain %, Hold Time, Thesis, Status, and transparent sample disclosure tags).
- **Membership Cohorts**: Dynamic Monthly / Quarterly discount billing toggle, feature checklists, and cohort application flow.
- **Philosophical Four Pillars**: Sharp editorial cards centering on first-principles execution, risk management, and zero-hype learning.
- **Founder Trust Section**: Strategist background (Faiz Durrani), verified credential badges, direct philosophy quote, and official analytical channels.
- **Accessible Accordion FAQ**: Categorized accordion with ARIA attributes and category filtering tabs.
- **Integrated Admin CMS**: Secure authentication with hashed password verification, session cookies, and a multi-tab visual dashboard to edit copy, pricing, stats, case studies, and legal disclosures without touching code.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | Username for the `/admin` portal | `admin` |
| `ADMIN_PASSWORD` | Password for the `/admin` portal | `adminpassword123` |
| `SESSION_SECRET` | Secret token used for signing sessions | `valence_secure_session_secret_change_in_prod` |
| `PORT` | Local and production binding port | `3000` |

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build and Production Run
```bash
npm run build
npm start
```

---

## 🔐 Admin Console & Content Management

The platform includes a dedicated, secure content management console matching the dark terminal aesthetic.

### Accessing the Admin Console:
1. Navigate directly to `/admin` or `#admin`.
2. Alternatively, click the discreet **"Admin login"** link in the footer or the small floating lock icon in the lower-right corner.
3. Login using the credentials defined in `.env` (Default: `admin` / `adminpassword123`).

### Features Available in Admin:
- **Hero & Branding**: Update site name, headlines, eyebrows, and CTA links.
- **Credibility Stats**: Edit numerical metrics, labels, and context.
- **Performance Manager**: Add new spot case studies, edit entry/exit prices, toggle Top 3 badge ranking, and manage sample demo flags.
- **Membership Plans**: Configure monthly and quarterly pricing tiers, savings percentages, and feature lists.
- **Four Pillars**: Modify why-us editorial cards and icons.
- **Live Market Feed**: Update instrument labels and disclaimer texts.
- **Founder Profile**: Edit bio text, philosophy quote, credentials, and social links.
- **FAQ Manager**: Add, edit, reorder, and categorize questions.
- **Legal & Disclaimers**: Update the statutory risk disclosure and educational notice.
- **Instant Publish**: Click **"Save & Publish"** to persist updates immediately to disk (`data/site-content.json`) and synchronize live visitors.
- **Reset to Defaults**: Restore original factory sample content at any time.

---

## 📈 Real-Time Market Data Integration

The platform includes a resilient backend proxy (`/api/market/ticker`) that connects to public cryptocurrency market oracles (e.g. Binance BTCUSDT) with automated fallback to mathematical micro-jitter simulation if the oracle is unreachable or rate-limited. This ensures that the chart and tickers never crash or show broken layouts to visitors.

---

## 🛡️ Security & Compliance

- **No Exposed API Keys**: Sensitive operations and external fetches happen exclusively on the server side.
- **Strict Compliance Notices**: Prominent financial risk disclosures and educational-only disclaimers are placed throughout performance cards and the global footer.
- **Modern Semantics**: Accessible buttons, keyboard navigation on accordions, SVG visuals, and fully responsive layout spanning 320px mobile up to 4K ultra-wide displays.
