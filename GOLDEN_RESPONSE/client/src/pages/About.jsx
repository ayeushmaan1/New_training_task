import { ShieldCheck, Sparkles, Users } from 'lucide-react';
import MotionPage from '../components/MotionPage.jsx';

const values = [
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    body: 'JWT authentication, RBAC, input validation, upload controls, rate limiting, and structured API errors keep the platform disciplined.'
  },
  {
    icon: Sparkles,
    title: 'Editorially polished',
    body: 'Admins can draft, preview, publish, tag, moderate comments, and track engagement without leaving the console.'
  },
  {
    icon: Users,
    title: 'Reader centered',
    body: 'Readers get fast search, saved blogs, recently read history, comments, likes, profile controls, and responsive layouts.'
  }
];

export default function About() {
  return (
    <MotionPage className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-coral">About</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">A full-stack blog platform built for real editorial work.</h1>
        <p className="mt-5 text-lg leading-8 text-ink-600 dark:text-ink-100">
          Inkline combines a modern reader experience with a practical admin workflow. The architecture keeps frontend, backend,
          validation, moderation, and data concerns cleanly separated so the project can grow without becoming tangled.
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title} className="surface p-6">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-mint/12 text-mint">
                <Icon size={22} />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{value.title}</h2>
              <p className="mt-3 leading-7 text-ink-600 dark:text-ink-100">{value.body}</p>
            </div>
          );
        })}
      </section>
    </MotionPage>
  );
}
