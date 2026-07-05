import 'server-only'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import type { Project as PrismaProject } from '@prisma/client'
import type { Project } from '@/lib/project-types'

export type { Project } from '@/lib/project-types'

function mapProject(p: PrismaProject): Project {
    const techStack = Array.isArray(p.techStack) ? (p.techStack as string[]) : []
    const imageUrls = Array.isArray(p.imageUrls) ? (p.imageUrls as string[]) : []

    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        description: p.description,
        longDescription: p.longDescription ?? undefined,
        techStack,
        challenge: p.challenge ?? '',
        solution: p.solution ?? '',
        impact: p.impact ?? '',
        demoUrl: p.demoUrl ?? undefined,
        demoVideoUrl: p.demoVideoUrl ?? undefined,
        githubUrl: p.githubUrl ?? undefined,
        featured: p.featured,
        imageUrls,
        year: p.year ?? undefined,
        role: p.role ?? undefined,
        timeline: p.timeline ?? undefined,
        status: p.status ?? undefined,
    }
}

export const getProjects = cache(async (): Promise<Project[]> => {
    try {
        const data = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return data.map(mapProject)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return []
    }
})

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
    try {
        const data = await prisma.project.findMany({
            where: { featured: true },
            orderBy: { createdAt: 'desc' },
            take: 3,
        })
        return data.map(mapProject)
    } catch (error) {
        console.error('Error fetching featured projects:', error)
        return []
    }
})

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
    try {
        const data = await prisma.project.findUnique({
            where: { slug },
        })
        if (!data) return null
        return mapProject(data)
    } catch (error) {
        console.error('Error fetching project by slug:', error)
        return null
    }
})
