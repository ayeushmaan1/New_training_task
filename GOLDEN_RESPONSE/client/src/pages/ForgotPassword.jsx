import { useState } from 'react';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import MotionPage from '../components/MotionPage.jsx';
import { api } from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  async function submit(event) {
    event.preventDefault();
    await api.post('/auth/forgot-password', { email });
    toast.success('Reset instructions sent if the account exists');
  }

  return (
    <MotionPage className="grid min-h-[calc(100vh-130px)] place-items-center px-4 py-12">
      <form className="surface w-full max-w-md p-6" onSubmit={submit}>
        <span className="grid h-12 w-12 place-items-center rounded-md bg-mint/12 text-mint">
          <MailCheck size={22} />
        </span>
        <h1 className="mt-4 text-3xl font-semibold">Reset password</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-200">Enter your email and the API will send a reset link when SMTP is configured.</p>
        <label className="mt-5 block">
          <span className="label">Email</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button className="btn-primary mt-5 w-full" type="submit">
          Send reset link
        </button>
      </form>
    </MotionPage>
  );
}
