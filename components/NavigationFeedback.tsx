'use client'

import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import SiteLoader from '@/components/SiteLoader'

const SHOW_DELAY_MS = 120

export default function NavigationFeedback() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [visible, setVisible] = useState(false)
    const visibleRef = useRef(false)
    const showTimerRef = useRef<number | null>(null)
    const hideTimerRef = useRef<number | null>(null)
    const visibleSinceRef = useRef(0)

    const clearTimer = (timerRef: MutableRefObject<number | null>) => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    const startLoading = () => {
        clearTimer(hideTimerRef)

        if (visibleRef.current || showTimerRef.current !== null) {
            return
        }

        showTimerRef.current = window.setTimeout(() => {
            showTimerRef.current = null
            visibleSinceRef.current = Date.now()
            visibleRef.current = true
            setVisible(true)
        }, SHOW_DELAY_MS)
    }

    useEffect(() => {
        visibleRef.current = visible
    }, [visible])

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return
            }

            const target = event.target as HTMLElement | null
            const anchor = target?.closest('a[href]') as HTMLAnchorElement | null

            if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
                return
            }

            const rawHref = anchor.getAttribute('href')
            if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
                return
            }

            const nextUrl = new URL(anchor.href, window.location.href)
            const currentUrl = new URL(window.location.href)

            if (nextUrl.origin !== currentUrl.origin) {
                return
            }

            if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) {
                return
            }

            startLoading()
        }

        document.addEventListener('click', handleClick, true)

        return () => {
            document.removeEventListener('click', handleClick, true)
            clearTimer(showTimerRef)
            clearTimer(hideTimerRef)
        }
    }, [])

    useEffect(() => {
        // Segera sembunyikan loader saat route baru committed
        // agar tidak menghalangi Next.js scroll manager (menghindari warning "Skipping auto-scroll behavior").
        clearTimer(showTimerRef)
        clearTimer(hideTimerRef)
        if (visibleRef.current) {
            visibleRef.current = false
            setVisible(false)
        }
    }, [pathname, searchParams])

    if (!visible) {
        return null
    }

    return (
        <SiteLoader fullscreen label="Loading" />
    )
}
