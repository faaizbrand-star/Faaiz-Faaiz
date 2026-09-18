import { VipPost } from '../types';

export const initialVipPosts: VipPost[] = [
  {
    id: 'vip-post-1',
    title: 'BTC Macro Liquidity Sweep & Spot Accumulation Zone',
    symbol: 'BTC/USDT',
    type: 'spot_signal',
    status: 'active',
    direction: 'SPOT ACCUMULATION',
    timeframe: 'Daily / 4H Confluence',
    entryRange: '$64,200 - $65,500',
    target1: '$68,800 (+6.5%)',
    target2: '$72,400 (+12.1%)',
    stopLoss: '$62,400 (Daily Close Below)',
    riskReward: '1:3.4',
    content: `### Setup Breakdown & Technical Thesis
We observed a clean sweep of the $64,800 sell-side liquidity pool on the 4-hour chart followed by strong spot absorption volume on major order books.

1. **Spot Volume Delta**: Cumulative volume delta (CVD) divergence formed over the weekend while open interest decreased by 4.2%, signaling organic spot accumulation rather than over-leveraged long chasing.
2. **Invalidation Protocol**: A daily candle body close under $62,400 breaks the higher-low market structure. Do not average down if this level fails.
3. **Execution Directive**: Spot only. Allocate maximum 15% of your available liquidity across two laddered limit buy orders at $65,200 and $64,500.`,
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    author: 'Faaiz Durrani (Admin)'
  },
  {
    id: 'vip-post-2',
    title: 'SOL Bullish Order Block Retest & Demand Defense',
    symbol: 'SOL/USDT',
    type: 'alpha_alert',
    status: 'hit_target',
    direction: 'SPOT ACCUMULATION',
    timeframe: '4H',
    entryRange: '$178.50 - $182.00',
    target1: '$198.00 (HIT +9.5%)',
    target2: '$214.00',
    stopLoss: '$171.00',
    riskReward: '1:3.8',
    content: `### Post-Trade Review & Strategy
Target 1 at **$198.00** has officially been hit with clean follow-through (+9.5% spot gain).

- **Move Stop-Loss to Breakeven**: Protect your initial capital at $182.00.
- **De-risk**: Take 50% profit off the table and let the runner ride toward Target 2 ($214.00).
- Remember: Capital preservation is the single most important rule in crypto. Never let a green trade turn into a red one.`,
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    author: 'Faaiz Durrani (Admin)'
  },
  {
    id: 'vip-post-3',
    title: 'ETH / BTC Ratio Liquidity Rotation Alert',
    symbol: 'ETH/USDT',
    type: 'market_update',
    status: 'active',
    direction: 'SPOT ACCUMULATION',
    timeframe: 'Daily',
    entryRange: '$3,380 - $3,450',
    target1: '$3,720 (+8.2%)',
    target2: '$3,950 (+14.8%)',
    stopLoss: '$3,260',
    riskReward: '1:3.1',
    content: `### Macro Ratio Confluence
The ETH/BTC pair has reached multi-month demand support around 0.051. Historically, when BTC dominance hits resistance above 58%, institutional spot rotations trickle into Ethereum.

- Accumulate in layers.
- Do not use 20x or 50x leverage on Binance or Bybit futures; high funding rates will bleed your balance. Keep this clean spot.`,
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
    author: 'Faaiz Durrani (Admin)'
  },
  {
    id: 'vip-post-4',
    title: 'High-Leverage Liquidation Cluster Warning',
    symbol: 'MARKET ALPHA',
    type: 'risk_warning',
    status: 'active',
    timeframe: 'Immediate',
    content: `### High Volatility Advisory
Estimated $1.2B in concentrated 50x-100x long leverage is stacked between $66,000 and $66,800. Market makers often push wicked sweeps into these clusters before authentic trend continuation.

- **Action Required**: Cancel speculative loose market orders.
- Maintain minimum 30% cash/USDT reserve for deep flash wick dip buying.`,
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 70).toISOString(),
    author: 'Faaiz Durrani (Admin)'
  }
];
