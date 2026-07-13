import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { verifyCsrf } from '@/lib/csrf'
import { projectSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            featured: true,
            imageUrls: true,
        },
    })
    return NextResponse.json({ projects })
}

export async function POST(req: NextRequest) {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!verifyCsrf(req)) return NextResponse.json({ error: 'CSRF invalid' }, { status: 403 })

    let payload: unknown
    try {
        payload = await req.json()
    } catch {
        return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 })
    }

    const parsed = projectSchema.safeParse(payload)
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Validasi gagal', issues: parsed.error.flatten() },
            { status: 400 }
        )
    }

    const data = parsed.data

    try {
        const existing = await prisma.project.findUnique({ where: { slug: data.slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 409 })
        }

        const project = await prisma.project.create({
            data: {
                title: data.title,
                slug: data.slug,
                category: data.category,
                description: data.description,
                longDescription: data.longDescription,
                techStack: data.techStack,
                challenge: data.challenge ?? '',
                solution: data.solution ?? '',
                impact: data.impact ?? '',
                demoUrl: data.demoUrl,
                demoVideoUrl: data.demoVideoUrl,
                githubUrl: data.githubUrl,
                featured: data.featured ?? false,
                imageUrls: data.imageUrls ?? [],
            },
        })

        return NextResponse.json({ success: true, id: project.id })
    } catch (err) {
        console.error('Create project error:', err)
        return NextResponse.json({ error: 'Gagal menyimpan project' }, { status: 500 })
    }
}
