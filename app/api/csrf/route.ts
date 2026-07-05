import { NextResponse } from 'next/server'
import { ensureCsrfToken } from '@/lib/csrf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    const token = await ensureCsrfToken()
    return NextResponse.json({ token })
}
