import * as cheerio from 'cheerio';
import { AIService } from './ai.service';

function generateHeuristicSkills(title: string): string[] {
  const lower = title.toLowerCase();
  if (lower.includes('react') || lower.includes('front') || lower.includes('ui') || lower.includes('ux')) {
    return ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'TailwindCSS'];
  }
  if (lower.includes('node') || lower.includes('back') || lower.includes('express') || lower.includes('api')) {
    return ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST APIs', 'SQL'];
  }
  if (lower.includes('full') || lower.includes('stack')) {
    return ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'JavaScript'];
  }
  if (lower.includes('python') || lower.includes('data') || lower.includes('ml') || lower.includes('ai') || lower.includes('machine')) {
    return ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Data Analysis', 'Git'];
  }
  if (lower.includes('java') || lower.includes('spring')) {
    return ['Java', 'Spring Boot', 'SQL', 'Hibernate', 'Git'];
  }
  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('aws')) {
    return ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'];
  }
  if (lower.includes('android') || lower.includes('flutter') || lower.includes('ios') || lower.includes('mobile') || lower.includes('react native')) {
    return ['Flutter', 'React Native', 'Mobile Development', 'Dart', 'Git', 'Android'];
  }
  return ['JavaScript', 'Git', 'Problem Solving', 'Communication', 'SQL'];
}

export class ScraperService {
  /**
   * Attempts to scrape LinkedIn guest search endpoint
   */
  static async scrapeLinkedInJobs(query: string): Promise<any[]> {
    try {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(query)}&location=India`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!response.ok) {
        console.warn(`LinkedIn guest search returned status ${response.status}. Falling back to dynamic generation.`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const jobs: any[] = [];

      $('li').each((_, elem) => {
        const title = $(elem).find('.base-search-card__title').text().trim();
        const companyName = $(elem).find('.base-search-card__subtitle').text().trim();
        const location = $(elem).find('.job-search-card__location').text().trim();
        const applyUrl = $(elem).find('a.base-card__full-link').attr('href') || '';

        if (title && companyName && applyUrl) {
          jobs.push({
            title,
            companyName,
            description: `Exciting job opportunity for a ${title} at ${companyName}. Click Apply on LinkedIn to view details, required qualifications, and apply directly.`,
            type: title.toLowerCase().includes('intern') ? 'internship' : 'job',
            location: location || 'Remote',
            salaryRange: 'Not Disclosed',
            skillsRequired: generateHeuristicSkills(title),
            applyUrl,
            isExternal: true,
            source: 'LinkedIn'
          });
        }
      });

      return jobs.slice(0, 5); // Limit to top 5 scraped jobs
    } catch (err) {
      console.error("Error scraping LinkedIn, returning empty array:", err);
      return [];
    }
  }

  /**
   * Main function to fetch scraped/generated jobs
   */
  static async scrapeJobs(query: string): Promise<any[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    // Try scraping LinkedIn concurrently
    const scrapedLinkedInPromise = this.scrapeLinkedInJobs(query);
    
    // Concurrently fetch dynamic AI / Mock listings (which will provide Naukri listings and backup LinkedIn listings)
    const generatedJobsPromise = AIService.generateExternalJobs(query);

    try {
      const [scrapedLinkedIn, generatedJobs] = await Promise.all([
        scrapedLinkedInPromise,
        generatedJobsPromise
      ]);

      const combined: any[] = [];

      // If we successfully scraped LinkedIn jobs, add them
      if (scrapedLinkedIn && scrapedLinkedIn.length > 0) {
        combined.push(...scrapedLinkedIn);
        
        // Add only Naukri jobs from the generated list to avoid duplicate LinkedIn listings
        const naukriJobs = generatedJobs.filter(job => job.source === 'Naukri');
        combined.push(...naukriJobs);
      } else {
        // If LinkedIn scraping was blocked or failed, return all generated listings (both LinkedIn and Naukri)
        combined.push(...generatedJobs);
      }

      // Return the combined jobs list (capped at 10 items)
      return combined.slice(0, 10);
    } catch (err) {
      console.error("Error combining scraped/generated jobs, falling back to mock listings:", err);
      return AIService.getMockExternalJobs(query);
    }
  }
}
