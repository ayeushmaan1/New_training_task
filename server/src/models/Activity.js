import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    actorId: String,
    message: { type: String, required: true },
    subjectId: String
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
