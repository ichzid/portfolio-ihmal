import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validators'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { verifyCsrf } from '@/lib/csrf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Batasan: 3 pesan per IP per 10 menit, 20 per IP per 24 jam
const SHORT_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 }
const DAILY_LIMIT = { limit: 20, windowMs: 24 * 60 * 60 * 1000 }

// Sanitize sederhana: hilangkan karakter kontrol berbahaya
function sanitize(text: string): string {
    return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
}

export async function POST(req: NextRequest) {
    const ip = getClientIp(req.headers)

    // CSRF wajib
    if (!verifyCsrf(req)) {
        return NextResponse.json({ error: 'CSRF token tidak valid' }, { status: 403 })
    }

    // Rate limit in-memory (fast path)
    const short = rateLimit({ key: `contact:short:${ip}`, ...SHORT_LIMIT })
    if (!short.ok) {
        return NextResponse.json(
            { error: 'Terlalu banyak pesan. Coba lagi nanti.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((short.resetAt - Date.now()) / 1000)) } }
        )
    }
    const daily = rateLimit({ key: `contact:day:${ip}`, ...DAILY_LIMIT })
    if (!daily.ok) {
        return NextResponse.json(
            { error: 'Batas harian pesan tercapai.' },
            { status: 429 }
        )
    }

    // Parse & validasi payload
    let payload: unknown
    try {
        payload = await req.json()
    } catch {
        return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 })
    }

    const parsed = contactSchema.safeParse(payload)
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Data tidak valid', issues: parsed.error.flatten() },
            { status: 400 }
        )
    }

    const data = parsed.data

    // Honeypot: jika field 'website' terisi → bot, respons OK palsu
    if (data.website && data.website.length > 0) {
        return NextResponse.json({ success: true }, { status: 200 })
    }

    // Cek quota DB-backed: max 5 pesan / IP / 24 jam
    try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const count = await prisma.contactSubmission.count({
            where: { ipAddress: ip, createdAt: { gte: since } },
        })
        if (count >= 5) {
            return NextResponse.json(
                { error: 'Batas harian pesan tercapai.' },
                { status: 429 }
            )
        }

        await prisma.contactSubmission.create({
            data: {
                name: sanitize(data.name),
                email: sanitize(data.email),
                message: sanitize(data.message),
                ipAddress: ip,
            },
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error('Contact submission error:', err)
        return NextResponse.json({ error: 'Gagal mengirim pesan' }, { status: 500 })
    }
}
