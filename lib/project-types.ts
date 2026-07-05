// Tipe Project client-safe (tidak import Prisma sama sekali).
// Boleh diimport dari client component.
export interface Project {
    id: string
    title: string
    slug: string
    category: string
    description: string
    longDescription?: string
    techStack: string[]
    challenge: string
    solution: string
    impact: string
    demoUrl?: string
    demoVideoUrl?: string
    githubUrl?: string
    featured: boolean
    imageUrls: string[]
    year?: string
    role?: string
    timeline?: string
    status?: string
}
