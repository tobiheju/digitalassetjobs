import { getJobs } from "@/lib/queries/jobs"
import { SkillsDemandClient } from "./skills-client"

export default async function SkillsDemandPage() {
  const { jobs } = await getJobs({}, 1, 5000)

  const jobData = jobs.map((j) => ({
    companyType: j.companyType,
    skills: j.skills,
  }))

  return <SkillsDemandClient data={jobData} />
}
