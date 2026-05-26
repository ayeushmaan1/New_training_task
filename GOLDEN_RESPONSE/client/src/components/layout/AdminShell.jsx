import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, FilePenLine, LayoutDashboard, MessageSquare, Newspaper, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/blogs', label: 'Blogs', icon: Newspaper },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/blogs/new', label: 'Write', icon: FilePenLine }
];

export default function AdminShell() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-900 dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-black/5 bg-white px-4 py-5 dark:border-white/10 dark:bg-ink-900 lg:block">
        <div className="mb-8">
          <p className="text-sm text-ink-500 dark:text-ink-200">Admin console</p>
          <h1 className="text-xl font-semibold">Inkline</h1>
        </div>
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                end={item.end}
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-link ${isActive ? 'admin-link-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/90 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-sm text-ink-500 dark:text-ink-200">Signed in as</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <nav className="flex gap-1 overflow-x-auto lg:hidden">
              {links.slice(0, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} end={item.end} className="icon-button" aria-label={item.label}>
                    <Icon size={18} />
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
