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
    githubUrl?: string
    featured: boolean
    imageUrl?: string
    year?: string
    role?: string
    timeline?: string
    status?: string
}

export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data.map((p: any) => ({
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
        githubUrl: p.github_url,
        featured: p.featured,
        imageUrl: p.image_url || '/placeholder.png',
        year: p.year,
        role: p.role,
        timeline: p.timeline,
        status: p.status,
    })) as Project[]
}

export async function getFeaturedProjects() {
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

    return data.map((p: any) => ({
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
        githubUrl: p.github_url,
        featured: p.featured,
        imageUrl: p.image_url || '/placeholder.png',
        year: p.year,
        role: p.role,
        timeline: p.timeline,
        status: p.status,
    })) as Project[]
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

    if (!data) {
        return null
    }

    const p = data;
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
        githubUrl: p.github_url,
        featured: p.featured,
        imageUrl: p.image_url || '/placeholder.png',
        year: p.year,
        role: p.role,
        timeline: p.timeline,
        status: p.status,
    };
}
