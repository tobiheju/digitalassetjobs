import { getJobs } from "@/lib/queries/jobs"
import { InsightsClient } from "./insights-client"

export default async function MarketInsightsPage() {
  const { jobs } = await getJobs({}, 1, 5000)

  const jobData = jobs.map((j) => ({
    companyType: j.companyType,
    country: j.country,
    salaryMin: j.salaryMin,
    skills: j.tags.length > 0 ? j.tags : j.skills,
    workArrangement: j.workArrangement,
  }))

  return <InsightsClient data={jobData} />
}
