'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sparkles, MessageSquare, Award, ArrowRight, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

export default function MockInterviewPage() {
  const router = useRouter();
  const { user, loading, refreshUserProfile } = useAuth();

  const [role, setRole] = useState('Full Stack Developer');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [gradingAnswer, setGradingAnswer] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const loadInterview = async () => {
    setLoadingQuestions(true);
    setQuestions([]);
    setCurrentIdx(0);
    setFeedback(null);
    setAnswer('');
    setError('');

    try {
      const data = await api.getInterviewQuestions(role);
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch interview questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !questions[currentIdx]) return;

    setGradingAnswer(true);
    setFeedback(null);
    setError('');

    try {
      const result = await api.gradeInterview(questions[currentIdx].question, answer);
      setFeedback(result);
      // Refresh profile to update XP points rewarded
      await refreshUserProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to grade response.');
    } finally {
      setGradingAnswer(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer('');
    setCurrentIdx(currentIdx + 1);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const activeQuestion = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" /> AI Interview Coach
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Interactive AI Mock Interview</h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Start a real-time question and answer loop. Let our AI grade your responses for technical depth and clarity.
        </p>
      </div>

      {questions.length === 0 ? (
        /* Configuration step */
        <div className="glass max-w-md mx-auto p-8 rounded-2xl border border-white/5 space-y-6 text-center">
          <MessageSquare className="h-12 w-12 text-emerald-400 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Set Up Your Simulation</h3>
            <p className="text-zinc-400 text-xs">Choose the role you want to simulate questions for.</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <button
              onClick={loadInterview}
              disabled={loadingQuestions}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loadingQuestions ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Fetching questions...
                </>
              ) : (
                <>
                  Start Interview Session <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active interview simulator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Question panel */}
          <div className="lg:col-span-6 glass p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 capitalize border border-emerald-500/20">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-xs text-zinc-500 font-bold capitalize">Type: {activeQuestion?.type}</span>
            </div>

            <div>
              <p className="text-zinc-500 text-xs uppercase font-extrabold tracking-widest mb-1">AI Prompt</p>
              <h3 className="text-lg font-bold text-white leading-relaxed">{activeQuestion?.question}</h3>
            </div>

            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label className="block text-zinc-500 text-xs uppercase font-extrabold tracking-widest mb-2">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  rows={6}
                  disabled={gradingAnswer || feedback}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600"
                  placeholder="Type your response here..."
                />
              </div>

              {!feedback && (
                <button
                  type="submit"
                  disabled={gradingAnswer}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {gradingAnswer ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Evaluating answer...
                    </>
                  ) : (
                    <>
                      Submit Answer For Scoring <CheckCircle2 className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </form>

            {error && (
              <p className="text-red-400 text-xs text-center border border-red-500/20 bg-red-500/5 p-2 rounded-lg mt-2">
                {error}
              </p>
            )}
          </div>

          {/* Answer Grading Feedback */}
          <div className="lg:col-span-6 space-y-6">
            {feedback ? (
              <div className="space-y-6 animate-fade-in">
                {/* Scores breakdown */}
                <div className="glass p-6 rounded-2xl border border-white/5">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" /> Response Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Technical</p>
                      <p className="text-xl font-black text-emerald-400">{feedback.technicalScore}%</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Communication</p>
                      <p className="text-xl font-black text-blue-400">{feedback.communicationScore}%</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Confidence</p>
                      <p className="text-xl font-black text-purple-400">{feedback.confidenceScore}%</p>
                    </div>
                  </div>
                </div>

                {/* AI Review Text */}
                <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                  <h4 className="text-sm font-bold text-white">AI Coach Review</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{feedback.feedback}</p>
                </div>

                {/* Navigation Button */}
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full py-3.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    Next Question <ChevronRight className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-emerald-400 text-sm font-semibold">Simulation completed successfully!</p>
                    <button
                      onClick={loadInterview}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      Start New Practice Session
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <MessageSquare className="h-12 w-12 text-zinc-600 mb-4 animate-bounce" />
                <p className="text-sm font-semibold text-zinc-400">Review Panel</p>
                <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                  Provide your answer and click submit. Our review panel will evaluate technical correctness, structure, and communication.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
