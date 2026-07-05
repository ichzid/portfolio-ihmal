import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionToken, setSessionCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validators'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const MAX_ATTEMPTS_PER_IP = 5
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000 // 15 menit
const LOCKOUT_ATTEMPTS = 10 // per IP dalam window untuk lockout DB
const LOCKOUT_WINDOW_MS = 60 * 60 * 1000 // 1 jam

export async function POST(req: NextRequest) {
    const ip = getClientIp(req.headers)

    // 1. Rate limit in-memory (per proses)
    const rl = rateLimit({
        key: `login:${ip}`,
        limit: MAX_ATTEMPTS_PER_IP,
        windowMs: ATTEMPT_WINDOW_MS,
    })
    if (!rl.ok) {
        return NextResponse.json(
            { error: 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.' },
            { status: 429 }
        )
    }

    // 2. Parse & validasi payload
    let payload: unknown
    try {
        payload = await req.json()
    } catch {
        return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 })
    }

    const parsed = loginSchema.safeParse(payload)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 })
    }

    const { username, password } = parsed.data

    try {
        // 3. Lockout check dari DB (persisten meskipun proses restart)
        const since = new Date(Date.now() - LOCKOUT_WINDOW_MS)
        const recentFailures = await prisma.loginAttempt.count({
            where: {
                ipAddress: ip,
                success: false,
                createdAt: { gte: since },
            },
        })
        if (recentFailures >= LOCKOUT_ATTEMPTS) {
            return NextResponse.json(
                { error: 'Akun/IP terkunci sementara karena terlalu banyak kegagalan.' },
                { status: 429 }
            )
        }

        // 4. Cari user (fallback ke env untuk bootstrap awal)
        const dbUser = await prisma.adminUser.findUnique({ where: { username } })
        const envUsername = process.env.ADMIN_USERNAME
        const envHash = process.env.ADMIN_PASSWORD_HASH

        let matched = false
        let userId = ''
        let matchedUsername = ''

        if (dbUser) {
            matched = await bcrypt.compare(password, dbUser.passwordHash)
            userId = dbUser.id
            matchedUsername = dbUser.username
        } else if (envUsername && envHash && username === envUsername) {
            matched = await bcrypt.compare(password, envHash)
            userId = 'env-admin'
            matchedUsername = envUsername
        } else {
            // Timing-safe fallback (mencegah user enumeration)
            await bcrypt.compare(password, '$2a$10$abcdefghijklmnopqrstuv')
        }

        // 5. Log percobaan
        await prisma.loginAttempt.create({
            data: { ipAddress: ip, success: matched },
        })

        if (!matched) {
            return NextResponse.json({ error: 'Kredensial tidak valid' }, { status: 401 })
        }

        // 6. Update lastLoginAt jika user dari DB
        if (dbUser) {
            await prisma.adminUser.update({
                where: { id: dbUser.id },
                data: { lastLoginAt: new Date() },
            })
        }

        // 7. Issue JWT
        const token = await createSessionToken({ sub: userId, username: matchedUsername })
        await setSessionCookie(token)

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Login error:', err)
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 })
    }
}
