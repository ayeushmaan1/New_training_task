import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LockKeyhole, LogIn } from 'lucide-react';
import MotionPage from '../components/MotionPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login({ admin = false }) {
  const [form, setForm] = useState({ email: admin ? 'admin@example.com' : 'user@example.com', password: admin ? 'Admin123!' : 'Password123!' });
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated && (!admin || user?.role === 'admin')) {
    return <Navigate to={admin ? '/admin' : location.state?.from?.pathname || '/dashboard'} replace />;
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const nextUser = await login({ ...form, admin });
      navigate(admin || nextUser.role === 'admin' ? '/admin' : location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MotionPage className="grid min-h-[calc(100vh-130px)] place-items-center px-4 py-12">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-ink-900 text-white dark:bg-white dark:text-ink-900">
            <LockKeyhole size={22} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold">{admin ? 'Admin login' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-200">
            {admin ? 'Editorial access for the Inkline team.' : 'Your reading space is waiting.'}
          </p>
        </div>

        <form className="surface p-6" onSubmit={submit}>
          <label>
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
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="btn-primary mt-5 w-full" type="submit" disabled={submitting}>
            <LogIn size={16} />
            {submitting ? 'Signing in' : 'Sign in'}
          </button>
          {!admin && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link className="text-coral hover:underline" to="/forgot-password">
                Forgot password?
              </Link>
              <Link className="text-coral hover:underline" to="/signup">
                Create account
              </Link>
            </div>
          )}
        </form>
      </section>
    </MotionPage>
  );
}
