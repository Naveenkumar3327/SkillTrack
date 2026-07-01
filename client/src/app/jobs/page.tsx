'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Briefcase, MapPin, DollarSign, Building2, Search, ArrowRight, Loader2, Info, ExternalLink } from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [jobs, setJobs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const loadJobs = (querySearch?: string) => {
    setLoadingJobs(true);
    const activeSearch = querySearch !== undefined ? querySearch : search;
    api.getJobs(filterType, activeSearch)
      .then((data) => setJobs(data))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  };

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user, filterType]);

  const handleApply = async (jobId: string) => {
    setApplyingJobId(jobId);
    try {
      await api.applyJob(jobId);
      alert('Application submitted successfully!');
      loadJobs(); // Refresh listing to reflect applied status
    } catch (err: any) {
      alert(err.message || 'Error submitting application.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredJobs = jobs;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Job & Placement Opportunities</h1>
          <p className="text-zinc-400 text-sm">
            AI-matched listings recommended based on your department, CGPA, and resume score.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
              filterType === '' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-zinc-300'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setFilterType('job')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
              filterType === 'job' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-zinc-300'
            }`}
          >
            Full-Time Jobs
          </button>
          <button
            onClick={() => setFilterType('internship')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
              filterType === 'internship' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-zinc-300'
            }`}
          >
            Internships
          </button>
        </div>
      </div>

      {/* Search Input & Button */}
      <form onSubmit={(e) => { e.preventDefault(); loadJobs(); }} className="flex gap-3 mb-6 max-w-lg">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Search jobs by title or company (e.g. React Developer)..."
          />
        </div>
        <button
          type="submit"
          disabled={loadingJobs}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          {loadingJobs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </form>

      {/* Search Disclaimer */}
      {search && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl mb-8 max-w-lg">
          <Info className="h-4 w-4 text-purple-400 flex-none" />
          <span>Live scraping LinkedIn and dynamically generating matching listings from Naukri.</span>
        </div>
      )}

      {/* Jobs grid list */}
      {loadingJobs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => {
            const hasApplied = !job.isExternal && job.applications?.some(
              (app: any) => app.studentId?.toString() === user._id || app.studentId === user._id
            );
            const userApplication = !job.isExternal && job.applications?.find(
              (app: any) => app.studentId?.toString() === user._id || app.studentId === user._id
            );

            return (
              <div key={job.isExternal ? `ext-${job.source}-${index}` : job._id} className="glass p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
                      <p className="text-sm text-zinc-400 flex items-center gap-1.5 font-semibold">
                        <Building2 className="h-4 w-4 text-zinc-500" /> {job.companyName}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {job.isExternal && (
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                          job.source === 'LinkedIn'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {job.source}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded">
                        {job.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {job.description}
                  </p>

                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {job.skillsRequired.map((skill: string) => (
                        <span key={skill} className="text-[10px] bg-white/5 text-zinc-450 px-2.5 py-0.5 rounded-full font-semibold border border-white/5">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <MapPin className="h-4 w-4 text-zinc-500 flex-none" />
                      <span>{job.location}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <DollarSign className="h-4 w-4 text-zinc-500 flex-none" />
                        <span>{job.salaryRange}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  {job.isExternal ? (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg capitalize">
                      <Info className="h-4 w-4" /> Live External Link
                    </div>
                  ) : hasApplied ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg capitalize">
                      <Info className="h-4 w-4" /> Status: {userApplication.status}
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-xs font-semibold">Not Applied Yet</span>
                  )}

                  {job.isExternal ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 text-white font-bold text-sm rounded-xl flex items-center gap-1.5 transition no-underline hover:text-white"
                    >
                      Apply on {job.source} <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : !hasApplied ? (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={applyingJobId === job._id}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 text-white font-bold text-sm rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {applyingJobId === job._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          Apply Now <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button disabled className="px-5 py-2.5 bg-white/5 text-zinc-500 border border-white/5 font-bold text-sm rounded-xl cursor-not-allowed">
                      Submitted
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredJobs.length === 0 && (
            <p className="text-zinc-500 text-sm italic col-span-2">No matching jobs found matching filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
