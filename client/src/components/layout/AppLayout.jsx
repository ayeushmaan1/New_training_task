import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 transition-colors dark:bg-ink-900 dark:text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
