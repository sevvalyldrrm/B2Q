import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import VaultSummary from '../components/vault/VaultSummary';
import AssetLedger from '../components/vault/AssetLedger';
import RiskInsights from '../components/vault/RiskInsights';

const Vault = () => {
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getVaultData();
        setVaultData(data);
      } catch (error) {
        console.error('Failed to fetch vault data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate optimization
    setIsOptimizing(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Summary Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-panel p-6 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-32 mb-4"></div>
            <div className="h-8 bg-white/5 rounded w-24 mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-20"></div>
          </div>
          <div className="lg:col-span-2 glass-panel p-6 animate-pulse">
            <div className="flex gap-8">
              <div className="w-40 h-40 bg-white/5 rounded-full"></div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-2 bg-white/5 rounded w-20"></div>
                    <div className="h-4 bg-white/5 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Asset Ledger Skeleton */}
        <div className="glass-panel overflow-hidden animate-pulse">
          <div className="px-6 py-4 invisible-border">
            <div className="h-4 bg-white/5 rounded w-24"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-4 invisible-border flex gap-4">
                <div className="w-8 h-8 bg-white/5 rounded"></div>
                <div className="flex-1 grid grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="h-4 bg-white/5 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Risk Insights Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/5 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/5 rounded w-32 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/5 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/5 rounded w-32 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
                <div className="h-1 bg-white/5 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vaultData) return null;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Hero Stats / Summary Section */}
      <VaultSummary data={vaultData} onOptimize={handleOptimize} isOptimizing={isOptimizing} />
      
      {/* Asset Ledger */}
      <AssetLedger data={vaultData} />
      
      {/* Risk Intelligence Insights */}
      <RiskInsights data={vaultData.insights} />
    </div>
  );
};

export default Vault;
