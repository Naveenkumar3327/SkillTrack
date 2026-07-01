import { Router } from 'express';
import { getCourses, enrollInCourse, getPracticeQuestions, submitCodeSolution, getLeaderboard } from '../controllers/extra.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/courses', authenticate, getCourses);
router.post('/courses/:courseId/enroll', authenticate, enrollInCourse);

router.get('/practice', authenticate, getPracticeQuestions);
router.post('/practice/:questionId/submit', authenticate, submitCodeSolution);

router.get('/leaderboard', authenticate, getLeaderboard);

export default router;
