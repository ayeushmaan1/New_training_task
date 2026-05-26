import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bookmark, Clock3, Eye, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import MotionPage from '../components/MotionPage.jsx';
import MarkdownPreview from '../components/MarkdownPreview.jsx';
import Loading from '../components/ui/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, mediaUrl } from '../services/api.js';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated, setUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadBlog() {
      setLoading(true);
      try {
        const response = await api.get(`/blogs/${slug}`);
        const commentsResponse = await api.get(`/blogs/${response.data.blog.id}/comments`);
        if (!active) return;
        setBlog(response.data.blog);
        setComments(commentsResponse.data.comments);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlog();
    return () => {
      active = false;
    };
  }, [slug]);

  async function handleLike() {
    const response = await api.post(`/blogs/${blog.id}/like`);
    setBlog(response.data.blog);
  }

  async function handleBookmark() {
    const response = await api.post(`/blogs/${blog.id}/bookmark`);
    setUser(response.data.user);
    toast.success(response.data.bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
  }

  async function submitComment(event) {
    event.preventDefault();
    const response = await api.post(`/blogs/${blog.id}/comments`, { body });
    setComments((current) => [response.data.comment, ...current]);
    setBody('');
    toast.success('Comment posted');
  }

  async function deleteComment(commentId) {
    await api.delete(`/blogs/comments/${commentId}`);
    setComments((current) => current.filter((comment) => comment.id !== commentId));
    toast.success('Comment deleted');
  }

  if (loading) {
    return <Loading label="Opening blog" />;
  }

  if (!blog) {
    return null;
  }

  const liked = blog.likes?.includes(user?.id);
  const bookmarked = user?.bookmarks?.includes(blog.id);

  return (
    <MotionPage className="pb-16">
      <article>
        <header className="relative overflow-hidden bg-ink-900 text-white">
          <img className="absolute inset-0 h-full w-full object-cover opacity-34" src={mediaUrl(blog.coverImage)} alt="" />
          <div className="absolute inset-0 bg-ink-900/62" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
            <Link to="/" className="text-sm font-semibold text-white/80 hover:text-white">
              Back to blogs
            </Link>
            <p className="mt-8 inline-flex rounded-sm bg-white/12 px-3 py-1 text-sm font-semibold">{blog.category}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{blog.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">{blog.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/78">
              <span>{blog.author?.name}</span>
              <span className="flex items-center gap-1">
                <Clock3 size={15} />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye size={15} />
                {blog.views} views
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          <div className="surface p-6 sm:p-8">
            <MarkdownPreview content={blog.content} />
          </div>

          <aside className="space-y-4">
            <div className="surface p-4">
              <p className="text-sm font-semibold">Engage</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className={liked ? 'btn-primary' : 'btn-secondary'} type="button" onClick={handleLike} disabled={!isAuthenticated}>
                  <Heart size={16} />
                  {blog.likeCount}
                </button>
                <button className={bookmarked ? 'btn-primary' : 'btn-secondary'} type="button" onClick={handleBookmark} disabled={!isAuthenticated}>
                  <Bookmark size={16} />
                  Save
                </button>
              </div>
              {!isAuthenticated && (
                <p className="mt-3 text-sm text-ink-500 dark:text-ink-200">
                  <Link className="text-coral" to="/login">
                    Login
                  </Link>{' '}
                  to like, bookmark, or comment.
                </p>
              )}
            </div>
            <div className="surface p-4">
              <p className="text-sm font-semibold">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="rounded-sm bg-ink-100 px-2 py-1 text-xs dark:bg-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle size={20} />
          <h2 className="text-2xl font-semibold">Comments</h2>
        </div>

        {isAuthenticated && (
          <form className="surface mb-6 p-4" onSubmit={submitComment}>
            <label className="label" htmlFor="comment">
              Add a comment
            </label>
            <textarea
              id="comment"
              className="field min-h-28"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              minLength={2}
              maxLength={1000}
              required
            />
            <button className="btn-primary mt-3" type="submit">
              <Send size={16} />
              Post
            </button>
          </form>
        )}

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="surface p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{comment.user?.name || 'Deleted user'}</p>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-200">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                {(comment.userId === user?.id || user?.role === 'admin') && (
                  <button className="icon-button" type="button" onClick={() => deleteComment(comment.id)} aria-label="Delete comment">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="mt-3 leading-7 text-ink-700 dark:text-ink-100">{comment.body}</p>
            </div>
          ))}
        </div>
      </section>
    </MotionPage>
  );
}
