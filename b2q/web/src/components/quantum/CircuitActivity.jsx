import React from 'react';

const CircuitActivity = ({ isSyncing }) => {
  return (
    <div className="col-span-9 row-span-3 glass-panel relative overflow-hidden">
      {/* Quantum Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 242, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 242, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Header */}
      <div className="absolute top-0 left-0 p-4 z-10">
        <h2 className="font-space-grotesk font-bold text-white uppercase text-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-primary-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)] animate-pulse"></span>
          Quantum Circuit Activity :: Real-time Stream
        </h2>
      </div>
      
      {/* Circuit Visualization */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className={`w-3/4 h-3/4 transition-opacity duration-500 ${isSyncing ? 'opacity-60' : 'opacity-40'}`} viewBox="0 0 800 400">
          {/* Nodes */}
          <circle cx="100" cy="200" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : "animate-pulse"} style={{ animationDuration: isSyncing ? '0.5s' : '2s' }} />
          <circle cx="200" cy="100" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: isSyncing ? '0.7s' : '2s' }} />
          <circle cx="200" cy="300" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : "animate-pulse"} style={{ animationDuration: isSyncing ? '0.6s' : '2s' }} />
          <circle cx="350" cy="200" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: isSyncing ? '0.8s' : '2s' }} />
          <circle cx="500" cy="100" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : "animate-pulse"} style={{ animationDuration: isSyncing ? '0.4s' : '2s' }} />
          <circle cx="500" cy="300" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: isSyncing ? '0.9s' : '2s' }} />
          <circle cx="650" cy="200" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : "animate-pulse"} style={{ animationDuration: isSyncing ? '0.3s' : '2s' }} />
          
          {/* Connections */}
          <path d="M100 200 L200 100" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M100 200 L200 300" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M200 100 L350 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M200 300 L350 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M350 200 L500 100" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M350 200 L500 300" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M500 100 L650 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M500 300 L650 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          
          {/* Probabilistic Waves */}
          <path 
            d="M50 200 Q 200 50, 350 200 T 650 200" 
            fill="none" 
            opacity={isSyncing ? "0.6" : "0.3"} 
            stroke="#00dbe7" 
            strokeDasharray={isSyncing ? "2 2" : "4 4"} 
            strokeWidth={isSyncing ? "1.5" : "1"}
          />
        </svg>
      </div>
      
      {/* Bottom Stats */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[10px] text-gray-400 uppercase tracking-tighter">
        <div>PHASE_COHERENCE: 0.99842</div>
        <div>ENTANGLEMENT_DENSITY: 74.2%</div>
        <div>SYSTEM_TEMP: 15mK</div>
      </div>
    </div>
  );
};

export default CircuitActivity;
