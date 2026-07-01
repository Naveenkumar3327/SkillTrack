import { Router } from 'express';
import { getJobs, createJob, applyToJob, updateApplicationStatus } from '../controllers/jobs.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getJobs);
router.post('/', authenticate, authorize(['admin', 'staff']), createJob);
router.post('/:jobId/apply', authenticate, applyToJob);
router.put('/:jobId/applications/:applicationId', authenticate, authorize(['admin', 'staff']), updateApplicationStatus);

export default router;
