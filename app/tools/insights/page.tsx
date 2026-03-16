import { getJobs } from "@/lib/queries/jobs"
import { InsightsClient } from "./insights-client"

export default async function MarketInsightsPage() {
  const { jobs } = await getJobs({}, 1, 5000)

  const jobData = jobs.map((j) => ({
    companyType: j.companyType,
    country: j.country,
    salaryMin: j.salaryMin,
    skills: j.skills,
  }))

  return <InsightsClient data={jobData} />
}
