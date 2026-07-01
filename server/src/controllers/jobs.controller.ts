import { Request, Response } from 'express';
import { Job } from '../models/job.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ScraperService } from '../services/scraper.service';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    const searchQuery = search ? String(search).trim() : '';
    
    // 1. Build local database filter
    const filter: any = {};
    if (type) {
      filter.type = type;
    }
    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { companyName: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const localJobs = await Job.find(filter);

    // 2. Fetch external jobs if search query is provided
    let externalJobs: any[] = [];
    if (searchQuery) {
      externalJobs = await ScraperService.scrapeJobs(searchQuery);
      if (type) {
        externalJobs = externalJobs.filter(j => j.type === type);
      }
    }

    // Combine local jobs (which support in-app applying) and external scraped jobs
    return res.status(200).json([...localJobs, ...externalJobs]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, companyName, description, type, skillsRequired, salaryRange, location, isRemote } = req.body;
    const job = new Job({ title, companyName, description, type, skillsRequired, salaryRange, location, isRemote });
    await job.save();
    return res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const applyToJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if already applied
    const alreadyApplied = job.applications.some(app => app.studentId.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this role' });
    }

    job.applications.push({
      studentId: req.user._id,
      status: 'applied'
    });

    await job.save();
    return res.status(200).json({ message: 'Application submitted successfully', job });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jobId, applicationId } = req.params;
    const { status, feedback, interviewDate } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const application = job.applications.id(applicationId);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    if (status) application.status = status;
    if (feedback) application.feedback = feedback;
    if (interviewDate) application.interviewDate = new Date(interviewDate);

    await job.save();
    return res.status(200).json({ message: 'Application updated successfully', job });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
