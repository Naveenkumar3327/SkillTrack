import mongoose, { Schema } from 'mongoose';

const ApplicationSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'interview_scheduled', 'offer_letter', 'rejected', 'selected'], default: 'applied' },
  interviewDate: { type: Date },
  feedback: { type: String, default: '' }
}, {
  timestamps: true
});

const JobSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['job', 'internship'], required: true },
  skillsRequired: { type: [String], default: [] },
  salaryRange: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  isRemote: { type: Boolean, default: false },
  applications: { type: [ApplicationSchema], default: [] }
}, {
  timestamps: true
});

export const Job = mongoose.model('Job', JobSchema);
export const Application = mongoose.model('Application', ApplicationSchema);
