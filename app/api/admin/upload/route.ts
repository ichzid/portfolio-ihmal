import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { verifyCsrf } from '@/lib/csrf'
import { saveProjectImage } from '@/lib/storage'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
    // 1. Auth
    const session = await getSessionFromRequest(req)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. CSRF
    if (!verifyCsrf(req)) {
        return NextResponse.json({ error: 'CSRF token tidak valid' }, { status: 403 })
    }

    // 3. Rate limit — 30 upload per 5 menit per user
    const ip = getClientIp(req.headers)
    const rl = rateLimit({
        key: `upload:${session.sub}:${ip}`,
        limit: 30,
        windowMs: 5 * 60 * 1000,
    })
    if (!rl.ok) {
        return NextResponse.json({ error: 'Terlalu banyak upload. Coba lagi nanti.' }, { status: 429 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file')
        const slug = String(formData.get('slug') || 'project')

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
        }

        const saved = await saveProjectImage(file, slug)
        return NextResponse.json({ success: true, image: saved })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload gagal' },
            { status: 400 }
        )
    }
}
