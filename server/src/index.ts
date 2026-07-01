import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth.routes';
import aiRouter from './routes/ai.routes';
import jobsRouter from './routes/jobs.routes';
import extraRouter from './routes/extra.routes';

// Load models for seeding
import { Course } from './models/course.model';
import { PracticeQuestion } from './models/practice.model';
import { Job } from './models/job.model';
import { User } from './models/user.model';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Logging
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// API Routing
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api', extraRouter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Seed data function
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding database with default values...');
      
      // Create admin user
      const admin = new User({
        name: 'Admin Instructor',
        email: 'admin@skilltrack.edu',
        password: 'AdminPassword123', // Will be hashed automatically
        role: 'admin',
        department: 'Computer Science',
        skills: ['React', 'Node.js', 'MongoDB', 'Python'],
        xp: 1000
      });
      await admin.save();

      // Create courses
      await Course.create([
        {
          title: 'Full Stack Web Engineering',
          description: 'Master frontend & backend engineering with React, Next.js, and Node.',
          category: 'Web Development',
          instructor: 'Admin Instructor',
          lessons: [
            { title: 'Intro to React & Component Lifecycle', duration: 15, notes: 'Intro to hooks.' },
            { title: 'Designing Backend APIs using Express', duration: 25, notes: 'Routes, controllers, middleware.' }
          ]
        },
        {
          title: 'Artificial Intelligence & Large Language Models',
          description: 'Learn foundations of NLP, fine-tuning, and working with APIs like Gemini.',
          category: 'Data Science',
          instructor: 'Admin Instructor',
          lessons: [
            { title: 'Introduction to Prompt Engineering', duration: 20, notes: 'Zero-shot and few-shot learning.' }
          ]
        }
      ]);

      // Create job listings
      await Job.create([
        {
          title: 'Frontend Engineer Intern',
          companyName: 'Stripe',
          description: 'Join our checkout design squad and build clean payment portals with React.',
          type: 'internship',
          skillsRequired: ['React', 'TypeScript', 'CSS'],
          salaryRange: '$40 - $60 / hour',
          location: 'San Francisco, CA',
          isRemote: true
        },
        {
          title: 'Associate Software Engineer',
          companyName: 'Google',
          description: 'Develop next-generation AI and Search experiences at scale.',
          type: 'job',
          skillsRequired: ['C++', 'Python', 'Go'],
          salaryRange: '$120,000 - $150,000 / year',
          location: 'Mountain View, CA',
          isRemote: false
        }
      ]);

      console.log('Default user, courses, and jobs seeded.');
    }

    // Check practice questions count separately or check if they need company tagging
    const questionCount = await PracticeQuestion.countDocuments();
    const firstQuestion = await PracticeQuestion.findOne();
    const needsCompanyTags = firstQuestion && !firstQuestion.title.includes('[');

    if (questionCount < 300 || needsCompanyTags) {
      console.log('Seeding 300 practice questions (100 per category) with company tags...');
      await PracticeQuestion.deleteMany({});
      
      const seedQuestions = [];
      const companies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Apple', 'Uber', 'Stripe', 'Airbnb', 'Twitter'];

      // 1. Algorithms (100 questions)
      for (let i = 1; i <= 100; i++) {
        const power = (i % 4) + 2; // powers from 2 to 5
        const testCases = [];
        const company = companies[i % companies.length];
        
        // Generate programmatically calculated test cases
        for (const inputVal of [3, 5]) {
          let sum = 0;
          for (let k = 1; k <= inputVal; k++) {
            sum += Math.pow(k, power);
          }
          testCases.push({
            input: String(inputVal),
            output: String(sum),
            isHidden: false
          });
        }
        
        seedQuestions.push({
          title: `[${company}] Power Sum Series #${i}`,
          description: `Write a function 'solve(n)' to calculate the sum of numbers from 1 to n raised to the power of ${power}. This is a common algorithm pattern asked during ${company} technical screens.`,
          constraints: `1 <= n <= 20. Output should fit in a standard integer.`,
          difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
          category: 'Algorithms',
          testCases,
          hints: [`Use a loop from 1 to n.`, `Calculate power using Math.pow(i, ${power}) or arithmetic exponentiation.`],
          solutionCode: `function solve(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += Math.pow(i, ${power});\n  }\n  return sum;\n}`
        });
      }

      // 2. Data Structures (100 questions)
      for (let i = 1; i <= 100; i++) {
        const factor = (i % 5) + 2; // factors from 2 to 6
        const company = companies[i % companies.length];
        
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const output1 = input1.filter(x => x % factor === 0);
        
        const input2 = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const output2 = input2.filter(x => x % factor === 0);
        
        seedQuestions.push({
          title: `[${company}] Divisible Filter #${i}`,
          description: `Write a function 'solve(arr)' that takes an array of integers and returns a new array containing only elements divisible by ${factor}. Frequently asked in ${company} coding rounds.`,
          constraints: '1 <= arr.length <= 50. All elements are positive integers.',
          difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
          category: 'Data Structures',
          testCases: [
            { input: JSON.stringify(input1), output: JSON.stringify(output1) },
            { input: JSON.stringify(input2), output: JSON.stringify(output2) }
          ],
          hints: [`Iterate over the array.`, `Use modulo operator (%) to verify divisibility by ${factor}.`],
          solutionCode: `function solve(arr) {\n  return arr.filter(x => x % ${factor} === 0);\n}`
        });
      }

      // 3. Database / SQL Simulation (100 questions)
      for (let i = 1; i <= 100; i++) {
        const minAge = 18 + (i % 15); // min ages from 18 to 32
        const company = companies[i % companies.length];
        
        const usersList1 = [
          { id: 1, name: 'Alice', age: 20, active: true },
          { id: 2, name: 'Bob', age: 30, active: false },
          { id: 3, name: 'Charlie', age: 40, active: true }
        ];
        const output1 = usersList1.filter(u => u.age >= minAge && u.active);
        
        const usersList2 = [
          { id: 1, name: 'Dave', age: 15, active: true },
          { id: 2, name: 'Eve', age: 25, active: true },
          { id: 3, name: 'Frank', age: 35, active: true }
        ];
        const output2 = usersList2.filter(u => u.age >= minAge && u.active);
        
        seedQuestions.push({
          title: `[${company}] Active Record Query Over ${minAge} #${i}`,
          description: `Write a simulated query function 'solve(users)' that takes a list of user records and filters active users whose age is greater than or equal to ${minAge}. Commonly asked in ${company} system design database screens.`,
          constraints: 'Input records are structured as: { id: number, name: string, age: number, active: boolean }.',
          difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
          category: 'Database',
          testCases: [
            { input: JSON.stringify(usersList1), output: JSON.stringify(output1) },
            { input: JSON.stringify(usersList2), output: JSON.stringify(output2) }
          ],
          hints: [`Filter using double criteria: user.active === true and user.age >= ${minAge}.`],
          solutionCode: `function solve(users) {\n  return users.filter(u => u.active && u.age >= ${minAge});\n}`
        });
      }

      await PracticeQuestion.create(seedQuestions);
      console.log('Seeding of 300 practice questions with company tags completed successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Database connection & start server
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilltrack')
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
