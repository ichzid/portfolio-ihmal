import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
    try {
        // Ping MySQL dengan raw query super ringan
        await prisma.$queryRaw`SELECT 1`
        return NextResponse.json(
            {
                success: true,
                message: 'Database pinged successfully.',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Database ping error:', error?.message || error)
        return NextResponse.json(
            { success: false, message: 'Database ping failed' },
            { status: 500 }
        )
    }
}
