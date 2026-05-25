import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Heart, Settings, UserRound } from 'lucide-react';
import BlogCard from '../components/BlogCard.jsx';
import MotionPage from '../components/MotionPage.jsx';
import Loading from '../components/ui/Loading.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, mediaUrl } from '../services/api.js';

export default function ProfileDashboard() {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [recentResponse, bookmarkResponse] = await Promise.all([
          api.get('/auth/me/recently-read'),
          api.get('/auth/me/bookmarks')
        ]);
        if (!active) return;
        setRecent(recentResponse.data.blogs);
        setBookmarks(bookmarkResponse.data.blogs);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loading label="Loading your dashboard" />;
  }

  return (
    <MotionPage className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="surface p-6">
          <img
            className="h-24 w-24 rounded-md object-cover"
            src={mediaUrl(user.avatarUrl) || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
          />
          <h1 className="mt-5 text-2xl font-semibold">{user.name}</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-200">{user.email}</p>
          <p className="mt-4 leading-7 text-ink-600 dark:text-ink-100">{user.bio || 'No bio added yet.'}</p>
          <Link className="btn-secondary mt-5" to="/settings">
            <Settings size={16} />
            Settings
          </Link>
        </aside>

        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Bookmark} label="Saved blogs" value={bookmarks.length} tone="coral" />
            <StatCard icon={Clock} label="Recently read" value={recent.length} tone="mint" />
            <StatCard icon={Heart} label="Account role" value={user.role} tone="gold" />
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recently read</h2>
              <Link className="text-sm font-semibold text-coral" to="/bookmarks">
                View saved
              </Link>
            </div>
            {recent.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {recent.slice(0, 4).map((blog, index) => (
                  <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </div>
            ) : (
              <div className="surface p-8 text-center">
                <UserRound className="mx-auto text-ink-500" />
                <p className="mt-3 text-ink-500 dark:text-ink-200">Open a blog to start your reading history.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </MotionPage>
  );
}
