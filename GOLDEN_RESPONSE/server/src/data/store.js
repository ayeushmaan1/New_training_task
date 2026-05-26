import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectMongo } from '../config/mongo.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';
import Activity from '../models/Activity.js';
import { estimateReadingTime, normalizeTags, toSlug } from '../utils/text.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data');
const dataFile = path.join(dataDir, 'database.json');

let mode = 'file';

const nowIso = () => new Date().toISOString();
const makeId = () => crypto.randomUUID();

function normalizeRecord(record) {
  if (!record) {
    return null;
  }

  const raw = typeof record.toObject === 'function' ? record.toObject() : record;
  const id = String(raw.id || raw._id);
  const rest = { ...raw };
  delete rest.id;
  delete rest._id;
  delete rest.__v;

  return {
    id,
    ...rest
  };
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  const normalized = normalizeRecord(user);
  const safeUser = { ...normalized };
  delete safeUser.passwordHash;
  delete safeUser.resetTokenHash;
  delete safeUser.resetTokenExpires;
  return safeUser;
}

function hydrateBlog(blog, db) {
  if (!blog) {
    return null;
  }

  const normalized = normalizeRecord(blog);
  const author = db.users.find((user) => user.id === normalized.authorId);
  const comments = db.comments.filter(
    (comment) => comment.blogId === normalized.id && comment.status === 'approved'
  );

  return {
    ...normalized,
    author: publicUser(author),
    likeCount: normalized.likes?.length || 0,
    commentCount: comments.length
  };
}

function hydrateComment(comment, db) {
  if (!comment) {
    return null;
  }

  const normalized = normalizeRecord(comment);
  const user = db.users.find((entry) => entry.id === normalized.userId);
  const blog = db.blogs.find((entry) => entry.id === normalized.blogId);

  return {
    ...normalized,
    user: publicUser(user),
    blogTitle: blog?.title || 'Deleted blog'
  };
}

function sortBlogs(blogs, sort = 'latest') {
  const getDate = (blog) => new Date(blog.publishedAt || blog.createdAt || 0).getTime();
  const score = (blog) =>
    (blog.views || 0) * 2 + (blog.likeCount || 0) * 5 + (blog.commentCount || 0) * 3;

  return [...blogs].sort((a, b) => {
    if (sort === 'most-viewed') {
      return (b.views || 0) - (a.views || 0);
    }
    if (sort === 'most-liked') {
      return (b.likeCount || 0) - (a.likeCount || 0);
    }
    if (sort === 'trending') {
      return score(b) - score(a);
    }
    return getDate(b) - getDate(a);
  });
}

function paginate(items, page = 1, limit = 9) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 9));
  const start = (safePage - 1) * safeLimit;

  return {
    items: items.slice(start, start + safeLimit),
    total: items.length,
    page: safePage,
    pages: Math.max(1, Math.ceil(items.length / safeLimit))
  };
}

async function readDb() {
  const contents = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(contents);
}

async function writeDb(db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, `${JSON.stringify(db, null, 2)}\n`, 'utf8');
}

async function buildSeedData() {
  const createdAt = nowIso();
  const adminId = makeId();
  const userId = makeId();
  const secondUserId = makeId();
  const firstBlogId = makeId();
  const secondBlogId = makeId();
  const thirdBlogId = makeId();
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminHash = await bcrypt.hash('Admin123!', 10);

  const categories = [
    { id: makeId(), name: 'Engineering', slug: 'engineering', color: '#20a58a', createdAt, updatedAt: createdAt },
    { id: makeId(), name: 'Design', slug: 'design', color: '#e86f51', createdAt, updatedAt: createdAt },
    { id: makeId(), name: 'Security', slug: 'security', color: '#d49b2a', createdAt, updatedAt: createdAt },
    { id: makeId(), name: 'Product', slug: 'product', color: '#66728a', createdAt, updatedAt: createdAt }
  ];

  const blogs = [
    {
      id: firstBlogId,
      title: 'Designing Reliable Content Platforms',
      slug: 'designing-reliable-content-platforms',
      excerpt:
        'A practical look at shaping editorial workflows, moderation, and performance into a blog platform that can grow.',
      content:
        '## Start with trust\n\nA modern content platform needs more than a posting form. It needs clear ownership, predictable publishing states, and a moderation trail that helps teams move quickly.\n\n```js\nconst publish = ({ draft, author }) => ({\n  ...draft,\n  author,\n  status: "published"\n});\n```\n\nStrong defaults make the product feel calm even when the audience grows.',
      coverImage:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80',
      category: 'Engineering',
      tags: ['architecture', 'moderation', 'performance'],
      status: 'published',
      authorId: adminId,
      views: 842,
      likes: [userId, secondUserId],
      readTime: 2,
      seoTitle: 'Reliable Content Platform Architecture',
      seoDescription: 'Editorial workflows, moderation, and performance for blog applications.',
      publishedAt: createdAt,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: secondBlogId,
      title: 'Accessible Motion for Editorial Interfaces',
      slug: 'accessible-motion-for-editorial-interfaces',
      excerpt:
        'Framer Motion can make content feel alive without burying readers in heavy visual effects.',
      content:
        '## Motion should clarify\n\nThe best interface animation gives users context. Use opacity and transform, keep durations short, and avoid animating layout-heavy properties.\n\n- Fade cards into view\n- Use staggered lists sparingly\n- Respect the user focus path\n\nAnimation is a guide, not a fireworks show.',
      coverImage:
        'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80',
      category: 'Design',
      tags: ['framer-motion', 'accessibility', 'ui'],
      status: 'published',
      authorId: adminId,
      views: 531,
      likes: [userId],
      readTime: 2,
      seoTitle: 'Accessible Framer Motion Patterns',
      seoDescription: 'How to use motion in editorial products without hurting accessibility.',
      publishedAt: createdAt,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: thirdBlogId,
      title: 'A Security Checklist for Blog APIs',
      slug: 'a-security-checklist-for-blog-apis',
      excerpt:
        'Authentication, RBAC, rate limits, validation, and upload controls are the baseline for safe content systems.',
      content:
        '## Ship the boring protections\n\nBlog APIs carry user identity, uploaded media, and public content. The baseline should include JWT verification, role checks, request validation, upload allowlists, and structured errors.\n\nSecurity work is strongest when it is repeatable.',
      coverImage:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
      category: 'Security',
      tags: ['jwt', 'rbac', 'uploads'],
      status: 'published',
      authorId: adminId,
      views: 701,
      likes: [],
      readTime: 1,
      seoTitle: 'Blog API Security Checklist',
      seoDescription: 'JWT, RBAC, rate limiting, validation, and upload controls for blog APIs.',
      publishedAt: createdAt,
      createdAt,
      updatedAt: createdAt
    }
  ];

  return {
    users: [
      {
        id: adminId,
        name: 'Admin Editor',
        email: 'admin@example.com',
        passwordHash: adminHash,
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        bio: 'Platform owner and editorial lead.',
        isBlocked: false,
        isVerified: true,
        bookmarks: [],
        recentlyRead: [],
        createdAt,
        updatedAt: createdAt
      },
      {
        id: userId,
        name: 'Maya Reader',
        email: 'user@example.com',
        passwordHash,
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        bio: 'Product-minded reader who saves useful writing.',
        isBlocked: false,
        isVerified: true,
        bookmarks: [firstBlogId, secondBlogId],
        recentlyRead: [
          { blogId: firstBlogId, readAt: createdAt },
          { blogId: secondBlogId, readAt: createdAt }
        ],
        createdAt,
        updatedAt: createdAt
      },
      {
        id: secondUserId,
        name: 'Sam Builder',
        email: 'sam@example.com',
        passwordHash,
        role: 'user',
        avatarUrl: '',
        bio: 'Engineer exploring secure publishing systems.',
        isBlocked: false,
        isVerified: true,
        bookmarks: [thirdBlogId],
        recentlyRead: [{ blogId: thirdBlogId, readAt: createdAt }],
        createdAt,
        updatedAt: createdAt
      }
    ],
    blogs,
    comments: [
      {
        id: makeId(),
        blogId: firstBlogId,
        userId,
        body: 'The moderation workflow section is exactly what most small teams miss early on.',
        status: 'approved',
        createdAt,
        updatedAt: createdAt
      },
      {
        id: makeId(),
        blogId: secondBlogId,
        userId: secondUserId,
        body: 'The motion guidance feels practical and mercifully restrained.',
        status: 'approved',
        createdAt,
        updatedAt: createdAt
      }
    ],
    categories,
    activities: [
      {
        id: makeId(),
        type: 'blog.published',
        actorId: adminId,
        message: 'Published "Designing Reliable Content Platforms"',
        subjectId: firstBlogId,
        createdAt
      },
      {
        id: makeId(),
        type: 'comment.created',
        actorId: userId,
        message: 'Maya Reader commented on a blog',
        subjectId: firstBlogId,
        createdAt
      }
    ],
    contacts: []
  };
}

async function ensureFileStore(force = false) {
  await fs.mkdir(dataDir, { recursive: true });

  if (!force) {
    try {
      const existing = await readDb();
      if (Array.isArray(existing.users) && existing.users.length > 0) {
        return;
      }
    } catch {
      // A missing or invalid file falls through to seeding.
    }
  }

  await writeDb(await buildSeedData());
}

async function seedMongo(force = false) {
  const userCount = await User.countDocuments();
  if (userCount > 0 && !force) {
    return;
  }

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Blog.deleteMany({}),
      Comment.deleteMany({}),
      Category.deleteMany({}),
      Activity.deleteMany({})
    ]);
  }

  const seed = await buildSeedData();
  const idMap = new Map();

  for (const user of seed.users) {
    const created = await User.create(user);
    idMap.set(user.id, created.id);
  }

  for (const category of seed.categories) {
    await Category.create(category);
  }

  for (const blog of seed.blogs) {
    const created = await Blog.create({
      ...blog,
      authorId: idMap.get(blog.authorId),
      likes: blog.likes.map((id) => idMap.get(id)).filter(Boolean)
    });
    idMap.set(blog.id, created.id);
  }

  for (const comment of seed.comments) {
    await Comment.create({
      ...comment,
      blogId: idMap.get(comment.blogId),
      userId: idMap.get(comment.userId)
    });
  }

  for (const activity of seed.activities) {
    await Activity.create({
      ...activity,
      actorId: idMap.get(activity.actorId),
      subjectId: idMap.get(activity.subjectId)
    });
  }

  for (const user of seed.users) {
    await User.findByIdAndUpdate(idMap.get(user.id), {
      bookmarks: user.bookmarks.map((id) => idMap.get(id)).filter(Boolean),
      recentlyRead: user.recentlyRead
        .map((entry) => ({ blogId: idMap.get(entry.blogId), readAt: entry.readAt }))
        .filter((entry) => entry.blogId)
    });
  }
}

export async function initStore(options = {}) {
  if (process.env.MONGO_URI) {
    try {
      await connectMongo(process.env.MONGO_URI);
      mode = 'mongo';
      await seedMongo(options.force);
      console.log('Data store connected to MongoDB');
      return;
    } catch (error) {
      console.warn(`MongoDB connection failed, using local JSON store: ${error.message}`);
    }
  }

  mode = 'file';
  await ensureFileStore(options.force);
  console.log('Data store using local JSON file');
}

export async function reseedStore() {
  if (mode === 'mongo' || mongoose.connection.readyState === 1) {
    await seedMongo(true);
    return;
  }

  await ensureFileStore(true);
}

export function getStoreMode() {
  return mode;
}

export function toPublicUser(user) {
  return publicUser(user);
}

export async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase();
  if (mode === 'mongo') {
    return normalizeRecord(await User.findOne({ email: normalizedEmail }).lean());
  }

  const db = await readDb();
  return db.users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

export async function findUserByResetTokenHash(hash) {
  if (mode === 'mongo') {
    return normalizeRecord(
      await User.findOne({
        resetTokenHash: hash,
        resetTokenExpires: { $gt: new Date() }
      }).lean()
    );
  }

  const db = await readDb();
  return (
    db.users.find(
      (user) =>
        user.resetTokenHash === hash && new Date(user.resetTokenExpires || 0).getTime() > Date.now()
    ) || null
  );
}

export async function getUserById(id) {
  if (!id) {
    return null;
  }

  if (mode === 'mongo') {
    return normalizeRecord(await User.findById(id).lean());
  }

  const db = await readDb();
  return db.users.find((user) => user.id === id) || null;
}

export async function createUser(payload) {
  const timestamp = nowIso();
  const user = {
    id: makeId(),
    role: 'user',
    avatarUrl: '',
    bio: '',
    isBlocked: false,
    isVerified: true,
    bookmarks: [],
    recentlyRead: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    ...payload,
    email: payload.email.toLowerCase()
  };

  if (mode === 'mongo') {
    return normalizeRecord(await User.create(user));
  }

  const db = await readDb();
  db.users.push(user);
  db.activities.unshift({
    id: makeId(),
    type: 'user.signup',
    actorId: user.id,
    message: `${user.name} joined the platform`,
    subjectId: user.id,
    createdAt: timestamp
  });
  await writeDb(db);
  return user;
}

export async function updateUser(id, patch) {
  const timestamp = nowIso();

  if (mode === 'mongo') {
    return normalizeRecord(
      await User.findByIdAndUpdate(id, { ...patch, updatedAt: timestamp }, { new: true }).lean()
    );
  }

  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === id);
  if (index === -1) {
    return null;
  }

  db.users[index] = {
    ...db.users[index],
    ...patch,
    updatedAt: timestamp
  };
  await writeDb(db);
  return db.users[index];
}

export async function listUsers({ search = '' } = {}) {
  if (mode === 'mongo') {
    const users = (await User.find({}).sort({ createdAt: -1 }).lean()).map(publicUser);
    return users.filter((user) => {
      const haystack = `${user.name} ${user.email}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }

  const db = await readDb();
  return db.users
    .map(publicUser)
    .filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function deleteUser(id) {
  if (mode === 'mongo') {
    await User.findByIdAndDelete(id);
    await Comment.deleteMany({ userId: id });
    await Blog.updateMany({}, { $pull: { likes: id } });
    await User.updateMany({}, { $pull: { bookmarks: id } });
    return true;
  }

  const db = await readDb();
  db.users = db.users.filter((user) => user.id !== id);
  db.comments = db.comments.filter((comment) => comment.userId !== id);
  db.blogs = db.blogs.map((blog) => ({
    ...blog,
    likes: blog.likes.filter((userId) => userId !== id)
  }));
  db.users = db.users.map((user) => ({
    ...user,
    bookmarks: user.bookmarks.filter((blogId) => blogId !== id)
  }));
  await writeDb(db);
  return true;
}

async function addActivity(type, actorId, message, subjectId) {
  const timestamp = nowIso();
  if (mode === 'mongo') {
    await Activity.create({ type, actorId, message, subjectId, createdAt: timestamp });
    return;
  }

  const db = await readDb();
  db.activities.unshift({ id: makeId(), type, actorId, message, subjectId, createdAt: timestamp });
  db.activities = db.activities.slice(0, 80);
  await writeDb(db);
}

export async function ensureUniqueSlug(baseSlug, ignoredId = null) {
  let candidate = toSlug(baseSlug);
  let suffix = 2;

  while (true) {
    const existing = await getRawBlogBySlug(candidate);
    if (!existing || existing.id === ignoredId) {
      return candidate;
    }
    candidate = `${toSlug(baseSlug)}-${suffix}`;
    suffix += 1;
  }
}

async function getRawBlogBySlug(slug) {
  if (mode === 'mongo') {
    return normalizeRecord(await Blog.findOne({ slug }).lean());
  }

  const db = await readDb();
  return db.blogs.find((blog) => blog.slug === slug) || null;
}

export async function listBlogs({
  search = '',
  category = '',
  tag = '',
  sort = 'latest',
  page = 1,
  limit = 9,
  status = '',
  includeDrafts = false,
  authorId = ''
} = {}) {
  const term = search.toLowerCase();
  const categoryTerm = category.toLowerCase();
  const tagTerm = tag.toLowerCase();
  let blogs;

  if (mode === 'mongo') {
    const query = {};
    if (status) {
      query.status = status;
    } else if (!includeDrafts) {
      query.status = 'published';
    }
    if (authorId) {
      query.authorId = authorId;
    }

    const docs = (await Blog.find(query).lean()).map(normalizeRecord);
    const comments = await Comment.find({ blogId: { $in: docs.map((blog) => blog.id) } }).lean();
    const users = await User.find({ _id: { $in: docs.map((blog) => blog.authorId).filter(Boolean) } }).lean();
    const userMap = new Map(users.map((user) => [String(user._id), publicUser(user)]));
    const commentCounts = comments.reduce((acc, comment) => {
      if (comment.status === 'approved') {
        acc.set(comment.blogId, (acc.get(comment.blogId) || 0) + 1);
      }
      return acc;
    }, new Map());

    blogs = docs.map((blog) => ({
      ...blog,
      author: userMap.get(blog.authorId) || null,
      likeCount: blog.likes?.length || 0,
      commentCount: commentCounts.get(blog.id) || 0
    }));
  } else {
    const db = await readDb();
    blogs = db.blogs
      .filter((blog) => {
        if (status) {
          return blog.status === status;
        }
        return includeDrafts || blog.status === 'published';
      })
      .filter((blog) => !authorId || blog.authorId === authorId)
      .map((blog) => hydrateBlog(blog, db));
  }

  blogs = blogs.filter((blog) => {
    const haystack = `${blog.title} ${blog.excerpt} ${blog.content} ${blog.category} ${blog.tags.join(' ')}`.toLowerCase();
    const matchesSearch = !term || haystack.includes(term);
    const matchesCategory = !categoryTerm || blog.category.toLowerCase() === categoryTerm;
    const matchesTag = !tagTerm || blog.tags.map((entry) => entry.toLowerCase()).includes(tagTerm);
    return matchesSearch && matchesCategory && matchesTag;
  });

  return paginate(sortBlogs(blogs, sort), page, limit);
}

export async function getBlogById(id) {
  if (mode === 'mongo') {
    const blog = normalizeRecord(await Blog.findById(id).lean());
    if (!blog) {
      return null;
    }
    const [author, commentCount] = await Promise.all([
      User.findById(blog.authorId).lean(),
      Comment.countDocuments({ blogId: blog.id, status: 'approved' })
    ]);
    return {
      ...blog,
      author: publicUser(author),
      likeCount: blog.likes?.length || 0,
      commentCount
    };
  }

  const db = await readDb();
  return hydrateBlog(db.blogs.find((blog) => blog.id === id), db);
}

export async function getBlogBySlug(slug) {
  if (mode === 'mongo') {
    const blog = normalizeRecord(await Blog.findOne({ slug }).lean());
    return blog ? getBlogById(blog.id) : null;
  }

  const db = await readDb();
  return hydrateBlog(db.blogs.find((blog) => blog.slug === slug), db);
}

export async function createBlog(payload, actorId) {
  const timestamp = nowIso();
  const slug = await ensureUniqueSlug(payload.title);
  const blog = {
    id: makeId(),
    ...payload,
    slug,
    tags: normalizeTags(payload.tags),
    authorId: actorId,
    views: 0,
    likes: [],
    readTime: estimateReadingTime(payload.content),
    publishedAt: payload.status === 'published' ? timestamp : null,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  if (mode === 'mongo') {
    const created = normalizeRecord(await Blog.create(blog));
    await addActivity('blog.created', actorId, `Created "${created.title}"`, created.id);
    return getBlogById(created.id);
  }

  const db = await readDb();
  db.blogs.unshift(blog);
  db.activities.unshift({
    id: makeId(),
    type: blog.status === 'published' ? 'blog.published' : 'blog.drafted',
    actorId,
    message: `${blog.status === 'published' ? 'Published' : 'Drafted'} "${blog.title}"`,
    subjectId: blog.id,
    createdAt: timestamp
  });
  await writeDb(db);
  return hydrateBlog(blog, db);
}

export async function updateBlog(id, payload, actorId) {
  const timestamp = nowIso();
  const existing = await getBlogById(id);
  if (!existing) {
    return null;
  }

  const patch = {
    ...payload,
    tags: payload.tags ? normalizeTags(payload.tags) : existing.tags,
    readTime: payload.content ? estimateReadingTime(payload.content) : existing.readTime,
    updatedAt: timestamp
  };

  if (payload.title && payload.title !== existing.title) {
    patch.slug = await ensureUniqueSlug(payload.title, id);
  }

  if (payload.status === 'published' && !existing.publishedAt) {
    patch.publishedAt = timestamp;
  }

  if (mode === 'mongo') {
    const updated = normalizeRecord(await Blog.findByIdAndUpdate(id, patch, { new: true }).lean());
    await addActivity('blog.updated', actorId, `Updated "${updated.title}"`, updated.id);
    return getBlogById(id);
  }

  const db = await readDb();
  const index = db.blogs.findIndex((blog) => blog.id === id);
  db.blogs[index] = { ...db.blogs[index], ...patch };
  db.activities.unshift({
    id: makeId(),
    type: 'blog.updated',
    actorId,
    message: `Updated "${db.blogs[index].title}"`,
    subjectId: id,
    createdAt: timestamp
  });
  await writeDb(db);
  return hydrateBlog(db.blogs[index], db);
}

export async function deleteBlog(id, actorId) {
  if (mode === 'mongo') {
    const blog = await Blog.findByIdAndDelete(id).lean();
    await Comment.deleteMany({ blogId: id });
    await User.updateMany({}, { $pull: { bookmarks: id, recentlyRead: { blogId: id } } });
    if (blog) {
      await addActivity('blog.deleted', actorId, `Deleted "${blog.title}"`, id);
    }
    return Boolean(blog);
  }

  const db = await readDb();
  const blog = db.blogs.find((entry) => entry.id === id);
  db.blogs = db.blogs.filter((entry) => entry.id !== id);
  db.comments = db.comments.filter((comment) => comment.blogId !== id);
  db.users = db.users.map((user) => ({
    ...user,
    bookmarks: user.bookmarks.filter((blogId) => blogId !== id),
    recentlyRead: user.recentlyRead.filter((entry) => entry.blogId !== id)
  }));
  if (blog) {
    db.activities.unshift({
      id: makeId(),
      type: 'blog.deleted',
      actorId,
      message: `Deleted "${blog.title}"`,
      subjectId: id,
      createdAt: nowIso()
    });
  }
  await writeDb(db);
  return Boolean(blog);
}

export async function incrementBlogView(id) {
  if (mode === 'mongo') {
    await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return;
  }

  const db = await readDb();
  const blog = db.blogs.find((entry) => entry.id === id);
  if (blog) {
    blog.views += 1;
    await writeDb(db);
  }
}

export async function toggleBlogLike(blogId, userId) {
  if (mode === 'mongo') {
    const blog = normalizeRecord(await Blog.findById(blogId).lean());
    if (!blog) {
      return null;
    }
    const liked = !blog.likes.includes(userId);
    const likes = liked ? [...blog.likes, userId] : blog.likes.filter((id) => id !== userId);
    await Blog.findByIdAndUpdate(blogId, { likes });
    return { blog: await getBlogById(blogId), liked };
  }

  const db = await readDb();
  const blog = db.blogs.find((entry) => entry.id === blogId);
  if (!blog) {
    return null;
  }

  const liked = !blog.likes.includes(userId);
  blog.likes = liked ? [...blog.likes, userId] : blog.likes.filter((id) => id !== userId);
  await writeDb(db);
  return { blog: hydrateBlog(blog, db), liked };
}

export async function toggleBookmark(userId, blogId) {
  const user = await getUserById(userId);
  const blog = await getBlogById(blogId);

  if (!user || !blog) {
    return null;
  }

  const bookmarked = !user.bookmarks.includes(blogId);
  const bookmarks = bookmarked
    ? [blogId, ...user.bookmarks]
    : user.bookmarks.filter((entry) => entry !== blogId);

  const updatedUser = await updateUser(userId, { bookmarks });
  return { bookmarked, user: publicUser(updatedUser) };
}

export async function addRecentlyRead(userId, blogId) {
  if (!userId || !blogId) {
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    return;
  }

  const recentlyRead = [
    { blogId, readAt: nowIso() },
    ...user.recentlyRead.filter((entry) => entry.blogId !== blogId)
  ].slice(0, 10);
  await updateUser(userId, { recentlyRead });
}

export async function getBookmarkedBlogs(userId) {
  const user = await getUserById(userId);
  if (!user) {
    return [];
  }

  const blogs = await Promise.all(user.bookmarks.map((blogId) => getBlogById(blogId)));
  return blogs.filter(Boolean);
}

export async function getRecentlyReadBlogs(userId) {
  const user = await getUserById(userId);
  if (!user) {
    return [];
  }

  const blogs = await Promise.all(user.recentlyRead.map((entry) => getBlogById(entry.blogId)));
  return blogs.filter(Boolean);
}

export async function listComments({ blogId = '', includeHidden = false } = {}) {
  if (mode === 'mongo') {
    const query = {};
    if (blogId) {
      query.blogId = blogId;
    }
    if (!includeHidden) {
      query.status = 'approved';
    }
    const comments = (await Comment.find(query).sort({ createdAt: -1 }).lean()).map(normalizeRecord);
    const users = await User.find({ _id: { $in: comments.map((comment) => comment.userId) } }).lean();
    const blogs = await Blog.find({ _id: { $in: comments.map((comment) => comment.blogId) } }).lean();
    const userMap = new Map(users.map((user) => [String(user._id), publicUser(user)]));
    const blogMap = new Map(blogs.map((blog) => [String(blog._id), blog.title]));

    return comments.map((comment) => ({
      ...comment,
      user: userMap.get(comment.userId) || null,
      blogTitle: blogMap.get(comment.blogId) || 'Deleted blog'
    }));
  }

  const db = await readDb();
  return db.comments
    .filter((comment) => !blogId || comment.blogId === blogId)
    .filter((comment) => includeHidden || comment.status === 'approved')
    .map((comment) => hydrateComment(comment, db))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getCommentById(id) {
  if (mode === 'mongo') {
    const comment = normalizeRecord(await Comment.findById(id).lean());
    if (!comment) {
      return null;
    }
    const [user, blog] = await Promise.all([
      User.findById(comment.userId).lean(),
      Blog.findById(comment.blogId).lean()
    ]);
    return {
      ...comment,
      user: publicUser(user),
      blogTitle: blog?.title || 'Deleted blog'
    };
  }

  const db = await readDb();
  return hydrateComment(db.comments.find((comment) => comment.id === id), db);
}

export async function createComment(blogId, userId, body) {
  const blog = await getBlogById(blogId);
  const user = await getUserById(userId);
  if (!blog || !user) {
    return null;
  }

  const timestamp = nowIso();
  const comment = {
    id: makeId(),
    blogId,
    userId,
    body,
    status: 'approved',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  if (mode === 'mongo') {
    const created = normalizeRecord(await Comment.create(comment));
    await addActivity('comment.created', userId, `${user.name} commented on "${blog.title}"`, blogId);
    return getCommentById(created.id);
  }

  const db = await readDb();
  db.comments.unshift(comment);
  db.activities.unshift({
    id: makeId(),
    type: 'comment.created',
    actorId: userId,
    message: `${user.name} commented on "${blog.title}"`,
    subjectId: blogId,
    createdAt: timestamp
  });
  await writeDb(db);
  return hydrateComment(comment, db);
}

export async function updateComment(id, body) {
  if (mode === 'mongo') {
    await Comment.findByIdAndUpdate(id, { body, updatedAt: nowIso() });
    return getCommentById(id);
  }

  const db = await readDb();
  const index = db.comments.findIndex((comment) => comment.id === id);
  if (index === -1) {
    return null;
  }
  db.comments[index] = { ...db.comments[index], body, updatedAt: nowIso() };
  await writeDb(db);
  return hydrateComment(db.comments[index], db);
}

export async function deleteComment(id) {
  if (mode === 'mongo') {
    const deleted = await Comment.findByIdAndDelete(id).lean();
    return Boolean(deleted);
  }

  const db = await readDb();
  const before = db.comments.length;
  db.comments = db.comments.filter((comment) => comment.id !== id);
  await writeDb(db);
  return db.comments.length !== before;
}

export async function moderateComment(id, status) {
  if (mode === 'mongo') {
    await Comment.findByIdAndUpdate(id, { status, updatedAt: nowIso() });
    return getCommentById(id);
  }

  const db = await readDb();
  const index = db.comments.findIndex((comment) => comment.id === id);
  if (index === -1) {
    return null;
  }
  db.comments[index] = { ...db.comments[index], status, updatedAt: nowIso() };
  await writeDb(db);
  return hydrateComment(db.comments[index], db);
}

export async function listCategories() {
  if (mode === 'mongo') {
    const [categories, blogs] = await Promise.all([Category.find({}).sort({ name: 1 }).lean(), Blog.find({}).lean()]);
    return categories.map((category) => ({
      ...normalizeRecord(category),
      count: blogs.filter((blog) => blog.category === category.name).length
    }));
  }

  const db = await readDb();
  return db.categories
    .map((category) => ({
      ...category,
      count: db.blogs.filter((blog) => blog.category === category.name).length
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCategory(payload) {
  const timestamp = nowIso();
  const category = {
    id: makeId(),
    name: payload.name,
    slug: toSlug(payload.name),
    color: payload.color,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  if (mode === 'mongo') {
    return normalizeRecord(await Category.create(category));
  }

  const db = await readDb();
  db.categories.push(category);
  await writeDb(db);
  return category;
}

export async function updateCategory(id, payload) {
  const patch = {
    ...payload,
    slug: payload.name ? toSlug(payload.name) : undefined,
    updatedAt: nowIso()
  };

  Object.keys(patch).forEach((key) => patch[key] === undefined && delete patch[key]);

  if (mode === 'mongo') {
    return normalizeRecord(await Category.findByIdAndUpdate(id, patch, { new: true }).lean());
  }

  const db = await readDb();
  const index = db.categories.findIndex((category) => category.id === id);
  if (index === -1) {
    return null;
  }
  db.categories[index] = { ...db.categories[index], ...patch };
  await writeDb(db);
  return db.categories[index];
}

export async function deleteCategory(id) {
  if (mode === 'mongo') {
    const deleted = await Category.findByIdAndDelete(id).lean();
    return Boolean(deleted);
  }

  const db = await readDb();
  const before = db.categories.length;
  db.categories = db.categories.filter((category) => category.id !== id);
  await writeDb(db);
  return db.categories.length !== before;
}

export async function saveContact(payload) {
  const contact = {
    id: makeId(),
    ...payload,
    createdAt: nowIso()
  };

  if (mode === 'file') {
    const db = await readDb();
    db.contacts.unshift(contact);
    await writeDb(db);
  }

  return contact;
}

async function snapshot() {
  if (mode === 'mongo') {
    const [users, blogs, comments, categories, activities] = await Promise.all([
      User.find({}).lean(),
      Blog.find({}).lean(),
      Comment.find({}).lean(),
      Category.find({}).lean(),
      Activity.find({}).sort({ createdAt: -1 }).limit(30).lean()
    ]);
    return {
      users: users.map(normalizeRecord),
      blogs: blogs.map(normalizeRecord),
      comments: comments.map(normalizeRecord),
      categories: categories.map(normalizeRecord),
      activities: activities.map(normalizeRecord)
    };
  }

  return readDb();
}

export async function getAnalytics() {
  const db = await snapshot();
  const publishedBlogs = db.blogs.filter((blog) => blog.status === 'published');
  const totalLikes = db.blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
  const totalViews = db.blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalBookmarks = db.users.reduce((sum, user) => sum + (user.bookmarks?.length || 0), 0);
  const commentBuckets = db.comments.reduce((acc, comment) => {
    const day = new Date(comment.createdAt).toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const hydratedBlogs = db.blogs.map((blog) => hydrateBlog(blog, db));

  return {
    totals: {
      users: db.users.length,
      admins: db.users.filter((user) => user.role === 'admin').length,
      blogs: db.blogs.length,
      publishedBlogs: publishedBlogs.length,
      draftBlogs: db.blogs.filter((blog) => blog.status === 'draft').length,
      comments: db.comments.length,
      hiddenComments: db.comments.filter((comment) => comment.status !== 'approved').length,
      views: totalViews,
      likes: totalLikes,
      bookmarks: totalBookmarks
    },
    mostViewed: sortBlogs(hydratedBlogs, 'most-viewed').slice(0, 5),
    mostLiked: sortBlogs(hydratedBlogs, 'most-liked').slice(0, 5),
    categories: db.categories.map((category) => ({
      ...category,
      count: db.blogs.filter((blog) => blog.category === category.name).length
    })),
    commentsByDay: Object.entries(commentBuckets).map(([date, count]) => ({ date, count })),
    recentActivity: db.activities.slice(0, 12)
  };
}
