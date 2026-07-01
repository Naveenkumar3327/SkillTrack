import mongoose, { Schema } from 'mongoose';

const TestCaseSchema = new Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

const PracticeQuestionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  constraints: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  category: { type: String, default: 'Algorithms' },
  testCases: { type: [TestCaseSchema], required: true },
  hints: { type: [String], default: [] },
  solutionCode: { type: String, default: '' }
}, {
  timestamps: true
});

export const PracticeQuestion = mongoose.model('PracticeQuestion', PracticeQuestionSchema);
