import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Search, TrendingUp } from 'lucide-react';
import BlogCard from '../components/BlogCard.jsx';
import MotionPage from '../components/MotionPage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loading from '../components/ui/Loading.jsx';
import { api, mediaUrl } from '../services/api.js';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', sort: 'latest' });

  useEffect(() => {
    let active = true;
    async function loadInitialData() {
      try {
        const [featuredResponse, categoriesResponse] = await Promise.all([
          api.get('/blogs/featured'),
          api.get('/blogs/categories')
        ]);
        if (!active) return;
        setFeatured(featuredResponse.data.items);
        setCategories(categoriesResponse.data.categories);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(async () => {
      const response = await api.get('/blogs', { params: { ...filters, limit: 12 } });
      if (active) {
        setBlogs(response.data.items);
      }
    }, 220);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [filters]);

  const heroBlog = featured[0];
  const categoryButtons = useMemo(() => categories.filter((category) => category.count > 0), [categories]);

  if (loading) {
    return <Loading label="Loading the latest writing" />;
  }

  return (
    <MotionPage className="pb-16">
      <section className="relative overflow-hidden bg-white dark:bg-ink-900">
        {heroBlog && (
          <div className="absolute inset-0">
            <img className="h-full w-full object-cover opacity-22 dark:opacity-18" src={mediaUrl(heroBlog.coverImage)} alt="" />
            <div className="absolute inset-0 bg-white/76 dark:bg-ink-900/82" />
          </div>
        )}
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl content-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="max-w-3xl">
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-sm bg-coral/10 px-3 py-1 text-sm font-semibold text-coral"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TrendingUp size={16} />
              Featured writing
            </motion.p>
            <motion.h1
              className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {heroBlog?.title || 'Read, save, and discuss modern product writing'}
            </motion.h1>
            <motion.p
              className="mt-5 max-w-2xl text-lg leading-8 text-ink-600 dark:text-ink-100"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {heroBlog?.excerpt ||
                'Explore secure publishing, design systems, API architecture, and practical engineering notes.'}
            </motion.p>
            {heroBlog && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Link to={`/blogs/${heroBlog.slug}`} className="btn-primary mt-7">
                  Read featured
                  <ArrowRight size={17} />
                </Link>
              </motion.div>
            )}
          </div>
          <div className="self-end">
            <div className="grid grid-cols-3 gap-3 rounded-md border border-black/5 bg-white/80 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
              {categoryButtons.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  className="rounded-md border border-black/5 px-3 py-4 text-left transition hover:-translate-y-1 hover:shadow-md dark:border-white/10"
                  type="button"
                  onClick={() => setFilters((current) => ({ ...current, category: category.name }))}
                >
                  <span className="block h-1 w-8 rounded-sm" style={{ backgroundColor: category.color }} />
                  <span className="mt-3 block text-sm font-semibold">{category.name}</span>
                  <span className="text-xs text-ink-500 dark:text-ink-200">{category.count} posts</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-mint">Explore</p>
            <h2 className="mt-2 text-3xl font-semibold">Latest blogs</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,380px)_160px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
              <input
                className="field pl-10"
                placeholder="Search title, tags, category"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              />
            </label>
            <label className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
              <select
                className="field pl-10"
                value={filters.sort}
                onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
              >
                <option value="latest">Latest</option>
                <option value="trending">Trending</option>
                <option value="most-viewed">Most viewed</option>
                <option value="most-liked">Most liked</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            className={filters.category ? 'btn-secondary' : 'btn-primary'}
            type="button"
            onClick={() => setFilters((current) => ({ ...current, category: '' }))}
          >
            All
          </button>
          {categoryButtons.map((category) => (
            <button
              key={category.id}
              className={filters.category === category.name ? 'btn-primary' : 'btn-secondary'}
              type="button"
              onClick={() => setFilters((current) => ({ ...current, category: category.name }))}
            >
              {category.name}
            </button>
          ))}
        </div>

        {blogs.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState title="No blogs matched" body="Try a different search term or category." />
        )}
      </section>
    </MotionPage>
  );
}
