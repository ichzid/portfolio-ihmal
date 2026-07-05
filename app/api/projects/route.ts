import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/projects'

export const runtime = 'nodejs'
// ISR: re-generate maksimal setiap 1 jam supaya tidak hit DB tiap request
export const revalidate = 3600

export async function GET() {
    const projects = await getProjects()
    return NextResponse.json({ projects })
}
