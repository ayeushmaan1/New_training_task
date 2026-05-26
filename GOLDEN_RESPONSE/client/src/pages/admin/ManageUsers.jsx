import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Ban, CheckCircle2, Search, Shield, Trash2, UserRound } from 'lucide-react';
import MotionPage from '../../components/MotionPage.jsx';
import Loading from '../../components/ui/Loading.jsx';
import { api, mediaUrl } from '../../services/api.js';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await api.get('/admin/users', { params: { search } });
      setUsers(response.data.users);
      setLoading(false);
    }, 180);
    return () => clearTimeout(timeout);
  }, [search]);

  async function toggleBlock(user) {
    const response = await api.patch(`/admin/users/${user.id}`, { isBlocked: !user.isBlocked });
    setUsers((current) => current.map((entry) => (entry.id === user.id ? response.data.user : entry)));
    toast.success(response.data.user.isBlocked ? 'User blocked' : 'User unblocked');
  }

  async function removeUser(userId) {
    await api.delete(`/admin/users/${userId}`);
    setUsers((current) => current.filter((user) => user.id !== userId));
    toast.success('User removed');
  }

  if (loading) {
    return <Loading label="Loading users" />;
  }

  return (
    <MotionPage className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-coral">Moderation</p>
        <h1 className="mt-2 text-3xl font-semibold">Manage users</h1>
      </div>

      <label className="relative mb-5 block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
        <input className="field pl-10" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <article key={user.id} className="surface p-4">
            <div className="flex items-start gap-4">
              <img
                className="h-14 w-14 rounded-md object-cover"
                src={mediaUrl(user.avatarUrl) || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{user.name}</h2>
                  <span className="inline-flex items-center gap-1 rounded-sm bg-ink-100 px-2 py-1 text-xs dark:bg-white/10">
                    {user.role === 'admin' ? <Shield size={12} /> : <UserRound size={12} />}
                    {user.role}
                  </span>
                  {user.isBlocked && <span className="rounded-sm bg-red-100 px-2 py-1 text-xs text-red-700">blocked</span>}
                </div>
                <p className="mt-1 truncate text-sm text-ink-500 dark:text-ink-200">{user.email}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-600 dark:text-ink-100">{user.bio || 'No bio'}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-secondary" type="button" onClick={() => toggleBlock(user)}>
                {user.isBlocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
              <button className="btn-danger" type="button" onClick={() => removeUser(user.id)}>
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </MotionPage>
  );
}
