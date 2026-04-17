import { LayoutGrid, Activity, Brain, Database, Settings, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/quantum', icon: Activity, label: 'Quantum' },
    { path: '/agents', icon: Brain, label: 'Agents' },
    { path: '/vault', icon: Database, label: 'Vault' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 flex flex-col items-center py-6 bg-neutral-dark w-20 border-r border-gray-800 z-[60]">
      <div className="mb-12 text-primary-cyan font-bold text-xl font-space-grotesk">B2Q</div>
      <nav className="flex flex-col gap-8 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-colors cursor-pointer
              ${isActive 
                ? 'text-primary-cyan border-l-2 border-primary-cyan bg-gray-800/50 py-2 w-20 scale-95 duration-100 ease-in-out' 
                : 'text-gray-500 hover:text-primary-cyan'
              }
            `}
          >
            <item.icon size={24} />
            <span className="font-space-grotesk uppercase tracking-widest text-[10px]">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-gray-500"><Shield size={24} /></div>
    </aside>
  );
};

export default Sidebar;
