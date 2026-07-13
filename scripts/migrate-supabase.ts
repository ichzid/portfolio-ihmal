/**
 * Script migrasi data dari Supabase ke MySQL (via Prisma).
 *
 * Yang dilakukan:
 *   1. Fetch semua projects dari tabel `projects` di Supabase.
 *   2. Download setiap gambar di `image_urls` ke /public/uploads/projects/.
 *   3. Insert (upsert by slug) ke MySQL via Prisma.
 *   4. Fetch semua contact submissions dari `messages` (opsional).
 *
 * Prasyarat env:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY  (atau SUPABASE_SERVICE_ROLE untuk read-write)
 *   - DATABASE_URL (MySQL)
 *
 * Jalankan:  npm run migrate:supabase
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Env NEXT_PUBLIC_SUPABASE_URL / KEY tidak di-set.')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const prisma = new PrismaClient()

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'projects')
const PUBLIC_PREFIX = '/uploads/projects/'

async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true })
}

function safeSlug(input: string): string {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'img'
}

async function downloadImage(url: string, projectSlug: string): Promise<string | null> {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            console.warn(`  ! Gagal fetch ${url}: ${res.status}`)
            return null
        }
        const buf = Buffer.from(await res.arrayBuffer())
        const ext = (() => {
            const ct = res.headers.get('content-type') || ''
            if (ct.includes('png')) return 'png'
            if (ct.includes('webp')) return 'webp'
            if (ct.includes('avif')) return 'avif'
            const m = url.match(/\.(jpe?g|png|webp|avif)(\?|$)/i)
            if (m) return m[1].toLowerCase().replace('jpeg', 'jpg')
            return 'jpg'
        })()

        const random = crypto.randomBytes(6).toString('hex')
        const filename = `${safeSlug(projectSlug)}-${Date.now()}-${random}.${ext}`
        const filePath = path.join(UPLOAD_ROOT, filename)
        await fs.writeFile(filePath, buf, { mode: 0o644 })
        return `${PUBLIC_PREFIX}${filename}`
    } catch (err: any) {
        console.warn(`  ! Error download ${url}:`, err.message || err)
        return null
    }
}

async function migrateProjects() {
    console.log('→ Fetch projects dari Supabase...')
    const { data, error } = await supabase.from('projects').select('*').order('created_at')
    if (error) throw error
    if (!data) {
        console.log('  Tidak ada data projects.')
        return
    }
    console.log(`  Ditemukan ${data.length} projects.`)

    await ensureDir(UPLOAD_ROOT)

    for (const row of data) {
        console.log(`\n→ Migrate: ${row.title} (${row.slug})`)

        const oldUrls: string[] = Array.isArray(row.image_urls)
            ? row.image_urls
            : row.image_url
                ? [row.image_url]
                : []

        const newUrls: string[] = []
        for (const url of oldUrls) {
            // Kalau sudah relatif lokal, skip
            if (url.startsWith('/')) {
                newUrls.push(url)
                continue
            }
            const local = await downloadImage(url, row.slug)
            if (local) newUrls.push(local)
        }

        const techStack: string[] = Array.isArray(row.tech_stack)
            ? row.tech_stack
            : typeof row.tech_stack === 'string'
                ? row.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
                : []

        await prisma.project.upsert({
            where: { slug: row.slug },
            create: {
                title: row.title,
                slug: row.slug,
                category: row.category || 'Web Systems',
                description: row.description || '',
                longDescription: row.long_description || null,
                techStack,
                challenge: row.challenge || null,
                solution: row.solution || null,
                impact: row.impact || null,
                demoUrl: row.demo_url || null,
                demoVideoUrl: row.demo_video_url || null,
                githubUrl: row.github_url || null,
                featured: !!row.featured,
                imageUrls: newUrls,
            },
            update: {
                title: row.title,
                category: row.category || 'Web Systems',
                description: row.description || '',
                longDescription: row.long_description || null,
                techStack,
                challenge: row.challenge || null,
                solution: row.solution || null,
                impact: row.impact || null,
                demoUrl: row.demo_url || null,
                demoVideoUrl: row.demo_video_url || null,
                githubUrl: row.github_url || null,
                featured: !!row.featured,
                imageUrls: newUrls,
            },
        })
        console.log(`  ✓ Sukses (${newUrls.length} gambar).`)
    }
}

async function migrateMessages() {
    console.log('\n→ Fetch messages dari Supabase (opsional)...')
    const { data, error } = await supabase.from('messages').select('*').order('created_at')
    if (error) {
        console.log('  (skip) Tabel messages tidak ditemukan:', error.message)
        return
    }
    if (!data || data.length === 0) {
        console.log('  Tidak ada messages.')
        return
    }
    console.log(`  Ditemukan ${data.length} messages.`)
    for (const row of data) {
        await prisma.contactSubmission.create({
            data: {
                name: row.name || 'unknown',
                email: row.email || 'unknown@example.com',
                message: row.message || '',
                ipAddress: row.ip_address || 'migrated',
                createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            },
        })
    }
    console.log(`  ✓ Sukses migrasi ${data.length} messages.`)
}

async function main() {
    console.log('=== Migrasi Supabase → MySQL ===\n')
    await migrateProjects()
    await migrateMessages()
    console.log('\n✓ Migrasi selesai.')
}

main()
    .catch(err => {
        console.error('Migrasi gagal:', err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
