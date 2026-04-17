import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AgentHeader from '../components/agents/AgentHeader';
import AgentLogColumn from '../components/agents/AgentLogColumn';
import TopologyMap from '../components/agents/TopologyMap';

const Agents = () => {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAgentHubData();
        setAgentData(data);
      } catch (error) {
        console.error('Failed to fetch agent hub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {/* Header Skeleton */}
        <section className="p-6 invisible-border bg-gray-800/50 animate-pulse">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-8 bg-gray-700 rounded mb-2 w-48"></div>
              <div className="h-4 bg-gray-700 rounded w-96"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-16 bg-gray-700 rounded w-32"></div>
              <div className="h-16 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </section>
        
        {/* Grid Skeleton */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="border-r border-gray-800 animate-pulse h-full"></div>
          <div className="border-r border-gray-800 animate-pulse h-full"></div>
          <div className="animate-pulse h-full"></div>
        </section>
      </div>
    );
  }

  if (!agentData) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Agent Hub Header */}
      <AgentHeader data={agentData.header} />
      
      {/* Command & Control Grid */}
      <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden">
        {/* Column 1: Analyst */}
        <div className="border-r border-gray-800/10 flex flex-col h-full">
          <AgentLogColumn 
            agent={agentData.agents[0]} 
            data={{ logs: agentData.agents[0].logs, sparkline: agentData.agents[0].sparkline }}
          />
        </div>
        
        {/* Column 2: Verify */}
        <div className="border-r border-gray-800/10 flex flex-col h-full bg-gray-800/30">
          <AgentLogColumn 
            agent={agentData.agents[1]} 
            data={{ logs: agentData.agents[1].logs, sparkline: agentData.agents[1].sparkline }}
          />
        </div>
        
        {/* Column 3: Trader */}
        <div className="flex flex-col h-full bg-gray-800/50">
          <AgentLogColumn 
            agent={agentData.agents[2]} 
            data={{ logs: agentData.agents[2].logs, sparkline: agentData.agents[2].sparkline }}
          />
        </div>
      </section>
      
      {/* Network Graph Bottom Panel */}
      <TopologyMap />
    </div>
  );
};

export default Agents;
