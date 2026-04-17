// Mock data for Q-Sentinel Strategy Dashboard
export const mockAgentHubData = {
  header: {
    totalCompute: '14.2 PFLOPS',
    activeAgents: '03 / 03'
  },
  agents: [
    {
      type: 'analyst',
      name: 'ANALYST',
      status: 'scanning',
      logs: [
        { timestamp: '08:22:11', message: 'Initializing market depth analysis...' },
        { timestamp: '08:22:14', message: 'Scanning CEX order books for liquidity clusters...' },
        { timestamp: '08:22:18', message: 'Detected anomaly in SOL/USDC perp spread.' },
        { timestamp: '08:22:21', message: 'Calculating fractal volatility coefficients...' },
        { timestamp: '08:22:25', message: 'Cross-referencing sentiment via Quantum NLP...' },
        { timestamp: '08:22:30', message: 'Analyst: Evaluating volatility thresholds...' },
        { timestamp: '08:22:34', message: 'Sentiment Score: 0.68 (Cautious Optimism)' },
        { timestamp: '08:22:40', message: 'Compiling recommendation packet for Verify Node...' }
      ],
      sparkline: [
        { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, 
        { value: 30 }, { value: 55 }, { value: 40 }, { value: 60 }, 
        { value: 45 }, { value: 50 }
      ]
    },
    {
      type: 'verify',
      name: 'VERIFY',
      status: 'validating',
      logs: [
        { timestamp: '08:22:42', message: 'Packet received from Analyst Node...' },
        { timestamp: '08:22:44', message: 'Running Monte Carlo simulation (N=100,000)...' },
        { timestamp: '08:22:49', message: 'Probability of success: 72.4%' },
        { timestamp: '08:22:51', message: 'Checking smart contract integrity for SOL vaults...' },
        { timestamp: '08:22:55', message: 'Simulating slippage on $2.5M notional...' },
        { timestamp: '08:22:58', message: 'Verify: Confirming risk-to-reward parameters...' },
        { timestamp: '08:23:02', message: 'Maximum drawdown limit: 0.05%' },
        { timestamp: '08:23:08', message: 'Finalizing execution hash: 0x4f...a29' }
      ],
      sparkline: [
        { value: 30 }, { value: 25 }, { value: 40 }, { value: 35 }, 
        { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }, 
        { value: 70 }, { value: 65 }
      ]
    },
    {
      type: 'trader',
      name: 'TRADER',
      status: 'armed',
      logs: [
        { timestamp: '08:23:10', message: 'Execution signal received: LONG SOL/USDC' },
        { timestamp: '08:23:12', message: 'Connecting to Hyperliquid L1...' },
        { timestamp: '08:23:15', message: 'Routing order through Jupiter Aggregator...' },
        { timestamp: '08:23:19', message: 'Trader: Initiating market-neutral hedge...' },
        { timestamp: '08:23:22', message: 'Order sent: 12,450 SOL @ $142.11' },
        { timestamp: '08:23:28', message: 'Updating Vault state and global TVL...' },
        { timestamp: '08:23:32', message: 'Monitoring position health...' },
        { timestamp: '08:23:40', message: 'Awaiting next pulse from Analyst Node...' }
      ],
      sparkline: [
        { value: 40 }, { value: 30 }, { value: 50 }, { value: 45 }, 
        { value: 35 }, { value: 55 }, { value: 65 }, { value: 60 }, 
        { value: 75 }, { value: 70 }
      ]
    }
  ],
  stats: {
    entropy: 0.68,
    simConfidence: 94.8,
    pnl: '+$1,240.22',
    systemHealth: 'Nominal'
  }
};

export const mockVaultData = {
  balance: '78,421.42',
  allocation: [
    { name: 'Quantum Hedge', value: 42100, color: '#00F2FF' },
    { name: 'Spot Assets', value: 36321.42, color: '#00FFC8' },
    { name: 'Risk Exposure', value: 1402.10, color: '#FF2E63' }
  ],
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: '1.24058200',
      usdValue: '$78,421.42',
      marketPrice: '$63,212.10',
      priceChange: '+1.24%',
      priceChangeColor: 'text-secondary-jade',
      classicalRisk: '12.4%',
      quantumRisk: '0.02%',
      quantumRiskColor: 'text-primary-cyan',
      aiAction: 'Hedge Active',
      aiActionColor: 'bg-secondary-jade/10 border-secondary-jade/30 text-secondary-jade',
      actions: ['Trade', 'Details']
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '14.32000000',
      usdValue: '$48,211.12',
      marketPrice: '$3,366.50',
      priceChange: '-0.82%',
      priceChangeColor: 'text-tertiary-magenta',
      classicalRisk: '18.1%',
      quantumRisk: '0.14%',
      quantumRiskColor: 'text-primary-cyan',
      aiAction: 'Auto-Compounding',
      aiActionColor: 'bg-secondary-jade/10 border-secondary-jade/30 text-secondary-jade',
      actions: ['Trade', 'Details']
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: '450.00000000',
      usdValue: '$65,250.00',
      marketPrice: '$145.00',
      priceChange: '+5.11%',
      priceChangeColor: 'text-secondary-jade',
      classicalRisk: '24.5%',
      quantumRisk: '4.82%',
      quantumRiskColor: 'text-tertiary-magenta',
      aiAction: 'Action Required',
      aiActionColor: 'bg-tertiary-magenta/10 border-tertiary-magenta/30 text-tertiary-magenta',
      actions: ['Hedge Now', 'Details']
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '12,500.00',
      usdValue: '$12,500.00',
      marketPrice: '$1.00',
      priceChange: '0.00%',
      priceChangeColor: 'text-gray-500',
      classicalRisk: '0.05%',
      quantumRisk: '0.01%',
      quantumRiskColor: 'text-primary-cyan',
      aiAction: 'Idle',
      aiActionColor: 'bg-gray-800 border-gray-700 text-gray-400',
      actions: ['Swap', 'Details']
    }
  ],
  insights: {
    correlationRisk: {
      title: 'Cross-Chain Correlation Risk',
      description: 'Detected high correlation between SOL and ETH positions. AI suggests rebalancing 12% into BTC to maintain Quantum Stability Index.',
      shieldLevel: 82
    },
    quantumShield: {
      title: 'Quantum Shield Protocol',
      description: 'Vault currently utilizing 82% of available quantum-resistant entropy. All assets are behind Level 4 obfuscation.',
      shieldLevel: 82
    }
  }
};

export const mockQuantumData = {
  logs: [
    { iteration: 'ITERATION_084', delta: 'Δ0.00012' },
    { iteration: 'ITERATION_083', delta: 'Δ0.00034' },
    { iteration: 'ITERATION_082', delta: 'Δ0.00089' },
    { iteration: 'ITERATION_081', delta: 'Δ0.00121' },
    { iteration: 'ITERATION_080', delta: 'Δ0.00256' },
    { iteration: 'ITERATION_079', delta: 'Δ0.00412' },
    { iteration: 'ITERATION_078', delta: 'Δ0.00555' },
    { iteration: 'ITERATION_077', delta: 'Δ0.00890' }
  ],
  gates: [
    { name: 'Hadamard (H)', fidelity: 99.992 },
    { name: 'Pauli-X', fidelity: 99.987 },
    { name: 'CNOT (2-Qubit)', fidelity: 98.452 },
    { name: 'Toffoli (3-Qubit)', fidelity: 96.110 }
  ],
  convergence: [
    { iteration: 0, convergence: 80 },
    { iteration: 20, convergence: 70 },
    { iteration: 40, convergence: 40 },
    { iteration: 80, convergence: 15 },
    { iteration: 100, convergence: 10 }
  ],
  qubits: [
    { qubit: 'Q0', coherence: 80 },
    { qubit: 'Q1', coherence: 85 },
    { qubit: 'Q2', coherence: 70 },
    { qubit: 'Q3', coherence: 92 },
    { qubit: 'Q4', coherence: 75 },
    { qubit: 'Q5', coherence: 60 },
    { qubit: 'Q6', coherence: 88 },
    { qubit: 'Q7', coherence: 95 },
    { qubit: 'Q8', coherence: 72 },
    { qubit: 'Q9', coherence: 80 },
    { qubit: 'Q10', coherence: 85 },
    { qubit: 'Q11', coherence: 90 }
  ]
};

export const mockStrategyData = {
  // Summary Cards Data
  summaryCards: {
    portfolioValue: {
      value: "$1,482,904.32",
      change: "+4.28%",
      period: "24H",
      trend: "up"
    },
    quantumVar: {
      value: "0.0241%",
      confidence: "EXTREME",
      level: 99
    },
    globalSentiment: {
      value: "BULLISH",
      score: 78,
      maxScore: 100
    },
    activeHedges: {
      value: "14 Units",
      coverage: "92%",
      risk: "low"
    }
  },

  // Hybrid Risk Chart Data
  riskChart: {
    classical: [
      { time: "T-48H", value: 0.08 },
      { time: "T-36H", value: 0.12 },
      { time: "T-24H", value: 0.15 },
      { time: "T-12H", value: 0.18 },
      { time: "Current", value: 0.22 },
      { time: "T+12H", value: 0.20 },
      { time: "T+24H", value: 0.18 },
      { time: "T+36H", value: 0.16 },
      { time: "T+48H", value: 0.14 }
    ],
    quantum: [
      { time: "T-48H", value: 0.05 },
      { time: "T-36H", value: 0.08 },
      { time: "T-24H", value: 0.12 },
      { time: "T-12H", value: 0.25 },
      { time: "Current", value: 0.35 },
      { time: "T+12H", value: 0.28 },
      { time: "T+24H", value: 0.22 },
      { time: "T+36H", value: 0.18 },
      { time: "T+48H", value: 0.15 }
    ],
    crashAlert: {
      time: "T-12H",
      value: 0.25,
      severity: "CRASH_ALERT_SIGMA_5"
    },
    metrics: {
      volatilityIndex: {
        value: 14.28,
        change: "-2.1%",
        trend: "down"
      },
      modelDrift: {
        value: "0.002%",
        status: "LOCKED"
      }
    }
  },

  // AI Agents Data
  agents: [
    {
      id: 1,
      name: "Sentinel_Analyst",
      type: "analyst",
      status: "ACTIVE_SCANNING",
      activity: "Monitoring cross-chain liquidity pools for volatility spikes.",
      icon: "query_stats",
      color: "primary"
    },
    {
      id: 2,
      name: "Sentinel_Verify",
      type: "verifier",
      status: "VALIDATING_TX",
      activity: "Validating oracle feeds against quantum probability curves.",
      icon: "verified_user",
      color: "secondary"
    },
    {
      id: 3,
      name: "Sentinel_Trader",
      type: "trader",
      status: "EXECUTING_HEDGES",
      activity: "Awaiting high-confidence trigger on BTC/USDT pair.",
      icon: "trending_up",
      color: "tertiary"
    }
  ],

  // Order History Data
  orderHistory: [
    {
      id: 1,
      symbol: "BTC/USDT",
      side: "BUY",
      amount: "4.2019 BTC",
      reason: "Quantum Sentiment Spike > 0.82",
      timestamp: "2024-05-20 14:10:02",
      status: "Fulfilled"
    },
    {
      id: 2,
      symbol: "ETH/USDT",
      side: "SELL",
      amount: "120.44 ETH",
      reason: "VaR Threshold Breach (Hedge Trigger)",
      timestamp: "2024-05-20 13:45:12",
      status: "Fulfilled"
    },
    {
      id: 3,
      symbol: "SOL/USDT",
      side: "BUY",
      amount: "842.10 SOL",
      reason: "L2 Liquidity Inflow Detected",
      timestamp: "2024-05-20 12:22:58",
      status: "Pending"
    },
    {
      id: 4,
      symbol: "LINK/USDT",
      side: "SELL",
      amount: "2400.00 LINK",
      reason: "Oracle Latency Arbitrage Opportunity",
      timestamp: "2024-05-20 11:05:41",
      status: "Fulfilled"
    }
  ]
};
