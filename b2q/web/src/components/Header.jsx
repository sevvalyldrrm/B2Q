import { Bell, Wallet } from 'lucide-react';

const Header = () => (
  <header className="fixed top-0 right-0 left-20 z-50 flex justify-between items-center px-6 h-14 bg-[#0B0E11]/80 backdrop-blur-xl border-b border-gray-800/50">
  <div className="flex items-center gap-12">
    <span className="font-space-grotesk font-black text-[#00F2FF] text-lg tracking-tighter">bit2qubit</span>
    <div className="flex items-center gap-8 text-[10px] tracking-[0.2em] font-space-grotesk uppercase">
      <span className="text-[#00F2FF] font-bold">Q-ENGINE: ACTIVE</span>
      <span className="text-gray-400">TVL: $4.2B</span>
      <span className="text-gray-400">RISK: 0.04%</span>
      <span className="text-[#00FFC8]">AI: SYNCED</span>
    </div>
  </div>
    <div className="flex items-center gap-4 text-gray-400">
      <Bell size={18} className="cursor-pointer hover:text-white" />
      <Wallet size={18} className="cursor-pointer hover:text-white" />
      <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-sm"></div>
    </div>
  </header>
);

export default Header;
