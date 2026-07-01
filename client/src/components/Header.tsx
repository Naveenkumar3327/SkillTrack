'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Target, Sun, Moon, LogOut, Code, FileSearch, GraduationCap, Compass, Briefcase, Award } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              <Target className="h-6 w-6 text-purple-400 animate-pulse" />
              <span>SkillTrack</span>
            </Link>
            
            {/* Nav links */}
            {user && (
              <nav className="hidden md:flex space-x-1 ml-10">
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/roadmaps" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <Compass className="h-4 w-4" /> AI Roadmaps
                </Link>
                <Link href="/resume-analyzer" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <FileSearch className="h-4 w-4" /> Resume AI
                </Link>
                <Link href="/practice" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <Code className="h-4 w-4" /> Practice
                </Link>
                <Link href="/interview" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <Target className="h-4 w-4" /> Mock Interview
                </Link>
                <Link href="/jobs" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> Jobs
                </Link>
                <Link href="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5">
                  <Award className="h-4 w-4" /> Leaderboard
                </Link>
              </nav>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-zinc-200">{user.name}</p>
                  <p className="text-xs text-purple-400 capitalize">{user.role}</p>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-purple-500/25 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
