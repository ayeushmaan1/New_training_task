import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    authorId: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    readTime: { type: Number, default: 1 },
    seoTitle: String,
    seoDescription: String,
    publishedAt: Date
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
blogSchema.index({ category: 1, status: 1 });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
