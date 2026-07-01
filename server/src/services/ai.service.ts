import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAIInstance = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'dummy_api_key_placeholder') {
    console.warn("AI WARNING: GEMINI_API_KEY is not set. Running in Mock Mode.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export class AIService {
  static async analyzeResume(resumeText: string): Promise<any> {
    const genAI = getGenAIInstance();
    if (!genAI) {
      // Mock mode fallback response
      return {
        overallScore: 78,
        atsScore: 82,
        missingSkills: ["Docker", "Kubernetes", "Redis", "TypeScript"],
        weakAreas: ["Project Impact details", "Cloud deployment descriptions"],
        suggestions: [
          "Include quantitative metrics to showcase achievements (e.g. 'Improved speed by 30%')",
          "Add cloud deployment tools like AWS or GCP to align with modern Full Stack roles.",
          "Expand the description of your React projects with performance optimization techniques."
        ]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an advanced ATS (Applicant Tracking System) parser and CV Reviewer.
        Analyze this resume text and output a JSON object containing details of missing skills, weak areas, suggestions, and scores.
        Output MUST be valid JSON matching this schema:
        {
          "overallScore": number (1-100),
          "atsScore": number (1-100),
          "missingSkills": string[],
          "weakAreas": string[],
          "suggestions": string[]
        }
        Do not add markdown formatting or backticks around the json. Only return the JSON.
        Resume content:
        ${resumeText}
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      // Clean JSON if the model returns markdown code block backticks
      const cleanJSON = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJSON);
    } catch (error) {
      console.error("AI Error in analyzeResume, falling back:", error);
      return {
        overallScore: 60,
        atsScore: 65,
        missingSkills: ["Express.js", "MongoDB"],
        weakAreas: ["Testing coverage description"],
        suggestions: ["Failed to connect to AI API. Using default analyzer heuristics."]
      };
    }
  }

  static async generateRoadmap(skills: string[], goal: string): Promise<any> {
    const genAI = getGenAIInstance();
    if (!genAI) {
      // Mock mode fallback
      return {
        targetRole: goal,
        estimatedTimeMonths: 3,
        steps: [
          {
            phase: "Phase 1: Foundation",
            title: "Advanced Data Structures & Algorithms",
            description: "Master system logic, graphs, dynamic programming, and complexity.",
            resources: ["LeetCode Practice Patterns", "MIT 6.006 Introduction to Algorithms"],
            durationWeeks: 4,
            isCompleted: false
          },
          {
            phase: "Phase 2: Modern Tech",
            title: "Next.js App Router & Server Components",
            description: "Build server-side projects, middleware, API handlers.",
            resources: ["NextJS Documentation", "SkillTrack React Modules"],
            durationWeeks: 4,
            isCompleted: false
          },
          {
            phase: "Phase 3: Integration",
            title: "CI/CD & Serverless Deployments",
            description: "Deploy client app on Vercel and backend services on Docker / Render.",
            resources: ["GitHub Actions Guide", "Docker Masterclass"],
            durationWeeks: 4,
            isCompleted: false
          }
        ]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Create a personalized learning roadmap based on:
        Current Skills: ${skills.join(', ')}
        Target Career Goal: ${goal}
        Output MUST be valid JSON (do not include markdown code block syntax):
        {
          "targetRole": "${goal}",
          "estimatedTimeMonths": number,
          "steps": [
            {
              "phase": string,
              "title": string,
              "description": string,
              "resources": string[],
              "durationWeeks": number,
              "isCompleted": false
            }
          ]
        }
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJSON = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJSON);
    } catch (error) {
      console.error("AI Error in generateRoadmap, falling back:", error);
      return {
        targetRole: goal,
        estimatedTimeMonths: 2,
        steps: [
          {
            phase: "Foundational Phase",
            title: "Core Technologies",
            description: "Learn basic building blocks for your goal.",
            resources: ["Web documentation"],
            durationWeeks: 4,
            isCompleted: false
          }
        ]
      };
    }
  }

  static async generateInterviewQuestions(role: string): Promise<any> {
    const genAI = getGenAIInstance();
    if (!genAI) {
      return [
        { id: 1, question: "Explain the difference between Virtual DOM and Shadow DOM.", type: "technical" },
        { id: 2, question: "How do you handle conflict in a team setting?", type: "behavioral" },
        { id: 3, question: "Describe how Event Loop works in Node.js.", type: "technical" },
        { id: 4, question: "Why do you want to join this company?", type: "hr" }
      ];
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Generate 4 interview questions (2 technical, 1 behavioral, 1 HR question) for a candidate applying for: ${role}.
        Output MUST be a JSON array. Only return JSON without markdown blocks or backticks:
        [
          { "id": number, "question": string, "type": "technical" | "behavioral" | "hr" }
        ]
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJSON = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJSON);
    } catch (error) {
      return [
        { id: 1, question: "Fallback question: What are your strengths?", type: "hr" }
      ];
    }
  }

  static async gradeInterviewResponse(question: string, answer: string): Promise<any> {
    const genAI = getGenAIInstance();
    if (!genAI) {
      return {
        confidenceScore: 80,
        communicationScore: 85,
        technicalScore: 75,
        overallScore: 80,
        feedback: "Your response is structured. Try to explain with an example to increase technical depth."
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Evaluate this candidate's interview answer.
        Question: ${question}
        Answer: ${answer}
        Output MUST be valid JSON. Only return JSON without markdown block wrappers:
        {
          "confidenceScore": number (1-100),
          "communicationScore": number (1-100),
          "technicalScore": number (1-100),
          "overallScore": number (1-100),
          "feedback": string
        }
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJSON = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJSON);
    } catch (error) {
      return {
        confidenceScore: 70,
        communicationScore: 70,
        technicalScore: 70,
        overallScore: 70,
        feedback: "AI feedback not available. Try again later."
      };
    }
  }

  static async generateExternalJobs(query: string): Promise<any[]> {
    const genAI = getGenAIInstance();
    if (!genAI) {
      return this.getMockExternalJobs(query);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an assistant for a job board.
        Generate a list of 6 highly realistic job postings from LinkedIn and Naukri for the search term "${query}".
        Make sure the jobs are relevant to the search query. Mix of LinkedIn and Naukri sources.
        
        Output MUST be a valid JSON array of objects with this schema:
        [
          {
            "title": string,
            "companyName": string,
            "description": string (approx 2 sentences),
            "type": "job" | "internship",
            "location": string,
            "salaryRange": string (e.g. "₹5,00,000 - ₹8,00,000 P.A." or "$70,000 - $90,000/yr"),
            "skillsRequired": string[],
            "applyUrl": string (realistic external application URL on linkedin.com or naukri.com),
            "isExternal": true,
            "source": "LinkedIn" | "Naukri"
          }
        ]
        Do not add markdown formatting or backticks around the json. Only return the JSON.
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJSON = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJSON);
    } catch (error) {
      console.error("AI Error in generateExternalJobs, falling back to mock:", error);
      return this.getMockExternalJobs(query);
    }
  }

  static getMockExternalJobs(query: string): any[] {
    const lowerQuery = query.toLowerCase();
    const sourceOptions = ['LinkedIn', 'Naukri'];
    const jobs: any[] = [];
    
    let baseTitle = query || "Software Developer";
    let skills = ['JavaScript', 'TypeScript', 'Git', 'REST APIs'];
    let description = `Join us as a ${baseTitle} to build scalable solutions and collaborate with modern product teams.`;
    
    if (lowerQuery.includes('front') || lowerQuery.includes('react')) {
      baseTitle = "Frontend Engineer";
      skills = ['React', 'JavaScript', 'TypeScript', 'CSS3', 'TailwindCSS'];
      description = "Looking for a passionate Frontend Engineer experienced in React, state management, and modern responsive styling.";
    } else if (lowerQuery.includes('back') || lowerQuery.includes('node')) {
      baseTitle = "Backend Developer";
      skills = ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs'];
      description = "Building highly scalable server-side systems, managing databases, and designing robust API endpoints.";
    } else if (lowerQuery.includes('full') || lowerQuery.includes('stack')) {
      baseTitle = "Full Stack Developer";
      skills = ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'];
      description = "Work on both frontend interfaces and backend logic to deliver complete end-to-end user experiences.";
    } else if (lowerQuery.includes('python') || lowerQuery.includes('data')) {
      baseTitle = "Data Analyst / Python Engineer";
      skills = ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Visualization'];
      description = "Analyze large datasets, write automation scripts, and generate meaningful insights to guide product decisions.";
    } else if (lowerQuery.includes('devops') || lowerQuery.includes('cloud')) {
      baseTitle = "DevOps Engineer";
      skills = ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'];
      description = "Manage cloud infrastructure, deployment pipelines, containerization, and service monitoring configurations.";
    }

    const companies = ['Google', 'TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'Cognizant', 'Airtel', 'Paytm', 'Swiggy', 'Zomato'];
    const locations = ['Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Pune, Maharashtra', 'Noida, UP', 'Remote'];

    for (let i = 0; i < 6; i++) {
      const source = sourceOptions[i % 2];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const type = (i % 3 === 0) ? 'internship' : 'job';
      const title = `${type === 'internship' ? 'Intern - ' : ''}${baseTitle}`;
      const salary = source === 'Naukri' 
        ? `₹${(5 + i * 2)},00,000 - ₹${(8 + i * 2)},00,000 P.A.`
        : `$${(70 + i * 10)}k - $${(90 + i * 10)}k/year`;

      const idSafeTitle = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
      const idSafeCompany = encodeURIComponent(company.toLowerCase().replace(/\s+/g, '-'));
      const applyUrl = source === 'LinkedIn'
        ? `https://www.linkedin.com/jobs/view/${idSafeTitle}-at-${idSafeCompany}-${3892019 + i}`
        : `https://www.naukri.com/job-listings-${idSafeTitle}-${idSafeCompany}-${i * 12345}`;

      jobs.push({
        title,
        companyName: company,
        description,
        type,
        location,
        salaryRange: salary,
        skillsRequired: skills,
        applyUrl,
        isExternal: true,
        source
      });
    }

    return jobs;
  }
}
