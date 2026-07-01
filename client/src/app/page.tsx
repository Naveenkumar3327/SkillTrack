'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Award, ArrowRight, Zap, GraduationCap, Code, Compass, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from '../components/3d/TiltCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
} as const;

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6 hover:bg-purple-500/15 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" /> Empowering Student Employability with Generative AI
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto"
          >
            Scale Your Skills & Get Placed with <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">SkillTrack</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Assess technical levels, map learning steps with AI-powered roadmaps, solve coding challenges, build ATS resumes, and ace interviews.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition flex items-center justify-center gap-2">
              Get Started for Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition flex items-center justify-center">
              Student Dashboard Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Block */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-12 border-y border-white/5 bg-zinc-950/40 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">96%</p>
              <p className="text-sm text-zinc-400 mt-1">Placement Success Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">12k+</p>
              <p className="text-sm text-zinc-400 mt-1">Assessments Cleared</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">200+</p>
              <p className="text-sm text-zinc-400 mt-1">Hiring Tech Partners</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-pink-400">4.8★</p>
              <p className="text-sm text-zinc-400 mt-1">AI Recommendation Match</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Become Career-Ready
            </h2>
            <p className="text-zinc-400 text-lg">
              A comprehensive student career suite packed with intelligent features designed to get you hired.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="h-full">
              <TiltCard glowColor="purple" className="p-8 h-full flex flex-col justify-between group">
                <div>
                  <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI-Generated Roadmaps</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Input your career targets, and our customized model will outline study steps, weekly schedules, resources, and custom practice targets.
                  </p>
                </div>
                <Link href="/roadmaps" className="text-purple-400 font-semibold hover:text-purple-300 text-sm flex items-center gap-1.5 mt-auto">
                  Build a Roadmap <ChevronRight className="h-4 w-4" />
                </Link>
              </TiltCard>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="h-full">
              <TiltCard glowColor="blue" className="p-8 h-full flex flex-col justify-between group">
                <div>
                  <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Mock Interviews</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Practice text/voice mock interview loops with live AI scoring, communication checks, confidence metrics, and suggestions.
                  </p>
                </div>
                <Link href="/interview" className="text-blue-400 font-semibold hover:text-blue-300 text-sm flex items-center gap-1.5 mt-auto">
                  Start Mock Interview <ChevronRight className="h-4 w-4" />
                </Link>
              </TiltCard>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="h-full">
              <TiltCard glowColor="pink" className="p-8 h-full flex flex-col justify-between group">
                <div>
                  <div className="p-3 bg-pink-500/10 rounded-xl w-fit mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Coding Practice Arena</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Improve your problem-solving logic. Compile solutions in an interactive editor, run test cases, and earn career XP.
                  </p>
                </div>
                <Link href="/practice" className="text-pink-400 font-semibold hover:text-pink-300 text-sm flex items-center gap-1.5 mt-auto">
                  Solve Challenges <ChevronRight className="h-4 w-4" />
                </Link>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Student Journey Timeline */}
      <section className="py-16 md:py-24 bg-zinc-950/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Unlock Placements in 4 Quick Steps
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-none flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Create & Assess Profile</h4>
                    <p className="text-zinc-400 text-sm mt-1">Specify skills, department, and CGPA. Let AI run initial skill gap detection.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex items-center justify-center h-8 w-8 rounded-full bg-pink-500/20 text-pink-400 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Follow Personalized Roadmap</h4>
                    <p className="text-zinc-400 text-sm mt-1">Complete recommended lessons, write code, and verify mock test suites.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">ATS Resume Optimization</h4>
                    <p className="text-zinc-400 text-sm mt-1">Use the Resume Analyzer to test formatting, keywords, and score metrics.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Apply & Excel</h4>
                    <p className="text-zinc-400 text-sm mt-1">Apply to matching job recommendations, complete interviews, and get hired.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Interactive Showcase Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <TiltCard glowColor="emerald" className="p-8 shadow-2xl relative">
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/25">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Placement Ready
                </div>
                <h3 className="text-lg font-bold text-white mb-6">Student Readiness Dashboard</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-zinc-300 font-medium">Data Structures & Algo</span>
                      <span className="text-purple-400 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="bg-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-zinc-300 font-medium">Full Stack Integration</span>
                      <span className="text-blue-400 font-bold">90%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '90%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="bg-blue-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-zinc-300 font-medium">ATS Resume Score</span>
                      <span className="text-pink-400 font-bold">88/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '88%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="bg-pink-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <Award className="h-10 w-10 text-yellow-400 flex-none" />
                  <div>
                    <p className="text-sm font-bold text-white">Daily Learning Streak: 12 Days</p>
                    <p className="text-xs text-zinc-400">Keep it up to earn the "Top Performer" placement badge!</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 text-center relative"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Take Your Technical Skills to the Next Level?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            Sign up to build AI roadmaps, mock-test your interviewing performance, and get referred to recruiters.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition shadow-lg hover:shadow-white/20">
            Create Your Account <Zap className="h-5 w-5 fill-current" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
