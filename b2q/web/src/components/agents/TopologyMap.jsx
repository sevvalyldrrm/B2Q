import React from 'react';
import { Cpu, BrainCircuit, Network } from 'lucide-react';

const TopologyMap = () => {
  return (
    <section className="h-48 invisible-border glass-panel relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 242, 255, 0.2) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      {/* Header */}
      <div className="absolute left-6 top-4 z-10">
        <h3 className="font-space-grotesk text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-pulse"></span>
          Quantum Flow Topology
        </h3>
      </div>
      
      {/* Topology Content */}
      <div className="flex items-center justify-around h-full px-20">
        {/* Core */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 glass-panel border border-primary-cyan/40 flex items-center justify-center relative quantum-glow">
            <Cpu size={32} className="text-primary-cyan" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-cyan"></div>
          </div>
          <span className="font-space-grotesk text-[9px] tracking-tighter text-gray-400 uppercase">Quantum Core</span>
        </div>
        
        {/* Connection Lines */}
        <div className="flex-1 flex justify-center items-center h-2 overflow-hidden opacity-30">
          <div className="w-full border-t border-dashed border-primary-cyan/50 relative">
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary-cyan rounded-full -translate-y-1/2 blur-[1px]"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary-cyan rounded-full -translate-y-1/2 blur-[1px]"></div>
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary-cyan rounded-full -translate-y-1/2 blur-[1px]"></div>
          </div>
        </div>
        
        {/* AI Hub */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 glass-panel border border-secondary-jade/40 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,255,200,0.05)]">
            <BrainCircuit size={40} className="text-secondary-jade" />
            <div className="absolute inset-0 border border-secondary-jade/10 scale-125"></div>
          </div>
          <span className="font-space-grotesk text-[9px] tracking-tighter text-gray-400 uppercase font-bold text-secondary-jade">AI AGENT CLUSTER</span>
        </div>
        
        {/* Connection Lines */}
        <div className="flex-1 flex justify-center items-center h-2 overflow-hidden opacity-30">
          <div className="w-full border-t border-dashed border-tertiary-magenta/50 relative">
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-tertiary-magenta rounded-full -translate-y-1/2 blur-[1px]"></div>
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-tertiary-magenta rounded-full -translate-y-1/2 blur-[1px]"></div>
          </div>
        </div>
        
        {/* Markets */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 glass-panel border border-tertiary-magenta/40 flex items-center justify-center relative">
            <Network size={32} className="text-tertiary-magenta" />
          </div>
          <span className="font-space-grotesk text-[9px] tracking-tighter text-gray-400 uppercase">Market Endpoints</span>
        </div>
      </div>
      
      {/* HUD Elements */}
      <div className="absolute bottom-2 right-6 flex gap-4 text-[8px] font-mono text-gray-400/40">
        <span>LATENCY: 1.4ms</span>
        <span>SYNC: 100%</span>
        <span>PKT_LOSS: 0.00%</span>
      </div>
    </section>
  );
};

export default TopologyMap;
