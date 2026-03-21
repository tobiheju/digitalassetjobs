#!/usr/bin/env node
/**
 * Dead Link Checker for Digital Asset Jobs
 * Checks all job URLs in jobs.json for 404s and other errors
 */

const fs = require('fs');
const path = require('path');

const JOBS_FILE = path.join(__dirname, '..', 'data', 'jobs.json');
const CONCURRENCY = 10;
const TIMEOUT_MS = 15000;

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeadLinkChecker/1.0)'
      },
      redirect: 'follow'
    });
    clearTimeout(timeout);
    return { url, status: response.status, ok: response.ok };
  } catch (error) {
    clearTimeout(timeout);
    return { url, status: 0, ok: false, error: error.message };
  }
}

async function checkBatch(urls) {
  return Promise.all(urls.map(checkUrl));
}

async function main() {
  // Load jobs
  const data = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
  const jobs = data.jobs || [];
  
  console.log(`Checking ${jobs.length} job URLs...\n`);
  
  // Extract URLs with company info
  const urlsToCheck = jobs.map(job => ({
    url: job.url,
    company: job.company,
    title: job.title
  }));
  
  const results = [];
  const deadLinks = [];
  
  // Process in batches
  for (let i = 0; i < urlsToCheck.length; i += CONCURRENCY) {
    const batch = urlsToCheck.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async ({ url, company, title }) => {
        const result = await checkUrl(url);
        return { ...result, company, title };
      })
    );
    
    results.push(...batchResults);
    
    // Progress indicator
    const checked = Math.min(i + CONCURRENCY, urlsToCheck.length);
    process.stdout.write(`\rProgress: ${checked}/${urlsToCheck.length} URLs checked`);
    
    // Track dead links
    for (const r of batchResults) {
      if (!r.ok) {
        deadLinks.push(r);
      }
    }
  }
  
  console.log('\n');
  
  // Summary
  const totalChecked = results.length;
  const deadCount = deadLinks.length;
  const liveCount = totalChecked - deadCount;
  
  console.log('='.repeat(60));
  console.log('DEAD LINK CHECK SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total URLs checked: ${totalChecked}`);
  console.log(`Live links: ${liveCount} ✅`);
  console.log(`Dead links: ${deadCount} ❌`);
  console.log(`Dead link rate: ${((deadCount / totalChecked) * 100).toFixed(1)}%`);
  console.log('');
  
  if (deadLinks.length > 0) {
    // Group by company
    const byCompany = {};
    for (const link of deadLinks) {
      if (!byCompany[link.company]) {
        byCompany[link.company] = [];
      }
      byCompany[link.company].push(link);
    }
    
    // Sort by count descending
    const sorted = Object.entries(byCompany)
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log('DEAD LINKS BY COMPANY:');
    console.log('-'.repeat(60));
    
    for (const [company, links] of sorted) {
      console.log(`\n${company}: ${links.length} dead link(s)`);
      for (const link of links) {
        const statusInfo = link.error ? `Error: ${link.error}` : `HTTP ${link.status}`;
        console.log(`  • ${link.title}`);
        console.log(`    ${link.url}`);
        console.log(`    Status: ${statusInfo}`);
      }
    }
    
    // Output JSON for further processing
    const outputPath = path.join(__dirname, '..', 'data', 'dead-links.json');
    fs.writeFileSync(outputPath, JSON.stringify({
      checked_at: new Date().toISOString(),
      total_checked: totalChecked,
      dead_count: deadCount,
      by_company: byCompany,
      dead_links: deadLinks
    }, null, 2));
    console.log(`\n\nDetailed results saved to: ${outputPath}`);
  } else {
    console.log('🎉 No dead links found! All job URLs are valid.');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
