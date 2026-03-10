'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    delay?: 0 | 1 | 2
}

export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const delayClass = delay === 1 ? ' reveal-delay-1' : delay === 2 ? ' reveal-delay-2' : ''

    return (
        <div ref={ref} className={`reveal${delayClass}${className ? ' ' + className : ''}`}>
            {children}
        </div>
    )
}
