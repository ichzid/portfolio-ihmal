import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_session'
const TOKEN_MAX_AGE = 60 * 60 * 8 // 8 jam

function getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET tidak dikonfigurasi (minimal 32 karakter).')
    }
    return new TextEncoder().encode(secret)
}

export interface SessionPayload {
    sub: string
    username: string
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
    return await new SignJWT({ username: payload.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime(`${TOKEN_MAX_AGE}s`)
        .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
        if (!payload.sub || typeof payload.username !== 'string') return null
        return { sub: payload.sub, username: payload.username }
    } catch {
        return null
    }
}

export async function setSessionCookie(token: string) {
    const store = await cookies()
    store.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: TOKEN_MAX_AGE,
    })
}

export async function clearSessionCookie() {
    const store = await cookies()
    store.delete(COOKIE_NAME)
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifySessionToken(token)
}

export async function getServerSession(): Promise<SessionPayload | null> {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifySessionToken(token)
}

export { COOKIE_NAME as SESSION_COOKIE_NAME, TOKEN_MAX_AGE }
