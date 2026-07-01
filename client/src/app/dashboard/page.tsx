'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Award, 
  Flame, 
  Briefcase, 
  BookOpen, 
  Compass, 
  Code, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { motion } from 'framer-motion';
import { TiltCard } from '../../components/3d/TiltCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
} as const;

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Fetch some initial details
      api.getCourses().then(data => setCourses(data)).catch(() => {});
      api.getPracticeQuestions().then(data => setQuestions(data)).catch(() => {});
      api.getJobs().then(data => setJobs(data.slice(0, 3))).catch(() => {});
      api.getLeaderboard().then(data => setLeaderboard(data.slice(0, 5))).catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Sample data for charts
  const skillChartData = [
    { subject: 'Frontend', A: user.skills?.includes('React') ? 85 : 40, fullMark: 100 },
    { subject: 'Backend', A: user.skills?.includes('Node.js') ? 80 : 30, fullMark: 100 },
    { subject: 'Database', A: user.skills?.includes('MongoDB') ? 75 : 35, fullMark: 100 },
    { subject: 'Algorithms', A: user.xp > 300 ? 90 : 50, fullMark: 100 },
    { subject: 'Cloud / Devops', A: user.skills?.includes('Docker') ? 80 : 20, fullMark: 100 },
    { subject: 'Interview Skills', A: 70, fullMark: 100 }
  ];

  const progressHistory = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3.5 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 3 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        className="glass p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-950/20 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Welcome Back
            </span>
            <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <Flame className="h-4 w-4 fill-current" /> {user.streakCount || 12} Day Streak
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Hey, {user.name}!</h1>
          <p className="text-zinc-400 text-sm">
            Track your employability readiness metrics and continuous placement goals here.
          </p>
        </div>

        {/* Action Widgets */}
        <div className="flex gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3"
          >
            <Award className="h-10 w-10 text-yellow-400" />
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase">Total XP Earned</p>
              <p className="text-xl font-black text-white">{user.xp || 480} XP</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3"
          >
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase">Employability</p>
              <p className="text-xl font-black text-emerald-400">88%</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Stats and Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skill distribution chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <TiltCard glowColor="purple" className="p-6">
                <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" /> Skill Competencies
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillChartData}>
                      <PolarGrid stroke="#3f3f46" />
                      <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={11} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" />
                      <Radar name={user.name} dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TiltCard>
            </motion.div>

            {/* Learning Hours Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TiltCard glowColor="blue" className="p-6">
                <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" /> Study Hours (Weekly)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressHistory}>
                      <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} />
                      <YAxis stroke="#a1a1aa" fontSize={11} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          {/* Quick Actions Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="glass p-6 rounded-2xl border border-white/5"
          >
            <h3 className="text-md font-bold text-white mb-4">Quick AI & Practice Modules</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button 
                variants={itemVariants} 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/roadmaps')} 
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 hover:bg-white/10 text-left transition cursor-pointer"
              >
                <Compass className="h-6 w-6 text-purple-400 mb-2" />
                <p className="text-sm font-semibold text-white">AI Roadmaps</p>
                <p className="text-xs text-zinc-400">Generate path</p>
              </motion.button>
              <motion.button 
                variants={itemVariants} 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/resume-analyzer')} 
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/20 hover:bg-white/10 text-left transition cursor-pointer"
              >
                <Sparkles className="h-6 w-6 text-blue-400 mb-2" />
                <p className="text-sm font-semibold text-white">ATS Analysis</p>
                <p className="text-xs text-zinc-400">Upload CV</p>
              </motion.button>
              <motion.button 
                variants={itemVariants} 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/practice')} 
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-pink-500/20 hover:bg-white/10 text-left transition cursor-pointer"
              >
                <Code className="h-6 w-6 text-pink-400 mb-2" />
                <p className="text-sm font-semibold text-white">Coding Arena</p>
                <p className="text-xs text-zinc-400">Solve test cases</p>
              </motion.button>
              <motion.button 
                variants={itemVariants} 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/interview')} 
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 hover:bg-white/10 text-left transition cursor-pointer"
              >
                <Target className="h-6 w-6 text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-white">AI Interview</p>
                <p className="text-xs text-zinc-400"> HR & Tech Mock</p>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Jobs & Leaderboard */}
        <div className="space-y-8">
          
          {/* Placement / Recommended Jobs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TiltCard glowColor="emerald" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-400" /> Matches for You
                </h3>
                <button onClick={() => router.push('/jobs')} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer">
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map((job: any, index: number) => (
                    <motion.div 
                      key={job._id || index} 
                      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
                      className="p-4 bg-white/3 rounded-xl border border-white/5 transition"
                    >
                      <p className="text-sm font-bold text-white">{job.title}</p>
                      <p className="text-xs text-zinc-400 mb-2">{job.companyName} &bull; {job.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 capitalize">
                          {job.type}
                        </span>
                        <button 
                          onClick={() => router.push(`/jobs`)}
                          className="text-xs font-bold text-white hover:underline cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">No recommended jobs available yet.</p>
                )}
              </div>
            </TiltCard>
          </motion.div>

          {/* Leaderboard Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TiltCard glowColor="none" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" /> Leaderboard
                </h3>
                <button onClick={() => router.push('/leaderboard')} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer">
                  View Full <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.map((u: any, idx: number) => (
                    <motion.div 
                      key={u._id || idx} 
                      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
                      className="flex justify-between items-center p-2.5 rounded-lg transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                          idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-zinc-400 text-black' : idx === 2 ? 'bg-amber-600 text-black' : 'text-zinc-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-white">{u.name}</p>
                      </div>
                      <span className="text-sm text-yellow-400 font-bold">{u.xp} XP</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">Connecting to leaderboard...</p>
                )}
              </div>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
