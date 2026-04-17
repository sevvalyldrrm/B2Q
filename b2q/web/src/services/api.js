import { mockStrategyData, mockQuantumData, mockAgentHubData, mockVaultData } from '../data/mockData';

// API services for Q-Sentinel Strategy Dashboard
export const api = {
  // Get summary cards data
  getSummaryData: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStrategyData.summaryCards;
  },

  // Get hybrid risk chart data
  getRiskChartData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStrategyData.riskChart;
  },

  // Get AI agents data
  getAgentsData: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStrategyData.agents;
  },

  // Get order history data
  getOrderHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockStrategyData.orderHistory || [];
  },

  // Get all strategy data at once
  getAllStrategyData: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockStrategyData;
  },

  // Deploy new agent
  deployAgent: async (agentConfig) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      agentId: `agent_${Date.now()}`,
      message: "Agent deployed successfully"
    };
  },

  // Get quantum analysis data
  getQuantumData: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockQuantumData;
  },

  // Get agent hub data
  getAgentHubData: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockAgentHubData;
  },

  // Get vault data
  getVaultData: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockVaultData;
  },

  // Get real-time updates (WebSocket simulation)
  subscribeToUpdates: (callback) => {
    const interval = setInterval(() => {
      callback({
        type: 'market_update',
        timestamp: new Date().toISOString(),
        data: {
          portfolioChange: (Math.random() - 0.5) * 0.1,
          volatilityIndex: 14.28 + (Math.random() - 0.5) * 2
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }
};
