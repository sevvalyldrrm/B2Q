import React, { useState, useEffect } from 'react';
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine } from 'recharts';
import { api } from '../../services/api';

const HybridRiskChart = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getRiskChartData();
        setRiskData(data);
      } catch (error) {
        console.error('Failed to fetch risk chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="lg:col-span-2 glass-panel p-6 relative min-h-[450px]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!riskData) return null;

  // Combine data for Recharts
  const chartData = riskData.classical.map((item, index) => ({
    time: item.time,
    classical: item.value,
    quantum: riskData.quantum[index].value,
    hasAlert: riskData.crashAlert.time === item.time
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-xs font-mono text-gray-400 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 glass-panel p-6 relative min-h-[450px] quantum-glow">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-space-grotesk text-lg font-bold tracking-tight text-primary-cyan">
            HYBRID RISK PROBABILITY
          </h2>
          <span className="text-xs font-mono text-gray-400">CROSS-MODEL TEMPORAL ANALYSIS</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-500"></div>
            <span className="text-xs font-mono text-gray-500 uppercase">Classical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)]"></div>
            <span className="text-xs font-mono text-primary-cyan uppercase">Quantum</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full h-64 mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="#3a494b" 
              strokeOpacity={0.05}
              className="deep-grid"
            />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 9, fill: '#9ca3af', fontFamily: 'monospace' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 9, fill: '#9ca3af', fontFamily: 'monospace' }}
              tickLine={false}
              domain={[0, 0.4]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Quantum Area with Gradient */}
            <defs>
              <linearGradient id="quantumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00f2ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <Area
              type="monotone"
              dataKey="quantum"
              stroke="#00f2ff"
              strokeWidth={2.5}
              fill="url(#quantumGradient)"
              name="Quantum"
            />
            
            {/* Classical Line (subdued) */}
            <Line
              type="monotone"
              dataKey="classical"
              stroke="#666"
              strokeWidth={1}
              opacity={0.6}
              dot={false}
              name="Classical"
            />
            
            {/* Crash Alert */}
            <ReferenceDot
              x={riskData.crashAlert.time}
              y={riskData.crashAlert.value}
              r={6}
              fill="#ffb4ab"
              stroke="#ffb4ab"
            />
            
            {/* Alert Line */}
            <ReferenceLine
              x={riskData.crashAlert.time}
              stroke="#ffb4ab"
              strokeDasharray="2 2"
              strokeOpacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Alert Label */}
        <div 
          className="absolute font-mono text-xs font-bold text-red-400"
          style={{ 
            left: '62%', 
            top: '15%',
            transform: 'translateX(-50%)'
          }}
        >
          {riskData.crashAlert.severity}
        </div>
      </div>

      {/* Time Labels */}
      <div className="flex justify-between mt-4 font-mono text-xs text-gray-400 uppercase tracking-tighter">
        <span>T-48H</span>
        <span>T-24H</span>
        <span>Current (Sync)</span>
        <span>T+24H (Est)</span>
        <span>T+48H (Est)</span>
      </div>

      {/* Bottom Metrics */}
      <div className="mt-8 flex gap-6">
        <div className="glass-panel p-4 border-l-2 border-primary-cyan flex-1">
          <div className="text-xs uppercase tracking-widest text-gray-400">Volatility Index</div>
          <div className="text-xl font-space-grotesk font-bold text-primary-cyan">
            {riskData.metrics.volatilityIndex.value} 
            <span className="text-xs text-secondary-jade ml-2">
              ({riskData.metrics.volatilityIndex.change})
            </span>
          </div>
        </div>
        
        <div className="glass-panel p-4 border-l-2 border-secondary-jade flex-1">
          <div className="text-xs uppercase tracking-widest text-gray-400">Model Drift</div>
          <div className="text-xl font-space-grotesk font-bold text-secondary-jade">
            {riskData.metrics.modelDrift.value} 
            <span className="text-xs text-gray-400 ml-2">
              ({riskData.metrics.modelDrift.status})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridRiskChart;
