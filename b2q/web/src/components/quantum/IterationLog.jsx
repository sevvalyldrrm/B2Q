import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

const IterationLog = ({ data, onResync, isSyncing }) => {

  return (
    <div className="col-span-3 row-span-6 glass-panel flex flex-col relative">
      {/* Header */}
      <div className="p-4 invisible-border">
        <h2 className="font-space-grotesk font-bold text-white uppercase text-xs tracking-widest">IQAE Iteration Log</h2>
        <p className="text-[10px] text-gray-400 mt-1 font-mono">REF: QUANTUM_OPTIMIZER_v4.2</p>
      </div>
      
      {/* Convergence Graph */}
      <div className="p-4 h-48">
        <div className="w-full h-full invisible-border relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.convergence || []}>
              <defs>
                <linearGradient id="convergenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: '#00dbe7', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#00dbe7', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="convergence"
                stroke="#00dbe7"
                strokeWidth={2}
                fill="url(#convergenceGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className={`absolute top-2 right-2 text-[10px] font-mono ${
            isSyncing 
              ? 'text-primary-cyan animate-pulse' 
              : 'text-secondary-jade'
          }`}>
            {isSyncing ? 'CALIBRATING...' : 'OPTIMIZED / SYNCED'}
          </div>
        </div>
      </div>
      
      {/* Iteration Log List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 font-mono text-[10px] py-2">
        {data?.logs?.map((log, index) => (
          <div key={index} className="flex justify-between invisible-border pb-1">
            <span className="text-gray-400">{log.iteration}</span>
            <span className="text-primary-cyan">{log.delta}</span>
          </div>
        ))}
      </div>
      
      {/* Sync Button */}
      <div className="p-4 bg-gray-800/50">
        <button 
          onClick={onResync}
          disabled={isSyncing}
          className={`w-full py-2 font-space-grotesk font-bold uppercase text-[10px] tracking-[0.2em] transition-colors ${
            isSyncing 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-primary-cyan text-black hover:bg-primary-cyan/80'
          }`}
        >
          {isSyncing ? 'CALIBRATING...' : 'FORCE_RESYNC'}
        </button>
      </div>
      
      {/* Sync Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary-cyan animate-spin" />
            <span className="text-xs font-space-grotesk text-primary-cyan uppercase tracking-widest">
              QUANTUM CALIBRATION IN PROGRESS...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IterationLog;
