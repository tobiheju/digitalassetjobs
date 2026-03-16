import { getJobs } from "@/lib/queries/jobs"
import type { Job } from "@/lib/types"
import { SalaryExplorerClient } from "./salary-client"

export default async function SalaryExplorerPage() {
  const { jobs } = await getJobs({}, 1, 5000)

  // Only keep jobs with salary data
  const jobsWithSalary = jobs.filter(
    (j) => j.salaryMin !== null && j.salaryMax !== null,
  )

  // Serialize to plain objects for client component
  const salaryData = jobsWithSalary.map((j) => ({
    companyType: j.companyType,
    country: j.country,
    seniority: j.seniority,
    salaryMin: j.salaryMin!,
    salaryMax: j.salaryMax!,
  }))

  return <SalaryExplorerClient data={salaryData} />
}
