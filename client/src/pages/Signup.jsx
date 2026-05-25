import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import MotionPage from '../components/MotionPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MotionPage className="grid min-h-[calc(100vh-130px)] place-items-center px-4 py-12">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-coral/12 text-coral">
            <UserPlus size={22} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-200">Save blogs, comment on posts, and track recently read writing.</p>
        </div>
        <form className="surface p-6" onSubmit={submit}>
          <label>
            <span className="label">Name</span>
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="mt-4 block">
            <span className="label">Email</span>
            <input
              className="field"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="mt-4 block">
            <span className="label">Password</span>
            <input
              className="field"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="btn-primary mt-5 w-full" type="submit" disabled={submitting}>
            <UserPlus size={16} />
            {submitting ? 'Creating account' : 'Sign up'}
          </button>
          <p className="mt-4 text-center text-sm text-ink-500 dark:text-ink-200">
            Already have an account?{' '}
            <Link className="text-coral hover:underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </MotionPage>
  );
}
