import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-neutral-dark text-white">
    <Sidebar />
    <Header />
    <main className="ml-20 pt-14 p-6 min-h-screen">
      {children}
    </main>
  </div>
);

export default MainLayout;
