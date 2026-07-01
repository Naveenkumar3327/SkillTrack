'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sparkles, FileText, ChevronRight, CheckCircle2, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const { user, loading, refreshUserProfile } = useAuth();
  
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setAnalyzing(true);
    setAnalysis(null);
    setError('');

    try {
      const data = await api.analyzeResume(resumeText);
      setAnalysis(data);
      // Refresh profile to update XP points rewarded
      await refreshUserProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" /> AI Powered Resume Audit
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Resume & ATS Analyzer</h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Paste your resume text below to scan for key formatting issues, missing skills, and calculate your ATS matching score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel */}
        <div className="lg:col-span-5 glass p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" /> Resume Content
          </h3>
          
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required
                rows={12}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                placeholder="Paste the text contents of your resume here (e.g. experience details, projects, education)..."
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Scanning with AI...
                </>
              ) : (
                <>
                  Analyze Resume Now <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="text-red-400 text-xs text-center border border-red-500/20 bg-red-500/5 p-2 rounded-lg mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-fade-in">
              {/* Scores Card */}
              <div className="glass p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">ATS Score</p>
                  <p className="text-4xl font-black text-blue-400">{analysis.atsScore}/100</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Overall Quality</p>
                  <p className="text-4xl font-black text-purple-400">{analysis.overallScore}%</p>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Missing Industry Skills
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysis.missingSkills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!analysis.missingSkills || analysis.missingSkills.length === 0) && (
                    <p className="text-zinc-500 text-sm">Perfect! No critical skills missing from current content.</p>
                  )}
                </div>
              </div>

              {/* Weak Areas */}
              <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" /> Weak Areas Detected
                </h4>
                <ul className="space-y-2 text-zinc-400 text-sm pl-2 list-disc list-inside">
                  {analysis.weakAreas?.map((wa: string, idx: number) => (
                    <li key={idx}>{wa}</li>
                  ))}
                </ul>
              </div>

              {/* AI Improvement Suggestions */}
              <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-emerald-400" /> Suggested Improvements
                </h4>
                <div className="space-y-3 pt-1">
                  {analysis.suggestions?.map((sug: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 text-zinc-300 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-none mt-0.5" />
                      <p>{sug}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <FileText className="h-12 w-12 text-zinc-600 mb-4" />
              <p className="text-sm font-semibold text-zinc-400">Waiting for Resume Input</p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                Once you paste your resume content and click analyze, your interactive scores and tips will render here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
