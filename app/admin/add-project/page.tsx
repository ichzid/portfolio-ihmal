import { cookies } from 'next/headers'
import AddProjectClient from './AddProjectClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AddProject() {
    await cookies()
    return <AddProjectClient />
}
