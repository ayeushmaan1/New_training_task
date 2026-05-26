import { Bookmark, Clock3, Eye, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mediaUrl } from '../services/api.js';

export default function BlogCard({ blog, index = 0 }) {
  return (
    <motion.article
      className="group overflow-hidden rounded-md border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.26 }}
    >
      <Link to={`/blogs/${blog.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-ink-100 dark:bg-white/10">
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={mediaUrl(blog.coverImage)}
            alt={blog.title}
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-ink-500 dark:text-ink-200">
            <span className="rounded-sm bg-mint/12 px-2 py-1 text-mint">{blog.category}</span>
            <span className="flex items-center gap-1">
              <Clock3 size={13} />
              {blog.readTime} min
            </span>
          </div>
          <h3 className="text-xl font-semibold leading-snug group-hover:text-coral">{blog.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-500 dark:text-ink-200">{blog.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-sm bg-ink-100 px-2 py-1 text-xs text-ink-700 dark:bg-white/10 dark:text-white">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4 text-sm text-ink-500 dark:text-ink-200">
            <span className="flex items-center gap-1">
              <Eye size={15} />
              {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={15} />
              {blog.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={15} />
              {blog.commentCount}
            </span>
            <Bookmark size={15} className="ml-auto" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
