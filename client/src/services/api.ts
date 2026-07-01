const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth
  login: (credentials: any) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (details: any) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(details)
  }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (profile: any) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profile)
  }),

  // AI Actions
  analyzeResume: (resumeText: string) => apiRequest('/ai/analyze-resume', {
    method: 'POST',
    body: JSON.stringify({ resumeText })
  }),
  generateRoadmap: (goal: string) => apiRequest('/ai/roadmap', {
    method: 'POST',
    body: JSON.stringify({ goal })
  }),
  getInterviewQuestions: (role: string) => apiRequest(`/ai/interview-questions?role=${encodeURIComponent(role)}`),
  gradeInterview: (question: string, answer: string) => apiRequest('/ai/grade-interview', {
    method: 'POST',
    body: JSON.stringify({ question, answer })
  }),

  // Courses
  getCourses: () => apiRequest('/courses'),
  enrollCourse: (courseId: string) => apiRequest(`/courses/${courseId}/enroll`, {
    method: 'POST'
  }),

  // Practice
  getPracticeQuestions: () => apiRequest('/practice'),
  submitCode: (questionId: string, code: string, language: string) => apiRequest(`/practice/${questionId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ code, language })
  }),

  // Jobs & Applications
  getJobs: (type?: string, search?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    const queryString = params.toString();
    return apiRequest(`/jobs${queryString ? `?${queryString}` : ''}`);
  },
  applyJob: (jobId: string) => apiRequest(`/jobs/${jobId}/apply`, {
    method: 'POST'
  }),

  // Leaderboard
  getLeaderboard: () => apiRequest('/leaderboard')
};
