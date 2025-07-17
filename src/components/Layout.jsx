import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen ">
      {/* Sidebar is fixed, handled internally via mobileOpen logic */}
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 lg:p-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
