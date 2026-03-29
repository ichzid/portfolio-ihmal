import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import NavigationFeedback from '@/components/NavigationFeedback'

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
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ToastProvider>
                    <NavigationFeedback />
                    {children}
                    <Footer />
                    <ScrollToTopButton />
                </ToastProvider>
            </body>
        </html>
    )
}
