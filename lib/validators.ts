import { z } from 'zod'

const urlOptional = z
    .string()
    .trim()
    .max(500)
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined))

export const projectSchema = z.object({
    title: z.string().trim().min(2).max(255),
    slug: z
        .string()
        .trim()
        .min(2)
        .max(255)
        .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.'),
    category: z.string().trim().min(2).max(100),
    description: z.string().trim().min(2).max(2000),
    longDescription: z.string().trim().max(20000).optional().or(z.literal('').transform(() => undefined)),
    techStack: z.array(z.string().trim().min(1).max(60)).max(50),
    challenge: z.string().trim().max(20000).optional().or(z.literal('').transform(() => undefined)),
    solution: z.string().trim().max(20000).optional().or(z.literal('').transform(() => undefined)),
    impact: z.string().trim().max(20000).optional().or(z.literal('').transform(() => undefined)),
    demoUrl: urlOptional,
    demoVideoUrl: urlOptional,
    githubUrl: urlOptional,
    featured: z.boolean().optional(),
    year: z.string().trim().max(20).optional().or(z.literal('').transform(() => undefined)),
    role: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
    timeline: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
    status: z.enum(['Live', 'In Progress', 'Archived', 'Draft']).optional(),
    imageUrls: z.array(z.string().trim().max(500)).max(20).optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>

export const loginSchema = z.object({
    username: z.string().trim().min(2).max(100),
    password: z.string().min(8).max(200),
})

export const contactSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    message: z.string().trim().min(10).max(5000),
    // honeypot — bot biasanya isi field tersembunyi
    website: z.string().max(0).optional().or(z.literal('')),
})

export type ContactInput = z.infer<typeof contactSchema>
