'use client'

import { useEffect, useState } from 'react'

interface ReliableImageProps {
    src: string
    alt: string
    className?: string
    style?: React.CSSProperties
    loading?: 'eager' | 'lazy'
    fallback?: React.ReactNode
    onLoad?: () => void
}

export default function ReliableImage({
    src,
    alt,
    className,
    style,
    loading = 'lazy',
    fallback,
    onLoad,
}: ReliableImageProps) {
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        setFailed(false)
    }, [src])

    if (failed) {
        return fallback ?? (
            <span style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Gambar tidak tersedia
            </span>
        )
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            loading={loading}
            decoding="async"
            onLoad={onLoad}
            onError={() => setFailed(true)}
        />
    )
}
