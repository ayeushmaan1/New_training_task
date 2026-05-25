import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, ImageUp, Save } from 'lucide-react';
import MotionPage from '../../components/MotionPage.jsx';
import MarkdownPreview from '../../components/MarkdownPreview.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { api, mediaUrl } from '../../services/api.js';

const emptyBlog = {
  title: '',
  excerpt: '',
  content: '## Draft heading\n\nWrite your blog content in Markdown.',
  coverImage: '',
  category: 'Engineering',
  tags: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: ''
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyBlog);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const categoriesResponse = await api.get('/blogs/categories');
      if (active) {
        setCategories(categoriesResponse.data.categories);
      }

      if (id) {
        const response = await api.get(`/admin/blogs/${id}`);
        if (active) {
          setForm({
            ...response.data.blog,
            tags: response.data.blog.tags.join(', ')
          });
          setLoading(false);
        }
      }
    }

    load().finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const readTime = useMemo(() => Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 220)), [form.content]);

  async function uploadCover(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploading(true);
    try {
      const response = await api.post('/uploads/image', data);
      setForm((current) => ({ ...current, coverImage: response.data.url }));
      toast.success('Image uploaded');
    } finally {
      setUploading(false);
    }
  }

  async function save(status = form.status) {
    const payload = {
      ...form,
      status,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    };
    if (id) {
      await api.patch(`/blogs/${id}`, payload);
      toast.success('Blog updated');
    } else {
      await api.post('/blogs', payload);
      toast.success(status === 'published' ? 'Blog published' : 'Draft saved');
    }
    navigate('/admin/blogs');
  }

  if (loading) {
    return <Loading label="Opening editor" />;
  }

  return (
    <MotionPage className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-coral">Editor</p>
          <h1 className="mt-2 text-3xl font-semibold">{id ? 'Edit blog' : 'Create blog'}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" type="button" onClick={() => setPreview((value) => !value)}>
            <Eye size={16} />
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button className="btn-secondary" type="button" onClick={() => save('draft')}>
            <Save size={16} />
            Save draft
          </button>
          <button className="btn-primary" type="button" onClick={() => save('published')}>
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="surface p-5">
          {preview ? (
            <MarkdownPreview content={form.content} />
          ) : (
            <div className="space-y-4">
              <label>
                <span className="label">Title</span>
                <input className="field" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
              </label>
              <label>
                <span className="label">Excerpt</span>
                <textarea
                  className="field min-h-24"
                  value={form.excerpt}
                  onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
                  required
                />
              </label>
              <label>
                <span className="label">Content</span>
                <textarea
                  className="field min-h-[480px] font-mono text-sm leading-7"
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  required
                />
              </label>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="surface p-4">
            <label className="btn-secondary w-full cursor-pointer">
              <ImageUp size={16} />
              {uploading ? 'Uploading' : 'Upload cover'}
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadCover} />
            </label>
            {form.coverImage && <img className="mt-4 aspect-video w-full rounded-md object-cover" src={mediaUrl(form.coverImage)} alt="" />}
          </div>

          <div className="surface space-y-4 p-4">
            <label>
              <span className="label">Category</span>
              <select className="field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label">Tags</span>
              <input className="field" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="react, security" />
            </label>
            <label>
              <span className="label">SEO title</span>
              <input className="field" value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
            </label>
            <label>
              <span className="label">SEO description</span>
              <textarea
                className="field min-h-24"
                value={form.seoDescription}
                onChange={(event) => setForm({ ...form, seoDescription: event.target.value })}
              />
            </label>
            <div className="rounded-md bg-ink-50 p-3 text-sm text-ink-600 dark:bg-white/10 dark:text-ink-100">
              Estimated reading time: {readTime} min
            </div>
          </div>
        </aside>
      </div>
    </MotionPage>
  );
}
