import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CircuitActivity from '../components/quantum/CircuitActivity';
import IterationLog from '../components/quantum/IterationLog';
import GateFidelity from '../components/quantum/GateFidelity';
import DecoherenceProfile from '../components/quantum/DecoherenceProfile';

const Quantum = () => {
  const [quantumData, setQuantumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await api.getQuantumData();
      setQuantumData(data);
    } catch (error) {
      console.error('Failed to fetch quantum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate calibration delay
    try {
      const data = await api.getQuantumData();
      setQuantumData(data);
    } catch (error) {
      console.error('Failed to fetch quantum data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-12 grid-rows-6 gap-4 p-4 h-[calc(100vh-3.5rem)]">
        {/* Loading skeleton */}
        <div className="col-span-9 row-span-3 glass-panel animate-pulse"></div>
        <div className="col-span-3 row-span-6 glass-panel animate-pulse"></div>
        <div className="col-span-4 row-span-3 glass-panel animate-pulse"></div>
        <div className="col-span-5 row-span-3 glass-panel animate-pulse"></div>
      </div>
    );
  }

  if (!quantumData) return null;

  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4 p-4 h-[calc(100vh-3.5rem)]">
      {/* Top Panel: Quantum Circuit Activity */}
      <CircuitActivity isSyncing={isSyncing} />
      
      {/* Right Panel: IQAE Iteration Log */}
      <IterationLog data={quantumData} onResync={handleResync} isSyncing={isSyncing} />
      
      {/* Middle Left: Gate Fidelity */}
      <GateFidelity data={quantumData} />
      
      {/* Middle Right: Qubit Noise */}
      <DecoherenceProfile data={quantumData} />
    </div>
  );
};

export default Quantum;
