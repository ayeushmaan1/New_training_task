import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white py-8 dark:border-white/10 dark:bg-ink-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-ink-500 dark:text-ink-200 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>Inkline Blog Platform</p>
        <div className="flex gap-4">
          <Link className="hover:text-coral" to="/about">
            About
          </Link>
          <Link className="hover:text-coral" to="/contact">
            Contact
          </Link>
          <Link className="hover:text-coral" to="/admin/login">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
