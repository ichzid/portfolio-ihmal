import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export const metadata: Metadata = {
    title: 'Ihmal Al Azid — Fullstack Developer',
    description: 'Ihmal Al Azid — Fullstack Developer Indonesia. Membangun produk digital yang scalable, performant, dan berdampak nyata. Spesialis React, Next.js, Node.js, dan TypeScript.',
    keywords: ['Fullstack Developer', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Indonesia', 'Portfolio', 'Web Developer'],
    authors: [{ name: 'Ihmal Al Azid' }],
    icons: {
        icon: '/favicon.png',
        apple: '/favicon.png',
    },
    openGraph: {
        title: 'Ihmal Al Azid — Fullstack Developer',
        description: 'Membangun produk digital yang scalable, performant, dan berdampak nyata.',
        type: 'website',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <head>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ToastProvider>
                    {children}
                    <Footer />
                    <ScrollToTopButton />
                </ToastProvider>
            </body>
        </html>
    )
}
