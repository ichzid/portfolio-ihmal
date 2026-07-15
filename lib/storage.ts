import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

// Uploads disimpan di folder permanen di luar repo jika UPLOAD_DIR tersedia.
// Production recommendation: UPLOAD_DIR=/www/wwwroot/portfolio-uploads
// URL publik tetap: /uploads/projects/<file>
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')
const PROJECTS_DIR = path.join(UPLOAD_ROOT, 'projects')
const PUBLIC_PREFIX = '/uploads/projects/'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_DIMENSION = 2400 // px

export interface SavedImage {
    url: string
    width: number
    height: number
    bytes: number
}

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

export async function saveProjectImage(
    file: File,
    projectSlug: string
): Promise<SavedImage> {
    if (!ALLOWED_MIME.has(file.type)) {
        throw new Error(`Format file tidak didukung: ${file.type}`)
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Ukuran file melebihi ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB`)
    }

    await ensureDir(PROJECTS_DIR)

    const buffer = Buffer.from(await file.arrayBuffer())

    // Validasi header sebenarnya via sharp (mencegah MIME spoofing)
    const image = sharp(buffer, { failOn: 'error' })
    const meta = await image.metadata()
    if (!meta.format || !['jpeg', 'png', 'webp', 'avif'].includes(meta.format)) {
        throw new Error('File bukan gambar valid.')
    }

    // Resize + convert ke WebP untuk hemat storage & bandwidth
    const processed = await image
        .rotate() // auto-orient dari EXIF
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true })

    const random = crypto.randomBytes(6).toString('hex')
    const filename = `${safeSlug(projectSlug)}-${Date.now()}-${random}.webp`
    const filePath = path.join(PROJECTS_DIR, filename)

    await fs.writeFile(filePath, processed.data, { mode: 0o644 })

    return {
        url: `${PUBLIC_PREFIX}${filename}`,
        width: processed.info.width,
        height: processed.info.height,
        bytes: processed.info.size,
    }
}

export async function deleteProjectImage(url: string): Promise<void> {
    if (!url || !url.startsWith(PUBLIC_PREFIX)) return
    const filename = path.basename(url)
    // Cegah path traversal
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) return
    const filePath = path.join(PROJECTS_DIR, filename)
    try {
        await fs.unlink(filePath)
    } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
            console.error('Failed to delete image:', filePath, error)
        }
    }
}

export async function deleteProjectImages(urls: string[]): Promise<void> {
    await Promise.all(urls.map(u => deleteProjectImage(u)))
}
