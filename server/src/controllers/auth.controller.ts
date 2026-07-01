import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'supersecret_key_skilltrack_2026_safe',
    { expiresIn: '1d' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'supersecret_refresh_key_skilltrack_2026_safe',
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    
    // Omit password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.status(201).json({ user: userResponse, accessToken, refreshToken });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp,
      streakCount: user.streakCount,
      achievements: user.achievements
    };

    return res.status(200).json({ user: userResponse, accessToken, refreshToken });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({ user: req.user });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { department, cgpa, skills, programmingLanguages, frameworks, github, linkedin, portfolio, resumeUrl } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (department !== undefined) user.department = department;
    if (cgpa !== undefined) user.cgpa = cgpa;
    if (skills !== undefined) user.skills = skills;
    if (programmingLanguages !== undefined) user.programmingLanguages = programmingLanguages;
    if (frameworks !== undefined) user.frameworks = frameworks;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;

    await user.save();
    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
