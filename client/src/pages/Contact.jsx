import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import MotionPage from '../components/MotionPage.jsx';
import { api } from '../services/api.js';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);

  async function submit(event) {
    event.preventDefault();
    await api.post('/contact', form);
    setSent(true);
    setForm(initialForm);
    toast.success('Message sent');
  }

  return (
    <MotionPage className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase text-mint">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Send a note to the platform owner.</h1>
        <p className="mt-5 leading-8 text-ink-600 dark:text-ink-100">
          Questions, editorial pitches, partnership notes, and product feedback are welcome here.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-md bg-white p-4 shadow-sm dark:bg-white/5">
          <Mail className="text-coral" size={22} />
          <span className="text-sm text-ink-600 dark:text-ink-100">owner@example.com</span>
        </div>
      </section>

      <form className="surface p-6" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label">Name</span>
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
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
        </div>
        <label className="mt-4 block">
          <span className="label">Subject</span>
          <input className="field" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required />
        </label>
        <label className="mt-4 block">
          <span className="label">Message</span>
          <textarea
            className="field min-h-40"
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            required
          />
        </label>
        <button className="btn-primary mt-5" type="submit">
          <Send size={16} />
          Send message
        </button>

        {sent && (
          <motion.div
            className="mt-5 rounded-md border border-mint/30 bg-mint/10 p-4 text-sm text-mint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Thanks. Your message has been received.
          </motion.div>
        )}
      </form>
    </MotionPage>
  );
}
