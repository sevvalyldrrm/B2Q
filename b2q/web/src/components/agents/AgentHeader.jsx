import React from 'react';

const AgentHeader = ({ data }) => {
  return (
    <section className="p-6 invisible-border bg-gray-800/50">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-space-grotesk text-3xl font-bold tracking-tight text-primary-cyan mb-1">AGENT HUB</h1>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-tighter">DISTRIBUTED_INTELLIGENCE_COORDINATOR // SYSTEM_V3.0</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel p-3 border-t border-primary-cyan/30">
            <div className="text-[10px] text-gray-400 uppercase mb-1">Total Compute</div>
            <div className="font-space-grotesk text-lg font-bold text-primary-cyan">{data?.totalCompute || '14.2 PFLOPS'}</div>
          </div>
          <div className="glass-panel p-3 border-t border-secondary-jade/30">
            <div className="text-[10px] text-gray-400 uppercase mb-1">Active Agents</div>
            <div className="font-space-grotesk text-lg font-bold text-secondary-jade">{data?.activeAgents || '03 / 03'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentHeader;
