import mongoose, { Schema } from 'mongoose';

const LessonSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in minutes
  notes: { type: String, default: '' }
});

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: String, required: true },
  lessons: { type: [LessonSchema], default: [] },
  ratings: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, required: true },
    comment: { type: String, default: '' }
  }],
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

export const Course = mongoose.model('Course', CourseSchema);
