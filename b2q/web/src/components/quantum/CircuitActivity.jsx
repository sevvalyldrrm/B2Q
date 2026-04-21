import React from 'react';

const CircuitActivity = ({ isSyncing, data }) => {
  const signal    = data?.realScores?.signal || 'SYNCING...';
  const decision  = data?.realScores?.decision;
  const circuit   = data?.realScores?.circuit;
  const final     = decision?.finalDecision || signal;

  // Nihai karara göre renk
  const colorMap = {
    STRONG_BUY:  'text-secondary-jade  border-secondary-jade  shadow-[0_0_15px_rgba(0,255,200,0.6)]',
    BUY:         'text-secondary-jade  border-secondary-jade  shadow-[0_0_15px_rgba(0,255,200,0.4)]',
    HOLD:        'text-primary-cyan    border-primary-cyan    shadow-[0_0_15px_rgba(0,242,255,0.5)]',
    WEAK_SELL:   'text-tertiary-magenta border-tertiary-magenta shadow-[0_0_15px_rgba(255,46,99,0.3)]',
    SELL:        'text-tertiary-magenta border-tertiary-magenta shadow-[0_0_15px_rgba(255,46,99,0.5)]',
    STRONG_SELL: 'text-tertiary-magenta border-tertiary-magenta shadow-[0_0_15px_rgba(255,46,99,0.7)]',
  };
  const signalColor = colorMap[final] || colorMap['HOLD'];

  return (
    <div className="col-span-9 row-span-3 glass-panel relative overflow-hidden flex items-center justify-center">
      {/* Arka Plan Izgarası */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 242, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 242, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Sol Üst Başlık */}
      <div className="absolute top-0 left-0 p-4 z-10">
        <h2 className="font-space-grotesk font-bold text-white uppercase text-xs flex items-center gap-2">
          <span className={`w-2 h-2 ${isSyncing ? 'bg-primary-cyan animate-ping' : 'bg-secondary-jade'} shadow-lg rounded-full`}></span>
          Quantum Circuit Activity :: Real-time Stream
        </h2>
      </div>

      {/* MERKEZİ SİNYAL GÖSTERGESİ */}
      <div className="absolute z-20 flex flex-col items-center pointer-events-none gap-2">
        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.3em]">Final Decision</div>
        <div className={`px-8 py-2 border-2 ${signalColor} bg-black/40 backdrop-blur-md rounded uppercase font-space-grotesk font-black text-4xl tracking-widest transition-all duration-500`}>
          {isSyncing ? 'CALIBRATING' : final}
        </div>

        {/* Qubit olasılıkları */}
        {!isSyncing && circuit && (
          <div className="flex gap-6 mt-2">
            {[
              { label: 'RSI', val: circuit.q1RsiProb },
              { label: 'ATR', val: circuit.q2AtrProb },
              { label: 'EMA', val: circuit.q3EmaProb },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="text-[9px] text-gray-500 font-mono uppercase">{label}</div>
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(val * 100).toFixed(0)}%`,
                      background: val > 0.5 ? '#00ffc8' : val > 0.2 ? '#00f2ff' : '#ff2e63',
                    }}
                  />
                </div>
                <div className="text-[9px] text-gray-400 font-mono">{(val * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        )}

        {/* Reason */}
        {!isSyncing && decision?.reason && (
          <div className="text-[9px] text-gray-500 font-mono max-w-xs text-center mt-1">
            {decision.reason}
          </div>
        )}
      </div>
      
      {/* Quantum SVG Animasyonu  */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <svg className={`w-3/4 h-3/4 transition-all duration-500 ${isSyncing ? 'opacity-80 scale-105' : 'opacity-40 scale-100'}`} viewBox="0 0 800 400">
          <circle cx="100" cy="200" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.5s' }} />
          <circle cx="200" cy="100" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.7s' }} />
          <circle cx="200" cy="300" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.6s' }} />
          <circle cx="350" cy="200" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.8s' }} />
          <circle cx="500" cy="100" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.4s' }} />
          <circle cx="500" cy="300" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.9s' }} />
          <circle cx="650" cy="200" fill="#00dbe7" r="4" className={isSyncing ? "animate-pulse" : ""} style={{ animationDuration: '0.3s' }} />
          
          <path d="M100 200 L200 100" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M100 200 L200 300" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M200 100 L350 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M200 300 L350 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M350 200 L500 100" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M350 200 L500 300" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M500 100 L650 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          <path d="M500 300 L650 200" fill="none" stroke="#00dbe7" strokeWidth={isSyncing ? "1" : "0.5"} opacity={isSyncing ? "0.8" : "0.4"} />
          
          <path d="M50 200 Q 200 50, 350 200 T 650 200" fill="none" opacity={isSyncing ? "0.6" : "0.3"} stroke="#00dbe7" strokeDasharray={isSyncing ? "2 2" : "4 4"} strokeWidth={isSyncing ? "1.5" : "1"}/>
        </svg>
      </div>
      
      {/* Alt Veriler */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[10px] text-gray-400 uppercase tracking-tighter">
        <div>TARGET: BTC/USDT</div>
        <div>CLASSIC: {signal} | QUBIT: {circuit?.signal || '—'} | AGREE: {decision?.agreement ? '✓' : '✗'}</div>
        <div>CONFIDENCE: {circuit?.confidence ?? '—'}%</div>
      </div>
    </div>
  );
};

export default CircuitActivity;