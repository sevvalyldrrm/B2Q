import React, { useState } from 'react';
import { Bitcoin, Coins, Waves, CircleDollarSign, Search } from 'lucide-react';

const AssetLedger = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const getAssetIcon = (symbol) => {
    switch(symbol) {
      case 'BTC': return Bitcoin;
      case 'ETH': return Coins;
      case 'SOL': return Waves;
      case 'USDC': return CircleDollarSign;
      default: return CircleDollarSign;
    }
  };

  const getAssetIconColor = (symbol) => {
    switch(symbol) {
      case 'BTC': return 'text-orange-400';
      case 'ETH': return 'text-indigo-400';
      case 'SOL': return 'text-cyan-300';
      case 'USDC': return 'text-blue-400';
      default: return 'text-white';
    }
  };
  const assets = data?.assets || [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: Bitcoin,
      iconColor: 'text-orange-400',
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
      icon: Coins,
      iconColor: 'text-indigo-400',
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
      icon: Waves,
      iconColor: 'text-cyan-300',
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
      icon: CircleDollarSign,
      iconColor: 'text-blue-400',
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
  ];

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel overflow-hidden invisible-border">
      <div className="px-6 py-4 invisible-border flex justify-between items-center">
        <h2 className="font-space-grotesk font-bold text-sm tracking-widest uppercase text-white">Asset Ledger</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              className="bg-transparent border border-white/10 text-xs pl-8 pr-4 py-1.5 focus:ring-1 focus:ring-primary-cyan w-48 text-white placeholder:text-gray-600" 
              placeholder="Search Assets" 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-500" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input className="bg-transparent border-white/20 text-primary-cyan rounded-sm focus:ring-0 cursor-pointer" type="checkbox" />
            <span className="text-[10px] uppercase text-gray-400">Hide 0 Balance</span>
          </label>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-space-grotesk">
              <th className="px-6 py-4 font-medium">Asset Name</th>
              <th className="px-6 py-4 font-medium text-right">Total Balance</th>
              <th className="px-6 py-4 font-medium text-right">Market Price</th>
              <th className="px-6 py-4 font-medium text-right">Classical Risk %</th>
              <th className="px-6 py-4 font-medium text-right text-gray-400">Quantum Risk %</th>
              <th className="px-6 py-4 font-medium text-center">AI Action</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredAssets.map((asset, index) => {
              const Icon = getAssetIcon(asset.symbol);
              return (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${getAssetIconColor(asset.symbol)}`} />
                      </div>
                      <div>
                        <div className="font-bold font-space-grotesk">{asset.symbol}</div>
                        <div className="text-[10px] text-gray-400">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold">{asset.balance}</div>
                    <div className="text-[10px] text-gray-400">{asset.usdValue}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium">{asset.marketPrice}</div>
                    <div className={`text-[10px] ${asset.priceChangeColor}`}>{asset.priceChange}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs">{asset.classicalRisk}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs font-bold">
                    <span className={asset.quantumRiskColor}>{asset.quantumRisk}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-2 py-0.5 ${asset.aiActionColor} text-[9px] uppercase font-bold`}>
                        {asset.aiAction}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-cyan text-xs font-bold hover:underline">{asset.actions[0]}</button>
                    <button className="ml-3 text-gray-400 text-xs hover:text-white">{asset.actions[1]}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetLedger;
