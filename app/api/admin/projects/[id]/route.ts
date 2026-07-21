import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { verifyCsrf } from '@/lib/csrf'
import { projectSchema } from '@/lib/validators'
import { deleteProjectImages } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteContext {
    params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, ctx: RouteContext) {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await ctx.params
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ project })
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!verifyCsrf(req)) return NextResponse.json({ error: 'CSRF invalid' }, { status: 403 })

    const { id } = await ctx.params

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
        const existing = await prisma.project.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        // Slug conflict check
        if (existing.slug !== data.slug) {
            const conflict = await prisma.project.findUnique({ where: { slug: data.slug } })
            if (conflict) return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 409 })
        }

        // Hapus gambar yang tidak dipakai lagi
        const oldImages = Array.isArray(existing.imageUrls) ? (existing.imageUrls as string[]) : []
        const newImages = data.imageUrls ?? []
        const removed = oldImages.filter(url => !newImages.includes(url))

        await prisma.project.update({
            where: { id },
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
                imageUrls: newImages,
            },
        })

        if (removed.length > 0) {
            await deleteProjectImages(removed)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Update project error:', err)
        return NextResponse.json({ error: 'Gagal memperbarui project' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!verifyCsrf(req)) return NextResponse.json({ error: 'CSRF invalid' }, { status: 403 })

    const { id } = await ctx.params

    try {
        const existing = await prisma.project.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const images = Array.isArray(existing.imageUrls) ? (existing.imageUrls as string[]) : []

        await prisma.project.delete({ where: { id } })
        if (images.length > 0) await deleteProjectImages(images)

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Delete project error:', err)
        return NextResponse.json({ error: 'Gagal menghapus project' }, { status: 500 })
    }
}
