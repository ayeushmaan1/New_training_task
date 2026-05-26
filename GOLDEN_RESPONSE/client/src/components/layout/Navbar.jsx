import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bookmark, BookOpen, LogOut, Menu, Moon, Shield, Sun, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const navItems = [
  { to: '/', label: 'Blogs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

function linkClass({ isActive }) {
  return `nav-link ${isActive ? 'nav-link-active' : ''}`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const accountLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Profile', icon: User },
        { to: '/bookmarks', label: 'Saved', icon: Bookmark },
        ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: Shield }] : [])
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold" aria-label="Inkline home">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink-900 text-white dark:bg-white dark:text-ink-900">
            <BookOpen size={19} />
          </span>
          <span className="text-lg">Inkline</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle dark mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <>
              {accountLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className="icon-button" aria-label={item.label}>
                    <Icon size={18} />
                  </NavLink>
                );
              })}
              <button className="icon-button" type="button" onClick={logout} aria-label="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="icon-button md:hidden" type="button" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <motion.div
          className="border-t border-black/5 bg-white px-4 py-3 shadow-soft dark:border-white/10 dark:bg-ink-900 md:hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <div className="flex flex-col gap-2">
            {[...navItems, ...accountLinks].map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle dark mode">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {isAuthenticated ? (
                <button className="btn-secondary" type="button" onClick={logout}>
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary" onClick={() => setOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
