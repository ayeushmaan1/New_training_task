import mongoose from 'mongoose';

const recentlyReadSchema = new mongoose.Schema(
  {
    blogId: String,
    readAt: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatarUrl: String,
    bio: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    bookmarks: { type: [String], default: [] },
    recentlyRead: { type: [recentlyReadSchema], default: [] },
    resetTokenHash: String,
    resetTokenExpires: Date
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
