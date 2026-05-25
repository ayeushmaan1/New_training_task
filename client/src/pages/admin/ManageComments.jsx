import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, EyeOff, MessageSquare, Trash2 } from 'lucide-react';
import MotionPage from '../../components/MotionPage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { api } from '../../services/api.js';

export default function ManageComments() {
  const [comments, setComments] = useState(null);

  async function load() {
    const response = await api.get('/admin/comments');
    setComments(response.data.comments);
  }

  useEffect(() => {
    load();
  }, []);

  async function moderate(comment, status) {
    const response = await api.patch(`/admin/comments/${comment.id}/moderate`, { status });
    setComments((current) => current.map((entry) => (entry.id === comment.id ? response.data.comment : entry)));
    toast.success(`Comment marked ${status}`);
  }

  async function remove(commentId) {
    await api.delete(`/admin/comments/${commentId}`);
    setComments((current) => current.filter((comment) => comment.id !== commentId));
    toast.success('Comment removed');
  }

  if (!comments) {
    return <Loading label="Loading comments" />;
  }

  return (
    <MotionPage className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-mint">Comments</p>
        <h1 className="mt-2 text-3xl font-semibold">Moderate comments</h1>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="surface p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <MessageSquare size={17} className="text-coral" />
                  <p className="font-semibold">{comment.user?.name || 'Deleted user'}</p>
                  <span className="rounded-sm bg-ink-100 px-2 py-1 text-xs dark:bg-white/10">{comment.status}</span>
                </div>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-200">{comment.blogTitle}</p>
                <p className="mt-3 leading-7 text-ink-700 dark:text-ink-100">{comment.body}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button className="btn-secondary" type="button" onClick={() => moderate(comment, 'approved')}>
                  <CheckCircle2 size={16} />
                  Approve
                </button>
                <button className="btn-secondary" type="button" onClick={() => moderate(comment, 'hidden')}>
                  <EyeOff size={16} />
                  Hide
                </button>
                <button className="btn-danger" type="button" onClick={() => remove(comment.id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </MotionPage>
  );
}
