import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, Activity, BarChart3 } from 'lucide-react';
import { api } from '../../services/api';

const SummaryCards = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getSummaryData().then(res => setData(res));
  }, []);

  if (!data) return <div className="h-32 bg-gray-900/20 animate-pulse rounded-none" />;

  const cardConfig = [
    { title: "PORTFOLIO VALUE", value: data.portfolioValue.value, sub: data.portfolioValue.change, icon: TrendingUp, color: "text-primary-cyan" },
    { title: "QUANTUM VAR (99%)", value: data.quantumVar.value, sub: `CONFIDENCE: ${data.quantumVar.confidence}`, icon: Activity, color: "text-secondary-jade" },
    { title: "GLOBAL SENTIMENT", value: data.globalSentiment.value, sub: `${data.globalSentiment.score}/${data.globalSentiment.maxScore}`, icon: BarChart3, color: "text-primary-cyan" },
    { title: "ACTIVE HEDGES", value: data.activeHedges.value, sub: `RISK COVERAGE: ${data.activeHedges.coverage}`, icon: Shield, color: "text-tertiary-magenta" }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cardConfig.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-panel p-4 flex flex-col justify-between min-h-[120px] relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-space-grotesk tracking-widest text-gray-400">{card.title}</span>
              <Icon size={16} className={`${card.color} drop-shadow-[0_0_8px_rgba(0,242,255,0.3)]`} />
            </div>
            <div className="mt-2">
              <div className={`text-2xl font-space-grotesk font-bold ${idx === 3 ? 'text-white' : card.color}`}>{card.value}</div>
              <div className={`text-[11px] font-mono mt-1 ${idx === 3 ? 'text-tertiary-magenta font-bold' : 'text-gray-400'}`}>{card.sub}</div>
            </div>
            <div className={`absolute bottom-0 left-0 h-0.5 w-full ${idx === 3 ? 'bg-tertiary-magenta/20' : 'bg-primary-cyan/10'}`} />
          </div>
        );
      })}
    </section>
  );
};
export default SummaryCards;