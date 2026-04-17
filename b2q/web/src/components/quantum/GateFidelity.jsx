import React from 'react';

const GateFidelity = ({ data }) => {
  const gates = data?.gates || [
    { name: 'Hadamard (H)', fidelity: 99.992 },
    { name: 'Pauli-X', fidelity: 99.987 },
    { name: 'CNOT (2-Qubit)', fidelity: 98.452 },
    { name: 'Toffoli (3-Qubit)', fidelity: 96.110 }
  ];

  const avgFidelity = gates.reduce((sum, gate) => sum + gate.fidelity, 0) / gates.length;
  const errorRate = (100 - avgFidelity) / 100;

  return (
    <div className="col-span-4 row-span-3 glass-panel p-4">
      <h2 className="font-space-grotesk font-bold text-white uppercase text-xs tracking-widest mb-6">GATE FIDELITY MATRIX</h2>
      
      <div className="space-y-4">
        {gates.map((gate, index) => (
          <div key={index}>
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1 uppercase">
              <span>{gate.name}</span>
              <span className="text-primary-cyan">{gate.fidelity.toFixed(3)}%</span>
            </div>
            <div className="h-1 bg-gray-700">
              <div 
                className="h-full bg-primary-cyan shadow-[0_0_4px_rgba(0,219,231,0.6)]" 
                style={{ width: `${gate.fidelity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="invisible-border p-2 text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Avg Fidelity</div>
          <div className="text-lg font-space-grotesk font-black text-white">{avgFidelity.toFixed(1)}%</div>
        </div>
        <div className="invisible-border p-2 text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Error Rate</div>
          <div className="text-lg font-space-grotesk font-black text-[#ffdad6]">{errorRate.toExponential(1).toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

export default GateFidelity;
