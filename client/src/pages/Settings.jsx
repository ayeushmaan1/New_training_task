import { useState } from 'react';
import toast from 'react-hot-toast';
import { ImageUp, Save } from 'lucide-react';
import MotionPage from '../components/MotionPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, mediaUrl } from '../services/api.js';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '', avatarUrl: user.avatarUrl || '' });
  const [uploading, setUploading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const response = await api.patch('/auth/me', form);
    setUser(response.data.user);
    toast.success('Profile updated');
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploading(true);
    try {
      const response = await api.post('/auth/me/avatar', data);
      setForm((current) => ({ ...current, avatarUrl: response.data.avatarUrl }));
      setUser(response.data.user);
      toast.success('Avatar uploaded');
    } finally {
      setUploading(false);
    }
  }

  return (
    <MotionPage className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-mint">Settings</p>
        <h1 className="mt-2 text-4xl font-semibold">Profile settings</h1>
      </div>

      <form className="surface p-6" onSubmit={submit}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            className="h-24 w-24 rounded-md object-cover"
            src={mediaUrl(form.avatarUrl) || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(form.name)}`}
            alt={form.name}
          />
          <label className="btn-secondary cursor-pointer">
            <ImageUp size={16} />
            {uploading ? 'Uploading' : 'Upload image'}
            <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadAvatar} />
          </label>
        </div>

        <label className="mt-6 block">
          <span className="label">Name</span>
          <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label className="mt-4 block">
          <span className="label">Bio</span>
          <textarea className="field min-h-32" maxLength={280} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
        </label>
        <button className="btn-primary mt-5" type="submit">
          <Save size={16} />
          Save changes
        </button>
      </form>
    </MotionPage>
  );
}
