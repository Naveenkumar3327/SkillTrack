import { Router } from 'express';
import { analyzeResumeText, requestRoadmap, getInterviewQuestions, gradeInterview } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/analyze-resume', authenticate, analyzeResumeText);
router.post('/roadmap', authenticate, requestRoadmap);
router.get('/interview-questions', authenticate, getInterviewQuestions);
router.post('/grade-interview', authenticate, gradeInterview);

export default router;
