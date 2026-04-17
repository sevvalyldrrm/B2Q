import React, { useState, useEffect } from 'react';
import { BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const AgentHub = () => {
  const [agentsData, setAgentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDeployAgent = () => {
    navigate('/agents');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAgentsData();
        setAgentsData(data);
      } catch (error) {
        console.error('Failed to fetch agents data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-6 quantum-glow">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-3 w-1/3"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-2 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!agentsData) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'query_stats':
        return BarChart3;
      case 'verified_user':
        return ShieldCheck;
      case 'trending_up':
        return TrendingUp;
      default:
        return BarChart3;
    }
  };

  const getColorClass = (color) => {
    switch (color) {
      case 'primary':
        return 'text-primary-cyan';
      case 'secondary':
        return 'text-secondary-jade';
      case 'tertiary':
        return 'text-tertiary-magenta';
      default:
        return 'text-primary-cyan';
    }
  };

  const getBgColorClass = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-cyan/10';
      case 'secondary':
        return 'bg-secondary-jade/10';
      case 'tertiary':
        return 'bg-tertiary-magenta/10';
      default:
        return 'bg-primary-cyan/10';
    }
  };

  return (
    <div className="glass-panel p-6 quantum-glow">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-space-grotesk text-lg font-bold tracking-tight text-white">
          SENTINEL_AI HUB
        </h2>
        <p className="text-xs font-mono text-gray-400">AUTONOMOUS AGENT ORCHESTRATION</p>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        {agentsData.map((agent) => {
          const Icon = getIcon(agent.icon);
          const colorClass = getColorClass(agent.color);
          const bgColorClass = getBgColorClass(agent.color);
          
          return (
            <div
              key={agent.id}
              className="glass-panel p-4 hover:border-primary-cyan/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${bgColorClass} flex items-center justify-center`}>
                    <Icon size={16} className={colorClass} />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-space-grotesk uppercase">
                      {agent.name}
                    </div>
                    <div className="text-[8px] font-mono text-gray-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-jade"></span>
                      {agent.status}
                    </div>
                  </div>
                </div>
                              </div>
              <p className="text-xs text-gray-400 italic">
                "{agent.activity}"
              </p>
            </div>
          );
        })}
      </div>

      {/* Deploy Button */}
      <button 
        onClick={handleDeployAgent}
        className="w-full mt-6 py-3 bg-primary-cyan text-neutral-dark font-space-grotesk font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all"
      >
        DEPLOY NEW AGENT
      </button>
    </div>
  );
};

export default AgentHub;
