import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
