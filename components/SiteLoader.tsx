type SiteLoaderProps = {
    label?: string
    fullscreen?: boolean
    compact?: boolean
    className?: string
}

export default function SiteLoader({
    label = 'Loading page',
    fullscreen = false,
    compact = false,
    className = '',
}: SiteLoaderProps) {
    const classes = [
        'site-loader',
        fullscreen ? 'is-fullscreen' : '',
        compact ? 'is-compact' : '',
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={classes} role="status" aria-live="polite" aria-label={label}>
            <div className="site-loader-shell">
                <span className="site-loader-mark" aria-hidden="true">
                    <span className="site-loader-stem"></span>
                    <span className="site-loader-top"></span>
                    <span className="site-loader-dot"></span>
                    <span className="site-loader-ring"></span>
                </span>
                <span className="site-loader-copy">{label}</span>
            </div>
        </div>
    )
}
