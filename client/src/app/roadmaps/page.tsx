'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Compass, Sparkles, Plus, Loader2, CheckCircle2, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../../components/3d/TiltCard';

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 15
    }
  }
} as const;

export default function RoadmapsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setGenerating(true);
    setRoadmap(null);
    setError('');

    try {
      const data = await api.generateRoadmap(goal);
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleStep = (index: number) => {
    if (!roadmap) return;
    const updatedSteps = [...roadmap.steps];
    updatedSteps[index].isCompleted = !updatedSteps[index].isCompleted;
    setRoadmap({ ...roadmap, steps: updatedSteps });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const completedStepsCount = roadmap?.steps.filter((s: any) => s.isCompleted).length || 0;
  const progressPercent = roadmap ? Math.round((completedStepsCount / roadmap.steps.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Learning Pathways
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Personalized AI Roadmaps</h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          State your career target, and our AI will build a personalized, phase-by-phase development guide.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-4"
        >
          <TiltCard glowColor="purple" className="p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-400" /> Define Target Goal
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Your Career Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g. Full Stack Developer, DevOps..."
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    Generate Roadmap <Plus className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <p className="text-red-400 text-xs text-center border border-red-500/20 bg-red-500/5 p-2 rounded-lg mt-2">
                {error}
              </p>
            )}
          </TiltCard>
        </motion.div>

        {/* Right Output Roadmap */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {roadmap ? (
              <motion.div
                key="roadmap-content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Progress Summary Card */}
                <TiltCard glowColor="blue" className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 capitalize">{roadmap.targetRole} Pathway</h3>
                    <p className="text-xs text-zinc-400">
                      Estimated Time: {roadmap.estimatedTimeMonths} Months &bull; {roadmap.steps.length} Steps
                    </p>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400 font-semibold">Progress</span>
                      <span className="text-purple-400 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        className="bg-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </TiltCard>

                {/* Steps timeline list */}
                <motion.div 
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/5"
                >
                  {roadmap.steps.map((step: any, idx: number) => (
                    <motion.div 
                      key={idx} 
                      variants={stepVariants}
                      className="relative pl-12 group"
                    >
                      {/* Tick / Circle indicator */}
                      <button
                        onClick={() => toggleStep(idx)}
                        className="absolute left-3 top-1.5 bg-zinc-950 p-1 rounded-full border border-white/10 hover:border-purple-500 text-purple-400 hover:text-purple-300 transition-colors -translate-x-1/2 z-10 cursor-pointer"
                      >
                        {step.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-purple-400 fill-purple-400/10" />
                        ) : (
                          <Circle className="h-5 w-5 text-zinc-500" />
                        )}
                      </button>

                      <TiltCard glowColor="none" className="p-6 border border-white/5 hover:border-purple-500/20">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <span className="text-[10px] uppercase font-extrabold tracking-widest text-purple-400">
                              {step.phase}
                            </span>
                            <h4 className="text-md font-bold text-white mt-0.5">{step.title}</h4>
                          </div>
                          <span className="text-xs text-zinc-500 font-semibold px-2 py-0.5 bg-white/5 rounded-md flex-none">
                            {step.durationWeeks} Weeks
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{step.description}</p>
                        
                        {/* Learning links */}
                        <div className="space-y-1.5">
                          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Recommended Resources</p>
                          {step.resources?.map((res: string, rIdx: number) => (
                            <div key={rIdx} className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-purple-400 transition cursor-pointer">
                              <PlayCircle className="h-4 w-4 text-purple-400 flex-none" />
                              <span>{res}</span>
                            </div>
                          ))}
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="roadmap-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TiltCard glowColor="none" className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <Compass className="h-12 w-12 text-zinc-600 mb-4" />
                  <p className="text-sm font-semibold text-zinc-400">Build Your First Pathway</p>
                  <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                    Submit a target position to outline all key frameworks, timelines, and study material.
                  </p>
                </TiltCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
