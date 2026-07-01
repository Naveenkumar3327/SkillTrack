import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AIService } from '../services/ai.service';
import { User } from '../models/user.model';
import { Roadmap } from '../models/roadmap.model';

export const analyzeResumeText = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'Resume text is required' });

    const result = await AIService.analyzeResume(resumeText);
    
    // Add XP to user for using Resume Analyzer
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 15 } });
    }

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const requestRoadmap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ error: 'Goal is required' });

    const user = req.user;
    const result = await AIService.generateRoadmap(user.skills, goal);

    // Save/Update roadmap in database
    await Roadmap.findOneAndUpdate(
      { studentId: user._id },
      { targetRole: goal, steps: result.steps },
      { upsert: true, new: true }
    );

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getInterviewQuestions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.query;
    const targetRole = (role as string) || 'Full Stack Engineer';
    const questions = await AIService.generateInterviewQuestions(targetRole);
    return res.status(200).json(questions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const gradeInterview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });

    const grade = await AIService.gradeInterviewResponse(question, answer);
    
    // Add XP to user for mock interview practice
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 25 } });
    }

    return res.status(200).json(grade);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
