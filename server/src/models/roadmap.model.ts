import mongoose, { Schema } from 'mongoose';

const RoadmapStepSchema = new Schema({
  phase: { type: String, required: true }, // e.g., "Phase 1: Foundations"
  title: { type: String, required: true }, // e.g., "Learn Python syntax & OOP"
  description: { type: String, default: '' },
  resources: { type: [String], default: [] }, // Recommended links / courses
  durationWeeks: { type: Number, default: 2 },
  isCompleted: { type: Boolean, default: false }
});

const RoadmapSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  targetRole: { type: String, required: true }, // e.g., "Full Stack Developer"
  estimatedTimeMonths: { type: Number, default: 3 },
  steps: { type: [RoadmapStepSchema], default: [] }
}, {
  timestamps: true
});

export const Roadmap = mongoose.model('Roadmap', RoadmapSchema);
