import React from 'react';

const GateFidelity = ({ data }) => {
  const real = data?.realScores;

  const metrics = real ? [
    { name: 'Quantum Score (Weighted)', value: real.quantumScore, color: 'bg-primary-cyan' },
    { name: 'Trend Strength (EMA Cross)', value: real.trendScore, color: 'bg-[#00FFC8]' },
    { name: 'Momentum (RSI 14)', value: real.momentumScore, color: 'bg-[#00dbe7]' },
    { name: 'Volatility (ATR)', value: real.volatilityScore, color: 'bg-tertiary-magenta' }
  ] : data?.gates.map(g => ({ name: g.name, value: g.fidelity, color: 'bg-primary-cyan' }));

  return (
    <div className="col-span-4 row-span-3 glass-panel p-4 flex flex-col">
      <h2 className="font-space-grotesk font-bold text-white uppercase text-xs tracking-widest mb-6">QUANTUM ALGO METRICS</h2>
      
      <div className="space-y-4 flex-1">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1 uppercase">
              <span>{metric.name}</span>
              <span className="text-white font-bold">{metric.value.toFixed(2)} / 100</span>
            </div>
            <div className="h-1 bg-gray-800 rounded overflow-hidden">
              <div 
                className={`h-full ${metric.color} shadow-[0_0_4px_currentColor] transition-all duration-1000`} 
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="invisible-border p-2 text-center bg-gray-900/50">
          <div className="text-[10px] text-gray-400 uppercase tracking-tighter">LATEST CLOSE</div>
          <div className="text-lg font-space-grotesk font-black text-white">
            ${real?.latestClose?.toLocaleString() || "0.00"}
          </div>
        </div>
        <div className="invisible-border p-2 text-center bg-gray-900/50">
          <div className="text-[10px] text-gray-400 uppercase tracking-tighter">FINAL DECISION</div>
          <div className={`text-sm font-space-grotesk font-black ${
            ['STRONG_BUY','BUY'].includes(real?.decision?.finalDecision)   ? 'text-secondary-jade' : 
            ['STRONG_SELL','SELL','WEAK_SELL'].includes(real?.decision?.finalDecision) ? 'text-tertiary-magenta' : 
            'text-primary-cyan'
          }`}>
            {real?.decision?.finalDecision || real?.signal || 'HOLD'}
          </div>
          <div className="text-[8px] text-gray-500 mt-0.5 font-mono">
            SCORE: {real?.decision?.decisionScore >= 0 ? '+' : ''}{real?.decision?.decisionScore ?? '—'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GateFidelity;