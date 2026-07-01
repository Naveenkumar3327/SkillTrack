import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'SkillTrack - AI Powered Skill Development & Placement Platform',
  description: 'Assess your skills, get personalized roadmaps, prepare for interviews, analyze resumes, and find top placements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Link Outfit Google font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-6 text-center text-sm text-zinc-500 border-t border-white/5 bg-zinc-950/20">
              <p>&copy; {new Date().getFullYear()} SkillTrack. All rights reserved.</p>
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
