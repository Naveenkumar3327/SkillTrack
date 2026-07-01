'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Award, ShieldAlert, Loader2, Sparkles } from 'lucide-react';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [board, setBoard] = useState<any[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setLoadingBoard(true);
      api.getLeaderboard()
        .then(data => setBoard(data))
        .catch(() => {})
        .finally(() => setLoadingBoard(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Gamified Performance Ranking
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Global Skill Leaderboard</h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Compare total career experience points (XP) earned from coding solutions, mock evaluations, and course completions.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        {loadingBoard ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400 text-xs uppercase font-extrabold tracking-wider bg-white/[0.01]">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6 text-right w-36">Total Career XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {board.map((u, idx) => {
                  const isGold = idx === 0;
                  const isSilver = idx === 1;
                  const isBronze = idx === 2;
                  
                  return (
                    <tr 
                      key={u._id} 
                      className={`hover:bg-white/[0.02] transition ${
                        u._id === user._id ? 'bg-purple-500/5' : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-center">
                        {isGold || isSilver || isBronze ? (
                          <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-black ${
                            isGold ? 'bg-yellow-500 text-black' : isSilver ? 'bg-zinc-300 text-black' : 'bg-amber-600 text-black'
                          }`}>
                            {idx + 1}
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-sm font-semibold">{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {u.name}
                            {u._id === user._id && (
                              <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-extrabold uppercase">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-zinc-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-zinc-400 font-medium">
                        {u.department || 'Computer Science'}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-yellow-400 text-sm">
                        {u.xp || 0} XP
                      </td>
                    </tr>
                  );
                })}
                {board.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500 text-sm italic">
                      No rank statistics populated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
