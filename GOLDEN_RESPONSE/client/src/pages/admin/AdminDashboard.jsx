import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Eye, FileText, MessageSquare, Plus, Users } from 'lucide-react';
import MotionPage from '../../components/MotionPage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { api } from '../../services/api.js';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/admin/dashboard').then((response) => active && setData(response.data));
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return <Loading label="Loading admin dashboard" />;
  }

  return (
    <MotionPage className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-coral">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold">Admin dashboard</h1>
        </div>
        <Link className="btn-primary" to="/admin/blogs/new">
          <Plus size={16} />
          New blog
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Users" value={data.totals.users} tone="mint" />
        <StatCard icon={FileText} label="Blogs" value={data.totals.blogs} tone="coral" />
        <StatCard icon={MessageSquare} label="Comments" value={data.totals.comments} tone="gold" />
        <StatCard icon={Eye} label="Views" value={data.totals.views} tone="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={19} />
            <h2 className="text-xl font-semibold">Most viewed blogs</h2>
          </div>
          <div className="space-y-4">
            {data.mostViewed.map((blog) => (
              <div key={blog.id}>
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <span className="font-medium">{blog.title}</span>
                  <span className="text-ink-500 dark:text-ink-200">{blog.views}</span>
                </div>
                <div className="h-2 rounded-sm bg-ink-100 dark:bg-white/10">
                  <div
                    className="h-2 rounded-sm bg-mint"
                    style={{ width: `${Math.max(8, (blog.views / Math.max(...data.mostViewed.map((entry) => entry.views), 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="border-l-2 border-coral pl-3">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="mt-1 text-xs text-ink-500 dark:text-ink-200">{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MotionPage>
  );
}
