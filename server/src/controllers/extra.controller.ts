import { Request, Response } from 'express';
import { Course } from '../models/course.model';
import { PracticeQuestion } from '../models/practice.model';
import { User } from '../models/user.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import vm from 'vm';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const parseInput = (inputStr: string): any => {
  try {
    return JSON.parse(inputStr);
  } catch {
    return inputStr;
  }
};

const runJavaScriptSolution = (userCode: string, inputStr: string, timeoutMs = 2000): any => {
  const parsedInput = parseInput(inputStr);
  const sandbox = {
    input: parsedInput,
    console: {
      log: () => {},
      error: () => {}
    }
  };
  const context = vm.createContext(sandbox);
  const scriptContent = `
    ${userCode}
    const result = solve(input);
    JSON.stringify(result);
  `;
  const script = new vm.Script(scriptContent);
  const jsonResult = script.runInContext(context, { timeout: timeoutMs });
  return JSON.parse(jsonResult);
};

const runPythonSolution = async (userCode: string, inputStr: string, timeoutMs = 2000): Promise<any> => {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempFile = path.join(tempDir, `solution_${Date.now()}_${Math.random().toString(36).substring(7)}.py`);
  
  const pyCode = `
import json
import sys

# User code
${userCode}

# Input data
input_data = json.loads(${JSON.stringify(inputStr)})

try:
    res = solve(input_data)
    print(json.dumps(res))
except Exception as e:
    print("ERROR:" + str(e), file=sys.stderr)
    sys.exit(1)
`;
  
  fs.writeFileSync(tempFile, pyCode);
  
  return new Promise((resolve, reject) => {
    exec(`python "${tempFile}"`, { timeout: timeoutMs }, (error, stdout, stderr) => {
      try { fs.unlinkSync(tempFile); } catch {}
      
      if (error) {
        if (error.killed) {
          return reject(new Error("Time Limit Exceeded (Strict execution limit of 2s)"));
        }
        return reject(new Error(stderr.trim() || error.message));
      }
      
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        resolve(stdout.trim());
      }
    });
  });
};

// Courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const enrollInCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Reward XP
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 10 } });

    return res.status(200).json({ message: 'Enrolled successfully', course });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Practice Questions
export const getPracticeQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await PracticeQuestion.find();
    return res.status(200).json(questions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const submitCodeSolution = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { questionId } = req.params;
    const { code, language } = req.body;

    const question = await PracticeQuestion.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const results = [];
    let allPassed = true;

    for (let i = 0; i < question.testCases.length; i++) {
      const tc = question.testCases[i];
      let actual: any = null;
      let passed = false;
      let errorMsg = '';

      try {
        if (language === 'python') {
          actual = await runPythonSolution(code, tc.input);
        } else {
          // default javascript/typescript execution
          actual = runJavaScriptSolution(code, tc.input);
        }

        // Compare actual and expected output
        const expectedParsed = parseInput(tc.output);
        
        // Deep string comparison for arrays/objects
        passed = JSON.stringify(actual) === JSON.stringify(expectedParsed);
      } catch (err: any) {
        errorMsg = err.message;
        passed = false;
      }

      if (!passed) {
        allPassed = false;
      }

      results.push({
        input: tc.input,
        expected: tc.output,
        actual: errorMsg ? `Error: ${errorMsg}` : JSON.stringify(actual),
        passed
      });
    }

    if (allPassed) {
      // Award XP
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 30 } });
    } else {
      // Deduct XP (Negative marking: -10 XP, maintaining a non-negative floor)
      const currentUser = await User.findById(req.user._id);
      if (currentUser) {
        const xpDeduction = Math.min(currentUser.xp, 10);
        await User.findByIdAndUpdate(req.user._id, { $inc: { xp: -xpDeduction } });
      }
    }

    return res.status(200).json({
      success: allPassed,
      results,
      xpEarned: allPassed ? 30 : -10
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .sort({ xp: -1 })
      .select('name email department xp role achievements')
      .limit(20);
    return res.status(200).json(users);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
