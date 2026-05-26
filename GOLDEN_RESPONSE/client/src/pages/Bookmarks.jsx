import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard.jsx';
import MotionPage from '../components/MotionPage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loading from '../components/ui/Loading.jsx';
import { api } from '../services/api.js';

export default function Bookmarks() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/auth/me/bookmarks')
      .then((response) => active && setBlogs(response.data.blogs))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loading label="Loading saved blogs" />;
  }

  return (
    <MotionPage className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-coral">Saved</p>
        <h1 className="mt-2 text-4xl font-semibold">Bookmarked blogs</h1>
      </div>
      {blogs.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState title="No bookmarks yet" body="Save blogs from the reading view and they will appear here." />
      )}
    </MotionPage>
  );
}
