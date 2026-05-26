import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MotionPage from '../components/MotionPage.jsx';
import { api } from '../services/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [complete, setComplete] = useState(false);
  const token = params.get('token') || '';

  async function submit(event) {
    event.preventDefault();
    await api.post('/auth/reset-password', { token, password });
    setComplete(true);
    toast.success('Password reset');
  }

  return (
    <MotionPage className="grid min-h-[calc(100vh-130px)] place-items-center px-4 py-12">
      <section className="surface w-full max-w-md p-6">
        <h1 className="text-3xl font-semibold">Choose a new password</h1>
        {complete ? (
          <div className="mt-5">
            <p className="text-ink-600 dark:text-ink-100">Your password was updated successfully.</p>
            <Link className="btn-primary mt-5" to="/login">
              Login
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="mt-5 block">
              <span className="label">New password</span>
              <input
                className="field"
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button className="btn-primary mt-5 w-full" type="submit" disabled={!token}>
              Reset password
            </button>
          </form>
        )}
      </section>
    </MotionPage>
  );
}
