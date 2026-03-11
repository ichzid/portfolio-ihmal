import { supabase } from '@/lib/supabaseClient'

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
    imageUrls: string[]   // single source of truth for all images
    year?: string
    role?: string
    timeline?: string
    status?: string
}

function mapProject(p: any): Project {
    // Build imageUrls: prefer image_urls array, fallback to image_url if array empty
    let imageUrls: string[] = p.image_urls ?? []
    if (imageUrls.length === 0 && p.image_url) {
        imageUrls = [p.image_url]
    }

    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        description: p.description,
        longDescription: p.long_description,
        techStack: p.tech_stack || [],
        challenge: p.challenge,
        solution: p.solution,
        impact: p.impact,
        demoUrl: p.demo_url,
        demoVideoUrl: p.demo_video_url,
        githubUrl: p.github_url,
        featured: p.featured,
        imageUrls,
        year: p.year,
        role: p.role,
        timeline: p.timeline,
        status: p.status,
    }
}

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data.map(mapProject)
}

export async function getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

    if (error) {
        console.error('Error fetching featured projects:', error)
        return []
    }

    return data.map(mapProject)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching project by slug:', error)
        return null
    }

    if (!data) return null

    return mapProject(data)
}
