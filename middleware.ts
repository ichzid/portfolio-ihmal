import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/admin/login')) {
        const session = await getSessionFromRequest(request)
        if (session) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/admin')) {
        const session = await getSessionFromRequest(request)
        if (!session) {
            const loginUrl = new URL('/admin/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
