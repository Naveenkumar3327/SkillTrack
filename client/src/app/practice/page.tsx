'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Code, CheckCircle, HelpCircle, Terminal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../../components/3d/TiltCard';

export default function CodingPracticePage() {
  const router = useRouter();
  const { user, loading, refreshUserProfile } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('Algorithms');
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setLoadingQuestions(true);
      api.getPracticeQuestions()
        .then((data) => {
          setQuestions(data);
          // Set default question to first Algorithm
          const algos = data.filter((q: any) => q.category === 'Algorithms');
          if (algos.length > 0) {
            setSelectedQuestion(algos[0]);
            setCode(algos[0].solutionCode || `// Solution for ${algos[0].title}\nfunction solve() {\n  // Write code here...\n}`);
          } else if (data.length > 0) {
            setSelectedQuestion(data[0]);
            setCode(data[0].solutionCode || `// Solution for ${data[0].title}\nfunction solve() {\n  // Write code here...\n}`);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingQuestions(false));
    }
  }, [user]);

  const selectQuestion = (q: any) => {
    setSelectedQuestion(q);
    setCode(q.solutionCode || `// Solution for ${q.title}\nfunction solve() {\n  // Write code here...\n}`);
    setSubmissionResult(null);
  };

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    const filtered = questions.filter(q => q.category === category);
    if (filtered.length > 0) {
      setSelectedQuestion(filtered[0]);
      setCode(filtered[0].solutionCode || `// Solution for ${filtered[0].title}\nfunction solve() {\n  // Write code here...\n}`);
    } else {
      setSelectedQuestion(null);
      setCode('');
    }
    setSubmissionResult(null);
  };

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !code.trim()) return;

    setSubmitting(true);
    setSubmissionResult(null);

    try {
      const data = await api.submitCode(selectedQuestion._id, code, language);
      setSubmissionResult(data);
      await refreshUserProfile();
    } catch (err: any) {
      alert(err.message || 'Error compiling solution.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const filteredQuestions = questions.filter(q => q.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Questions Selection List */}
        <motion.div 
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 85 }}
          className="lg:col-span-4"
        >
          <TiltCard glowColor="pink" className="p-6">
            <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-pink-400" /> Problems List
            </h3>

            {/* Category tabs */}
            <div className="flex border-b border-white/5 mb-4 gap-1 pb-2 overflow-x-auto">
              {['Algorithms', 'Data Structures', 'Database'].map(cat => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {loadingQuestions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {filteredQuestions.map((q, idx) => (
                  <motion.button
                    key={q._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(idx, 15) * 0.01 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectQuestion(q)}
                    className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                      selectedQuestion?._id === q._id
                        ? 'bg-pink-500/10 border-pink-500/30'
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <p className="text-sm font-bold text-white mb-1">{q.title}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`px-2 py-0.5 rounded font-semibold capitalize ${
                        q.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-zinc-400">{q.category}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </TiltCard>
        </motion.div>

        {/* Right Side: Code Editor and Test Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedQuestion ? (
              <motion.div
                key={selectedQuestion._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 85 }}
                className="space-y-6"
              >
                {/* Question description card */}
                <TiltCard glowColor="purple" className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{selectedQuestion.title}</h2>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-4">{selectedQuestion.description}</p>
                  {selectedQuestion.constraints && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-zinc-400 uppercase">Constraints</p>
                      <code className="text-xs bg-black/40 text-pink-400 px-2 py-1 rounded">{selectedQuestion.constraints}</code>
                    </div>
                  )}
                  {selectedQuestion.hints && selectedQuestion.hints.length > 0 && (
                    <div className="flex items-start gap-2 bg-purple-500/5 border border-purple-500/10 p-3 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-purple-400 flex-none mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white">Hint</p>
                        <p className="text-xs text-zinc-400">{selectedQuestion.hints[0]}</p>
                      </div>
                    </div>
                  )}
                </TiltCard>

                {/* Code editor card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="glass p-6 rounded-2xl border border-white/5 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-zinc-400" /> Solution Terminal
                    </h3>
                    <div className="flex gap-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python 3</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onPaste={(e) => {
                      e.preventDefault();
                      alert("Pasting code is disabled in this coding arena! Please write your solution manually.");
                    }}
                    className="w-full bg-zinc-950 font-mono text-sm border border-white/10 rounded-xl p-4 text-emerald-400 focus:outline-none focus:border-pink-500 min-h-[300px]"
                  />

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleRun}
                      disabled={submitting}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-lg hover:shadow-pink-500/25 text-white font-bold rounded-xl flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Compiling...
                        </>
                      ) : (
                        'Run Code & Test'
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Submission results */}
                <AnimatePresence>
                  {submissionResult && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden"
                    >
                      <TiltCard glowColor={submissionResult.success ? "emerald" : "pink"} className="p-6">
                        <h3 className="text-sm font-bold text-white mb-4">Execution Output</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl border ${
                            submissionResult.success 
                              ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' 
                              : 'bg-red-500/5 border-red-500/10 text-red-400'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5" />
                              <p className="text-sm font-bold">
                                {submissionResult.success ? 'All Test Cases Passed' : 'Evaluation Failed'}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-400">
                              {submissionResult.xpEarned > 0 
                                ? `Granted: +${submissionResult.xpEarned} XP Career Points`
                                : `Deducted: ${submissionResult.xpEarned} XP (Negative marking enforced for incorrect submissions)`}
                            </p>
                          </div>

                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {submissionResult.results?.map((tc: any, index: number) => (
                              <div key={index} className="p-3 bg-zinc-900 border border-white/5 rounded-lg flex justify-between items-center text-xs">
                                <div className="space-y-1">
                                  <p className="text-zinc-400 font-semibold">Test Case {index + 1}</p>
                                  <p className="text-white">Input: <code className="text-pink-400 bg-black/40 px-1 rounded">{tc.input}</code></p>
                                  <p className="text-zinc-400">Expected: <code className="text-emerald-400 bg-black/40 px-1 rounded">{tc.expected}</code></p>
                                  <p className="text-zinc-400">Actual: <code className={`${tc.passed ? 'text-emerald-400' : 'text-red-400'} bg-black/40 px-1 rounded`}>{tc.actual}</code></p>
                                </div>
                                <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                                  tc.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {tc.passed ? 'Passed' : 'Failed'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TiltCard glowColor="none" className="p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
                  <Code className="h-12 w-12 text-zinc-600 mb-4" />
                  <p className="text-zinc-400 text-sm font-semibold">Select a problem to start coding</p>
                </TiltCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
