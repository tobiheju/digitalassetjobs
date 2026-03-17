import { getJobs } from "@/lib/queries/jobs"
import { SalaryExplorerClient } from "../tools/salary/salary-client"

export const metadata = {
  title: "Salary Explorer | Digital Asset Jobs",
  description: "Compare salaries by sector, location, and seniority across digital asset roles.",
}

export default async function SalariesPage() {
  const { jobs } = await getJobs({}, 1, 5000)

  const salaryData = jobs
    .filter((j) => j.salaryMin !== null && j.salaryMax !== null)
    .map((j) => ({
      companyType: j.companyType,
      country: j.country,
      seniority: j.seniority,
      salaryMin: j.salaryMin!,
      salaryMax: j.salaryMax!,
    }))

  return <SalaryExplorerClient data={salaryData} />
}
