import { getProjects } from '@/lib/projects'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProjectsPage() {
    const projects = await getProjects()
    return <ProjectsClient projects={projects} />
}
