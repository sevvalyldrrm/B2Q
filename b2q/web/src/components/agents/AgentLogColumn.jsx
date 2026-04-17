import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

const AgentLogColumn = ({ agent, data }) => {

  const getAgentIcon = (type) => {
    switch (type) {
      case 'analyst':
        return Activity;
      case 'verify':
        return ShieldCheck;
      case 'trader':
        return Zap;
      default:
        return Activity;
    }
  };

  const getAgentColor = (type) => {
    switch (type) {
      case 'analyst':
        return 'text-primary-cyan';
      case 'verify':
        return 'text-secondary-jade';
      case 'trader':
        return 'text-tertiary-magenta';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scanning: { bg: 'bg-primary-cyan/10', text: 'text-primary-cyan', border: 'border-primary-cyan/20' },
      validating: { bg: 'bg-secondary-jade/10', text: 'text-secondary-jade', border: 'border-secondary-jade/20' },
      armed: { bg: 'bg-tertiary-magenta/10', text: 'text-tertiary-magenta', border: 'border-tertiary-magenta/20' }
    };
    
    const config = statusConfig[status] || statusConfig.scanning;
    return (
      <span className={`text-[10px] px-2 py-0.5 ${config.bg} ${config.text} border ${config.border}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const Icon = getAgentIcon(agent.type);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 glass-panel flex items-center justify-between invisible-border">
        <div className="flex items-center gap-2">
          <Icon size={16} className={getAgentColor(agent.type)} />
          <span className={`font-space-grotesk font-bold text-sm tracking-widest ${getAgentColor(agent.type)}`}>
            {agent.name.toUpperCase()}_NODE
          </span>
        </div>
        {getStatusBadge(agent.status)}
      </div>
      
      {/* Logs - Scrollable Section */}
      <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto text-gray-400">
        {data?.logs?.map((log, index) => (
          <div key={index}>
            <span className={getAgentColor(agent.type)}>[{log.timestamp}]</span> {log.message}
            <br />
          </div>
        ))}
      </div>
      
      {/* Bottom Widgets - Fixed Section */}
      <div className="p-4 invisible-border bg-[#0B0E11]/50 shrink-0">
        {/* Sparkline for Analyst */}
        {agent.type === 'analyst' && (
          <div className="p-3 glass-panel invisible-border">
            <div className="text-[9px] uppercase mb-2 text-gray-400">Real-time Entropy Map</div>
            <div className="w-full h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={agent?.sparkline || []}>
                  <defs>
                    <linearGradient id="entropyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: '#00FFC8', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: '#00FFC8', stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00FFC8"
                    strokeWidth={1}
                    fill="url(#entropyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Stats for Verify */}
        {agent.type === 'verify' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 invisible-border glass-panel text-center">
              <div className="text-[8px] uppercase text-gray-400">Sim Confidence</div>
              <div className="text-sm font-space-grotesk font-bold text-secondary-jade">94.8%</div>
            </div>
            <div className="p-2 invisible-border glass-panel text-center">
              <div className="text-[8px] uppercase text-gray-400">Audit Status</div>
              <div className="text-sm font-space-grotesk font-bold text-secondary-jade">CLEAN</div>
            </div>
          </div>
        )}
        
        {/* Active Execution for Trader */}
        {agent.type === 'trader' && (
          <div className="p-3 bg-tertiary-magenta/5 border-l-2 border-tertiary-magenta">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Execution</span>
              <span className="text-[9px] text-gray-400">ID: #QK-991</span>
            </div>
            <div className="h-1 bg-gray-800 w-full overflow-hidden">
              <div className="h-full bg-tertiary-magenta w-[65%] shadow-[0_0_8px_rgba(255,178,186,0.5)]"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentLogColumn;
