import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/projects'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    const projects = await getProjects()
    return NextResponse.json(
        { projects },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    )
}
