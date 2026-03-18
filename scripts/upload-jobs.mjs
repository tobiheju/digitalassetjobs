// Simple job upload script using fetch
import fs from 'fs';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrzgibiilqlsgqyhwwyh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const jobsData = JSON.parse(fs.readFileSync('./data/jobs.json', 'utf8'));

async function uploadJobs() {
  const jobs = jobsData.jobs.map(job => ({
    id: crypto.randomUUID(),
    title: job.title,
    company: job.company,
    company_type: job.company_type,
    location: job.location,
    type: job.type,
    department: job.department || null,
    salary_display: job.salary_display || null,
    salary_min: null,
    salary_max: null,
    salary_currency: 'USD',
    description: `${job.title} position at ${job.company}. ${job.department ? `Department: ${job.department}.` : ''} ${job.salary_display ? `Salary: ${job.salary_display}.` : ''}`,
    requirements: [],
    url: job.url,
    posted_date: '2026-03-18',
    tags: job.skills.slice(0, 3),
    featured: false,
    is_remote: job.work_arrangement === 'Remote',
    country: job.location.includes('NY') ? 'United States' : 
             job.location.includes('UK') ? 'United Kingdom' :
             job.location.includes('Hong Kong') ? 'Hong Kong' : null,
    country_code: job.location.includes('NY') ? 'US' : 
                  job.location.includes('UK') ? 'GB' :
                  job.location.includes('Hong Kong') ? 'HK' : null,
    city: job.location.split(',')[0].replace('Remote - ', ''),
    seniority: job.seniority,
    work_arrangement: job.work_arrangement,
    skills: job.skills,
    benefits: [],
    verified: job.verified,
    source: job.source
  }));

  console.log(`Uploading ${jobs.length} jobs to Supabase...`);
  
  const response = await fetch(`${supabaseUrl}/rest/v1/jobs`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(jobs)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Upload failed:', response.status, error);
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = await response.json();
  console.log(`Successfully uploaded ${result.length} jobs!`);
  return result;
}

uploadJobs()
  .then(result => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
