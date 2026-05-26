import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import MotionPage from '../../components/MotionPage.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { api, mediaUrl } from '../../services/api.js';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#20a58a' });

  const load = useCallback(async () => {
    const [blogsResponse, categoriesResponse] = await Promise.all([
      api.get('/admin/blogs', { params: { ...filters, includeDrafts: true, limit: 50 } }),
      api.get('/admin/categories')
    ]);
    setBlogs(blogsResponse.data.items);
    setCategories(categoriesResponse.data.categories);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(load, 180);
    return () => clearTimeout(timeout);
  }, [load]);

  async function removeBlog(id) {
    await api.delete(`/blogs/${id}`);
    setBlogs((current) => current.filter((blog) => blog.id !== id));
    toast.success('Blog deleted');
  }

  async function addCategory(event) {
    event.preventDefault();
    await api.post('/admin/categories', categoryForm);
    setCategoryForm({ name: '', color: '#20a58a' });
    load();
    toast.success('Category added');
  }

  if (loading) {
    return <Loading label="Loading blogs" />;
  }

  return (
    <MotionPage className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-mint">Content</p>
          <h1 className="mt-2 text-3xl font-semibold">Manage blogs</h1>
        </div>
        <Link className="btn-primary" to="/admin/blogs/new">
          <Plus size={16} />
          Create blog
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
              <input
                className="field pl-10"
                placeholder="Search blogs"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              />
            </label>
            <select className="field" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {blogs.length ? (
            <div className="space-y-3">
              {blogs.map((blog) => (
                <article key={blog.id} className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <img className="h-24 w-full rounded-md object-cover sm:w-36" src={mediaUrl(blog.coverImage)} alt={blog.title} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-sm bg-mint/12 px-2 py-1 text-mint">{blog.category}</span>
                      <span className="rounded-sm bg-ink-100 px-2 py-1 dark:bg-white/10">{blog.status}</span>
                    </div>
                    <h2 className="mt-2 truncate text-lg font-semibold">{blog.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-200">{blog.excerpt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link className="icon-button" to={`/admin/blogs/${blog.id}/edit`} aria-label="Edit blog">
                      <Edit3 size={16} />
                    </Link>
                    <button className="icon-button" type="button" onClick={() => removeBlog(blog.id)} aria-label="Delete blog">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No blogs found" />
          )}
        </section>

        <aside className="space-y-4">
          <form className="surface p-4" onSubmit={addCategory}>
            <h2 className="text-lg font-semibold">Categories</h2>
            <label className="mt-4 block">
              <span className="label">Name</span>
              <input className="field" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} required />
            </label>
            <label className="mt-3 block">
              <span className="label">Color</span>
              <input
                className="field h-11"
                type="color"
                value={categoryForm.color}
                onChange={(event) => setCategoryForm({ ...categoryForm, color: event.target.value })}
              />
            </label>
            <button className="btn-secondary mt-4 w-full" type="submit">
              Add category
            </button>
          </form>
          <div className="surface p-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 rounded-md bg-ink-50 px-3 py-2 dark:bg-white/10">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: category.color }} />
                    {category.name}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-ink-200">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </MotionPage>
  );
}
