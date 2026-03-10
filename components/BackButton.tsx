'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BackButton({ href, children }: { href?: string, children?: React.ReactNode }) {
    const router = useRouter()

    const content = (
        <>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {children || 'Back'}
        </>
    )

    const commonProps = {
        className: "back-link",
        style: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
        }
    }

    if (href) {
        return (
            <Link href={href} {...commonProps}>
                {content}
            </Link>
        )
    }

    return (
        <button onClick={() => router.back()} {...commonProps}>
            {content}
        </button>
    )
}
