import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: String, required: true },
    userId: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ['approved', 'hidden', 'flagged'], default: 'approved' }
  },
  { timestamps: true }
);

commentSchema.index({ blogId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
