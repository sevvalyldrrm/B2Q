import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Eye } from 'lucide-react';

const VaultSummary = ({ data, onOptimize, isOptimizing }) => {
  const allocationData = data?.allocation || [
    { name: 'Quantum Hedge', value: 42100, color: 'rgb(0, 242, 255)', colorClass: 'text-primary-cyan' },
    { name: 'Spot Assets', value: 36321.42, color: 'rgb(0, 255, 200)', colorClass: 'text-secondary-jade' },
    { name: 'Risk Exposure', value: 1402.10, color: 'rgb(255, 46, 99)', colorClass: 'text-tertiary-magenta' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Portfolio Balance */}
      <div className="glass-panel p-6 invisible-border">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-space-grotesk">Total Estimated Balance</span>
          <Eye className="text-primary-cyan w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-space-grotesk text-white">1.240582</span>
          <span className="text-xl font-bold text-gray-400 font-space-grotesk">BTC</span>
        </div>
        <div className="text-sm text-secondary-jade mt-1">
          ${data?.balance || '78,421.42'} 
          <span className="ml-2 text-[10px] bg-secondary-jade/10 text-secondary-jade px-1 rounded-sm">+2.4%</span>
        </div>
      </div>
      
      {/* Portfolio Allocation - Real Pie Chart */}
      <div className="lg:col-span-2 glass-panel p-6 invisible-border flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                cursor={false} 
                contentStyle={{ backgroundColor: '#0B0E11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '11px' }} 
                itemStyle={{ color: '#fff' }} 
              />
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={76}
                paddingAngle={5}
                stroke="none"
                dataKey="value"
                style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 242, 255, 0.3))' }}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-space-grotesk text-gray-400">Coverage</span>
            <span className="text-xl font-bold font-space-grotesk text-primary-cyan">{isOptimizing ? '99.1%' : '94.2%'}</span>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {allocationData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs uppercase text-gray-400">{item.name}</span>
              </div>
              <div className={`text-lg font-bold font-space-grotesk ${item.name === 'Risk Exposure' ? item.colorClass : 'text-white'}`}>
                ${item.value.toLocaleString()}
              </div>
            </div>
          ))}
          <div className="flex items-end">
            <button 
              onClick={onOptimize}
              disabled={isOptimizing}
              className={`w-full py-2 font-space-grotesk font-bold text-xs uppercase tracking-tighter transition-all ${
                isOptimizing 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50' 
                  : 'bg-primary-cyan text-[#0B0E11] hover:brightness-110'
              }`}
            >
              {isOptimizing ? 'CALCULATING...' : 'Optimize Vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultSummary;
