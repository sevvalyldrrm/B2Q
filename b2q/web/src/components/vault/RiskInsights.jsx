import React from 'react';
import { Activity, Shield } from 'lucide-react';

const RiskInsights = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Insight 1 - Cross-Chain Correlation Risk */}
      <div className="glass-panel p-6 flex gap-4 invisible-border">
        <div className="w-12 h-12 bg-primary-cyan/10 flex items-center justify-center flex-shrink-0">
          <Activity className="w-6 h-6 text-primary-cyan" />
        </div>
        <div>
          <h3 className="font-space-grotesk font-bold text-sm uppercase text-primary-cyan">Cross-Chain Correlation Risk</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Detected high correlation between SOL and ETH positions. AI suggests rebalancing 12% into BTC to maintain Quantum Stability Index.
          </p>
          <div className="mt-4 flex gap-4">
            <button className="text-[10px] font-bold uppercase tracking-widest text-secondary-jade">View Correlation Map</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dismiss</button>
          </div>
        </div>
      </div>
      
      {/* Insight 2 - Quantum Shield Protocol */}
      <div className="glass-panel p-6 flex gap-4 invisible-border border-l-2 border-primary-cyan/30">
        <div className="w-12 h-12 bg-secondary-jade/10 flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-secondary-jade" />
        </div>
        <div>
          <h3 className="font-space-grotesk font-bold text-sm uppercase text-secondary-jade">Quantum Shield Protocol</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Vault currently utilizing 82% of available quantum-resistant entropy. All assets are behind Level 4 obfuscation.
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-800 h-1">
              <div className="bg-secondary-jade h-full w-[82%]"></div>
            </div>
            <div className="flex justify-between mt-1 text-[8px] uppercase tracking-tighter text-gray-400">
              <span>Shield Integrity: Optimal</span>
              <span>82% Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskInsights;
