import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DecoherenceProfile = ({ data }) => {
  const circuit = data?.realScores?.circuit;

  // Gerçek qubit prob değerleri varsa onları kullan, yoksa mock'a dön
  const qubits = circuit ? [
    { qubit: 'Q_RSI', coherence: +(circuit.q1RsiProb * 100).toFixed(1), label: 'RSI (Momentum)' },
    { qubit: 'Q_ATR', coherence: +(circuit.q2AtrProb * 100).toFixed(1), label: 'ATR (Volatility)' },
    { qubit: 'Q_EMA', coherence: +(circuit.q3EmaProb * 100).toFixed(1), label: 'EMA (Trend)' },
    { qubit: 'JOINT', coherence: +(circuit.jointProb * 100).toFixed(1),  label: 'Joint Entangled' },
  ] : (data?.qubits || [
    { qubit: 'Q0', coherence: 80 },
    { qubit: 'Q1', coherence: 85 },
    { qubit: 'Q2', coherence: 70 },
    { qubit: 'Q3', coherence: 92 },
  ]);

  // T1/T2 değerlerini joint_prob ve confidence'dan türet
  const t1 = circuit ? `${(circuit.jointProb * 1000).toFixed(1)} μs` : 'N/A';
  const t2 = circuit ? `${circuit.confidence?.toFixed(2)} (conf)` : '64.2 Avg';

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
            <YAxis hide={true} domain={[0, 100]} />
            <Tooltip 
              cursor={false}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                fontSize: 10
              }}
              formatter={(value, name, props) => [
                `${value}%`,
                props.payload.label || props.payload.qubit
              ]}
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

      {/* Qubit değerleri listesi (gerçek veri varsa) */}
      {circuit && (
        <div className="mb-2 grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
          {qubits.map((q) => (
            <div key={q.qubit} className="invisible-border p-1">
              <div className="text-gray-400">{q.qubit}</div>
              <div className="text-primary-cyan font-bold">{q.coherence}%</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Stats */}
      <div className="mt-2 flex justify-between font-mono text-[9px] text-gray-400 uppercase">
        <span>T1 Joint Prob (×1000)</span>
        <span className="text-primary-cyan">{t1}</span>
      </div>
      <div className="flex justify-between font-mono text-[9px] text-gray-400 uppercase">
        <span>T2 Confidence Score</span>
        <span className="text-primary-cyan">{t2}</span>
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
