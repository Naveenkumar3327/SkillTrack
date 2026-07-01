import mongoose, { Schema } from 'mongoose';

const MCQQuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptionIndex: { type: Number, required: true },
  points: { type: Number, default: 1 }
});

const AssessmentSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['mcq', 'coding', 'aptitude', 'technical', 'logical'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  duration: { type: Number, required: true }, // in minutes
  questions: { type: [MCQQuestionSchema], default: [] },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Assessment = mongoose.model('Assessment', AssessmentSchema);
