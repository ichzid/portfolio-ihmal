import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import NavigationFeedback from '@/components/NavigationFeedback'

// Self-hosted, preloaded, dan swap otomatis — hilangkan render-blocking
const syne = Syne({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800'],
    variable: '--font-syne',
    display: 'swap',
})

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-dm-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://ichmal.my.id'),
    title: 'Ihmal Al Azid | Full Stack Developer & AI Automation Engineer',
    description: 'Ihmal Al Azid is a Full Stack Developer and AI Automation Engineer based in West Jakarta, Indonesia, focused on backend architecture, REST API design, database optimization, and practical AI workflows with n8n, OpenAI, Gemini, and RAG.',
    keywords: ['Ihmal Al Azid', 'Full Stack Developer', 'AI Automation Engineer', 'Laravel', 'Next.js', 'Vue.js', 'TypeScript', 'n8n', 'RAG', 'Indonesia'],
    authors: [{ name: 'Ihmal Al Azid' }],
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
    openGraph: {
        title: 'Ihmal Al Azid | Full Stack Developer & AI Automation Engineer',
        description: 'Building scalable web applications, backend systems, and business-focused AI automation workflows from West Jakarta, Indonesia.',
        url: 'https://ichmal.my.id',
        siteName: 'Ihmal Al Azid Portfolio',
        type: 'website',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" className={`${syne.variable} ${dmSans.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ToastProvider>
                    <Suspense fallback={null}>
                        <NavigationFeedback />
                    </Suspense>
                    {children}
                    <Footer />
                    <ScrollToTopButton />
                </ToastProvider>
            </body>
        </html>
    )
}
