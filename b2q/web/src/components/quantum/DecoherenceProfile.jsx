import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DecoherenceProfile = ({ data }) => {
  const qubits = data?.qubits || [
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
  ];

  return (
    <div className="col-span-5 row-span-3 glass-panel p-4 relative">
      <h2 className="font-space-grotesk font-bold text-white uppercase text-xs tracking-widest mb-4">QUBIT DECOHERENCE PROFILE</h2>
      
      {/* Recharts Bar Chart */}
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={qubits} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis 
              dataKey="qubit" 
              tick={{ fontSize: 8, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              hide={true}
            />
            <Tooltip 
              cursor={false}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                fontSize: 10
              }}
            />
            <Bar 
              dataKey="coherence" 
              fill="#00F2FF" 
              fillOpacity={0.2} 
              activeBar={{ fillOpacity: 0.8, stroke: '#00F2FF', strokeWidth: 1, filter: 'drop-shadow(0px 0px 5px rgba(0,242,255,0.6))' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats */}
      <div className="mt-4 flex justify-between font-mono text-[9px] text-gray-400 uppercase">
        <span>T1 Relaxation Time (μs)</span>
        <span className="text-primary-cyan">Stable</span>
      </div>
      <div className="flex justify-between font-mono text-[9px] text-gray-400 uppercase">
        <span>T2 Dephasing Time (μs)</span>
        <span className="text-primary-cyan">64.2 Avg</span>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-primary-cyan"></div>
          <span className="text-[8px] uppercase font-mono text-gray-400">Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-700"></div>
          <span className="text-[8px] uppercase font-mono text-gray-400">Idle</span>
        </div>
      </div>
    </div>
  );
};

export default DecoherenceProfile;
