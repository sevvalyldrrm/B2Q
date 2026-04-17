import React from 'react';
import SummaryCards from '../components/strategy/SummaryCards';
import HybridRiskChart from '../components/strategy/HybridRiskChart';
import AgentHub from '../components/strategy/AgentHub';
import OrderHistoryTable from '../components/strategy/OrderHistoryTable';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top Grid: Summary Cards */}
      <SummaryCards />

      {/* Center Layout: Chart + Agent Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HybridRiskChart />
        <AgentHub />
      </section>

      {/* Bottom: Order History */}
      <OrderHistoryTable />
    </div>
  );
};

export default Dashboard;
