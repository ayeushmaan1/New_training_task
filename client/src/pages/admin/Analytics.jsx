import { useEffect, useState } from 'react';
import { Bookmark, Eye, Heart, MessageSquare, Newspaper, Users } from 'lucide-react';
import MotionPage from '../../components/MotionPage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { api } from '../../services/api.js';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((response) => setData(response.data));
  }, []);

  if (!data) {
    return <Loading label="Loading analytics" />;
  }

  const maxCategory = Math.max(...data.categories.map((category) => category.count), 1);
  const maxComments = Math.max(...data.commentsByDay.map((entry) => entry.count), 1);

  return (
    <MotionPage className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-coral">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">Platform statistics</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Users" value={data.totals.users} tone="mint" />
        <StatCard icon={Newspaper} label="Published blogs" value={data.totals.publishedBlogs} tone="coral" />
        <StatCard icon={MessageSquare} label="Comments" value={data.totals.comments} tone="gold" />
        <StatCard icon={Eye} label="Views" value={data.totals.views} tone="ink" />
        <StatCard icon={Heart} label="Likes" value={data.totals.likes} tone="coral" />
        <StatCard icon={Bookmark} label="Bookmarks" value={data.totals.bookmarks} tone="mint" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="text-xl font-semibold">Category distribution</h2>
          <div className="mt-5 space-y-4">
            {data.categories.map((category) => (
              <div key={category.id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="text-ink-500 dark:text-ink-200">{category.count}</span>
                </div>
                <div className="h-3 rounded-sm bg-ink-100 dark:bg-white/10">
                  <div className="h-3 rounded-sm" style={{ width: `${(category.count / maxCategory) * 100}%`, backgroundColor: category.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="text-xl font-semibold">Comment activity</h2>
          <div className="mt-5 flex h-56 items-end gap-3">
            {data.commentsByDay.length ? (
              data.commentsByDay.map((entry) => (
                <div key={entry.date} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-sm bg-coral" style={{ height: `${Math.max(8, (entry.count / maxComments) * 190)}px` }} />
                  <span className="text-xs text-ink-500 dark:text-ink-200">{entry.date.slice(5)}</span>
                </div>
              ))
            ) : (
              <p className="self-center text-sm text-ink-500 dark:text-ink-200">No comments yet.</p>
            )}
          </div>
        </section>
      </div>
    </MotionPage>
  );
}
